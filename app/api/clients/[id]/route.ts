import { type NextRequest, NextResponse } from "next/server"
import { getClientById } from "@/lib/clients"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`API /clients/${id} chamada`)

    if (!id) {
      return NextResponse.json({ error: "ID do cliente não fornecido" }, { status: 400 })
    }

    const client = await getClientById(id)

    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })
    }

    console.log(`Cliente encontrado:`, client)
    return NextResponse.json(client)
  } catch (error: any) {
    console.error("Erro na API de busca de cliente por ID:", error)
    return NextResponse.json({ error: error.message || "Erro ao buscar cliente" }, { status: 500 })
  }
}
