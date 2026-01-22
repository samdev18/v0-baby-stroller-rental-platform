"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteReservaDialogProps {
  id: string
}

export function DeleteReservaDialog({ id }: DeleteReservaDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao cancelar a reserva")
      }

      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso.",
      })

      setIsOpen(false)
      router.push("/reservas")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao cancelar a reserva.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Cancelar Reserva
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Reserva</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            A reserva <span className="font-medium">{id.substring(0, 8)}...</span> será cancelada e o produto ficará
            disponível para outras reservas.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            O cliente será notificado sobre o cancelamento. Se houver pagamento antecipado, será necessário processar o
            reembolso manualmente.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Confirmar Cancelamento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
