// Simulação de checkout para testes sem depender do Stripe
import { v4 as uuidv4 } from "uuid"

export interface TestCheckoutSession {
  id: string
  url: string
  success: boolean
  created_at: string
  metadata: any
  amount_total: number
}

export async function createTestCheckoutSession(data: any): Promise<TestCheckoutSession> {
  // Simular um pequeno atraso para parecer uma chamada de API real
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Criar uma sessão de teste
  const sessionId = `test_session_${uuidv4().replace(/-/g, "")}`

  // Calcular o total
  const amountTotal = data.items.reduce((total: number, item: any) => {
    const itemPrice = item.priceCalculation
      ? item.priceCalculation.totalPrice * item.quantity
      : item.product.daily_price * item.quantity * item.rentalDays
    return total + itemPrice
  }, 0)

  // Criar URL de teste que simula o redirecionamento para o Stripe
  // Mas na verdade redireciona diretamente para a página de sucesso
  const successUrl = `/store/checkout/success?test_mode=true&session_id=${sessionId}`

  // Armazenar os dados da sessão no localStorage para recuperar na página de sucesso
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `test_checkout_${sessionId}`,
      JSON.stringify({
        id: sessionId,
        created_at: new Date().toISOString(),
        metadata: {
          customer_name: data.customerInfo?.name,
          customer_email: data.customerInfo?.email,
          customer_phone: data.customerInfo?.phone,
          items_json: JSON.stringify(data.items),
          delivery_address: JSON.stringify(data.deliveryAddress),
          pickup_address: JSON.stringify(data.pickupAddress),
        },
        amount_total: amountTotal * 100, // Em centavos, como o Stripe
        payment_status: "paid",
        items: data.items,
      }),
    )
  }

  return {
    id: sessionId,
    url: successUrl,
    success: true,
    created_at: new Date().toISOString(),
    metadata: data,
    amount_total: amountTotal * 100,
  }
}

export function getTestCheckoutSession(sessionId: string): any {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem(`test_checkout_${sessionId}`)
  if (!sessionData) return null

  return JSON.parse(sessionData)
}
