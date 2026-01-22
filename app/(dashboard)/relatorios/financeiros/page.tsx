import { Suspense } from "react"
import { CalendarRange, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RelatorioFinanceiro } from "@/components/relatorio-financeiro"
import { RelatorioFluxoCaixa } from "@/components/relatorio-fluxo-caixa"
import { RelatorioReceitas } from "@/components/relatorio-receitas"
import { RelatorioDespesas } from "@/components/relatorio-despesas"
import { RelatorioLucratividade } from "@/components/relatorio-lucratividade"
import { RelatoriosFiltros } from "@/components/relatorios-filtros"

export default function RelatoriosFinanceirosPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Relatórios Financeiros</h1>
            <p className="text-sm text-muted-foreground">Analise o desempenho financeiro do seu negócio de aluguel</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="gap-1">
              <CalendarRange className="h-4 w-4" />
              Período
            </Button>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <RelatoriosFiltros />

        <Tabs defaultValue="visao-geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="fluxo-caixa">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="lucratividade">Lucratividade</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Visão Geral Financeira</CardTitle>
                <CardDescription>Resumo do desempenho financeiro do seu negócio de aluguel</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Carregando relatório financeiro...</div>}>
                  <RelatorioFinanceiro />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fluxo-caixa" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Fluxo de Caixa</CardTitle>
                <CardDescription>Análise detalhada das entradas e saídas de caixa</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Carregando fluxo de caixa...</div>}>
                  <RelatorioFluxoCaixa />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receitas" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Análise de Receitas</CardTitle>
                <CardDescription>Detalhamento das receitas por categoria e período</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Carregando análise de receitas...</div>}>
                  <RelatorioReceitas />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="despesas" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Análise de Despesas</CardTitle>
                <CardDescription>Detalhamento das despesas por categoria e período</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Carregando análise de despesas...</div>}>
                  <RelatorioDespesas />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lucratividade" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Análise de Lucratividade</CardTitle>
                <CardDescription>Métricas de lucratividade e retorno sobre investimento</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Carregando análise de lucratividade...</div>}>
                  <RelatorioLucratividade />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
