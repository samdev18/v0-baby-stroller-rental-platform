import type { Metadata } from "next"
import Link from "next/link"
import { StoreNavbar } from "@/components/store/store-navbar"
import { CheckoutPage } from "@/components/store/checkout-page"
import { StoreFooter } from "@/components/store/store-footer"

export const metadata: Metadata = {
  title: "Finalizar Compra | Aluguel de Carrinhos de Bebê",
  description: "Complete seu pedido de aluguel de carrinhos de bebê.",
}

export default function Checkout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/store" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/store/cart" className="hover:underline">
              Carrinho
            </Link>
            <span>/</span>
            <span>Checkout</span>
          </div>
        </div>
        <CheckoutPage />
      </main>
    </div>
  )
}
