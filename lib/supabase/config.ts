/**
 * Config pública de Supabase. La URL y la publishable key están DISEÑADAS para
 * exponerse en el cliente (todo el acceso está protegido por RLS), por eso es seguro
 * traerlas como fallback. Se pueden sobreescribir con variables de entorno en Vercel.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://oecgxjpheetyxaffmdwy.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_AoKecI48zskeCe_AJT-NBw_wue1u0O2";
