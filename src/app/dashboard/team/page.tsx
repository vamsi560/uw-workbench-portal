import { Suspense } from 'react'
import { TeamPerformanceDashboard } from '@/components/dashboard/team-performance-dashboard'
import { TeamPerformanceSkeleton } from '@/components/dashboard/team-performance-skeleton'

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<TeamPerformanceSkeleton />}>
        <TeamPerformanceDashboard />
      </Suspense>
    </div>
  )
}
