"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function RelatoriosFiltros() {
  const [isOpen, setIsOpen] = useState(false)
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date(2023, 5, 1)) // 1 de junho de 2023
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date(2023, 5, 30)) // 30 de junho de 2023
  const [categoria, setCategoria] = useState<string>("todos")
  const [produto, setProduto] = useState<string>("todos")

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between md:w-auto">
          <span>Filtros</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Período</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Data Inicial</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(dataInicio)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Data Final</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(dataFim)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Categorias</h4>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as Categorias</SelectItem>
                    <SelectItem value="carrinhos">Carrinhos de Bebê</SelectItem>
                    <SelectItem value="patinetes">Patinetes</SelectItem>
                    <SelectItem value="bicicletas">Bicicletas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Produtos</h4>
                <Select value={produto} onValueChange={setProduto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Produtos</SelectItem>
                    <SelectItem value="carrinho-x">Carrinho de Bebê Modelo X</SelectItem>
                    <SelectItem value="carrinho-duplo">Carrinho de Bebê Duplo</SelectItem>
                    <SelectItem value="carrinho-leve">Carrinho de Bebê Leve</SelectItem>
                    <SelectItem value="patinete-eletrico">Patinete Elétrico Pro</SelectItem>
                    <SelectItem value="patinete-dobravel">Patinete Dobrável</SelectItem>
                    <SelectItem value="bicicleta-infantil">Bicicleta Infantil Aro 16</SelectItem>
                    <SelectItem value="bicicleta-mountain">Bicicleta Mountain Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDataInicio(new Date(2023, 5, 1))
                    setDataFim(new Date(2023, 5, 30))
                    setCategoria("todos")
                    setProduto("todos")
                  }}
                >
                  Limpar
                </Button>
                <Button onClick={() => setIsOpen(false)}>Aplicar Filtros</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
