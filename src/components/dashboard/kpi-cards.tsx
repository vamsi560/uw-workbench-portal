'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  Activity,
  BarChart3
} from 'lucide-react'
import { SparklineChart } from './sparkline-chart'

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

interface KPICardsProps {
  kpis?: Record<string, KPI>
}

export function KPICards({ kpis }: KPICardsProps) {
  if (!kpis) {
    return <KPICardsSkeleton />
  }

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'days':
        return `${value} days`
      default:
        return value.toLocaleString()
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />
      case 'down':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string, percentageChange?: number) => {
    if (trend === 'stable') return 'text-gray-500'
    
    // For some KPIs, down trend is good (like processing time, risk score)
    const isDownGood = ['average_processing_time', 'average_risk_score'].includes('')
    
    if (trend === 'down' && isDownGood) {
      return 'text-green-600'
    }
    
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  const getKPIIcon = (kpiName: string) => {
    switch (kpiName.toLowerCase()) {
      case 'active submissions':
        return <Activity className="h-5 w-5" />
      case 'pending reviews':
        return <Clock className="h-5 w-5" />
      case 'quotes issued':
        return <CheckCircle className="h-5 w-5" />
      case 'average processing time':
        return <Clock className="h-5 w-5" />
      case 'sla performance':
        return <Target className="h-5 w-5" />
      case 'portfolio premium':
        return <DollarSign className="h-5 w-5" />
      case 'average risk score':
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const kpiEntries = Object.entries(kpis)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiEntries.map(([key, kpi]) => (
        <Card key={key} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {kpi.name}
            </CardTitle>
            <div className="text-gray-400">
              {getKPIIcon(kpi.name)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                  {formatValue(kpi.value, kpi.unit)}
                </div>
                
                {/* Trend Indicator */}
                <div className="flex items-center gap-1">
                  <div className={getTrendColor(kpi.trend, kpi.percentage_change)}>
                    {getTrendIcon(kpi.trend)}
                  </div>
                  {kpi.percentage_change !== undefined && (
                    <span className={`text-sm font-medium ${getTrendColor(kpi.trend, kpi.percentage_change)}`}>
                      {Math.abs(kpi.percentage_change).toFixed(1)}%
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    vs previous period
                  </span>
                </div>

                {/* Target/Benchmark Indicator */}
                {(kpi.target || kpi.benchmark) && (
                  <div className="flex items-center gap-2 mt-2">
                    {kpi.target && (
                      <Badge variant="outline" className="text-xs">
                        Target: {formatValue(kpi.target, kpi.unit)}
                      </Badge>
                    )}
                    {kpi.benchmark && (
                      <Badge variant="secondary" className="text-xs">
                        Benchmark: {formatValue(kpi.benchmark, kpi.unit)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sparkline Chart */}
              {kpi.sparkline_data && kpi.sparkline_data.length > 0 && (
                <div className="w-16 h-12">
                  <SparklineChart 
                    data={kpi.sparkline_data}
                    color={getTrendColor(kpi.trend, kpi.percentage_change)}
                  />
                </div>
              )}
            </div>

            {/* Performance Indicator Bar */}
            {kpi.target && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress to target</span>
                  <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      kpi.value >= kpi.target ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
