import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Cliente único do Supabase (site estático: roda no navegador e no build).
// A chave publicável é segura no front; quem limita o acesso é a RLS.
// Sem as variáveis (projeto ainda não criado), devolve null e quem chama
// segue sem Supabase.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient<Database> | null | undefined;

export function getSupabase(): SupabaseClient<Database> | null {
  if (client !== undefined) return client;
  client =
    url && key
      ? createClient<Database>(url, key, {
          // Sessão só faz sentido no navegador (admin); no build, nada persiste.
          auth: { persistSession: typeof window !== "undefined", autoRefreshToken: typeof window !== "undefined" },
        })
      : null;
  return client;
}
