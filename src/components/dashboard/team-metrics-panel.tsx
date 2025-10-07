'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  TrendingUp,
  Clock,
  Target,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface TeamMetrics {
  average_risk_score: number
  items_completed_this_week: number
  pending_assignments: number
  team_capacity_utilization: number
  average_cycle_time: number
  team_size: number
  active_underwriters: number
}

interface TeamMetricsPanelProps {
  teamMetrics?: TeamMetrics
}

export function TeamMetricsPanel({ teamMetrics }: TeamMetricsPanelProps) {
  if (!teamMetrics) {
    return <TeamMetricsPanelSkeleton />
  }

  const getCapacityColor = (utilization: number) => {
    if (utilization <= 60) return 'text-green-600'
    if (utilization <= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCapacityBarColor = (utilization: number) => {
    if (utilization <= 60) return 'bg-green-500'
    if (utilization <= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 40) return 'text-green-600'
    if (score <= 70) return 'text-yellow-600'
    if (score <= 85) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Team Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Team Size */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Team Size</span>
            <span className="text-sm font-medium">{teamMetrics.team_size}</span>
          </div>

          {/* Active Underwriters */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {teamMetrics.active_underwriters} online
              </Badge>
            </div>
          </div>

          {/* Capacity Utilization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Capacity</span>
              <span className={`text-sm font-medium ${getCapacityColor(teamMetrics.team_capacity_utilization)}`}>
                {teamMetrics.team_capacity_utilization}%
              </span>
            </div>
            <Progress 
              value={teamMetrics.team_capacity_utilization} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Average Risk Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg Risk Score</span>
            <span className={`text-sm font-medium ${getRiskScoreColor(teamMetrics.average_risk_score)}`}>
              {teamMetrics.average_risk_score}
            </span>
          </div>

          {/* Items Completed This Week */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed This Week</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium">{teamMetrics.items_completed_this_week}</span>
            </div>
          </div>

          {/* Average Cycle Time */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg Cycle Time</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-medium">{teamMetrics.average_cycle_time} days</span>
            </div>
          </div>

          {/* Pending Assignments */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pending Assignment</span>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span className="text-sm font-medium">{teamMetrics.pending_assignments}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <button className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
              View Unassigned Items
            </button>
            <button className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
              Team Performance Report
            </button>
            <button className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
              Capacity Planning
            </button>
            <button className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
              Risk Score Trends
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeamMetricsPanelSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
