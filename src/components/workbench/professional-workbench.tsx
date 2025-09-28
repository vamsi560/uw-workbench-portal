"use client";

import * as React from "react";
import { ProfessionalHeader } from "./professional-header";
import { WorkItemGrid } from "./work-item-cards";
import { ProfessionalDashboard } from "./professional-dashboard";
import { WorkbenchTabs } from "./workbench-tabs";
import { DataTable } from "./data-table";
import { getColumns, getWorkItemColumns } from "./columns";
import { submissions as defaultSubmissions, workItems as defaultWorkItems } from "@/lib/data";
import { Submission, WorkItem } from "@/lib/types";
import { WorkItemDetails } from "./work-item-details";
import { SubmissionDetails } from "./submission-details";
import { PortfolioManagement } from "./portfolio-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWorkItemUpdates } from "@/hooks/use-workitem-updates";
import { useWorkItemFilters } from "@/hooks/use-workitem-filters";
import { 
  LayoutGrid, 
  List, 
  Filter,
  SortAsc,
  ViewIcon,
  Eye,
  BarChart3,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const subjectivitiesData = [
  { id: 'SUBJ-001', submission: 'S345821', type: 'Inspection', status: 'Pending', dueDate: '08/15/2025' },
  { id: 'SUBJ-002', submission: 'S489234', type: 'Documentation', status: 'Completed', dueDate: '09/20/2025' },
  { id: 'SUBJ-003', submission: 'S512345', type: 'Audit', status: 'Pending', dueDate: '09/10/2025' },
  { id: 'SUBJ-004', submission: 'S901234', type: 'Approval', status: 'Waived', dueDate: '08/01/2025' },
];

type ViewMode = 'grid' | 'table';

export function ProfessionalWorkbench() {
  const { toast } = useToast();
  
  // State management
  const [submissions, setSubmissions] = React.useState<Submission[]>(defaultSubmissions || []);
  const [workItems, setWorkItems] = React.useState<WorkItem[]>(defaultWorkItems || []);
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [selectedWorkItem, setSelectedWorkItem] = React.useState<WorkItem | null>(null);
  const [activeTab, setActiveTab] = React.useState("Dashboard");
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});

  // Work item filtering and updates
  const {
    filters = {},
    updateFilter = () => {},
    resetFilters = () => {},
    hasActiveFilters = false,
    getApiFilters = () => ({}),
  } = useWorkItemFilters() || {};

  const {
    newWorkItems = [],
    addNewWorkItem,
    acknowledgeNewWorkItem,
    clearNewWorkItems,
    connected = false,
    error,
  } = useWorkItemUpdates({
    enableNotifications: true,
    filters: getApiFilters(),
  }) || {};

  // Refresh functionality
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  // Handle new work items from polling
  React.useEffect(() => {
    if (newWorkItems && newWorkItems.length > 0) {
      newWorkItems.forEach(newItem => {
        addNewWorkItem(newItem);
        
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
          setSubmissions(prev => [newSubmission, ...prev]);
        }
        
        const workItem: WorkItem = {
          id: newItem.id,
          submission_id: newItem.submission_id,
          submission_ref: newItem.submission_ref,
          title: newItem.title || newItem.subject || 'New Work Item',
          description: newItem.description,
          status: newItem.status,
          priority: newItem.priority || 'Medium',
          assigned_to: newItem.assigned_to,
          risk_score: newItem.risk_score,
          risk_categories: newItem.risk_categories,
          industry: newItem.industry,
          company_size: newItem.company_size,
          policy_type: newItem.policy_type,
          coverage_amount: newItem.coverage_amount,
          last_risk_assessment: newItem.last_risk_assessment,
          comments_count: newItem.comments_count || 0,
          has_urgent_comments: newItem.has_urgent_comments || false,
          created_at: newItem.created_at,
          updated_at: newItem.updated_at,
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
  }, [newWorkItems, addNewWorkItem, acknowledgeNewWorkItem, submissions]);

  // Navigation handlers
  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleViewWorkItem = (workItem: WorkItem) => {
    setSelectedWorkItem(workItem);
  };

  const handleBackToWorkbench = () => {
    setSelectedSubmission(null);
    setSelectedWorkItem(null);
  };

  const handleSaveWorkItem = (workItem: WorkItem, workItemSubmission: Submission) => {
    const newSubmission: Submission = {
      id: workItemSubmission.id,
      taskPending: 'No',
      effectiveDate: workItemSubmission.effectiveDate,
      expiryDate: workItemSubmission.expiryDate,
      insuredName: workItemSubmission.insuredName,
      underwriter: workItemSubmission.underwriter,
      status: 'Processed',
      new: 'No',
      producer: workItemSubmission.producer,
      producerInternal: workItemSubmission.producerInternal,
      mfaEnforced: workItemSubmission.mfaEnforced,
    };

    setSubmissions(prev => {
      const existingIndex = prev.findIndex(s => s.id === newSubmission.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newSubmission;
        return updated;
      } else {
        return [newSubmission, ...prev];
      }
    });

    setWorkItems(prev => prev.filter(wi => wi.id !== workItem.id));

    toast({
      title: "Work Item Saved",
      description: `Work item ${workItem.id} has been saved as submission ${newSubmission.id}`,
      duration: 3000,
    });

    handleBackToWorkbench();
  };

  // Table columns
  const submissionColumns = getColumns(handleViewSubmission);
  const workItemColumns = getWorkItemColumns(handleViewWorkItem);

  // If viewing individual items
  if (selectedSubmission) {
    return (
      <div className="min-h-screen bg-background">
        <ProfessionalHeader currentPage="Submission Details" />
        <main className="container mx-auto px-6 py-6">
          <SubmissionDetails submission={selectedSubmission} onBack={handleBackToWorkbench} />
        </main>
      </div>
    );
  }

  if (selectedWorkItem) {
    let submissionForWorkItem = submissions.find(s => s.id === selectedWorkItem.submissionId);
    
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
      <div className="min-h-screen bg-background">
        <ProfessionalHeader currentPage="Work Item Details" />
        <main className="container mx-auto px-6 py-6">
          {submissionForWorkItem && (
            <WorkItemDetails 
              workItem={selectedWorkItem} 
              submission={submissionForWorkItem} 
              onBack={handleBackToWorkbench}
              onSave={handleSaveWorkItem}
            />
          )}
        </main>
      </div>
    );
  }

  // Main workbench view
  return (
    <div className="min-h-screen bg-background">
      <ProfessionalHeader 
        currentPage={activeTab}
        notificationCount={newWorkItems.length}
      />
      
      {/* Status Bar */}
      <div className="bg-muted/30 border-b px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">
                Real-time Updates: {connected ? 'Active' : 'Inactive'}
              </span>
            </div>
            {error && (
              <span className="text-orange-600 font-medium">Error: {error}</span>
            )}
          </div>
          <div className="text-muted-foreground">
            Work Items: {workItems.length} | New: {newWorkItems.length}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <WorkbenchTabs 
            onTasksClick={() => {}} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            workItemCount={workItems.length}
          />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'Dashboard' && (
            <div className="fade-in">
              <ProfessionalDashboard />
            </div>
          )}

          {activeTab === 'Work Items' && (
            <div className="space-y-4 fade-in">
              {/* View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>All Items</DropdownMenuItem>
                      <DropdownMenuItem>High Priority</DropdownMenuItem>
                      <DropdownMenuItem>Unassigned</DropdownMenuItem>
                      <DropdownMenuItem>Overdue</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="outline" size="sm">
                    <SortAsc className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'grid' ? (
                <WorkItemGrid 
                  workItems={workItems || []}
                  onViewItem={handleViewWorkItem}
                  onAssignItem={(item) => console.log('Assign:', item)}
                  isLoading={isRefreshing}
                />
              ) : (
                <DataTable
                  columns={workItemColumns}
                  data={workItems || []}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  setTable={() => {}}
                  onSummarize={() => {}}
                  isWorkItems={true}
                  filters={filters}
                  onFilterChange={updateFilter}
                  onResetFilters={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              )}
            </div>
          )}

          {(activeTab === 'My Submissions' || activeTab === 'All Submissions') && (
            <div className="fade-in">
              <DataTable
                columns={submissionColumns}
                data={submissions || []}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                setTable={() => {}}
                onSummarize={() => {}}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </div>
          )}

          {activeTab === 'Subjectivities' && (
            <div className="fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Subjectivities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table className="table-professional">
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
                      {(subjectivitiesData || []).map((subj) => (
                        <TableRow key={subj.id}>
                          <TableCell className="font-medium">{subj.id}</TableCell>
                          <TableCell>{subj.submission}</TableCell>
                          <TableCell>{subj.type}</TableCell>
                          <TableCell>
                            <Badge variant={subj.status === 'Completed' ? 'default' : 'secondary'}>
                              {subj.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{subj.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'Portfolio Management' && (
            <div className="fade-in">
              <PortfolioManagement />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}