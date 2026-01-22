import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StoragesTable } from "@/components/storages-table"
import { listStorages } from "@/lib/storages"

export default async function StoragesPage() {
  const storages = await listStorages()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Storages</h1>
            <p className="text-sm text-muted-foreground">Gerenciamento de locais de armazenamento de produtos</p>
          </div>
          <Link href="/storages/novo">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Storage
            </Button>
          </Link>
        </div>

        <StoragesTable storages={storages} />
      </main>
    </div>
  )
}
