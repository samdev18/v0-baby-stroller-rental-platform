import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { items, customerInfo, deliveryAddress, pickupAddress, test_mode } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Verificar se o cliente já existe ou criar um novo
    let clientId: number | null = null

    // Buscar cliente pelo email
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("email", customerInfo.email)
      .single()

    if (existingClient) {
      clientId = existingClient.id

      // Atualizar informações do cliente
      await supabase
        .from("clients")
        .update({
          name: customerInfo.name,
          phone: customerInfo.phone,
          document: customerInfo.document,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId)
    } else {
      // Criar novo cliente
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          document: customerInfo.document,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (clientError) {
        console.error("Erro ao criar cliente:", clientError)
        return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
      }

      clientId = newClient.id
    }

    // Criar reservas para cada item
    const reservations = []

    for (const item of items) {
      const { data: reservation, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          client_id: clientId,
          product_id: item.productId,
          quantity: item.quantity,
          start_date: item.startDate || new Date().toISOString(),
          end_date: item.endDate || new Date(Date.now() + item.rentalDays * 86400000).toISOString(),
          status: "confirmed",
          total_price: item.priceCalculation ? item.priceCalculation.totalPrice * item.quantity : 0,
          payment_status: test_mode ? "test_payment" : "paid",
          delivery_address: `${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.zip}`,
          delivery_notes: deliveryAddress.notes || "",
          pickup_address: `${pickupAddress.address}, ${pickupAddress.city}, ${pickupAddress.state}, ${pickupAddress.zip}`,
          pickup_notes: pickupAddress.notes || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (reservationError) {
        console.error("Erro ao criar reserva:", reservationError)
        return NextResponse.json({ error: "Erro ao criar reserva" }, { status: 500 })
      }

      reservations.push(reservation)
    }

    return NextResponse.json({
      success: true,
      message: "Reservas criadas com sucesso",
      client_id: clientId,
      reservations: reservations,
    })
  } catch (error: any) {
    console.error("Erro ao criar reservas:", error)
    return NextResponse.json(
      {
        error: "Erro ao criar reservas",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
