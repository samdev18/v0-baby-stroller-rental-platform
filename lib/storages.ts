"use server"

import { createServerSupabaseClient } from "./supabase"

export interface Storage {
  id: string
  name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  latitude?: number | null
  longitude?: number | null
  is_active: boolean
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export async function listStorages() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("storages")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching storages:", error)
      return []
    }

    return data as Storage[]
  } catch (err) {
    console.error("Exception fetching storages:", err)
    return []
  }
}

export async function getStorageById(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("storages").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching storage:", error)
      return null
    }

    return data as Storage
  } catch (err) {
    console.error("Exception fetching storage:", err)
    return null
  }
}

export async function createStorage(storageData: Partial<Storage>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("storages").insert(storageData).select().single()

    if (error) {
      console.error("Error creating storage:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception creating storage:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function updateStorage(id: string, storageData: Partial<Storage>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("storages")
      .update({ ...storageData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating storage:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception updating storage:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function deleteStorage(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("storages").delete().eq("id", id)

    if (error) {
      console.error("Error deleting storage:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception deleting storage:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function getNearbyStorages(latitude: number, longitude: number, maxDistance = 10) {
  try {
    const supabase = createServerSupabaseClient()

    // Obter todos os storages ativos
    const { data: allStorages, error } = await supabase.from("storages").select("*").eq("is_active", true)

    if (error) {
      console.error("Error fetching storages:", error)
      return []
    }

    // Filtrar storages próximos usando a fórmula de Haversine
    const nearbyStorages = allStorages
      .filter((storage) => {
        if (!storage.latitude || !storage.longitude) return false

        const distance = calculateDistance(latitude, longitude, storage.latitude, storage.longitude)
        storage.distance = distance // Adiciona a distância ao objeto
        return distance <= maxDistance
      })
      .sort((a, b) => a.distance - b.distance)

    return nearbyStorages
  } catch (err) {
    console.error("Exception fetching nearby storages:", err)
    return []
  }
}

// Fórmula de Haversine para calcular distância entre duas coordenadas (em km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function getStorageProducts(storageId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Buscar unidades no storage
    const { data: units, error } = await supabase
      .from("product_units")
      .select(
        `
        id,
        unit_code,
        serial_number,
        status,
        notes,
        product_id,
        products:product_id (
          id,
          name,
          code,
          category_id,
          daily_price,
          primary_image_url
        )
      `,
      )
      .eq("storage_id", storageId)
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching storage products:", error)
      return []
    }

    return units
  } catch (err) {
    console.error("Exception fetching storage products:", err)
    return []
  }
}
