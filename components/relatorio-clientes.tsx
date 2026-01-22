"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ClientesRecorrenciaChart } from "@/components/clientes-recorrencia-chart"
import { ClientesTable } from "@/components/clientes-table"
import { ClientesReceitaChart } from "@/components/clientes-receita-chart"

export function RelatorioClientes() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-medium">Distribuição de Recorrência</h3>
            <ClientesRecorrenciaChart />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-medium">Receita por Cliente</h3>
            <ClientesReceitaChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Top Clientes por Valor</h3>
          <ClientesTable />
        </CardContent>
      </Card>
    </div>
  )
}
