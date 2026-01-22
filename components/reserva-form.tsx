"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ClienteSelectorTable } from "@/components/cliente-selector-table"
import { ProdutoSelectorTable } from "@/components/produto-selector-table"
import { Card, CardContent } from "@/components/ui/card"

const reservaFormSchema = z.object({
  clientId: z.string({
    required_error: "Por favor, selecione um cliente.",
  }),
  productId: z.string({
    required_error: "Por favor, selecione um produto.",
  }),
  startDate: z.date({
    required_error: "Por favor, selecione a data de início.",
  }),
  endDate: z.date({
    required_error: "Por favor, selecione a data de término.",
  }),
  deliveryAddress: z.string().min(5, {
    message: "O endereço de entrega deve ter pelo menos 5 caracteres.",
  }),
  notes: z.string().optional(),
})

type ReservaFormValues = z.infer<typeof reservaFormSchema>

export function ReservaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProductPrice, setSelectedProductPrice] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [startDateValue, setStartDateValue] = useState<Date | undefined>(undefined)
  const [endDateValue, setEndDateValue] = useState<Date | undefined>(undefined)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFormSchema),
    defaultValues: {
      clientId: "",
      productId: "",
      deliveryAddress: "",
      notes: "",
    },
  })

  // Calcular o preço total quando as datas ou o produto mudam
  useEffect(() => {
    if (startDateValue && endDateValue && selectedProductPrice) {
      const diffTime = Math.abs(endDateValue.getTime() - startDateValue.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setTotalPrice(selectedProductPrice * diffDays)
    } else {
      setTotalPrice(0)
    }
  }, [startDateValue, endDateValue, selectedProductPrice])

  async function onSubmit(data: ReservaFormValues) {
    try {
      setIsSubmitting(true)
      console.log("Dados do formulário:", data)

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Reserva criada com sucesso!",
        description: `Reserva para o período de ${format(data.startDate, "dd/MM/yyyy")} a ${format(
          data.endDate,
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

  // Função para calcular o número de dias entre duas datas
  const calculateDays = (start: Date | undefined, end: Date | undefined): string => {
    if (!start || !end) return "Selecione as datas para calcular o período"

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"} de aluguel`
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cliente</FormLabel>
              <ClienteSelectorTable
                defaultValue={field.value}
                onSelect={(clientId) => {
                  field.onChange(clientId)
                }}
                disabled={isSubmitting}
              />
              <FormDescription>Selecione o cliente para esta reserva.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Produto</FormLabel>
              <ProdutoSelectorTable
                defaultValue={field.value}
                onSelect={(productId, productName, productPrice) => {
                  field.onChange(productId)
                  if (productPrice) {
                    setSelectedProductPrice(productPrice)
                  }
                }}
                disabled={isSubmitting}
              />
              <FormDescription>Selecione o produto para esta reserva.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isSubmitting}
                      >
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setStartDateValue(date)
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>A data de início da reserva.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isSubmitting}
                      >
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        setEndDateValue(date)
                      }}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate")
                        return date < new Date() || (startDate && date < startDate)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>A data de término da reserva.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {totalPrice > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Resumo da reserva</p>
                  <p className="text-xs text-muted-foreground">{calculateDays(startDateValue, endDateValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Valor Total</p>
                  <p className="text-lg font-bold">R$ {totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de entrega</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Endereço completo para entrega"
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Informe o endereço completo para entrega do produto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações adicionais sobre a reserva"
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Informações adicionais sobre a reserva (opcional).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Criando reserva..." : "Criar reserva"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
