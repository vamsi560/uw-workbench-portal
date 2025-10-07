import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Work Queue Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Team Metrics Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
