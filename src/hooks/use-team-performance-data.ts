'use client'

import { useState, useEffect } from 'react'

interface TeamPerformanceData {
  team_statistics: {
    name: string
    value: number
    unit?: string
    trend: 'up' | 'down'
    change: number
  }[]
  individual_performance: {
    name: string
    role: string
    avatar?: string
    availability: 'Available' | 'Busy' | 'Away'
    performance_score: number
    current_workload: number
    max_capacity: number
    items_completed: number
    avg_processing_time: number
    performance_trend: 'up' | 'down'
    performance_change: number
    specializations: string[]
  }[]
  comparative_charts: {
    processing_time: {
      underwriter: string
      avg_processing_time: number
      target_time: number
    }[]
    approval_rates: {
      underwriter: string
      approval_rate: number
      team_average: number
    }[]
    risk_scores: {
      underwriter: string
      avg_risk_score: number
      industry_benchmark: number
    }[]
    productivity: {
      underwriter: string
      items_per_week: number
      team_average: number
    }[]
    performance_overview: {
      metric: string
      team_average: number
      top_performer: number
    }[]
  }
}

interface UseTeamPerformanceDataReturn {
  data: TeamPerformanceData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useTeamPerformanceData(timeframe: string): UseTeamPerformanceDataReturn {
  const [data, setData] = useState<TeamPerformanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/dashboard/team/metrics?timeframe=${timeframe}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch team performance data: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('Error fetching team performance data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeframe])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
