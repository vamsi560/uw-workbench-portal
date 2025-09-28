"use client";"use client";"use client";"use client";



import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";import * as React from "react";

import { Progress } from "@/components/ui/progress";

import { import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

  TrendingUp, 

  TrendingDown, import { Badge } from "@/components/ui/badge";import * as React from "react";import * as React from "react";

  Clock, 

  Shield, import { Progress } from "@/components/ui/progress";

  Users, 

  FileText,import { import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

  AlertTriangle,

  CheckCircle,  TrendingUp, 

  DollarSign,

  BarChart3  TrendingDown, import { Badge } from "@/components/ui/badge";import { Badge } from "@/components/ui/badge";

} from "lucide-react";

  Clock, 

export function ProfessionalDashboard() {

  return (  Shield, import { Progress } from "@/components/ui/progress";import { Progress } from "@/components/ui/progress";

    <div className="space-y-6">

      <div className="text-center py-12">  Users, 

        <h2 className="text-2xl font-bold text-foreground mb-4">

          Professional Dashboard Loading...  FileText,import { import { 

        </h2>

        <p className="text-muted-foreground">  AlertTriangle,

          Dashboard components will be loaded here

        </p>  CheckCircle,  TrendingUp,   TrendingUp, 

      </div>

    </div>  DollarSign,

  );

}  BarChart3  TrendingDown,   TrendingDown, 

} from "lucide-react";

  Clock,   Clock, 

interface MetricCardProps {

  title: string;  Shield,   Shield, 

  value: string | number;

  change?: {  Users,   Users, 

    value: number;

    trend: 'up' | 'down' | 'neutral';  FileText,  FileText,

    period: string;

  };  AlertTriangle,  AlertTriangle,

  icon: React.ReactNode;

  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';  CheckCircle,  CheckCircle,

}

  DollarSign,  DollarSign,

function MetricCard({ title, value, change, icon, color = 'blue' }: MetricCardProps) {

  const colorClasses = {  BarChart3  BarChart3

    blue: 'bg-blue-50 border-blue-200 text-blue-700',

    green: 'bg-green-50 border-green-200 text-green-700',} from "lucide-react";} from "lucide-react";

    orange: 'bg-orange-50 border-orange-200 text-orange-700',

    red: 'bg-red-50 border-red-200 text-red-700',

    purple: 'bg-purple-50 border-purple-200 text-purple-700',

  };interface MetricCardProps {interface MetricCardProps {



  const iconBg = {  title: string;  title: string;

    blue: 'bg-blue-100',

    green: 'bg-green-100',  value: string | number;  value: string | number;

    orange: 'bg-orange-100',

    red: 'bg-red-100',  change?: {  change?: {

    purple: 'bg-purple-100',

  };    value: number;    value: number;



  return (    trend: 'up' | 'down' | 'neutral';    trend: 'up' | 'down' | 'neutral';

    <Card className="relative overflow-hidden border-l-4 hover:shadow-md transition-shadow">

      <div className={`absolute inset-0 ${colorClasses[color]} opacity-5`} />    period: string;    period: string;

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

        <CardTitle className="text-sm font-medium text-muted-foreground">  };  };

          {title}

        </CardTitle>  icon: React.ReactNode;  icon: React.ReactNode;

        <div className={`p-2 rounded-lg ${iconBg[color]}`}>

          {icon}  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';

        </div>

      </CardHeader>}}

      <CardContent>

        <div className="text-2xl font-bold text-foreground">{value}</div>

        {change && (

          <div className="flex items-center space-x-2 mt-2">function MetricCard({ title, value, change, icon, color = 'blue' }: MetricCardProps) {function MetricCard({ title, value, change, icon, color = 'blue' }: MetricCardProps) {

            {change.trend === 'up' ? (

              <TrendingUp className="h-4 w-4 text-green-600" />  const colorClasses = {  const colorClasses = {

            ) : change.trend === 'down' ? (

              <TrendingDown className="h-4 w-4 text-red-600" />    blue: 'bg-blue-50 border-blue-200 text-blue-700',    blue: 'bg-blue-50 border-blue-200 text-blue-700',

            ) : null}

            <span className={`text-sm ${    green: 'bg-green-50 border-green-200 text-green-700',    green: 'bg-green-50 border-green-200 text-green-700',

              change.trend === 'up' ? 'text-green-600' : 

              change.trend === 'down' ? 'text-red-600' :     orange: 'bg-orange-50 border-orange-200 text-orange-700',    orange: 'bg-orange-50 border-orange-200 text-orange-700',

              'text-muted-foreground'

            }`}>    red: 'bg-red-50 border-red-200 text-red-700',    red: 'bg-red-50 border-red-200 text-red-700',

              {change.trend !== 'neutral' && (change.value > 0 ? '+' : '')}{change.value}% {change.period}

            </span>    purple: 'bg-purple-50 border-purple-200 text-purple-700',    purple: 'bg-purple-50 border-purple-200 text-purple-700',

          </div>

        )}  };  };

      </CardContent>

    </Card>

  );

}  const iconBg = {  const iconBg = {



interface StatusDistributionProps {    blue: 'bg-blue-100',    blue: 'bg-blue-100',

  data: Array<{

    status: string;    green: 'bg-green-100',    green: 'bg-green-100',

    count: number;

    color: string;    orange: 'bg-orange-100',    orange: 'bg-orange-100',

  }>;

}    red: 'bg-red-100',    red: 'bg-red-100',



function StatusDistribution({ data }: StatusDistributionProps) {    purple: 'bg-purple-100',    purple: 'bg-purple-100',

  const safeData = data || [];

  const total = safeData.reduce((sum, item) => sum + item.count, 0);  };  };

  

  return (

    <Card>

      <CardHeader>  return (  return (

        <CardTitle className="flex items-center space-x-2">

          <BarChart3 className="h-5 w-5" />    <Card className="relative overflow-hidden border-l-4 hover:shadow-md transition-shadow">    <Card className="relative overflow-hidden border-l-4 hover:shadow-md transition-shadow">

          <span>Status Distribution</span>

        </CardTitle>      <div className={`absolute inset-0 ${colorClasses[color]} opacity-5`} />      <div className={`absolute inset-0 ${colorClasses[color]} opacity-5`} />

      </CardHeader>

      <CardContent className="space-y-4">      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

        {safeData.map((item, index) => (

          <div key={index} className="space-y-2">        <CardTitle className="text-sm font-medium text-muted-foreground">        <CardTitle className="text-sm font-medium text-muted-foreground">

            <div className="flex items-center justify-between text-sm">

              <div className="flex items-center space-x-2">          {title}          {title}

                <div className={`w-3 h-3 rounded-full ${item.color}`} />

                <span className="font-medium">{item.status}</span>        </CardTitle>        </CardTitle>

              </div>

              <div className="flex items-center space-x-2">        <div className={`p-2 rounded-lg ${iconBg[color]}`}>        <div className={`p-2 rounded-lg ${iconBg[color]}`}>

                <span className="text-muted-foreground">{item.count}</span>

                <Badge variant="secondary" className="text-xs">          {icon}          {icon}

                  {total > 0 ? Math.round((item.count / total) * 100) : 0}%

                </Badge>        </div>        </div>

              </div>

            </div>      </CardHeader>      </CardHeader>

            <Progress 

              value={total > 0 ? (item.count / total) * 100 : 0}       <CardContent>      <CardContent>

              className="h-2"

            />        <div className="text-2xl font-bold text-foreground">{value}</div>        <div className="text-2xl font-bold text-foreground">{value}</div>

          </div>

        ))}        {change && (        {change && (

      </CardContent>

    </Card>          <div className="flex items-center space-x-2 mt-2">          <div className="flex items-center space-x-2 mt-2">

  );

}            {change.trend === 'up' ? (            {change.trend === 'up' ? (



interface RecentActivityProps {              <TrendingUp className="h-4 w-4 text-green-600" />              <TrendingUp className="h-4 w-4 text-green-600" />

  activities: Array<{

    id: string;            ) : change.trend === 'down' ? (            ) : change.trend === 'down' ? (

    type: 'submission' | 'assignment' | 'approval' | 'review';

    title: string;              <TrendingDown className="h-4 w-4 text-red-600" />              <TrendingDown className="h-4 w-4 text-red-600" />

    description: string;

    timestamp: string;            ) : null}            ) : null}

    user?: string;

  }>;            <span className={`text-sm ${            <span className={`text-sm ${

}

              change.trend === 'up' ? 'text-green-600' :               change.trend === 'up' ? 'text-green-600' : 

function RecentActivity({ activities }: RecentActivityProps) {

  const safeActivities = activities || [];              change.trend === 'down' ? 'text-red-600' :               change.trend === 'down' ? 'text-red-600' : 

  const getActivityIcon = (type: string) => {

    switch (type) {              'text-muted-foreground'              'text-muted-foreground'

      case 'submission':

        return <FileText className="h-4 w-4 text-blue-600" />;            }`}>            }`}>

      case 'assignment':

        return <Users className="h-4 w-4 text-purple-600" />;              {change.trend !== 'neutral' && (change.value > 0 ? '+' : '')}{change.value}% {change.period}              {change.trend !== 'neutral' && (change.value > 0 ? '+' : '')}{change.value}% {change.period}

      case 'approval':

        return <CheckCircle className="h-4 w-4 text-green-600" />;            </span>            </span>

      case 'review':

        return <Shield className="h-4 w-4 text-orange-600" />;          </div>          </div>

      default:

        return <Clock className="h-4 w-4 text-gray-600" />;        )}        )}

    }

  };      </CardContent>      </CardContent>



  return (    </Card>    </Card>

    <Card>

      <CardHeader>  );  );

        <CardTitle className="flex items-center space-x-2">

          <Clock className="h-5 w-5" />}}

          <span>Recent Activity</span>

        </CardTitle>

      </CardHeader>

      <CardContent>interface StatusDistributionProps {interface StatusDistributionProps {

        <div className="space-y-4">

          {safeActivities.map((activity) => (  data: Array<{  data: Array<{

            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">

              <div className="flex-shrink-0 mt-0.5">    status: string;    status: string;

                {getActivityIcon(activity.type)}

              </div>    count: number;    count: number;

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-foreground">    color: string;    color: string;

                  {activity.title}

                </p>  }>;  }>;

                <p className="text-sm text-muted-foreground">

                  {activity.description}}}

                </p>

                <div className="flex items-center justify-between mt-2">

                  <p className="text-xs text-muted-foreground">

                    {activity.timestamp}function StatusDistribution({ data }: StatusDistributionProps) {function StatusDistribution({ data }: StatusDistributionProps) {

                  </p>

                  {activity.user && (  const safeData = data || [];  const safeData = data || [];

                    <Badge variant="outline" className="text-xs">

                      {activity.user}  const total = safeData.reduce((sum, item) => sum + item.count, 0);  const total = safeData.reduce((sum, item) => sum + item.count, 0);

                    </Badge>

                  )}    

                </div>

              </div>  return (  return (

            </div>

          ))}    <Card>    <Card>

        </div>

      </CardContent>      <CardHeader>      <CardHeader>

    </Card>

  );        <CardTitle className="flex items-center space-x-2">        <CardTitle className="flex items-center space-x-2">

}

          <BarChart3 className="h-5 w-5" />          <BarChart3 className="h-5 w-5" />

interface RiskAnalysisProps {

  riskDistribution: Array<{          <span>Status Distribution</span>          <span>Status Distribution</span>

    category: string;

    score: number;        </CardTitle>        </CardTitle>

    trend: 'improving' | 'stable' | 'concerning';

  }>;      </CardHeader>      </CardHeader>

}

      <CardContent className="space-y-4">      <CardContent className="space-y-4">

function RiskAnalysis({ riskDistribution }: RiskAnalysisProps) {

  const safeRiskDistribution = riskDistribution || [];        {safeData.map((item, index) => (        {safeData.map((item, index) => (

  return (

    <Card>          <div key={index} className="space-y-2">          <div key={index} className="space-y-2">

      <CardHeader>

        <CardTitle className="flex items-center space-x-2">            <div className="flex items-center justify-between text-sm">            <div className="flex items-center justify-between text-sm">

          <Shield className="h-5 w-5" />

          <span>Risk Analysis</span>              <div className="flex items-center space-x-2">              <div className="flex items-center space-x-2">

        </CardTitle>

      </CardHeader>                <div className={`w-3 h-3 rounded-full ${item.color}`} />                <div className={`w-3 h-3 rounded-full ${item.color}`} />

      <CardContent className="space-y-4">

        {safeRiskDistribution.map((risk, index) => (                <span className="font-medium">{item.status}</span>                <span className="font-medium">{item.status}</span>

          <div key={index} className="space-y-2">

            <div className="flex items-center justify-between">              </div>              </div>

              <span className="text-sm font-medium">{risk.category}</span>

              <div className="flex items-center space-x-2">              <div className="flex items-center space-x-2">              <div className="flex items-center space-x-2">

                <span className={`text-sm font-bold ${

                  risk.score >= 80 ? 'text-red-600' :                 <span className="text-muted-foreground">{item.count}</span>                <span className="text-muted-foreground">{item.count}</span>

                  risk.score >= 60 ? 'text-orange-600' : 

                  'text-green-600'                <Badge variant="secondary" className="text-xs">                <Badge variant="secondary" className="text-xs">

                }`}>

                  {risk.score}/100                  {total > 0 ? Math.round((item.count / total) * 100) : 0}%                  {total > 0 ? Math.round((item.count / total) * 100) : 0}%

                </span>

                <Badge variant={                </Badge>                </Badge>

                  risk.trend === 'improving' ? 'default' :

                  risk.trend === 'concerning' ? 'destructive' :              </div>              </div>

                  'secondary'

                } className="text-xs">            </div>            </div>

                  {risk.trend}

                </Badge>            <Progress             <Progress 

              </div>

            </div>              value={total > 0 ? (item.count / total) * 100 : 0}               value={total > 0 ? (item.count / total) * 100 : 0} 

            <Progress 

              value={risk.score}               className="h-2"              className="h-2"

              className={`h-2 ${

                risk.score >= 80 ? '[&>div]:bg-red-500' :             />            />

                risk.score >= 60 ? '[&>div]:bg-orange-500' : 

                '[&>div]:bg-green-500'          </div>          </div>

              }`}

            />        ))}        ))}

          </div>

        ))}      </CardContent>      </CardContent>

      </CardContent>

    </Card>    </Card>    </Card>

  );

}  );  );



export function ProfessionalDashboard() {}}

  // Mock data - replace with real data from your API

  const metrics = React.useMemo(() => [

    {

      title: "Total Submissions",interface RecentActivityProps {interface RecentActivityProps {

      value: "2,847",

      change: { value: 12, trend: 'up' as const, period: 'vs last month' },  activities: Array<{  activities: Array<{

      icon: <FileText className="h-4 w-4" />,

      color: 'blue' as const    id: string;    id: string;

    },

    {    type: 'submission' | 'assignment' | 'approval' | 'review';    type: 'submission' | 'assignment' | 'approval' | 'review';

      title: "Pending Review",

      value: "43",    title: string;    title: string;

      change: { value: -8, trend: 'down' as const, period: 'vs last week' },

      icon: <Clock className="h-4 w-4" />,    description: string;    description: string;

      color: 'orange' as const

    },    timestamp: string;    timestamp: string;

    {

      title: "Risk Score Avg",    user?: string;    user?: string;

      value: "67.8",

      change: { value: 3, trend: 'up' as const, period: 'vs last month' },  }>;  }>;

      icon: <Shield className="h-4 w-4" />,

      color: 'red' as const}}

    },

    {

      title: "Total Coverage",

      value: "$847M",function RecentActivity({ activities }: RecentActivityProps) {function RecentActivity({ activities }: RecentActivityProps) {

      change: { value: 15, trend: 'up' as const, period: 'vs last quarter' },

      icon: <DollarSign className="h-4 w-4" />,  const safeActivities = activities || [];  const safeActivities = activities || [];

      color: 'green' as const

    }  const getActivityIcon = (type: string) => {  const getActivityIcon = (type: string) => {

  ], []);

    switch (type) {    switch (type) {

  const statusData = React.useMemo(() => [

    { status: 'New', count: 156, color: 'bg-blue-500' },      case 'submission':      case 'submission':

    { status: 'In Review', count: 89, color: 'bg-yellow-500' },

    { status: 'Approved', count: 234, color: 'bg-green-500' },        return <FileText className="h-4 w-4 text-blue-600" />;        return <FileText className="h-4 w-4 text-blue-600" />;

    { status: 'Rejected', count: 23, color: 'bg-red-500' },

    { status: 'Pending Info', count: 67, color: 'bg-orange-500' }      case 'assignment':      case 'assignment':

  ], []);

        return <Users className="h-4 w-4 text-purple-600" />;        return <Users className="h-4 w-4 text-purple-600" />;

  const recentActivities = React.useMemo(() => [

    {      case 'approval':      case 'approval':

      id: '1',

      type: 'submission' as const,        return <CheckCircle className="h-4 w-4 text-green-600" />;        return <CheckCircle className="h-4 w-4 text-green-600" />;

      title: 'New submission received',

      description: 'ABC Corp - General Liability coverage request',      case 'review':      case 'review':

      timestamp: '2 minutes ago',

      user: 'System'        return <Shield className="h-4 w-4 text-orange-600" />;        return <Shield className="h-4 w-4 text-orange-600" />;

    },

    {      default:      default:

      id: '2', 

      type: 'assignment' as const,        return <Clock className="h-4 w-4 text-gray-600" />;        return <Clock className="h-4 w-4 text-gray-600" />;

      title: 'Work item assigned',

      description: 'WI-2024-001 assigned to Sarah Johnson',    }    }

      timestamp: '15 minutes ago',

      user: 'Mike Chen'  };  };

    },

    {

      id: '3',

      type: 'approval' as const,  return (  return (

      title: 'Submission approved',

      description: 'XYZ Industries - $2M coverage approved',    <Card>    <Card>

      timestamp: '1 hour ago',

      user: 'Lisa Rodriguez'      <CardHeader>      <CardHeader>

    },

    {        <CardTitle className="flex items-center space-x-2">        <CardTitle className="flex items-center space-x-2">

      id: '4',

      type: 'review' as const,          <Clock className="h-5 w-5" />          <Clock className="h-5 w-5" />

      title: 'Risk assessment completed',

      description: 'TechStart Inc - Risk score: 72/100',          <span>Recent Activity</span>          <span>Recent Activity</span>

      timestamp: '2 hours ago',

      user: 'System'        </CardTitle>        </CardTitle>

    }

  ], []);      </CardHeader>      </CardHeader>



  const riskData = React.useMemo(() => [      <CardContent>      <CardContent>

    { category: 'Technical Risk', score: 73, trend: 'stable' as const },

    { category: 'Operational Risk', score: 68, trend: 'improving' as const },        <div className="space-y-4">        <div className="space-y-4">

    { category: 'Financial Risk', score: 81, trend: 'concerning' as const },

    { category: 'Compliance Risk', score: 45, trend: 'improving' as const }          {safeActivities.map((activity) => (                    {safeActivities.map((activity) => (

  ], []);

            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">

  return (

    <div className="space-y-6">              <div className="flex-shrink-0 mt-0.5">              <div className="flex-shrink-0 mt-0.5">

      {/* Key Metrics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">                {getActivityIcon(activity.type)}                {getActivityIcon(activity.type)}

        {(metrics || []).map((metric, index) => (

          <MetricCard key={index} {...metric} />              </div>              </div>

        ))}

      </div>              <div className="min-w-0 flex-1">              <div className="min-w-0 flex-1">



      {/* Charts and Analysis */}                <p className="text-sm font-medium text-foreground">                <p className="text-sm font-medium text-foreground">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <StatusDistribution data={statusData} />                  {activity.title}                  {activity.title}

        <RiskAnalysis riskDistribution={riskData} />

        <RecentActivity activities={recentActivities} />                </p>                </p>

      </div>

                <p className="text-sm text-muted-foreground">                <p className="text-sm text-muted-foreground">

      {/* Alert Summary */}

      <Card className="border-l-4 border-l-orange-500">                  {activity.description}                  {activity.description}

        <CardHeader>

          <CardTitle className="flex items-center space-x-2">                </p>                </p>

            <AlertTriangle className="h-5 w-5 text-orange-600" />

            <span>System Alerts</span>                <div className="flex items-center justify-between mt-2">                <div className="flex items-center justify-between mt-2">

          </CardTitle>

        </CardHeader>                  <p className="text-xs text-muted-foreground">                  <p className="text-xs text-muted-foreground">

        <CardContent>

          <div className="space-y-3">                    {activity.timestamp}                    {activity.timestamp}

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">

              <div>                  </p>                  </p>

                <p className="text-sm font-medium text-orange-800">

                  High Risk Submission Detected                  {activity.user && (                  {activity.user && (

                </p>

                <p className="text-xs text-orange-600">                    <Badge variant="outline" className="text-xs">                    <Badge variant="outline" className="text-xs">

                  TechCorp submission flagged for manual review

                </p>                      {activity.user}                      {activity.user}

              </div>

              <Badge variant="destructive" className="text-xs">                    </Badge>                    </Badge>

                Critical

              </Badge>                  )}                  )}

            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">                </div>                </div>

              <div>

                <p className="text-sm font-medium text-blue-800">              </div>              </div>

                  System Maintenance Scheduled

                </p>            </div>            </div>

                <p className="text-xs text-blue-600">

                  Planned downtime: Sunday 2:00 AM - 4:00 AM EST          ))}          ))}

                </p>

              </div>        </div>        </div>

              <Badge variant="secondary" className="text-xs">

                Info      </CardContent>      </CardContent>

              </Badge>

            </div>    </Card>    </Card>

          </div>

        </CardContent>  );  );

      </Card>

    </div>}}

  );

}

