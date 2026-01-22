import { AuthGuard } from "@/components/auth-guard"
import { ReservasRecentes } from "@/components/reservas-recentes"
import { EntregasHoje } from "@/components/entregas-hoje"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ReservasRecentes />
          <EntregasHoje />
        </div>
      </div>
    </AuthGuard>
  )
}
