"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

// Dados de exemplo para pagamentos
const pagamentosData = [
  {
    id: "PAG001",
    reservaId: "RES123",
    cliente: "João Silva",
    valor: 150.0,
    data: "2023-05-10",
    metodo: "Cartão de Crédito",
    status: "confirmado",
  },
  {
    id: "PAG002",
    reservaId: "RES124",
    cliente: "Maria Oliveira",
    valor: 200.0,
    data: "2023-05-11",
    metodo: "PayPal",
    status: "confirmado",
  },
  {
    id: "PAG003",
    reservaId: "RES125",
    cliente: "Pedro Santos",
    valor: 180.0,
    data: "2023-05-12",
    metodo: "Transferência Bancária",
    status: "pendente",
  },
  {
    id: "PAG004",
    reservaId: "RES126",
    cliente: "Ana Souza",
    valor: 120.0,
    data: "2023-05-13",
    metodo: "Cartão de Débito",
    status: "confirmado",
  },
  {
    id: "PAG005",
    reservaId: "RES127",
    cliente: "Carlos Ferreira",
    valor: 250.0,
    data: "2023-05-14",
    metodo: "Dinheiro",
    status: "pendente",
  },
  {
    id: "PAG006",
    reservaId: "RES128",
    cliente: "Lucia Mendes",
    valor: 300.0,
    data: "2023-05-15",
    metodo: "Cartão de Crédito",
    status: "confirmado",
  },
  {
    id: "PAG007",
    reservaId: "RES129",
    cliente: "Roberto Alves",
    valor: 175.0,
    data: "2023-05-16",
    metodo: "PayPal",
    status: "pendente",
  },
  {
    id: "PAG008",
    reservaId: "RES130",
    cliente: "Fernanda Lima",
    valor: 220.0,
    data: "2023-05-17",
    metodo: "Transferência Bancária",
    status: "confirmado",
  },
]

interface PagamentosTableProps {
  status: "todos" | "pendentes" | "confirmados"
}

export function PagamentosTable({ status }: PagamentosTableProps) {
  const [pagamentos, setPagamentos] = useState(
    status === "todos" ? pagamentosData : pagamentosData.filter((p) => p.status === status),
  )

  const confirmarPagamento = (id: string) => {
    setPagamentos(pagamentos.map((p) => (p.id === id ? { ...p, status: "confirmado" } : p)))
  }

  const cancelarPagamento = (id: string) => {
    setPagamentos(pagamentos.map((p) => (p.id === id ? { ...p, status: "pendente" } : p)))
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Reserva</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.map((pagamento) => (
              <TableRow key={pagamento.id}>
                <TableCell className="font-medium">{pagamento.id}</TableCell>
                <TableCell>{pagamento.reservaId}</TableCell>
                <TableCell>{pagamento.cliente}</TableCell>
                <TableCell>{formatCurrency(pagamento.valor)}</TableCell>
                <TableCell>{new Date(pagamento.data).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{pagamento.metodo}</TableCell>
                <TableCell>
                  <Badge variant={pagamento.status === "confirmado" ? "success" : "warning"}>
                    {pagamento.status === "confirmado" ? "Confirmado" : "Pendente"}
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
                      <DropdownMenuItem asChild>
                        <Link href={`/pagamentos/${pagamento.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {pagamento.status === "pendente" ? (
                        <DropdownMenuItem onClick={() => confirmarPagamento(pagamento.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirmar pagamento
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => cancelarPagamento(pagamento.id)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Marcar como pendente
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
