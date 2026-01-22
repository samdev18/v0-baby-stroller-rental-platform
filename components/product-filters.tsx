"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"

interface ProductFiltersProps {
  products: Product[]
  onFilter: (filteredProducts: Product[]) => void
}

export function ProductFilters({ products, onFilter }: ProductFiltersProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [availability, setAvailability] = useState<"all" | "available" | "unavailable">("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true)

  // Find min and max prices from products
  const prices = products.map((p) => Number(p.daily_price || 0))
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000

  // Initialize price range based on actual product prices
  useEffect(() => {
    if (products.length > 0 && isFirstRender.current) {
      setPriceRange([minPrice, maxPrice])
      isFirstRender.current = false
    }
  }, [products, minPrice, maxPrice])

  // Apply filters whenever they change
  useEffect(() => {
    // Skip filtering on first render to avoid infinite loop
    if (isFirstRender.current) return

    const filtered = products.filter((product) => {
      // Filter by availability
      if (availability === "available" && (!product.is_active || product.available_stock <= 0)) {
        return false
      }
      if (availability === "unavailable" && product.is_active && product.available_stock > 0) {
        return false
      }

      // Filter by price range
      const price = Number(product.daily_price || 0)
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.model?.toLowerCase().includes(query)
        )
      }

      return true
    })

    onFilter(filtered)
  }, [searchQuery, availability, priceRange, products, onFilter])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setAvailability("all")
    setPriceRange([minPrice, maxPrice])
    setOpen(false)
  }

  // Count active filters
  const activeFilterCount = [
    searchQuery !== "",
    availability !== "all",
    priceRange[0] !== minPrice || priceRange[1] !== maxPrice,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 rounded-full px-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]" align="end">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                    <X className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Availability</h4>
                  <RadioGroup
                    value={availability}
                    onValueChange={(value: "all" | "available" | "unavailable") => setAvailability(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="available" id="available" />
                      <Label htmlFor="available">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unavailable" id="unavailable" />
                      <Label htmlFor="unavailable">Unavailable</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Price Range</h4>
                  <div className="pt-2">
                    <Slider
                      min={minPrice}
                      max={maxPrice}
                      step={1}
                      value={priceRange}
                      onValueChange={(value: [number, number]) => setPriceRange(value)}
                    />
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {availability !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {availability === "available" ? "Available" : "Unavailable"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setAvailability("all")} />
            </Badge>
          )}
          {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ${priceRange[0]} - ${priceRange[1]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([minPrice, maxPrice])} />
            </Badge>
          )}
          {activeFilterCount > 1 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs">
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
