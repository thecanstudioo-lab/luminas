-- ============================================================================
-- LUMINAS — Esquema de base de datos (Supabase / Postgres 17)
-- Spa premium en Bogotá. Listo para Zapier (UUID, timestamps, Realtime, logs).
--
-- Proyecto: Luminas (oecgxjpheetyxaffmdwy)
-- Aplicado vía migraciones; este archivo es el script consolidado equivalente,
-- listo para copiar/pegar en el SQL Editor de Supabase sobre una DB vacía.
--
-- Decisiones: sin `user_credits` (no aplica al spa); `bookings` enlaza a `services`
-- y soporta reservas de invitado (user_id NULLABLE + datos de contacto) porque el
-- frontend reserva sin login a través de la RPC `create_booking`.
-- ============================================================================

-- 1 · FUNCIÓN updated_at -----------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- 2 · TABLAS -----------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  neighborhood text,
  address text not null,
  city text not null default 'Bogotá',
  image_url text,
  hours text,
  open_days int[] not null default '{1,2,3,4,5,6}',  -- 0=dom … 6=sáb
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('masajes','faciales','corporales','rituales')),
  tagline text,
  description text,
  duration_min int not null,
  price_cop int not null,
  image_url text,
  benefits text[] not null default '{}',
  ritual jsonb not null default '[]',
  featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  location_id uuid not null references public.locations(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  appointment_date date not null,
  time_slot text not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','cancelled','completed')),
  guest_name text,
  guest_email text,
  guest_phone text,
  notes text,
  confirmation_code text unique
    default ('LUM-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_contact_chk
    check (user_id is not null or (guest_name is not null and guest_email is not null))
);

-- Anti doble-reserva: única (sede, fecha, hora) salvo canceladas.
create unique index bookings_unique_slot
  on public.bookings (location_id, appointment_date, time_slot)
  where status <> 'cancelled';
create index bookings_user_idx     on public.bookings(user_id);
create index bookings_loc_date_idx on public.bookings(location_id, appointment_date);
create index bookings_service_idx  on public.bookings(service_id);
create index bookings_status_idx   on public.bookings(status);

create table public.zapier_webhook_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending','success','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3 · TRIGGERS ---------------------------------------------------------------
create trigger trg_profiles_updated  before update on public.profiles            for each row execute function public.set_updated_at();
create trigger trg_locations_updated before update on public.locations           for each row execute function public.set_updated_at();
create trigger trg_services_updated  before update on public.services            for each row execute function public.set_updated_at();
create trigger trg_bookings_updated  before update on public.bookings            for each row execute function public.set_updated_at();
create trigger trg_zapier_updated    before update on public.zapier_webhook_logs for each row execute function public.set_updated_at();

-- Auto-perfil al registrarse (sin user_credits)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Log de eventos para Zapier (booking.created / booking.<status> / booking.updated)
create or replace function public.log_booking_event() returns trigger
language plpgsql security definer set search_path = public as $$
declare ev text;
begin
  if tg_op = 'INSERT' then ev := 'booking.created';
  elsif new.status is distinct from old.status then ev := 'booking.' || new.status;
  else ev := 'booking.updated';
  end if;
  insert into public.zapier_webhook_logs(event_type, payload, status)
  values (ev, to_jsonb(new), 'pending');
  return new;
end; $$;
create trigger trg_booking_event
  after insert or update on public.bookings
  for each row execute function public.log_booking_event();

-- Las funciones de trigger no se exponen como RPC (los triggers no lo requieren).
revoke execute on function public.handle_new_user()   from public, anon, authenticated;
revoke execute on function public.log_booking_event() from public, anon, authenticated;

-- 4 · RLS --------------------------------------------------------------------
-- Helper sin recursión: SECURITY DEFINER lee profiles saltando RLS.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles            enable row level security;
alter table public.locations           enable row level security;
alter table public.services            enable row level security;
alter table public.bookings            enable row level security;
alter table public.zapier_webhook_logs enable row level security;

-- profiles: dueño o admin
create policy profiles_select      on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update      on public.profiles for update using (id = auth.uid() or public.is_admin())
                                                                with check (id = auth.uid() or public.is_admin());
create policy profiles_admin_write on public.profiles for insert with check (public.is_admin());
create policy profiles_admin_del   on public.profiles for delete using (public.is_admin());

-- locations / services: lectura pública (activos), escritura solo admin
create policy locations_read  on public.locations for select using (is_active or public.is_admin());
create policy locations_write on public.locations for all using (public.is_admin()) with check (public.is_admin());
create policy services_read   on public.services  for select using (is_active or public.is_admin());
create policy services_write  on public.services  for all using (public.is_admin()) with check (public.is_admin());

-- bookings: dueño o admin (alta pública vía RPC create_booking)
create policy bookings_select    on public.bookings for select using (user_id = auth.uid() or public.is_admin());
create policy bookings_insert    on public.bookings for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin());
create policy bookings_update    on public.bookings for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy bookings_admin_del on public.bookings for delete using (public.is_admin());

