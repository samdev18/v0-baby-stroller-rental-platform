"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Star, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { type ProductImage, deleteProductImage, setPrimaryImage, getProductImages } from "@/lib/upload-image"

interface ProductImageGalleryProps {
  productId: string
  className?: string
  onImageDeleted?: () => void
  onPrimaryChanged?: () => void
}

export function ProductImageGallery({
  productId,
  className = "",
  onImageDeleted,
  onPrimaryChanged,
}: ProductImageGalleryProps) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null)

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true)
        const productImages = await getProductImages(productId)
        setImages(productImages)
      } catch (error) {
        console.error("Erro ao carregar imagens:", error)
        toast({
          title: "Erro ao carregar imagens",
          description: "Não foi possível carregar as imagens do produto.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [productId])

  const handleDelete = async (imageId: string) => {
    try {
      setDeleting(imageId)
      const success = await deleteProductImage(imageId)

      if (success) {
        setImages((prevImages) => prevImages.filter((img) => img.id !== imageId))
        toast({
          title: "Imagem excluída",
          description: "A imagem foi excluída com sucesso.",
        })
        if (onImageDeleted) onImageDeleted()
      } else {
        throw new Error("Não foi possível excluir a imagem")
      }
    } catch (error) {
      console.error("Erro ao excluir imagem:", error)
      toast({
        title: "Erro ao excluir imagem",
        description: "Ocorreu um erro ao excluir a imagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      setSettingPrimary(imageId)
      const success = await setPrimaryImage(imageId)

      if (success) {
        setImages((prevImages) =>
          prevImages.map((img) => ({
            ...img,
            is_primary: img.id === imageId,
          })),
        )
        toast({
          title: "Imagem principal definida",
          description: "A imagem principal foi definida com sucesso.",
        })
        if (onPrimaryChanged) onPrimaryChanged()
      } else {
        throw new Error("Não foi possível definir a imagem como principal")
      }
    } catch (error) {
      console.error("Erro ao definir imagem principal:", error)
      toast({
        title: "Erro ao definir imagem principal",
        description: "Ocorreu um erro ao definir a imagem principal. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSettingPrimary(null)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <p className="text-gray-500">Nenhuma imagem encontrada para este produto.</p>
        <p className="text-sm text-gray-400">Adicione imagens usando o formulário acima.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ${className}`}>
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={image.url || "/placeholder.svg"}
              alt="Imagem do produto"
              fill
              className="object-cover"
              unoptimized
            />
            {image.is_primary && (
              <div className="absolute left-2 top-2 rounded-full bg-yellow-500 p-1">
                <Star className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <CardContent className="flex gap-2 p-2">
            {!image.is_primary && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleSetPrimary(image.id)}
                disabled={settingPrimary === image.id}
              >
                {settingPrimary === image.id ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Star className="mr-1 h-3 w-3" />
                )}
                Principal
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleDelete(image.id)}
              disabled={deleting === image.id}
            >
              {deleting === image.id ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-3 w-3" />
              )}
              Excluir
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
