"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Truck,
  Warehouse,
  CalendarRange,
  CreditCard,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type React from "react"

interface NavItem {
  href: string
  icon: React.ElementType // Use React.ElementType for component icons
  title: string
  disabled?: boolean
}

// Define a lista de rotas aqui para fácil manutenção
const routes: NavItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    title: "Dashboard",
  },
  {
    href: "/reservas",
    icon: CalendarRange,
    title: "Reservas",
  },
  {
    href: "/entregas", // Mantendo a rota de entregas existente
    icon: Truck, // Usando o ícone Truck que você já tinha para entregas
    title: "Entregas",
  },
  {
    href: "/produtos",
    icon: Package,
    title: "Produtos",
  },
  {
    href: "/products", // Mantendo a rota de products (se for diferente de produtos)
    icon: Package,
    title: "Products",
  },
  {
    href: "/clientes",
    icon: Users,
    title: "Clientes",
  },
  {
    href: "/pagamentos",
    icon: CreditCard,
    title: "Pagamentos",
  },
  {
    href: "/storages", // Nova rota para Storages
    icon: Warehouse,
    title: "Storages",
  },
  {
    href: "/relatorios",
    icon: BarChart3,
    title: "Relatórios",
  },
  {
    href: "/relatorios/financeiros",
    icon: BarChart3, // Pode ser o mesmo ou outro ícone
    title: "Relatórios Financeiros",
  },
  {
    href: "/loja",
    icon: ShoppingCart,
    title: "Loja Online",
  },
  {
    href: "/configuracoes",
    icon: Settings,
    title: "Configurações",
  },
]

interface SidebarNavProps {
  onItemClick?: () => void
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 overflow-auto p-2">
      <ul className="space-y-1">
        {routes.map((route) => {
          if (route.disabled) return null

          const isActive =
            pathname === route.href ||
            (route.href !== "/dashboard" && pathname.startsWith(`${route.href}/`)) ||
            (route.href === "/dashboard" && pathname === "/dashboard")

          return (
            <li key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={onItemClick}
              >
                <route.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{route.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
