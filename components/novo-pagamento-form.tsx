"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  reservaId: z.string().min(1, "Selecione uma reserva"),
  clienteId: z.string().min(1, "Selecione um cliente"),
  valor: z.string().min(1, "Informe o valor"),
  metodo: z.string().min(1, "Selecione o método de pagamento"),
  data: z.date({
    required_error: "Selecione a data do pagamento",
  }),
  status: z.string().min(1, "Selecione o status"),
  observacoes: z.string().optional(),
})

// Dados de exemplo para reservas
const reservas = [
  { id: "RES123", descricao: "Carrinho de Bebê - 10/05/2023" },
  { id: "RES124", descricao: "Scooter Elétrica - 11/05/2023" },
  { id: "RES125", descricao: "Carrinho Duplo - 12/05/2023" },
  { id: "RES126", descricao: "Scooter Clássica - 13/05/2023" },
  { id: "RES127", descricao: "Carrinho de Bebê - 14/05/2023" },
]

// Dados de exemplo para clientes
const clientes = [
  { id: "CLI001", nome: "João Silva" },
  { id: "CLI002", nome: "Maria Oliveira" },
  { id: "CLI003", nome: "Pedro Santos" },
  { id: "CLI004", nome: "Ana Souza" },
  { id: "CLI005", nome: "Carlos Ferreira" },
]

export function NovoPagamentoForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [reservaAberta, setReservaAberta] = useState(false)
  const [clienteAberto, setClienteAberto] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reservaId: "",
      clienteId: "",
      valor: "",
      metodo: "",
      status: "confirmado",
      observacoes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Pagamento registrado com sucesso",
      description: `O pagamento foi registrado no sistema.`,
    })
    router.push("/pagamentos")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Pagamento</CardTitle>
        <CardDescription>Registre um novo pagamento no sistema</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="reservaId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Reserva</FormLabel>
                    <Popover open={reservaAberta} onOpenChange={setReservaAberta}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={reservaAberta}
                            className="justify-between"
                          >
                            {field.value
                              ? reservas.find((reserva) => reserva.id === field.value)?.descricao
                              : "Selecione uma reserva"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Buscar reserva..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma reserva encontrada.</CommandEmpty>
                            <CommandGroup>
                              {reservas.map((reserva) => (
                                <CommandItem
                                  key={reserva.id}
                                  value={reserva.id}
                                  onSelect={(value) => {
                                    form.setValue("reservaId", value)
                                    setReservaAberta(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === reserva.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {reserva.descricao}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Selecione a reserva relacionada a este pagamento.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Cliente</FormLabel>
                    <Popover open={clienteAberto} onOpenChange={setClienteAberto}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={clienteAberto}
                            className="justify-between"
                          >
                            {field.value
                              ? clientes.find((cliente) => cliente.id === field.value)?.nome
                              : "Selecione um cliente"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                            <CommandGroup>
                              {clientes.map((cliente) => (
                                <CommandItem
                                  key={cliente.id}
                                  value={cliente.id}
                                  onSelect={(value) => {
                                    form.setValue("clienteId", value)
                                    setClienteAberto(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === cliente.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {cliente.nome}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Selecione o cliente que realizou o pagamento.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input {...field} className="pl-7" placeholder="0.00" />
                      </div>
                    </FormControl>
                    <FormDescription>Informe o valor do pagamento.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                        <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Selecione o método utilizado para o pagamento.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Pagamento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Selecione a data em que o pagamento foi realizado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Defina o status atual do pagamento.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações sobre este pagamento"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Informações adicionais sobre o pagamento (opcional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/pagamentos")}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Pagamento</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
