import Link from "next/link"

const ProductsPage = () => {
  return (
    <div>
      <h1>Products</h1>
      <Link href="/dashboard/products/new">Add New Product</Link>
    </div>
  )
}

export default ProductsPage
