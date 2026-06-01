import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Cliente Supabase para el navegador (componentes cliente).
 * Usa la publishable/anon key — todo el acceso está protegido por RLS.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
