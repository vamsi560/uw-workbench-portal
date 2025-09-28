"use client"

import { Row, Table } from "@tanstack/react-table"
import { RefreshCw, BarChart2, List, Settings2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSummarize: (selectedRows: Row<TData>[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  onSummarize,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
        </Button>
        {selectedRows.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => onSummarize(selectedRows)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Summarize ({selectedRows.length})
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
            <BarChart2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
            <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
            <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
