"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { ClienteSelectorTable } from "@/components/cliente-selector-table"
import { ProdutoSelectorTable } from "@/components/produto-selector-table"

export function ReservaFormSimplified() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientId, setClientId] = useState("")
  const [clientName, setClientName] = useState("")
  const [productId, setProductId] = useState("")
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState(0)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [validationError, setValidationError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Função para calcular o número de dias entre duas datas
  const calculateDays = (): string => {
    if (!startDate || !endDate) return "Selecione as datas para calcular o período"

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"} de aluguel`
  }

  // Função para calcular o preço total
  const calculatePrice = (): void => {
    if (startDate && endDate && productPrice > 0) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setTotalPrice(productPrice * diffDays)
    } else {
      setTotalPrice(0)
    }
  }

  // Atualizar preço quando as datas ou o produto mudam
  useEffect(() => {
    calculatePrice()
  }, [startDate, endDate, productPrice])

  // Manipuladores para seleção de cliente e produto
  const handleClientSelect = (id: string, name?: string) => {
    console.log("Cliente selecionado:", id, name)
    setClientId(id)
    setClientName(name || "")
  }

  const handleProductSelect = (id: string, name?: string, price?: number) => {
    console.log("Produto selecionado:", id, name, price)
    setProductId(id)
    setProductName(name || "")
    setProductPrice(price || 0)
  }

  // Atualizar datas
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    // Validação básica
    if (!clientId || !productId || !startDate || !endDate || !deliveryAddress) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clientId">Cliente</Label>
        <ClienteSelectorTable defaultValue={clientId} onSelect={handleClientSelect} disabled={isSubmitting} />
        {clientName && <p className="text-sm text-muted-foreground mt-1">Cliente selecionado: {clientName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="productId">Produto</Label>
        <ProdutoSelectorTable defaultValue={productId} onSelect={handleProductSelect} disabled={isSubmitting} />
        {productName && <p className="text-sm text-muted-foreground mt-1">Produto selecionado: {productName}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data de início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant={"outline"}
                className={cn("w-full pl-3 text-left font-normal", !startDate && "text-muted-foreground")}
                disabled={isSubmitting}
              >
                {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
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
                variant={"outline"}
                className={cn("w-full pl-3 text-left font-normal", !endDate && "text-muted-foreground")}
                disabled={isSubmitting}
              >
                {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
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
