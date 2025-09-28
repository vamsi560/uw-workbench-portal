"use client";

import { Row } from "@tanstack/react-table";
import { FileCheck, Mail, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Submission } from "@/lib/types";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const submission = row.original as Submission;

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <FileCheck className="h-4 w-4" />
        <span className="sr-only">Approve</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Mail className="h-4 w-4" />
        <span className="sr-only">Email</span>
      </Button>
    </div>
  );
}
