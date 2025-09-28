import { useEffect, useRef, useState, useCallback } from 'react';
import { getPollUrl } from '@/lib/config';

export function usePolling(onNewItems: (items: any[]) => void, interval = 5000) {
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
  }, [onNewItems]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling
    
    console.log('Starting polling with interval:', interval);
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