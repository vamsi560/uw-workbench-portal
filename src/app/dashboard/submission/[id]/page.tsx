import { Suspense } from 'react'
import { SubmissionDetailView } from '@/components/dashboard/submission-detail-view'
import { SubmissionDetailSkeleton } from '@/components/dashboard/submission-detail-skeleton'

interface SubmissionDetailPageProps {
  params: {
    id: string
  }
}

export default function SubmissionDetailPage({ params }: SubmissionDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<SubmissionDetailSkeleton />}>
        <SubmissionDetailView workItemId={params.id} />
      </Suspense>
    </div>
  )
}
