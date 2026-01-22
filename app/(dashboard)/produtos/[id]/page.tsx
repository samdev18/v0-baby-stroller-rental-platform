import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import { ProdutoDetalhes } from "@/components/produto-detalhes"
import { ProdutoReservas } from "@/components/produto-reservas"
import { ProdutoManutencoes } from "@/components/produto-manutencoes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    title: `Produto: ${produto.name}`,
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const produto = await getProductById(params.id, true)

  if (!produto) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{produto.name}</h1>
        <p className="text-muted-foreground">Detalhes e informações do produto.</p>
      </div>

      <Tabs defaultValue="detalhes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="manutencoes">Manutenções</TabsTrigger>
        </TabsList>
        <TabsContent value="detalhes" className="space-y-4">
          <ProdutoDetalhes produto={produto} />
        </TabsContent>
        <TabsContent value="reservas" className="space-y-4">
          <ProdutoReservas produtoId={params.id} />
        </TabsContent>
        <TabsContent value="manutencoes" className="space-y-4">
          <ProdutoManutencoes produtoId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
