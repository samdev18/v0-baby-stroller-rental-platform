"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSettings } from "@/contexts/settings-context"
import { User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/store/cart-drawer"

export function StoreNavbar() {
  const { companyName, logoUrl } = useSettings()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/store" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden">
                <Image src={logoUrl || "/logo.png"} alt={companyName} fill className="object-contain" />
              </div>
              <span className="text-lg font-semibold hidden sm:inline-block">{companyName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/store" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/store/products" className="text-sm font-medium hover:text-primary">
              Products
            </Link>
            <Link href="/store/how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="/store/faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
            <Link href="/store/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <CartDrawer />
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/store"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/store/products"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/store/how-it-works"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/store/faq"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/store/contact"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
