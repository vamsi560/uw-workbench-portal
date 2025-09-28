import { useState, useCallback } from 'react';
import { PollingFilters } from './use-polling';

export interface WorkItemFilters extends PollingFilters {
  search: string;
  priority: string;
  status: string;
  assigned_to: string;
  industry: string;
}

export function useWorkItemFilters() {
  const [filters, setFilters] = useState<WorkItemFilters>({
    search: '',
    priority: '',
    status: '',
    assigned_to: '',
    industry: '',
  });

  const updateFilter = useCallback((key: keyof WorkItemFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      priority: '',
      status: '',
      assigned_to: '',
      industry: '',
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  // Convert filters to API parameters (remove empty values)
  const getApiFilters = useCallback((): PollingFilters => {
    const apiFilters: PollingFilters = {};
    if (filters.search) apiFilters.search = filters.search;
    if (filters.priority) apiFilters.priority = filters.priority;
    if (filters.status) apiFilters.status = filters.status;
    if (filters.assigned_to) apiFilters.assigned_to = filters.assigned_to;
    if (filters.industry) apiFilters.industry = filters.industry;
    return apiFilters;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters: hasActiveFilters(),
    getApiFilters,
  };
}