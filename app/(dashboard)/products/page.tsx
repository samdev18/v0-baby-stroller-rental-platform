import { Suspense } from "react"
import { listProductCategories, listProducts } from "@/lib/products"
import { ProductsTable } from "@/components/products-table"
import { ProductsTableSkeleton } from "@/components/products-table-skeleton"
import { updateProductsWithImages } from "@/lib/product-images"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProductsPage() {
  // Load categories from database with error handling
  let categories = []
  try {
    categories = await listProductCategories()
  } catch (error) {
    console.error("Error loading categories:", error)
    // Continue with empty categories list
  }

  const products = await listProducts()
  const productsWithImages = await updateProductsWithImages(products)

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
            <p className="text-sm text-muted-foreground">Manage products available for rental</p>
          </div>
          <Link href="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          </Link>
        </div>

        {categories.length > 0 ? (
          <Tabs defaultValue="all">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="all" className="border-none p-0">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>View and manage all products available for rental.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Suspense fallback={<div>Loading products...</div>}>
                    <ProductsTableWrapper category={null} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="border-none p-0">
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      View and manage products in the {category.name.toLowerCase()} category.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Suspense fallback={<div>Loading products...</div>}>
                      <ProductsTableWrapper category={category.id} />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>No product categories found. You can still view all products below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading products...</div>}>
                <ProductsTableWrapper category={null} />
              </Suspense>
            </CardContent>
          </Card>
        )}
      </main> */}
      <div className="space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Suspense fallback={<ProductsTableSkeleton />}>
          <ProductsTable products={productsWithImages} />
        </Suspense>
      </div>
    </div>
  )
}
