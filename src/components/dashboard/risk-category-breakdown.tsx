'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  DollarSign, 
  FileCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface RiskCategory {
  name: string
  score: number
  weight: number
  factors: string[]
  trend?: 'up' | 'down' | 'stable'
}

interface RiskCategoryBreakdownProps {
  categories: RiskCategory[]
  overallScore: number
}

export function RiskCategoryBreakdown({ categories, overallScore }: RiskCategoryBreakdownProps) {
  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'technical':
        return <Shield className="h-4 w-4" />
      case 'operational':
        return <Users className="h-4 w-4" />
      case 'financial':
        return <DollarSign className="h-4 w-4" />
      case 'compliance':
        return <FileCheck className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getCategoryColor = (score: number) => {
    if (score <= 40) return 'text-green-600'
    if (score <= 70) return 'text-yellow-600'
    if (score <= 85) return 'text-orange-600'
    return 'text-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score <= 40) return 'bg-green-500'
    if (score <= 70) return 'bg-yellow-500'
    if (score <= 85) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null
    
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Risk Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category.name)}
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
                <Badge variant="outline" className="text-xs">
                  {category.weight}% weight
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getCategoryColor(category.score)}`}>
                  {category.score}
                </span>
                {getTrendIcon(category.trend)}
              </div>
            </div>
            
            <Progress 
              value={category.score} 
              className="h-2"
            />
            
            {/* Contributing Factors */}
            {category.factors && category.factors.length > 0 && (
              <div className="pl-6">
                <div className="text-xs text-gray-500 mb-1">Contributing factors:</div>
                <div className="flex flex-wrap gap-1">
                  {category.factors.map((factor, factorIndex) => (
                    <Badge 
                      key={factorIndex} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Overall Risk Score Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Overall Risk Score</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getCategoryColor(overallScore)}`}>
                {overallScore}
              </span>
              <Badge 
                variant="outline"
                className={`text-xs ${
                  overallScore <= 40 ? 'text-green-600 border-green-200' :
                  overallScore <= 70 ? 'text-yellow-600 border-yellow-200' :
                  overallScore <= 85 ? 'text-orange-600 border-orange-200' :
                  'text-red-600 border-red-200'
                }`}
              >
                {overallScore <= 40 ? 'Low Risk' :
                 overallScore <= 70 ? 'Medium Risk' :
                 overallScore <= 85 ? 'High Risk' : 'Critical Risk'}
              </Badge>
            </div>
          </div>
          <Progress 
            value={overallScore} 
            className="h-3 mt-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}
