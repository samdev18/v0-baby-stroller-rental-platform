"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RelatorioFluxoCaixa() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const dataMensal = [
    { name: "01/06", entradas: 850, saidas: 320, saldo: 530 },
    { name: "02/06", entradas: 720, saidas: 150, saldo: 570 },
    { name: "03/06", entradas: 650, saidas: 200, saldo: 450 },
    { name: "04/06", entradas: 900, saidas: 280, saldo: 620 },
    { name: "05/06", entradas: 780, saidas: 350, saldo: 430 },
    { name: "06/06", entradas: 810, saidas: 290, saldo: 520 },
    { name: "07/06", entradas: 950, saidas: 310, saldo: 640 },
    { name: "08/06", entradas: 870, saidas: 380, saldo: 490 },
    { name: "09/06", entradas: 920, saidas: 420, saldo: 500 },
    { name: "10/06", entradas: 890, saidas: 350, saldo: 540 },
    { name: "11/06", entradas: 750, saidas: 280, saldo: 470 },
    { name: "12/06", entradas: 830, saidas: 310, saldo: 520 },
    { name: "13/06", entradas: 880, saidas: 340, saldo: 540 },
    { name: "14/06", entradas: 910, saidas: 390, saldo: 520 },
    { name: "15/06", entradas: 940, saidas: 420, saldo: 520 },
    { name: "16/06", entradas: 820, saidas: 350, saldo: 470 },
    { name: "17/06", entradas: 790, saidas: 310, saldo: 480 },
    { name: "18/06", entradas: 850, saidas: 290, saldo: 560 },
    { name: "19/06", entradas: 920, saidas: 380, saldo: 540 },
    { name: "20/06", entradas: 970, saidas: 410, saldo: 560 },
    { name: "21/06", entradas: 890, saidas: 350, saldo: 540 },
    { name: "22/06", entradas: 830, saidas: 320, saldo: 510 },
    { name: "23/06", entradas: 860, saidas: 340, saldo: 520 },
    { name: "24/06", entradas: 910, saidas: 370, saldo: 540 },
    { name: "25/06", entradas: 950, saidas: 400, saldo: 550 },
    { name: "26/06", entradas: 880, saidas: 350, saldo: 530 },
    { name: "27/06", entradas: 840, saidas: 320, saldo: 520 },
    { name: "28/06", entradas: 870, saidas: 340, saldo: 530 },
    { name: "29/06", entradas: 920, saidas: 380, saldo: 540 },
    { name: "30/06", entradas: 980, saidas: 420, saldo: 560 },
  ]

  const dataSemanal = [
    { name: "Semana 1", entradas: 3870, saidas: 1350, saldo: 2520 },
    { name: "Semana 2", entradas: 4250, saidas: 1650, saldo: 2600 },
    { name: "Semana 3", entradas: 4350, saidas: 1740, saldo: 2610 },
    { name: "Semana 4", entradas: 5280, saidas: 1950, saldo: 3330 },
  ]

  const dataAnual = [
    { name: "Jan", entradas: 12500, saidas: 5800, saldo: 6700 },
    { name: "Fev", entradas: 13200, saidas: 6100, saldo: 7100 },
    { name: "Mar", entradas: 14100, saidas: 6300, saldo: 7800 },
    { name: "Abr", entradas: 13800, saidas: 6200, saldo: 7600 },
    { name: "Mai", entradas: 14500, saidas: 6400, saldo: 8100 },
    { name: "Jun", entradas: 15750, saidas: 6320, saldo: 9430 },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.750,00</div>
            <p className="text-xs text-green-500">+8.6% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 6.320,00</div>
            <p className="text-xs text-red-500">+1.2% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Período</CardTitle>
            <CardDescription>Junho 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 9.430,00</div>
            <p className="text-xs text-green-500">+16.4% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mensal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mensal">Diário (Mês Atual)</TabsTrigger>
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
          <TabsTrigger value="anual">Mensal (Ano Atual)</TabsTrigger>
        </TabsList>

        <TabsContent value="mensal" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Fluxo de Caixa Diário - Junho 2023</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataMensal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$${value.toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                      undefined,
                    ]}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="entradas"
                    name="Entradas"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="saidas"
                    name="Saídas"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="saldo"
                    name="Saldo"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="semanal" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Fluxo de Caixa Semanal - Junho 2023</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataSemanal} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$${value.toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                      undefined,
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="entradas"
                    name="Entradas"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="saidas"
                    name="Saídas"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="saldo"
                    name="Saldo"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="anual" className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 text-lg font-medium">Fluxo de Caixa Mensal - 2023</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataAnual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      `R$${value.toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                      undefined,
                    ]}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="entradas"
                    name="Entradas"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="saidas"
                    name="Saídas"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="saldo"
                    name="Saldo"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-medium">Detalhamento de Transações</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Data</th>
                <th className="pb-2 text-left font-medium">Descrição</th>
                <th className="pb-2 text-left font-medium">Categoria</th>
                <th className="pb-2 text-right font-medium">Valor</th>
                <th className="pb-2 text-right font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">30/06/2023</td>
                <td className="py-2">Aluguel de Carrinho de Bebê #1258</td>
                <td className="py-2">Receita de Aluguel</td>
                <td className="py-2 text-right">R$ 350,00</td>
                <td className="py-2 text-right text-green-500">Entrada</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">29/06/2023</td>
                <td className="py-2">Manutenção de Patinete #P45</td>
                <td className="py-2">Manutenção</td>
                <td className="py-2 text-right">R$ 120,00</td>
                <td className="py-2 text-right text-red-500">Saída</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">28/06/2023</td>
                <td className="py-2">Aluguel de Patinete #P789</td>
                <td className="py-2">Receita de Aluguel</td>
                <td className="py-2 text-right">R$ 280,00</td>
                <td className="py-2 text-right text-green-500">Entrada</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">27/06/2023</td>
                <td className="py-2">Compra de Peças de Reposição</td>
                <td className="py-2">Estoque</td>
                <td className="py-2 text-right">R$ 180,00</td>
                <td className="py-2 text-right text-red-500">Saída</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">26/06/2023</td>
                <td className="py-2">Aluguel de Bicicleta #B123</td>
                <td className="py-2">Receita de Aluguel</td>
                <td className="py-2 text-right">R$ 320,00</td>
                <td className="py-2 text-right text-green-500">Entrada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
