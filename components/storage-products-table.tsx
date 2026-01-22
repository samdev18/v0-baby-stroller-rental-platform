"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductUnitInStorage {
  id: string // unit id
  unit_code: string
  serial_number?: string | null
  status: string
  product_id: string
  products: {
    // product details
    id: string
    name: string
    code: string
    primary_image_url?: string | null
  }
}

interface StorageProductsTableProps {
  products: ProductUnitInStorage[]
}

export function StorageProductsTable({ products }: StorageProductsTableProps) {
  if (!products || products.length === 0) {
    return <p className="mt-4 text-muted-foreground">Nenhum produto encontrado neste storage.</p>
  }

  return (
    <div className="mt-4 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead>Produto (Unidade)</TableHead>
            <TableHead>Código da Unidade</TableHead>
            <TableHead>Status da Unidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>
                <Image
                  alt={unit.products.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={unit.products.primary_image_url || "/placeholder.svg?width=64&height=64&text=Sem+Imagem"}
                  width="64"
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{unit.products.name}</div>
                <div className="text-sm text-muted-foreground">
                  Produto Cód: {unit.products.code}
                  {unit.serial_number && ` / Serial: ${unit.serial_number}`}
                </div>
              </TableCell>
              <TableCell>{unit.unit_code}</TableCell>
              <TableCell>
                <Badge variant={unit.status === "available" ? "default" : "secondary"}>
                  {unit.status === "available" && "Disponível"}
                  {unit.status === "rented" && "Alugado"}
                  {unit.status === "maintenance" && "Manutenção"}
                  {unit.status === "inactive" && "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/products/${unit.product_id}/units?unitId=${unit.id}`} passHref>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Unidade
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
