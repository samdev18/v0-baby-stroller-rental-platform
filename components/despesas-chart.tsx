"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DespesasChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const data = [
    { name: "Jan", despesa: 5800 },
    { name: "Fev", despesa: 6100 },
    { name: "Mar", despesa: 6300 },
    { name: "Abr", despesa: 6200 },
    { name: "Mai", despesa: 6400 },
    { name: "Jun", despesa: 6320 },
  ]

  if (!mounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) =>
            `R$${value.toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}`
          }
        />
        <Tooltip
          formatter={(value) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Despesa"]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="despesa"
          name="Despesa"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
