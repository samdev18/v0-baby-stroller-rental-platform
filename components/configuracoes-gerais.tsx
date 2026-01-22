"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfiguracoesGerais() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Tema</h3>
          <p className="text-sm text-muted-foreground">Personalize a aparência do sistema</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Modo Escuro</Label>
            <p className="text-sm text-muted-foreground">Ative o modo escuro para reduzir o cansaço visual</p>
          </div>
          <Switch />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Idioma</h3>
          <p className="text-sm text-muted-foreground">Selecione o idioma do sistema</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="language">Idioma</Label>
          <Select defaultValue="pt-BR">
            <SelectTrigger id="language">
              <SelectValue placeholder="Selecione um idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Fuso Horário</h3>
          <p className="text-sm text-muted-foreground">Configure o fuso horário do sistema</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="timezone">Fuso Horário</Label>
          <Select defaultValue="America/New_York">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Selecione um fuso horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">America/New_York (EDT)</SelectItem>
              <SelectItem value="America/Chicago">America/Chicago (CDT)</SelectItem>
              <SelectItem value="America/Denver">America/Denver (MDT)</SelectItem>
              <SelectItem value="America/Los_Angeles">America/Los_Angeles (PDT)</SelectItem>
              <SelectItem value="America/Sao_Paulo">America/Sao_Paulo (BRT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  )
}
