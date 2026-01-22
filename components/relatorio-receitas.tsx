"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceitasChart } from "@/components/receitas-chart"
import { ReceitasCategoriaChart } from "@/components/receitas-categoria-chart"
import { ReceitasTable } from "@/components/receitas-table"

export function RelatorioReceitas() {
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
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.750,00</div>
            <p className="text-xs text-green-500">+8.6% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 285,00</div>
            <p className="text-xs text-green-500">+3.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Aluguéis</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55</div>
            <p className="text-xs text-green-500">+5.8% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Evolução de Receitas</h3>
          <div className="h-[350px]">
            <ReceitasChart />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Receitas por Categoria</h3>
          <div className="h-[350px]">
            <ReceitasCategoriaChart />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-medium">Detalhamento de Receitas</h3>
        <ReceitasTable />
      </div>
    </div>
  )
}
