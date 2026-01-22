"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, XCircle, Printer, Download, Edit } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Dados de exemplo para um pagamento
const pagamentoData = {
  id: "PAG001",
  reservaId: "RES123",
  cliente: {
    id: "CLI001",
    nome: "João Silva",
    email: "joao.silva@example.com",
    telefone: "(11) 98765-4321",
    iniciais: "JS",
  },
  valor: 150.0,
  data: "2023-05-10T14:30:00",
  metodo: "Cartão de Crédito",
  status: "confirmado",
  detalhes: {
    ultimosDigitos: "4321",
    bandeira: "Visa",
    parcelas: 1,
    autorizacao: "AUTH123456",
  },
  observacoes: "Pagamento realizado no momento da reserva.",
  historico: [
    {
      data: "2023-05-10T14:30:00",
      acao: "Pagamento criado",
      usuario: "Maria Operadora",
    },
    {
      data: "2023-05-10T14:35:00",
      acao: "Pagamento confirmado",
      usuario: "Sistema",
    },
  ],
}

interface PagamentoDetalhesProps {
  id: string
}

export function PagamentoDetalhes({ id }: PagamentoDetalhesProps) {
  const [pagamento, setPagamento] = useState(pagamentoData)
  const [observacoes, setObservacoes] = useState(pagamento.observacoes)
  const [dialogOpen, setDialogOpen] = useState(false)

  const confirmarPagamento = () => {
    setPagamento({ ...pagamento, status: "confirmado" })
  }

  const cancelarPagamento = () => {
    setPagamento({ ...pagamento, status: "pendente" })
  }

  const salvarObservacoes = () => {
    setPagamento({ ...pagamento, observacoes })
    setDialogOpen(false)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Pagamento #{pagamento.id}</CardTitle>
            <CardDescription>
              Detalhes do pagamento realizado em {new Date(pagamento.data).toLocaleString("pt-BR")}
            </CardDescription>
          </div>
          <Badge variant={pagamento.status === "confirmado" ? "success" : "warning"} className="px-3 py-1 text-sm">
            {pagamento.status === "confirmado" ? "Confirmado" : "Pendente"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
              <p className="text-2xl font-bold">{formatCurrency(pagamento.valor)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Método de Pagamento</h3>
              <p className="text-lg">{pagamento.metodo}</p>
              {pagamento.detalhes.ultimosDigitos && (
                <p className="text-sm text-muted-foreground">
                  {pagamento.detalhes.bandeira} **** {pagamento.detalhes.ultimosDigitos}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Reserva</h3>
              <p className="text-lg">
                <Link href={`/reservas/${pagamento.reservaId}`} className="text-primary hover:underline">
                  {pagamento.reservaId}
                </Link>
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">Informações do Cliente</h3>
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">{pagamento.cliente.iniciais}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <Link href={`/clientes/${pagamento.cliente.id}`} className="text-lg font-medium hover:underline">
                  {pagamento.cliente.nome}
                </Link>
                <div className="flex flex-col text-sm text-muted-foreground md:flex-row md:gap-4">
                  <span>{pagamento.cliente.email}</span>
                  <span>{pagamento.cliente.telefone}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Observações</h3>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Observações</DialogTitle>
                    <DialogDescription>Adicione ou edite observações sobre este pagamento.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows={5}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={salvarObservacoes}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="mt-2 text-muted-foreground">{pagamento.observacoes || "Nenhuma observação registrada."}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-medium">Histórico</h3>
            <div className="space-y-4">
              {pagamento.historico.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{item.acao}</p>
                    <div className="flex flex-col text-sm text-muted-foreground md:flex-row md:gap-4">
                      <span>{new Date(item.data).toLocaleString("pt-BR")}</span>
                      <span>por {item.usuario}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          <div className="flex gap-2">
            {pagamento.status === "confirmado" ? (
              <Button variant="destructive" onClick={cancelarPagamento}>
                <XCircle className="mr-2 h-4 w-4" />
                Marcar como Pendente
              </Button>
            ) : (
              <Button variant="success" onClick={confirmarPagamento}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Pagamento
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
