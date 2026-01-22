"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/sidebar-context"

export function HamburgerMenu() {
  const { isOpen, toggle } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden block" // Visível apenas em dispositivos móveis
      onClick={toggle}
      aria-label="Menu de navegação"
      aria-expanded={isOpen}
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
}
