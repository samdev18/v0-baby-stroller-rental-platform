import { getProductById } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NewMaintenancePageProps {
  params: {
    id: string
  }
}

export default async function NewMaintenancePage({ params }: NewMaintenancePageProps) {
  const product = await getProductById(params.id, true)

  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    "use server"

    // No modo de demonstração, apenas redirecionamos de volta para a página de manutenção
    redirect(`/products/${params.id}/maintenance`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/products/${params.id}/maintenance`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Maintenance
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Maintenance Record</CardTitle>
          <CardDescription>Add a new maintenance record for {product.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demonstration Mode</AlertTitle>
            <AlertDescription>
              Due to a database configuration issue, this form is in demonstration mode. Submitted data will not be
              saved to the database.
            </AlertDescription>
          </Alert>

          <form action={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="maintenance_date" className="text-sm font-medium">
                    Date
                  </label>
                  <input
                    id="maintenance_date"
                    name="maintenance_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="maintenance_type" className="text-sm font-medium">
                    Type
                  </label>
                  <select
                    id="maintenance_type"
                    name="maintenance_type"
                    required
                    defaultValue="preventive"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="preventive">Preventive</option>
                    <option value="corrective">Corrective</option>
                    <option value="predictive">Predictive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  defaultValue="scheduled"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cost" className="text-sm font-medium">
                    Cost ($)
                  </label>
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    defaultValue="0.00"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="provider" className="text-sm font-medium">
                    Provider
                  </label>
                  <input
                    id="provider"
                    name="provider"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href={`/products/${params.id}/maintenance`}>Cancel</Link>
              </Button>
              <Button type="submit">Save Maintenance</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
