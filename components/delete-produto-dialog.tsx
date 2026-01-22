"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { deleteProduct } from "@/lib/products"

interface DeleteProdutoDialogProps {
  id: string
  nome: string
}

export function DeleteProdutoDialog({ id, nome }: DeleteProdutoDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProduct(id)
      if (result.success) {
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso.",
        })
        router.push("/produtos")
      } else {
        toast({
          title: "Erro ao excluir produto",
          description: "Não foi possível excluir o produto. Tente novamente.",
          variant: "destructive",
        })
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast({
        title: "Erro ao excluir produto",
        description: "Ocorreu um erro ao tentar excluir o produto.",
        variant: "destructive",
      })
      setIsOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Excluir Produto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir produto</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o produto "{nome}"? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
