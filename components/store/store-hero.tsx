import { Button } from "@/components/ui/button"

export function StoreHero() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Disney Stroller Rental</h1>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          We're the first low-cost stroller rental company at Disney World Orlando and nearby theme parks! More savings
          in your pocket, more peace of mind to enjoy with your family.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Reserve Now
          </Button>
          <Button size="lg" variant="outline">
            View Products
          </Button>
        </div>
      </div>
    </section>
  )
}
