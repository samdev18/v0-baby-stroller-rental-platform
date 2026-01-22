"use client"

import { useState } from "react"
import { ProdutosTable } from "@/components/produtos-table"
import { ProdutosFiltros, type ProdutoFiltros } from "@/components/produtos-filtros"

interface ProdutosTableWrapperProps {
  categoria: string | null
}

export function ProdutosTableWrapper({ categoria }: ProdutosTableWrapperProps) {
  const [filtros, setFiltros] = useState<ProdutoFiltros>({
    disponibilidade: "todos",
    categorias: [],
    valorMin: null,
    valorMax: null,
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ProdutosFiltros filtros={filtros} onFiltrosChange={setFiltros} />
      </div>
      <ProdutosTable categoria={categoria} filtros={filtros} />
    </div>
  )
}
