'use client'

import { useState, useEffect } from 'react'

interface SubmissionDetailData {
  submission_reference: string
  company_profile: {
    name: string
    industry: string
    size: string
    employees: number
    revenue: number
    years_in_business: number
    credit_rating: string
    security_measures: string[]
    data_types: string[]
    certifications: string[]
    financial_indicators: {
      name: string
      value: string
      trend?: 'up' | 'down'
    }[]
  }
  risk_assessment: {
    overall_score: number
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical'
    confidence_score: number
    industry_benchmark: number
    categories: {
      name: string
      score: number
      weight: number
      factors: string[]
      trend?: 'up' | 'down' | 'stable'
    }[]
    risk_factors: {
      category: string
      factor: string
      impact_level: 'Low' | 'Medium' | 'High'
      score_impact: number
      description: string
      mitigation_recommendation: string
    }[]
  }
  recommendations: {
    action: 'Approve' | 'Decline' | 'Request Info' | 'Refer'
    confidence_level: number
    reasoning: string[]
    suggested_conditions?: string[]
    estimated_premium_range?: {
      min: number
      max: number
    }
    market_positioning?: string
    alternative_actions?: {
      action: string
      confidence: number
      reasoning: string
    }[]
  }
  policy_details: {
    coverage_type: string
    coverage_limits: {
      type: string
      amount: number
    }[]
    components: string[]
    exclusions: string[]
    premium_factors: {
      name: string
      value: string
    }[]
  }
  communications: {
    id: string
    type: 'broker' | 'internal' | 'system'
    sender: string
    recipient?: string
    subject: string
    message: string
    timestamp: string
    attachments?: string[]
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'
    status: 'sent' | 'read' | 'replied'
  }[]
}

interface UseSubmissionDetailDataReturn {
  data: SubmissionDetailData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useSubmissionDetailData(workItemId: string): UseSubmissionDetailDataReturn {
  const [data, setData] = useState<SubmissionDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/dashboard/submission/${workItemId}/detail`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch submission detail: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('Error fetching submission detail:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (workItemId) {
      fetchData()
    }
  }, [workItemId])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
