'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Award,
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts'
import { useTeamPerformanceData } from '@/hooks/use-team-performance-data'

export function TeamPerformanceDashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week')
  const { data, isLoading, error, refetch } = useTeamPerformanceData(timeframe)

  if (isLoading && !data) {
    return <TeamPerformanceSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load team performance</h3>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <Button onClick={refetch}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Performance Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor team productivity and individual performance metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Team Statistics */}
          <TeamStatistics teamStats={data.team_statistics} />

          {/* Individual Performance Cards */}
          <IndividualPerformanceCards underwriters={data.individual_performance} />

          {/* Comparative Charts */}
          <ComparativeCharts comparativeData={data.comparative_charts} />
        </div>
      </div>
    </div>
  )
}

// Team Statistics Component
function TeamStatistics({ teamStats }: { teamStats: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Team Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamStats.map((stat: any, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <div className="text-gray-400">
                {stat.name.includes('Submissions') ? <Activity className="h-4 w-4" /> :
                 stat.name.includes('Processing') ? <Clock className="h-4 w-4" /> :
                 stat.name.includes('Capacity') ? <Target className="h-4 w-4" /> :
                 <AlertTriangle className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
                {stat.unit && <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>}
              </div>
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}% vs previous period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Individual Performance Cards Component
function IndividualPerformanceCards({ underwriters }: { underwriters: any[] }) {
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' }
    if (score >= 60) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' }
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100'
      case 'Busy':
        return 'text-yellow-600 bg-yellow-100'
      case 'Away':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Award className="h-5 w-5" />
        Individual Performance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {underwriters.map((underwriter, index) => {
          const performanceBadge = getPerformanceBadge(underwriter.performance_score)
          
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={underwriter.avatar} alt={underwriter.name} />
                      <AvatarFallback>
                        {underwriter.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{underwriter.name}</h3>
                      <p className="text-sm text-gray-600">{underwriter.role}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getAvailabilityColor(underwriter.availability)}`}
                  >
                    {underwriter.availability}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Performance Score</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getPerformanceColor(underwriter.performance_score)}`}>
                      {underwriter.performance_score}
                    </span>
                    <Badge variant="outline" className={`text-xs ${performanceBadge.color}`}>
                      {performanceBadge.label}
                    </Badge>
                  </div>
                </div>

                {/* Workload Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Workload</span>
                    <span className="text-sm font-medium">{underwriter.current_workload} items</span>
                  </div>
                  <Progress value={(underwriter.current_workload / underwriter.max_capacity) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Capacity: {underwriter.current_workload}/{underwriter.max_capacity}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {underwriter.items_completed}
                    </div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {underwriter.avg_processing_time}
                    </div>
                    <div className="text-xs text-gray-500">Avg Days</div>
                  </div>
                </div>

                {/* Performance Trends */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Performance Trend</span>
                    <div className="flex items-center gap-1">
                      {underwriter.performance_trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        underwriter.performance_trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {underwriter.performance_change}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-600 mb-2">Specializations</div>
                  <div className="flex flex-wrap gap-1">
                    {underwriter.specializations.map((spec: string, specIndex: number) => (
                      <Badge key={specIndex} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Comparative Charts Component
function ComparativeCharts({ comparativeData }: { comparativeData: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Comparative Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Time Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processing Time Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparativeData.processing_time}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="underwriter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg_processing_time" fill="#3B82F6" name="Avg Processing Time (days)" />
                <Bar dataKey="target_time" fill="#6B7280" name="Target Time (days)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Approval Rate Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Approval Rate Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparativeData.approval_rates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="underwriter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approval_rate" fill="#10B981" name="Approval Rate (%)" />
                <Bar dataKey="team_average" fill="#6B7280" name="Team Average (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Averages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Score Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparativeData.risk_scores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="underwriter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg_risk_score" fill="#F59E0B" name="Avg Risk Score" />
                <Bar dataKey="industry_benchmark" fill="#6B7280" name="Industry Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productivity Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparativeData.productivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="underwriter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items_per_week" fill="#8B5CF6" name="Items per Week" />
                <Bar dataKey="team_average" fill="#6B7280" name="Team Average" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={comparativeData.performance_overview}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Team Average"
                dataKey="team_average"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Radar
                name="Top Performer"
                dataKey="top_performer"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
