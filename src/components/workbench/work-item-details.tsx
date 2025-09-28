"use client";

import * as React from "react";
import { WorkItem, Submission } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  ChevronsUpDown,
  Check,
  Circle,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskScore, RiskBreakdown } from "./risk-score";
import { CommentsSystem, Comment } from "./comments-system";
import { WorkItemAssignment, Underwriter } from "./work-item-assignment";
import { InlineEdit } from "./inline-edit";
import { AssignmentApprovalDialog } from "./assignment-approval-dialog";

interface WorkItemDetailsProps {
  workItem: WorkItem;
  submission: Submission;
  onBack: () => void;
  onSave?: (workItem: WorkItem, submission: Submission) => void;
}

const InfoCard = ({
  title,
  value,
}: {
  title: string;
  value: string | React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const SideNavItem = ({ icon, label, status, isActive = false, isSubItem = false, children }: any) => (
    <div className={isSubItem ? "pl-6" : ""}>
        <div className={`flex items-center p-2 rounded-md cursor-pointer ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}>
            {status === 'completed' && <Check className="h-4 w-4 text-green-500 mr-2" />}
            {status === 'inprogress' && <Circle className="h-4 w-4 text-primary mr-2" />}
            {status === 'pending' && <div className="h-4 w-4 border-2 border-muted-foreground rounded-full mr-2" />}
            <span className="flex-1 text-sm">{label}</span>
        </div>
        {children}
    </div>
);


export function WorkItemDetails({
  workItem,
  submission,
  onBack,
  onSave,
}: WorkItemDetailsProps) {
  const [activeTab, setActiveTab] = React.useState("Submission");
  const [isSaved, setIsSaved] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([]);
  
  // Editable work item state
  const [editableWorkItem, setEditableWorkItem] = React.useState<WorkItem>(workItem);
  const [editableSubmission, setEditableSubmission] = React.useState<Submission>(submission);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  
  // Assignment approval dialog state
  const [showApprovalDialog, setShowApprovalDialog] = React.useState(false);
  const [pendingUnderwriter, setPendingUnderwriter] = React.useState<string>("");
  
  // Get extracted fields if this work item came from polling
  const extractedFields = workItem.extractedFields || {};

  // Get risk data from work item (supports both backend formats)
  const riskScore = workItem.risk_score || workItem.riskScore || 75;
  const riskCategories = workItem.risk_categories || workItem.riskCategories || {
    technical: 80,
    operational: 65,
    financial: 70,
    compliance: 85
  };

  // Mock underwriters data
  const underwriters: Underwriter[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      specialization: ["Cyber", "Technology"],
      workload: 65,
      status: "available"
    },
    {
      id: "2", 
      name: "Mike Chen",
      email: "mike.c@company.com",
      specialization: ["Cyber", "Healthcare"],
      workload: 85,
      status: "busy"
    },
    {
      id: "3",
      name: "Lisa Rodriguez",
      email: "lisa.r@company.com", 
      specialization: ["Liability", "Property"],
      workload: 45,
      status: "available"
    }
  ];

  // Field update handlers
  const handleWorkItemFieldUpdate = (field: keyof WorkItem, value: any) => {
    setEditableWorkItem(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSubmissionFieldUpdate = (field: keyof Submission, value: any) => {
    setEditableSubmission(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableWorkItem, editableSubmission);
      setIsSaved(true);
      setHasUnsavedChanges(false);
    }
  };

  const handleAddComment = (content: string, mentions?: string[]) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content,
      timestamp: new Date().toISOString(),
      mentions,
      priority: content.includes('[URGENT]') ? 'urgent' : 'normal'
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleAssignWorkItem = (underwriterId: string) => {
    // Show approval dialog instead of directly assigning
    setPendingUnderwriter(underwriterId);
    setShowApprovalDialog(true);
  };

  const handleApproveAssignment = () => {
    // Update the work item with the new assignment
    setEditableWorkItem(prev => ({ ...prev, assigned_to: pendingUnderwriter }));
    setEditableSubmission(prev => ({ ...prev, underwriter: pendingUnderwriter }));
    setHasUnsavedChanges(true);
    
    // In real app, this would create the submission and assign the underwriter
    console.log(`Assignment approved: Work item ${workItem.id} assigned to ${pendingUnderwriter}`);
    
    // Call the save handler to create the submission
    if (onSave) {
      onSave({...editableWorkItem, assigned_to: pendingUnderwriter}, {...editableSubmission, underwriter: pendingUnderwriter});
      setIsSaved(true);
      setHasUnsavedChanges(false);
    }
  };

  const handleCancelAssignment = () => {
    setPendingUnderwriter("");
    console.log("Assignment cancelled by user");
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Back</span>
            <span className="text-primary">| Work Item #{workItem.id} | {submission.id} | {submission.insuredName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Guidewire <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline">
            ImageRight <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Actions Panel */}
        <div className="w-64 p-4 border-r">
            <Button className="w-full justify-start bg-secondary hover:bg-secondary/80 text-secondary-foreground mb-4">
                Actions
            </Button>
            <div className="space-y-1">
                <SideNavItem icon="summary" label="Summary" status="completed" isActive={true} />
                <SideNavItem icon="sov" label="SOV Management" status="completed" />
                <SideNavItem icon="exposure" label="Exposure Evaluation" status="completed" />
                <SideNavItem icon="policy" label="Policy Terms" status="inprogress">
                    <div className="pt-1">
                        <SideNavItem label="Modeling" status="pending" isSubItem={true} />
                        <SideNavItem label="Pricing" status="pending" isSubItem={true} />
                        <SideNavItem label="Pricing Summary" status="pending" isSubItem={true} />
                    </div>
                </SideNavItem>
                <SideNavItem icon="gwpc" label="GWPC Sync" status="pending" />
                <SideNavItem icon="narrative" label="UW Narrative" status="pending" />
            </div>
        </div>

        {/* Right Details Panel */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold">Work Item #{workItem.id}</h2>
                <RiskScore score={riskScore} size="md" />
              </div>
              <p className="text-muted-foreground">Owner: {workItem.owner}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={hasUnsavedChanges ? "default" : "outline"}
                onClick={handleSave}
                disabled={isSaved && !hasUnsavedChanges}
              >
                {hasUnsavedChanges ? 'Save Changes' : (isSaved ? 'Saved ✓' : 'Save')}
              </Button>
              <Button variant="outline">Reassign</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <InlineEdit
                  value={editableWorkItem.type || ""}
                  onSave={(value) => handleWorkItemFieldUpdate('type', value)}
                  type="select"
                  options={[
                    { value: "New Submission", label: "New Submission" },
                    { value: "Renewal", label: "Renewal" },
                    { value: "Endorsement", label: "Endorsement" },
                    { value: "Cancellation", label: "Cancellation" }
                  ]}
                />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <InlineEdit
                  value={editableWorkItem.priority}
                  onSave={(value) => handleWorkItemFieldUpdate('priority', value)}
                  type="select"
                  options={[
                    { value: "Critical", label: "Critical" },
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" }
                  ]}
                />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">GWPC Status</p>
                <InlineEdit
                  value={editableWorkItem.gwpcStatus || ""}
                  onSave={(value) => handleWorkItemFieldUpdate('gwpcStatus', value)}
                  type="select"
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Completed", label: "Completed" },
                    { value: "Failed", label: "Failed" }
                  ]}
                />
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <InlineEdit
                  value={editableWorkItem.status}
                  onSave={(value) => handleWorkItemFieldUpdate('status', value)}
                  type="select"
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "In Review", label: "In Review" },
                    { value: "Approved", label: "Approved" },
                    { value: "Rejected", label: "Rejected" },
                    { value: "To Do", label: "To Do" },
                    { value: "WIP", label: "WIP" },
                    { value: "Done", label: "Done" }
                  ]}
                />
            </div>
          </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                <div>
                    <Checkbox id="indicated" checked={workItem.indicated} />
                    <label htmlFor="indicated" className="ml-2 text-sm font-medium">Indicated?</label>
                </div>
                 <div>
                    <Checkbox id="automationStatus" checked={workItem.automationStatus !== 'Not Applicable'} />
                    <label htmlFor="automationStatus" className="ml-2 text-sm font-medium">Automation Status</label>
                    <p className="text-sm text-muted-foreground ml-6">{workItem.automationStatus}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Exposure Status</p>
                    <p>{workItem.exposureStatus}</p>
                </div>
           </div>

          {/* Extracted Fields Section */}
          {Object.keys(extractedFields).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Extracted Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-md border">
                {Object.entries(extractedFields).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="font-medium">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="submission" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="submission">Submission</TabsTrigger>
                <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="assignment">Assignment</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="submission" className="mt-4">
                <div className="bg-muted/50 p-4 rounded-md border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">{submission.id} | {submission.insuredName}</h3>
                    <Button variant="ghost"><Plus className="h-4 w-4 mr-2" />Action</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Insured Name</p>
                      <InlineEdit
                        value={editableSubmission.insuredName}
                        onSave={(value) => handleSubmissionFieldUpdate('insuredName', value)}
                        placeholder="Enter insured name"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Country</p>
                      <InlineEdit
                        value="United States"
                        onSave={(value) => {/* Handle country update */}}
                        placeholder="Enter country"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Effective Date</p>
                      <InlineEdit
                        value={editableSubmission.effectiveDate}
                        onSave={(value) => handleSubmissionFieldUpdate('effectiveDate', value)}
                        placeholder="Enter effective date"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Underwriter</p>
                      <InlineEdit
                        value={editableSubmission.underwriter}
                        onSave={(value) => handleSubmissionFieldUpdate('underwriter', value)}
                        type="select"
                        options={[
                          { value: "underwriter_john", label: "John Smith" },
                          { value: "underwriter_jane", label: "Jane Doe" },
                          { value: "underwriter_alex", label: "Alex Johnson" },
                          { value: "Auto-Assigned", label: "Auto-Assigned" }
                        ]}
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account #</p>
                      <InlineEdit
                        value="A111288"
                        onSave={(value) => {/* Handle account update */}}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <InlineEdit
                        value="123 Davidson Ave, Somerset, New Jersey, United States, 08854"
                        onSave={(value) => {/* Handle address update */}}
                        type="textarea"
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expiration Date</p>
                      <InlineEdit
                        value={editableSubmission.expiryDate}
                        onSave={(value) => handleSubmissionFieldUpdate('expiryDate', value)}
                        placeholder="Enter expiration date"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <InlineEdit
                        value={editableSubmission.status}
                        onSave={(value) => handleSubmissionFieldUpdate('status', value)}
                        type="select"
                        options={[
                          { value: "New", label: "New" },
                          { value: "In Review", label: "In Review" },
                          { value: "Approved", label: "Approved" },
                          { value: "Rejected", label: "Rejected" },
                          { value: "Processed", label: "Processed" }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="risk" className="mt-4">
                <RiskBreakdown 
                  overallScore={riskScore}
                  categories={riskCategories}
                />
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <CommentsSystem 
                  workItemId={workItem.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </TabsContent>

              <TabsContent value="assignment" className="mt-4">
                <WorkItemAssignment
                  currentAssignee={workItem.owner !== 'System Generated' ? workItem.owner : undefined}
                  workItemType={workItem.type}
                  priority={workItem.priority}
                  onAssign={handleAssignWorkItem}
                  underwriters={underwriters}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="pt-4 text-center text-muted-foreground">
                  History details would be displayed here.
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button 
              variant={hasUnsavedChanges ? "default" : "outline"}
              onClick={handleSave}
              disabled={isSaved && !hasUnsavedChanges}
            >
              {hasUnsavedChanges ? 'Save Changes' : (isSaved ? 'Saved ✓' : 'Save')}
            </Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>

      {/* Assignment Approval Dialog */}
      <AssignmentApprovalDialog
        isOpen={showApprovalDialog}
        onOpenChange={setShowApprovalDialog}
        workItem={editableWorkItem}
        submission={editableSubmission}
        underwriter={pendingUnderwriter}
        onApprove={handleApproveAssignment}
        onCancel={handleCancelAssignment}
      />
    </div>
  );
}
