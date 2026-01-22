import { redirect } from "next/navigation"

export default function NovoProductoPage() {
  redirect("/products/new")
}
