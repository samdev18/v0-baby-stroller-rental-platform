"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

export function ReservaFormBasic() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientName, setClientName] = useState("")
  const [productName, setProductName] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [validationError, setValidationError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const calculateDays = () => {
    if (!startDate || !endDate) return "Selecione as datas para calcular o período"

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"} de aluguel`
  }

  const calculatePrice = () => {
    if (!startDate || !endDate) return 0

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return 50 * diffDays // Preço fixo de R$ 50,00 por dia
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (!clientName || !productName || !startDate || !endDate || !deliveryAddress) {
      setValidationError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    try {
      setIsSubmitting(true)

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Reserva criada com sucesso!",
        description: `Reserva para o período de ${format(startDate, "dd/MM/yyyy")} a ${format(
          endDate,
          "dd/MM/yyyy",
        )} foi criada.`,
      })

      router.push("/reservas")
    } catch (error) {
      console.error("Erro ao criar reserva:", error)
      toast({
        title: "Erro ao criar reserva",
        description: "Ocorreu um erro ao criar a reserva. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = calculatePrice()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clientName">Nome do Cliente</Label>
        <Input
          id="clientName"
          placeholder="Digite o nome do cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productName">Nome do Produto</Label>
        <Input
          id="productName"
          placeholder="Digite o nome do produto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn("w-full pl-3 text-left font-normal", !startDate && "text-muted-foreground")}
                disabled={isSubmitting}
              >
                {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Data de término</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn("w-full pl-3 text-left font-normal", !endDate && "text-muted-foreground")}
                disabled={isSubmitting}
              >
                {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => {
                  return date < new Date() || (startDate && date < startDate)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {totalPrice > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Resumo da reserva</p>
                <p className="text-xs text-muted-foreground">{calculateDays()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-lg font-bold">R$ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Endereço de entrega</Label>
        <Textarea
          id="deliveryAddress"
          placeholder="Endereço completo para entrega"
          className="resize-none"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Observações adicionais sobre a reserva"
          className="resize-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {validationError && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{validationError}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Criando reserva..." : "Criar reserva"}
        </Button>
      </div>
    </form>
  )
}
