"use server"

import { createServerSupabaseClient } from "./supabase"
import { getProductImages } from "./upload-image"
import { getProductPricingTiers, type ProductPricingTier } from "./product-pricing"

export interface StoreProduct {
  id: string
  name: string
  description: string
  price: number
  daily_price: number
  category_name: string
  stock_quantity: number
  is_active: boolean
  primary_image_url?: string
  image_url?: string
  url?: string
  images?: any[]
  category_id?: string
  pricing_tiers?: ProductPricingTier[]
}

export interface ProductCategory {
  id: string
  name: string
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("product_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Erro ao buscar categorias de produtos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar categorias de produtos:", error)
    return []
  }
}

export async function getStoreProducts(
  page = 1,
  limit = 12,
  category?: string,
  search?: string,
): Promise<{ products: StoreProduct[]; total: number }> {
  try {
    const supabase = createServerSupabaseClient()
    const offset = (page - 1) * limit

    // Construir a consulta base
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    // Adicionar filtro por categoria, se fornecido
    if (category && category !== "all") {
      query = query.eq("category_id", category)
    }

    // Adicionar filtro por termo de pesquisa, se fornecido
    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    // Executar a consulta com paginação
    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Erro ao buscar produtos da loja:", error)
      return { products: [], total: 0 }
    }

    if (!data) {
      return { products: [], total: 0 }
    }

    // Buscar categorias para os produtos
    const categoryIds = data.map((product) => product.category_id).filter(Boolean)
    let categoriesMap: Record<string, string> = {}

    if (categoryIds.length > 0) {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("product_categories")
        .select("id, name")
        .in("id", categoryIds)

      if (!categoriesError && categoriesData) {
        categoriesMap = categoriesData.reduce(
          (acc, cat) => {
            acc[cat.id] = cat.name
            return acc
          },
          {} as Record<string, string>,
        )
      }
    }

    // Transformar os dados para o formato esperado
    const products = await Promise.all(
      data.map(async (product) => {
        // Buscar imagens do produto
        const images = await getProductImages(product.id)
        const primaryImage = images.find((img) => img.is_primary) || images[0]

        // Buscar pricing tiers do produto
        const pricingTiers = await getProductPricingTiers(product.id)

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          daily_price: product.daily_price || product.price,
          category_name: categoriesMap[product.category_id] || "Sem categoria",
          category_id: product.category_id,
          stock_quantity: product.stock_quantity,
          is_active: product.is_active,
          primary_image_url: primaryImage?.url || null,
          image_url: primaryImage?.url || null,
          url: primaryImage?.url || null,
          images: images,
          pricing_tiers: pricingTiers,
        }
      }),
    )

    return {
      products,
      total: count || 0,
    }
  } catch (error) {
    console.error("Erro ao buscar produtos da loja:", error)
    return { products: [], total: 0 }
  }
}

export async function getStoreProduct(id: string): Promise<StoreProduct | null> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("is_active", true).single()

    if (error) {
      console.error(`Erro ao buscar produto da loja com ID ${id}:`, error)
      return null
    }

    // Buscar categoria do produto
    let categoryName = "Sem categoria"
    if (data.category_id) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("product_categories")
        .select("name")
        .eq("id", data.category_id)
        .single()

      if (!categoryError && categoryData) {
        categoryName = categoryData.name
      }
    }

    // Buscar imagens do produto
    const images = await getProductImages(data.id)
    const primaryImage = images.find((img) => img.is_primary) || images[0]

    // Buscar pricing tiers do produto
    const pricingTiers = await getProductPricingTiers(data.id)

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      daily_price: data.daily_price || data.price,
      category_name: categoryName,
      category_id: data.category_id,
      stock_quantity: data.stock_quantity,
      is_active: data.is_active,
      primary_image_url: primaryImage?.url || null,
      image_url: primaryImage?.url || null,
      url: primaryImage?.url || null,
      images: images,
      pricing_tiers: pricingTiers,
    }
  } catch (error) {
    console.error(`Erro ao buscar produto da loja com ID ${id}:`, error)
    return null
  }
}

// Alias para getStoreProduct para compatibilidade com código existente
export const getProductById = getStoreProduct

export async function getRelatedProducts(productId: string, categoryId?: string, limit = 4): Promise<StoreProduct[]> {
  try {
    const supabase = createServerSupabaseClient()

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .neq("id", productId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar produtos relacionados:", error)
      return []
    }

    if (!data) {
      return []
    }

    // Se não houver produtos suficientes na mesma categoria, buscar outros produtos
    if (data.length < limit) {
      const remainingLimit = limit - data.length
      const { data: otherProducts, error: otherError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .neq("id", productId)
        .not("id", "in", `(${data.map((p) => p.id).join(",")})`)
        .order("created_at", { ascending: false })
        .limit(remainingLimit)

      if (!otherError && otherProducts) {
        data.push(...otherProducts)
      }
    }

    // Buscar categorias para os produtos
    const categoryIds = data.map((product) => product.category_id).filter(Boolean)
    let categoriesMap: Record<string, string> = {}

    if (categoryIds.length > 0) {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("product_categories")
        .select("id, name")
        .in("id", categoryIds)

      if (!categoriesError && categoriesData) {
        categoriesMap = categoriesData.reduce(
          (acc, cat) => {
            acc[cat.id] = cat.name
            return acc
          },
          {} as Record<string, string>,
        )
      }
    }

    // Transformar os dados para o formato esperado
    const products = await Promise.all(
      data.map(async (product) => {
        // Buscar imagens do produto
        const images = await getProductImages(product.id)
        const primaryImage = images.find((img) => img.is_primary) || images[0]

        // Buscar pricing tiers do produto
        const pricingTiers = await getProductPricingTiers(product.id)

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          daily_price: product.daily_price || product.price,
          category_name: categoriesMap[product.category_id] || "Sem categoria",
          category_id: product.category_id,
          stock_quantity: product.stock_quantity,
          is_active: product.is_active,
          primary_image_url: primaryImage?.url || null,
          image_url: primaryImage?.url || null,
          url: primaryImage?.url || null,
          images: images,
          pricing_tiers: pricingTiers,
        }
      }),
    )

    return products
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error)
    return []
  }
}
