import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Verificar se estamos em modo de teste
    const isTestSession = sessionId.startsWith("test_")

    if (isTestSession) {
      // Retornar dados simulados para modo de teste
      return NextResponse.json({
        status: "complete",
        customer_email: "teste@exemplo.com",
        payment_status: "paid",
        payment_method: "card",
        amount_total: 10000,
        metadata: {
          customer_name: "Cliente Teste",
          customer_email: "teste@exemplo.com",
          customer_phone: "(00) 00000-0000",
          delivery_address: "Endereço de Teste",
          pickup_address: "Endereço de Retirada Teste",
        },
        line_items: [
          {
            description: "Produto Teste - 3 dias",
            quantity: 1,
            amount_total: 10000,
          },
        ],
      })
    }

    // Verificar se o Stripe está configurado
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
      console.error("Stripe API key is missing or invalid")
      return NextResponse.json(
        {
          error: "Configuração do Stripe inválida",
          payment_status: "error",
        },
        { status: 500 },
      )
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2024-11-20.acacia",
      })

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "payment_intent"],
      })

      if (!session) {
        return NextResponse.json({ error: "Session not found", payment_status: "error" }, { status: 404 })
      }

      // Return session details
      return NextResponse.json({
        status: session.status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        payment_method: session.payment_method_types?.[0] || "card",
        shipping: session.shipping,
        metadata: session.metadata,
        line_items: session.line_items?.data,
      })
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError)
      return NextResponse.json(
        {
          error: `Erro do Stripe: ${stripeError.message}`,
          payment_status: "error",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Verify session error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        payment_status: "error",
      },
      { status: 500 },
    )
  }
}
