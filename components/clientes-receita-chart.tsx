"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Dados de exemplo para o gráfico de receita por cliente
const data = [
  {
    name: "Silva",
    valor: 1250,
  },
  {
    name: "Santos",
    valor: 980,
  },
  {
    name: "Oliveira",
    valor: 850,
  },
  {
    name: "Costa",
    valor: 780,
  },
  {
    name: "Martins",
    valor: 720,
  },
  {
    name: "Souza",
    valor: 680,
  },
  {
    name: "Ferreira",
    valor: 650,
  },
  {
    name: "Nunes",
    valor: 580,
  },
]

export function ClientesReceitaChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
          <XAxis
            type="number"
            className="text-sm"
            tick={{ fill: "hsl(var(--foreground))" }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            dataKey="name"
            type="category"
            className="text-sm"
            tick={{ fill: "hsl(var(--foreground))" }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [`$${value}`, "Receita Total"]}
          />
          <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
