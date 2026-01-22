"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { useSidebar } from "@/contexts/sidebar-context"
import { Logo } from "@/components/logo"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  // Fechar a barra lateral quando a rota muda
  useEffect(() => {
    close()
  }, [pathname, close])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header para todos os dispositivos */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
        <HamburgerMenu />
        <div className="flex-1 flex items-center justify-center md:justify-start">
          <Logo className="h-8" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar para dispositivos móveis - aparece como overlay */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } bg-background border-r`}
        >
          <div className="h-16 flex items-center justify-center border-b">
            <Logo className="h-8" />
          </div>
          <SidebarNav onItemClick={close} />
        </aside>

        {/* Sidebar para desktop - sempre visível */}
        <aside className="hidden md:block w-64 border-r bg-background">
          <SidebarNav />
        </aside>

        {/* Overlay para fechar a sidebar em dispositivos móveis */}
        {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={close} aria-hidden="true" />}

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
