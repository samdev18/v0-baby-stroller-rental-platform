"use server"

import { createServerSupabaseClient } from "./supabase"

export interface ProductPricingTier {
  id: string
  product_id: string
  min_days: number
  max_days?: number
  price_per_day: number
  tier_name?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function getProductPricingTiers(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_pricing_tiers")
      .select("*")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("min_days", { ascending: true })

    if (error) {
      console.error("Error fetching pricing tiers:", error)
      return []
    }

    return data as ProductPricingTier[]
  } catch (err) {
    console.error("Exception fetching pricing tiers:", err)
    return []
  }
}

export async function createPricingTier(tierData: Omit<ProductPricingTier, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("product_pricing_tiers").insert(tierData).select().single()

    if (error) {
      console.error("Error creating pricing tier:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("Exception creating pricing tier:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function updatePricingTier(id: string, tierData: Partial<ProductPricingTier>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_pricing_tiers")
      .update({ ...tierData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating pricing tier:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("Exception updating pricing tier:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function deletePricingTier(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("product_pricing_tiers").update({ is_active: false }).eq("id", id)

    if (error) {
      console.error("Error deleting pricing tier:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception deleting pricing tier:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function calculatePriceForDays(productId: string, days: number) {
  try {
    const tiers = await getProductPricingTiers(productId)

    // Find the appropriate tier for the number of days
    const applicableTier = tiers.find((tier) => {
      return days >= tier.min_days && (tier.max_days === null || days <= tier.max_days)
    })

    if (applicableTier) {
      return {
        success: true,
        pricePerDay: applicableTier.price_per_day,
        totalPrice: applicableTier.price_per_day * days,
        tierName: applicableTier.tier_name,
      }
    }

    // If no tier found, use the default daily price
    return {
      success: false,
      error: "No pricing tier found for this duration",
    }
  } catch (err: any) {
    console.error("Exception calculating price:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}
