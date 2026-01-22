import { getSupabaseClient, createServerSupabaseClient } from "@/lib/supabase"

export type Profile = {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

// Função para obter o perfil do usuário atual (client-side)
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()

  if (error || !data) {
    console.error("Erro ao obter perfil:", error)
    return null
  }

  return data as Profile
}

// Função para atualizar o perfil do usuário atual (client-side)
export async function updateProfile(profile: Partial<Profile>): Promise<{ success: boolean; error: any }> {
  const supabase = getSupabaseClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) return { success: false, error: "Usuário não autenticado" }

  const { error } = await supabase.from("profiles").update(profile).eq("id", user.user.id)

  return { success: !error, error }
}

// Função para obter o perfil do usuário (server-side)
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error || !data) {
    console.error("Erro ao obter perfil:", error)
    return null
  }

  return data as Profile
}

// Função para verificar se o usuário é administrador (server-side)
export async function isAdmin(): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return data?.role === "admin"
}

// Função para listar todos os usuários (apenas para admins)
export async function listUsers(): Promise<Profile[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao listar usuários:", error)
    return []
  }

  return data as Profile[]
}
