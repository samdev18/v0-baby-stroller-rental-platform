import { CalendarDays, Filter, PlusCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EntregasTable } from "@/components/entregas-table"
import { EntregasMap } from "@/components/entregas-map"

export default function EntregasPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Entregas</h1>
            <p className="text-sm text-muted-foreground">Gerencie todas as entregas e retiradas de produtos</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/entregas/nova">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Entrega
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 md:max-w-xs">
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="search">
                    Buscar
                  </label>
                  <Input id="search" placeholder="Nome do cliente ou ID" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="data">
                    Data
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <Input id="data" type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="tipo">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Todos</option>
                    <option value="entrega">Entregas</option>
                    <option value="retirada">Retiradas</option>
                  </select>
                </div>
                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <Tabs defaultValue="lista">
              <TabsList>
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="mapa">Mapa</TabsTrigger>
              </TabsList>
              <TabsContent value="lista">
                <Card>
                  <CardHeader>
                    <CardTitle>Todas as Entregas</CardTitle>
                    <CardDescription>Visualize e gerencie todas as entregas e retiradas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EntregasTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="mapa">
                <Card>
                  <CardHeader>
                    <CardTitle>Mapa de Entregas</CardTitle>
                    <CardDescription>Visualize as entregas no mapa e planeje suas rotas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EntregasMap />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
