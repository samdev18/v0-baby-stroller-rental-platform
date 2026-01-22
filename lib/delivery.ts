"use server"

import { createServerSupabaseClient } from "./supabase"

export interface DeliveryPickup {
  id: string
  reservation_id: string
  client_id: string
  client_name: string
  type: "delivery" | "pickup"
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  scheduled_date: string
  scheduled_time_start: string
  scheduled_time_end: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
  assigned_to_id?: string | null
  assigned_to_name?: string | null
  assigned_at?: string | null
  started_at?: string | null
  completed_at?: string | null
  product_unit_id?: string | null // Para rastrear qual unidade foi entregue
  product_id: string
  product_name: string
  created_at?: string
  updated_at?: string
}

export interface DeliveryPickupEvent {
  id: string
  delivery_pickup_id: string
  type: string // "assigned", "started", "scanned_at_storage", "scanned_at_delivery", "completed", etc.
  user_id: string
  user_name: string
  event_time: string
  location?: string | null
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
  unit_id?: string | null
  storage_id?: string | null
  created_at?: string
}

export async function listDeliveriesPickups(
  type?: "delivery" | "pickup",
  status?: string,
  date?: string,
  assignedToId?: string,
) {
  try {
    const supabase = createServerSupabaseClient()

    let query = supabase
      .from("delivery_pickup")
      .select(
        `
        *,
        client:client_id (id, name, email, phone),
        product:product_id (id, name, code, primary_image_url),
        assigned_user:assigned_to_id (id, name)
      `,
      )
      .order("scheduled_date", { ascending: true })

    if (type) {
      query = query.eq("type", type)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (date) {
      query = query.eq("scheduled_date", date)
    }

    if (assignedToId) {
      query = query.eq("assigned_to_id", assignedToId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching deliveries/pickups:", error)
      return []
    }

    return data
  } catch (err) {
    console.error("Exception fetching deliveries/pickups:", err)
    return []
  }
}

export async function getDeliveryPickupById(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("delivery_pickup")
      .select(
        `
        *,
        client:client_id (id, name, email, phone),
        product:product_id (id, name, code, primary_image_url),
        assigned_user:assigned_to_id (id, name),
        product_unit:product_unit_id (
          id, 
          unit_code, 
          serial_number, 
          storage:storage_id(id, name, address)
        )
      `,
      )
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching delivery/pickup:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("Exception fetching delivery/pickup:", err)
    return null
  }
}

export async function createDeliveryPickup(data: Partial<DeliveryPickup>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: newItem, error } = await supabase.from("delivery_pickup").insert(data).select().single()

    if (error) {
      console.error("Error creating delivery/pickup:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: newItem.id }
  } catch (err: any) {
    console.error("Exception creating delivery/pickup:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function updateDeliveryPickup(id: string, data: Partial<DeliveryPickup>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: updatedItem, error } = await supabase
      .from("delivery_pickup")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating delivery/pickup:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: updatedItem.id }
  } catch (err: any) {
    console.error("Exception updating delivery/pickup:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function assignDeliveryPickup(id: string, userId: string, userName: string) {
  try {
    const supabase = createServerSupabaseClient()

    const now = new Date().toISOString()

    // Atualizar o registro principal
    const { error } = await supabase
      .from("delivery_pickup")
      .update({
        assigned_to_id: userId,
        assigned_to_name: userName,
        assigned_at: now,
        status: "assigned",
        updated_at: now,
      })
      .eq("id", id)
      .eq("status", "pending") // Só pode atribuir se estiver pendente

    if (error) {
      console.error("Error assigning delivery/pickup:", error)
      return { success: false, error: error.message }
    }

    // Adicionar evento no histórico
    await addDeliveryPickupEvent({
      delivery_pickup_id: id,
      type: "assigned",
      user_id: userId,
      user_name: userName,
      event_time: now,
      notes: "Atribuído para entrega/coleta",
    })

    return { success: true, id }
  } catch (err: any) {
    console.error("Exception assigning delivery/pickup:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function startDeliveryPickup(
  id: string,
  userId: string,
  userName: string,
  latitude?: number,
  longitude?: number,
) {
  try {
    const supabase = createServerSupabaseClient()

    const now = new Date().toISOString()

    // Atualizar o registro principal
    const { error } = await supabase
      .from("delivery_pickup")
      .update({
        status: "in_progress",
        started_at: now,
        updated_at: now,
      })
      .eq("id", id)
      .eq("assigned_to_id", userId) // Só pode iniciar se estiver atribuído a este usuário
      .eq("status", "assigned") // Só pode iniciar se estiver atribuído

    if (error) {
      console.error("Error starting delivery/pickup:", error)
      return { success: false, error: error.message }
    }

    // Adicionar evento no histórico
    await addDeliveryPickupEvent({
      delivery_pickup_id: id,
      type: "started",
      user_id: userId,
      user_name: userName,
      event_time: now,
      latitude,
      longitude,
      notes: "Iniciou entrega/coleta",
    })

    return { success: true, id }
  } catch (err: any) {
    console.error("Exception starting delivery/pickup:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function completeDeliveryPickup(
  id: string,
  userId: string,
  userName: string,
  latitude?: number,
  longitude?: number,
) {
  try {
    const supabase = createServerSupabaseClient()

    const now = new Date().toISOString()

    // Atualizar o registro principal
    const { error } = await supabase
      .from("delivery_pickup")
      .update({
        status: "completed",
        completed_at: now,
        updated_at: now,
      })
      .eq("id", id)
      .eq("assigned_to_id", userId) // Só pode completar se estiver atribuído a este usuário
      .eq("status", "in_progress") // Só pode completar se estiver em progresso

    if (error) {
      console.error("Error completing delivery/pickup:", error)
      return { success: false, error: error.message }
    }

    // Adicionar evento no histórico
    await addDeliveryPickupEvent({
      delivery_pickup_id: id,
      type: "completed",
      user_id: userId,
      user_name: userName,
      event_time: now,
      latitude,
      longitude,
      notes: "Concluiu entrega/coleta",
    })

    return { success: true, id }
  } catch (err: any) {
    console.error("Exception completing delivery/pickup:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function scanUnitAtStorage(
  deliveryPickupId: string,
  unitId: string,
  storageId: string,
  userId: string,
  userName: string,
  latitude?: number,
  longitude?: number,
) {
  try {
    const supabase = createServerSupabaseClient()

    const now = new Date().toISOString()
    const { data: storage } = await supabase.from("storages").select("name, address").eq("id", storageId).single()

    // Verificar se este é o primeiro scan (no storage)
    const { data: deliveryPickup } = await supabase
      .from("delivery_pickup")
      .select("product_unit_id, type")
      .eq("id", deliveryPickupId)
      .single()

    if (deliveryPickup.type === "delivery" && !deliveryPickup.product_unit_id) {
      // Se for entrega e ainda não tiver unidade atribuída, atualizar
      await supabase
        .from("delivery_pickup")
        .update({ product_unit_id: unitId, updated_at: now })
        .eq("id", deliveryPickupId)
    }

    // Adicionar evento no histórico
    const eventType = deliveryPickup.type === "delivery" ? "scanned_at_storage_delivery" : "scanned_at_storage_return"
    const eventNotes =
      deliveryPickup.type === "delivery"
        ? `Produto escaneado no storage para entrega: ${storage?.name}`
        : `Produto retornado ao storage após coleta: ${storage?.name}`

    await addDeliveryPickupEvent({
      delivery_pickup_id: deliveryPickupId,
      type: eventType,
      user_id: userId,
      user_name: userName,
      event_time: now,
      latitude,
      longitude,
      notes: eventNotes,
      unit_id: unitId,
      storage_id: storageId,
      location: storage ? `${storage.name} - ${storage.address}` : undefined,
    })

    // Se for uma coleta (return), atualizar o storage da unidade e status
    if (deliveryPickup.type === "pickup") {
      await supabase
        .from("product_units")
        .update({
          storage_id: storageId,
          status: "available",
          updated_at: now,
        })
        .eq("id", unitId)
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception scanning unit at storage:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function scanUnitAtLocation(
  deliveryPickupId: string,
  unitId: string,
  userId: string,
  userName: string,
  latitude?: number,
  longitude?: number,
) {
  try {
    const supabase = createServerSupabaseClient()

    const now = new Date().toISOString()

    // Verificar informações da entrega/coleta
    const { data: deliveryPickup } = await supabase
      .from("delivery_pickup")
      .select("type, address, city, state")
      .eq("id", deliveryPickupId)
      .single()

    // Adicionar evento no histórico
    const eventType = deliveryPickup.type === "delivery" ? "scanned_at_delivery" : "scanned_at_pickup"
    const eventNotes =
      deliveryPickup.type === "delivery"
        ? `Produto entregue ao cliente em ${deliveryPickup.address}, ${deliveryPickup.city}`
        : `Produto coletado do cliente em ${deliveryPickup.address}, ${deliveryPickup.city}`

    await addDeliveryPickupEvent({
      delivery_pickup_id: deliveryPickupId,
      type: eventType,
      user_id: userId,
      user_name: userName,
      event_time: now,
      latitude,
      longitude,
      notes: eventNotes,
      unit_id: unitId,
      location: `${deliveryPickup.address}, ${deliveryPickup.city}, ${deliveryPickup.state}`,
    })

    // Se for uma entrega, atualizar status da unidade para "rented"
    if (deliveryPickup.type === "delivery") {
      await supabase
        .from("product_units")
        .update({ status: "rented", storage_id: null, updated_at: now })
        .eq("id", unitId)
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception scanning unit at location:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function getDeliveryPickupEvents(deliveryPickupId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("delivery_pickup_events")
      .select("*")
      .eq("delivery_pickup_id", deliveryPickupId)
      .order("event_time", { ascending: true })

    if (error) {
      console.error("Error fetching delivery/pickup events:", error)
      return []
    }

    return data as DeliveryPickupEvent[]
  } catch (err) {
    console.error("Exception fetching delivery/pickup events:", err)
    return []
  }
}

export async function addDeliveryPickupEvent(data: Partial<DeliveryPickupEvent>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: newEvent, error } = await supabase.from("delivery_pickup_events").insert(data).select().single()

    if (error) {
      console.error("Error adding delivery/pickup event:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: newEvent.id }
  } catch (err: any) {
    console.error("Exception adding delivery/pickup event:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function getAvailableStoragesForProduct(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Buscar unidades disponíveis do produto e seus storages
    const { data, error } = await supabase
      .from("product_units")
      .select(
        `
        storage:storage_id (
          id,
          name,
          address,
          city,
          state,
          latitude,
          longitude
        )
      `,
      )
      .eq("product_id", productId)
      .eq("status", "available")
      .eq("is_active", true)
      .not("storage_id", "is", null)

    if (error) {
      console.error("Error fetching available storages:", error)
      return []
    }

    // Deduplicate storages
    const storagesMap = new Map()
    data.forEach((item) => {
      if (item.storage && !storagesMap.has(item.storage.id)) {
        storagesMap.set(item.storage.id, item.storage)
      }
    })

    return Array.from(storagesMap.values())
  } catch (err) {
    console.error("Exception fetching available storages:", err)
    return []
  }
}

export async function createDeliveryPickupsFromReservation(reservationId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Buscar informações da reserva
    const { data: reservation, error: resError } = await supabase
      .from("reservations")
      .select(
        `
        id,
        client_id,
        client_name,
        start_date,
        end_date,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_postal_code,
        delivery_country,
        delivery_notes,
        pickup_address,
        pickup_city,
        pickup_state,
        pickup_postal_code,
        pickup_country,
        pickup_notes,
        products:reservation_products (
          id,
          product_id,
          product_name,
          quantity
        )
      `,
      )
      .eq("id", reservationId)
      .single()

    if (resError) {
      console.error("Error fetching reservation:", resError)
      return { success: false, error: resError.message }
    }

    // Criar registros de entrega e coleta para cada produto da reserva
    const deliveriesPickups = []

    for (const product of reservation.products) {
      // Converter datas para objetos Date para manipulação
      const startDate = new Date(reservation.start_date)
      const endDate = new Date(reservation.end_date)

      // Definir horário para entrega (entre 9h e 12h do dia de início)
      const deliveryDate = new Date(startDate)
      deliveryDate.setHours(9, 0, 0, 0)

      // Definir horário para coleta (entre 14h e 18h do dia de término)
      const pickupDate = new Date(endDate)
      pickupDate.setHours(14, 0, 0, 0)

      // Criar registro de entrega
      const { data: delivery, error: deliveryError } = await supabase
        .from("delivery_pickup")
        .insert({
          reservation_id: reservation.id,
          client_id: reservation.client_id,
          client_name: reservation.client_name,
          type: "delivery",
          status: "pending",
          scheduled_date: startDate.toISOString().split("T")[0],
          scheduled_time_start: "09:00",
          scheduled_time_end: "12:00",
          address: reservation.delivery_address,
          city: reservation.delivery_city,
          state: reservation.delivery_state,
          postal_code: reservation.delivery_postal_code,
          country: reservation.delivery_country,
          notes: reservation.delivery_notes,
          product_id: product.product_id,
          product_name: product.product_name,
        })
        .select()
        .single()

      if (deliveryError) {
        console.error("Error creating delivery record:", deliveryError)
        return { success: false, error: deliveryError.message }
      }

      deliveriesPickups.push(delivery)

      // Criar registro de coleta
      const { data: pickup, error: pickupError } = await supabase
        .from("delivery_pickup")
        .insert({
          reservation_id: reservation.id,
          client_id: reservation.client_id,
          client_name: reservation.client_name,
          type: "pickup",
          status: "pending",
          scheduled_date: endDate.toISOString().split("T")[0],
          scheduled_time_start: "14:00",
          scheduled_time_end: "18:00",
          address: reservation.pickup_address || reservation.delivery_address,
          city: reservation.pickup_city || reservation.delivery_city,
          state: reservation.pickup_state || reservation.delivery_state,
          postal_code: reservation.pickup_postal_code || reservation.delivery_postal_code,
          country: reservation.pickup_country || reservation.delivery_country,
          notes: reservation.pickup_notes,
          product_id: product.product_id,
          product_name: product.product_name,
        })
        .select()
        .single()

      if (pickupError) {
        console.error("Error creating pickup record:", pickupError)
        return { success: false, error: pickupError.message }
      }

      deliveriesPickups.push(pickup)
    }

    return { success: true, deliveriesPickups }
  } catch (err: any) {
    console.error("Exception creating delivery/pickup records:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}
