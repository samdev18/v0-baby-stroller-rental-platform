"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Loader2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NovoClienteDialog } from "@/components/novo-cliente-dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Dados de exemplo para fallback
const FALLBACK_CLIENTS = [
  { id: "1", name: "João Silva", email: "joao@example.com", phone: "11999999999" },
  { id: "2", name: "Maria Oliveira", email: "maria@example.com", phone: "11988888888" },
  { id: "3", name: "Pedro Santos", email: "pedro@example.com", phone: "11977777777" },
]

interface Client {
  id: string
  name: string
  email: string
  phone?: string
}

interface ClienteSelectorProps {
  defaultValue?: string
  onSelect: (clienteId: string, clienteName?: string) => void
  className?: string
  disabled?: boolean
}

export function ClienteSelector({ defaultValue, onSelect, className, disabled }: ClienteSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>(FALLBACK_CLIENTS) // Inicializar com dados de fallback
  const [loading, setLoading] = useState(false)
  const [selectedClientName, setSelectedClientName] = useState("")
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false)
  const { toast } = useToast()

  // Função para buscar clientes do Supabase
  const fetchClients = useCallback(
    async (query = "") => {
      console.log("🔍 fetchClients iniciado com query:", query)
      setLoading(true)

      try {
        console.log(`🌐 Fazendo requisição para /api/clients/search?q=${query}`)
        const response = await fetch(`/api/clients/search?q=${encodeURIComponent(query || "")}`)

        console.log("📡 Resposta da API:", response.status, response.statusText)

        if (!response.ok) {
          throw new Error(`Erro ao buscar clientes: ${response.status}`)
        }

        const data = await response.json()
        console.log(`✅ Clientes recebidos: ${data.length}`, data)

        if (Array.isArray(data)) {
          setClients(data.length > 0 ? data : FALLBACK_CLIENTS)
        } else {
          console.error("❌ Dados recebidos não são um array:", data)
          setClients(FALLBACK_CLIENTS)
        }
      } catch (error) {
        console.error("❌ Erro ao buscar clientes:", error)
        toast({
          title: "Erro ao buscar clientes",
          description: "Usando dados de exemplo como fallback.",
          variant: "destructive",
        })
        setClients(FALLBACK_CLIENTS)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  // Buscar cliente específico pelo ID quando temos um valor padrão
  useEffect(() => {
    if (defaultValue && !selectedClientName) {
      console.log("🔍 Buscando cliente por ID:", defaultValue)
      const fetchClientById = async () => {
        try {
          const response = await fetch(`/api/clients/${defaultValue}`)
          if (response.ok) {
            const client = await response.json()
            console.log("✅ Cliente encontrado por ID:", client)
            setSelectedClientName(client.name)
          }
        } catch (error) {
          console.error("❌ Erro ao buscar cliente por ID:", error)
        }
      }

      fetchClientById()
    }
  }, [defaultValue, selectedClientName])

  // Quando o popover é aberto, buscar clientes
  useEffect(() => {
    console.log("🔄 Estado do popover mudou:", open ? "aberto" : "fechado")
    if (open) {
      console.log("🔍 Popover aberto, buscando clientes...")
      fetchClients(searchTerm)
    }
  }, [open, fetchClients, searchTerm])

  const handleClientCreated = (clientId: string, clientName: string) => {
    console.log("✅ Cliente criado:", clientId, clientName)
    onSelect(clientId, clientName)
    setSelectedClientName(clientName)
    setOpen(false)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
            type="button"
            onClick={() => {
              console.log("Seletor de cliente clicado")
              setOpen((prev) => !prev)
            }}
          >
            {defaultValue && selectedClientName ? selectedClientName : "Selecionar cliente"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Buscar cliente..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="flex-1 border-0 focus:ring-0"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin opacity-70" />}
            </div>
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Carregando clientes...</span>
                </div>
              ) : (
                <>
                  {clients.length === 0 ? (
                    <CommandEmpty>
                      {searchTerm.length < 2
                        ? "Digite pelo menos 2 caracteres para filtrar"
                        : "Nenhum cliente encontrado"}
                    </CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {clients.map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.id}
                          onSelect={() => {
                            console.log("Cliente selecionado:", client)
                            onSelect(client.id, client.name)
                            setSelectedClientName(client.name)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", defaultValue === client.id ? "opacity-100" : "opacity-0")}
                          />
                          <div className="flex flex-col">
                            <span>{client.name}</span>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault() // Prevenir o comportamento padrão
          e.stopPropagation() // Parar a propagação do evento
          setClienteDialogOpen(true)
          console.log("Botão Novo Cliente clicado")
        }}
        disabled={disabled}
      >
        <Plus className="h-4 w-4" />
      </Button>

      {clienteDialogOpen && (
        <NovoClienteDialog
          onClientCreated={(clientId, clientName) => {
            handleClientCreated(clientId, clientName)
            setClienteDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}
