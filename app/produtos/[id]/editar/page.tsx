import { redirect } from "next/navigation"

interface EditarProductoPageProps {
  params: {
    id: string
  }
}

export default function EditarProductoPage({ params }: EditarProductoPageProps) {
  redirect(`/products/${params.id}/edit`)
}
