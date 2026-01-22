import { notFound } from "next/navigation"
import Link from "next/link"
import { Edit, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getStorageById } from "@/lib/storages"
import { getStorageProducts } from "@/lib/storages"
import { StorageProductsTable } from "@/components/storage-products-table"

interface StorageDetailPageProps {
  params: {
    id: string
  }
}

export default async function StorageDetailPage({ params }: StorageDetailPageProps) {
  const storage = await getStorageById(params.id)

  if (!storage) {
    notFound()
  }

  const productsInStorage = await getStorageProducts(params.id)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/storages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold md:text-2xl">{storage.name}</h1>
              <p className="text-sm text-muted-foreground">
                {storage.address}, {storage.city}, {storage.state}
              </p>
            </div>
            <Link href={`/storages/${storage.id}/editar`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Produtos neste Storage</h2>
          {productsInStorage.length > 0 ? (
            <StorageProductsTable products={productsInStorage} />
          ) : (
            <p className="mt-2 text-muted-foreground">
              Nenhuma unidade de produto está atualmente alocada neste storage.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
