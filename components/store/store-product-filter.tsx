"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductCategory } from "@/lib/products"

interface StoreProductFilterProps {
  categories: ProductCategory[]
  selectedCategory?: string
}

export function StoreProductFilter({ categories, selectedCategory }: StoreProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleCategoryChange = (value: string) => {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams(searchParams)

    // Reset to page 1 when changing category
    params.set("page", "1")

    // Set or remove category parameter
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold">Our Products</h2>
        <p className="text-gray-500">Find the perfect stroller for your Disney vacation</p>
      </div>

      <div className="w-full sm:w-auto">
        <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
