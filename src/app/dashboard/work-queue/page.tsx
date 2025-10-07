import { Suspense } from 'react'
import { WorkQueueManagement } from '@/components/dashboard/work-queue-management'
import { WorkQueueSkeleton } from '@/components/dashboard/work-queue-skeleton'

export default function WorkQueuePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<WorkQueueSkeleton />}>
        <WorkQueueManagement />
      </Suspense>
    </div>
  )
}
