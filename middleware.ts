import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  // Cria um cliente Supabase para o servidor
  const supabase = createServerSupabaseClient()

  // Verifica se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não estiver autenticado, redireciona para o login
  if (!session) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Para rotas de admin, verifica se o usuário é administrador
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    // Se não for admin, redireciona para o dashboard
    if (data?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/produtos/:path*",
    "/clientes/:path*",
    "/reservas/:path*",
    "/pagamentos/:path*",
    "/relatorios/:path*",
    "/configuracoes/:path*",
    "/perfil",
  ],
}
