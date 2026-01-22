import { NextResponse } from "next/server"
import { listProducts } from "@/lib/products"

export async function GET() {
  try {
    const products = await listProducts()
    return NextResponse.json(products)
  } catch (error: any) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
