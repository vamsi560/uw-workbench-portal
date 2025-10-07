'use client'

import { useState, useEffect } from 'react'

interface DashboardData {
  underwriter_id: string
  underwriter_name: string
  kpis: Record<string, KPI>
  work_queue: WorkQueue
  team_metrics: TeamMetrics
}

interface KPI {
  name: string
  value: number
  previous_value?: number
  trend: 'up' | 'down' | 'stable'
  percentage_change?: number
  unit: 'count' | 'percentage' | 'currency' | 'days'
  sparkline_data?: number[]
  target?: number
  benchmark?: number
}

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

interface TeamMetrics {
  average_risk_score: number
  items_completed_this_week: number
  pending_assignments: number
  team_capacity_utilization: number
  average_cycle_time: number
  team_size: number
  active_underwriters: number
}

interface UseDashboardDataReturn {
  data: DashboardData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useDashboardData(
  underwriterId: string, 
  timeframe: string
): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/dashboard/underwriter/${encodeURIComponent(underwriterId)}?timeframe=${timeframe}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('Error fetching dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [underwriterId, timeframe])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
