"use client"

import { MoreHorizontal, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function EntregasTable() {
  const entregas = [
    {
      id: "ENT-001",
      cliente: "Maria Silva",
      endereco: "Rua das Flores, 123 - Centro",
      data: "10/05/2025",
      horario: "09:00 - 10:00",
      tipo: "entrega",
      produto: "Carrinho de Bebê Modelo A",
      status: "pendente",
    },
    {
      id: "ENT-002",
      cliente: "João Santos",
      endereco: "Av. Principal, 456 - Jardim",
      data: "10/05/2025",
      horario: "11:00 - 12:00",
      tipo: "entrega",
      produto: "Scooter Elétrica Modelo X",
      status: "pendente",
    },
    {
      id: "ENT-003",
      cliente: "Ana Oliveira",
      endereco: "Rua dos Pinheiros, 789 - Vila Nova",
      data: "15/05/2025",
      horario: "14:00 - 15:00",
      tipo: "retirada",
      produto: "Carrinho de Bebê Modelo B",
      status: "pendente",
    },
    {
      id: "ENT-004",
      cliente: "Carlos Pereira",
      endereco: "Alameda Santos, 321 - Jardim Europa",
      data: "13/05/2025",
      horario: "16:00 - 17:00",
      tipo: "retirada",
      produto: "Scooter Modelo Y",
      status: "concluido",
    },
    {
      id: "ENT-005",
      cliente: "Fernanda Lima",
      endereco: "Rua Ipiranga, 567 - Centro",
      data: "12/05/2025",
      horario: "18:00 - 19:00",
      tipo: "entrega",
      produto: "Carrinho de Bebê Modelo C",
      status: "concluido",
    },
    {
      id: "ENT-006",
      cliente: "Roberto Alves",
      endereco: "Av. Paulista, 1000 - Bela Vista",
      data: "11/05/2025",
      horario: "10:00 - 11:00",
      tipo: "entrega",
      produto: "Scooter Elétrica Modelo Z",
      status: "concluido",
    },
  ]

  const abrirNoGoogleMaps = (endereco: string) => {
    const enderecoFormatado = encodeURIComponent(endereco)
    window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`, "_blank")
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Produto</TableHead>
          <TableHead>Data/Horário</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entregas.map((entrega) => (
          <TableRow key={entrega.id}>
            <TableCell className="font-medium">{entrega.id}</TableCell>
            <TableCell>{entrega.cliente}</TableCell>
            <TableCell className="hidden md:table-cell">{entrega.produto}</TableCell>
            <TableCell>
              {entrega.data}
              <br />
              <span className="text-xs text-muted-foreground">{entrega.horario}</span>
            </TableCell>
            <TableCell>
              <Badge variant={entrega.tipo === "entrega" ? "default" : "secondary"}>
                {entrega.tipo === "entrega" ? "Entrega" : "Retirada"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={entrega.status === "concluido" ? "outline" : "default"}>
                {entrega.status === "concluido" ? "Concluído" : "Pendente"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => abrirNoGoogleMaps(entrega.endereco)}
                  title="Abrir no Google Maps"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Editar entrega</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como concluído</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
