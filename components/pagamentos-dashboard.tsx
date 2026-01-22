"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PagamentosChart } from "@/components/pagamentos-chart"
import { PagamentosRecentes } from "@/components/pagamentos-recentes"
import { PagamentosMetodos } from "@/components/pagamentos-metodos"
import { formatCurrency } from "@/lib/utils"

export function PagamentosDashboard() {
  // Dados de exemplo para o dashboard
  const resumo = {
    total: 1595.0,
    pendente: 605.0,
    confirmado: 990.0,
    mediaValor: 199.38,
    totalMes: 1595.0,
    totalMesAnterior: 1350.0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumo.total)}</div>
          <p className="text-xs text-muted-foreground">
            +{Math.round((resumo.total / resumo.totalMesAnterior - 1) * 100)}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumo.pendente)}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((resumo.pendente / resumo.total) * 100)}% do total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pagamentos Confirmados</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumo.confirmado)}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((resumo.confirmado / resumo.total) * 100)}% do total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(resumo.mediaValor)}</div>
          <p className="text-xs text-muted-foreground">Por pagamento</p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Visão Geral de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <PagamentosChart />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Pagamentos Recentes</CardTitle>
          <CardDescription>Últimos 5 pagamentos registrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <PagamentosRecentes />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
          <CardDescription>Distribuição por método de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <PagamentosMetodos />
        </CardContent>
      </Card>
    </div>
  )
}
