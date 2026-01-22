import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import { ProductUnitsManagement } from "@/components/product-units-management"

interface ProductUnitsPageProps {
  params: {
    id: string
  }
}

export default async function ProductUnitsPage({ params }: ProductUnitsPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ProductUnitsManagement productId={product.id} productName={product.name} />
      </main>
    </div>
  )
}
