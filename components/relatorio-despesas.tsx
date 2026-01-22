"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DespesasChart } from "@/components/despesas-chart"
import { DespesasCategoriaChart } from "@/components/despesas-categoria-chart"
import { DespesasTable } from "@/components/despesas-table"

export function RelatorioDespesas() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 6.320,00</div>
            <p className="text-xs text-red-500">+1.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maior Categoria</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manutenção</div>
            <p className="text-xs">33% das despesas totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Despesa por Produto</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 115,00</div>
            <p className="text-xs text-green-500">-3.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Evolução de Despesas</h3>
          <div className="h-[350px]">
            <DespesasChart />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Despesas por Categoria</h3>
          <div className="h-[350px]">
            <DespesasCategoriaChart />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-medium">Detalhamento de Despesas</h3>
        <DespesasTable />
      </div>
    </div>
  )
}
