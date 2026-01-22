"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function ReceitasChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const data = [
    { name: "Jan", receita: 12500 },
    { name: "Fev", receita: 13200 },
    { name: "Mar", receita: 14100 },
    { name: "Abr", receita: 13800 },
    { name: "Mai", receita: 14500 },
    { name: "Jun", receita: 15750 },
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
          formatter={(value) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Receita"]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="receita"
          name="Receita"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
