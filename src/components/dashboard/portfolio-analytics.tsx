'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  Users,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts'
import { usePortfolioAnalyticsData } from '@/hooks/use-portfolio-analytics-data'

export function PortfolioAnalytics() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month')
  const { data, isLoading, error, refetch } = usePortfolioAnalyticsData(timeframe)

  if (isLoading && !data) {
    return <AnalyticsSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load analytics</h3>
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
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analysis of your underwriting portfolio performance
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
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Performance Overview */}
          <PerformanceOverview performance={data.performance_overview} />

          {/* Risk Distribution Charts */}
          <RiskDistributionCharts riskDistribution={data.risk_distribution} />

          {/* Benchmarking Section */}
          <BenchmarkingSection benchmarking={data.benchmarking} />

          {/* Insights & Recommendations */}
          <InsightsAndRecommendations insights={data.insights} />
        </div>
      </div>
    </div>
  )
}

// Performance Overview Component
function PerformanceOverview({ performance }: { performance: any }) {
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Performance Overview
      </h2>
      
      {/* Key Metrics Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performance.metrics.map((metric: any, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.name}
              </CardTitle>
              <div className="text-gray-400">
                {metric.name.includes('Premium') ? <DollarSign className="h-4 w-4" /> :
                 metric.name.includes('Submission') ? <Activity className="h-4 w-4" /> :
                 metric.name.includes('Approval') ? <CheckCircle className="h-4 w-4" /> :
                 <Users className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value.toLocaleString()}
                {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
              </div>
              <div className="flex items-center gap-1 mt-2">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}% vs previous period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goal vs Actual Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goal vs Actual Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performance.goals.map((goal: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{goal.name}</span>
                  <span className="text-sm text-gray-600">
                    {goal.actual} / {goal.target}
                  </span>
                </div>
                <Progress 
                  value={(goal.actual / goal.target) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {goal.target}</span>
                  <span>{Math.round((goal.actual / goal.target) * 100)}% complete</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performance.trend_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Submissions"
                />
                <Line 
                  type="monotone" 
                  dataKey="approvals" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Approvals"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Risk Distribution Charts Component
function RiskDistributionCharts({ riskDistribution }: { riskDistribution: any }) {
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#DC2626']

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <PieChart className="h-5 w-5" />
        Risk Distribution Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={riskDistribution.risk_levels}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.risk_levels.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Industry Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution.industry_breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="industry" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="risk_score" fill="#3B82F6" name="Average Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coverage Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={riskDistribution.coverage_types}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.coverage_types.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Score Histogram */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskDistribution.risk_histogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" name="Number of Policies" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Benchmarking Section Component
function BenchmarkingSection({ benchmarking }: { benchmarking: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Target className="h-5 w-5" />
        Industry Benchmarking
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance vs Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance vs Industry Benchmarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {benchmarking.metrics.map((metric: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.our_value}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        metric.our_value > metric.benchmark ? 'text-green-600 border-green-200' : 
                        metric.our_value < metric.benchmark ? 'text-red-600 border-red-200' :
                        'text-gray-600 border-gray-200'
                      }`}
                    >
                      {metric.our_value > metric.benchmark ? 'Above' : 
                       metric.our_value < metric.benchmark ? 'Below' : 'At'} Benchmark
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Industry Average: {metric.benchmark}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Competitive Positioning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Competitive Positioning</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarking.competitive_positioning}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="our_performance" fill="#3B82F6" name="Our Performance" />
                <Bar dataKey="industry_average" fill="#6B7280" name="Industry Average" />
                <Bar dataKey="top_quartile" fill="#10B981" name="Top Quartile" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Percentile Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Percentile Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benchmarking.percentile_rankings.map((ranking: any, index: number) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {ranking.percentile}th
                </div>
                <div className="text-sm text-gray-600 mb-2">{ranking.metric}</div>
                <Badge 
                  variant="outline"
                  className={`${
                    ranking.percentile >= 75 ? 'text-green-600 border-green-200' :
                    ranking.percentile >= 50 ? 'text-yellow-600 border-yellow-200' :
                    'text-red-600 border-red-200'
                  }`}
                >
                  {ranking.percentile >= 75 ? 'Top Quartile' :
                   ranking.percentile >= 50 ? 'Above Average' : 'Below Average'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Insights & Recommendations Component
function InsightsAndRecommendations({ insights }: { insights: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        AI Insights & Recommendations
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portfolio Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.portfolio_insights.map((insight: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    {insight.impact && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Impact: {insight.impact}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actionable Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actionable Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.recommendations.map((recommendation: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {recommendation.priority} Priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Est. Impact: {recommendation.estimated_impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {insights.alerts && insights.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-600">Alert: Concentration Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.alerts.map((alert: any, index: number) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">{alert.title}</h4>
                    <p className="text-sm text-red-700">{alert.description}</p>
                    {alert.recommended_action && (
                      <p className="text-sm text-red-600 mt-2">
                        <strong>Recommended Action:</strong> {alert.recommended_action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
