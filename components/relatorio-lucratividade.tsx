"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucratividadeChart } from "@/components/lucratividade-chart"
import { MargemLucroChart } from "@/components/margem-lucro-chart"
import { LucratividadeProdutoTable } from "@/components/lucratividade-produto-table"

export function RelatorioLucratividade() {
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
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 9.430,00</div>
            <p className="text-xs text-green-500">+16.4% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">59.87%</div>
            <p className="text-xs text-green-500">+3.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">149.21%</div>
            <p className="text-xs text-green-500">+8.7% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Evolução de Lucratividade</h3>
          <div className="h-[350px]">
            <LucratividadeChart />
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Margem de Lucro</h3>
          <div className="h-[350px]">
            <MargemLucroChart />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-medium">Lucratividade por Produto</h3>
        <LucratividadeProdutoTable />
      </div>
    </div>
  )
}
