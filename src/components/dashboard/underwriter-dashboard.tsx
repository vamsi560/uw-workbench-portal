'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { KPICards } from './kpi-cards'
import { WorkQueueSection } from './work-queue-section'
import { TeamMetricsPanel } from './team-metrics-panel'
import { useWebSocket } from '@/hooks/use-websocket'
import { useDashboardData } from '@/hooks/use-dashboard-data'

interface UnderwriterDashboardProps {
  underwriterId?: string
  timeframe?: 'week' | 'month' | 'quarter'
}

export function UnderwriterDashboard({ 
  underwriterId = 'john.doe@company.com',
  timeframe = 'week'
}: UnderwriterDashboardProps) {
  const [currentTimeframe, setCurrentTimeframe] = useState(timeframe)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const { data, isLoading, error, refetch } = useDashboardData(underwriterId, currentTimeframe)
  
  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket(`/ws/dashboard/${underwriterId}`)
  
  useEffect(() => {
    if (lastMessage) {
      // Handle real-time updates
      switch (lastMessage.type) {
        case 'work_item_updated':
        case 'new_submission':
          refetch()
          break
      }
    }
  }, [lastMessage, refetch])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  if (isLoading && !data) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {data?.underwriter_name || 'Underwriter'}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your underwriting dashboard overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            {/* Timeframe Selector */}
            <Tabs value={currentTimeframe} onValueChange={(value) => setCurrentTimeframe(value as any)}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards */}
            <KPICards kpis={data?.kpis} />
            
            {/* Work Queue Section */}
            <WorkQueueSection workQueue={data?.work_queue} />
          </div>
          
          {/* Team Metrics Sidebar */}
          <div className="lg:col-span-1">
            <TeamMetricsPanel teamMetrics={data?.team_metrics} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            {/* Work Queue Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="animate-pulse">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Team Metrics Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
