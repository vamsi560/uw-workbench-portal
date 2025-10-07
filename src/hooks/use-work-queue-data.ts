'use client'

import { useState, useEffect } from 'react'

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
  status: 'Pending' | 'In Review' | 'Awaiting Info' | 'Ready to Quote' | 'Approved' | 'Declined'
  underwriter_assigned?: string
  submission_date: string
  sla_status: 'on_track' | 'at_risk' | 'breached'
  urgent_comment?: string
}

interface UseWorkQueueDataReturn {
  data: WorkItem[] | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useWorkQueueData(underwriterId: string): UseWorkQueueDataReturn {
  const [data, setData] = useState<WorkItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(
        `/api/dashboard/work-queue/${encodeURIComponent(underwriterId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch work queue: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error('Error fetching work queue:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [underwriterId])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
