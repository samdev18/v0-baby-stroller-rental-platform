"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

// Dados de exemplo para o gráfico de taxa de ocupação
const data = [
  {
    name: "Carrinho Bebê",
    ocupacao: 85,
  },
  {
    name: "Scooter Elétrica",
    ocupacao: 70,
  },
  {
    name: "Cadeira de Rodas",
    ocupacao: 65,
  },
  {
    name: "Patinete",
    ocupacao: 55,
  },
  {
    name: "Kit Segurança",
    ocupacao: 90,
  },
]

export function ProdutosOcupacaoChart() {
  const getBarColor = (ocupacao: number) => {
    if (ocupacao >= 80) return "hsl(var(--success))"
    if (ocupacao >= 60) return "hsl(var(--warning))"
    return "hsl(var(--destructive))"
  }

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
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-sm" tick={{ fill: "hsl(var(--foreground))" }} />
          <YAxis className="text-sm" tick={{ fill: "hsl(var(--foreground))" }} tickFormatter={(value) => `${value}%`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [`${value}%`, "Taxa de Ocupação"]}
          />
          <Bar dataKey="ocupacao" radius={[4, 4, 0, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.ocupacao)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
