import { Suspense } from 'react'
import { PortfolioAnalytics } from '@/components/dashboard/portfolio-analytics'
import { AnalyticsSkeleton } from '@/components/dashboard/analytics-skeleton'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <PortfolioAnalytics />
      </Suspense>
    </div>
  )
}
