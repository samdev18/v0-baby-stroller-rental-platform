"use client"

import { ArrowDown, ArrowUp, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatorioFinanceiroResumoProps {
  periodo?: string
}

export function RelatorioFinanceiroResumo({ periodo = "Este mês" }: RelatorioFinanceiroResumoProps) {
  // Dados simulados para o resumo financeiro
  const resumo = {
    receitaTotal: 15750.0,
    receitaVariacao: 12.5,
    despesaTotal: 6320.0,
    despesaVariacao: -5.2,
    lucroLiquido: 9430.0,
    lucroVariacao: 18.7,
    margemLucro: 59.87,
    margemVariacao: 3.2,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {resumo.receitaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">{periodo}</p>
          <div className="flex items-center pt-1">
            {resumo.receitaVariacao > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">
                  +{resumo.receitaVariacao}% em relação ao período anterior
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">{resumo.receitaVariacao}% em relação ao período anterior</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {resumo.despesaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">{periodo}</p>
          <div className="flex items-center pt-1">
            {resumo.despesaVariacao < 0 ? (
              <>
                <ArrowDown className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">
                  {Math.abs(resumo.despesaVariacao)}% em relação ao período anterior
                </span>
              </>
            ) : (
              <>
                <ArrowUp className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">+{resumo.despesaVariacao}% em relação ao período anterior</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {resumo.lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">{periodo}</p>
          <div className="flex items-center pt-1">
            {resumo.lucroVariacao > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+{resumo.lucroVariacao}% em relação ao período anterior</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">{resumo.lucroVariacao}% em relação ao período anterior</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resumo.margemLucro.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">{periodo}</p>
          <div className="flex items-center pt-1">
            {resumo.margemVariacao > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+{resumo.margemVariacao}% em relação ao período anterior</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500">{resumo.margemVariacao}% em relação ao período anterior</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
