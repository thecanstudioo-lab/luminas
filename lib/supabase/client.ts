import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para el navegador (componentes cliente).
 * Usa la publishable/anon key — todo el acceso está protegido por RLS.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
