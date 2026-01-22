"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { createStorage, updateStorage } from "@/lib/storages"

// Esquema de validação
const storageSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  address: z.string().min(5, { message: "O endereço deve ter pelo menos 5 caracteres" }),
  city: z.string().min(2, { message: "A cidade deve ter pelo menos 2 caracteres" }),
  state: z.string().min(2, { message: "O estado deve ter pelo menos 2 caracteres" }),
  postal_code: z.string().min(5, { message: "O CEP deve ter pelo menos 5 caracteres" }),
  country: z.string().min(2, { message: "O país deve ter pelo menos 2 caracteres" }).default("Brasil"),
  latitude: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : null)),
  longitude: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : null)),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
})

type StorageFormValues = z.infer<typeof storageSchema>

interface StorageFormProps {
  storage?: any
}

export function StorageForm({ storage }: StorageFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const form = useForm<StorageFormValues>({
    resolver: zodResolver(storageSchema),
    defaultValues: storage || {
      name: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Brasil",
      latitude: "",
      longitude: "",
      notes: "",
      is_active: true,
    },
  })

  const onSubmit = async (data: StorageFormValues) => {
    setIsSubmitting(true)

    try {
      const result = storage?.id ? await updateStorage(storage.id, data) : await createStorage(data as any)

      if (!result.success) {
        throw new Error(result.error || "Falha ao salvar o storage")
      }

      toast({
        title: storage?.id ? "Storage atualizado" : "Storage criado",
        description: `O storage foi ${storage?.id ? "atualizado" : "criado"} com sucesso.`,
      })

      router.push("/storages")
      router.refresh()
    } catch (error) {
      console.error("Error saving storage:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o storage.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        form.setValue("latitude", String(latitude))
        form.setValue("longitude", String(longitude))
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        toast({
          title: "Erro na localização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive",
        })
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do storage" {...field} />
                </FormControl>
                <FormDescription>Nome ou apelido para identificação</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço*</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormDescription>Rua, número, complemento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade*</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado*</FormLabel>
                <FormControl>
                  <Input placeholder="Estado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP*</FormLabel>
                <FormControl>
                  <Input placeholder="CEP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País*</FormLabel>
                <FormControl>
                  <Input placeholder="País" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Latitude" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Longitude" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="mb-2 gap-2"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {isGettingLocation ? "Obtendo localização..." : "Usar localização atual"}
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre este storage"
                  {...field}
                  value={field.value || ""}
                  rows={3}
                />
              </FormControl>
              <FormDescription>Opcional</FormDescription>
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
                <FormLabel>Ativo</FormLabel>
                <FormDescription>Storage disponível para uso</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {storage?.id ? "Atualizar Storage" : "Criar Storage"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
