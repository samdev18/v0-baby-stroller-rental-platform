"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error, success } = await resetPassword(email)

      if (error) {
        toast({
          title: "Erro ao enviar e-mail",
          description: error.message || "Verifique seu e-mail e tente novamente.",
          variant: "destructive",
        })
        return
      }

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "E-mail enviado com sucesso",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar e-mail",
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
            <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
            <CardDescription>
              {isSubmitted
                ? "Enviamos um e-mail com instruções para redefinir sua senha."
                : "Digite seu e-mail para receber um link de recuperação de senha"}
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
                <div className="text-center text-sm">
                  <Link href="/login" className="inline-flex items-center font-medium text-primary hover:underline">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Voltar para o login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                <p>
                  Enviamos um e-mail para <strong>{email}</strong> com instruções para redefinir sua senha.
                </p>
                <p className="mt-2">
                  Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam ou tente novamente.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail("")
                }}
              >
                Tentar com outro e-mail
              </Button>
              <div className="text-center text-sm">
                <Link href="/login" className="inline-flex items-center font-medium text-primary hover:underline">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Voltar para o login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
