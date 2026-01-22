import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProductImageUpload } from "@/components/admin/product-image-upload"
import { ProductImageGallery } from "@/components/admin/product-image-gallery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

interface ProductImagesPageProps {
  params: {
    id: string
  }
}

export default function ProductImagesPage({ params }: ProductImagesPageProps) {
  const { id } = params

  if (!id) {
    return notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Gerenciar Imagens do Produto</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Imagem</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageUpload productId={id} />
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Imagens do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              }
            >
              <ProductImageGallery productId={id} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
