"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type ProdutoFiltros = {
  disponibilidade: "todos" | "disponivel" | "indisponivel"
  categorias: string[]
  valorMin: number | null
  valorMax: number | null
}

interface ProdutosFiltrosProps {
  filtros: ProdutoFiltros
  onFiltrosChange: (filtros: ProdutoFiltros) => void
  className?: string
}

export function ProdutosFiltros({ filtros, onFiltrosChange, className }: ProdutosFiltrosProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Função para contar quantos filtros estão ativos
  const contarFiltrosAtivos = () => {
    let count = 0
    if (filtros.disponibilidade !== "todos") count++
    if (filtros.categorias.length > 0) count++
    if (filtros.valorMin !== null) count++
    if (filtros.valorMax !== null) count++
    return count
  }

  const filtrosAtivos = contarFiltrosAtivos()

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    onFiltrosChange({
      disponibilidade: "todos",
      categorias: [],
      valorMin: null,
      valorMax: null,
    })
  }

  // Função para atualizar a disponibilidade
  const atualizarDisponibilidade = (valor: "todos" | "disponivel" | "indisponivel") => {
    onFiltrosChange({
      ...filtros,
      disponibilidade: valor,
    })
  }

  // Função para atualizar as categorias
  const atualizarCategoria = (categoria: string, checked: boolean) => {
    const novasCategorias = checked
      ? [...filtros.categorias, categoria]
      : filtros.categorias.filter((c) => c !== categoria)

    onFiltrosChange({
      ...filtros,
      categorias: novasCategorias,
    })
  }

  // Função para atualizar o valor mínimo
  const atualizarValorMin = (valor: string) => {
    onFiltrosChange({
      ...filtros,
      valorMin: valor === "" ? null : Number(valor),
    })
  }

  // Função para atualizar o valor máximo
  const atualizarValorMax = (valor: string) => {
    onFiltrosChange({
      ...filtros,
      valorMax: valor === "" ? null : Number(valor),
    })
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filtros</span>
              {filtrosAtivos > 0 && (
                <Badge variant="secondary" className="ml-1 rounded-full px-1">
                  {filtrosAtivos}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4" align="end">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros</h4>
                {filtrosAtivos > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground"
                    onClick={limparFiltros}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                <h5 className="text-sm font-medium">Disponibilidade</h5>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={filtros.disponibilidade === "todos" ? "default" : "outline"}
                    size="sm"
                    onClick={() => atualizarDisponibilidade("todos")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filtros.disponibilidade === "disponivel" ? "default" : "outline"}
                    size="sm"
                    onClick={() => atualizarDisponibilidade("disponivel")}
                  >
                    Disponível
                  </Button>
                  <Button
                    variant={filtros.disponibilidade === "indisponivel" ? "default" : "outline"}
                    size="sm"
                    onClick={() => atualizarDisponibilidade("indisponivel")}
                  >
                    Indisponível
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <h5 className="text-sm font-medium">Categorias</h5>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="categoria-carrinho"
                      checked={filtros.categorias.includes("carrinho")}
                      onCheckedChange={(checked) => atualizarCategoria("carrinho", checked === true)}
                    />
                    <Label htmlFor="categoria-carrinho">Carrinhos de Bebê</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="categoria-scooter"
                      checked={filtros.categorias.includes("scooter")}
                      onCheckedChange={(checked) => atualizarCategoria("scooter", checked === true)}
                    />
                    <Label htmlFor="categoria-scooter">Scooters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="categoria-cadeira"
                      checked={filtros.categorias.includes("cadeira")}
                      onCheckedChange={(checked) => atualizarCategoria("cadeira", checked === true)}
                    />
                    <Label htmlFor="categoria-cadeira">Cadeiras de Rodas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="categoria-patinete"
                      checked={filtros.categorias.includes("patinete")}
                      onCheckedChange={(checked) => atualizarCategoria("patinete", checked === true)}
                    />
                    <Label htmlFor="categoria-patinete">Patinetes</Label>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <h5 className="text-sm font-medium">Valor da Diária</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="valor-min" className="text-xs">
                      Mínimo
                    </Label>
                    <Input
                      id="valor-min"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="R$ 0,00"
                      value={filtros.valorMin === null ? "" : filtros.valorMin}
                      onChange={(e) => atualizarValorMin(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="valor-max" className="text-xs">
                      Máximo
                    </Label>
                    <Input
                      id="valor-max"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="R$ 999,99"
                      value={filtros.valorMax === null ? "" : filtros.valorMax}
                      onChange={(e) => atualizarValorMax(e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {filtrosAtivos > 0 && (
          <div className="flex flex-wrap gap-1">
            {filtros.disponibilidade !== "todos" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filtros.disponibilidade === "disponivel" ? "Disponível" : "Indisponível"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 p-0"
                  onClick={() => atualizarDisponibilidade("todos")}
                >
                  <X className="h-2 w-2" />
                  <span className="sr-only">Remover filtro</span>
                </Button>
              </Badge>
            )}
            {filtros.categorias.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filtros.categorias.length} {filtros.categorias.length === 1 ? "categoria" : "categorias"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 p-0"
                  onClick={() => onFiltrosChange({ ...filtros, categorias: [] })}
                >
                  <X className="h-2 w-2" />
                  <span className="sr-only">Remover filtro</span>
                </Button>
              </Badge>
            )}
            {filtros.valorMin !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min: R$ {filtros.valorMin.toFixed(2)}
                <Button variant="ghost" size="icon" className="h-3 w-3 p-0" onClick={() => atualizarValorMin("")}>
                  <X className="h-2 w-2" />
                  <span className="sr-only">Remover filtro</span>
                </Button>
              </Badge>
            )}
            {filtros.valorMax !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: R$ {filtros.valorMax.toFixed(2)}
                <Button variant="ghost" size="icon" className="h-3 w-3 p-0" onClick={() => atualizarValorMax("")}>
                  <X className="h-2 w-2" />
                  <span className="sr-only">Remover filtro</span>
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
