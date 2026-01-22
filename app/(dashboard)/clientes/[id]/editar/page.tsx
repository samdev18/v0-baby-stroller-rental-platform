import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getClientById } from "@/lib/clients"
import { ClienteEditForm } from "@/components/cliente-edit-form"

interface EditarClientePageProps {
  params: {
    id: string
  }
}

export default async function EditarClientePage({ params }: EditarClientePageProps) {
  try {
    const client = await getClientById(params.id)

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
        <Suspense fallback={<div>Carregando formulário...</div>}>
          <ClienteEditForm client={client} />
        </Suspense>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
