"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function PagamentosFiltros() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [metodo, setMetodo] = useState<string>("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()

  const aplicarFiltros = () => {
    // Lógica para aplicar os filtros
    console.log({ status, metodo, dataInicio, dataFim })
    setOpen(false)
  }

  const limparFiltros = () => {
    setStatus("")
    setMetodo("")
    setDataInicio(undefined)
    setDataFim(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar Pagamentos</DialogTitle>
          <DialogDescription>Defina os critérios para filtrar a lista de pagamentos.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="metodo" className="text-right">
              Método
            </Label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger id="metodo" className="col-span-3">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="data-inicio" className="text-right">
              Data Início
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="data-inicio"
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !dataInicio && "text-muted-foreground",
                  )}
                >
                  {dataInicio ? format(dataInicio, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="data-fim" className="text-right">
              Data Fim
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="data-fim"
                  variant={"outline"}
                  className={cn("col-span-3 justify-start text-left font-normal", !dataFim && "text-muted-foreground")}
                >
                  {dataFim ? format(dataFim, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={limparFiltros}>
            Limpar
          </Button>
          <Button onClick={aplicarFiltros}>Aplicar Filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
