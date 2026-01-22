import { StorageForm } from "@/components/storage-form"

export default function NewStoragePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Novo Storage</h1>
          <p className="text-sm text-muted-foreground">Crie um novo local de armazenamento</p>
        </div>

        <div className="space-y-4">
          <StorageForm />
        </div>
      </main>
    </div>
  )
}
