"use server"

import { createServerSupabaseClient } from "./supabase"

export type Reservation = {
  id: string
  client_id: string
  product_id: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  status: "pendente" | "confirmado" | "cancelado" | "concluido"
  total_value: number
  payment_method?: string
  created_at?: string
  updated_at?: string
  notes?: string

  // Informações do hotel
  hotel_name?: string
  hotel_address?: string
  hotel_phone?: string
  arrival_date?: string
  arrival_time?: string
  room_number?: string
  hotel_contact?: string

  // Informações de entrega e retirada
  delivery_status?: "pendente" | "agendada" | "concluida" | "cancelada"
  delivery_date?: string
  delivery_time_range?: string
  delivery_responsible?: string
  delivery_notes?: string

  pickup_status?: "pendente" | "agendada" | "concluida" | "cancelada"
  pickup_date?: string
  pickup_time_range?: string
  pickup_responsible?: string
  pickup_notes?: string

  // Relações expandidas (não são colunas na tabela)
  client?: any
  product?: any
}

export type ReservationFormData = Omit<Reservation, "id" | "created_at" | "updated_at" | "client" | "product">

// Função para listar todas as reservas
export async function listReservations() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        client:client_id(id, name, email, phone),
        product:product_id(id, name, image_url, daily_price)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reservations:", error)
      throw new Error(`Error fetching reservations: ${error.message}`)
    }

    return data as Reservation[]
  } catch (err: any) {
    console.error("Exception fetching reservations:", err)
    throw new Error(`Exception fetching reservations: ${err.message}`)
  }
}

// Função para validar UUID
function isValidUUID(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

// Função para obter uma reserva por ID
export async function getReservationById(id: string) {
  try {
    // Validar o ID antes de prosseguir
    if (!isValidUUID(id)) {
      throw new Error(`Invalid UUID format: ${id}`)
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        client:client_id(id, name, email, phone),
        product:product_id(id, name, image_url, daily_price)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching reservation with ID ${id}:`, error)
      throw new Error(`Error fetching reservation: ${error.message}`)
    }

    return data as Reservation
  } catch (err: any) {
    console.error(`Exception fetching reservation with ID ${id}:`, err)
    throw new Error(`Exception fetching reservation: ${err.message}`)
  }
}

// Função para criar uma nova reserva
export async function createReservation(reservationData: ReservationFormData) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("reservations").insert([reservationData]).select()

    if (error) {
      console.error("Error creating reservation:", error)
      throw new Error(`Error creating reservation: ${error.message}`)
    }

    return data[0] as Reservation
  } catch (err: any) {
    console.error("Exception creating reservation:", err)
    throw new Error(`Exception creating reservation: ${err.message}`)
  }
}

// Função para atualizar uma reserva existente
export async function updateReservation(id: string, reservationData: Partial<ReservationFormData>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .update({
        ...reservationData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error(`Error updating reservation with ID ${id}:`, error)
      throw new Error(`Error updating reservation: ${error.message}`)
    }

    return data[0] as Reservation
  } catch (err: any) {
    console.error(`Exception updating reservation with ID ${id}:`, err)
    throw new Error(`Exception updating reservation: ${err.message}`)
  }
}

// Função para excluir uma reserva
export async function deleteReservation(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("reservations").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting reservation with ID ${id}:`, error)
      throw new Error(`Error deleting reservation: ${error.message}`)
    }

    return true
  } catch (err: any) {
    console.error(`Exception deleting reservation with ID ${id}:`, err)
    throw new Error(`Exception deleting reservation: ${err.message}`)
  }
}

// Função para buscar reservas por cliente
export async function getReservationsByClient(clientId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        product:product_id(id, name, image_url, daily_price)
      `)
      .eq("client_id", clientId)
      .order("start_date", { ascending: false })

    if (error) {
      console.error(`Error fetching reservations for client ${clientId}:`, error)
      throw new Error(`Error fetching client reservations: ${error.message}`)
    }

    return data as Reservation[]
  } catch (err: any) {
    console.error(`Exception fetching reservations for client ${clientId}:`, err)
    throw new Error(`Exception fetching client reservations: ${err.message}`)
  }
}

// Função para buscar reservas por produto
export async function getReservationsByProduct(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        client:client_id(id, name, email, phone)
      `)
      .eq("product_id", productId)
      .order("start_date", { ascending: false })

    if (error) {
      console.error(`Error fetching reservations for product ${productId}:`, error)
      throw new Error(`Error fetching product reservations: ${error.message}`)
    }

    return data as Reservation[]
  } catch (err: any) {
    console.error(`Exception fetching reservations for product ${productId}:`, err)
    throw new Error(`Exception fetching product reservations: ${err.message}`)
  }
}

// Função para buscar reservas por status
export async function getReservationsByStatus(status: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        client:client_id(id, name, email, phone),
        product:product_id(id, name, image_url, daily_price)
      `)
      .eq("status", status)
      .order("start_date", { ascending: true })

    if (error) {
      console.error(`Error fetching reservations with status ${status}:`, error)
      throw new Error(`Error fetching reservations by status: ${error.message}`)
    }

    return data as Reservation[]
  } catch (err: any) {
    console.error(`Exception fetching reservations with status ${status}:`, err)
    throw new Error(`Exception fetching reservations by status: ${err.message}`)
  }
}

// Função para buscar reservas por período
export async function getReservationsByPeriod(startDate: string, endDate: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reservations")
      .select(`
        *,
        client:client_id(id, name, email, phone),
        product:product_id(id, name, image_url, daily_price)
      `)
      .or(`start_date.gte.${startDate},end_date.lte.${endDate}`)
      .order("start_date", { ascending: true })

    if (error) {
      console.error(`Error fetching reservations for period ${startDate} to ${endDate}:`, error)
      throw new Error(`Error fetching reservations by period: ${error.message}`)
    }

    return data as Reservation[]
  } catch (err: any) {
    console.error(`Exception fetching reservations for period ${startDate} to ${endDate}:`, err)
    throw new Error(`Exception fetching reservations by period: ${err.message}`)
  }
}

// Função para verificar disponibilidade de um produto em um período
export async function checkProductAvailability(
  productId: string,
  startDate: string,
  endDate: string,
  excludeReservationId?: string,
) {
  try {
    const supabase = createServerSupabaseClient()

    let query = supabase
      .from("reservations")
      .select("id")
      .eq("product_id", productId)
      .eq("status", "confirmado")
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

    // Se fornecido um ID de reserva para excluir da verificação (útil para edições)
    if (excludeReservationId) {
      query = query.neq("id", excludeReservationId)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error checking availability for product ${productId}:`, error)
      throw new Error(`Error checking product availability: ${error.message}`)
    }

    // Se não houver reservas conflitantes, o produto está disponível
    return data.length === 0
  } catch (err: any) {
    console.error(`Exception checking availability for product ${productId}:`, err)
    throw new Error(`Exception checking product availability: ${err.message}`)
  }
}
