"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Edit, Mail, MapPin, Phone, Star, Trash2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  document_type: "cpf" | "passport"
  document: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  hotel?: string
  notes?: string
  is_vip: boolean
  receive_promotions: boolean
}

interface ClientesDetalhesProps {
  client: Client
}

export function ClientesDetalhes({ client }: ClientesDetalhesProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir cliente")
      }

      toast({
        title: "Cliente excluído",
        description: `O cliente ${client.name} foi excluído com sucesso.`,
      })
      router.push("/clientes")
      router.refresh()
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      toast({
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/clientes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
          {client.is_vip && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 ml-2">
              <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
              VIP
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/clientes/${client.id}/editar`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir cliente</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o cliente {client.name}? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Excluindo..." : "Excluir cliente"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome completo</p>
                  <p className="font-medium">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">
                    {client.document_type === "cpf" ? "CPF" : "Passaporte"}: {client.document}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{client.address}</p>
                <p>
                  {client.city}, {client.state} - {client.zip}
                </p>
                <p>{client.country}</p>
                {client.hotel && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Hospedado em</p>
                    <p className="font-medium">{client.hotel}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{client.is_vip ? "Cliente VIP" : "Cliente Regular"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comunicações</p>
                  <p className="font-medium">
                    {client.receive_promotions ? "Aceita receber promoções" : "Não deseja receber promoções"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="reservas">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Reservas</CardTitle>
              <CardDescription>Todas as reservas feitas por este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Nenhuma reserva encontrada para este cliente.</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/reservas/nova?clienteId=" + client.id)}>
                Nova Reserva
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Todos os pagamentos realizados por este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Nenhum pagamento encontrado para este cliente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
