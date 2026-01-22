"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ProdutosOcupacaoChart } from "@/components/produtos-ocupacao-chart"
import { ProdutosTable } from "@/components/produtos-table"
import { ProdutosReceitaChart } from "@/components/produtos-receita-chart"

export function RelatorioProdutos() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-medium">Taxa de Ocupação por Produto</h3>
            <ProdutosOcupacaoChart />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-medium">Receita por Tipo de Produto</h3>
            <ProdutosReceitaChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Desempenho dos Produtos</h3>
          <ProdutosTable />
        </CardContent>
      </Card>
    </div>
  )
}
