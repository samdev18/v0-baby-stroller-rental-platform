"use server"

import { createServerSupabaseClient } from "./supabase"

export interface Product {
  id: string
  name: string
  code: string
  description?: string
  category_id?: string
  daily_price: number
  purchase_price?: number
  total_stock: number
  available_stock: number
  brand?: string
  model?: string
  color?: string
  weight?: string
  dimensions?: string
  notes?: string
  is_active: boolean
  is_featured: boolean
  image_url?: string
  primary_image_url?: string
  created_at?: string
  updated_at?: string
  category?: {
    id: string
    name: string
  }
}

export interface ProductMaintenance {
  id: string
  product_id: string
  maintenance_type: string
  description?: string
  cost: number
  maintenance_date: string
  provider?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export async function getProducts() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        category:product_categories(id, name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    // Para cada produto, buscar a imagem principal e contar unidades
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        // Buscar imagem principal
        const { data: primaryImage } = await supabase
          .from("product_images")
          .select("url")
          .eq("product_id", product.id)
          .eq("is_primary", true)
          .single()

        // Contar unidades totais e disponíveis
        const { data: units } = await supabase
          .from("product_units")
          .select("status, is_active")
          .eq("product_id", product.id)

        const totalUnits = units?.length || 0
        const availableUnits = units?.filter((unit) => unit.is_active && unit.status === "available").length || 0

        return {
          ...product,
          primary_image_url: primaryImage?.url || null,
          total_stock: totalUnits,
          available_stock: availableUnits,
        }
      }),
    )

    return productsWithDetails as Product[]
  } catch (err) {
    console.error("Exception fetching products:", err)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        category:product_categories(id, name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    // Buscar imagem principal
    const { data: primaryImage } = await supabase
      .from("product_images")
      .select("url")
      .eq("product_id", product.id)
      .eq("is_primary", true)
      .single()

    // Contar unidades totais e disponíveis
    const { data: units } = await supabase
      .from("product_units")
      .select("status, is_active")
      .eq("product_id", product.id)

    const totalUnits = units?.length || 0
    const availableUnits = units?.filter((unit) => unit.is_active && unit.status === "available").length || 0

    return {
      ...product,
      primary_image_url: primaryImage?.url || null,
      total_stock: totalUnits,
      available_stock: availableUnits,
    } as Product
  } catch (err) {
    console.error("Exception fetching product:", err)
    return null
  }
}

export async function createProduct(productData: Partial<Product>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("products").insert(productData).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception creating product:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("products")
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error("Exception updating product:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception deleting product:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function getProductCategories() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("product_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data
  } catch (err) {
    console.error("Exception fetching categories:", err)
    return []
  }
}

export async function listProductMaintenance(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_maintenance")
      .select("*")
      .eq("product_id", productId)
      .order("maintenance_date", { ascending: false })

    if (error) {
      console.error("Error fetching maintenance records:", error)
      return []
    }

    return data as ProductMaintenance[]
  } catch (err) {
    console.error("Exception fetching maintenance records:", err)
    return []
  }
}

export async function createMaintenance(maintenanceData: Partial<ProductMaintenance>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("product_maintenance").insert(maintenanceData).select().single()

    if (error) {
      console.error("Error creating maintenance record:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("Exception creating maintenance record:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function updateMaintenance(id: string, maintenanceData: Partial<ProductMaintenance>) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_maintenance")
      .update({ ...maintenanceData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating maintenance record:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("Exception updating maintenance record:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function deleteMaintenance(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("product_maintenance").delete().eq("id", id)

    if (error) {
      console.error("Error deleting maintenance record:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception deleting maintenance record:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

export async function uploadProductImage(file: File, productId: string, isPrimary = false) {
  try {
    const supabase = createServerSupabaseClient()

    // Generate unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${productId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product_images")
      .upload(fileName, file)

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product_images").getPublicUrl(fileName)

    // If this is the primary image, unset other primary images
    if (isPrimary) {
      await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId)
    }

    // Save image metadata to database
    const { data: imageData, error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: publicUrl,
        storage_path: fileName,
        is_primary: isPrimary,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Error saving image metadata:", dbError)
      return { success: false, error: dbError.message }
    }

    return { success: true, data: imageData }
  } catch (err: any) {
    console.error("Exception uploading image:", err)
    return { success: false, error: err.message || "Unknown error occurred" }
  }
}

// Alias para compatibilidade
export const getStoreProduct = getProductById

// Exportar função para compatibilidade
export const listProductCategories = getProductCategories
export const listProducts = getProducts
