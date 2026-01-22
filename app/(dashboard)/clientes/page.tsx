import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ClientesTable } from "@/components/clientes-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
            <p className="text-sm text-muted-foreground">Gerencie todos os clientes cadastrados no sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/clientes/novo">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 md:max-w-xs">
            <Card>
              <CardHeader>
                <CardTitle>Buscar Clientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Nome, email ou telefone" className="pl-8" />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Todos</option>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="ordenar">
                    Ordenar por
                  </label>
                  <select
                    id="ordenar"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="nome">Nome (A-Z)</option>
                    <option value="recentes">Mais recentes</option>
                    <option value="alugueis">Mais aluguéis</option>
                  </select>
                </div>
                <Button className="w-full">Aplicar Filtros</Button>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <Tabs defaultValue="todos">
              <TabsList>
                <TabsTrigger value="todos">Todos os Clientes</TabsTrigger>
                <TabsTrigger value="ativos">Clientes Ativos</TabsTrigger>
                <TabsTrigger value="vip">Clientes VIP</TabsTrigger>
              </TabsList>
              <TabsContent value="todos">
                <Card>
                  <CardHeader>
                    <CardTitle>Todos os Clientes</CardTitle>
                    <CardDescription>Lista completa de todos os clientes cadastrados no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ClientesTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ativos">
                <Card>
                  <CardHeader>
                    <CardTitle>Clientes Ativos</CardTitle>
                    <CardDescription>Clientes com aluguéis ativos ou recentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ClientesTable filtro="ativos" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="vip">
                <Card>
                  <CardHeader>
                    <CardTitle>Clientes VIP</CardTitle>
                    <CardDescription>Clientes com status VIP e histórico de aluguéis frequentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ClientesTable filtro="vip" />
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