interface RiskAnalysisProps {interface RiskAnalysisProps {

  riskDistribution: Array<{  riskDistribution: Array<{

    category: string;    category: string;

    score: number;    score: number;

    trend: 'improving' | 'stable' | 'concerning';    trend: 'improving' | 'stable' | 'concerning';

  }>;  }>;

}}



function RiskAnalysis({ riskDistribution }: RiskAnalysisProps) {function RiskAnalysis({ riskDistribution }: RiskAnalysisProps) {

  const safeRiskDistribution = riskDistribution || [];  const safeRiskDistribution = riskDistribution || [];

  return (  return (

    <Card>    <Card>

      <CardHeader>      <CardHeader>

        <CardTitle className="flex items-center space-x-2">        <CardTitle className="flex items-center space-x-2">

          <Shield className="h-5 w-5" />          <Shield className="h-5 w-5" />

          <span>Risk Analysis</span>          <span>Risk Analysis</span>

        </CardTitle>        </CardTitle>

      </CardHeader>      </CardHeader>

      <CardContent className="space-y-4">      <CardContent className="space-y-4">

        {safeRiskDistribution.map((risk, index) => (        {safeRiskDistribution.map((risk, index) => (

          <div key={index} className="space-y-2">          <div key={index} className="space-y-2">

            <div className="flex items-center justify-between">            <div className="flex items-center justify-between">

              <span className="text-sm font-medium">{risk.category}</span>              <span className="text-sm font-medium">{risk.category}</span>

              <div className="flex items-center space-x-2">              <div className="flex items-center space-x-2">

                <span className={`text-sm font-bold ${                <span className={`text-sm font-bold ${

                  risk.score >= 80 ? 'text-red-600' :                   risk.score >= 80 ? 'text-red-600' : 

                  risk.score >= 60 ? 'text-orange-600' :                   risk.score >= 60 ? 'text-orange-600' : 

                  'text-green-600'                  'text-green-600'

                }`}>                }`}>

                  {risk.score}/100                  {risk.score}/100

                </span>                </span>

                <Badge variant={                <Badge variant={

                  risk.trend === 'improving' ? 'default' :                  risk.trend === 'improving' ? 'default' :

                  risk.trend === 'concerning' ? 'destructive' :                  risk.trend === 'concerning' ? 'destructive' :

                  'secondary'                  'secondary'

                } className="text-xs">                } className="text-xs">

                  {risk.trend}                  {risk.trend}

                </Badge>                </Badge>

              </div>              </div>

            </div>            </div>

            <Progress             <Progress 

              value={risk.score}               value={risk.score} 

              className={`h-2 ${              className={`h-2 ${

                risk.score >= 80 ? '[&>div]:bg-red-500' :                 risk.score >= 80 ? '[&>div]:bg-red-500' : 

                risk.score >= 60 ? '[&>div]:bg-orange-500' :                 risk.score >= 60 ? '[&>div]:bg-orange-500' : 

                '[&>div]:bg-green-500'                '[&>div]:bg-green-500'

              }`}              }`}

            />            />

          </div>          </div>

        ))}        ))}

      </CardContent>      </CardContent>

    </Card>    </Card>

  );  );

}}



