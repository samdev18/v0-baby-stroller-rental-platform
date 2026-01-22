"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type SortField = "produto" | "receita" | "custo" | "lucro" | "margem"
type SortDirection = "asc" | "desc"

export function LucratividadeProdutoTable() {
  const [sortField, setSortField] = useState<SortField>("lucro")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Dados simulados para a tabela
  const produtos = [
    {
      id: 1,
      produto: "Carrinho de Bebê Modelo X",
      categoria: "Carrinhos de Bebê",
      receita: 3500.0,
      custo: 1200.0,
      lucro: 2300.0,
      margem: 65.71,
    },
    {
      id: 2,
      produto: "Patinete Elétrico Pro",
      categoria: "Patinetes",
      receita: 2800.0,
      custo: 1050.0,
      lucro: 1750.0,
      margem: 62.5,
    },
    {
      id: 3,
      produto: "Bicicleta Infantil Aro 16",
      categoria: "Bicicletas",
      receita: 1920.0,
      custo: 780.0,
      lucro: 1140.0,
      margem: 59.38,
    },
    {
      id: 4,
      produto: "Carrinho de Bebê Duplo",
      categoria: "Carrinhos de Bebê",
      receita: 2520.0,
      custo: 950.0,
      lucro: 1570.0,
      margem: 62.3,
    },
    {
      id: 5,
      produto: "Patinete Dobrável",
      categoria: "Patinetes",
      receita: 1750.0,
      custo: 680.0,
      lucro: 1070.0,
      margem: 61.14,
    },
    {
      id: 6,
      produto: "Bicicleta Mountain Bike",
      categoria: "Bicicletas",
      receita: 1520.0,
      custo: 650.0,
      lucro: 870.0,
      margem: 57.24,
    },
    {
      id: 7,
      produto: "Carrinho de Bebê Leve",
      categoria: "Carrinhos de Bebê",
      receita: 1650.0,
      custo: 620.0,
      lucro: 1030.0,
      margem: 62.42,
    },
  ]

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedProdutos = [...produtos].sort((a, b) => {
    if (sortField === "produto") {
      return sortDirection === "asc" ? a.produto.localeCompare(b.produto) : b.produto.localeCompare(a.produto)
    }

    if (sortField === "receita") {
      return sortDirection === "asc" ? a.receita - b.receita : b.receita - a.receita
    }

    if (sortField === "custo") {
      return sortDirection === "asc" ? a.custo - b.custo : b.custo - a.custo
    }

    if (sortField === "lucro") {
      return sortDirection === "asc" ? a.lucro - b.lucro : b.lucro - a.lucro
    }

    if (sortField === "margem") {
      return sortDirection === "asc" ? a.margem - b.margem : b.margem - a.margem
    }

    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium cursor-pointer" onClick={() => handleSort("produto")}>
              <div className="flex items-center">
                Produto
                <SortIcon field="produto" />
              </div>
            </th>
            <th className="pb-2 text-left font-medium">Categoria</th>
            <th className="pb-2 text-right font-medium cursor-pointer" onClick={() => handleSort("receita")}>
              <div className="flex items-center justify-end">
                Receita
                <SortIcon field="receita" />
              </div>
            </th>
            <th className="pb-2 text-right font-medium cursor-pointer" onClick={() => handleSort("custo")}>
              <div className="flex items-center justify-end">
                Custo
                <SortIcon field="custo" />
              </div>
            </th>
            <th className="pb-2 text-right font-medium cursor-pointer" onClick={() => handleSort("lucro")}>
              <div className="flex items-center justify-end">
                Lucro
                <SortIcon field="lucro" />
              </div>
            </th>
            <th className="pb-2 text-right font-medium cursor-pointer" onClick={() => handleSort("margem")}>
              <div className="flex items-center justify-end">
                Margem
                <SortIcon field="margem" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedProdutos.map((produto) => (
            <tr key={produto.id} className="border-b">
              <td className="py-2">{produto.produto}</td>
              <td className="py-2">{produto.categoria}</td>
              <td className="py-2 text-right">R$ {produto.receita.toFixed(2)}</td>
              <td className="py-2 text-right">R$ {produto.custo.toFixed(2)}</td>
              <td className="py-2 text-right">R$ {produto.lucro.toFixed(2)}</td>
              <td className="py-2">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 text-right">{produto.margem.toFixed(2)}%</div>
                  <div className="w-24">
                    <Progress value={produto.margem} className="h-2" />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
