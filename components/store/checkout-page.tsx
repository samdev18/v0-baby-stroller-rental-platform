"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingCart, CreditCard, Truck, Check, MapPin, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, itemCount, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sameAsDelivery, setSameAsDelivery] = useState(true)
  const [isTestMode, setIsTestMode] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)

  // Check for canceled parameter
  const canceled = searchParams?.get("canceled")

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  })

  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  })

  const [pickupAddress, setPickupAddress] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  })

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Check if payment was canceled
    if (canceled) {
      toast({
        title: "Pagamento cancelado",
        description: "Você cancelou o processo de pagamento.",
        variant: "destructive",
      })
    }
  }, [canceled, toast])

  if (!mounted) {
    return <div className="min-h-[400px] flex items-center justify-center">Carregando checkout...</div>
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 border rounded-lg bg-white">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          Você precisa adicionar produtos ao carrinho antes de finalizar a compra.
        </p>
        <Button asChild size="lg">
          <Link href="/store">Explorar Produtos</Link>
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStripeError(null)

    try {
      // Validate form
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.document) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip) {
        toast({
          title: "Endereço de entrega incompleto",
          description: "Por favor, preencha todos os campos do endereço de entrega.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (
        !sameAsDelivery &&
        (!pickupAddress.address || !pickupAddress.city || !pickupAddress.state || !pickupAddress.zip)
      ) {
        toast({
          title: "Endereço de retirada incompleto",
          description: "Por favor, preencha todos os campos do endereço de retirada.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Prepare data for Stripe
      const checkoutData = {
        items,
        customerInfo,
        deliveryAddress,
        pickupAddress,
        sameAsDelivery,
      }

      // Create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.details || "Erro ao processar pagamento")
      }

      const data = await response.json()

      // Check if we're in test mode
      if (data.test_mode) {
        setIsTestMode(true)
        if (data.stripe_error) {
          setStripeError(data.stripe_error)
        }
      }

      // Redirect to Stripe Checkout or test success page
      if (data.url) {
        // Store cart items in localStorage before redirecting
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            items,
            customerInfo,
            deliveryAddress,
            pickupAddress: sameAsDelivery ? deliveryAddress : pickupAddress,
            test_mode: data.test_mode,
          }),
        )

        // Redirect to Stripe or test success page
        window.location.href = data.url
      } else {
        throw new Error("URL de checkout não encontrada")
      }
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Erro no checkout",
        description: error.message || "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsDelivery(checked)

    // If checking the box, copy delivery address to pickup fields
    if (checked) {
      setPickupAddress({
        ...deliveryAddress,
      })
    }
  }

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleDeliveryAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const field = id.replace("delivery-", "")
    setDeliveryAddress((prev) => ({
      ...prev,
      [field]: value,
    }))

    // If same address is checked, update pickup address too
    if (sameAsDelivery) {
      setPickupAddress((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handlePickupAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const field = id.replace("pickup-", "")
    setPickupAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {stripeError && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aviso: Modo de Teste Ativado</AlertTitle>
            <AlertDescription>
              O Stripe retornou um erro, mas você pode continuar em modo de teste. O pagamento será simulado.
              <br />
              <span className="text-xs mt-1 block">Erro do Stripe: {stripeError}</span>
            </AlertDescription>
          </Alert>
        )}

        {isTestMode && !stripeError && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Modo de Teste Ativado</AlertTitle>
            <AlertDescription>
              O checkout está funcionando em modo de teste. Os pagamentos serão simulados sem usar o Stripe.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
              <Check className="h-5 w-5" />
              <h2 className="font-medium">Informações Pessoais</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    required
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    required
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">CPF/Passaporte</Label>
                  <Input
                    id="document"
                    placeholder="Documento de identificação"
                    required
                    value={customerInfo.document}
                    onChange={handleCustomerInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <h2 className="font-medium">Endereço de Entrega</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delivery-address">Endereço de Entrega</Label>
                <Input
                  id="delivery-address"
                  placeholder="Endereço completo"
                  required
                  value={deliveryAddress.address}
                  onChange={handleDeliveryAddressChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-city">Cidade</Label>
                  <Input
                    id="delivery-city"
                    placeholder="Cidade"
                    required
                    value={deliveryAddress.city}
                    onChange={handleDeliveryAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-state">Estado</Label>
                  <Input
                    id="delivery-state"
                    placeholder="Estado"
                    required
                    value={deliveryAddress.state}
                    onChange={handleDeliveryAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-zip">CEP</Label>
                  <Input
                    id="delivery-zip"
                    placeholder="00000-000"
                    required
                    value={deliveryAddress.zip}
                    onChange={handleDeliveryAddressChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-notes">Observações para Entrega (opcional)</Label>
                <Input
                  id="delivery-notes"
                  placeholder="Informações adicionais para entrega"
                  value={deliveryAddress.notes}
                  onChange={handleDeliveryAddressChange}
                />
              </div>
            </div>
          </div>

          {/* Pickup Address */}
          <div className="bg-white border rounded-lg overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <h2 className="font-medium">Endereço de Retirada</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="same-address" checked={sameAsDelivery} onCheckedChange={handleSameAddressChange} />
                <Label
                  htmlFor="same-address"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  O endereço de retirada é o mesmo da entrega
                </Label>
              </div>

              {!sameAsDelivery && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="pickup-address">Endereço de Retirada</Label>
                    <Input
                      id="pickup-address"
                      placeholder="Endereço completo"
                      required
                      value={pickupAddress.address}
                      onChange={handlePickupAddressChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-city">Cidade</Label>
                      <Input
                        id="pickup-city"
                        placeholder="Cidade"
                        required
                        value={pickupAddress.city}
                        onChange={handlePickupAddressChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickup-state">Estado</Label>
                      <Input
                        id="pickup-state"
                        placeholder="Estado"
                        required
                        value={pickupAddress.state}
                        onChange={handlePickupAddressChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickup-zip">CEP</Label>
                      <Input
                        id="pickup-zip"
                        placeholder="00000-000"
                        required
                        value={pickupAddress.zip}
                        onChange={handlePickupAddressChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickup-notes">Observações para Retirada (opcional)</Label>
                    <Input
                      id="pickup-notes"
                      placeholder="Informações adicionais para retirada"
                      value={pickupAddress.notes}
                      onChange={handlePickupAddressChange}
                    />
                  </div>
                </>
              )}

              {sameAsDelivery && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                  <p>A retirada será feita no mesmo endereço da entrega.</p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
              </span>
            ) : (
              <span className="flex items-center">
                Prosseguir para Pagamento <CreditCard className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white border rounded-lg p-4 sticky top-24">
          <h2 className="font-medium mb-4">Resumo do Pedido</h2>

          <div className="space-y-4 mb-4">
            {items.map((item) => {
              const itemTotal = item.priceCalculation
                ? item.priceCalculation.totalPrice * item.quantity
                : item.product.daily_price * item.quantity * item.rentalDays

              return (
                <div key={item.productId} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <div className="text-gray-500">
                      {item.quantity} x {item.rentalDays} dias
                      {item.priceCalculation?.tierName && (
                        <span className="text-green-600 ml-1">({item.priceCalculation.tierName})</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span>{formatCurrency(itemTotal)}</span>
                    {item.priceCalculation?.isDiscounted && (
                      <div className="text-xs text-gray-400 line-through">
                        {formatCurrency(item.product.daily_price * item.quantity * item.rentalDays)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Entrega</span>
              <span className="text-green-600">Grátis</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Retirada</span>
              <span className="text-green-600">Grátis</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
            <p className="mb-2 font-medium">Informações importantes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Entrega e retirada gratuitas em todos os hotéis e resorts da região</li>
              <li>Cancelamento gratuito até 24h antes da data de retirada</li>
              <li>Todos os produtos são higienizados antes da entrega</li>
              <li>Horário de entrega e retirada: 8h às 20h</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <Link href="/store/cart" className="text-sm text-primary hover:underline">
              Voltar para o Carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
