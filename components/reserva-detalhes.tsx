"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  CreditCard,
  Hotel,
  Phone,
  Mail,
  AlertTriangle,
  Truck,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reservation } from "@/lib/reservations"
import { formatCurrency } from "@/lib/utils"

interface ReservaDetalhesProps {
  id: string
}

export function ReservaDetalhes({ id }: ReservaDetalhesProps) {
  const router = useRouter()
  const [reserva, setReserva] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o ID parece ser um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      setError("ID de reserva inválido")
      setLoading(false)
      return
    }

    async function fetchReservation() {
      try {
        const response = await fetch(`/api/reservations/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Reserva não encontrada")
          }
          throw new Error("Falha ao carregar detalhes da reserva")
        }
        const data = await response.json()
        setReserva(data)
      } catch (err: any) {
        setError(err.message)
        console.error("Erro ao buscar detalhes da reserva:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservation()
  }, [id, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "default"
      case "pendente":
        return "outline"
      case "cancelado":
        return "destructive"
      case "concluido":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getEntregaStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "default"
      case "agendada":
        return "outline"
      case "pendente":
        return "secondary"
      case "cancelada":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando detalhes da reserva...</p>
        </div>
      </div>
    )
  }

  if (error || !reserva) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive">Erro: {error || "Reserva não encontrada"}</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
            <Button onClick={() => router.push("/dashboard/reservas")}>Voltar para reservas</Button>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reserva {reserva.id.substring(0, 8)}...</CardTitle>
                <CardDescription>Criada em {formatDate(reserva.created_at || "")}</CardDescription>
              </div>
              <Badge variant={getStatusColor(reserva.status)}>
                {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                <Image
                  src={reserva.product?.image_url || "/placeholder.svg?height=96&width=96&query=product"}
                  alt={reserva.product?.name || "Produto"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{reserva.product?.name || "Produto não encontrado"}</h3>
                <p className="text-sm text-muted-foreground">
                  {reserva.product?.daily_price ? `Diária: ${formatCurrency(reserva.product.daily_price)}` : ""}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline">ID: {reserva.product_id.substring(0, 8)}...</Badge>
                  <Link href={`/dashboard/produtos/${reserva.product_id}`}>
                    <Button variant="link" className="h-auto p-0 text-xs">
                      Ver produto
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Período da Reserva
              </h3>
              <div className="mt-2 rounded-md border p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Data de Início</p>
                    <p className="text-sm">
                      {formatDate(reserva.start_date)} às {reserva.start_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data de Término</p>
                    <p className="text-sm">
                      {formatDate(reserva.end_date)} às {reserva.end_time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hotel className="h-4 w-4" />
                Informações do Hotel
              </h3>
              <div className="mt-2 rounded-md border p-3 space-y-3">
                <div>
                  <p className="text-sm font-medium">{reserva.hotel_name || "Hotel não informado"}</p>
                  <p className="text-sm">{reserva.hotel_address || "Endereço não informado"}</p>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Horário de Chegada</p>
                    <p className="text-sm">
                      {reserva.arrival_date ? formatDate(reserva.arrival_date) : "Não informado"}
                      {reserva.arrival_time ? ` às ${reserva.arrival_time}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Quarto</p>
                    <p className="text-sm">{reserva.room_number || "Não informado"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Contato no Hotel</p>
                  <p className="text-sm">{reserva.hotel_contact || "Não informado"}</p>
                  <p className="text-sm">{reserva.hotel_phone || "Telefone não informado"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  Entrega
                </h3>
                <div className="mt-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {reserva.delivery_date ? formatDate(reserva.delivery_date) : "Data não definida"}
                    </p>
                    <Badge variant={getEntregaStatusColor(reserva.delivery_status || "pendente")}>
                      {(reserva.delivery_status || "pendente").charAt(0).toUpperCase() +
                        (reserva.delivery_status || "pendente").slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm">{reserva.delivery_time_range || "Horário não definido"}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {reserva.delivery_responsible || "Responsável não definido"}
                  </p>
                  {reserva.delivery_notes && (
                    <p className="mt-2 text-xs text-muted-foreground">{reserva.delivery_notes}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  Retirada
                </h3>
                <div className="mt-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {reserva.pickup_date ? formatDate(reserva.pickup_date) : "Data não definida"}
                    </p>
                    <Badge variant={getEntregaStatusColor(reserva.pickup_status || "pendente")}>
                      {(reserva.pickup_status || "pendente").charAt(0).toUpperCase() +
                        (reserva.pickup_status || "pendente").slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm">{reserva.pickup_time_range || "Horário não definido"}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {reserva.pickup_responsible || "Responsável não definido"}
                  </p>
                  {reserva.pickup_notes && <p className="mt-2 text-xs text-muted-foreground">{reserva.pickup_notes}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Informações de Pagamento
              </h3>
              <div className="mt-2 rounded-md border p-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Valor Total</p>
                    <p className="text-sm font-bold">{formatCurrency(reserva.total_value)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Forma de Pagamento</p>
                    <p className="text-sm">{reserva.payment_method || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </div>

            {reserva.notes && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Observações
                </h3>
                <div className="mt-2 rounded-md border p-3">
                  <p className="text-sm">{reserva.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">{reserva.client?.name || "Cliente não encontrado"}</h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline">ID: {reserva.client_id.substring(0, 8)}...</Badge>
                <Link href={`/clientes/${reserva.client_id}`}>
                  <Button variant="link" className="h-auto p-0 text-xs">
                    Ver cliente
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{reserva.client?.email || "Email não disponível"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{reserva.client?.phone || "Telefone não disponível"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/clientes/${reserva.client_id}`}>Ver histórico de reservas do cliente</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa de Localização
            </CardTitle>
            <CardDescription>Localização do hotel para entrega</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[200px] w-full overflow-hidden rounded-md border bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  Mapa de localização seria exibido aqui.
                  <br />
                  Integração com Google Maps necessária.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const endereco = encodeURIComponent(reserva.hotel_address || "")
                  if (reserva.hotel_address) {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, "_blank")
                  }
                }}
                disabled={!reserva.hotel_address}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Abrir no Google Maps
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Linha do Tempo
            </CardTitle>
            <CardDescription>Histórico de eventos da reserva</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="h-full w-px bg-border"></div>
                </div>
                <div>
                  <p className="font-medium">Reserva criada</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(reserva.created_at || "")} às{" "}
                    {new Date(reserva.created_at || "").toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {reserva.status === "confirmado" && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Pagamento confirmado</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(reserva.updated_at || "")} às{" "}
                      {new Date(reserva.updated_at || "").toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {reserva.delivery_status === "agendada" && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Entrega agendada</p>
                    <p className="text-xs text-muted-foreground">
                      {reserva.delivery_date ? formatDate(reserva.delivery_date) : "Data não definida"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">
                    {reserva.delivery_status === "concluida" ? "Entrega realizada" : "Aguardando entrega"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reserva.delivery_status === "concluida"
                      ? `Entregue em ${reserva.delivery_date ? formatDate(reserva.delivery_date) : "data não registrada"}`
                      : `Programada para ${reserva.delivery_date ? formatDate(reserva.delivery_date) : "data não definida"}`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
