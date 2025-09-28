"use client";

import * as React from "react";
import { Table as TanstackTable, Row } from "@tanstack/react-table";
import { submissions as defaultSubmissions, workItems as defaultWorkItems } from "@/lib/data";
import { Submission, WorkItem } from "@/lib/types";
import { DataTable } from "@/components/workbench/data-table";
import { getColumns, getWorkItemColumns } from "@/components/workbench/columns";
import { WorkbenchTabs } from "@/components/workbench/workbench-tabs";
import { AddTaskSheet } from "@/components/workbench/add-task-sheet";
import { SubmissionDetails } from "@/components/workbench/submission-details";
import { WorkItemDetails } from "@/components/workbench/work-item-details";
import { PortfolioManagement } from "@/components/workbench/portfolio-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { summarizeSelectedRows } from "@/ai/flows/summarize-selected-rows";
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
import { Dashboard } from "./dashboard";

const subjectivitiesData = [
  { id: 'SUBJ-001', submission: 'S345821', type: 'Inspection', status: 'Pending', dueDate: '08/15/2025' },
  { id: 'SUBJ-002', submission: 'S489234', type: 'Documentation', status: 'Completed', dueDate: '09/20/2025' },
  { id: 'SUBJ-003', submission: 'S512345', type: 'Audit', status: 'Pending', dueDate: '09/10/2025' },
  { id: 'SUBJ-004', submission: 'S901234', type: 'Approval', status: 'Waived', dueDate: '08/01/2025' },
];

export function WorkbenchClient() {
  const { toast } = useToast();
  const [submissions] = React.useState<Submission[]>(defaultSubmissions);
  const [workItems] = React.useState<WorkItem[]>(defaultWorkItems);
  const [rowSelection, setRowSelection] = React.useState({});
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [selectedWorkItem, setSelectedWorkItem] = React.useState<WorkItem | null>(null);
  const [activeTab, setActiveTab] = React.useState("My Submissions");
  const [summary, setSummary] = React.useState<string>('');
  const [isSummarizing, setIsSummarizing] = React.useState<boolean>(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = React.useState<boolean>(false);

  
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
      const result = await summarizeSelectedRows({ rows: dataToSummarize });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error summarizing rows:", error);
      toast({
        title: "Summarization Failed",
        description: "An error occurred while summarizing the selected rows.",
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
    const submissionForWorkItem = submissions.find(s => s.id === selectedWorkItem.submissionId);
    return (
      <main>
        {submissionForWorkItem && <WorkItemDetails workItem={selectedWorkItem} submission={submissionForWorkItem} onBack={handleBackToWorkbench} />}
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
        <WorkbenchTabs onTasksClick={() => setIsSheetOpen(true)} activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'My Submissions' && (
          <DataTable
            columns={submissionColumns}
            data={submissions}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            setTable={(t) => (tableRef = t)}
            onSummarize={handleSummarize}
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
                  <div className="mt-4 max-h-80 overflow-y-auto text-sm text-foreground whitespace-pre-wrap">
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
