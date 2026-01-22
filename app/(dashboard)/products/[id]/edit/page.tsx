import { notFound } from "next/navigation"
import { getProductById, listProductCategories } from "@/lib/products"
import { ProductForm } from "@/components/product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([getProductById(params.id), listProductCategories()])

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Edit Product</h1>
        </div>
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <ProductForm id={params.id} product={product} categories={categories} />
          </div>
        </div>
      </main>
    </div>
  )
}
