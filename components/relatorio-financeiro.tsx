"use client"

import { RelatorioFinanceiroResumo } from "@/components/relatorio-financeiro-resumo"
import { RelatorioOverviewChart } from "@/components/relatorio-overview-chart"

export function RelatorioFinanceiro() {
  return (
    <div className="space-y-8">
      <RelatorioFinanceiroResumo />

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-medium">Visão Geral Financeira</h3>
        <div className="h-[350px]">
          <RelatorioOverviewChart />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-medium">Principais Fontes de Receita</h3>
          <p className="text-sm text-muted-foreground mb-4">Distribuição das receitas por categoria</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Aluguel de Carrinhos de Bebê</span>
                <span className="text-sm font-medium">R$ 8.250,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "52%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>52% do total</span>
                <span>+18% vs. mês anterior</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Aluguel de Patinetes</span>
                <span className="text-sm font-medium">R$ 4.800,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "31%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>31% do total</span>
                <span>+5% vs. mês anterior</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Aluguel de Bicicletas</span>
                <span className="text-sm font-medium">R$ 2.700,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "17%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>17% do total</span>
                <span>+12% vs. mês anterior</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-medium">Principais Despesas</h3>
          <p className="text-sm text-muted-foreground mb-4">Distribuição das despesas por categoria</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Manutenção de Equipamentos</span>
                <span className="text-sm font-medium">R$ 2.100,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "33%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>33% do total</span>
                <span>-8% vs. mês anterior</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Salários e Encargos</span>
                <span className="text-sm font-medium">R$ 1.950,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "31%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>31% do total</span>
                <span>Sem alteração</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Marketing e Publicidade</span>
                <span className="text-sm font-medium">R$ 1.200,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: "19%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>19% do total</span>
                <span>+15% vs. mês anterior</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Aluguel e Utilidades</span>
                <span className="text-sm font-medium">R$ 1.070,00</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "17%" }}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>17% do total</span>
                <span>+2% vs. mês anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
