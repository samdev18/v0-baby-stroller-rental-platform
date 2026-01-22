import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import { ProductMaintenance } from "@/components/product-maintenance"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product not found",
    }
  }

  return {
    title: `Maintenance - ${product.name}`,
  }
}

export default async function ProductMaintenancePage({ params }: PageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Maintenance</h1>
        <p className="text-muted-foreground">View and manage maintenance records for {product.name}.</p>
      </div>
      <div className="grid gap-6">
        <ProductMaintenance productId={params.id} />
      </div>
    </div>
  )
}
