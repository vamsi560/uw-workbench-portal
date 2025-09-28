import { useEffect, useRef, useState, useCallback } from 'react';
import { getPollUrl } from '@/lib/config';

export interface PollingFilters {
  search?: string;
  priority?: string;
  status?: string;
  assigned_to?: string;
  industry?: string;
}

export function usePolling(
  onNewItems: (items: any[]) => void, 
  interval = 5000,
  filters?: PollingFilters
) {
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPollTime = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    try {
      const url = new URL(getPollUrl());
      if (lastPollTime.current) {
        url.searchParams.set('since', lastPollTime.current);
      }
      
      // Add filter parameters
      if (filters?.search) url.searchParams.set('search', filters.search);
      if (filters?.priority) url.searchParams.set('priority', filters.priority);
      if (filters?.status) url.searchParams.set('status', filters.status);
      if (filters?.assigned_to) url.searchParams.set('assigned_to', filters.assigned_to);
      if (filters?.industry) url.searchParams.set('industry', filters.industry);

      console.log('Polling URL:', url.toString());
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Poll response:', data);
      
      if (data.items && data.items.length > 0) {
        console.log(`Received ${data.items.length} new items`);
        onNewItems(data.items);
      }
      
      // Update last poll time to current server timestamp
      lastPollTime.current = data.timestamp;
      setError(null); // Clear any previous errors
      
    } catch (error) {
      console.error('Polling error:', error);
      setError(error instanceof Error ? error.message : 'Unknown polling error');
    }
  }, [onNewItems, filters]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling
    
    console.log('Starting polling with interval:', interval, 'filters:', filters);
    setIsPolling(true);
    setError(null);
    
    // Poll immediately, then at intervals
    poll();
    intervalRef.current = setInterval(poll, interval);
  }, [poll, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    console.log('Stopped polling');
  }, []);

  useEffect(() => {
    startPolling();
    return stopPolling;
  }, [startPolling, stopPolling]);

  return { 
    isPolling, 
    startPolling, 
    stopPolling, 
    error,
    lastPollTime: lastPollTime.current 
  };
}