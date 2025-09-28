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
import { WorkItemFilters } from "@/hooks/use-workitem-filters"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSummarize: (selectedRows: Row<TData>[]) => void;
  isWorkItems?: boolean;
  // New props for API-based filtering
  filters?: WorkItemFilters;
  onFilterChange?: (key: keyof WorkItemFilters, value: string) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  // New refresh functionality
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  onSummarize,
  isWorkItems = false,
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters = false,
  onRefresh,
  isRefreshing = false,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh data"
          >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
      {isWorkItems && filters && onFilterChange && (
        <div className="flex items-center space-x-2 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search work items..."
              value={filters.search}
              onChange={(event) => onFilterChange('search', event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          
          <Select
            value={filters.priority || "all"}
            onValueChange={(value) => onFilterChange('priority', value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Critical">
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-red-600 mr-1" />
                  Critical
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 text-red-500 mr-1" />
                  High
                </div>
              </SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) => onFilterChange('status', value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.industry || "all"}
            onValueChange={(value) => onFilterChange('industry', value === "all" ? "" : value)}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Financial Services">Financial</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && onResetFilters && (
            <Button
              variant="ghost"
              onClick={onResetFilters}
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
