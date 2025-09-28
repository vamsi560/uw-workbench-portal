"use client"

import { Row, Table } from "@tanstack/react-table"
import { RefreshCw, BarChart2, List, Settings2, FileText, Search, Filter, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSummarize: (selectedRows: Row<TData>[]) => void;
  isWorkItems?: boolean; // Flag to show work item specific filters
}

export function DataTableToolbar<TData>({
  table,
  onSummarize,
  isWorkItems = false,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
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

      {/* Work Items specific filters */}
      {isWorkItems && (
        <div className="flex items-center space-x-2 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search work items..."
              value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("type")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          
          <Select
            value={(table.getColumn("priority")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => 
              table.getColumn("priority")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="High">
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                  High
                </div>
              </SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => 
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
