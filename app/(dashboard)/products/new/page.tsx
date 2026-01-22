import { ProductForm } from "@/components/product-form"
import { listProductCategories } from "@/lib/products"

export default async function NewProductPage() {
  const categories = await listProductCategories()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">New Product</h1>
        </div>
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <ProductForm categories={categories} />
          </div>
        </div>
      </main>
    </div>
  )
}
