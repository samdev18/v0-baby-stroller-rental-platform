"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getUnitRentalHistory, type UnitRentalHistory } from "@/lib/product-units"

interface UnitHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unitId: string
  unitCode: string
}

export function UnitHistoryDialog({ open, onOpenChange, unitId, unitCode }: UnitHistoryDialogProps) {
  const [history, setHistory] = useState<UnitRentalHistory[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && unitId) {
      loadHistory()
    }
  }, [open, unitId])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const data = await getUnitRentalHistory(unitId)
      setHistory(data)
    } catch (error) {
      console.error("Error loading unit history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "rented":
        return (
          <Badge variant="default" className="bg-blue-500">
            Alugado
          </Badge>
        )
      case "returned":
        return (
          <Badge variant="default" className="bg-green-500">
            Devolvido
          </Badge>
        )
      case "damaged":
        return (
          <Badge variant="default" className="bg-red-500">
            Danificado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Histórico de Aluguéis</DialogTitle>
          <DialogDescription>Histórico completo da unidade {unitCode}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Carregando histórico...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum histórico de aluguel encontrado
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.client_name}</TableCell>
                    <TableCell>{new Date(entry.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(entry.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.notes || "-"}</TableCell>
                    <TableCell>{new Date(entry.created_at || "").toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}
