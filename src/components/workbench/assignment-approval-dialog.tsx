"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WorkItem, Submission } from "@/lib/types";

interface AssignmentApprovalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workItem: WorkItem;
  submission: Submission;
  underwriter: string;
  onApprove: () => void;
  onCancel: () => void;
}

export function AssignmentApprovalDialog({
  isOpen,
  onOpenChange,
  workItem,
  submission,
  underwriter,
  onApprove,
  onCancel,
}: AssignmentApprovalDialogProps) {
  const handleApprove = () => {
    onApprove();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md" style={{color: 'rgb(15, 23, 42) !important'}}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-slate-100">Approve Assignment & Create Submission</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3" style={{color: 'rgb(71, 85, 105) !important'}}>
              <p>
                You are about to assign this work item to <strong>{underwriter}</strong> and create a new submission.
              </p>
              
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Work Item:</span>
                    <div className="font-medium">#{workItem.id}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Insured:</span>
                    <div className="font-medium">{submission.insuredName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <div className="font-medium">{workItem.priority}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <div className="font-medium">{workItem.type}</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                This action will:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Assign the work item to {underwriter}</li>
                <li>Create a new submission record</li>
                <li>Move the item from Work Items to My Submissions</li>
                <li>Send notification to the assigned underwriter</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove} className="bg-blue-600 hover:bg-blue-700 text-white">
            Yes, Approve Assignment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}