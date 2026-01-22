"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import type { StoreProduct } from "@/lib/store-products"
import { calculateProductPrice, type PriceCalculation } from "@/lib/pricing-calculator"

export interface CartItem {
  productId: string
  product: StoreProduct
  quantity: number
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  rentalDays: number
  priceCalculation?: PriceCalculation
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: CartItem) => void
  updateItem: (productId: string, updates: Partial<CartItem>) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const isInitialized = useRef(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    // Evitar múltiplas inicializações
    if (isInitialized.current) return
    isInitialized.current = true

    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  // Calculate total item count
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  // Calculate subtotal using pricing tiers
  const subtotal = items.reduce((total, item) => {
    if (item.priceCalculation) {
      return total + item.priceCalculation.totalPrice * item.quantity
    }
    // Fallback para preço padrão se não houver cálculo
    return total + item.product.daily_price * item.quantity * (item.rentalDays || 1)
  }, 0)

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    // Calcular preço baseado nos tiers
    const priceCalculation = calculateProductPrice(
      newItem.product.daily_price,
      newItem.rentalDays || 1,
      newItem.product.pricing_tiers,
    )

    const itemWithPrice = {
      ...newItem,
      priceCalculation,
    }

    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex((item) => item.productId === newItem.productId)

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
          startDate: newItem.startDate || updatedItems[existingItemIndex].startDate,
          endDate: newItem.endDate || updatedItems[existingItemIndex].endDate,
          startTime: newItem.startTime || updatedItems[existingItemIndex].startTime,
          endTime: newItem.endTime || updatedItems[existingItemIndex].endTime,
          rentalDays: newItem.rentalDays || updatedItems[existingItemIndex].rentalDays,
          priceCalculation,
        }

        toast({
          title: "Carrinho atualizado",
          description: `Quantidade de "${newItem.product.name}" atualizada para ${updatedItems[existingItemIndex].quantity}`,
        })

        return updatedItems
      } else {
        // Add new item
        toast({
          title: "Produto adicionado",
          description: `"${newItem.product.name}" foi adicionado ao carrinho`,
        })

        return [...currentItems, itemWithPrice]
      }
    })
  }

  // Update item in cart
  const updateItem = (productId: string, updates: Partial<CartItem>) => {
    setItems((currentItems) => {
      const itemIndex = currentItems.findIndex((item) => item.productId === productId)

      if (itemIndex >= 0) {
        const updatedItems = [...currentItems]
        const currentItem = updatedItems[itemIndex]

        // Aplicar updates
        const updatedItem = { ...currentItem, ...updates }

        // Recalcular preço se os dias mudaram
        if (updates.rentalDays !== undefined) {
          const priceCalculation = calculateProductPrice(
            updatedItem.product.daily_price,
            updatedItem.rentalDays || 1,
            updatedItem.product.pricing_tiers,
          )
          updatedItem.priceCalculation = priceCalculation
        }

        updatedItems[itemIndex] = updatedItem

        toast({
          title: "Carrinho atualizado",
          description: `"${updatedItem.product.name}" foi atualizado`,
        })

        return updatedItems
      }

      return currentItems
    })
  }

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.productId === productId)
      const filteredItems = currentItems.filter((item) => item.productId !== productId)

      if (itemToRemove) {
        toast({
          title: "Produto removido",
          description: `"${itemToRemove.product.name}" foi removido do carrinho`,
        })
      }

      return filteredItems
    })
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    toast({
      title: "Carrinho esvaziado",
      description: "Todos os itens foram removidos do carrinho",
    })
  }

  // Check if product is in cart
  const isInCart = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
