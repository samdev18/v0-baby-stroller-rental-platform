"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { StoreProduct } from "@/lib/store-products"
import {
  ShoppingCart,
  Info,
  Check,
  Clock,
  AlertCircle,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getProductImages } from "@/lib/upload-image"
import { calculateProductPrice, formatPriceWithDiscount } from "@/lib/pricing-calculator"

interface ProductDetailsProps {
  product: StoreProduct
}

interface ProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string
  is_primary: boolean
  created_at: string
}

// Gerar horários de 30 em 30 minutos
const generateTimeOptions = () => {
  const times = []
  for (let hour = 8; hour <= 20; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      times.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return times
}

const timeOptions = generateTimeOptions()

// Função para gerar dias do mês
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Função para gerar array com dias do mês
const generateDaysArray = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()
  const days = []

  // Adicionar dias vazios para alinhar com o dia da semana correto
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Adicionar os dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem, isInCart } = useCart()
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("18:00")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Estado para controlar o mês e ano exibidos no calendário
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [nextMonth, setNextMonth] = useState((today.getMonth() + 1) % 12)
  const [nextYear, setNextYear] = useState(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear())

  // Carregar imagens do produto
  useEffect(() => {
    const loadProductImages = async () => {
      try {
        setIsLoadingImages(true)
        console.log("Carregando imagens para o produto:", product.id)
        const images = await getProductImages(product.id)
        console.log("Imagens carregadas:", images)

        if (images && images.length > 0) {
          setProductImages(images)

          // Se não houver imagem principal, use a primeira imagem
          if (!images.some((img) => img.is_primary)) {
            setCurrentImageIndex(0)
          } else {
            // Encontre o índice da imagem principal
            const primaryIndex = images.findIndex((img) => img.is_primary)
            setCurrentImageIndex(primaryIndex >= 0 ? primaryIndex : 0)
          }
        } else {
          console.log("Nenhuma imagem encontrada para o produto")
        }
      } catch (error) {
        console.error("Error loading product images:", error)
      } finally {
        setIsLoadingImages(false)
      }
    }

    loadProductImages()
  }, [product.id])

  // Gerar arrays de dias para os meses atual e próximo
  const currentMonthDays = generateDaysArray(currentYear, currentMonth)
  const nextMonthDays = generateDaysArray(nextYear, nextMonth)

  // Dias da semana
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const hasFeatures = product.features && product.features.length > 0
  const hasSpecifications = product.specifications && Object.keys(product.specifications).length > 0
  const productInCart = isInCart(product.id)

  const calculateRentalDays = () => {
    if (!startDate || !endDate) return 0

    // Clone dates to avoid modifying the original state
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate difference in days
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Return at least 1 day even if same day rental
    return Math.max(1, diffDays)
  }

  const rentalDays = calculateRentalDays()

  // Calcular preço baseado nos tiers
  const priceCalculation = calculateProductPrice(product.daily_price, rentalDays, product.pricing_tiers)

  const priceDisplay = formatPriceWithDiscount(priceCalculation)
  const totalPrice = priceCalculation.totalPrice * quantity

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Função para navegar para o mês anterior
  const goToPreviousMonth = () => {
    setNextMonth(currentMonth)
    setNextYear(currentYear)

    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Função para navegar para o próximo mês
  const goToNextMonth = () => {
    setCurrentMonth(nextMonth)
    setCurrentYear(nextYear)

    if (nextMonth === 11) {
      setNextMonth(0)
      setNextYear(nextYear + 1)
    } else {
      setNextMonth(nextMonth + 1)
    }
  }

  // Funções para o carrossel de imagens
  const nextImage = () => {
    if (productImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
    }
  }

  const prevImage = () => {
    if (productImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
    }
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Função para verificar se uma data está no intervalo selecionado
  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    return date >= startDate && date <= endDate
  }

  // Função para verificar se uma data é a data de início
  const isStartDate = (date: Date) => {
    if (!startDate) return false
    return (
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear()
    )
  }

  // Função para verificar se uma data é a data de fim
  const isEndDate = (date: Date) => {
    if (!endDate) return false
    return (
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear()
    )
  }

  // Função para selecionar uma data
  const selectDate = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day)

    // Se nenhuma data foi selecionada ou ambas já foram, seleciona como data inicial
    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate)
      setEndDate(undefined)
    }
    // Se apenas a data inicial foi selecionada
    else {
      // Se a data selecionada é anterior à data inicial, troca as datas
      if (selectedDate < startDate) {
        setEndDate(startDate)
        setStartDate(selectedDate)
      } else {
        setEndDate(selectedDate)
      }
    }
  }

  const formatDateRange = () => {
    if (!startDate) return "Selecione as datas"

    const formattedStart = format(startDate, "dd 'de' MMMM", { locale: ptBR })

    if (!endDate) return `${formattedStart} - Selecione data final`

    const formattedEnd = format(endDate, "dd 'de' MMMM", { locale: ptBR })
    return `${formattedStart} - ${formattedEnd}`
  }

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Selecione as datas",
        description: "Por favor, selecione as datas de início e fim do aluguel",
        variant: "destructive",
      })
      setIsDateDialogOpen(true)
      return
    }

    setIsAddingToCart(true)

    try {
      addItem({
        productId: product.id,
        product,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTime,
        endTime,
        rentalDays,
        priceCalculation,
      })

      toast({
        title: "Produto adicionado ao carrinho",
        description: `${product.name} foi adicionado ao seu carrinho.`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: "Ocorreu um erro ao adicionar o produto ao carrinho. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleRentNow = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Selecione as datas",
        description: "Por favor, selecione as datas de início e fim do aluguel",
        variant: "destructive",
      })
      setIsDateDialogOpen(true)
      return
    }

    handleAddToCart()
    // Redirect to checkout page
    window.location.href = "/store/checkout"
  }

  // Determinar a imagem a ser exibida
  const currentImage =
    productImages.length > 0 && currentImageIndex < productImages.length
      ? productImages[currentImageIndex]?.url
      : product.image_url || product.primary_image_url || `/placeholder.svg?height=600&width=600&query=${product.name}`

  const handleImageError = () => {
    console.log("Erro ao carregar imagem:", currentImage)
    setImageError(true)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image Carousel */}
      <div className="relative aspect-square md:sticky md:top-24 h-fit">
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100">
          {/* Main Image */}
          {isLoadingImages ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center justify-center">
                <ImageIcon className="h-16 w-16 text-gray-300" />
                <p className="text-gray-400 mt-2">Carregando imagem...</p>
              </div>
            </div>
          ) : imageError || !currentImage ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="h-16 w-16 text-gray-300" />
                <p className="text-gray-400 mt-2">Imagem não disponível</p>
              </div>
            </div>
          ) : (
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={handleImageError}
              unoptimized
            />
          )}

          {/* Navigation Arrows */}
          {productImages.length > 1 && !isLoadingImages && !imageError && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {product.is_featured && <Badge className="absolute top-4 right-4 bg-primary">Featured</Badge>}
        </div>

        {/* Thumbnail Navigation */}
        {productImages.length > 1 && !isLoadingImages && !imageError && (
          <div className="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`relative h-16 w-16 rounded-md overflow-hidden border-2 ${
                  index === currentImageIndex ? "border-primary" : "border-transparent"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${product.name} - image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.log("Erro ao carregar miniatura:", image.url)
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/store" className="text-sm text-gray-500 hover:underline">
              Store
            </Link>
            <span className="text-gray-500">/</span>
            <Link href={`/store?category=${product.category_id}`} className="text-sm text-gray-500 hover:underline">
              {product.category_name}
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold">{formatCurrency(priceCalculation.pricePerDay)}</span>
            <span className="text-gray-500">por dia</span>
            {priceCalculation.isDiscounted && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">{formatCurrency(product.daily_price)}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  -{priceDisplay.discountPercentage}%
                </Badge>
              </div>
            )}
          </div>

          {priceCalculation.tierName && (
            <div className="mb-4 p-2 bg-blue-50 rounded-md">
              <span className="text-sm text-blue-800 font-medium">{priceCalculation.tierName}</span>
            </div>
          )}
          <p className="text-gray-700 mb-6">{product.description}</p>
        </div>

        <Tabs defaultValue="details" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {hasFeatures ? (
              <div className="space-y-2">
                <h3 className="font-medium">Características</h3>
                <ul className="space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Nenhuma característica específica disponível para este produto.
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications">
            {hasSpecifications ? (
              <div className="space-y-4">
                <h3 className="font-medium">Especificações do Produto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-500">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Nenhuma especificação disponível para este produto.</div>
            )}
          </TabsContent>
        </Tabs>

        {/* Check Availability Button */}
        <Button className="w-full mb-4" variant="outline" onClick={() => setIsDateDialogOpen(true)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Checar Disponibilidade
        </Button>

        {/* Date Selection Dialog */}
        <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[90vh]">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Selecione as Datas de Aluguel</DialogTitle>
            </DialogHeader>

            <div className="p-6 pt-2 overflow-y-auto max-h-[calc(90vh-130px)]">
              {/* Datas selecionadas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm font-medium mb-1">Data Inicial</div>
                  <div className="p-2 bg-blue-50 rounded-md border border-blue-100 text-center">
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Data Final</div>
                  <div className="p-2 bg-blue-50 rounded-md border border-blue-100 text-center">
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione"}
                  </div>
                </div>
              </div>

              {/* Calendário */}
              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                  <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                    <span className="sr-only">Mês anterior</span>
                    &lt;
                  </Button>
                  <div className="flex-1 grid grid-cols-2 gap-4 text-center">
                    <div className="font-medium">
                      {format(new Date(currentYear, currentMonth), "MMMM yyyy", { locale: ptBR })}
                    </div>
                    <div className="font-medium">
                      {format(new Date(nextYear, nextMonth), "MMMM yyyy", { locale: ptBR })}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                    <span className="sr-only">Próximo mês</span>
                    &gt;
                  </Button>
                </div>

                <div className="grid grid-cols-2 divide-x">
                  {/* Mês atual */}
                  <div className="p-3">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {currentMonthDays.map((day, index) => {
                        if (day === null) {
                          return <div key={`empty-${index}`} className="h-8" />
                        }

                        const date = new Date(currentYear, currentMonth, day)
                        const isToday = date.toDateString() === new Date().toDateString()
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                        const isStart = isStartDate(date)
                        const isEnd = isEndDate(date)
                        const isInSelectedRange = isDateInRange(date)

                        return (
                          <button
                            key={`current-${day}`}
                            className={`
                              h-8 w-8 rounded-full flex items-center justify-center text-sm
                              ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                              ${isToday ? "border border-blue-500" : ""}
                              ${isStart ? "bg-green-500 text-white" : ""}
                              ${isEnd ? "bg-green-500 text-white" : ""}
                              ${isInSelectedRange && !isStart && !isEnd ? "bg-green-100" : ""}
                            `}
                            disabled={isPast}
                            onClick={() => !isPast && selectDate(day, currentMonth, currentYear)}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Próximo mês */}
                  <div className="p-3">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day) => (
                        <div key={`next-${day}`} className="text-center text-xs font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {nextMonthDays.map((day, index) => {
                        if (day === null) {
                          return <div key={`next-empty-${index}`} className="h-8" />
                        }

                        const date = new Date(nextYear, nextMonth, day)
                        const isToday = date.toDateString() === new Date().toDateString()
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                        const isStart = isStartDate(date)
                        const isEnd = isEndDate(date)
                        const isInSelectedRange = isDateInRange(date)

                        return (
                          <button
                            key={`next-${day}`}
                            className={`
                              h-8 w-8 rounded-full flex items-center justify-center text-sm
                              ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                              ${isToday ? "border border-blue-500" : ""}
                              ${isStart ? "bg-green-500 text-white" : ""}
                              ${isEnd ? "bg-green-500 text-white" : ""}
                              ${isInSelectedRange && !isStart && !isEnd ? "bg-green-100" : ""}
                            `}
                            disabled={isPast}
                            onClick={() => !isPast && selectDate(day, nextMonth, nextYear)}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Retirada</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`pickup-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Devolução</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`return-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="rounded-r-none h-10"
                  >
                    -
                  </Button>
                  <div className="flex-1 text-center font-medium">{quantity}</div>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} className="rounded-l-none h-10">
                    +
                  </Button>
                </div>
              </div>

              {startDate && endDate && (
                <div className="mt-6 bg-gray-50 p-3 rounded-md">
                  <div className="text-sm font-medium mb-1">Resumo</div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Período:</span>
                      <span>
                        {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Duração:</span>
                      <span>{rentalDays} dias</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <Button
                className="w-32"
                onClick={() => {
                  if (startDate && endDate) {
                    setIsDateDialogOpen(false)
                  } else {
                    toast({
                      title: "Selecione as datas",
                      description: "Por favor, selecione as datas de início e fim do aluguel",
                      variant: "destructive",
                    })
                  }
                }}
              >
                Aplicar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Selected Date Range Display */}
        {startDate && endDate && (
          <Card className="mb-4">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Datas Selecionadas</div>
                  <div className="text-sm">
                    {format(startDate, "dd/MM/yyyy")} {startTime} - {format(endDate, "dd/MM/yyyy")} {endTime}
                  </div>
                  <div className="text-sm text-gray-500">
                    {rentalDays} dias • {quantity} unidade(s)
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setIsDateDialogOpen(true)}>
                  Alterar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rental Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Resumo do Aluguel</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Valor Diário</span>
                <div className="text-right">
                  <span>{formatCurrency(priceCalculation.pricePerDay)}</span>
                  {priceCalculation.isDiscounted && (
                    <div className="text-xs text-gray-400 line-through">{formatCurrency(product.daily_price)}</div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Duração</span>
                <span>{rentalDays || "0"} dias</span>
              </div>
              <div className="flex justify-between">
                <span>Quantidade</span>
                <span>{quantity}</span>
              </div>
              {priceCalculation.isDiscounted && (
                <div className="flex justify-between text-green-600">
                  <span>Economia</span>
                  <span>-{formatCurrency(priceCalculation.savings * quantity)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(totalPrice || 0)}</span>
              </div>
            </div>

            {!startDate || !endDate ? (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-md mb-4 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Selecione as datas de aluguel para continuar</span>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                className="w-full"
                disabled={!startDate || !endDate || isAddingToCart}
                onClick={handleRentNow}
              >
                {isAddingToCart ? "Processando..." : "Alugar Agora"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                disabled={!startDate || !endDate || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {productInCart ? "Atualizar no Carrinho" : "Adicionar ao Carrinho"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Entrega e Retirada Gratuitas</h4>
              <p className="text-sm text-gray-600">
                Entregamos em todos os hotéis, resorts, casas de temporada e AirBnBs na região.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
