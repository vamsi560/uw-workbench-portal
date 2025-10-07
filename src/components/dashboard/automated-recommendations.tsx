'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle,
  XCircle,
  Info,
  Send,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'

interface Recommendation {
  action: 'Approve' | 'Decline' | 'Request Info' | 'Refer'
  confidence_level: number
  reasoning: string[]
  suggested_conditions?: string[]
  estimated_premium_range?: {
    min: number
    max: number
  }
  market_positioning?: string
  alternative_actions?: {
    action: string
    confidence: number
    reasoning: string
  }[]
}

interface AutomatedRecommendationsProps {
  recommendations: Recommendation
}

export function AutomatedRecommendations({ recommendations }: AutomatedRecommendationsProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Approve':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Decline':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'Request Info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'Refer':
        return <Send className="h-5 w-5 text-orange-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Approve':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'Decline':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'Request Info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'Refer':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Primary Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            Automated Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recommended Action */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getActionIcon(recommendations.action)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {recommendations.action}
                </h3>
                <p className="text-sm text-gray-600">
                  Recommended action based on risk assessment
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getConfidenceColor(recommendations.confidence_level)}`}>
                {recommendations.confidence_level}%
              </div>
              <p className="text-xs text-gray-500">Confidence Level</p>
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Reasoning</h4>
            <ul className="space-y-2">
              {recommendations.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Policy Conditions */}
          {recommendations.suggested_conditions && recommendations.suggested_conditions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Suggested Policy Conditions</h4>
              <div className="space-y-2">
                {recommendations.suggested_conditions.map((condition, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-900">{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estimated Premium Range */}
          {recommendations.estimated_premium_range && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Estimated Premium Range
              </h4>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Premium Range</span>
                  <span className="text-lg font-semibold text-green-900">
                    {formatCurrency(recommendations.estimated_premium_range.min)} - {formatCurrency(recommendations.estimated_premium_range.max)}
                  </span>
                </div>
                {recommendations.market_positioning && (
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{recommendations.market_positioning}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              className={`flex-1 ${
                recommendations.action === 'Approve' ? 'bg-green-600 hover:bg-green-700' :
                recommendations.action === 'Decline' ? 'bg-red-600 hover:bg-red-700' :
                recommendations.action === 'Request Info' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {recommendations.action === 'Approve' && <CheckCircle className="h-4 w-4 mr-2" />}
              {recommendations.action === 'Decline' && <XCircle className="h-4 w-4 mr-2" />}
              {recommendations.action === 'Request Info' && <Info className="h-4 w-4 mr-2" />}
              {recommendations.action === 'Refer' && <Send className="h-4 w-4 mr-2" />}
              {recommendations.action}
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Recommendations */}
      {recommendations.alternative_actions && recommendations.alternative_actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alternative Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.alternative_actions.map((alternative, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getActionIcon(alternative.action)}
                    <span className="font-medium text-gray-900">{alternative.action}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getConfidenceColor(alternative.confidence)}`}
                  >
                    {alternative.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{alternative.reasoning}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommendation Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Recommendation was helpful
            </Button>
            <Button variant="outline" className="flex-1">
              <ThumbsDown className="h-4 w-4 mr-2" />
              Recommendation needs improvement
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your feedback helps improve our recommendation engine
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
