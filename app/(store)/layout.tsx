import type React from "react"
import { CartProvider } from "@/contexts/cart-context"
import { StoreNavbar } from "@/components/store/store-navbar"
import { StoreFooter } from "@/components/store/store-footer"

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <StoreNavbar />
        <main className="flex-1">{children}</main>
        <StoreFooter />
      </div>
    </CartProvider>
  )
}
