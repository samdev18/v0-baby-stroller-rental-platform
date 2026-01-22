export function StoreProductListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-16 bg-gray-100 animate-pulse rounded-md"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm">
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="pt-2 flex gap-2">
                <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    </div>
  )
}
