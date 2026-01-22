"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Dados de exemplo para fallback
const FALLBACK_PRODUCTS = [
  {
    id: "1",
    name: "Carrinho de Bebê",
    category: "Bebê",
    daily_price: 50,
    image_url: "/carrinho-de-bebe.png",
  },
  {
    id: "2",
    name: "Patinete Elétrico",
    category: "Mobilidade",
    daily_price: 75,
    image_url: "/electric-scooter.png",
  },
  {
    id: "3",
    name: "Patinete Clássico",
    category: "Mobilidade",
    daily_price: 35,
    image_url: "/classic-red-scooter.png",
  },
]

interface Product {
  id: string
  name: string
  category: string
  daily_price: number
  image_url?: string
}

interface ProdutoSelectorTableProps {
  defaultValue?: string
  onSelect: (produtoId: string, produtoName?: string, produtoPrice?: number) => void
  className?: string
  disabled?: boolean
}

export function ProdutoSelectorTable({ defaultValue, onSelect, className, disabled }: ProdutoSelectorTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(defaultValue)
  const [selectedProductName, setSelectedProductName] = useState<string>("")
  const [showResults, setShowResults] = useState(false)
  const { toast } = useToast()

  // Função para buscar produtos
  const fetchProducts = useCallback(
    async (query = "") => {
      console.log("🔍 Buscando produtos com termo:", query)
      setLoading(true)

      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query || "")}`)

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.status}`)
        }

        const data = await response.json()
        console.log(`✅ Produtos recebidos: ${data.length}`, data)

        if (Array.isArray(data)) {
          setProducts(data.length > 0 ? data : FALLBACK_PRODUCTS)
        } else {
          console.error("❌ Dados recebidos não são um array:", data)
          setProducts(FALLBACK_PRODUCTS)
        }
      } catch (error) {
        console.error("❌ Erro ao buscar produtos:", error)
        toast({
          title: "Erro ao buscar produtos",
          description: "Usando dados de exemplo como fallback.",
          variant: "destructive",
        })
        setProducts(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  // Buscar produto específico pelo ID quando temos um valor padrão
  useEffect(() => {
    if (defaultValue && !selectedProductName) {
      console.log("🔍 Buscando produto por ID:", defaultValue)
      const fetchProductById = async () => {
        try {
          const response = await fetch(`/api/products/${defaultValue}`)
          if (response.ok) {
            const product = await response.json()
            console.log("✅ Produto encontrado por ID:", product)
            setSelectedProductId(product.id)
            setSelectedProductName(product.name)
            setSearchTerm(product.name)
          } else {
            // Se não conseguir buscar o produto, usar os dados de fallback
            const fallbackProduct = FALLBACK_PRODUCTS.find((p) => p.id === defaultValue)
            if (fallbackProduct) {
              setSelectedProductId(fallbackProduct.id)
              setSelectedProductName(fallbackProduct.name)
              setSearchTerm(fallbackProduct.name)
            }
          }
        } catch (error) {
          console.error("❌ Erro ao buscar produto por ID:", error)
          // Tentar usar os dados de fallback
          const fallbackProduct = FALLBACK_PRODUCTS.find((p) => p.id === defaultValue)
          if (fallbackProduct) {
            setSelectedProductId(fallbackProduct.id)
            setSelectedProductName(fallbackProduct.name)
            setSearchTerm(fallbackProduct.name)
          }
        }
      }

      fetchProductById()
    }
  }, [defaultValue, selectedProductName])

  // Buscar produtos quando o termo de busca muda
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm === "") {
      fetchProducts(debouncedSearchTerm)
      setShowResults(true)
    }
  }, [debouncedSearchTerm, fetchProducts])

  // Carregar produtos iniciais
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Função para selecionar um produto
  const handleSelectProduct = (product: Product) => {
    console.log("Produto selecionado:", product)
    setSelectedProductId(product.id)
    setSelectedProductName(product.name)
    setSearchTerm(product.name)
    setShowResults(false)
    onSelect(product.id, product.name, product.daily_price)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produto por nome ou categoria..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            if (e.target.value !== selectedProductName) {
              setSelectedProductId(undefined)
            }
          }}
          onFocus={() => setShowResults(true)}
          disabled={disabled}
        />
        {loading && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {showResults && (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço Diário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Buscando produtos...</span>
                      </div>
                    ) : (
                      "Nenhum produto encontrado"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className={cn("cursor-pointer hover:bg-muted/50", selectedProductId === product.id && "bg-muted")}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <TableCell>
                      {selectedProductId === product.id && <Check className="h-4 w-4 text-primary" />}
                    </TableCell>
                    <TableCell>
                      <div className="relative h-8 w-8 overflow-hidden rounded-md">
                        <Image
                          src={product.image_url || "/placeholder.svg?height=32&width=32&query=product"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>R$ {product.daily_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
