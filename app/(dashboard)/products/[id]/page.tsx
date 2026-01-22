import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import { ProductDetails } from "@/components/product-details"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id, true)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ProductDetails product={product} />
      </main>
    </div>
  )
}
