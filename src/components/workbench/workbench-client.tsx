"use client";

import * as React from "react";
import { Table as TanstackTable, Row } from "@tanstack/react-table";
import { submissions as defaultSubmissions, workItems as defaultWorkItems } from "@/lib/data";
import { Submission, WorkItem } from "@/lib/types";
import { DataTable } from "@/components/workbench/data-table";
import { getColumns, getWorkItemColumns } from "@/components/workbench/columns";
import { WorkbenchTabs } from "@/components/workbench/w            <AlertDialogTitle>
              {isSummarizing ? "Generating Summary..." : "Submission Summary"}
            </AlertDialogTitle>bench-tabs";
import { AddTaskSheet } from "@/components/workbench/add-task-sheet";
import { SubmissionDetails } from "@/components/workbench/submission-details";
import { WorkItemDetails } from "@/components/workbench/work-item-details";
import { PortfolioManagement } from "@/components/workbench/portfolio-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// Removed import for summarizeSelectedRows - now using backend API
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useWorkItemUpdates } from "@/hooks/use-workitem-updates";
import { useWorkItemFilters } from "@/hooks/use-workitem-filters";
import { Dashboard } from "./dashboard";
import { SseTest } from "./sse-test";
import { WorkItemCreationTest } from "./workitem-creation-test";

const subjectivitiesData = [
  { id: 'SUBJ-001', submission: 'S345821', type: 'Inspection', status: 'Pending', dueDate: '08/15/2025' },
  { id: 'SUBJ-002', submission: 'S489234', type: 'Documentation', status: 'Completed', dueDate: '09/20/2025' },
  { id: 'SUBJ-003', submission: 'S512345', type: 'Audit', status: 'Pending', dueDate: '09/10/2025' },
  { id: 'SUBJ-004', submission: 'S901234', type: 'Approval', status: 'Waived', dueDate: '08/01/2025' },
];

