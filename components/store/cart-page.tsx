"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CartItemComponent } from "@/components/store/cart-item"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"

export function CartPage() {
  const { items, itemCount, subtotal } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-[400px] flex items-center justify-center">Carregando carrinho...</div>
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 border rounded-lg bg-white">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          Parece que você ainda não adicionou nenhum produto ao seu carrinho. Explore nossa loja para encontrar o que
          você precisa.
        </p>
        <Button asChild size="lg">
          <Link href="/store">Explorar Produtos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-medium">Itens do Carrinho ({itemCount})</h2>
          </div>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.productId} className="p-4">
                <CartItemComponent item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white border rounded-lg p-4 sticky top-24">
          <h2 className="font-medium mb-4">Resumo do Pedido</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Entrega</span>
              <span className="text-green-600">Grátis</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <Button asChild className="w-full mt-6" size="lg">
            <Link href="/store/checkout" className="flex items-center justify-center">
              Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <div className="mt-4 text-center">
            <Link href="/store" className="text-sm text-primary hover:underline">
              Continuar Comprando
            </Link>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            <p className="mb-2 font-medium">Informações importantes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Entrega gratuita em todos os hotéis e resorts da região</li>
              <li>Cancelamento gratuito até 24h antes da data de retirada</li>
              <li>Todos os produtos são higienizados antes da entrega</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
