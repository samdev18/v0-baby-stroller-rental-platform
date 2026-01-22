import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Variáveis de ambiente para conexão com o Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export { createClient } from "@supabase/supabase-js"

// Cliente Supabase para componentes do servidor
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  })
}

// Cliente Supabase para componentes do cliente
// Usamos uma variável para armazenar a instância do cliente e evitar recriá-lo a cada renderização
let clientInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (clientInstance) return clientInstance

  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return clientInstance
}
