"use client"

import { useState, useEffect, useCallback } from "react"
import { type Product, listProducts } from "@/lib/products"
import { ProductsTable } from "./products-table"
import { ProductFilters } from "./product-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface ProductsTableWrapperProps {
  category: string | null
}

export function ProductsTableWrapper({ category }: ProductsTableWrapperProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await listProducts(category)
        setProducts(data)
        setFilteredProducts(data)
      } catch (err: any) {
        console.error("Error loading products:", err)
        setError(err.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [category])

  // Use useCallback to prevent recreation of this function on every render
  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered)
  }, [])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading products...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ProductFilters products={products} onFilter={handleFilter} />
      <Card>
        <CardContent className="p-0">
          <ProductsTable products={filteredProducts} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
