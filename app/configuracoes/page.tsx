import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfiguracoesGerais } from "@/components/configuracoes-gerais"
import { ConfiguracoesEmpresa } from "@/components/configuracoes-empresa"
import { ConfiguracoesNotificacoes } from "@/components/configuracoes-notificacoes"

export default function ConfiguracoesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Configurações</h1>
          <p className="text-sm text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        <Tabs defaultValue="empresa" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="gerais">Gerais</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>
          <TabsContent value="empresa">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Empresa</CardTitle>
                <CardDescription>Personalize as informações da sua empresa e a aparência do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfiguracoesEmpresa />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gerais">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Gerencie as configurações gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfiguracoesGerais />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConfiguracoesNotificacoes />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
