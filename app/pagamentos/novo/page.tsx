import { NovoPagamentoForm } from "@/components/novo-pagamento-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoPagamentoPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/pagamentos">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Novo Pagamento</h1>
            <p className="text-sm text-muted-foreground">Registre um novo pagamento no sistema</p>
          </div>
        </div>

        <NovoPagamentoForm />
      </main>
    </div>
  )
}
