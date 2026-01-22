import { getRelatedProducts } from "@/lib/store-products"
import { StoreProductCard } from "@/components/store/store-product-card"

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, currentProductId)

  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <StoreProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
