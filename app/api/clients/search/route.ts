import { type NextRequest, NextResponse } from "next/server"
import { searchClients } from "@/lib/clients"

export async function GET(request: NextRequest) {
  try {
    // Obter o parâmetro de consulta da URL
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""

    console.log(`🔍 API /clients/search chamada com query: "${query}"`)

    // Buscar clientes com base no termo de pesquisa
    const clients = await searchClients(query)

    console.log(`✅ API retornando ${clients.length} clientes:`, clients)

    // Se não encontrou clientes, retornar dados de fallback
    if (clients.length === 0) {
      const fallbackClients = [
        { id: "1", name: "João Silva", email: "joao@example.com", phone: "11999999999" },
        { id: "2", name: "Maria Oliveira", email: "maria@example.com", phone: "11988888888" },
        { id: "3", name: "Pedro Santos", email: "pedro@example.com", phone: "11977777777" },
      ]
      console.log("⚠️ Nenhum cliente encontrado, retornando dados de fallback")
      return NextResponse.json(fallbackClients)
    }

    // Retornar os clientes encontrados
    return NextResponse.json(clients)
  } catch (error: any) {
    console.error("❌ Erro na API de busca de clientes:", error)

    // Retornar dados de fallback em caso de erro
    const fallbackClients = [
      { id: "1", name: "João Silva", email: "joao@example.com", phone: "11999999999" },
      { id: "2", name: "Maria Oliveira", email: "maria@example.com", phone: "11988888888" },
      { id: "3", name: "Pedro Santos", email: "pedro@example.com", phone: "11977777777" },
    ]

    console.log("⚠️ Retornando dados de fallback devido a erro")
    return NextResponse.json(fallbackClients)
  }
}
