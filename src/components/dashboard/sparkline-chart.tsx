'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineChartProps {
  data: number[]
  color?: string
  height?: number
}

export function SparklineChart({ 
  data, 
  color = '#10B981',
  height = 48 
}: SparklineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ height }}
      >
        <span className="text-xs text-gray-400">No data</span>
      </div>
    )
  }

  // Convert data to chart format
  const chartData = data.map((value, index) => ({
    value,
    index
  }))

  // Determine if the trend is positive or negative
  const firstValue = data[0]
  const lastValue = data[data.length - 1]
  const isPositive = lastValue >= firstValue

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
