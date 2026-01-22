"use client"

import { useState, useEffect } from "react"
import {
  Edit,
  MoreHorizontal,
  Trash,
  Loader2,
  Plus,
  AlertCircle,
  Calendar,
  ArrowLeft,
  PenToolIcon as Tool,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductById, type Product } from "@/lib/products"
import Link from "next/link"

interface ProductMaintenanceProps {
  productId: string
}

// Interface para manutenção simulada
interface MockMaintenance {
  id: string
  product_id: string
  maintenance_date: string
  maintenance_type: string
  description: string
  cost: number
  status: string
  provider?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

// Função para gerar dados simulados de manutenção
function generateMockMaintenances(productId: string): MockMaintenance[] {
  return [
    {
      id: "mock-1",
      product_id: productId,
      maintenance_date: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 dias atrás
      maintenance_type: "preventive",
      description: "Regular maintenance check",
      cost: 50,
      status: "completed",
      provider: "John Smith",
      notes: "Everything looks good, replaced some minor parts",
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: "mock-2",
      product_id: productId,
      maintenance_date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 dias atrás
      maintenance_type: "corrective",
      description: "Wheel replacement",
      cost: 120,
      status: "completed",
      provider: "Mike Johnson",
      notes: null,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: "mock-3",
      product_id: productId,
      maintenance_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 dias no futuro
      maintenance_type: "preventive",
      description: "Scheduled maintenance",
      cost: 75,
      status: "scheduled",
      provider: "Service Center",
      notes: "Regular check-up and cleaning",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "mock-4",
      product_id: productId,
      maintenance_date: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 dias no futuro
      maintenance_type: "predictive",
      description: "Comprehensive inspection",
      cost: 150,
      status: "scheduled",
      provider: "Technical Services Inc.",
      notes: "Full diagnostic and preventive maintenance",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ]
}

export function ProductMaintenance({ productId }: ProductMaintenanceProps) {
  const { toast } = useToast()
  const [maintenances, setMaintenances] = useState<MockMaintenance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingMaintenance, setEditingMaintenance] = useState<MockMaintenance | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)

  // Função para carregar o produto
  const loadProduct = async () => {
    try {
      const productData = await getProductById(productId, true)
      if (productData) {
        setProduct(productData)
      }
    } catch (error) {
      console.error("Error loading product:", error)
    }
  }

