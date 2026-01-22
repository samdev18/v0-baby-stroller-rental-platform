"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useCart, type CartItem } from "@/contexts/cart-context"

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    updateItem(item.productId, { quantity: newQuantity })
    setIsUpdating(false)
  }

  const handleRemove = () => {
    removeItem(item.productId)
  }

  const itemTotal = item.priceCalculation
    ? item.priceCalculation.totalPrice * item.quantity
    : item.product.daily_price * item.quantity * (item.rentalDays || 1)

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
        <Link href={`/store/products/${item.productId}`}>
          <Image
            src={item.product.image_url || `/placeholder.svg?height=200&width=200&query=${item.product.name}`}
            alt={item.product.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, 96px"
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <Link href={`/store/products/${item.productId}`} className="font-medium hover:underline">
            {item.product.name}
          </Link>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Remover</span>
          </Button>
        </div>

        <div className="text-sm text-gray-500 mt-1">
          {item.startDate && item.endDate ? (
            <div>
              {format(new Date(item.startDate), "dd/MM/yyyy", { locale: ptBR })}
              {item.startTime && ` ${item.startTime}`} -{format(new Date(item.endDate), "dd/MM/yyyy", { locale: ptBR })}
              {item.endTime && ` ${item.endTime}`}
            </div>
          ) : (
            <div className="text-yellow-600">Datas não selecionadas</div>
          )}
        </div>

        <div className="text-sm mt-1">
          {item.priceCalculation?.isDiscounted ? (
            <div>
              <span>{formatCurrency(item.priceCalculation.pricePerDay)}</span>
              <span className="text-xs text-gray-400 line-through ml-2">
                {formatCurrency(item.product.daily_price)}
              </span>
              <span> x {item.rentalDays || 1} dias</span>
              {item.priceCalculation.tierName && (
                <div className="text-xs text-green-600 mt-1">{item.priceCalculation.tierName}</div>
              )}
            </div>
          ) : (
            <div>
              <span>{formatCurrency(item.product.daily_price)}</span> x {item.rentalDays || 1} dias
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="h-8 w-8 rounded-r-none"
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Diminuir</span>
            </Button>
            <div className="w-8 text-center text-sm">{item.quantity}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="h-8 w-8 rounded-l-none"
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Aumentar</span>
            </Button>
          </div>

          <div className="font-medium">{formatCurrency(itemTotal)}</div>
        </div>
      </div>
    </div>
  )
}
