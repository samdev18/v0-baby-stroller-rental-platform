import type { StoreProduct } from "@/lib/store-products"
import { Card, CardContent } from "@/components/ui/card"
import { Castle, Truck, CreditCard, Calendar, ShieldCheck, Sparkles } from "lucide-react"

interface ProductFeaturesProps {
  product: StoreProduct
}

export function ProductFeatures({ product }: ProductFeaturesProps) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Why Rent With Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Castle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Theme Park Approved</h3>
            <p className="text-sm text-gray-600">
              Our strollers meet all theme park size requirements and are approved for use at Disney World.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Free Delivery & Pickup</h3>
            <p className="text-sm text-gray-600">
              We deliver to all Disney resorts, hotels, vacation homes, and AirBnBs in the Orlando area.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Save Up to 90%</h3>
            <p className="text-sm text-gray-600">
              Renting is much more affordable than buying or renting directly from the parks.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Free Cancellation</h3>
            <p className="text-sm text-gray-600">
              Plans change? No problem. Cancel for free up until the last minute before delivery.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Clean & Sanitized</h3>
            <p className="text-sm text-gray-600">
              All our strollers are thoroughly cleaned and sanitized between each use for your safety.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">
              We only offer high-quality, comfortable strollers from trusted brands like Baby Jogger.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
