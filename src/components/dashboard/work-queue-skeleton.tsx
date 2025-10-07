import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function WorkQueueSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="flex gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Data Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Table Header */}
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              
              {/* Table Rows */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