export function ProfessionalDashboard() {export function ProfessionalDashboard() {

  // Mock data - replace with real data from your API  // Mock data - replace with real data from your API

  const metrics = React.useMemo(() => [  const metrics = React.useMemo(() => [

    {    {

      title: "Total Submissions",      title: "Total Submissions",

      value: "2,847",      value: "2,847",

      change: { value: 12, trend: 'up' as const, period: 'vs last month' },      change: { value: 12, trend: 'up' as const, period: 'vs last month' },

      icon: <FileText className="h-4 w-4" />,      icon: <FileText className="h-4 w-4" />,

      color: 'blue' as const      color: 'blue' as const

    },    },

    {    {

      title: "Pending Review",      title: "Pending Review",

      value: "43",      value: "43",

      change: { value: -8, trend: 'down' as const, period: 'vs last week' },      change: { value: -8, trend: 'down' as const, period: 'vs last week' },

      icon: <Clock className="h-4 w-4" />,      icon: <Clock className="h-4 w-4" />,

      color: 'orange' as const      color: 'orange' as const

    },    },

    {    {

      title: "Risk Score Avg",      title: "Risk Score Avg",

      value: "67.8",      value: "67.8",

      change: { value: 3, trend: 'up' as const, period: 'vs last month' },      change: { value: 3, trend: 'up' as const, period: 'vs last month' },

      icon: <Shield className="h-4 w-4" />,      icon: <Shield className="h-4 w-4" />,

      color: 'red' as const      color: 'red' as const

    },    },

    {    {

      title: "Total Coverage",      title: "Total Coverage",

      value: "$847M",      value: "$847M",

      change: { value: 15, trend: 'up' as const, period: 'vs last quarter' },      change: { value: 15, trend: 'up' as const, period: 'vs last quarter' },

      icon: <DollarSign className="h-4 w-4" />,      icon: <DollarSign className="h-4 w-4" />,

      color: 'green' as const      color: 'green' as const

    }    }

  ], []);  ], []);



  const statusData = React.useMemo(() => [  const statusData = React.useMemo(() => [

    { status: 'New', count: 156, color: 'bg-blue-500' },    { status: 'New', count: 156, color: 'bg-blue-500' },

    { status: 'In Review', count: 89, color: 'bg-yellow-500' },    { status: 'In Review', count: 89, color: 'bg-yellow-500' },

    { status: 'Approved', count: 234, color: 'bg-green-500' },    { status: 'Approved', count: 234, color: 'bg-green-500' },

    { status: 'Rejected', count: 23, color: 'bg-red-500' },    { status: 'Rejected', count: 23, color: 'bg-red-500' },

    { status: 'Pending Info', count: 67, color: 'bg-orange-500' }    { status: 'Pending Info', count: 67, color: 'bg-orange-500' }

  ], []);  ], []);



  const recentActivities = React.useMemo(() => [  const recentActivities = React.useMemo(() => [

    {    {

      id: '1',      id: '1',

      type: 'submission' as const,      type: 'submission' as const,

      title: 'New submission received',      title: 'New submission received',

      description: 'ABC Corp - General Liability coverage request',      description: 'ABC Corp - General Liability coverage request',

      timestamp: '2 minutes ago',      timestamp: '2 minutes ago',

      user: 'System'      user: 'System'

    },    },

    {    {

      id: '2',       id: '2', 

      type: 'assignment' as const,      type: 'assignment' as const,

      title: 'Work item assigned',      title: 'Work item assigned',

      description: 'WI-2024-001 assigned to Sarah Johnson',      description: 'WI-2024-001 assigned to Sarah Johnson',

      timestamp: '15 minutes ago',      timestamp: '15 minutes ago',

      user: 'Mike Chen'      user: 'Mike Chen'

    },    },

    {    {

      id: '3',      id: '3',

      type: 'approval' as const,      type: 'approval' as const,

      title: 'Submission approved',      title: 'Submission approved',

      description: 'XYZ Industries - $2M coverage approved',      description: 'XYZ Industries - $2M coverage approved',

      timestamp: '1 hour ago',      timestamp: '1 hour ago',

      user: 'Lisa Rodriguez'      user: 'Lisa Rodriguez'

    },    },

    {    {

      id: '4',      id: '4',

      type: 'review' as const,      type: 'review' as const,

      title: 'Risk assessment completed',      title: 'Risk assessment completed',

      description: 'TechStart Inc - Risk score: 72/100',      description: 'TechStart Inc - Risk score: 72/100',

      timestamp: '2 hours ago',      timestamp: '2 hours ago',

      user: 'System'      user: 'System'

    }    }

  ], []);  ], []);



  const riskData = React.useMemo(() => [  const riskData = React.useMemo(() => [

    { category: 'Technical Risk', score: 73, trend: 'stable' as const },    { category: 'Technical Risk', score: 73, trend: 'stable' as const },

    { category: 'Operational Risk', score: 68, trend: 'improving' as const },    { category: 'Operational Risk', score: 68, trend: 'improving' as const },

    { category: 'Financial Risk', score: 81, trend: 'concerning' as const },    { category: 'Financial Risk', score: 81, trend: 'concerning' as const },

    { category: 'Compliance Risk', score: 45, trend: 'improving' as const }    { category: 'Compliance Risk', score: 45, trend: 'improving' as const }

  ], []);  ], []);



  return (  return (

    <div className="space-y-6">    <div className="space-y-6">

      {/* Key Metrics */}      {/* Key Metrics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {(metrics || []).map((metric, index) => (        {(metrics || []).map((metric, index) => (

          <MetricCard key={index} {...metric} />          <MetricCard key={index} {...metric} />

        ))}        ))}

      </div>      </div>



      {/* Charts and Analysis */}      {/* Charts and Analysis */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <StatusDistribution data={statusData} />        <StatusDistribution data={statusData} />

        <RiskAnalysis riskDistribution={riskData} />        <RiskAnalysis riskDistribution={riskData} />

        <RecentActivity activities={recentActivities} />        <RecentActivity activities={recentActivities} />

      </div>      </div>



      {/* Alert Summary */}      {/* Alert Summary */}

      <Card className="border-l-4 border-l-orange-500">      <Card className="border-l-4 border-l-orange-500">

        <CardHeader>        <CardHeader>

          <CardTitle className="flex items-center space-x-2">          <CardTitle className="flex items-center space-x-2 text-orange-700">

            <AlertTriangle className="h-5 w-5 text-orange-600" />            <AlertTriangle className="h-5 w-5" />

            <span>System Alerts</span>            <span>Attention Required</span>

          </CardTitle>          </CardTitle>

        </CardHeader>        </CardHeader>

        <CardContent>        <CardContent>

          <div className="space-y-3">          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">

              <div>              <div className="text-2xl font-bold text-red-600">8</div>

                <p className="text-sm font-medium text-orange-800">              <div className="text-sm text-red-700">High Risk Items</div>

                  High Risk Submission Detected            </div>

                </p>            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">

                <p className="text-xs text-orange-600">              <div className="text-2xl font-bold text-orange-600">23</div>

                  TechCorp submission flagged for manual review              <div className="text-sm text-orange-700">Overdue Reviews</div>

                </p>            </div>

              </div>            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">

              <Badge variant="destructive" className="text-xs">              <div className="text-2xl font-bold text-blue-600">12</div>

                Critical              <div className="text-sm text-blue-700">Urgent Comments</div>

              </Badge>            </div>

            </div>          </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">        </CardContent>

              <div>      </Card>

                <p className="text-sm font-medium text-blue-800">    </div>

                  System Maintenance Scheduled  );

                </p>}
                <p className="text-xs text-blue-600">
                  Planned downtime: Sunday 2:00 AM - 4:00 AM EST
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Info
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}