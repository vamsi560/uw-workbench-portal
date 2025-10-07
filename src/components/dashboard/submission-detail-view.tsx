'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
  FileText,
  TrendingUp,
  TrendingDown,
  Info,
  ExternalLink
} from 'lucide-react'
import { RiskAssessmentGauge } from './risk-assessment-gauge'
import { RiskCategoryBreakdown } from './risk-category-breakdown'
import { AutomatedRecommendations } from './automated-recommendations'
import { CommunicationHub } from './communication-hub'
import { useSubmissionDetailData } from '@/hooks/use-submission-detail-data'

interface SubmissionDetailViewProps {
  workItemId: string
}

export function SubmissionDetailView({ workItemId }: SubmissionDetailViewProps) {
  const { data, isLoading, error, refetch } = useSubmissionDetailData(workItemId)

  if (isLoading && !data) {
    return <SubmissionDetailSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load submission</h3>
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submission found</h3>
              <p className="text-muted-foreground">
                The requested submission could not be found.
              </p>
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
              {data.company_profile.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Submission: {data.submission_reference} • {data.company_profile.industry}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`${
                data.risk_assessment.risk_level === 'Low' ? 'text-green-600 border-green-200' :
                data.risk_assessment.risk_level === 'Medium' ? 'text-yellow-600 border-yellow-200' :
                data.risk_assessment.risk_level === 'High' ? 'text-orange-600 border-orange-200' :
                'text-red-600 border-red-200'
              }`}
            >
              {data.risk_assessment.risk_level} Risk
            </Badge>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Intelligence Panel */}
                <div className="lg:col-span-2">
                  <CompanyIntelligencePanel companyProfile={data.company_profile} />
                </div>

                {/* Policy Details */}
                <div>
                  <PolicyDetailsSection policyDetails={data.policy_details} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Assessment Dashboard */}
                <div className="lg:col-span-2">
                  <RiskAssessmentDashboard riskAssessment={data.risk_assessment} />
                </div>

                {/* Risk Factors */}
                <div>
                  <RiskFactorsList riskFactors={data.risk_assessment.risk_factors} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <AutomatedRecommendations recommendations={data.recommendations} />
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <CommunicationHub 
                communications={data.communications}
                workItemId={workItemId}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Company Intelligence Panel Component
function CompanyIntelligencePanel({ companyProfile }: { companyProfile: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Industry</label>
            <p className="text-sm text-gray-900">{companyProfile.industry}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Company Size</label>
            <p className="text-sm text-gray-900">{companyProfile.size}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Employees</label>
            <p className="text-sm text-gray-900">{companyProfile.employees.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Annual Revenue</label>
            <p className="text-sm text-gray-900">
              ${companyProfile.revenue.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Years in Business</label>
            <p className="text-sm text-gray-900">{companyProfile.years_in_business}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Credit Rating</label>
            <Badge variant="outline" className="text-xs">
              {companyProfile.credit_rating}
            </Badge>
          </div>
        </div>

        {/* Cybersecurity Posture */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Cybersecurity Posture
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Security Measures</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {companyProfile.security_measures.map((measure: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {measure}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Data Types</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {companyProfile.data_types.map((type: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Certifications</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {companyProfile.certifications.map((cert: string, index: number) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health Indicators */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Financial Health
          </h4>
          <div className="space-y-3">
            {companyProfile.financial_indicators.map((indicator: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{indicator.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{indicator.value}</span>
                  {indicator.trend && (
                    <div className={`flex items-center gap-1 ${
                      indicator.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {indicator.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Policy Details Section Component
function PolicyDetailsSection({ policyDetails }: { policyDetails: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Policy Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coverage Type and Limits */}
        <div>
          <label className="text-sm font-medium text-gray-600">Coverage Type</label>
          <p className="text-sm text-gray-900">{policyDetails.coverage_type}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Coverage Limits</label>
          <div className="space-y-2 mt-1">
            {policyDetails.coverage_limits.map((limit: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{limit.type}</span>
                <span className="font-medium">
                  ${limit.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Components */}
        <div>
          <label className="text-sm font-medium text-gray-600">Policy Components</label>
          <div className="space-y-1 mt-1">
            {policyDetails.components.map((component: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-sm text-gray-900">{component}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Exclusions */}
        <div>
          <label className="text-sm font-medium text-gray-600">Suggested Exclusions</label>
          <div className="space-y-1 mt-1">
            {policyDetails.exclusions.map((exclusion: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-sm text-gray-900">{exclusion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Calculation Factors */}
        <div>
          <label className="text-sm font-medium text-gray-600">Premium Factors</label>
          <div className="space-y-2 mt-1">
            {policyDetails.premium_factors.map((factor: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{factor.name}</span>
                <span className="font-medium">{factor.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Risk Assessment Dashboard Component
function RiskAssessmentDashboard({ riskAssessment }: { riskAssessment: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Risk Assessment Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score Gauge */}
        <div className="flex justify-center">
          <RiskAssessmentGauge 
            score={riskAssessment.overall_score}
            riskLevel={riskAssessment.risk_level}
          />
        </div>

        {/* Risk Category Breakdown */}
        <RiskCategoryBreakdown 
          categories={riskAssessment.categories}
          overallScore={riskAssessment.overall_score}
        />

        {/* Industry Benchmark */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Industry Benchmark</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Industry Average</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{riskAssessment.industry_benchmark}</span>
              <Badge variant="outline" className="text-xs">
                {riskAssessment.overall_score > riskAssessment.industry_benchmark ? 'Above' : 'Below'} Average
              </Badge>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="border-t pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Assessment Confidence</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${riskAssessment.confidence_score}%` }}
              />
            </div>
            <span className="text-sm font-medium">{riskAssessment.confidence_score}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Risk Factors List Component
function RiskFactorsList({ riskFactors }: { riskFactors: any[] }) {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Factors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskFactors.map((factor, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">{factor.factor}</h4>
              <Badge 
                variant="outline" 
                className={`text-xs ${getImpactColor(factor.impact_level)}`}
              >
                {factor.impact_level}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-2">{factor.description}</p>
            {factor.score_impact && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">Score Impact:</span>
                <span className={`text-xs font-medium ${
                  factor.score_impact > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {factor.score_impact > 0 ? '+' : ''}{factor.score_impact}
                </span>
              </div>
            )}
            {factor.mitigation_recommendation && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                <strong>Recommendation:</strong> {factor.mitigation_recommendation}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
