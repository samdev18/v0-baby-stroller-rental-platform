import { redirect } from "next/navigation"

interface ManutencoesProductoPageProps {
  params: {
    id: string
  }
}

export default function ManutencoesProductoPage({ params }: ManutencoesProductoPageProps) {
  redirect(`/products/${params.id}/maintenance`)
}
