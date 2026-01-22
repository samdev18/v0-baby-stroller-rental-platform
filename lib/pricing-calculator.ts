import type { ProductPricingTier } from "./product-pricing"

export interface PriceCalculation {
  pricePerDay: number
  totalPrice: number
  tierName?: string
  originalPrice: number
  savings: number
  isDiscounted: boolean
}

export function calculateProductPrice(
  defaultDailyPrice: number,
  days: number,
  pricingTiers: ProductPricingTier[] = [],
): PriceCalculation {
  // Se não há dias ou tiers, usar preço padrão
  if (days <= 0 || !pricingTiers.length) {
    return {
      pricePerDay: defaultDailyPrice,
      totalPrice: defaultDailyPrice * Math.max(1, days),
      originalPrice: defaultDailyPrice * Math.max(1, days),
      savings: 0,
      isDiscounted: false,
    }
  }

  // Encontrar o tier apropriado para o número de dias
  const applicableTier = pricingTiers.find((tier) => {
    return days >= tier.min_days && (tier.max_days === null || days <= tier.max_days)
  })

  if (applicableTier) {
    const tierPrice = applicableTier.price_per_day * days
    const originalPrice = defaultDailyPrice * days
    const savings = originalPrice - tierPrice

    return {
      pricePerDay: applicableTier.price_per_day,
      totalPrice: tierPrice,
      tierName: applicableTier.tier_name,
      originalPrice,
      savings,
      isDiscounted: savings > 0,
    }
  }

  // Se nenhum tier encontrado, usar preço padrão
  const totalPrice = defaultDailyPrice * days
  return {
    pricePerDay: defaultDailyPrice,
    totalPrice,
    originalPrice: totalPrice,
    savings: 0,
    isDiscounted: false,
  }
}

export function formatPriceWithDiscount(calculation: PriceCalculation): {
  displayPrice: string
  originalPrice?: string
  savings?: string
  discountPercentage?: number
} {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)

  if (calculation.isDiscounted && calculation.savings > 0) {
    const discountPercentage = Math.round((calculation.savings / calculation.originalPrice) * 100)

    return {
      displayPrice: formatCurrency(calculation.totalPrice),
      originalPrice: formatCurrency(calculation.originalPrice),
      savings: formatCurrency(calculation.savings),
      discountPercentage,
    }
  }

  return {
    displayPrice: formatCurrency(calculation.totalPrice),
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}

export function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice)
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}
