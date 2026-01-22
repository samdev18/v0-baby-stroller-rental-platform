"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function DespesasCategoriaChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dados simulados para o gráfico
  const data = [
    { name: "Manutenção", value: 2100, color: "#ef4444" },
    { name: "Salários", value: 1950, color: "#f97316" },
    { name: "Marketing", value: 1200, color: "#eab308" },
    { name: "Aluguel", value: 1070, color: "#8b5cf6" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Despesa"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