export function WorkbenchClient() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = React.useState<Submission[]>(defaultSubmissions);
  const [workItems, setWorkItems] = React.useState<WorkItem[]>(defaultWorkItems);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Work item filtering
  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    getApiFilters,
  } = useWorkItemFilters();
  
  // Real-time work item updates (Polling) with filtering
  const {
    newWorkItems,
    addNewWorkItem,
    acknowledgeNewWorkItem,
    clearNewWorkItems,
    connected,
    error,
  } = useWorkItemUpdates({
    enableNotifications: true,
    filters: getApiFilters(),
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [selectedWorkItem, setSelectedWorkItem] = React.useState<WorkItem | null>(null);
  const [activeTab, setActiveTab] = React.useState("My Submissions");
  const [summary, setSummary] = React.useState<string>('');
  const [isSummarizing, setIsSummarizing] = React.useState<boolean>(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = React.useState<boolean>(false);

  // Refresh function to refetch data
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch fresh data here:
      // const freshSubmissions = await fetchSubmissions();
      // const freshWorkItems = await fetchWorkItems();
      // setSubmissions(freshSubmissions);
      // setWorkItems(freshWorkItems);
      
      toast({
        title: "Data Refreshed",
        description: "All data has been refreshed successfully.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  // Initialize data on mount (handles page refresh)
  React.useEffect(() => {
    // On component mount, ensure we have fresh data
    // This prevents issues when user refreshes the page
    if (!submissions.length && !workItems.length) {
      // In a real app, fetch initial data here
      setSubmissions(defaultSubmissions);
      setWorkItems(defaultWorkItems);
    }
  }, []);

  // Handle new work items from polling
  React.useEffect(() => {
    if (newWorkItems.length > 0) {
      // Clear static work items when we have real data from backend
      if (workItems.length === defaultWorkItems.length) {
        // Only clear if we still have the default static data
        const hasOnlyStaticData = workItems.every(item => 
          defaultWorkItems.some(defaultItem => defaultItem.id === item.id)
        );
        if (hasOnlyStaticData) {
          setWorkItems([]); // Clear static data
        }
      }

      // Add new work items from backend (only if not already present)
      newWorkItems.forEach(newItem => {
        // Check if this work item already exists
        const existingWorkItem = workItems.find(item => item.id === newItem.id);
        if (existingWorkItem) {
          acknowledgeNewWorkItem(newItem.id);
          return; // Skip if already exists
        }

        addNewWorkItem(newItem);
        
        // Create a new submission for this work item if it doesn't exist
        const submissionId = `S${newItem.submission_id}`;
        const existingSubmission = submissions.find(s => s.id === submissionId);
        
        if (!existingSubmission && newItem.extracted_fields) {
          const newSubmission: Submission = {
            id: submissionId,
            taskPending: 'Yes',
            effectiveDate: newItem.extracted_fields.effective_date || 'TBD',
            expiryDate: newItem.extracted_fields.expiry_date || 'TBD',
            insuredName: newItem.extracted_fields.insured_name || 'Unknown Insured',
            underwriter: 'Auto-Assigned',
            status: 'New',
            new: 'Yes',
            producer: newItem.extracted_fields.broker || 'Unknown',
            producerInternal: 'System',
            mfaEnforced: 'No',
          };
          
          // Add new submission to the list (this would normally come from an API)
          setSubmissions(prev => [newSubmission, ...prev]);
        }
        
        // Convert and add to workItems state with enhanced fields
        const workItem: WorkItem = {
          // Core identifiers
          id: newItem.id,
          submission_id: newItem.submission_id,
          submission_ref: newItem.submission_ref,
          
          // Basic work item data
          title: newItem.title || newItem.subject || 'New Work Item',
          description: newItem.description,
          status: newItem.status,
          priority: newItem.priority || 'Medium',
          assigned_to: newItem.assigned_to,
          
          // Cyber insurance specific fields
          risk_score: newItem.risk_score,
          risk_categories: newItem.risk_categories,
          industry: newItem.industry,
          company_size: newItem.company_size,
          policy_type: newItem.policy_type,
          coverage_amount: newItem.coverage_amount,
          last_risk_assessment: newItem.last_risk_assessment,
          
          // Collaboration data
          comments_count: newItem.comments_count || 0,
          has_urgent_comments: newItem.has_urgent_comments || false,
          
          // Timestamps
          created_at: newItem.created_at,
          updated_at: newItem.updated_at,
          
          // Legacy fields for backward compatibility
          owner: newItem.owner || 'System',
          type: newItem.type || 'New Submission',
          gwpcStatus: newItem.gwpcStatus || 'Pending',
          indicated: newItem.indicated || false,
          automationStatus: newItem.automationStatus || 'Not Applicable',
          exposureStatus: newItem.exposureStatus || 'New',
          submissionId: submissionId,
          extractedFields: newItem.extracted_fields,
        };
        setWorkItems(prev => [workItem, ...prev]);
        acknowledgeNewWorkItem(newItem.id);
      });
    }
  }, [newWorkItems, addNewWorkItem, acknowledgeNewWorkItem, workItems, defaultWorkItems, submissions]);

  
  let tableRef: TanstackTable<Submission> | null = null;
  let workItemTableRef: TanstackTable<WorkItem> | null = null;

  const handleSummarize = async (selectedRows: Row<any>[]) => {
    const dataToSummarize = selectedRows.map(row => row.original);
    if (dataToSummarize.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select one or more rows to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    setIsSummaryDialogOpen(true);
    try {
      // For now, summarize the first selected submission
      const firstSubmission = dataToSummarize[0];
      const response = await fetch(`/api/submissions/${firstSubmission.id}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Format the summary with key points and risk flags
      let formattedSummary = result.summary || 'No summary available';
      
      if (result.key_points && result.key_points.length > 0) {
        formattedSummary += '\n\n## Key Points:\n';
        result.key_points.forEach((point: string, index: number) => {
          formattedSummary += `${index + 1}. ${point}\n`;
        });
      }
      
      if (result.risk_flags && result.risk_flags.length > 0) {
        formattedSummary += '\n\n## Risk Flags:\n';
        result.risk_flags.forEach((flag: string, index: number) => {
          formattedSummary += `⚠️ ${flag}\n`;
        });
      }
      
      setSummary(formattedSummary);
    } catch (error) {
      console.error("Error summarizing submission:", error);
      toast({
        title: "Summarization Failed",
        description: "An error occurred while summarizing the selected submission.",
        variant: "destructive",
      });
      setIsSummaryDialogOpen(false);
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleBackToWorkbench = () => {
    setSelectedSubmission(null);
    setSelectedWorkItem(null);
  };

  const handleViewWorkItem = (workItem: WorkItem) => {
    setSelectedWorkItem(workItem);
  };

  const handleSaveWorkItem = (workItem: WorkItem, workItemSubmission: Submission) => {
    // Create a new submission based on the work item and its extracted data
    const newSubmission: Submission = {
      id: workItemSubmission.id,
      taskPending: 'No', // Mark as processed since it's been saved
      effectiveDate: workItemSubmission.effectiveDate,
      expiryDate: workItemSubmission.expiryDate,
      insuredName: workItemSubmission.insuredName,
      underwriter: workItemSubmission.underwriter,
      status: 'Processed', // Update status to show it's been processed
      new: 'No', // No longer new since it's been saved
      producer: workItemSubmission.producer,
      producerInternal: workItemSubmission.producerInternal,
      mfaEnforced: workItemSubmission.mfaEnforced,
    };

    // Add to submissions list if not already there
    setSubmissions(prev => {
      const existingIndex = prev.findIndex(s => s.id === newSubmission.id);
      if (existingIndex !== -1) {
        // Update existing submission
        const updated = [...prev];
        updated[existingIndex] = newSubmission;
        return updated;
      } else {
        // Add new submission
        return [newSubmission, ...prev];
      }
    });

    // Remove from work items since it's now a submission
    setWorkItems(prev => prev.filter(wi => wi.id !== workItem.id));

    // Show success message
    toast({
      title: "Work Item Saved",
      description: `Work item ${workItem.id} has been saved as submission ${newSubmission.id}`,
      duration: 3000,
    });

    // Go back to main view
    handleBackToWorkbench();
  };
  
  const submissionColumns = getColumns(handleViewSubmission);
  const workItemColumns = getWorkItemColumns(handleViewWorkItem);

  if (selectedSubmission) {
    return (
      <main>
        <SubmissionDetails submission={selectedSubmission} onBack={handleBackToWorkbench} />
      </main>
    )
  }

  if (selectedWorkItem) {
    let submissionForWorkItem = submissions.find(s => s.id === selectedWorkItem.submissionId);
    
    // If no submission found and work item has extracted fields, create a temporary one
    if (!submissionForWorkItem && selectedWorkItem.extractedFields) {
      submissionForWorkItem = {
        id: selectedWorkItem.submissionId,
        taskPending: 'Yes',
        effectiveDate: selectedWorkItem.extractedFields.effective_date || 'TBD',
        expiryDate: selectedWorkItem.extractedFields.expiry_date || 'TBD',
        insuredName: selectedWorkItem.extractedFields.insured_name || 'Unknown Insured',
        underwriter: 'Auto-Assigned',
        status: 'New',
        new: 'Yes',
        producer: selectedWorkItem.extractedFields.broker || 'Unknown',
        producerInternal: 'System',
        mfaEnforced: 'No',
      };
    }
    
    return (
      <main>
        {submissionForWorkItem && (
          <WorkItemDetails 
            workItem={selectedWorkItem} 
            submission={submissionForWorkItem} 
            onBack={handleBackToWorkbench}
            onSave={handleSaveWorkItem}
          />
        )}
      </main>
    )
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Tasks") {
        onTasksClick();
    }
  }

  const onTasksClick = () => {
      setIsSheetOpen(true);
  }

  return (
      <main>
        {/* Polling Status Bar */}
        <div className="bg-muted/30 border-b px-6 py-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                Polling: {connected ? 'Active' : 'Inactive'}
              </span>
              {error && (
                <span className="text-orange-600">Error: {error}</span>
              )}
            </div>
            <span className="text-muted-foreground">
              Work Items: {workItems.length} | New Items: {newWorkItems.length}
            </span>
          </div>
        </div>
        <WorkbenchTabs 
          onTasksClick={() => setIsSheetOpen(true)} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          workItemCount={workItems.length}
        />
        {activeTab === 'My Submissions' && (
          <DataTable
            columns={submissionColumns}
            data={submissions}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setTable={(t) => (tableRef = t)}
            onSummarize={handleSummarize}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        )}
        {activeTab === 'Work Items' && (
           <DataTable
            columns={workItemColumns}
            data={workItems}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setTable={(t) => (workItemTableRef = t)}
            onSummarize={handleSummarize}
            isWorkItems={true}
            filters={filters}
            onFilterChange={updateFilter}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        )}
        {activeTab === 'All Submissions' && (
           <DataTable
            columns={submissionColumns}
            data={submissions}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setTable={(t) => (tableRef = t)}
            onSummarize={handleSummarize}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        )}
        {activeTab === 'Subjectivities' && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Subjectivities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectivitiesData.map((subj) => (
                    <TableRow key={subj.id}>
                      <TableCell className="font-medium">{subj.id}</TableCell>
                      <TableCell>{subj.submission}</TableCell>
                      <TableCell>{subj.type}</TableCell>
                      <TableCell><Badge variant={subj.status === 'Completed' ? 'success' : 'default'}>{subj.status}</Badge></TableCell>
                      <TableCell>{subj.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {activeTab === 'Portfolio Management' && (
          <PortfolioManagement />
        )}
        {activeTab === 'Dashboard' && (
          <Dashboard />
        )}
        {activeTab === 'SSE Test' && (
          <SseTest />
        )}
        {activeTab === 'Work Item Test' && (
          <WorkItemCreationTest />
        )}
        <AddTaskSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
         <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isSummarizing ? "Generating Summary..." : "Summary of Selected Rows"}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                {isSummarizing ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="mt-4 max-h-80 overflow-y-auto text-sm text-foreground whitespace-pre-wrap markdown-content">
                    {summary}
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsSummaryDialogOpen(false)}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
  );
}
