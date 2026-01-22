import { redirect } from "next/navigation"

interface ProductoPageProps {
  params: {
    id: string
  }
}

export default function ProductoPage({ params }: ProductoPageProps) {
  redirect(`/products/${params.id}`)
}
