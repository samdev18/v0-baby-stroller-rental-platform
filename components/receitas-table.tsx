"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type SortField = "data" | "cliente" | "produto" | "valor"
type SortDirection = "asc" | "desc"

export function ReceitasTable() {
  const [sortField, setSortField] = useState<SortField>("data")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Dados simulados para a tabela
  const receitas = [
    {
      id: 1,
      data: "30/06/2023",
      cliente: "Maria Silva",
      produto: "Carrinho de Bebê Modelo X",
      categoria: "Carrinhos de Bebê",
      valor: 350.0,
    },
    {
      id: 2,
      data: "28/06/2023",
      cliente: "João Santos",
      produto: "Patinete Elétrico Pro",
      categoria: "Patinetes",
      valor: 280.0,
    },
    {
      id: 3,
      data: "26/06/2023",
      cliente: "Ana Oliveira",
      produto: "Bicicleta Infantil Aro 16",
      categoria: "Bicicletas",
      valor: 320.0,
    },
    {
      id: 4,
      data: "25/06/2023",
      cliente: "Carlos Pereira",
      produto: "Carrinho de Bebê Duplo",
      categoria: "Carrinhos de Bebê",
      valor: 420.0,
    },
    {
      id: 5,
      data: "23/06/2023",
      cliente: "Fernanda Lima",
      produto: "Patinete Dobrável",
      categoria: "Patinetes",
      valor: 250.0,
    },
    {
      id: 6,
      data: "21/06/2023",
      cliente: "Roberto Alves",
      produto: "Bicicleta Mountain Bike",
      categoria: "Bicicletas",
      valor: 380.0,
    },
    {
      id: 7,
      data: "20/06/2023",
      cliente: "Juliana Costa",
      produto: "Carrinho de Bebê Leve",
      categoria: "Carrinhos de Bebê",
      valor: 330.0,
    },
    {
      id: 8,
      data: "18/06/2023",
      cliente: "Pedro Souza",
      produto: "Patinete Infantil",
      categoria: "Patinetes",
      valor: 220.0,
    },
    {
      id: 9,
      data: "16/06/2023",
      cliente: "Mariana Dias",
      produto: "Bicicleta Urbana",
      categoria: "Bicicletas",
      valor: 350.0,
    },
    {
      id: 10,
      data: "15/06/2023",
      cliente: "Lucas Ferreira",
      produto: "Carrinho de Bebê Compacto",
      categoria: "Carrinhos de Bebê",
      valor: 310.0,
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

  const sortedReceitas = [...receitas].sort((a, b) => {
    if (sortField === "data") {
      const dateA = new Date(a.data.split("/").reverse().join("-"))
      const dateB = new Date(b.data.split("/").reverse().join("-"))
      return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    }

    if (sortField === "cliente") {
      return sortDirection === "asc" ? a.cliente.localeCompare(b.cliente) : b.cliente.localeCompare(a.cliente)
    }

    if (sortField === "produto") {
      return sortDirection === "asc" ? a.produto.localeCompare(b.produto) : b.produto.localeCompare(a.produto)
    }

    if (sortField === "valor") {
      return sortDirection === "asc" ? a.valor - b.valor : b.valor - a.valor
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
            <th className="pb-2 text-left font-medium cursor-pointer" onClick={() => handleSort("data")}>
              <div className="flex items-center">
                Data
                <SortIcon field="data" />
              </div>
            </th>
            <th className="pb-2 text-left font-medium cursor-pointer" onClick={() => handleSort("cliente")}>
              <div className="flex items-center">
                Cliente
                <SortIcon field="cliente" />
              </div>
            </th>
            <th className="pb-2 text-left font-medium cursor-pointer" onClick={() => handleSort("produto")}>
              <div className="flex items-center">
                Produto
                <SortIcon field="produto" />
              </div>
            </th>
            <th className="pb-2 text-left font-medium">Categoria</th>
            <th className="pb-2 text-right font-medium cursor-pointer" onClick={() => handleSort("valor")}>
              <div className="flex items-center justify-end">
                Valor
                <SortIcon field="valor" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedReceitas.map((receita) => (
            <tr key={receita.id} className="border-b">
              <td className="py-2">{receita.data}</td>
              <td className="py-2">{receita.cliente}</td>
              <td className="py-2">{receita.produto}</td>
              <td className="py-2">{receita.categoria}</td>
              <td className="py-2 text-right">R$ {receita.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="py-2 text-right font-medium">
              Total
            </td>
            <td className="py-2 text-right font-medium">
              R$ {receitas.reduce((sum, item) => sum + item.valor, 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
