import { getStoreProducts, getProductCategories } from "@/lib/store-products"
import { StoreProductCard } from "./store-product-card"
import { StoreProductPagination } from "./store-product-pagination"
import { StoreProductFilter } from "./store-product-filter"
import { Suspense } from "react"

interface StoreProductListProps {
  searchParams?: {
    page?: string
    category?: string
  }
}

export async function StoreProductList({ searchParams }: StoreProductListProps) {
  const currentPage = Number(searchParams?.page) || 1
  const selectedCategory = searchParams?.category || undefined
  const pageSize = 9

  // Fetch products with pagination
  const { products, total } = await getStoreProducts(currentPage, pageSize, selectedCategory)

  // Fetch categories for filter
  const categories = await getProductCategories()

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>}>
        <StoreProductFilter categories={categories} selectedCategory={selectedCategory} />
      </Suspense>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-gray-500 mt-2">Try changing your filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>

          <StoreProductPagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  )
}
