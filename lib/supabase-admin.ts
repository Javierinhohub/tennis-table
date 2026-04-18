import { createClient } from "@supabase/supabase-js"

// Client avec la clé service_role (serveur uniquement — jamais exposé au navigateur)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
