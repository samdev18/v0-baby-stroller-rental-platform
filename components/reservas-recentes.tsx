import { MoreHorizontal } from "lucide-react"
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
import Link from "next/link"

export function ReservasRecentes() {
  const reservas = [
    {
      id: "RES-001",
      cliente: "Maria Silva",
      produto: "Carrinho de Bebê Modelo A",
      dataInicio: "10/05/2025",
      dataFim: "15/05/2025",
      status: "confirmado",
    },
    {
      id: "RES-002",
      cliente: "João Santos",
      produto: "Scooter Elétrica Modelo X",
      dataInicio: "12/05/2025",
      dataFim: "14/05/2025",
      status: "pendente",
    },
    {
      id: "RES-003",
      cliente: "Ana Oliveira",
      produto: "Carrinho de Bebê Modelo B",
      dataInicio: "15/05/2025",
      dataFim: "20/05/2025",
      status: "confirmado",
    },
    {
      id: "RES-004",
      cliente: "Carlos Pereira",
      produto: "Scooter Modelo Y",
      dataInicio: "11/05/2025",
      dataFim: "13/05/2025",
      status: "cancelado",
    },
    {
      id: "RES-005",
      cliente: "Fernanda Lima",
      produto: "Carrinho de Bebê Modelo C",
      dataInicio: "16/05/2025",
      dataFim: "18/05/2025",
      status: "pendente",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Produto</TableHead>
          <TableHead className="hidden md:table-cell">Período</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservas.map((reserva) => (
          <TableRow key={reserva.id} className="hover:bg-accent/50">
            <TableCell className="font-medium">{reserva.id}</TableCell>
            <TableCell>{reserva.cliente}</TableCell>
            <TableCell className="hidden md:table-cell">{reserva.produto}</TableCell>
            <TableCell className="hidden md:table-cell">
              {reserva.dataInicio} - {reserva.dataFim}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  reserva.status === "confirmado"
                    ? "default"
                    : reserva.status === "pendente"
                      ? "outline"
                      : "destructive"
                }
                className={
                  reserva.status === "confirmado"
                    ? "bg-green-500 hover:bg-green-600"
                    : reserva.status === "pendente"
                      ? "border-orange-500 text-orange-500 hover:bg-orange-50"
                      : ""
                }
              >
                {reserva.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
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
                  <DropdownMenuItem asChild>
                    <Link href={`/reservas/${reserva.id}`}>Ver detalhes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/reservas/${reserva.id}/editar`}>Editar reserva</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Cancelar reserva</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
