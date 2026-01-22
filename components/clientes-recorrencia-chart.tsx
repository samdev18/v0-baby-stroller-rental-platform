"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Dados de exemplo para o gráfico de recorrência de clientes
const data = [
  { name: "Primeira Vez", value: 45 },
  { name: "Ocasional (2-3 vezes)", value: 30 },
  { name: "Recorrente (4-6 vezes)", value: 15 },
  { name: "Frequente (7+ vezes)", value: 10 },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(217, 91%, 60%)", // Azul claro
  "hsl(var(--success))",
  "hsl(var(--warning))",
]

export function ClientesRecorrenciaChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Percentual"]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
