import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image Skeleton */}
      <div className="relative aspect-square md:sticky md:top-24 h-fit">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>

      {/* Product Info Skeleton */}
      <div className="flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-500">/</span>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
        </div>

        <Tabs defaultValue="details" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="rental">Rental Dates</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 shrink-0" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rental Summary Skeleton */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <Button disabled size="lg" className="w-full">
                <Skeleton className="h-5 w-24" />
              </Button>
              <Button disabled variant="outline" size="lg" className="w-full">
                <Skeleton className="h-5 w-32" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info Skeleton */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Skeleton className="h-5 w-5 shrink-0" />
            <div>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
