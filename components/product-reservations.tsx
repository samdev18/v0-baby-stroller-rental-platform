"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Reservation {
  id: string
  start_date: string
  end_date: string
  status: string
  total_price: number
  client: {
    id: string
    name: string
  }
}

interface ProductReservationsProps {
  productId: string
}

export function ProductReservations({ productId }: ProductReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReservations() {
      try {
        // This would be replaced with an actual API call
        // const response = await fetch(`/api/products/${productId}/reservations`)
        // const data = await response.json()

        // For now, we'll use mock data
        const mockReservations: Reservation[] = [
          {
            id: "res-1",
            start_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            end_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
            status: "confirmed",
            total_price: 250,
            client: {
              id: "client-1",
              name: "John Doe",
            },
          },
          {
            id: "res-2",
            start_date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
            end_date: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 days from now
            status: "pending",
            total_price: 300,
            client: {
              id: "client-2",
              name: "Jane Smith",
            },
          },
        ]

        setReservations(mockReservations)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching reservations:", err)
        setError("Failed to load reservations")
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [productId])

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading reservations...</div>
  }

  if (error) {
    return <div className="text-destructive p-4">{error}</div>
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="mb-4 text-muted-foreground">No reservations found for this product.</p>
        <Button asChild>
          <Link href="/reservations/new">Create New Reservation</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      reservation.status === "confirmed"
                        ? "default"
                        : reservation.status === "pending"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                  <span className="text-sm font-medium">Reservation #{reservation.id}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(reservation.start_date)} - {formatDate(reservation.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <Link href={`/clients/${reservation.client.id}`} className="hover:underline">
                    {reservation.client.name}
                  </Link>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Total: {formatCurrency(reservation.total_price)}</span>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href={`/reservations/${reservation.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/reservations/new">Create New Reservation</Link>
        </Button>
      </div>
    </div>
  )
}
