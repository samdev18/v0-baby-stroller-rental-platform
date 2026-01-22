"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Edit, MoreHorizontal, Trash, Loader2, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { type ProductMaintenance, listProductMaintenance, updateMaintenance, deleteMaintenance } from "@/lib/products"
import Link from "next/link"

interface ProdutoManutencoesProps {
  produtoId: string
}

export function ProdutoManutencoes({ produtoId }: ProdutoManutencoesProps) {
  const { toast } = useToast()
  const [manutencoes, setManutencoes] = useState<ProductMaintenance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingManutencao, setEditingManutencao] = useState<ProductMaintenance | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Função para carregar as manutenções
  const loadManutencoes = async () => {
    setIsLoading(true)
    try {
      const data = await listProductMaintenance(produtoId)
      setManutencoes(data)
    } catch (error) {
      console.error("Erro ao carregar manutenções:", error)
      toast({
        title: "Erro ao carregar manutenções",
        description: "Não foi possível carregar as manutenções deste produto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar manutenções ao montar o componente
  useEffect(() => {
    loadManutencoes()
  }, [produtoId])

  const handleEdit = (manutencao: ProductMaintenance) => {
    setEditingManutencao({ ...manutencao })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      setIsSubmitting(true)
      try {
        const result = await deleteMaintenance(deleteId)
        if (result.success) {
          setManutencoes(manutencoes.filter((m) => m.id !== deleteId))
          toast({
            title: "Manutenção excluída",
            description: "A manutenção foi excluída com sucesso.",
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error: any) {
        toast({
          title: "Erro ao excluir manutenção",
          description: error.message || "Ocorreu um erro ao excluir a manutenção.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
        setIsDeleteDialogOpen(false)
        setDeleteId(null)
      }
    }
  }

  const saveEdit = async () => {
    if (editingManutencao) {
      setIsSubmitting(true)
      try {
        const result = await updateMaintenance(editingManutencao.id, {
          description: editingManutencao.description,
          maintenance_date: editingManutencao.maintenance_date,
          maintenance_type: editingManutencao.maintenance_type,
          cost: editingManutencao.cost,
          provider: editingManutencao.provider,
          notes: editingManutencao.notes,
        })

        if (result.success) {
          setManutencoes(manutencoes.map((m) => (m.id === editingManutencao.id ? editingManutencao : m)))
          toast({
            title: "Manutenção atualizada",
            description: "As informações da manutenção foram atualizadas com sucesso.",
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error: any) {
        toast({
          title: "Erro ao atualizar manutenção",
          description: error.message || "Ocorreu um erro ao atualizar a manutenção.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
        setIsEditDialogOpen(false)
        setEditingManutencao(null)
      }
    }
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href={`/produtos/${produtoId}/manutencoes`}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Manutenção
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : manutencoes.length > 0 ? (
        <div className="space-y-4">
          {manutencoes.map((manutencao) => (
            <div key={manutencao.id} className="flex items-start justify-between gap-3 rounded-md border p-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">{manutencao.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Realizada em {formatDate(manutencao.maintenance_date)}
                  </p>
                  <p className="text-xs text-muted-foreground">Fornecedor: {manutencao.provider || "Não informado"}</p>
                  {manutencao.notes && <p className="text-xs text-muted-foreground">Observações: {manutencao.notes}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-medium">{formatCurrency(manutencao.cost)}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(manutencao)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(manutencao.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">Nenhuma manutenção registrada</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Este produto ainda não possui registros de manutenção. Clique no botão acima para adicionar uma nova
            manutenção.
          </p>
        </div>
      )}

      {/* Dialog de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Manutenção</DialogTitle>
            <DialogDescription>Atualize as informações da manutenção.</DialogDescription>
          </DialogHeader>
          {editingManutencao && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-data" className="text-right">
                  Data
                </Label>
                <Input
                  id="edit-data"
                  type="date"
                  value={editingManutencao.maintenance_date.split("T")[0]}
                  onChange={(e) => setEditingManutencao({ ...editingManutencao, maintenance_date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-descricao" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="edit-descricao"
                  value={editingManutencao.description}
                  onChange={(e) => setEditingManutencao({ ...editingManutencao, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fornecedor" className="text-right">
                  Fornecedor
                </Label>
                <Input
                  id="edit-fornecedor"
                  value={editingManutencao.provider || ""}
                  onChange={(e) => setEditingManutencao({ ...editingManutencao, provider: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-valor" className="text-right">
                  Valor (R$)
                </Label>
                <Input
                  id="edit-valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingManutencao.cost}
                  onChange={(e) =>
                    setEditingManutencao({
                      ...editingManutencao,
                      cost: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Observações
                </Label>
                <Textarea
                  id="edit-notes"
                  value={editingManutencao.notes || ""}
                  onChange={(e) => setEditingManutencao({ ...editingManutencao, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={saveEdit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta manutenção? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
