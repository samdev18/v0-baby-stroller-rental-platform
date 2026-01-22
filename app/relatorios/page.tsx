import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RelatorioFinanceiro } from "@/components/relatorio-financeiro"
import { RelatorioDespesas } from "@/components/relatorio-despesas"
import { RelatorioReceitas } from "@/components/relatorio-receitas"
import { RelatorioLucratividade } from "@/components/relatorio-lucratividade"
import { RelatorioProdutos } from "@/components/relatorio-produtos"
import { RelatorioClientes } from "@/components/relatorio-clientes"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2 } from "lucide-react"
import { RelatoriosFiltros } from "@/components/relatorios-filtros"

export default function RelatoriosPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Análise detalhada das finanças e operações do negócio</p>
          </div>
          <div className="flex items-center gap-2">
            <RelatoriosFiltros />
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid w-full grid-cols-6 md:w-[800px]">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="lucratividade">Lucratividade</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Financeiro</CardTitle>
                <CardDescription>
                  Visão geral das receitas, despesas e lucratividade do negócio no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioFinanceiro />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="receitas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Receitas</CardTitle>
                <CardDescription>Análise detalhada das receitas por categoria, produto e período</CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioReceitas />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="despesas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Despesas</CardTitle>
                <CardDescription>Análise detalhada das despesas por categoria, fornecedor e período</CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioDespesas />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lucratividade" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Lucratividade</CardTitle>
                <CardDescription>Análise da margem de lucro por produto, categoria e período</CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioLucratividade />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="produtos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Produtos</CardTitle>
                <CardDescription>Performance financeira dos produtos, taxa de ocupação e manutenção</CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioProdutos />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clientes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Clientes</CardTitle>
                <CardDescription>Análise do valor gerado por cliente, frequência e preferências</CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioClientes />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
