"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Dados de exemplo para o gráfico
const data = [
  {
    name: "Jan",
    total: 1200,
    confirmado: 900,
    pendente: 300,
  },
  {
    name: "Fev",
    total: 1500,
    confirmado: 1200,
    pendente: 300,
  },
  {
    name: "Mar",
    total: 1300,
    confirmado: 1000,
    pendente: 300,
  },
  {
    name: "Abr",
    total: 1600,
    confirmado: 1300,
    pendente: 300,
  },
  {
    name: "Mai",
    total: 1800,
    confirmado: 1400,
    pendente: 400,
  },
  {
    name: "Jun",
    total: 2000,
    confirmado: 1600,
    pendente: 400,
  },
  {
    name: "Jul",
    total: 2200,
    confirmado: 1800,
    pendente: 400,
  },
]

export function PagamentosChart() {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Total",
          color: "hsl(var(--primary))",
        },
        confirmado: {
          label: "Confirmado",
          color: "hsl(var(--success))",
        },
        pendente: {
          label: "Pendente",
          color: "hsl(var(--warning))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="confirmado" stroke="var(--color-confirmado)" strokeWidth={2} />
          <Line type="monotone" dataKey="pendente" stroke="var(--color-pendente)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
