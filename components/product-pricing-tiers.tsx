"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  getProductPricingTiers,
  createPricingTier,
  updatePricingTier,
  deletePricingTier,
  type ProductPricingTier,
} from "@/lib/product-pricing"

interface ProductPricingTiersProps {
  productId: string
}

interface TierFormData {
  min_days: number
  max_days?: number
  price_per_day: number
  tier_name?: string
}

export function ProductPricingTiers({ productId }: ProductPricingTiersProps) {
  const { toast } = useToast()
  const [tiers, setTiers] = useState<ProductPricingTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<TierFormData>({
    min_days: 1,
    max_days: undefined,
    price_per_day: 1,
    tier_name: "",
  })

  useEffect(() => {
    if (productId) {
      fetchTiers()
    }
  }, [productId])

  const fetchTiers = async () => {
    setIsLoading(true)
    try {
      const data = await getProductPricingTiers(productId)
      setTiers(data)
    } catch (error) {
      console.error("Error fetching pricing tiers:", error)
      toast({
        title: "Error",
        description: "Failed to load pricing tiers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTier = async () => {
    // Validate form data
    if (formData.min_days < 1) {
      toast({
        title: "Validation Error",
        description: "Minimum days must be at least 1",
        variant: "destructive",
      })
      return
    }

    if (formData.price_per_day <= 0) {
      toast({
        title: "Validation Error",
        description: "Price per day must be greater than 0",
        variant: "destructive",
      })
      return
    }

    if (formData.max_days && formData.max_days < formData.min_days) {
      toast({
        title: "Validation Error",
        description: "Maximum days must be greater than or equal to minimum days",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await createPricingTier({
        product_id: productId,
        min_days: formData.min_days,
        max_days: formData.max_days || null,
        price_per_day: formData.price_per_day,
        tier_name: formData.tier_name || null,
        is_active: true,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Pricing tier added successfully",
        })
        setShowAddForm(false)
        setFormData({
          min_days: 1,
          max_days: undefined,
          price_per_day: 1,
          tier_name: "",
        })
        fetchTiers()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add pricing tier",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTier = async (tierId: string, updatedData: Partial<ProductPricingTier>) => {
    try {
      const result = await updatePricingTier(tierId, updatedData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Pricing tier updated successfully",
        })
        setEditingTier(null)
        fetchTiers()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update pricing tier",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTier = async (tierId: string) => {
    try {
      const result = await deletePricingTier(tierId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Pricing tier deleted successfully",
        })
        fetchTiers()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete pricing tier",
        variant: "destructive",
      })
    }
  }

  const formatDaysRange = (minDays: number, maxDays?: number) => {
    if (maxDays) {
      return `${minDays}-${maxDays} days`
    }
    return `${minDays}+ days`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Pricing Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-gray-500">Loading pricing tiers...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Custom Pricing Tiers</CardTitle>
          <Button onClick={() => setShowAddForm(true)} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Tier
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Form */}
        {showAddForm && (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="min_days">Min Days</Label>
                  <Input
                    id="min_days"
                    type="number"
                    min="1"
                    value={formData.min_days}
                    onChange={(e) => setFormData({ ...formData, min_days: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_days">Max Days (optional)</Label>
                  <Input
                    id="max_days"
                    type="number"
                    min="1"
                    value={formData.max_days || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_days: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="No limit"
                  />
                </div>
                <div>
                  <Label htmlFor="price_per_day">Price per Day ($)</Label>
                  <Input
                    id="price_per_day"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price_per_day || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_day: Number.parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tier_name">Tier Name (optional)</Label>
                  <Input
                    id="tier_name"
                    value={formData.tier_name}
                    onChange={(e) => setFormData({ ...formData, tier_name: e.target.value })}
                    placeholder="e.g., Weekly Discount"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false)
                    setFormData({
                      min_days: 1,
                      max_days: undefined,
                      price_per_day: 1,
                      tier_name: "",
                    })
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddTier}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Tier
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Tiers */}
        {tiers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No custom pricing tiers configured.</p>
            <p className="text-sm">Add tiers to offer different prices based on rental duration.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tiers.map((tier) => (
              <TierRow
                key={tier.id}
                tier={tier}
                isEditing={editingTier === tier.id}
                onEdit={() => setEditingTier(tier.id)}
                onSave={(updatedData) => handleUpdateTier(tier.id, updatedData)}
                onCancel={() => setEditingTier(null)}
                onDelete={() => handleDeleteTier(tier.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TierRowProps {
  tier: ProductPricingTier
  isEditing: boolean
  onEdit: () => void
  onSave: (data: Partial<ProductPricingTier>) => void
  onCancel: () => void
  onDelete: () => void
}

function TierRow({ tier, isEditing, onEdit, onSave, onCancel, onDelete }: TierRowProps) {
  const [editData, setEditData] = useState({
    min_days: tier.min_days,
    max_days: tier.max_days || undefined,
    price_per_day: tier.price_per_day,
    tier_name: tier.tier_name || "",
  })

  const handleSave = () => {
    // Validate before saving
    if (editData.min_days < 1) {
      return // Don't save invalid data
    }

    if (editData.price_per_day <= 0) {
      return // Don't save invalid data
    }

    if (editData.max_days && editData.max_days < editData.min_days) {
      return // Don't save invalid data
    }

    onSave(editData)
  }

  const formatDaysRange = (minDays: number, maxDays?: number) => {
    if (maxDays) {
      return `${minDays}-${maxDays} days`
    }
    return `${minDays}+ days`
  }

  if (isEditing) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor={`edit_min_days_${tier.id}`}>Min Days</Label>
              <Input
                id={`edit_min_days_${tier.id}`}
                type="number"
                min="1"
                value={editData.min_days}
                onChange={(e) => setEditData({ ...editData, min_days: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor={`edit_max_days_${tier.id}`}>Max Days</Label>
              <Input
                id={`edit_max_days_${tier.id}`}
                type="number"
                min="1"
                value={editData.max_days || ""}
                onChange={(e) =>
                  setEditData({ ...editData, max_days: e.target.value ? Number.parseInt(e.target.value) : undefined })
                }
                placeholder="No limit"
              />
            </div>
            <div>
              <Label htmlFor={`edit_price_${tier.id}`}>Price per Day ($)</Label>
              <Input
                id={`edit_price_${tier.id}`}
                type="number"
                step="0.01"
                min="0.01"
                value={editData.price_per_day || ""}
                onChange={(e) => setEditData({ ...editData, price_per_day: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor={`edit_name_${tier.id}`}>Tier Name</Label>
              <Input
                id={`edit_name_${tier.id}`}
                value={editData.tier_name}
                onChange={(e) => setEditData({ ...editData, tier_name: e.target.value })}
                placeholder="e.g., Weekly Discount"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline">{formatDaysRange(tier.min_days, tier.max_days)}</Badge>
            <div className="font-medium">${tier.price_per_day.toFixed(2)}/day</div>
            {tier.tier_name && <div className="text-sm text-gray-600">{tier.tier_name}</div>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
