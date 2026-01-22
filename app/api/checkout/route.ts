import { NextResponse } from "next/server"
import { calculateProductPrice } from "@/lib/pricing-calculator"
import { getStoreProduct } from "@/lib/store-products"
import { headers } from "next/headers"
import { createTestCheckoutSession } from "@/lib/test-checkout"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerInfo, deliveryAddress, pickupAddress, sameAsDelivery } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Determine base URL dynamically
    const headersList = headers()
    const host = headersList.get("host") || ""
    const protocol = host.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Verificar se devemos usar o modo de teste
    const forceTestMode = process.env.USE_TEST_MODE === "true"

    // Usar modo de teste por padrão para evitar erros
    const useTestMode = true

    // Tentar usar Stripe apenas se não estivermos forçando o modo de teste
    if (!forceTestMode) {
      try {
        const secretKey = process.env.STRIPE_SECRET_KEY

        if (secretKey && secretKey.startsWith("sk_")) {
          // Inicializar Stripe diretamente, sem usar a função auxiliar que pode estar causando problemas
          const stripe = new Stripe(secretKey, {
            apiVersion: "2023-10-16",
          })

          // Fetch full product details for each item
          const lineItems = await Promise.all(
            items.map(async (item: any) => {
              const product = await getStoreProduct(item.productId)
              if (!product) {
                throw new Error(`Product not found: ${item.productId}`)
              }

              // Calculate price based on rental duration and pricing tiers
              const priceCalculation = calculateProductPrice(product, item.rentalDays)
              const unitAmount = Math.round(priceCalculation.pricePerDay * 100) // Stripe uses cents

              return {
                price_data: {
                  currency: "brl",
                  product_data: {
                    name: product.name,
                    description: `Aluguel por ${item.rentalDays} dias`,
                    images: product.images && product.images.length > 0 ? [product.images[0].url] : undefined,
                  },
                  unit_amount: unitAmount,
                },
                quantity: item.quantity,
              }
            }),
          )

          // Create metadata with order details
          const metadata = {
            customer_name: customerInfo?.name || "",
            customer_email: customerInfo?.email || "",
            customer_phone: customerInfo?.phone || "",
            customer_document: customerInfo?.document || "",
            delivery_address: `${deliveryAddress?.address || ""}, ${deliveryAddress?.city || ""}, ${deliveryAddress?.state || ""}, ${deliveryAddress?.zip || ""}`,
            delivery_notes: deliveryAddress?.notes || "",
            pickup_address: sameAsDelivery
              ? `${deliveryAddress?.address || ""}, ${deliveryAddress?.city || ""}, ${deliveryAddress?.state || ""}, ${deliveryAddress?.zip || ""}`
              : `${pickupAddress?.address || ""}, ${pickupAddress?.city || ""}, ${pickupAddress?.state || ""}, ${pickupAddress?.zip || ""}`,
            pickup_notes: sameAsDelivery ? deliveryAddress?.notes || "" : pickupAddress?.notes || "",
            items_json: JSON.stringify(
              items.map((item: any) => ({
                product_id: item.productId,
                quantity: item.quantity,
                rental_days: item.rentalDays,
                start_date: item.startDate,
                end_date: item.endDate,
              })),
            ),
          }

          // Create Stripe checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${baseUrl}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/store/checkout?canceled=true`,
            metadata,
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: 0,
                    currency: "brl",
                  },
                  display_name: "Entrega Gratuita",
                  delivery_estimate: {
                    minimum: {
                      unit: "business_day",
                      value: 1,
                    },
                    maximum: {
                      unit: "business_day",
                      value: 2,
                    },
                  },
                },
              },
            ],
            allow_promotion_codes: true,
            billing_address_collection: "auto",
            phone_number_collection: {
              enabled: true,
            },
          })

          console.log("Stripe session created successfully:", session.id)
          return NextResponse.json({ url: session.url, stripe_mode: true })
        }
      } catch (stripeError: any) {
        console.error("Erro ao criar sessão do Stripe:", stripeError)
        // Continuar com o modo de teste
      }
    }

    // Se chegamos aqui, usamos o modo de teste
    console.log("Usando modo de teste para checkout")
    const testSession = await createTestCheckoutSession({
      items,
      customerInfo,
      deliveryAddress,
      pickupAddress: sameAsDelivery ? deliveryAddress : pickupAddress,
    })

    return NextResponse.json({
      url: testSession.url,
      test_mode: true,
    })
  } catch (error: any) {
    console.error("Erro geral no checkout:", error)
    return NextResponse.json(
      {
        error: "Erro ao processar o checkout",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
