import { Castle, Truck, CreditCard, DollarSign } from "lucide-react"

export function StoreFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Castle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Disney World Orlando</h3>
            <p className="text-gray-600">Meets Disney World stroller rental size requirements.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
            <p className="text-gray-600">Free delivery and pickup at your resort, hotel, vacation home, or AirBnB.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rent your stroller online!</h3>
            <p className="text-gray-600">
              Make your reservation, pay now, and your stroller will be waiting for you upon arrival.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Cancellation</h3>
            <p className="text-gray-600">Free cancellation up until the last minute before delivery.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