-- zapier_webhook_logs: solo admin (alta vía trigger security-definer)
create policy zapier_admin_all on public.zapier_webhook_logs for all
  using (public.is_admin()) with check (public.is_admin());

-- 5 · REALTIME ---------------------------------------------------------------
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.zapier_webhook_logs;

-- 6 · RPC create_booking (invitado + autenticado; valida cupo) ---------------
create or replace function public.create_booking(
  p_service_id uuid, p_location_id uuid, p_date date, p_time_slot text,
  p_name text, p_email text, p_phone text, p_notes text default null
) returns public.bookings
language plpgsql security definer set search_path = public as $$
declare rec public.bookings;
begin
  insert into public.bookings(user_id, service_id, location_id, appointment_date,
                              time_slot, guest_name, guest_email, guest_phone, notes, status)
  values (auth.uid(), p_service_id, p_location_id, p_date, p_time_slot,
          p_name, p_email, p_phone, p_notes, 'pending')
  returning * into rec;
  return rec;
exception when unique_violation then
  raise exception 'SLOT_TAKEN' using hint = 'Esa franja ya fue reservada';
end; $$;
grant execute on function public.create_booking(uuid,uuid,date,text,text,text,text,text) to anon, authenticated;

-- 7 · SEED (3 sedes + 8 servicios — espejo de lib/data/*) --------------------
insert into public.locations (slug, name, neighborhood, address, city, image_url, hours, open_days, phone) values
('norte-usaquen','Sede Norte','Usaquén','Carrera 6 # 119-30','Bogotá','https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=80','Lun–Sáb · 09:00–19:00','{1,2,3,4,5,6}','+57 601 123 4567'),
('poblado-chico','Sede Poblado','Chicó','Calle 93 # 11-27','Bogotá','https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=80','Lun–Dom · 09:00–19:00','{0,1,2,3,4,5,6}','+57 601 234 5678'),
('zona-g-quinta-camacho','Sede Zona G','Quinta Camacho','Carrera 7 # 70-40','Bogotá','https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80','Lun–Sáb · 09:00–19:00','{1,2,3,4,5,6}','+57 601 345 6789');

insert into public.services (slug, name, category, tagline, description, duration_min, price_cop, image_url, benefits, ritual, featured) values
('masaje-de-tejido-profundo','Masaje de Tejido Profundo','masajes','Presión firme y sostenida para descontracturar la musculatura profunda.','Una sesión enfocada en las capas más profundas del músculo y la fascia. Ideal para quienes acumulan tensión por estrés o postura. Nuestros terapeutas trabajan con presión progresiva y aceites tibios para devolver movilidad y aliviar el dolor crónico.',80,290000,'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80',array['Alivia contracturas y dolor crónico','Mejora la movilidad articular','Reduce el estrés acumulado'],'[{"title":"Recibimiento","detail":"Infusión cálida y diagnóstico corporal personalizado."},{"title":"Terapia","detail":"Presión profunda progresiva con aceite de árnica tibio."},{"title":"Cierre","detail":"Hidratación, reposo y recomendación post-sesión."}]'::jsonb,true),
('masaje-con-piedras-calientes','Masaje con Piedras Calientes','masajes','Calor mineral que funde la tensión y equilibra la energía.','Piedras volcánicas a temperatura controlada se deslizan sobre los puntos de tensión, combinando calor envolvente con maniobras suaves. Una experiencia profundamente relajante que mejora la circulación.',90,320000,'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',array['Relajación profunda inmediata','Estimula la circulación','Equilibra el sistema nervioso'],'[{"title":"Recibimiento","detail":"Aromaterapia de bienvenida y respiración guiada."},{"title":"Terapia","detail":"Piedras volcánicas tibias sobre meridianos de tensión."},{"title":"Cierre","detail":"Té de hierbas y espacio de descanso."}]'::jsonb,false),
('facial-luminosidad-lumina','Facial Luminosidad Lumina','faciales','Nuestro protocolo insignia para una piel radiante y descansada.','Un facial completo con limpieza profunda, exfoliación enzimática, masaje de drenaje facial y mascarilla de vitamina C. Diseñado para revelar luminosidad inmediata y una piel visiblemente más firme.',70,250000,'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',array['Luminosidad visible inmediata','Estimula la producción de colágeno','Drena y desinflama el rostro'],'[{"title":"Diagnóstico","detail":"Análisis de piel con luz cálida y limpieza profunda."},{"title":"Tratamiento","detail":"Exfoliación enzimática + masaje de drenaje facial."},{"title":"Sellado","detail":"Mascarilla de vitamina C y protección final."}]'::jsonb,true),
('hidratacion-facial-profunda','Hidratación Facial Profunda','faciales','Reservorio de humedad para pieles deshidratadas y opacas.','Un tratamiento de rescate con ácido hialurónico, sérum nutritivo y mascarilla de colágeno. Devuelve elasticidad, suaviza líneas finas y deja la piel sedosa.',60,220000,'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80',array['Hidratación intensa y duradera','Suaviza líneas finas','Restaura la elasticidad'],'[{"title":"Limpieza","detail":"Doble limpieza y tonificación equilibrante."},{"title":"Infusión","detail":"Ácido hialurónico y sérum nutritivo en capas."},{"title":"Mascarilla","detail":"Velo de colágeno y masaje relajante."}]'::jsonb,false),
('exfoliacion-corporal-mineral','Exfoliación Corporal Mineral','corporales','Sales del Pacífico que renuevan la piel de pies a cabeza.','Una exfoliación corporal completa con sales minerales y aceites esenciales que elimina células muertas, activa la circulación y deja la piel suave, luminosa y profundamente hidratada.',60,210000,'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',array['Renueva y suaviza la piel','Activa la microcirculación','Hidratación de cierre'],'[{"title":"Preparación","detail":"Ducha aromática y cepillado en seco."},{"title":"Exfoliación","detail":"Sales minerales con aceites esenciales cítricos."},{"title":"Nutrición","detail":"Manto hidratante de manteca de karité."}]'::jsonb,false),
('envoltura-detox-de-arcilla','Envoltura Detox de Arcilla','corporales','Arcilla termal que desintoxica y reafirma la silueta.','Una envoltura corporal de arcilla termal rica en minerales que ayuda a eliminar toxinas, reducir la retención de líquidos y reafirmar la piel. Termina con una hidratación profunda.',75,260000,'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',array['Efecto detox y reafirmante','Reduce retención de líquidos','Mineraliza la piel'],'[{"title":"Activación","detail":"Exfoliación ligera para abrir los poros."},{"title":"Envoltura","detail":"Arcilla termal mineral y reposo envolvente."},{"title":"Cierre","detail":"Drenaje suave e hidratación reafirmante."}]'::jsonb,false),
('ritual-lumina-completo','Ritual Lumina Completo','rituales','Tres horas de desconexión total: cuerpo, rostro y sentidos.','Nuestra experiencia más completa: comienza con un baño aromático, continúa con exfoliación corporal, masaje relajante de cuerpo entero y culmina con nuestro facial insignia. Una jornada diseñada para reiniciar por completo.',180,580000,'https://images.unsplash.com/photo-1610501669174-f24ed00cb12?auto=format&fit=crop&w=1200&q=80',array['Experiencia integral de cuerpo y rostro','Desconexión profunda de 3 horas','Incluye baño aromático y refrigerio'],'[{"title":"Inmersión","detail":"Baño aromático y respiración guiada."},{"title":"Cuerpo","detail":"Exfoliación mineral + masaje relajante completo."},{"title":"Rostro","detail":"Facial Luminosidad Lumina y reposo final."}]'::jsonb,true),
('ritual-en-pareja','Ritual en Pareja','rituales','Una experiencia compartida en una suite privada.','Diseñado para dos, en una suite privada con masaje relajante simultáneo, aromaterapia y una copa de cortesía. El plan perfecto para celebrar o simplemente reconectar.',110,520000,'https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=1200&q=80',array['Suite privada para dos','Masaje simultáneo','Copa y refrigerio de cortesía'],'[{"title":"Bienvenida","detail":"Suite privada, aromaterapia y brindis de cortesía."},{"title":"Masaje","detail":"Masaje relajante simultáneo para ambos."},{"title":"Reposo","detail":"Espacio íntimo de descanso compartido."}]'::jsonb,false);
