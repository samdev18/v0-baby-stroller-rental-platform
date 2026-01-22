import Stripe from "stripe"

// Função para inicializar o cliente Stripe com tratamento de erros
export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  // Verificar se a chave existe
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY não está definida nas variáveis de ambiente")
  }

  // Remover espaços extras que possam ter sido adicionados acidentalmente
  const cleanKey = secretKey.trim()

  // Verificar formato básico da chave
  if (!cleanKey.startsWith("sk_")) {
    throw new Error("STRIPE_SECRET_KEY inválida: deve começar com 'sk_'")
  }

  try {
    // Inicializar o cliente Stripe com versão estável
    return new Stripe(cleanKey, {
      apiVersion: "2023-10-16", // Versão estável
    })
  } catch (error: any) {
    console.error("Erro ao inicializar o cliente Stripe:", error)
    throw new Error(`Falha ao inicializar o Stripe: ${error.message}`)
  }
}

// Exportar uma versão lazy-loaded do cliente Stripe
let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance) {
    try {
      stripeInstance = getStripeClient()
    } catch (error: any) {
      console.error("Erro ao obter cliente Stripe:", error)
      throw error
    }
  }
  return stripeInstance
}
