import Image from "next/image"
import Link from "next/link"
import { Edit, PenToolIcon as Tool } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProdutoReservas } from "@/components/produto-reservas"
import { DeleteProdutoDialog } from "@/components/delete-produto-dialog"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/products"

interface ProdutoDetalhesProps {
  produto: Product
}

export function ProdutoDetalhes({ produto }: ProdutoDetalhesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>Detalhes e especificações do produto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
              <Image
                src={produto.image_url || "/placeholder.svg?height=160&width=160&query=produto"}
                alt={produto.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              <h2 className="text-xl font-semibold">{produto.name}</h2>
              <p className="text-sm text-muted-foreground">{produto.code}</p>
              <Badge variant={produto.is_active ? "default" : "destructive"}>
                {produto.is_active ? "Ativo" : "Inativo"}
              </Badge>
              {produto.is_featured && <Badge variant="secondary">Em Destaque</Badge>}
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium">Categoria</h3>
              <p>{produto.category?.name || "Sem categoria"}</p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Valores</h3>
              <p>Diária: {formatCurrency(produto.daily_price)}</p>
              {produto.purchase_price && <p>Compra: {formatCurrency(produto.purchase_price)}</p>}
            </div>
            <div>
              <h3 className="mb-2 font-medium">Estoque</h3>
              <p>Total: {produto.total_stock} unidades</p>
              <p>Disponível: {produto.available_stock} unidades</p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Especificações</h3>
              {produto.brand && <p>Marca: {produto.brand}</p>}
              {produto.model && <p>Modelo: {produto.model}</p>}
              {produto.color && <p>Cor: {produto.color}</p>}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-medium">Descrição</h3>
            <p className="text-sm text-muted-foreground">{produto.description || "Sem descrição disponível."}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {produto.weight && (
              <div>
                <h3 className="mb-2 font-medium">Peso</h3>
                <p>{produto.weight} kg</p>
              </div>
            )}
            {produto.dimensions && (
              <div>
                <h3 className="mb-2 font-medium">Dimensões</h3>
                <p>{produto.dimensions} cm</p>
              </div>
            )}
          </div>

          {produto.notes && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 font-medium">Observações</h3>
                <p className="text-sm text-muted-foreground">{produto.notes}</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/produtos/${produto.id}/editar`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Produto
            </Button>
          </Link>
          <DeleteProdutoDialog id={produto.id} nome={produto.name} />
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manutenções</CardTitle>
                <CardDescription>Histórico de manutenções do produto</CardDescription>
              </div>
              <Link href={`/produtos/${produto.id}/manutencoes`}>
                <Button variant="outline" size="sm">
                  <Tool className="mr-2 h-4 w-4" />
                  Gerenciar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse o histórico completo de manutenções deste produto clicando no botão "Gerenciar".
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reservas</CardTitle>
            <CardDescription>Histórico de reservas deste produto</CardDescription>
          </CardHeader>
          <CardContent>
            <ProdutoReservas produtoId={produto.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
