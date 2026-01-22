"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, Edit, Eye, PenToolIcon, Trash2, ImageIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "@/hooks/use-toast"
import { deleteProduct, type Product } from "@/lib/products"

interface ProductsTableProps {
  products: Product[]
  isLoading?: boolean
}

type SortField = "name" | "daily_price" | "available_stock" | "is_active"
type SortDirection = "asc" | "desc"

export function ProductsTable({ products, isLoading = false }: ProductsTableProps) {
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await deleteProduct(id)
      if (result.success) {
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        })
        // Reload the page to refresh the product list
        window.location.reload()
      } else {
        toast({
          title: "Error deleting product",
          description: "Could not delete the product. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: "An error occurred while trying to delete the product.",
        variant: "destructive",
      })
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "")
    }

    if (sortField === "daily_price") {
      const aPrice = Number(a.daily_price || 0)
      const bPrice = Number(b.daily_price || 0)
      return sortDirection === "asc" ? aPrice - bPrice : bPrice - aPrice
    }

    if (sortField === "available_stock") {
      const aStock = Number(a.available_stock || 0)
      const bStock = Number(b.available_stock || 0)
      return sortDirection === "asc" ? aStock - bStock : bStock - aStock
    }

    if (sortField === "is_active") {
      const aActive = a.is_active ? 1 : 0
      const bActive = b.is_active ? 1 : 0
      return sortDirection === "asc" ? aActive - bActive : bActive - aActive
    }

    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new product</p>
        <Button asChild className="mt-4">
          <Link href="/products/new">Add Product</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              <div className="flex items-center">
                Product
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort("daily_price")}>
              <div className="flex items-center justify-end">
                Daily Rate
                <SortIcon field="daily_price" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer text-center" onClick={() => handleSort("available_stock")}>
              <div className="flex items-center justify-center">
                Stock
                <SortIcon field="available_stock" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer text-center" onClick={() => handleSort("is_active")}>
              <div className="flex items-center justify-center">
                Status
                <SortIcon field="is_active" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {product.primary_image_url ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image
                        src={product.primary_image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = "/diverse-products-still-life.png"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.brand} {product.model}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">${Number(product.daily_price).toFixed(2)}</TableCell>
              <TableCell className="text-center">
                {product.available_stock} / {product.total_stock}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={product.is_active ? "default" : "secondary"}
                  className={product.is_active ? "bg-green-500" : ""}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/products/${product.id}/maintenance`}>
                      <PenToolIcon className="h-4 w-4" />
                      <span className="sr-only">Maintenance</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/products/${product.id}/images`}>
                      <ImageIcon className="h-4 w-4" />
                      <span className="sr-only">Images</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-red-50 hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product and all associated
                          data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
