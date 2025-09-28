"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Clock, AlertCircle } from "lucide-react";

export interface Underwriter {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  workload: number; // 0-100
  status: 'available' | 'busy' | 'offline';
}

interface WorkItemAssignmentProps {
  currentAssignee?: string;
  workItemType: string;
  priority: string;
  onAssign: (underwriterId: string) => void;
  underwriters: Underwriter[];
}

export function WorkItemAssignment({ 
  currentAssignee, 
  workItemType, 
  priority, 
  onAssign, 
  underwriters 
}: WorkItemAssignmentProps) {
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee || "");

  const getRecommendedUnderwriters = () => {
    return underwriters
      .filter(u => u.status === 'available')
      .filter(u => u.specialization.some(s => 
        workItemType.toLowerCase().includes(s.toLowerCase())
      ))
      .sort((a, b) => a.workload - b.workload);
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "bg-green-100 text-green-800",
      busy: "bg-yellow-100 text-yellow-800", 
      offline: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || variants.offline;
  };

  const recommended = getRecommendedUnderwriters();
  const currentUnderwriter = underwriters.find(u => u.id === currentAssignee);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        <h3 className="font-semibold">Assignment</h3>
      </div>

      {/* Current Assignment */}
      {currentUnderwriter && (
        <div className="border rounded-lg p-3 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {currentUnderwriter.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentUnderwriter.name}</p>
                <p className="text-sm text-muted-foreground">{currentUnderwriter.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusBadge(currentUnderwriter.status)}>
                {currentUnderwriter.status}
              </Badge>
              <span className={`text-sm font-medium ${getWorkloadColor(currentUnderwriter.workload)}`}>
                {currentUnderwriter.workload}% load
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Assign to:</label>
        <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
          <SelectTrigger>
            <SelectValue placeholder="Select underwriter..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {underwriters.map((underwriter) => (
              <SelectItem key={underwriter.id} value={underwriter.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {underwriter.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{underwriter.name}</span>
                    <Badge className={getStatusBadge(underwriter.status)}>
                      {underwriter.status}
                    </Badge>
                  </div>
                  <span className={`text-sm ${getWorkloadColor(underwriter.workload)}`}>
                    {underwriter.workload}%
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedAssignee && selectedAssignee !== currentAssignee && (
          <Button 
            onClick={() => onAssign(selectedAssignee)}
            className="w-full"
          >
            Assign Work Item
          </Button>
        )}
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">
              Recommended for {workItemType}
            </span>
          </div>
          <div className="space-y-2">
            {recommended.slice(0, 3).map((underwriter) => (
              <div 
                key={underwriter.id}
                className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedAssignee(underwriter.id)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {underwriter.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{underwriter.name}</p>
                    <div className="flex gap-1">
                      {underwriter.specialization.slice(0, 2).map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-sm ${getWorkloadColor(underwriter.workload)}`}>
                    {underwriter.workload}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}