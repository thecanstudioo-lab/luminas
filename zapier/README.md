# Zaps de Luminas — guía de armado

El backend dispara un webhook a Zapier en cada evento de reserva, con **enrutado por tipo de
evento**: cada `event_type` puede ir a su **propio Zap de línea recta** (sin Paths). Así evitamos
la fricción de publicar Zaps con Paths.

## Cómo funciona el enrutado
La función `dispatch_zapier_webhook` resuelve la URL así:
1. Busca en Vault el secreto `zapier_url_<event_type>` (p.ej. `zapier_url_booking.confirmed`).
2. Si no existe, usa el secreto por defecto **`zapier_booking_webhook_url`**.

Hoy solo está configurado el **default** → todos los eventos llegan al **Zap principal (creación)**.

## Estado actual
| Evento | Estado | Zap |
|---|---|---|
| `booking.created` | ✅ **LIVE en producción** | Catch Hook → Google Calendar → Gmail (HTML) |
| `booking.confirmed` | 🟡 backend listo, falta crear el Zap | Catch Hook → Gmail (`confirmed-email.html`) |
| `booking.cancelled` | ✅ backend + página `/cancelar` listos y probados | Zap de cancelación pendiente de crear |

WhatsApp: **descartado** por ahora (requiere WhatsApp Business). Solo correo.

## Payload (los campos llegan bajo `data.*`)
```
event_type   booking.created | booking.confirmed | booking.cancelled
data.confirmation_code   LUM-XXXXXX
data.status              pending | confirmed | cancelled
data.service             Facial Luminosidad Lumina
data.service_duration_min / data.service_price_cop
data.location / data.location_address / data.location_city
data.appointment_date / data.time_slot
data.appointment_start / data.appointment_end / data.timezone (America/Bogota)
data.guest_name / data.guest_email / data.guest_phone / data.notes
```

---

## ⭐ Recomendación para el Zap principal (creación) — IMPORTANTE
Tu Zap de creación hoy se dispara con CUALQUIER evento que caiga en el default. Para que NO se
ejecute por error con `confirmed`/`cancelled`, añade al inicio un **Filter** (no es un Path, no
da fricción):
> **Filter by Zapier** → *Only continue if…* → `event_type` **(Text) Exactly matches** `booking.created`

---

## 🆕 Zap de confirmación — `booking.confirmed`
Cuando el spa **acepta** una cita, el backend emite `booking.confirmed`. Para enviarle al cliente
el correo de confirmación:

1. En Zapier crea un **Zap nuevo** (línea recta):
   - **Trigger**: Webhooks by Zapier · **Catch Hook** → copia la **nueva** Custom Webhook URL.
   - **Action**: Gmail · **Send Email**
     | Campo | Valor |
     |---|---|
     | To | `{{data__guest_email}}` |
     | Subject | `Tu cita en Luminas está confirmada — {{data__confirmation_code}}` |
     | Body Type | **HTML** |
     | Body | pega **`confirmed-email.html`** y mapea los `{{campos}}` desde `data.*` |
   - *(Opcional)* añade un **Filter**: *Only continue if* `event_type` Exactly matches `booking.confirmed`.
2. **Pásame esa nueva URL** y la enruto en el backend:
   ```sql
   select vault.create_secret('NUEVA_URL_DEL_ZAP_CONFIRMED', 'zapier_url_booking.confirmed', 'Zap de confirmación');
   ```
   A partir de ahí, los `booking.confirmed` van SOLO a ese Zap (y dejan de caer en el principal).

## ¿Cómo confirma el spa una cita?
Cualquiera de estas dispara el webhook `booking.confirmed`:
- **RPC (backoffice / service_role)**: `select public.set_booking_status('LUM-XXXXXX', 'confirmed');`
- **Supabase Table Editor**: cambiar `status` de la fila a `confirmed`.

*(El mismo `set_booking_status` admite `completed`. `cancelled` también existe a nivel de datos,
pero el flujo de cancalación de cara al cliente está EN PAUSA hasta que se construya su backend.)*

---

## 🆕 Cancelación — `booking.cancelled` (backend listo)
El cliente cancela **sin login** desde la página `/cancelar?code=LUM-XXXX&token=<cancel_token>`.
El token (capability de alta entropía) viaja solo en el enlace; los correos ya lo incluyen como
botón **"Cancelar o reagendar"** → `{{cancel_url}}` (campo `data.cancel_url`). Al cancelar:
`cancel_booking` verifica el token, marca `cancelled`, **libera el cupo** (el índice único lo
excluye) y dispara `booking.cancelled`.

Para que el enlace sea absoluto en los correos, guarda la URL pública del sitio en Vault:
```sql
select vault.create_secret('https://TU-DOMINIO', 'public_site_url', 'Origen público del sitio');
```

**Zap de cancelación (cuando quieras notificar la cancelación):**
1. Crea un Zap de línea recta: **Catch Hook → Gmail** (correo "tu cita fue cancelada").
   *(Opcional Filter: `event_type` Exactly matches `booking.cancelled`.)*
2. Pásame la URL → la enruto: `select vault.create_secret('URL','zapier_url_booking.cancelled','Zap cancelación');`

RPCs (anon, protegidas por token): `get_booking_by_token(code, token)` (lectura) ·
`cancel_booking(code, token)` (cancela). `set_booking_status(code, status)` sigue siendo solo service_role.

## Archivos
- `confirmation-email.html` — correo de **creación** (ya en producción).
- `confirmed-email.html` — correo de **confirmación por el spa** (nuevo).

## Operación / debug
- Estado de envíos: `select event_type, status, request_id, last_error from zapier_webhook_logs order by created_at desc;`
- Respuesta HTTP de Zapier: `net._http_response` (join por `request_id`).
- Reintentos automáticos: pg_cron `retry-zapier-webhooks` cada 5 min reenvía `pending`/`failed`.
- Cambiar URL default: `select vault.update_secret((select id from vault.secrets where name='zapier_booking_webhook_url'), 'NUEVA_URL');`
