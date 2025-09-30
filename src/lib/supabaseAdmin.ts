import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,         // ya lo tenés
    process.env.SUPABASE_SERVICE_ROLE_KEY!,        // 👈 agregar en .env.local
    { auth: { autoRefreshToken: false, persistSession: false } }
);
