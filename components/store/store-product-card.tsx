"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import { getProductImages } from "@/lib/upload-image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface ProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string
  is_primary: boolean
  created_at: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  daily_price: number
  category_name?: string
  stock_quantity: number
  primary_image_url?: string
  image_url?: string
  url?: string
}

interface StoreProductCardProps {
  product: Product
}

export function StoreProductCard({ product }: StoreProductCardProps) {
  const { addToCart } = useCart()
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Buscar imagens do produto
  useEffect(() => {
    async function loadImages() {
      try {
        const productImages = await getProductImages(product.id)
        if (productImages && productImages.length > 0) {
          setImages(productImages)
        }
      } catch (error) {
        console.error("Erro ao carregar imagens:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [product.id])

  // Formatar o preço corretamente
  const price = product.daily_price || product.price || 0
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)

  // Determinar a URL da imagem principal
  const primaryImageUrl =
    product.primary_image_url || product.image_url || product.url || "/diverse-products-still-life.png"

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      imageUrl: primaryImageUrl,
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/store/products/${product.id}`} className="block">
        {images.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={image.is_primary}
                      onError={() => setImageError(true)}
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={imageError ? "/diverse-products-still-life.png" : primaryImageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        )}
        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <p className="mt-2 font-semibold text-blue-600">
            {formattedPrice}
            <span className="ml-1 text-xs text-gray-500">por dia</span>
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Alugar
        </Button>
        <Button asChild size="sm" className="flex-1">
          <Link href={`/store/products/${product.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
