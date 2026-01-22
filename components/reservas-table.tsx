"use client"

import { useEffect, useState } from "react"
import { Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"
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
import type { Reservation } from "@/lib/reservations"
import { formatCurrency } from "@/lib/utils"

export function ReservasTable() {
  const [reservas, setReservas] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("/api/reservations")
        if (!response.ok) {
          throw new Error("Falha ao carregar reservas")
        }
        const data = await response.json()
        setReservas(data)
      } catch (err: any) {
        setError(err.message)
        console.error("Erro ao buscar reservas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "default"
      case "pendente":
        return "outline"
      case "cancelado":
        return "destructive"
      case "concluido":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando reservas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive">Erro: {error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (reservas.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
          <Link href="/reservas/nova">
            <Button className="mt-4">Criar nova reserva</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Produto</TableHead>
          <TableHead className="hidden md:table-cell">Hotel</TableHead>
          <TableHead className="hidden md:table-cell">Período</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservas.map((reserva) => (
          <TableRow key={reserva.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell className="font-medium">
              <Link href={`/reservas/${reserva.id}`} className="hover:underline">
                {reserva.id.substring(0, 8)}...
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/reservas/${reserva.id}`} className="hover:underline">
                {reserva.client?.name || "Cliente não encontrado"}
              </Link>
            </TableCell>
            <TableCell className="hidden md:table-cell">{reserva.product?.name || "Produto não encontrado"}</TableCell>
            <TableCell className="hidden md:table-cell">{reserva.hotel_name || "N/A"}</TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(reserva.start_date).toLocaleDateString()} - {new Date(reserva.end_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{formatCurrency(reserva.total_value)}</TableCell>
            <TableCell>
              <Badge variant={getStatusColor(reserva.status)}>
                {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/reservas/${reserva.id}`}>
                  <Button variant="outline" size="icon" title="Ver detalhes">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
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
                    <DropdownMenuItem disabled={reserva.status === "cancelado"}>
                      {reserva.status === "pendente" ? "Confirmar reserva" : "Marcar como pendente"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" disabled={reserva.status === "cancelado"}>
                      Cancelar reserva
                    </DropdownMenuItem>
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
