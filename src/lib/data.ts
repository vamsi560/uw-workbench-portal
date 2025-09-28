import { Submission, Task, WorkItem } from "./types";

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

const today = new Date();

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '/');
}

export const submissions: Submission[] = [
  {
    id: "S345821",
    taskPending: "Yes",
    effectiveDate: "07/24/2025",
    expiryDate: "07/24/2026",
    insuredName: "CyberSec Solutions",
    underwriter: "Bruce Wayne",
    status: "Booked",
    new: "New",
    producer: "CyberGuard Brokers",
    producerInternal: "CyberGuard Brokers",
    mfaEnforced: "Yes"
  },
  {
    id: "S489234",
    taskPending: "Yes",
    effectiveDate: "09/09/2025",
    expiryDate: "09/09/2026",
    insuredName: "Quantum Crypt",
    underwriter: "Diana Prince",
    status: "Closed",
    new: "N",
    producer: "Risk Assess Inc",
    producerInternal: "risk_assess_inc",
    mfaEnforced: "No"
  },
  {
    id: "S512345",
    taskPending: "Yes",
    effectiveDate: "09/05/2025",
    expiryDate: "09/05/2026",
    insuredName: "NetSentry Corp",
    underwriter: "Clark Kent",
    status: "Closed",
    new: "N",
    producer: "Risk Assess Inc",
    producerInternal: "risk_assess_inc",
    mfaEnforced: "Yes"
  },
  {
    id: "S678901",
    taskPending: "No",
    effectiveDate: "09/05/2025",
    expiryDate: "09/06/2026",
    insuredName: "DataFortress Ltd.",
    underwriter: "Barry Allen",
    status: "Declined",
    new: "N",
    producer: "Risk Assess Inc",
    producerInternal: "risk_assess_inc",
    mfaEnforced: "No"
  },
  {
    id: "S789012",
    taskPending: "No",
    effectiveDate: "09/05/2025",
    expiryDate: "09/05/2026",
    insuredName: "Cloud-Shield Systems",
    underwriter: "Hal Jordan",
    status: "Closed",
    new: "N",
    producer: "Risk Assess Inc",
    producerInternal: "risk_assess_inc",
    mfaEnforced: "Yes"
  },
  {
    id: "S890123",
    taskPending: "No",
    effectiveDate: "09/04/2025",
    expiryDate: "09/04/2026",
    insuredName: "ThreatTrack Analytics",
    underwriter: "Arthur Curry",
    status: "Closed",
    new: "N",
    producer: "Risk Assess Inc",
    producerInternal: "risk_assess_inc",
    mfaEnforced: "Yes"
  },
  {
    id: "S901234",
    taskPending: "Yes",
    effectiveDate: "07/23/2025",
    expiryDate: "07/23/2026",
    insuredName: "Firewall Frontiers",
    underwriter: "Victor Stone",
    status: "Under Review",
    new: "Submiss...",
    producer: "CyberGuard Brokers",
    producerInternal: "CyberGuard Brokers",
    mfaEnforced: "No"
  },
  {
    id: "S123456",
    taskPending: "Yes",
    effectiveDate: "07/23/2025",
    expiryDate: "07/23/2026",
    insuredName: "Identity Imperative",
    underwriter: "J'onn J'onzz",
    status: "Under Review",
    new: "Submiss...",
    producer: "CyberGuard Brokers",
    producerInternal: "CyberGuard Brokers",
    mfaEnforced: "Yes"
  },
  {
    id: "S234567",
    taskPending: "Yes",
    effectiveDate: "07/22/2025",
    expiryDate: "07/22/2026",
    insuredName: "Payload Protection",
    underwriter: "Oliver Queen",
    status: "Declined",
    new: "Submiss...",
    producer: "CyberGuard Brokers",
    producerInternal: "CyberGuard Brokers",
    mfaEnforced: "No"
  }
];

export const tasks: Task[] = [
    { id: "T1", submissionId: "S345821", taskType: "Review", note: "Review SOC 2 Type II Report", createdDate: "07/20/2025", dueDate: "07/25/2025", status: "To Do", tags: "red", assignTo: "John Smith", priority: "High" },
    { id: "T2", submissionId: "S345821", taskType: "Follow-up", note: "Follow-up on vulnerability scan results", createdDate: "07/26/2025", dueDate: "07/30/2025", status: "To Do", tags: "blue", assignTo: "John Smith", priority: "Medium" },
    { id: "T3", submissionId: "S489234", taskType: "Analyze", note: "Analyze incident response plan", createdDate: "09/01/2025", dueDate: "09/05/2025", status: "Done", tags: "green", assignTo: "Jane Doe", priority: "Medium" },
    { id: "T4", submissionId: "S512345", taskType: "Data Entry", note: "Enter endpoint detection & response details", createdDate: "09/01/2025", dueDate: "09/03/2025", status: "Done", tags: "", assignTo: "Peter Jones", priority: "Low" },
    { id: "T5", submissionId: "S901234", taskType: "Quote", note: "Prepare quote for Firewall Frontiers", createdDate: "07/24/2025", dueDate: "07/28/2025", status: "To Do", tags: "orange", assignTo: "Michael Miller", priority: "High" },
    { id: "T6", submissionId: "S123456", taskType: "Quote", note: "Quote for Identity Imperative", createdDate: "07/24/2025", dueDate: "07/29/2025", status: "To Do", tags: "", assignTo: "Jennifer Wilson", priority: "Medium" },
    { id: "T7", submissionId: "S234567", taskType: "Decline", note: "Send decline letter due to unpatched systems", createdDate: "07/23/2025", dueDate: "07/24/2025", status: "Done", tags: "", assignTo: "Robert Moore", priority: "Medium" },
    { id: "T8", submissionId: "S345821", taskType: "Bind", note: "Bind the policy, subject to MFA on all systems", createdDate: "08/01/2025", dueDate: "08/05/2025", status: "To Do", tags: "purple", assignTo: "John Smith", priority: "High" },
];

export const workItems: WorkItem[] = [
    { id: "W5350", owner: "Natasha Romanoff", type: "Ransomware Exposure", priority: "Medium", gwpcStatus: "Declined", status: "WIP", indicated: false, automationStatus: "Not Applicable", exposureStatus: "New", submissionId: "S345821" },
    { id: "W5351", owner: "Peter Parker", type: "Breach Response Review", priority: "High", gwpcStatus: "Approved", status: "Done", indicated: true, automationStatus: "Complete", exposureStatus: "Renewed", submissionId: "S489234" },
    { id: "W5352", owner: "Tony Stark", type: "Vendor Security Check", priority: "Low", gwpcStatus: "Pending", status: "To Do", indicated: false, automationStatus: "In Progress", exposureStatus: "Endorsed", submissionId: "S512345" },
    { id: "W5353", owner: "Steve Rogers", type: "New Submission", priority: "Medium", gwpcStatus: "Declined", status: "WIP", indicated: true, automationStatus: "Not Applicable", exposureStatus: "New", submissionId: "S678901" },
];
