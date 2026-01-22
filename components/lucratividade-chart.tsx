"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function LucratividadeChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const data = [
    { name: "Jan", lucro: 6700 },
    { name: "Fev", lucro: 7100 },
    { name: "Mar", lucro: 7800 },
    { name: "Abr", lucro: 7600 },
    { name: "Mai", lucro: 8100 },
    { name: "Jun", lucro: 9430 },
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
          formatter={(value) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Lucro"]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Bar dataKey="lucro" name="Lucro Líquido" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
