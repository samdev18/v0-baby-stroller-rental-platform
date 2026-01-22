import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("API: Buscando clientes do banco de dados")

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("clients").select("*").order("name")

    if (error) {
      console.error("API: Erro ao buscar clientes:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`API: ${data?.length || 0} clientes encontrados`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("API: Erro ao buscar clientes:", error)
    return NextResponse.json({ error: "Falha ao buscar clientes" }, { status: 500 })
  }
}
