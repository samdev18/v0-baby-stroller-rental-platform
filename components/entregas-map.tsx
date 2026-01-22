"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"

export function EntregasMap() {
  const [mapLoaded, setMapLoaded] = useState(false)

  const entregas = [
    {
      id: "ENT-001",
      cliente: "Maria Silva",
      endereco: "Rua das Flores, 123 - Centro",
      data: "10/05/2025",
      horario: "09:00 - 10:00",
      tipo: "entrega",
      produto: "Carrinho de Bebê Modelo A",
      status: "pendente",
    },
    {
      id: "ENT-002",
      cliente: "João Santos",
      endereco: "Av. Principal, 456 - Jardim",
      data: "10/05/2025",
      horario: "11:00 - 12:00",
      tipo: "entrega",
      produto: "Scooter Elétrica Modelo X",
      status: "pendente",
    },
    {
      id: "ENT-003",
      cliente: "Ana Oliveira",
      endereco: "Rua dos Pinheiros, 789 - Vila Nova",
      data: "15/05/2025",
      horario: "14:00 - 15:00",
      tipo: "retirada",
      produto: "Carrinho de Bebê Modelo B",
      status: "pendente",
    },
  ]

  const abrirNoGoogleMaps = (endereco: string) => {
    const enderecoFormatado = encodeURIComponent(endereco)
    window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoFormatado}`, "_blank")
  }

  const abrirRotaCompleta = () => {
    // Aqui você poderia implementar uma lógica para criar uma rota otimizada
    // Para simplificar, vamos apenas abrir o primeiro endereço
    if (entregas.length > 0) {
      abrirNoGoogleMaps(entregas[0].endereco)
    }
  }

  useEffect(() => {
    // Simulando o carregamento do mapa
    setTimeout(() => {
      setMapLoaded(true)
    }, 1000)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={abrirRotaCompleta}>
          <Navigation className="mr-2 h-4 w-4" />
          Planejar Rota Completa
        </Button>
      </div>

      <div className="relative min-h-[400px] w-full rounded-lg border bg-muted/40">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Carregando mapa...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                Mapa com localizações de entrega seria exibido aqui.
                <br />
                Integração com Google Maps API necessária.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entregas.map((entrega) => (
          <Card key={entrega.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{entrega.cliente}</h4>
                    <Badge variant={entrega.tipo === "entrega" ? "default" : "secondary"}>
                      {entrega.tipo === "entrega" ? "Entrega" : "Retirada"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{entrega.produto}</p>
                  <div className="mt-2 flex items-start gap-1">
                    <span className="text-sm">{entrega.endereco}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium">
                    {entrega.data} • {entrega.horario}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => abrirNoGoogleMaps(entrega.endereco)}
                  title="Abrir no Google Maps"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
