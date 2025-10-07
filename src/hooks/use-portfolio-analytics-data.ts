'use client'

import { useState, useEffect } from 'react'

interface PortfolioAnalyticsData {
  performance_overview: {
    metrics: {
      name: string
      value: number
      unit?: string
      trend: 'up' | 'down'
      change: number
    }[]
    goals: {
      name: string
      actual: number
      target: number
    }[]
    trend_data: {
      period: string
      submissions: number
      approvals: number
    }[]
  }
  risk_distribution: {
    risk_levels: {
      name: string
      value: number
      color: string
    }[]
    industry_breakdown: {
      industry: string
      risk_score: number
      count: number
    }[]
    coverage_types: {
      name: string
      value: number
      color: string
    }[]
    risk_histogram: {
      range: string
      count: number
    }[]
  }
  benchmarking: {
    metrics: {
      name: string
      our_value: number
      benchmark: number
    }[]
    competitive_positioning: {
      metric: string
      our_performance: number
      industry_average: number
      top_quartile: number
    }[]
    percentile_rankings: {
      metric: string
      percentile: number
    }[]
  }
  insights: {
    portfolio_insights: {
      title: string
      description: string
      impact?: string
    }[]
    recommendations: {
      title: string
      description: string
      priority: 'Low' | 'Medium' | 'High' | 'Critical'
      estimated_impact: string
    }[]
    alerts?: {
      title: string
      description: string
      recommended_action?: string
    }[]
  }
}

interface UsePortfolioAnalyticsDataReturn {
  data: PortfolioAnalyticsData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function usePortfolioAnalyticsData(timeframe: string): UsePortfolioAnalyticsDataReturn {
  const [data, setData] = useState<PortfolioAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/dashboard/analytics/portfolio?timeframe=${timeframe}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio analytics: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('Error fetching portfolio analytics:', err)
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
