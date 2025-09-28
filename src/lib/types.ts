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
};
