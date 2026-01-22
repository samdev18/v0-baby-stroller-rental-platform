import type { Metadata } from "next"
import Link from "next/link"
import { StoreNavbar } from "@/components/store/store-navbar"
import { CartPage } from "@/components/store/cart-page"
import { StoreFooter } from "@/components/store/store-footer"

export const metadata: Metadata = {
  title: "Carrinho de Compras | Aluguel de Carrinhos de Bebê",
  description: "Visualize e gerencie os itens no seu carrinho de compras.",
}

export default function Cart() {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Carrinho de Compras</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/store" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>Carrinho</span>
          </div>
        </div>
        <CartPage />
      </main>
      <StoreFooter />
    </div>
  )
}
