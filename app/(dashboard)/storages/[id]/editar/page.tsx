import { notFound } from "next/navigation"
import { StorageForm } from "@/components/storage-form"
import { getStorageById } from "@/lib/storages"

interface EditStoragePageProps {
  params: {
    id: string
  }
}

export default async function EditStoragePage({ params }: EditStoragePageProps) {
  const storage = await getStorageById(params.id)

  if (!storage) {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Editar Storage: {storage.name}</h1>
          <p className="text-sm text-muted-foreground">Atualize as informações deste storage</p>
        </div>

        <div className="space-y-4">
          <StorageForm storage={storage} />
        </div>
      </main>
    </div>
  )
}
