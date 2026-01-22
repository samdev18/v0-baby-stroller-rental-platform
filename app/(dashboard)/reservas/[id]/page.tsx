import { notFound } from "next/navigation"
import { ReservaDetalhes } from "@/components/reserva-detalhes"

interface ReservaPageProps {
  params: {
    id: string
  }
}

export default function ReservaPage({ params }: ReservaPageProps) {
  // Verificar se o ID é "nova" e redirecionar ou mostrar erro
  if (params.id === "nova") {
    notFound()
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ReservaDetalhes id={params.id} />
      </main>
    </div>
  )
}
