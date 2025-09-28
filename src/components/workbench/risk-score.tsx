"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, Zap } from "lucide-react";

interface RiskScoreProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function RiskScore({ score, size = "md", showDetails = false }: RiskScoreProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "High", color: "bg-red-500", textColor: "text-red-700", icon: AlertTriangle };
    if (score >= 60) return { level: "Medium", color: "bg-yellow-500", textColor: "text-yellow-700", icon: Zap };
    if (score >= 40) return { level: "Moderate", color: "bg-blue-500", textColor: "text-blue-700", icon: Shield };
    return { level: "Low", color: "bg-green-500", textColor: "text-green-700", icon: Shield };
  };

  const risk = getRiskLevel(score);
  const Icon = risk.icon;

  const sizeClasses = {
    sm: "text-xs h-4",
    md: "text-sm h-6", 
    lg: "text-base h-8"
  };

  if (size === "sm") {
    return (
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${risk.color}`} />
        <span className={`${sizeClasses[size]} font-medium ${risk.textColor}`}>
          {score}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Icon className={`w-4 h-4 ${risk.textColor}`} />
        <span className={`${sizeClasses[size]} font-semibold ${risk.textColor}`}>
          {score}/100
        </span>
      </div>
      
      {showDetails && (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className={`${risk.textColor} border-current`}>
            {risk.level} Risk
          </Badge>
          <Progress value={score} className="w-20 h-2" />
        </div>
      )}
    </div>
  );
}

// Component for detailed risk breakdown
interface RiskBreakdownProps {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    weight: number;
  }[];
}

export function RiskBreakdown({ overallScore, categories }: RiskBreakdownProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cyber Risk Assessment</h3>
        <RiskScore score={overallScore} size="lg" showDetails />
      </div>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {category.score}/100 ({category.weight}% weight)
                </span>
              </div>
              <Progress value={category.score} className="h-2" />
            </div>
            <div className="ml-3">
              <RiskScore score={category.score} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}