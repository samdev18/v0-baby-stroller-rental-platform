"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ConfiguracoesNotificacoes() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Notificações por Email</h3>
          <p className="text-sm text-muted-foreground">Configure quais emails você deseja receber</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Novas Reservas</Label>
              <p className="text-sm text-muted-foreground">Receba um email quando uma nova reserva for criada</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Entregas do Dia</Label>
              <p className="text-sm text-muted-foreground">Receba um resumo diário das entregas programadas</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Relatórios Semanais</Label>
              <p className="text-sm text-muted-foreground">Receba um relatório semanal com estatísticas do sistema</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Notificações no Sistema</h3>
          <p className="text-sm text-muted-foreground">Configure as notificações dentro do sistema</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Alertas em Tempo Real</Label>
              <p className="text-sm text-muted-foreground">Receba alertas em tempo real para eventos importantes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Sons de Notificação</Label>
              <p className="text-sm text-muted-foreground">Ative sons para notificações importantes</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  )
}
