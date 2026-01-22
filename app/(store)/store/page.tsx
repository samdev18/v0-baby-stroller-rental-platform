import { Suspense } from "react"
import { getStoreProducts, getProductCategories } from "@/lib/store-products"
import { StoreHero } from "@/components/store/store-hero"
import { StoreFeatures } from "@/components/store/store-features"
import { StoreProductList } from "@/components/store/store-product-list"
import { StoreProductListSkeleton } from "@/components/store/store-product-list-skeleton"
import { StoreFooter } from "@/components/store/store-footer"
import { updateStoreProductsWithImages } from "@/lib/product-images"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function StorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const categoryId = typeof searchParams.category === "string" ? searchParams.category : undefined

  // Buscar produtos
  const { products, total } = await getStoreProducts(page, 9, categoryId)

  // Atualizar produtos com imagens primárias do banco de dados
  const productsWithImages = await updateStoreProductsWithImages(products)

  // Buscar categorias
  const categories = await getProductCategories()

  console.log(
    "Produtos com imagens:",
    JSON.stringify(
      productsWithImages.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        primary_image_url: p.primary_image_url,
      })),
      null,
      2,
    ),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <StoreHero />
      <StoreFeatures />
      <div className="container px-4 py-8 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Nossos Produtos para Aluguel</h2>
        <Suspense fallback={<StoreProductListSkeleton />}>
          <StoreProductList
            products={productsWithImages}
            categories={categories}
            currentPage={page}
            totalProducts={total}
            selectedCategory={categoryId}
          />
        </Suspense>
      </div>
      <StoreFooter />
    </div>
  )
}
