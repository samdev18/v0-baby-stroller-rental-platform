import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import { NovaManutencaoForm } from "@/components/nova-manutencao-form"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const produto = await getProductById(params.id)

  if (!produto) {
    return {
      title: "Produto não encontrado",
    }
  }

  return {
    title: `Nova Manutenção - ${produto.name}`,
  }
}

export default async function ProdutoManutencaoPage({ params }: PageProps) {
  const produto = await getProductById(params.id)

  if (!produto) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova Manutenção</h1>
        <p className="text-muted-foreground">Registre uma nova manutenção para o produto {produto.name}.</p>
      </div>
      <div className="grid gap-6">
        <NovaManutencaoForm produtoId={params.id} />
      </div>
    </div>
  )
}
