"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

export function ProfessionalDashboard() {
  const stats = [
    {
      title: "Total Submissions",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      description: "This month"
    },
    {
      title: "Pending Review",
      value: "43",
      change: "-8.2%",
      trend: "down",
      icon: Clock,
      description: "Awaiting action"
    },
    {
      title: "Approved",
      value: "1,924",
      change: "+15.3%",
      trend: "up",
      icon: CheckCircle,
      description: "This quarter"
    },
    {
      title: "Requires Attention",
      value: "12",
      change: "+3",
      trend: "alert",
      icon: AlertCircle,
      description: "High priority"
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "alert":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${getTrendColor(stat.trend)}`}>
                    {getTrendIcon(stat.trend)}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">New submission assigned</p>
                  <p className="text-xs text-gray-500">CyberSec Solutions - S12094</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Review completed</p>
                  <p className="text-xs text-gray-500">Quantum Crypt - S12095</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Done</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Requires attention</p>
                  <p className="text-xs text-gray-500">DataFortress Ltd. - S12097</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">Alert</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Efficiency</span>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Response Time</span>
                <span className="font-medium">2.3 days</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quality Score</span>
                <span className="font-medium">98.7%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '98.7%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
