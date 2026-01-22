"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { createProductUnit, deleteProductUnit, listProductUnits, updateProductUnit } from "@/lib/product-units"
import { listStorages } from "@/lib/storages"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"

interface Storage {
  id: string
  name: string
  address: string
  city?: string
}

interface ProductUnit {
  id: string
  unit_code: string
  serial_number?: string | null
  status: "available" | "rented" | "maintenance" | "inactive"
  is_active: boolean
  notes?: string | null
  product_id: string
  storage_id?: string | null
  storage?: Storage | null
}

interface UnitFormData {
  id?: string
  unit_code: string
  serial_number?: string
  status: "available" | "rented" | "maintenance" | "inactive"
  is_active: boolean
  notes?: string
  storage_id?: string | null
}

const formSchema = z.object({
  unit_code: z.string().min(2, {
    message: "Unit code must be at least 2 characters.",
  }),
  serial_number: z.string().optional(),
  status: z.enum(["available", "rented", "maintenance", "inactive"]),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
  storage_id: z.string().nullable().optional(),
})

interface ProductUnitsManagementProps {
  productId: string
}

export function ProductUnitsManagement({ productId }: ProductUnitsManagementProps) {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null)
  const [unitToEdit, setUnitToEdit] = useState<ProductUnit | null>(null)
  const queryClient = useQueryClient()

  const [storages, setStorages] = useState<Storage[]>([])

  useEffect(() => {
    async function fetchStorages() {
      const fetchedStorages = await listStorages()
      setStorages(fetchedStorages)
    }
    fetchStorages()
  }, [])

  const { data: units, isLoading } = useQuery({
    queryKey: ["product-units", productId],
    queryFn: () => listProductUnits(productId),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unit_code: "",
      serial_number: "",
      status: "available",
      is_active: true,
      notes: "",
      storage_id: null,
    },
  })

  useEffect(() => {
    if (editOpen && unitToEdit) {
      form.reset({
        unit_code: unitToEdit.unit_code,
        serial_number: unitToEdit.serial_number || "",
        status: unitToEdit.status,
        is_active: unitToEdit.is_active,
        notes: unitToEdit.notes || "",
        storage_id: unitToEdit.storage_id || null,
      })
    } else if (open) {
      form.reset({
        unit_code: "",
        serial_number: "",
        status: "available",
        is_active: true,
        notes: "",
        storage_id: null,
      })
    }
  }, [editOpen, unitToEdit, open, form])

  const utils = useMutation({
    mutationFn: async (data: UnitFormData) => {
      if (data.id) {
        await updateProductUnit(data.id, data)
      } else {
        await createProductUnit({ ...data, product_id: productId })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-units", productId] })
      toast({
        title: "Success!",
        description: "Unit saved successfully.",
      })
      setOpen(false)
      setEditOpen(false)
      setUnitToEdit(null)
      form.reset()
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to save unit.",
        variant: "destructive",
      })
    },
  })

  const deleteUtils = useMutation({
    mutationFn: async (id: string) => {
      await deleteProductUnit(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-units", productId] })
      toast({
        title: "Success!",
        description: "Unit deleted successfully.",
      })
      setUnitToDelete(null)
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to delete unit.",
        variant: "destructive",
      })
    },
  })

  async function handleSaveUnit(values: z.infer<typeof formSchema>) {
    const data: UnitFormData = {
      ...values,
    }
    if (unitToEdit) {
      data.id = unitToEdit.id
    }
    await utils.mutateAsync(data)
  }

  const columns: ColumnDef<ProductUnit>[] = [
    {
      accessorKey: "unit_code",
      header: "Unit Code",
    },
    {
      accessorKey: "serial_number",
      header: "Serial Number",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <span className="capitalize">{status}</span>
      },
    },
    {
      accessorKey: "is_active",
      header: "Active",
      cell: ({ row }) => (row.original.is_active ? "Yes" : "No"),
    },
    {
      accessorKey: "storage",
      header: "Storage",
      cell: ({ row }) => {
        const unit = row.original
        return unit.storage ? (
          <Link href={`/storages/${unit.storage.id}`} className="hover:underline text-blue-600">
            {unit.storage.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setUnitToEdit(row.original)
              setEditOpen(true)
            }}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => setUnitToDelete(row.original.id)}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the unit and remove its data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (unitToDelete) {
                      await deleteUtils.mutateAsync(unitToDelete)
                    }
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: units || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Product Units</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4 italic text-muted-foreground">
                Loading...
              </TableCell>
            </TableRow>
          ) : units && units.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4 italic text-muted-foreground">
                No units found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Unit Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Unit</AlertDialogTitle>
            <AlertDialogDescription>Add a new unit to this product.</AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveUnit)} className="space-y-4">
              <FormField
                control={form.control}
                name="unit_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit Code" {...field} />
                    </FormControl>
                    <FormDescription>This is the unique identifier for the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Serial Number" {...field} />
                    </FormControl>
                    <FormDescription>This is the serial number of the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>This is the current status of the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Whether the unit is currently active.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storage_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (Localização)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                      defaultValue={field.value || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um storage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">Nenhum (Fora do Storage)</SelectItem>
                        {storages.map((storage) => (
                          <SelectItem key={storage.id} value={storage.id}>
                            {storage.name} - {storage.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Onde esta unidade está fisicamente armazenada.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Notes" {...field} />
                    </FormControl>
                    <FormDescription>Any additional notes for the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={utils.isPending}>
                  {utils.isPending ? "Saving..." : "Save"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Unit Dialog */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Unit</AlertDialogTitle>
            <AlertDialogDescription>Edit an existing unit for this product.</AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveUnit)} className="space-y-4">
              <FormField
                control={form.control}
                name="unit_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit Code" {...field} />
                    </FormControl>
                    <FormDescription>This is the unique identifier for the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Serial Number" {...field} />
                    </FormControl>
                    <FormDescription>This is the serial number of the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>This is the current status of the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Whether the unit is currently active.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storage_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (Localização)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                      defaultValue={field.value || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um storage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">Nenhum (Fora do Storage)</SelectItem>
                        {storages.map((storage) => (
                          <SelectItem key={storage.id} value={storage.id}>
                            {storage.name} - {storage.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Onde esta unidade está fisicamente armazenada.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Notes" {...field} />
                    </FormControl>
                    <FormDescription>Any additional notes for the unit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUnitToEdit(null)}>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={utils.isPending}>
                  {utils.isPending ? "Saving..." : "Save"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
