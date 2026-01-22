"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { CartItemComponent } from "@/components/store/cart-item"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"

export function CartDrawer() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Abrir carrinho">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Seu Carrinho ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-1 my-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemComponent key={item.productId} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="mt-auto px-1">
              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Entrega</span>
                  <span>Grátis</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <SheetFooter className="flex flex-col gap-2 mt-4">
                <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                  <Link href="/store/checkout">Finalizar Compra</Link>
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                    Continuar Comprando
                  </Button>

                  <Button variant="outline" size="icon" onClick={clearCart} className="flex-none">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Limpar carrinho</span>
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-4">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="font-medium text-lg mb-1">Seu carrinho está vazio</h3>
            <p className="text-gray-500 text-center mb-6">
              Adicione produtos ao seu carrinho para continuar comprando.
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/store">Explorar Produtos</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
