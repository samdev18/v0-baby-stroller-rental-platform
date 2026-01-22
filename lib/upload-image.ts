"use server"

import { createServerSupabaseClient } from "./supabase"
import { revalidatePath } from "next/cache"

export interface ProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string
  is_primary: boolean
  created_at: string
}

export async function uploadImageToSupabase(
  file: File,
  productId: string,
  isPrimary = false,
): Promise<ProductImage | null> {
  try {
    console.log(`Iniciando upload de imagem para o produto ${productId}`)
    const supabase = createServerSupabaseClient()

    // Gerar um nome único para o arquivo
    const timestamp = new Date().getTime()
    const fileExt = file.name.split(".").pop()
    const fileName = `${productId}_${timestamp}.${fileExt}`
    const filePath = `products/${productId}/${fileName}`

    // Converter o arquivo para um ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Fazer upload do arquivo para o bucket
    console.log(`Fazendo upload para o caminho: ${filePath}`)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("orlando-stroller")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error("Erro ao fazer upload do arquivo:", uploadError)
      throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`)
    }

    // Obter a URL pública do arquivo
    const { data: urlData } = await supabase.storage.from("orlando-stroller").getPublicUrl(filePath)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Não foi possível obter a URL pública do arquivo")
    }

    console.log("URL pública do arquivo:", urlData.publicUrl)

    // Se for a primeira imagem ou for marcada como principal, verificar se já existe uma imagem principal
    let shouldBePrimary = isPrimary

    if (!isPrimary) {
      // Verificar se já existe alguma imagem para este produto
      const { data: existingImages } = await supabase.from("product_images").select("*").eq("product_id", productId)

      // Se não existir nenhuma imagem, esta será a principal
      shouldBePrimary = existingImages?.length === 0
    }

    // Se esta imagem for definida como principal, atualizar todas as outras para não serem principais
    if (shouldBePrimary) {
      await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId)
    }

    // Salvar os metadados da imagem no banco de dados
    const { data: imageData, error: insertError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: urlData.publicUrl,
        storage_path: filePath,
        is_primary: shouldBePrimary,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Erro ao salvar metadados da imagem:", insertError)
      throw new Error(`Erro ao salvar metadados da imagem: ${insertError.message}`)
    }

    console.log("Imagem salva com sucesso:", imageData)
    revalidatePath(`/produtos/${productId}`)
    revalidatePath(`/products/${productId}`)
    revalidatePath(`/store/products/${productId}`)
    revalidatePath(`/store`)

    return imageData as ProductImage
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error)
    throw new Error(`Erro ao fazer upload da imagem: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  try {
    console.log(`Buscando imagens para o produto ${productId}`)
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar imagens do produto:", error)
      return []
    }

    console.log(`Encontradas ${data?.length || 0} imagens para o produto ${productId}`)
    return data as ProductImage[]
  } catch (error) {
    console.error("Erro ao buscar imagens do produto:", error)
    return []
  }
}

export async function getPrimaryProductImage(productId: string): Promise<ProductImage | null> {
  try {
    console.log(`Buscando imagem principal para o produto ${productId}`)
    const supabase = createServerSupabaseClient()

    // Primeiro, tentar buscar a imagem marcada como principal
    let { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .single()

    if (error || !data) {
      console.log(`Nenhuma imagem principal encontrada para o produto ${productId}, buscando qualquer imagem`)
      // Se não encontrar uma imagem principal, buscar qualquer imagem do produto
      const { data: anyImage, error: anyError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (anyError || !anyImage) {
        console.log(`Nenhuma imagem encontrada para o produto ${productId}`)
        return null
      }

      data = anyImage
    }

    console.log(`Imagem encontrada para o produto ${productId}:`, data)
    return data as ProductImage
  } catch (error) {
    console.error("Erro ao buscar imagem principal do produto:", error)
    return null
  }
}

export async function deleteProductImage(imageId: string): Promise<boolean> {
  try {
    console.log(`Excluindo imagem ${imageId}`)
    const supabase = createServerSupabaseClient()

    // Primeiro, buscar os dados da imagem para obter o caminho de armazenamento
    const { data: imageData, error: fetchError } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", imageId)
      .single()

    if (fetchError || !imageData) {
      console.error("Erro ao buscar dados da imagem:", fetchError)
      throw new Error(`Erro ao buscar dados da imagem: ${fetchError?.message || "Imagem não encontrada"}`)
    }

    const productId = imageData.product_id
    const storagePath = imageData.storage_path
    const isPrimary = imageData.is_primary

    // Excluir o arquivo do storage
    const { error: storageError } = await supabase.storage.from("orlando-stroller").remove([storagePath])

    if (storageError) {
      console.error("Erro ao excluir arquivo do storage:", storageError)
      // Continuar mesmo com erro no storage, para garantir que os metadados sejam removidos
    }

    // Excluir os metadados da imagem do banco de dados
    const { error: deleteError } = await supabase.from("product_images").delete().eq("id", imageId)

    if (deleteError) {
      console.error("Erro ao excluir metadados da imagem:", deleteError)
      throw new Error(`Erro ao excluir metadados da imagem: ${deleteError.message}`)
    }

    // Se a imagem excluída era a principal, definir outra imagem como principal
    if (isPrimary) {
      const { data: remainingImages } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(1)

      if (remainingImages && remainingImages.length > 0) {
        await supabase.from("product_images").update({ is_primary: true }).eq("id", remainingImages[0].id)
      }
    }

    console.log(`Imagem ${imageId} excluída com sucesso`)
    revalidatePath(`/produtos/${productId}`)
    revalidatePath(`/products/${productId}`)
    revalidatePath(`/store/products/${productId}`)
    revalidatePath(`/store`)

    return true
  } catch (error) {
    console.error("Erro ao excluir imagem:", error)
    return false
  }
}

export async function setPrimaryImage(imageId: string): Promise<boolean> {
  try {
    console.log(`Definindo imagem ${imageId} como principal`)
    const supabase = createServerSupabaseClient()

    // Primeiro, buscar os dados da imagem para obter o ID do produto
    const { data: imageData, error: fetchError } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", imageId)
      .single()

    if (fetchError || !imageData) {
      console.error("Erro ao buscar dados da imagem:", fetchError)
      throw new Error(`Erro ao buscar dados da imagem: ${fetchError?.message || "Imagem não encontrada"}`)
    }

    const productId = imageData.product_id

    // Atualizar todas as imagens do produto para não serem principais
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId)

    // Definir a imagem selecionada como principal
    const { error: updateError } = await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId)

    if (updateError) {
      console.error("Erro ao definir imagem como principal:", updateError)
      throw new Error(`Erro ao definir imagem como principal: ${updateError.message}`)
    }

    console.log(`Imagem ${imageId} definida como principal com sucesso`)
    revalidatePath(`/produtos/${productId}`)
    revalidatePath(`/products/${productId}`)
    revalidatePath(`/store/products/${productId}`)
    revalidatePath(`/store`)

    return true
  } catch (error) {
    console.error("Erro ao definir imagem como principal:", error)
    return false
  }
}
