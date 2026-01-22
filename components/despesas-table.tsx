"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type SortField = "data" | "descricao" | "categoria" | "valor"
type SortDirection = "asc" | "desc"

export function DespesasTable() {
  const [sortField, setSortField] = useState<SortField>("data")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Dados simulados para a tabela
  const despesas = [
    { id: 1, data: "29/06/2023", descricao: "Manutenç��o de Patinete #P45", categoria: "Manutenção", valor: 120.0 },
    { id: 2, data: "27/06/2023", descricao: "Compra de Peças de Reposição", categoria: "Estoque", valor: 180.0 },
    { id: 3, data: "25/06/2023", descricao: "Pagamento de Funcionário", categoria: "Salários", valor: 1950.0 },
    { id: 4, data: "22/06/2023", descricao: "Anúncios no Instagram", categoria: "Marketing", valor: 350.0 },
    { id: 5, data: "20/06/2023", descricao: "Aluguel do Espaço", categoria: "Aluguel", valor: 1070.0 },
    { id: 6, data: "18/06/2023", descricao: "Manutenção de Bicicleta #B78", categoria: "Manutenção", valor: 150.0 },
    { id: 7, data: "15/06/2023", descricao: "Compra de Material de Limpeza", categoria: "Operacional", valor: 85.0 },
    { id: 8, data: "12/06/2023", descricao: "Anúncios no Google", categoria: "Marketing", valor: 420.0 },
    { id: 9, data: "10/06/2023", descricao: "Manutenção de Carrinho #C32", categoria: "Manutenção", valor: 130.0 },
    { id: 10, data: "05/06/2023", descricao: "Compra de Ferramentas", categoria: "Equipamentos", valor: 280.0 },
  ]

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedDespesas = [...despesas].sort((a, b) => {
    if (sortField === "data") {
      const dateA = new Date(a.data.split("/").reverse().join("-"))
      const dateB = new Date(b.data.split("/").reverse().join("-"))
      return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    }

    if (sortField === "descricao") {
      return sortDirection === "asc" ? a.descricao.localeCompare(b.descricao) : b.descricao.localeCompare(a.descricao)
    }

    if (sortField === "categoria") {
      return sortDirection === "asc" ? a.categoria.localeCompare(b.categoria) : b.categoria.localeCompare(a.categoria)
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
            <th className="pb-2 text-left font-medium cursor-pointer" onClick={() => handleSort("descricao")}>
              <div className="flex items-center">
                Descrição
                <SortIcon field="descricao" />
              </div>
            </th>
            <th className="pb-2 text-left font-medium cursor-pointer" onClick={() => handleSort("categoria")}>
              <div className="flex items-center">
                Categoria
                <SortIcon field="categoria" />
              </div>
            </th>
            <th className="pb-2 text-right font-medium cursor-pointer" onClick={() => handleSort("valor")}>
              <div className="flex items-center justify-end">
                Valor
                <SortIcon field="valor" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedDespesas.map((despesa) => (
            <tr key={despesa.id} className="border-b">
              <td className="py-2">{despesa.data}</td>
              <td className="py-2">{despesa.descricao}</td>
              <td className="py-2">{despesa.categoria}</td>
              <td className="py-2 text-right">R$ {despesa.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="py-2 text-right font-medium">
              Total
            </td>
            <td className="py-2 text-right font-medium">
              R$ {despesas.reduce((sum, item) => sum + item.valor, 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
