import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para Server Components / código de servidor.
 * Sin sesión persistida (lecturas públicas anónimas; protegido por RLS).
 */
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
