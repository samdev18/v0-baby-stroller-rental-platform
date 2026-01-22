"use client"

import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EntregasHoje() {
  const entregas = [
    {
      id: "ENT-001",
      cliente: "Maria Silva",
      endereco: "Rua das Flores, 123 - Centro",
      horario: "09:00 - 10:00",
      tipo: "entrega",
      produto: "Carrinho de Bebê Modelo A",
    },
    {
      id: "ENT-002",
      cliente: "João Santos",
      endereco: "Av. Principal, 456 - Jardim",
      horario: "11:00 - 12:00",
      tipo: "entrega",
      produto: "Scooter Elétrica Modelo X",
    },
    {
      id: "ENT-003",
      cliente: "Ana Oliveira",
      endereco: "Rua dos Pinheiros, 789 - Vila Nova",
      horario: "14:00 - 15:00",
      tipo: "retirada",
      produto: "Carrinho de Bebê Modelo B",
    },
    {
      id: "ENT-004",
      cliente: "Carlos Pereira",
      endereco: "Alameda Santos, 321 - Jardim Europa",
      horario: "16:00 - 17:00",
      tipo: "retirada",
      produto: "Scooter Modelo Y",
    },
    {
      id: "ENT-005",
      cliente: "Fernanda Lima",
      endereco: "Rua Ipiranga, 567 - Centro",
      horario: "18:00 - 19:00",
      tipo: "entrega",
      produto: "Carrinho de Bebê Modelo C",
    },
  ]

  const abrirNoGoogleMaps = (endereco: string) => {
    const enderecoFormatado = encodeURIComponent(endereco)
    window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`, "_blank")
  }

  return (
    <div className="space-y-4">
      {entregas.map((entrega) => (
        <Card key={entrega.id} className="card-hover overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{entrega.cliente}</h4>
                  <Badge
                    variant={entrega.tipo === "entrega" ? "default" : "secondary"}
                    className={entrega.tipo === "entrega" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {entrega.tipo === "entrega" ? "Entrega" : "Retirada"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{entrega.produto}</p>
                <div className="mt-2 flex items-start gap-1">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-sm">{entrega.endereco}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{entrega.horario}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => abrirNoGoogleMaps(entrega.endereco)}
                title="Abrir no Google Maps"
                className="text-primary hover:text-primary hover:bg-primary/10 hover:border-primary/30"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
