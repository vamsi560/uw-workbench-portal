"use client";

import { ProfessionalWorkbench } from "@/components/workbench/professional-workbench";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Building2, 
  Target,
  TrendingUp,
  Activity,
  ArrowRight,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Cyber Insurance Underwriting Portal
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Advanced AI-powered underwriting workbench with intelligent risk assessment, 
              portfolio analytics, and team collaboration tools.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/dashboard">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/dashboard/work-queue">
                  <Activity className="h-5 w-5 mr-2" />
                  Work Queue
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Intelligent Underwriting Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leverage AI and advanced analytics to make faster, more accurate underwriting decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Dashboard Feature */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Underwriter Dashboard</CardTitle>
                  <CardDescription>
                    Real-time KPI monitoring and work queue management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Live performance metrics</li>
                <li>• Risk score visualizations</li>
                <li>• Team collaboration tools</li>
                <li>• SLA tracking and alerts</li>
              </ul>
              <Button asChild className="w-full mt-4">
                <Link href="/dashboard">
                  Access Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Feature */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Portfolio Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive portfolio performance analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Risk distribution analysis</li>
                <li>• Industry benchmarking</li>
                <li>• Performance insights</li>
                <li>• AI recommendations</li>
              </ul>
              <Button asChild className="w-full mt-4">
                <Link href="/dashboard/analytics">
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Team Performance Feature */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Team Performance</CardTitle>
                  <CardDescription>
                    Monitor individual and team productivity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Individual performance tracking</li>
                <li>• Capacity utilization metrics</li>
                <li>• Comparative analysis</li>
                <li>• Productivity rankings</li>
              </ul>
              <Button asChild className="w-full mt-4">
                <Link href="/dashboard/team">
                  Team Metrics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Quick Access
            </h3>
            <p className="text-gray-600">
              Jump directly to the tools you need most
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/dashboard/work-queue">
                <Activity className="h-6 w-6" />
                <span>Work Queue</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/dashboard/analytics">
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/dashboard/team">
                <Users className="h-6 w-6" />
                <span>Team Performance</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/dashboard">
                <Target className="h-6 w-6" />
                <span>Main Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">Cyber Insurance Portal</span>
          </div>
          <p className="text-gray-400">
            Powered by AI and advanced analytics for intelligent underwriting decisions
          </p>
        </div>
      </div>
    </div>
  );
}
