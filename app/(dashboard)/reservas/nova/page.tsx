import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReservaFormBasic } from "@/components/reserva-form-basic"

export default function NovaReservaPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/reservas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Nova Reserva</h1>
            <p className="text-sm text-muted-foreground">Cadastre uma nova reserva no sistema</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Reserva</CardTitle>
            <CardDescription>Preencha todos os campos para cadastrar uma nova reserva.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReservaFormBasic />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
