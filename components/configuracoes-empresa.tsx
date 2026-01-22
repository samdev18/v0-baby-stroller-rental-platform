"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/contexts/settings-context"
import { useToast } from "@/hooks/use-toast"

export function ConfiguracoesEmpresa() {
  const { companyName, setCompanyName, logoUrl, setLogoUrl, saveSettings } = useSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tempCompanyName, setTempCompanyName] = useState(companyName)
  const [tempLogoUrl, setTempLogoUrl] = useState(logoUrl)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Em um ambiente real, você enviaria o arquivo para um servidor
      // Aqui, estamos apenas criando uma URL temporária para visualização
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPreviewLogo(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulando envio para API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Atualizar as configurações
    setCompanyName(tempCompanyName)
    if (previewLogo) {
      setLogoUrl(previewLogo)
    }
    saveSettings()

    toast({
      title: "Configurações salvas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
    })

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="company-name">Nome da Empresa</Label>
          <Input
            id="company-name"
            value={tempCompanyName}
            onChange={(e) => setTempCompanyName(e.target.value)}
            className="mt-1"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Este nome será exibido na barra lateral e em todo o sistema
          </p>
        </div>

        <div>
          <Label>Logo da Empresa</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
              <Image src={previewLogo || tempLogoUrl} alt="Logo da empresa" fill className="object-contain p-2" />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Carregar Nova Logo
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <p className="text-xs text-muted-foreground">Recomendado: PNG ou SVG com fundo transparente, 512x512px</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
