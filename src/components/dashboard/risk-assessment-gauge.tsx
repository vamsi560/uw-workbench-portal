'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface RiskAssessmentGaugeProps {
  score: number
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  size?: number
}

export function RiskAssessmentGauge({ 
  score, 
  riskLevel, 
  size = 200 
}: RiskAssessmentGaugeProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return '#10B981'
      case 'Medium':
        return '#F59E0B'
      case 'High':
        return '#EF4444'
      case 'Critical':
        return '#DC2626'
      default:
        return '#6B7280'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'Low':
        return '#ECFDF5'
      case 'Medium':
        return '#FFFBEB'
      case 'High':
        return '#FEF2F2'
      case 'Critical':
        return '#FEF2F2'
      default:
        return '#F9FAFB'
    }
  }

  // Create data for the pie chart (gauge effect)
  const data = [
    { name: 'Risk Score', value: score, fill: getRiskColor(riskLevel) },
    { name: 'Remaining', value: 100 - score, fill: '#E5E7EB' }
  ]

  const COLORS = [getRiskColor(riskLevel), '#E5E7EB']

  return (
    <Card className="w-fit">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Gauge Chart */}
          <div style={{ width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={size * 0.3}
                  outerRadius={size * 0.4}
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: getRiskColor(riskLevel) }}
            >
              {score}
            </div>
            <div className="text-sm text-gray-600 mb-2">Risk Score</div>
            <Badge 
              variant="outline"
              className={`text-sm ${
                riskLevel === 'Low' ? 'text-green-600 border-green-200' :
                riskLevel === 'Medium' ? 'text-yellow-600 border-yellow-200' :
                riskLevel === 'High' ? 'text-orange-600 border-orange-200' :
                'text-red-600 border-red-200'
              }`}
              style={{ 
                backgroundColor: getRiskBgColor(riskLevel),
                borderColor: getRiskColor(riskLevel)
              }}
            >
              {riskLevel} Risk
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
