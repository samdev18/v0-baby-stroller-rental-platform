import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PagamentosTable } from "@/components/pagamentos-table"
import { PagamentosDashboard } from "@/components/pagamentos-dashboard"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download } from "lucide-react"
import Link from "next/link"
import { PagamentosFiltros } from "@/components/pagamentos-filtros"

export default function PagamentosPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Pagamentos</h1>
            <p className="text-sm text-muted-foreground">Gerencie todos os pagamentos do sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <PagamentosFiltros />
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm" asChild>
              <Link href="/pagamentos/novo">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Pagamento
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-[600px]">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmados">Confirmados</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="todos" className="space-y-4">
            <PagamentosTable status="todos" />
          </TabsContent>
          <TabsContent value="pendentes" className="space-y-4">
            <PagamentosTable status="pendentes" />
          </TabsContent>
          <TabsContent value="confirmados" className="space-y-4">
            <PagamentosTable status="confirmados" />
          </TabsContent>
          <TabsContent value="dashboard" className="space-y-4">
            <PagamentosDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
