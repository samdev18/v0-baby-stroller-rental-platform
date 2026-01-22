"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Dados de exemplo para o gráfico de receita por tipo de produto
const data = [
  { name: "Carrinhos de Bebê", value: 12800 },
  { name: "Scooters Elétricas", value: 10300 },
  { name: "Cadeiras de Rodas", value: 5800 },
  { name: "Patinetes", value: 3600 },
  { name: "Acessórios", value: 2100 },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(217, 91%, 60%)", // Azul claro
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(271, 91%, 65%)", // Roxo
]

export function ProdutosReceitaChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
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
            formatter={(value: number) => [`$${value}`, "Receita"]}
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
