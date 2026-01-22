import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ClienteForm } from "@/components/cliente-form"

export default function NovoClientePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/clientes">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Novo Cliente</h1>
            <p className="text-sm text-muted-foreground">Cadastre um novo cliente no sistema</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <ClienteForm />
        </div>
      </main>
    </div>
  )
}
