"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Plus, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NovoClienteDialog } from "@/components/novo-cliente-dialog"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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

interface ClienteSelectorTableProps {
  defaultValue?: string
  onSelect: (clienteId: string, clienteName?: string) => void
  className?: string
  disabled?: boolean
}

export function ClienteSelectorTable({ defaultValue, onSelect, className, disabled }: ClienteSelectorTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(defaultValue)
  const [selectedClientName, setSelectedClientName] = useState<string>("")
  const [showResults, setShowResults] = useState(false)
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false)
  const { toast } = useToast()

  // Função para buscar clientes
  const fetchClients = useCallback(
    async (query = "") => {
      console.log("🔍 Buscando clientes com termo:", query)
      setLoading(true)

      try {
        const response = await fetch(`/api/clients/search?q=${encodeURIComponent(query || "")}`)

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
            setSelectedClientId(client.id)
            setSelectedClientName(client.name)
            setSearchTerm(client.name)
          }
        } catch (error) {
          console.error("❌ Erro ao buscar cliente por ID:", error)
        }
      }

      fetchClientById()
    }
  }, [defaultValue, selectedClientName])

  // Buscar clientes quando o termo de busca muda
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm === "") {
      fetchClients(debouncedSearchTerm)
      setShowResults(true)
    }
  }, [debouncedSearchTerm, fetchClients])

  // Carregar clientes iniciais
  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  // Função para selecionar um cliente
  const handleSelectClient = (client: Client) => {
    console.log("Cliente selecionado:", client)
    setSelectedClientId(client.id)
    setSelectedClientName(client.name)
    setSearchTerm(client.name)
    setShowResults(false)
    onSelect(client.id, client.name)
  }

  // Função para lidar com a criação de um novo cliente
  const handleClientCreated = (clientId: string, clientName: string) => {
    console.log("✅ Cliente criado:", clientId, clientName)
    setSelectedClientId(clientId)
    setSelectedClientName(clientName)
    setSearchTerm(clientName)
    onSelect(clientId, clientName)
    setClienteDialogOpen(false)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar cliente por nome, email ou telefone..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value !== selectedClientName) {
                setSelectedClientId(undefined)
              }
            }}
            onFocus={() => setShowResults(true)}
            disabled={disabled}
          />
          {loading && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <Button type="button" variant="outline" onClick={() => setClienteDialogOpen(true)} disabled={disabled}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showResults && (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Buscando clientes...</span>
                      </div>
                    ) : (
                      "Nenhum cliente encontrado"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className={cn("cursor-pointer hover:bg-muted/50", selectedClientId === client.id && "bg-muted")}
                    onClick={() => handleSelectClient(client)}
                  >
                    <TableCell>
                      {selectedClientId === client.id && <Check className="h-4 w-4 text-primary" />}
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || ""}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {clienteDialogOpen && (
        <NovoClienteDialog onClientCreated={handleClientCreated} onOpenChange={(open) => setClienteDialogOpen(open)} />
      )}
    </div>
  )
}
