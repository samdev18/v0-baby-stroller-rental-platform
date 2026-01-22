"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ReservasCalendario() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const reservas = [
    {
      id: "RES-001",
      cliente: "Maria Silva",
      produto: "Carrinho de Bebê Modelo A",
      dataInicio: new Date(2025, 4, 10),
      dataFim: new Date(2025, 4, 15),
      status: "confirmado",
      produtoId: "PROD-001",
    },
    {
      id: "RES-002",
      cliente: "João Santos",
      produto: "Scooter Elétrica Modelo X",
      dataInicio: new Date(2025, 4, 12),
      dataFim: new Date(2025, 4, 14),
      status: "pendente",
      produtoId: "PROD-004",
    },
    {
      id: "RES-003",
      cliente: "Ana Oliveira",
      produto: "Carrinho de Bebê Modelo B",
      dataInicio: new Date(2025, 4, 15),
      dataFim: new Date(2025, 4, 20),
      status: "confirmado",
      produtoId: "PROD-002",
    },
    {
      id: "RES-004",
      cliente: "Carlos Pereira",
      produto: "Scooter Modelo Y",
      dataInicio: new Date(2025, 4, 11),
      dataFim: new Date(2025, 4, 13),
      status: "cancelado",
      produtoId: "PROD-005",
    },
    {
      id: "RES-005",
      cliente: "Fernanda Lima",
      produto: "Carrinho de Bebê Modelo C",
      dataInicio: new Date(2025, 4, 16),
      dataFim: new Date(2025, 4, 18),
      status: "pendente",
      produtoId: "PROD-003",
    },
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const monthName = currentMonth.toLocaleString("pt-BR", { month: "long" })

    const days = []

    // Adicionar dias vazios para o início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-muted p-1"></div>)
    }

    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const reservasNoDia = reservas.filter((reserva) => {
        const dataInicio = reserva.dataInicio
        const dataFim = reserva.dataFim
        return date >= dataInicio && date <= dataFim
      })

      days.push(
        <div key={day} className="h-24 border border-muted p-1 overflow-hidden">
          <div className="font-medium text-sm">{day}</div>
          <div className="mt-1 space-y-1">
            {reservasNoDia.map((reserva) => (
              <TooltipProvider key={reserva.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`text-xs truncate rounded px-1 py-0.5 ${
                        reserva.status === "confirmado"
                          ? "bg-green-100 text-green-800"
                          : reserva.status === "pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {reserva.produto}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{reserva.cliente}</p>
                      <p>{reserva.produto}</p>
                      <p>
                        {reserva.dataInicio.toLocaleDateString("pt-BR")} - {reserva.dataFim.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>,
      )
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium capitalize">
            {monthName} {year}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0">
          <div className="text-center font-medium p-2 text-sm">Dom</div>
          <div className="text-center font-medium p-2 text-sm">Seg</div>
          <div className="text-center font-medium p-2 text-sm">Ter</div>
          <div className="text-center font-medium p-2 text-sm">Qua</div>
          <div className="text-center font-medium p-2 text-sm">Qui</div>
          <div className="text-center font-medium p-2 text-sm">Sex</div>
          <div className="text-center font-medium p-2 text-sm">Sáb</div>
          {days}
        </div>
      </div>
    )
  }

  return <div className="w-full overflow-x-auto">{renderCalendar()}</div>
}
