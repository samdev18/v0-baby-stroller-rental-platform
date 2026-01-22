import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/store-products"
import { ProductDetails } from "@/components/store/product-details"
import { ProductDetailsSkeleton } from "@/components/store/product-details-skeleton"
import { ProductFeatures } from "@/components/store/product-features"
import { RelatedProducts } from "@/components/store/related-products"
import { RelatedProductsSkeleton } from "@/components/store/related-products-skeleton"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetails product={product} />
        </Suspense>

        <ProductFeatures product={product} />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Você também pode gostar</h2>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
