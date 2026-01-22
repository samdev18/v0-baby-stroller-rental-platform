import { createServerSupabaseClient, getSupabaseClient } from "@/lib/supabase"

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  document_type: "cpf" | "passport"
  document: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  hotel?: string
  notes?: string
  is_vip: boolean
  receive_promotions: boolean
  created_at?: string
  updated_at?: string
}

export type ClientFormData = Omit<Client, "id" | "created_at" | "updated_at">

export async function listClients() {
  try {
    console.log("🔍 Iniciando busca de clientes no Supabase")
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("clients").select("*").order("name")

    if (error) {
      console.error("❌ Erro ao buscar clientes:", error)
      throw new Error(`Error fetching clients: ${error.message}`)
    }

    console.log(`✅ Encontrados ${data?.length || 0} clientes no banco de dados`)
    return data as Client[]
  } catch (error) {
    console.error("❌ Erro ao listar clientes:", error)
    // Retornar array vazio em caso de erro
    return []
  }
}

export async function getClientById(id: string) {
  try {
    console.log(`🔍 Buscando cliente com ID ${id} no Supabase`)
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

    if (error) {
      console.error(`❌ Erro ao buscar cliente com ID ${id}:`, error)
      throw new Error(`Error fetching client: ${error.message}`)
    }

    console.log(`✅ Cliente encontrado:`, data)
    return data as Client
  } catch (error) {
    console.error(`❌ Erro ao buscar cliente com ID ${id}:`, error)
    return null
  }
}

export async function createClient(clientData: ClientFormData) {
  try {
    console.log("🔍 Criando novo cliente no Supabase:", clientData)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("clients").insert([clientData]).select()

    if (error) {
      console.error("❌ Erro ao criar cliente:", error)
      throw new Error(`Error creating client: ${error.message}`)
    }

    console.log("✅ Cliente criado com sucesso:", data?.[0])
    return data[0] as Client
  } catch (error) {
    console.error("❌ Erro ao criar cliente:", error)
    throw error
  }
}

export async function updateClient(id: string, clientData: Partial<ClientFormData>) {
  try {
    console.log(`🔍 Atualizando cliente ${id} no Supabase:`, clientData)
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("clients")
      .update({
        ...clientData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error(`❌ Erro ao atualizar cliente ${id}:`, error)
      throw new Error(`Error updating client: ${error.message}`)
    }

    console.log(`✅ Cliente ${id} atualizado com sucesso:`, data?.[0])
    return data[0] as Client
  } catch (error) {
    console.error(`❌ Erro ao atualizar cliente ${id}:`, error)
    throw error
  }
}

export async function deleteClient(id: string) {
  try {
    console.log(`🔍 Excluindo cliente ${id} do Supabase`)
    const supabase = getSupabaseClient()

    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) {
      console.error(`❌ Erro ao excluir cliente ${id}:`, error)
      throw new Error(`Error deleting client: ${error.message}`)
    }

    console.log(`✅ Cliente ${id} excluído com sucesso`)
    return true
  } catch (error) {
    console.error(`❌ Erro ao excluir cliente ${id}:`, error)
    throw error
  }
}

export async function searchClients(query = "") {
  try {
    console.log(`🔍 Buscando clientes com termo "${query}" no Supabase`)
    const supabase = createServerSupabaseClient()

    let clientsQuery = supabase.from("clients").select("id, name, email, phone")

    if (query && query.trim() !== "") {
      clientsQuery = clientsQuery.or(
        `name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,document.ilike.%${query}%`,
      )
    }

    const { data, error } = await clientsQuery.order("name").limit(10)

    if (error) {
      console.error("❌ Erro ao buscar clientes:", error)
      throw new Error(`Error searching clients: ${error.message}`)
    }

    console.log(`✅ Encontrados ${data?.length || 0} clientes para o termo "${query}"`, data)
    return data as Client[]
  } catch (error) {
    console.error(`❌ Erro ao buscar clientes com termo "${query}":`, error)

    // Retornar array vazio em caso de erro
    return []
  }
}
