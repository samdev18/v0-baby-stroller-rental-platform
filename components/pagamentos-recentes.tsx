import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// Dados de exemplo para pagamentos recentes
const pagamentosRecentes = [
  {
    id: "PAG008",
    cliente: "Fernanda Lima",
    iniciais: "FL",
    valor: 220.0,
    data: "2023-05-17",
    metodo: "Transferência Bancária",
    status: "confirmado",
  },
  {
    id: "PAG007",
    cliente: "Roberto Alves",
    iniciais: "RA",
    valor: 175.0,
    data: "2023-05-16",
    metodo: "PayPal",
    status: "pendente",
  },
  {
    id: "PAG006",
    cliente: "Lucia Mendes",
    iniciais: "LM",
    valor: 300.0,
    data: "2023-05-15",
    metodo: "Cartão de Crédito",
    status: "confirmado",
  },
  {
    id: "PAG005",
    cliente: "Carlos Ferreira",
    iniciais: "CF",
    valor: 250.0,
    data: "2023-05-14",
    metodo: "Dinheiro",
    status: "pendente",
  },
  {
    id: "PAG004",
    cliente: "Ana Souza",
    iniciais: "AS",
    valor: 120.0,
    data: "2023-05-13",
    metodo: "Cartão de Débito",
    status: "confirmado",
  },
]

export function PagamentosRecentes() {
  return (
    <div className="space-y-8">
      {pagamentosRecentes.map((pagamento) => (
        <div key={pagamento.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">{pagamento.iniciais}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{pagamento.cliente}</p>
            <p className="text-sm text-muted-foreground">{pagamento.metodo}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">{formatCurrency(pagamento.valor)}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <p className="text-xs text-muted-foreground">{new Date(pagamento.data).toLocaleDateString("pt-BR")}</p>
              <Badge
                variant={pagamento.status === "confirmado" ? "success" : "warning"}
                className="ml-2 text-[10px] px-1 py-0"
              >
                {pagamento.status === "confirmado" ? "Confirmado" : "Pendente"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
