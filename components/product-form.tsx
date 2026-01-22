"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, X, Plus, ImageIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProduct, updateProduct, type ProductCategory } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { getProductImages, uploadImageToSupabase, deleteProductImage } from "@/lib/upload-image"
import { ProductPricingTiers } from "@/components/product-pricing-tiers"

// Define the form schema with Zod
const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  daily_price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  purchase_price: z.coerce.number().min(0, { message: "Purchase price must be a positive number." }).optional(),
  total_stock: z.coerce.number().int().min(0, { message: "Stock must be a positive integer." }),
  available_stock: z.coerce.number().int().min(0, { message: "Available stock must be a positive integer." }),
  category_id: z.string().min(1, { message: "Please select a category." }),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  notes: z.string().optional(),
  image_url: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string
  is_primary: boolean
  created_at?: string
}

interface ProductFormProps {
  product?: ProductFormValues & { id?: string }
  categories: ProductCategory[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Initialize the form with default values or existing product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      description: "",
      daily_price: 0,
      purchase_price: 0,
      total_stock: 1,
      available_stock: 1,
      category_id: "",
      brand: "",
      model: "",
      color: "",
      weight: "",
      dimensions: "",
      is_active: true,
      is_featured: false,
      notes: "",
      image_url: "",
    },
  })

  // Fetch product images if editing
  useEffect(() => {
    if (product?.id) {
      fetchProductImages(product.id)
    }
  }, [product?.id])

  const fetchProductImages = async (productId: string) => {
    setIsLoadingImages(true)
    try {
      const images = await getProductImages(productId)
      setProductImages(images)
    } catch (error) {
      console.error("Error fetching product images:", error)
      toast({
        title: "Error",
        description: "Failed to load product images",
        variant: "destructive",
      })
    } finally {
      setIsLoadingImages(false)
    }
  }

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: File[] = []
    const newPreviews: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image (JPG, PNG, etc.)",
          variant: "destructive",
        })
        continue
      }

      // Verificar tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        })
        continue
      }

      newFiles.push(file)

      // Criar preview
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === newFiles.length) {
          setPreviews([...previews, ...newPreviews])
          setSelectedFiles([...selectedFiles, ...newFiles])
        }
      }
      reader.readAsDataURL(file)
    }

    // Reset the input value so the same file can be selected again
    e.target.value = ""
  }

  // Remove a selected file
  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles]
    const newPreviews = [...previews]
    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
  }

  // Remove an existing image
  const removeExistingImage = async (imageId: string) => {
    try {
      const success = await deleteProductImage(imageId)
      if (success) {
        setProductImages(productImages.filter((img) => img.id !== imageId))
        toast({
          title: "Image removed",
          description: "The image has been removed successfully",
        })
      } else {
        throw new Error("Failed to remove image")
      }
    } catch (error) {
      console.error("Error removing image:", error)
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      })
    } finally {
      setIsLoadingImages(false)
    }
  }

  // Upload selected images
  const uploadImages = async (productId: string) => {
    if (selectedFiles.length === 0) return []

    setIsUploading(true)
    const uploadedImages: ProductImage[] = []

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // Upload da imagem para o Supabase
        const isPrimary = productImages.length === 0 && i === 0 // First image is primary if no other images exist
        const imageData = await uploadImageToSupabase(file, productId, isPrimary)

        if (!imageData) {
          throw new Error("Failed to upload image")
        }

        uploadedImages.push(imageData)
      }

      // Clear selected files and previews
      setSelectedFiles([])
      setPreviews([])

      return uploadedImages
    } catch (error) {
      console.error("Error uploading images:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)

    try {
      // Create or update the product
      const result = product?.id ? await updateProduct(product.id, data) : await createProduct(data)

      if (!result.success) {
        throw new Error(result.error || "Failed to save product")
      }

      const productId = result.id || product?.id

      if (productId) {
        // Upload images if any are selected
        if (selectedFiles.length > 0) {
          const newImages = await uploadImages(productId)
          setProductImages([...productImages, ...newImages])
        }

        toast({
          title: product?.id ? "Product updated" : "Product created",
          description: `Successfully ${product?.id ? "updated" : "created"} ${data.name}`,
        })

        // Redirect to the product detail page
        router.push(`/products/${productId}`)
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="daily_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Model" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Color" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="Weight" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="LxWxH" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>Product is available for rental</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>Show in featured products</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-lg">Product Images</FormLabel>
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Images
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Existing Images */}
          {isLoadingImages ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {productImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image src={image.url || "/placeholder.svg"} alt="Product image" fill className="object-cover" />
                    {image.is_primary && (
                      <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                        Primary
                      </div>
                    )}
                    <button
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Selected Files Preview */}
              {previews.map((preview, index) => (
                <Card key={`preview-${index}`} className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Empty State */}
              {productImages.length === 0 && previews.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <div className="rounded-full bg-gray-100 p-3">
                      <ImageIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">No images yet. Click "Add Images" to upload product images.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Product Pricing Tiers Section - Only show for existing products */}
        {product?.id && (
          <div className="space-y-4">
            <ProductPricingTiers productId={product.id} />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product?.id ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
