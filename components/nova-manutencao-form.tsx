"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createMaintenance } from "@/lib/products"

interface NovaManutencaoFormProps {
  produtoId: string
}

export function NovaManutencaoForm({ produtoId }: NovaManutencaoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    maintenance_date: new Date().toISOString().split("T")[0], // Data atual como padrão
    description: "",
    provider: "",
    cost: "",
    maintenance_type: "corretiva",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validação básica
    if (!formData.maintenance_date || !formData.description || !formData.cost) {
      toast({
        title: "Erro ao cadastrar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createMaintenance({
        product_id: produtoId,
        maintenance_date: formData.maintenance_date,
        maintenance_type: formData.maintenance_type,
        description: formData.description,
        cost: Number.parseFloat(formData.cost),
        provider: formData.provider || null,
        notes: formData.notes || null,
      })

      if (result.success) {
        toast({
          title: "Manutenção registrada",
          description: "A manutenção foi registrada com sucesso e adicionada como despesa.",
        })

        // Redirecionar para a página de detalhes do produto
        router.push(`/produtos/${produtoId}`)
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Erro ao registrar manutenção",
        description: error.message || "Ocorreu um erro ao registrar a manutenção.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="maintenance_date">Data da Manutenção</Label>
        <Input
          id="maintenance_date"
          name="maintenance_date"
          type="date"
          value={formData.maintenance_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maintenance_type">Tipo de Manutenção</Label>
        <Select
          value={formData.maintenance_type}
          onValueChange={(value) => handleSelectChange("maintenance_type", value)}
        >
          <SelectTrigger id="maintenance_type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preventiva">Preventiva</SelectItem>
            <SelectItem value="corretiva">Corretiva</SelectItem>
            <SelectItem value="preditiva">Preditiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva o serviço realizado"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider">Fornecedor/Prestador de Serviço</Label>
        <Input
          id="provider"
          name="provider"
          placeholder="Nome do fornecedor ou prestador"
          value={formData.provider}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Valor (R$)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={formData.cost}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Observações adicionais (opcional)"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/produtos/${produtoId}`)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrar Manutenção
        </Button>
      </div>
    </form>
  )
}
