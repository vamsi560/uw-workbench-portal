'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  Info,
  CheckCircle,
  ExternalLink,
  Target
} from 'lucide-react'
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

interface WorkItemCardProps {
  item: WorkItem
  variant: 'urgent' | 'pending_review' | 'awaiting_info' | 'ready_to_quote'
}

export function WorkItemCard({ item, variant }: WorkItemCardProps) {
  const getRiskScoreColor = (score: number) => {
    if (score <= 40) return 'text-green-600 bg-green-100'
    if (score <= 70) return 'text-yellow-600 bg-yellow-100'
    if (score <= 85) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-green-600'
      case 'at_risk':
        return 'text-yellow-600'
      case 'breached':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getSLAIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-3 w-3" />
      case 'at_risk':
        return <Clock className="h-3 w-3" />
      case 'breached':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.company_name}
                </p>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {item.submission_reference}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getPriorityColor(item.priority)}`}
            >
              {item.priority}
            </Badge>
          </div>

          {/* Industry and Risk Score */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{item.industry}</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getRiskScoreColor(item.risk_score)}`}
            >
              Risk: {item.risk_score}
            </Badge>
          </div>

          {/* Coverage Amount and Policy Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-900">
                {formatCurrency(item.coverage_amount)}
              </span>
            </div>
            <span className="text-xs text-gray-500 truncate">
              {item.policy_type}
            </span>
          </div>

          {/* Days Since Submission and SLA Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                {item.days_since_submission} days
              </span>
            </div>
            <div className={`flex items-center gap-1 ${getSLAStatusColor(item.sla_status)}`}>
              {getSLAIcon(item.sla_status)}
              <span className="text-xs capitalize">
                {item.sla_status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Urgent Comment */}
          {item.urgent_comment && variant === 'urgent' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <div className="flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-red-700">{item.urgent_comment}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 border-t border-gray-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-7 text-xs"
              asChild
            >
              <Link href={`/dashboard/submission/${item.id}`}>
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
