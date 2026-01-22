"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Verificar se temos os parâmetros necessários na URL
    if (!searchParams?.has("code")) {
      setError("Link de redefinição de senha inválido ou expirado.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A senha e a confirmação de senha devem ser iguais.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const code = searchParams?.get("code") || ""

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        toast({
          title: "Erro ao validar código",
          description: error.message || "Link de redefinição inválido ou expirado.",
          variant: "destructive",
        })
        setError("Link de redefinição de senha inválido ou expirado.")
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        toast({
          title: "Erro ao redefinir senha",
          description: updateError.message || "Não foi possível atualizar sua senha.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi atualizada. Você já pode fazer login com a nova senha.",
      })

      // Redirecionar para a página de login após alguns segundos
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Redefinir senha</CardTitle>
            <CardDescription>Digite sua nova senha abaixo</CardDescription>
          </CardHeader>
          {error ? (
            <CardContent>
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                <p>{error}</p>
                <p className="mt-2">
                  Por favor, solicite um novo link de redefinição de senha na página de{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-red-800 underline"
                    onClick={() => router.push("/esqueci-senha")}
                  >
                    recuperação de senha
                  </Button>
                  .
                </p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando senha...
                    </>
                  ) : (
                    "Redefinir senha"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
