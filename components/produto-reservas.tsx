"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface Reserva {
  id: string
  cliente: string
  dataInicio: string
  dataFim: string
  status: "confirmada" | "pendente" | "cancelada" | "concluida"
}

interface ProdutoReservasProps {
  produtoId: string
}

export function ProdutoReservas({ produtoId }: ProdutoReservasProps) {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulando carregamento de reservas
    // Em uma implementação real, isso buscaria dados do Supabase
    setTimeout(() => {
      setReservas([
        {
          id: "RES-001",
          cliente: "João Silva",
          dataInicio: "2023-11-15",
          dataFim: "2023-11-20",
          status: "confirmada",
        },
        {
          id: "RES-002",
          cliente: "Maria Oliveira",
          dataInicio: "2023-12-05",
          dataFim: "2023-12-10",
          status: "pendente",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [produtoId])

  if (isLoading) {
    return <div className="text-center py-4">Carregando reservas...</div>
  }

  if (reservas.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Nenhuma reserva encontrada para este produto.</div>
  }

  const getStatusBadge = (status: Reserva["status"]) => {
    switch (status) {
      case "confirmada":
        return <Badge variant="default">Confirmada</Badge>
      case "pendente":
        return <Badge variant="outline">Pendente</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      case "concluida":
        return <Badge variant="secondary">Concluída</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {reservas.map((reserva) => (
        <div key={reserva.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">{reserva.cliente}</div>
            {getStatusBadge(reserva.status)}
          </div>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {new Date(reserva.dataInicio).toLocaleDateString()} até {new Date(reserva.dataFim).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {Math.ceil(
                  (new Date(reserva.dataFim).getTime() - new Date(reserva.dataInicio).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                dias
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
