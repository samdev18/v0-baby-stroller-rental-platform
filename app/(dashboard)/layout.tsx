import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SidebarProvider } from "@/contexts/sidebar-context"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  )
}
