'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle, 
  Clock, 
  Info, 
  CheckCircle,
  ExternalLink,
  MoreHorizontal,
  User,
  Building2,
  DollarSign,
  Calendar,
  Target
} from 'lucide-react'
import { WorkItemCard } from './work-item-card'
import Link from 'next/link'

interface WorkItem {
  id: string
  company_name: string
  submission_reference: string
  industry: string
  risk_score: number
  coverage_amount: number
  policy_type: string
  days_since_submission: number
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: string
  urgent_comment?: string
  sla_status: 'on_track' | 'at_risk' | 'breached'
}

interface WorkQueue {
  urgent: WorkItem[]
  pending_review: WorkItem[]
  awaiting_info: WorkItem[]
  ready_to_quote: WorkItem[]
}

interface WorkQueueSectionProps {
  workQueue?: WorkQueue
}

export function WorkQueueSection({ workQueue }: WorkQueueSectionProps) {
  if (!workQueue) {
    return <WorkQueueSectionSkeleton />
  }

  const queueColumns = [
    {
      key: 'urgent',
      title: 'Urgent Items',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      items: workQueue.urgent,
      emptyMessage: 'No urgent items'
    },
    {
      key: 'pending_review',
      title: 'Pending Review',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      items: workQueue.pending_review,
      emptyMessage: 'No items pending review'
    },
    {
      key: 'awaiting_info',
      title: 'Awaiting Info',
      icon: <Info className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      items: workQueue.awaiting_info,
      emptyMessage: 'No items awaiting information'
    },
    {
      key: 'ready_to_quote',
      title: 'Ready to Quote',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      items: workQueue.ready_to_quote,
      emptyMessage: 'No items ready for quoting'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Work Queue</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/work-queue">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              View All
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {queueColumns.map((column) => (
          <Card key={column.key} className={`${column.borderColor} border-2`}>
            <CardHeader className={`${column.bgColor} pb-3`}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={column.color}>
                    {column.icon}
                  </div>
                  <span className="text-sm font-medium">{column.title}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {column.items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {column.items.length === 0 ? (
                <div className="text-center py-8">
                  <div className={`${column.color} mb-2`}>
                    {column.icon}
                  </div>
                  <p className="text-sm text-gray-500">{column.emptyMessage}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {column.items.map((item) => (
                    <WorkItemCard 
                      key={item.id} 
                      item={item} 
                      variant={column.key as any}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WorkQueueSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-5 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
