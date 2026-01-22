"use client"

import { useState } from "react"
import { CalendarDays, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReservasFiltrosDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtros Avançados</DialogTitle>
          <DialogDescription>Refine sua busca com filtros específicos.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-inicio">Data Início</Label>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Input id="data-inicio" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-fim">Data Fim</Label>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Input id="data-fim" type="date" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel</Label>
            <Input id="hotel" placeholder="Nome do hotel" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-produto">Tipo de Produto</Label>
              <Select defaultValue="todos">
                <SelectTrigger id="tipo-produto">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="carrinho">Carrinhos de Bebê</SelectItem>
                  <SelectItem value="scooter">Scooters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor-minimo">Valor Mínimo (R$)</Label>
              <Input id="valor-minimo" type="number" min="0" placeholder="0,00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forma-pagamento">Forma de Pagamento</Label>
            <Select defaultValue="todas">
              <SelectTrigger id="forma-pagamento">
                <SelectValue placeholder="Selecione a forma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Zelle">Zelle</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Limpar Filtros
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
