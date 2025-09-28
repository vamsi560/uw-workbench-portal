export type Submission = {
  id: string;
  taskPending: 'Yes' | 'No';
  effectiveDate: string;
  expiryDate: string;
  insuredName: string;
  underwriter: string;
  status: string;
  new: string;
  producer: string;
  producerInternal: string;
  mfaEnforced: 'Yes' | 'No';
};

export type Task = {
  id: string;
  submissionId: string;
  taskType: string;
  note: string;
  createdDate: string;
  dueDate: string;
  status: 'To Do' | 'Done';
  tags: string;
  assignTo: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type WorkItem = {
  // Core identifiers
  id: string | number;
  submission_id?: number;
  submission_ref?: string;
  
  // Basic work item data
  title?: string;
  description?: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected' | string;
  priority: 'Low' | 'Moderate' | 'Medium' | 'High' | 'Critical';
  assigned_to?: string;
  
  // Cyber insurance specific fields
  risk_score?: number; // 0-100 float
  risk_categories?: {
    technical: number;
    operational: number;
    financial: number;
    compliance: number;
  };
  industry?: string;
  company_size?: 'Small' | 'Medium' | 'Large' | 'Enterprise';
  policy_type?: string;
  coverage_amount?: number;
  last_risk_assessment?: string;
  
  // Collaboration data
  comments_count?: number;
  has_urgent_comments?: boolean;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  
  // Legacy fields for backward compatibility
  owner?: string;
  type?: string;
  gwpcStatus?: string;
  indicated?: boolean;
  automationStatus?: string;
  exposureStatus?: string;
  submissionId?: string;
  extractedFields?: Record<string, any>;
  
  // Deprecated - use risk_categories instead
  riskScore?: number;
  riskCategories?: {
    name: string;
    score: number;
    weight: number;
  }[];
};

// WebSocket event types for real-time updates
export interface WebSocketEvent {
  event: string;
  data: any;
}

export interface NewWorkItemEvent {
  event: 'new_workitem';
  data: {
    id: number;
    submission_id: number;
    submission_ref: string;
    subject: string;
    from_email: string | null;
    created_at: string;
    status: string;
    extracted_fields?: Record<string, any>;
  };
}

export interface WorkItemUpdate {
  id: string;
  submission_id: number;
  submission_ref: string;
  subject: string;
  from_email: string | null;
  created_at: string;
  status: string;
  extracted_fields?: Record<string, any>;
  owner?: string;
  type?: string;
  priority?: 'High' | 'Medium' | 'Low';
  gwpcStatus?: string;
  indicated?: boolean;
  automationStatus?: string;
  exposureStatus?: string;
}