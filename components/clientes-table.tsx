"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Phone, Mail, Star, StarOff } from "lucide-react"
import type { Client } from "@/lib/clients"
import { useToast } from "@/hooks/use-toast"

export function ClientesTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Usar useCallback para evitar recriação da função a cada renderização
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/clients")

      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.status}`)
      }

      const data = await response.json()
      setClients(data)
      setFilteredClients(data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Usar useEffect com dependência em fetchClients
  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  // Usar useEffect com dependências corretas
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          client.document.includes(searchTerm),
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  const handleClientClick = (id: string) => {
    router.push(`/clientes/${id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/clientes/novo")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleClientClick(client.id)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {client.is_vip ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-gray-300" />
                    )}
                    {client.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase">
                        {client.document_type === "cpf" ? "CPF" : "Passaporte"}
                      </span>
                      <span>{client.document}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.is_vip ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        VIP
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Regular
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
