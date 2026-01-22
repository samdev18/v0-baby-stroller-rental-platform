"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

const publicRoutes = ["/", "/login", "/cadastro", "/esqueci-senha", "/reset-password", "/store"]

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Se não estiver carregando
    if (!isLoading) {
      const isPublicRoute =
        publicRoutes.includes(pathname || "") ||
        pathname?.startsWith("/reset-password") ||
        pathname?.startsWith("/store")

      if (!user && !isPublicRoute) {
        // Redirecionar para login se não estiver autenticado e não for rota pública
        router.push("/login")
      } else if (user && (pathname === "/login" || pathname === "/cadastro")) {
        // Redirecionar para dashboard se já estiver autenticado e tentar acessar login/cadastro
        router.push("/dashboard")
      } else {
        // Autorizado a ver o conteúdo
        setIsAuthorized(true)
      }
    }
  }, [user, isLoading, pathname, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
