"use server"

import { createServerSupabaseClient } from "./supabase"
import type { Product } from "./products"
import type { StoreProduct } from "./store-products"

// Função para atualizar produtos com suas imagens principais
export async function updateProductsWithImages(products: Product[]): Promise<Product[]> {
  console.log(`Atualizando ${products.length} produtos com suas imagens principais`)

  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      try {
        const primaryImage = await getPrimaryProductImage(product.id)

        if (primaryImage && primaryImage.url) {
          // Verificar se a URL da imagem é válida
          if (
            !primaryImage.url.includes("undefined") &&
            !primaryImage.url.includes("null") &&
            !primaryImage.url.startsWith("blob:")
          ) {
            return {
              ...product,
              primary_image_url: primaryImage.url,
              image_url: primaryImage.url, // Manter compatibilidade com código existente
              url: primaryImage.url, // Adicionar campo url para compatibilidade
            }
          }
        }

        return product
      } catch (error) {
        console.error(`Erro ao buscar imagem para o produto ${product.id}:`, error)
        return product
      }
    }),
  )

  return updatedProducts
}

// Função para atualizar produtos da loja com suas imagens principais
export async function updateStoreProductsWithImages(products: StoreProduct[]): Promise<StoreProduct[]> {
  // Add safety check for undefined or null products
  if (!products || !Array.isArray(products)) {
    console.warn("updateStoreProductsWithImages received invalid products array:", products)
    return []
  }

  console.log(`Atualizando ${products.length} produtos da loja com suas imagens principais`)

  const updatedProducts = await Promise.all(
    products.map(async (product) => {
      try {
        const primaryImage = await getPrimaryProductImage(product.id)

        if (primaryImage && primaryImage.url) {
          // Verificar se a URL da imagem é válida
          if (
            !primaryImage.url.includes("undefined") &&
            !primaryImage.url.includes("null") &&
            !primaryImage.url.startsWith("blob:")
          ) {
            return {
              ...product,
              primary_image_url: primaryImage.url,
              image_url: primaryImage.url, // Manter compatibilidade com código existente
              url: primaryImage.url, // Adicionar campo url para compatibilidade
            }
          }
        }

        return product
      } catch (error) {
        console.error(`Erro ao buscar imagem para o produto da loja ${product.id}:`, error)
        return product
      }
    }),
  )

  return updatedProducts
}

// Função para buscar a imagem principal de um produto
export async function getPrimaryProductImage(productId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 é o código para "nenhum resultado encontrado"
      console.error("Erro ao obter imagem principal do produto:", error)
      throw new Error(`Erro ao obter imagem principal do produto: ${error.message}`)
    }

    if (!data) {
      // Se não houver imagem principal, tenta obter a primeira imagem
      const { data: firstImage, error: firstImageError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (firstImageError && firstImageError.code !== "PGRST116") {
        console.error("Erro ao obter primeira imagem do produto:", firstImageError)
        throw new Error(`Erro ao obter primeira imagem do produto: ${firstImageError.message}`)
      }

      return firstImage || null
    }

    return data
  } catch (error) {
    console.error(`Erro ao buscar imagem principal para o produto ${productId}:`, error)
    return null
  }
}
