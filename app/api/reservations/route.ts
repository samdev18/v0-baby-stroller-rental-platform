import { type NextRequest, NextResponse } from "next/server"
import { createReservation, listReservations } from "@/lib/reservations"

export async function GET() {
  try {
    const reservations = await listReservations()
    return NextResponse.json(reservations)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const reservation = await createReservation(data)
    return NextResponse.json(reservation)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
