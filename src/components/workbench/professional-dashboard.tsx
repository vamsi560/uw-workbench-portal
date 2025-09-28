"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Shield, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    period: string;
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

function MetricCard({ title, value, change, icon, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  const iconBg = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
  };

  return (
    <Card className="relative overflow-hidden border-l-4 hover:shadow-md transition-shadow">
      <div className={`absolute inset-0 ${colorClasses[color]} opacity-5`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconBg[color]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="flex items-center space-x-2 mt-2">
            {change.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : change.trend === 'down' ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : null}
            <span className={`text-sm ${
              change.trend === 'up' ? 'text-green-600' : 
              change.trend === 'down' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {change.trend !== 'neutral' && (change.value > 0 ? '+' : '')}{change.value}% {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusDistributionProps {
  data: Array<{
    status: string;
    count: number;
    color: string;
  }>;
}

function StatusDistribution({ data }: StatusDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Status Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="font-medium">{item.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">{item.count}</span>
                <Badge variant="secondary" className="text-xs">
                  {total > 0 ? Math.round((item.count / total) * 100) : 0}%
                </Badge>
              </div>
            </div>
            <Progress 
              value={total > 0 ? (item.count / total) * 100 : 0} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: 'submission' | 'assignment' | 'approval' | 'review';
    title: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'assignment':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'review':
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                  {activity.user && (
                    <Badge variant="outline" className="text-xs">
                      {activity.user}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface RiskAnalysisProps {
  riskDistribution: Array<{
    category: string;
    score: number;
    trend: 'improving' | 'stable' | 'concerning';
  }>;
}

function RiskAnalysis({ riskDistribution }: RiskAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Risk Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskDistribution.map((risk, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{risk.category}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${
                  risk.score >= 80 ? 'text-red-600' : 
                  risk.score >= 60 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {risk.score}/100
                </span>
                <Badge variant={
                  risk.trend === 'improving' ? 'default' :
                  risk.trend === 'concerning' ? 'destructive' :
                  'secondary'
                } className="text-xs">
                  {risk.trend}
                </Badge>
              </div>
            </div>
            <Progress 
              value={risk.score} 
              className={`h-2 ${
                risk.score >= 80 ? '[&>div]:bg-red-500' : 
                risk.score >= 60 ? '[&>div]:bg-orange-500' : 
                '[&>div]:bg-green-500'
              }`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProfessionalDashboard() {
  // Mock data - replace with real data from your API
  const metrics = [
    {
      title: "Total Submissions",
      value: "2,847",
      change: { value: 12, trend: 'up' as const, period: 'vs last month' },
      icon: <FileText className="h-4 w-4" />,
      color: 'blue' as const
    },
    {
      title: "Pending Review",
      value: "43",
      change: { value: -8, trend: 'down' as const, period: 'vs last week' },
      icon: <Clock className="h-4 w-4" />,
      color: 'orange' as const
    },
    {
      title: "Risk Score Avg",
      value: "67.8",
      change: { value: 3, trend: 'up' as const, period: 'vs last month' },
      icon: <Shield className="h-4 w-4" />,
      color: 'red' as const
    },
    {
      title: "Total Coverage",
      value: "$847M",
      change: { value: 15, trend: 'up' as const, period: 'vs last quarter' },
      icon: <DollarSign className="h-4 w-4" />,
      color: 'green' as const
    }
  ];

  const statusData = [
    { status: 'New', count: 156, color: 'bg-blue-500' },
    { status: 'In Review', count: 89, color: 'bg-yellow-500' },
    { status: 'Approved', count: 234, color: 'bg-green-500' },
    { status: 'Rejected', count: 23, color: 'bg-red-500' },
    { status: 'Pending Info', count: 67, color: 'bg-orange-500' }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'submission' as const,
      title: 'New submission received',
      description: 'ABC Corp - General Liability coverage request',
      timestamp: '2 minutes ago',
      user: 'System'
    },
    {
      id: '2', 
      type: 'assignment' as const,
      title: 'Work item assigned',
      description: 'WI-2024-001 assigned to Sarah Johnson',
      timestamp: '15 minutes ago',
      user: 'Mike Chen'
    },
    {
      id: '3',
      type: 'approval' as const,
      title: 'Submission approved',
      description: 'XYZ Industries - $2M coverage approved',
      timestamp: '1 hour ago',
      user: 'Lisa Rodriguez'
    },
    {
      id: '4',
      type: 'review' as const,
      title: 'Risk assessment completed',
      description: 'TechStart Inc - Risk score: 72/100',
      timestamp: '2 hours ago',
      user: 'System'
    }
  ];

  const riskData = [
    { category: 'Technical Risk', score: 73, trend: 'stable' as const },
    { category: 'Operational Risk', score: 68, trend: 'improving' as const },
    { category: 'Financial Risk', score: 81, trend: 'concerning' as const },
    { category: 'Compliance Risk', score: 45, trend: 'improving' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusDistribution data={statusData} />
        <RiskAnalysis riskDistribution={riskData} />
        <RecentActivity activities={recentActivities} />
      </div>

      {/* Alert Summary */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <span>Attention Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">8</div>
              <div className="text-sm text-red-700">High Risk Items</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-orange-700">Overdue Reviews</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-700">Urgent Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}