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
  id: string;
  owner: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low';
  gwpcStatus: string;
  status: string;
  indicated: boolean;
  automationStatus: string;
  exposureStatus: string;
  submissionId: string;
  extractedFields?: Record<string, any>;
  riskScore?: number; // 0-100 cyber risk score
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