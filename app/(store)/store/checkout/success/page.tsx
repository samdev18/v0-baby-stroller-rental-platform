"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isTestMode, setIsTestMode] = useState(false)

  useEffect(() => {
    async function processOrder() {
      try {
        // Get session ID from URL
        const sessionId = searchParams?.get("session_id")

        // Get pending order from localStorage
        const pendingOrderJson = localStorage.getItem("pendingOrder")

        if (!pendingOrderJson) {
          setError("Detalhes do pedido não encontrados")
          setIsLoading(false)
          return
        }

        const pendingOrder = JSON.parse(pendingOrderJson)
        setIsTestMode(pendingOrder.test_mode)

        // If we have a session ID, verify the payment with Stripe
        if (sessionId && !pendingOrder.test_mode) {
          const verifyResponse = await fetch(`/api/checkout/verify?session_id=${sessionId}`)

          if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json()
            throw new Error(errorData.error || "Erro ao verificar pagamento")
          }

          const verifyData = await verifyResponse.json()

          if (!verifyData.success) {
            throw new Error(verifyData.message || "Pagamento não confirmado")
          }
        }

        // Create reservations in the database
        const createReservationResponse = await fetch("/api/checkout/create-reservation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pendingOrder),
        })

        if (!createReservationResponse.ok) {
          const errorData = await createReservationResponse.json()
          throw new Error(errorData.error || "Erro ao criar reservas")
        }

        const reservationData = await createReservationResponse.json()

        // Clear cart and pending order
        clearCart()
        localStorage.removeItem("pendingOrder")

        // Set order details
        setOrderDetails({
          ...pendingOrder,
          reservations: reservationData.reservations,
          client_id: reservationData.client_id,
        })

        // Show success toast
        toast({
          title: "Pedido confirmado!",
          description: "Seu pedido foi processado com sucesso.",
        })
      } catch (error: any) {
        console.error("Error processing order:", error)
        setError(error.message || "Ocorreu um erro ao processar seu pedido")

        toast({
          title: "Erro no processamento",
          description: error.message || "Ocorreu um erro ao processar seu pedido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    processOrder()
  }, [searchParams, clearCart, toast])

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">Processando seu pedido...</h2>
        <p className="text-gray-500 text-center max-w-md">
          Estamos finalizando seu pedido. Por favor, não feche esta página.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro no processamento</h2>
        <p className="text-gray-500 text-center max-w-md mb-6">{error}</p>
        <Button asChild>
          <Link href="/store/cart">Voltar para o carrinho</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isTestMode && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Modo de Teste</AlertTitle>
          <AlertDescription>
            Este pedido foi processado em modo de teste. Nenhum pagamento real foi realizado.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white border rounded-lg p-8 mb-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-500 text-center max-w-md">
            Seu pedido foi processado com sucesso. Você receberá um email com os detalhes da sua reserva.
          </p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Informações Pessoais</h3>
              <p className="text-gray-700">{orderDetails?.customerInfo.name}</p>
              <p className="text-gray-700">{orderDetails?.customerInfo.email}</p>
              <p className="text-gray-700">{orderDetails?.customerInfo.phone}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                <p className="text-gray-700">{orderDetails?.deliveryAddress.address}</p>
                <p className="text-gray-700">
                  {orderDetails?.deliveryAddress.city}, {orderDetails?.deliveryAddress.state},{" "}
                  {orderDetails?.deliveryAddress.zip}
                </p>
                {orderDetails?.deliveryAddress.notes && (
                  <p className="text-gray-500 mt-1">Obs: {orderDetails.deliveryAddress.notes}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Endereço de Retirada</h3>
                <p className="text-gray-700">{orderDetails?.pickupAddress.address}</p>
                <p className="text-gray-700">
                  {orderDetails?.pickupAddress.city}, {orderDetails?.pickupAddress.state},{" "}
                  {orderDetails?.pickupAddress.zip}
                </p>
                {orderDetails?.pickupAddress.notes && (
                  <p className="text-gray-500 mt-1">Obs: {orderDetails.pickupAddress.notes}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Itens</h3>
              <div className="space-y-2">
                {orderDetails?.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <p className="text-gray-500">
                        {item.quantity} x {item.rentalDays} dias
                      </p>
                    </div>
                    <div className="text-right">
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(
                          item.priceCalculation
                            ? item.priceCalculation.totalPrice * item.quantity
                            : item.product.daily_price * item.quantity * item.rentalDays,
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button asChild variant="outline">
          <Link href="/store">Continuar Comprando</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/reservas">Ver Minhas Reservas</Link>
        </Button>
      </div>
    </div>
  )
}
