import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getClientById } from "@/lib/clients"
import { ClientesDetalhes } from "@/components/clientes-detalhes"

interface ClientePageProps {
  params: {
    id: string
  }
}

export default async function ClientePage({ params }: ClientePageProps) {
  try {
    const client = await getClientById(params.id)

    return (
      <div className="space-y-6">
        <Suspense fallback={<div>Carregando detalhes do cliente...</div>}>
          <ClientesDetalhes client={client} />
        </Suspense>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