  // Function to load maintenances - usando apenas dados simulados
  const loadMaintenances = async () => {
    setIsLoading(true)
    try {
      // Usando dados simulados
      const mockData = generateMockMaintenances(productId)
      setMaintenances(mockData)

      // Notificar o usuário que estamos usando dados simulados
      toast({
        title: "Demonstration Mode",
        description: "Showing sample maintenance records due to database configuration issues.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error generating mock maintenances:", error)
      setMaintenances([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load product and maintenances when component mounts
  useEffect(() => {
    loadProduct()
    loadMaintenances()
  }, [productId])

  const handleEdit = (maintenance: MockMaintenance) => {
    setEditingMaintenance({ ...maintenance })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deleteId) {
      setIsSubmitting(true)

      // Simulando a exclusão (modo de demonstração)
      setMaintenances(maintenances.filter((m) => m.id !== deleteId))
      toast({
        title: "Maintenance deleted",
        description: "The maintenance was successfully deleted (demonstration only).",
      })

      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
    }
  }

  const saveEdit = async () => {
    if (editingMaintenance) {
      setIsSubmitting(true)

      // Simulando a atualização (modo de demonstração)
      setMaintenances(maintenances.map((m) => (m.id === editingMaintenance.id ? editingMaintenance : m)))
      toast({
        title: "Maintenance updated",
        description: "The maintenance information was successfully updated (demonstration only).",
      })

      setIsSubmitting(false)
      setIsEditDialogOpen(false)
      setEditingMaintenance(null)
    }
  }

  // Separar manutenções agendadas e históricas
  const scheduledMaintenances = maintenances.filter(
    (m) => m.status === "scheduled" || new Date(m.maintenance_date) > new Date(),
  )
  const pastMaintenances = maintenances.filter(
    (m) => m.status === "completed" || new Date(m.maintenance_date) <= new Date(),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/products/${productId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/products/${productId}/maintenance/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Maintenance
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Basic details about this product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{product?.name || "Loading..."}</h2>
              <p className="text-sm text-muted-foreground">Code: {product?.code || "N/A"}</p>
            </div>
            <Badge variant="outline" className="w-fit">
              {product?.category?.name || "No category"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demonstration Mode</AlertTitle>
        <AlertDescription>
          Due to a database configuration issue, we're currently showing sample maintenance records. Editing and
          deleting will only affect the demonstration data.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled ({scheduledMaintenances.length})</TabsTrigger>
          <TabsTrigger value="history">History ({pastMaintenances.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="scheduled" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : scheduledMaintenances.length > 0 ? (
            <div className="space-y-4">
              {scheduledMaintenances.map((maintenance) => (
                <Card key={maintenance.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {maintenance.maintenance_type.charAt(0).toUpperCase() +
                              maintenance.maintenance_type.slice(1)}
                          </Badge>
                          <span className="text-sm font-medium">
                            Scheduled for {formatDate(maintenance.maintenance_date)}
                          </span>
                        </div>
                        <p className="text-sm">{maintenance.description}</p>
                        {maintenance.provider && (
                          <p className="text-xs text-muted-foreground">Technician: {maintenance.provider}</p>
                        )}
                        <p className="text-sm font-medium">Estimated cost: {formatCurrency(maintenance.cost)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={maintenance.status === "scheduled" ? "outline" : "secondary"}>
                          {maintenance.status.charAt(0).toUpperCase() + maintenance.status.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(maintenance)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(maintenance.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No scheduled maintenance</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pastMaintenances.length > 0 ? (
            <div className="space-y-4">
              {pastMaintenances.map((maintenance) => (
                <Card key={maintenance.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={maintenance.maintenance_type === "preventive" ? "default" : "destructive"}>
                            {maintenance.maintenance_type.charAt(0).toUpperCase() +
                              maintenance.maintenance_type.slice(1)}
                          </Badge>
                          <span className="text-sm font-medium">
                            Completed on {formatDate(maintenance.maintenance_date)}
                          </span>
                        </div>
                        <p className="text-sm">{maintenance.description}</p>
                        {maintenance.provider && (
                          <p className="text-xs text-muted-foreground">Technician: {maintenance.provider}</p>
                        )}
                        <p className="text-sm font-medium">Cost: {formatCurrency(maintenance.cost)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Completed</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(maintenance)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(maintenance.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {maintenance.notes && (
                      <div className="mt-2 rounded-md bg-muted p-2 text-xs">
                        <p className="font-medium">Notes:</p>
                        <p>{maintenance.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Tool className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No maintenance history</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Maintenance</DialogTitle>
            <DialogDescription>Update the maintenance information.</DialogDescription>
          </DialogHeader>
          {editingMaintenance && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingMaintenance.maintenance_date.split("T")[0]}
                  onChange={(e) => setEditingMaintenance({ ...editingMaintenance, maintenance_date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <select
                  id="edit-type"
                  value={editingMaintenance.maintenance_type}
                  onChange={(e) => setEditingMaintenance({ ...editingMaintenance, maintenance_type: e.target.value })}
                  className="col-span-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="predictive">Predictive</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <select
                  id="edit-status"
                  value={editingMaintenance.status}
                  onChange={(e) => setEditingMaintenance({ ...editingMaintenance, status: e.target.value })}
                  className="col-span-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingMaintenance.description}
                  onChange={(e) => setEditingMaintenance({ ...editingMaintenance, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-provider" className="text-right">
                  Provider
                </Label>
                <Input
                  id="edit-provider"
                  value={editingMaintenance.provider || ""}
                  onChange={(e) => setEditingMaintenance({ ...editingMaintenance, provider: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cost" className="text-right">
                  Cost ($)
                </Label>
                <Input
                  id="edit-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingMaintenance.cost}
                  onChange={(e) =>
                    setEditingMaintenance({
                      ...editingMaintenance,
                      cost: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  value={editingMaintenance.notes || ""}
                  onChange={(e) => setEditingMaintenance({ ...editingMaintenance, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this maintenance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
