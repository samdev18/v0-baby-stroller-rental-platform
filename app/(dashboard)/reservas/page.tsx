import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ReservasCalendario } from "@/components/reservas-calendario"
import { ReservasTable } from "@/components/reservas-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReservasFiltrosDialog } from "@/components/reservas-filtros-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReservasPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Reservas</h1>
            <p className="text-sm text-muted-foreground">Gerencie todas as reservas de carrinhos de bebê e scooters</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/reservas/nova">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por cliente, produto ou ID..." className="pl-8" />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="w-full sm:w-[180px]">
                  <Select defaultValue="todos">
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-[180px]">
                  <Select defaultValue="recentes">
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recentes">Mais recentes</SelectItem>
                      <SelectItem value="antigos">Mais antigos</SelectItem>
                      <SelectItem value="valor-maior">Maior valor</SelectItem>
                      <SelectItem value="valor-menor">Menor valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ReservasFiltrosDialog />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="lista">
          <TabsList>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
          </TabsList>
          <TabsContent value="lista">
            <Card>
              <CardContent className="p-0">
                <ReservasTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendario">
            <Card>
              <CardContent className="p-6">
                <ReservasCalendario />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
