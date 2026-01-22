import { AuthGuard } from "@/components/auth-guard"
import { redirect } from "next/navigation"

export default function Home() {
  // Redirecionar para o dashboard
  redirect("/dashboard")

  // Este código nunca será executado devido ao redirecionamento acima,
  // mas é necessário para satisfazer o TypeScript
  return (
    <AuthGuard>
      <div>Redirecionando...</div>
    </AuthGuard>
  )
}
