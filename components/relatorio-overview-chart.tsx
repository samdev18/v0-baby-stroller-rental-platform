"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function RelatorioOverviewChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const data = [
    {
      name: "Jan",
      receita: 12500,
      despesa: 5800,
      lucro: 6700,
    },
    {
      name: "Fev",
      receita: 13200,
      despesa: 6100,
      lucro: 7100,
    },
    {
      name: "Mar",
      receita: 14100,
      despesa: 6300,
      lucro: 7800,
    },
    {
      name: "Abr",
      receita: 13800,
      despesa: 6200,
      lucro: 7600,
    },
    {
      name: "Mai",
      receita: 14500,
      despesa: 6400,
      lucro: 8100,
    },
    {
      name: "Jun",
      receita: 15750,
      despesa: 6320,
      lucro: 9430,
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) =>
            `R$${value.toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}`
          }
        />
        <Tooltip
          formatter={(value) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, undefined]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Bar dataKey="receita" name="Receita" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="lucro" name="Lucro" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
