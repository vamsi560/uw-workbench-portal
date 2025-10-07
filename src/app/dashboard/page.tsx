import { Suspense } from 'react'
import { UnderwriterDashboard } from '@/components/dashboard/underwriter-dashboard'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<DashboardSkeleton />}>
        <UnderwriterDashboard />
      </Suspense>
    </div>
  )
}
