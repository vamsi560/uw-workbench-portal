"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { WorkItem } from "@/lib/types";
import { 
  Clock, 
  User, 
  Building, 
  AlertTriangle, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  DollarSign,
  Shield,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkItemCardProps {
  workItem: WorkItem;
  onView: (workItem: WorkItem) => void;
  onAssign?: (workItem: WorkItem) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    case 'in review': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function WorkItemCard({ workItem, onView, onAssign }: WorkItemCardProps) {
  const riskScore = workItem.risk_score || 0;
  const riskColor = riskScore >= 80 ? 'text-red-600' : riskScore >= 60 ? 'text-orange-600' : 'text-green-600';
  
  return (
    <Card className="group relative overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-card/50 hover:bg-card">
      {/* Priority Indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(workItem.priority)}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg font-semibold truncate">
                #{workItem.id}
              </CardTitle>
              <Badge variant="outline" className={getStatusColor(workItem.status)}>
                {workItem.status}
              </Badge>
              {workItem.priority && (
                <Badge variant="secondary" className="text-xs">
                  {workItem.priority}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">
              {workItem.title || 'New Submission'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {workItem.extractedFields?.insured_name || 'Unknown Insured'}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(workItem)}>
                View Details
              </DropdownMenuItem>
              {onAssign && (
                <DropdownMenuItem onClick={() => onAssign(workItem)}>
                  Assign Underwriter
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="text-sm font-medium">{workItem.industry || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Coverage</p>
              <p className="text-sm font-medium">
                {workItem.coverage_amount 
                  ? `$${(workItem.coverage_amount / 1000000).toFixed(1)}M` 
                  : 'TBD'}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        {riskScore > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Risk Score</span>
              </div>
              <span className={`text-sm font-bold ${riskColor}`}>{riskScore}/100</span>
            </div>
            <Progress value={riskScore} className="h-2" />
          </div>
        )}

        {/* Assignment & Timing */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {workItem.assigned_to ? (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {workItem.assigned_to.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{workItem.assigned_to}</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Unassigned</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date(workItem.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Comments & Urgency Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            {workItem.comments_count && workItem.comments_count > 0 && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{workItem.comments_count}</span>
              </div>
            )}
            
            {workItem.has_urgent_comments && (
              <div className="flex items-center space-x-1 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">Urgent</span>
              </div>
            )}
          </div>

          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onView(workItem)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkItemGridProps {
  workItems: WorkItem[];
  onViewItem: (workItem: WorkItem) => void;
  onAssignItem?: (workItem: WorkItem) => void;
  isLoading?: boolean;
}

export function WorkItemGrid({ workItems, onViewItem, onAssignItem, isLoading = false }: WorkItemGridProps) {
  // Safety check for undefined workItems
  const safeWorkItems = workItems || [];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!safeWorkItems.length) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No work items found</h3>
            <p className="text-muted-foreground">Work items will appear here when available.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeWorkItems.map((workItem) => (
        <WorkItemCard
          key={workItem.id}
          workItem={workItem}
          onView={onViewItem}
          onAssign={onAssignItem}
        />
      ))}
    </div>
  );
}