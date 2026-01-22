import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY não está definida" }, { status: 500 })
    }

    // Remover espaços extras
    const cleanKey = secretKey.trim()

    // Log dos primeiros e últimos 4 caracteres da chave para depuração
    const keyStart = cleanKey.substring(0, 7) // sk_test_
    const keyEnd = cleanKey.substring(cleanKey.length - 4)
    console.log(`Testando chave: ${keyStart}...${keyEnd}`)

    // Tentar inicializar o Stripe com a chave
    const stripe = new Stripe(cleanKey, {
      apiVersion: "2023-10-16",
    })

    // Fazer uma chamada simples para verificar se a chave funciona
    const paymentMethods = await stripe.paymentMethods.list({
      limit: 1,
    })

    return NextResponse.json({
      success: true,
      message: "Chave API do Stripe válida",
      keyFormat: `${keyStart}...${keyEnd}`,
    })
  } catch (error: any) {
    console.error("Erro ao testar chave do Stripe:", error)

    // Determinar o tipo de erro
    let errorMessage = "Erro desconhecido ao testar a chave API"
    let errorType = "unknown"

    if (error.type === "StripeAuthenticationError") {
      errorMessage = "Chave API inválida ou incorreta"
      errorType = "authentication"
    } else if (error.type === "StripeInvalidRequestError") {
      errorMessage = "Requisição inválida ao Stripe"
      errorType = "invalid_request"
    } else if (error.message.includes("Invalid API Key")) {
      errorMessage = "Chave API inválida (formato incorreto)"
      errorType = "invalid_key_format"
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorType,
        details: error.message,
      },
      { status: 500 },
    )
  }
}
