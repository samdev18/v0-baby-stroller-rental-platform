"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Dados de exemplo para métodos de pagamento
const data = [
  { name: "Cartão de Crédito", value: 45 },
  { name: "PayPal", value: 25 },
  { name: "Transferência", value: 15 },
  { name: "Dinheiro", value: 10 },
  { name: "Cartão de Débito", value: 5 },
]

const COLORS = ["#2A3660", "#4C63B6", "#7E8ED9", "#A8B1E6", "#D4D9F6"]

export function PagamentosMetodos() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, "Porcentagem"]}
            contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
