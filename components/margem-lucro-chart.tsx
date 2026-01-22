"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function MargemLucroChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const data = [
    { name: "Jan", margem: 53.6 },
    { name: "Fev", margem: 53.8 },
    { name: "Mar", margem: 55.3 },
    { name: "Abr", margem: 55.1 },
    { name: "Mai", margem: 55.9 },
    { name: "Jun", margem: 59.9 },
  ]

  if (!mounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${value}%`} domain={[50, 65]} />
        <Tooltip
          formatter={(value) => [`${value.toFixed(2)}%`, "Margem de Lucro"]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="margem"
          name="Margem de Lucro"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
