import { type NextRequest, NextResponse } from "next/server"
import { getReservationById, updateReservation, deleteReservation } from "@/lib/reservations"

interface Params {
  params: {
    id: string
  }
}

// Função auxiliar para validar UUID
function isValidUUID(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Validar o ID antes de prosseguir
    if (!isValidUUID(params.id)) {
      return NextResponse.json({ error: "Invalid reservation ID format" }, { status: 400 })
    }

    const reservation = await getReservationById(params.id)
    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }
    return NextResponse.json(reservation)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Validar o ID antes de prosseguir
    if (!isValidUUID(params.id)) {
      return NextResponse.json({ error: "Invalid reservation ID format" }, { status: 400 })
    }

    const data = await request.json()
    const reservation = await updateReservation(params.id, data)
    return NextResponse.json(reservation)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Validar o ID antes de prosseguir
    if (!isValidUUID(params.id)) {
      return NextResponse.json({ error: "Invalid reservation ID format" }, { status: 400 })
    }

    await deleteReservation(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
