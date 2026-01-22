"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createMaintenance } from "@/lib/products"

interface NewMaintenanceFormProps {
  productId: string
}

export function NewMaintenanceForm({ productId }: NewMaintenanceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    maintenance_date: new Date().toISOString().split("T")[0], // Current date as default
    description: "",
    provider: "",
    cost: "",
    maintenance_type: "corrective",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.maintenance_date || !formData.description || !formData.cost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await createMaintenance({
        product_id: productId,
        maintenance_date: formData.maintenance_date,
        maintenance_type: formData.maintenance_type,
        description: formData.description,
        cost: Number.parseFloat(formData.cost),
        provider: formData.provider || null,
        notes: formData.notes || null,
      })

      if (result.success) {
        toast({
          title: "Maintenance registered",
          description: "The maintenance was successfully registered and added as an expense.",
        })

        // Redirect to product details page
        router.push(`/products/${productId}`)
        router.refresh()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error registering maintenance",
        description: error.message || "An error occurred while registering the maintenance.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="maintenance_date">Maintenance Date</Label>
        <Input
          id="maintenance_date"
          name="maintenance_date"
          type="date"
          value={formData.maintenance_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maintenance_type">Maintenance Type</Label>
        <Select
          value={formData.maintenance_type}
          onValueChange={(value) => handleSelectChange("maintenance_type", value)}
        >
          <SelectTrigger id="maintenance_type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preventive">Preventive</SelectItem>
            <SelectItem value="corrective">Corrective</SelectItem>
            <SelectItem value="predictive">Predictive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the service performed"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider">Provider/Service Provider</Label>
        <Input
          id="provider"
          name="provider"
          placeholder="Name of provider or service provider"
          value={formData.provider}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Cost ($)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.cost}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional notes (optional)"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/products/${productId}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Maintenance
        </Button>
      </div>
    </form>
  )
}
