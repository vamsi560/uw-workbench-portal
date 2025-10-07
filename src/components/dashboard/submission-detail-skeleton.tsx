import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function SubmissionDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-96 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Intelligence Panel */}
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Risk Assessment Dashboard */}
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
                    <div className="space-y-3 flex-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Automated Recommendations */}
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Policy Details */}
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Communication Hub */}
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
