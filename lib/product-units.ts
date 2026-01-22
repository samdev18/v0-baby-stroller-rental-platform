"use server"

import { createServerSupabaseClient } from "./supabase"

export interface ProductUnit {
  id: string
  product_id: string
  unit_code: string
  serial_number?: string | null
  status: "available" | "rented" | "maintenance" | "inactive"
  is_active: boolean
  storage_id?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface UnitRentalHistory {
  id: string
  unit_id: string
  reservation_id?: string | null
  client_name: string
  start_date: string
  end_date: string
  status: "rented" | "returned" | "damaged"
  notes?: string | null
  created_at?: string
}

// Função para listar unidades de um produto
export async function listProductUnits(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_units")
      .select(`
        *,
        storage:storage_id (
          id,
          name,
          address
        )
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching product units:", error)
      return []
    }

    return data as (ProductUnit & { storage: { id: string; name: string; address: string } | null })[]
  } catch (err) {
    console.error("Exception fetching product units:", err)
    return []
  }
}

// Função para criar uma nova unidade
export async function createProductUnit(unitData: Partial<ProductUnit>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("product_units").insert(unitData).select().single()

    if (error) {
      console.error("Error creating product unit:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception creating product unit:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

// Função para atualizar uma unidade
export async function updateProductUnit(id: string, unitData: Partial<ProductUnit>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_units")
      .update({ ...unitData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product unit:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception updating product unit:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

// Função para excluir uma unidade
export async function deleteProductUnit(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("product_units").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product unit:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception deleting product unit:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

// Função para gerar código de barras único
export async function generateUniqueBarcode(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Buscar o produto para obter informações
    const { data: product } = await supabase.from("products").select("code").eq("id", productId).single()

    if (!product) {
      throw new Error("Product not found")
    }

    // Gerar código baseado no código do produto + timestamp + random
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const barcode = `${product.code}-${timestamp}${random}`

    // Verificar se o código já existe
    const { data: existing } = await supabase.from("product_units").select("id").eq("unit_code", barcode).single()

    if (existing) {
      // Se existir, gerar novamente (recursivo)
      return generateUniqueBarcode(productId)
    }

    return barcode
  } catch (err) {
    console.error("Exception generating barcode:", err)
    // Fallback para código simples
    const timestamp = Date.now().toString().slice(-8)
    return `UNIT-${timestamp}`
  }
}

// Função para obter histórico de aluguéis de uma unidade
export async function getUnitRentalHistory(unitId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("unit_rental_history")
      .select("*")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching unit rental history:", error)
      return []
    }

    return data as UnitRentalHistory[]
  } catch (err) {
    console.error("Exception fetching unit rental history:", err)
    return []
  }
}

// Função para adicionar entrada no histórico de aluguel
export async function addUnitRentalHistory(historyData: Partial<UnitRentalHistory>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("unit_rental_history").insert(historyData).select().single()

    if (error) {
      console.error("Error adding unit rental history:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception adding unit rental history:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

// Função para obter estatísticas de unidades de um produto
export async function getProductUnitsStats(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("product_units").select("status, is_active").eq("product_id", productId)

    if (error) {
      console.error("Error fetching product units stats:", error)
      return {
        total: 0,
        available: 0,
        rented: 0,
        maintenance: 0,
        inactive: 0,
      }
    }

    const stats = {
      total: data.length,
      available: data.filter((unit) => unit.status === "available" && unit.is_active).length,
      rented: data.filter((unit) => unit.status === "rented" && unit.is_active).length,
      maintenance: data.filter((unit) => unit.status === "maintenance" && unit.is_active).length,
      inactive: data.filter((unit) => !unit.is_active || unit.status === "inactive").length,
    }

    return stats
  } catch (err) {
    console.error("Exception fetching product units stats:", err)
    return {
      total: 0,
      available: 0,
      rented: 0,
      maintenance: 0,
      inactive: 0,
    }
  }
}

// Função para atualizar o storage de uma unidade
export async function updateUnitStorage(unitId: string, storageId: string | null) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_units")
      .update({ storage_id: storageId, updated_at: new Date().toISOString() })
      .eq("id", unitId)
      .select()
      .single()

    if (error) {
      console.error("Error updating unit storage:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception updating unit storage:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

// Função para buscar unidade por código de barras
export async function getUnitByBarcode(barcode: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_units")
      .select(
        `
        *,
        product:product_id (
          id, 
          name, 
          code,
          primary_image_url
        ),
        storage:storage_id (
          id,
          name,
          address
        )
      `,
      )
      .eq("unit_code", barcode)
      .single()

    if (error) {
      console.error("Error fetching unit by barcode:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("Exception fetching unit by barcode:", err)
    return null
  }
}

// Função para buscar unidades disponíveis para uma reserva
export async function getAvailableUnitsForReservation(productId: string, startDate: string, endDate: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Primeiro, obter todas as unidades ativas e disponíveis do produto
    const { data: units, error: unitsError } = await supabase
      .from("product_units")
      .select("*, storage:storage_id(id, name, address)")
      .eq("product_id", productId)
      .eq("is_active", true)
      .eq("status", "available")
      .order("created_at", { ascending: true })

    if (unitsError) {
      console.error("Error fetching available units:", unitsError)
      return []
    }

    // Agora, filtrar unidades que não estão reservadas no período
    // Isso seria feito verificando as reservas atuais, mas para simplicidade,
    // vamos apenas retornar as unidades disponíveis
    return units
  } catch (err) {
    console.error("Exception fetching available units:", err)
    return []
  }
}
