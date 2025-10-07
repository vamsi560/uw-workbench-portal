'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { 
  Search,
  Filter,
  Download,
  Upload,
  Users,
  MoreHorizontal,
  ChevronDown,
  Building2,
  DollarSign,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  RefreshCw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useWorkQueueData } from '@/hooks/use-work-queue-data'
import { WorkItemCard } from './work-item-card'
import { WorkQueueSkeleton } from './work-queue-skeleton'

interface WorkItem {
  id: string
  company_name: string
  submission_reference: string
  industry: string
  risk_score: number
  coverage_amount: number
  policy_type: string
  days_since_submission: number
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'In Review' | 'Awaiting Info' | 'Ready to Quote' | 'Approved' | 'Declined'
  underwriter_assigned?: string
  submission_date: string
  sla_status: 'on_track' | 'at_risk' | 'breached'
}

interface WorkQueueManagementProps {
  underwriterId?: string
}

export function WorkQueueManagement({ underwriterId = 'john.doe@company.com' }: WorkQueueManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
    industry: [] as string[],
    riskScoreRange: [0, 100] as [number, number],
    coverageAmountRange: [0, 10000000] as [number, number],
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined
    }
  })
  const [sortBy, setSortBy] = useState('days_since_submission')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, error, refetch } = useWorkQueueData(underwriterId)

  const filteredAndSortedData = data ? applyFiltersAndSort(data, filters, searchTerm, sortBy, sortOrder) : []

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => 
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredAndSortedData.map(item => item.id) : [])
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems)
    // Implement bulk actions here
  }

  const exportToCSV = () => {
    const csvData = filteredAndSortedData.map(item => ({
      'Company Name': item.company_name,
      'Reference': item.submission_reference,
      'Industry': item.industry,
      'Risk Score': item.risk_score,
      'Coverage Amount': item.coverage_amount,
      'Priority': item.priority,
      'Status': item.status,
      'Days Pending': item.days_since_submission
    }))
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'work-queue-export.csv'
    a.click()
  }

  if (isLoading && !data) {
    return <WorkQueueSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load work queue</h3>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <Button onClick={refetch}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Work Queue Management</h1>
            <p className="text-gray-600 mt-1">
              Advanced filtering and management for your work items
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Search & Filters</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by company name, reference, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days_since_submission">Days Pending</SelectItem>
                    <SelectItem value="risk_score">Risk Score</SelectItem>
                    <SelectItem value="coverage_amount">Coverage Amount</SelectItem>
                    <SelectItem value="company_name">Company Name</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  {/* Priority Filter */}
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="space-y-2 mt-2">
                      {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority}`}
                            checked={filters.priority.includes(priority)}
                            onCheckedChange={(checked) => {
                              const newPriorities = checked
                                ? [...filters.priority, priority]
                                : filters.priority.filter(p => p !== priority)
                              handleFilterChange('priority', newPriorities)
                            }}
                          />
                          <Label htmlFor={`priority-${priority}`} className="text-sm">
                            {priority}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="space-y-2 mt-2">
                      {['Pending', 'In Review', 'Awaiting Info', 'Ready to Quote', 'Approved', 'Declined'].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => {
                              const newStatuses = checked
                                ? [...filters.status, status]
                                : filters.status.filter(s => s !== status)
                              handleFilterChange('status', newStatuses)
                            }}
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Score Range */}
                  <div>
                    <Label className="text-sm font-medium">Risk Score Range</Label>
                    <div className="mt-2">
                      <Slider
                        value={filters.riskScoreRange}
                        onValueChange={(value) => handleFilterChange('riskScoreRange', value)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{filters.riskScoreRange[0]}</span>
                        <span>{filters.riskScoreRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Amount Range */}
                  <div>
                    <Label className="text-sm font-medium">Coverage Amount Range</Label>
                    <div className="mt-2">
                      <Slider
                        value={filters.coverageAmountRange}
                        onValueChange={(value) => handleFilterChange('coverageAmountRange', value)}
                        max={10000000}
                        step={100000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${(filters.coverageAmountRange[0] / 1000000).toFixed(1)}M</span>
                        <span>${(filters.coverageAmountRange[1] / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} item(s) selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select onValueChange={handleBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Bulk Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assign">Assign to Underwriter</SelectItem>
                        <SelectItem value="update_status">Update Status</SelectItem>
                        <SelectItem value="export">Export Selected</SelectItem>
                        <SelectItem value="archive">Archive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItems([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Work Items Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Work Items ({filteredAndSortedData.length})
              </h2>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedItems.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm">
                  Select All
                </Label>
              </div>
            </div>

            {filteredAndSortedData.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No work items found matching your criteria</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedData.map((item) => (
                  <div key={item.id} className="relative">
                    <Checkbox
                      className="absolute top-3 left-3 z-10"
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                    <WorkItemCard item={item} variant="pending_review" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to apply filters and sorting
function applyFiltersAndSort(
  data: WorkItem[],
  filters: any,
  searchTerm: string,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): WorkItem[] {
  let filtered = data

  // Search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase()
    filtered = filtered.filter(item =>
      item.company_name.toLowerCase().includes(search) ||
      item.submission_reference.toLowerCase().includes(search) ||
      item.industry.toLowerCase().includes(search)
    )
  }

  // Priority filter
  if (filters.priority.length > 0) {
    filtered = filtered.filter(item => filters.priority.includes(item.priority))
  }

  // Status filter
  if (filters.status.length > 0) {
    filtered = filtered.filter(item => filters.status.includes(item.status))
  }

  // Risk score range filter
  filtered = filtered.filter(item =>
    item.risk_score >= filters.riskScoreRange[0] &&
    item.risk_score <= filters.riskScoreRange[1]
  )

  // Coverage amount range filter
  filtered = filtered.filter(item =>
    item.coverage_amount >= filters.coverageAmountRange[0] &&
    item.coverage_amount <= filters.coverageAmountRange[1]
  )

  // Date range filter
  if (filters.dateRange.from && filters.dateRange.to) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.submission_date)
      return itemDate >= filters.dateRange.from! && itemDate <= filters.dateRange.to!
    })
  }

  // Sorting
  filtered.sort((a, b) => {
    let aValue: any = a[sortBy as keyof WorkItem]
    let bValue: any = b[sortBy as keyof WorkItem]

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return filtered
}
