"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, MapPin, Package, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { deleteStorage } from "@/lib/storages"

interface Storage {
  id: string
  name: string
  address: string
  city: string
  state: string
  postal_code: string
  is_active: boolean
  created_at?: string
}

interface StoragesTableProps {
  storages: Storage[]
}

export function StoragesTable({ storages: initialStorages }: StoragesTableProps) {
  const [storages, setStorages] = useState<Storage[]>(initialStorages)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteStorageId, setDeleteStorageId] = useState<string | null>(null)
  const { toast } = useToast()

  // Filtra storages baseado no termo de busca
  const filteredStorages = storages.filter(
    (storage) =>
      storage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storage.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storage.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storage.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manipula exclusão de storage
  const handleDelete = async () => {
    if (!deleteStorageId) return

    try {
      const result = await deleteStorage(deleteStorageId)
      if (result.success) {
        setStorages(storages.filter((storage) => storage.id !== deleteStorageId))
        toast({
          title: "Storage excluído",
          description: "O storage foi removido com sucesso",
        })
      } else {
        toast({
          title: "Erro ao excluir",
          description: result.error || "Não foi possível excluir o storage",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting storage:", error)
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o storage",
        variant: "destructive",
      })
    } finally {
      setDeleteStorageId(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Buscar storages..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStorages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum storage encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredStorages.map((storage) => (
                <TableRow key={storage.id}>
                  <TableCell className="font-medium">{storage.name}</TableCell>
                  <TableCell>{storage.address}</TableCell>
                  <TableCell>
                    {storage.city}, {storage.state}
                  </TableCell>
                  <TableCell>
                    <Badge variant={storage.is_active ? "default" : "destructive"}>
                      {storage.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/storages/${storage.id}`}>
                        <Button variant="ghost" size="icon" title="Ver produtos">
                          <Package className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/storages/${storage.id}/editar`}>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Excluir"
                        onClick={() => setDeleteStorageId(storage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${storage.address}, ${storage.city}, ${storage.state}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" title="Ver no mapa">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteStorageId} onOpenChange={() => setDeleteStorageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este storage? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
