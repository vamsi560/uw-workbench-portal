import { useEffect, useRef, useState, useCallback } from "react";
import { WorkItem } from "@/lib/types";

export function useWorkitems(pollIntervalMs = 60000) {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lastSeenIdRef = useRef<string | null>(null);
  const pollTimeout = useRef<number | null>(null);
  const hasInitiallyFetchedRef = useRef(false);

  // Helper function to deduplicate work items by id
  const deduplicateWorkItems = useCallback((items: WorkItem[]): WorkItem[] => {
    const seen = new Set<string>();
    return items.filter(item => {
      const id = String(item.id);
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  }, []);

  // Fetch initial work items (only once)
  const fetchInitial = useCallback(async () => {
    if (hasInitiallyFetchedRef.current) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/workitems?limit=20");
      if (res.ok) {
        const data: WorkItem[] = await res.json();
        const dedupedData = deduplicateWorkItems(data);
        setWorkItems(dedupedData);
        if (dedupedData.length > 0) {
          lastSeenIdRef.current = String(dedupedData[0].id);
        }
        hasInitiallyFetchedRef.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch work items:', error);
    } finally {
      setLoading(false);
    }
  }, [deduplicateWorkItems]);

  // Poll for new work items since lastSeenId
  const pollNew = useCallback(async () => {
    if (!lastSeenIdRef.current || !hasInitiallyFetchedRef.current) return;
    
    try {
      const res = await fetch(`/api/workitems?since_id=${lastSeenIdRef.current}`);
      if (res.ok) {
        const newItems: WorkItem[] = await res.json();
        if (newItems.length > 0) {
          setWorkItems((prev: WorkItem[]) => {
            const combined = [...newItems, ...prev];
            return deduplicateWorkItems(combined);
          });
          lastSeenIdRef.current = String(newItems[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to poll for new work items:', error);
    }
  }, [deduplicateWorkItems]);

  // Initial fetch effect
  useEffect(() => {
    fetchInitial();
    return () => {
      if (pollTimeout.current) {
        clearTimeout(pollTimeout.current);
      }
    };
  }, [fetchInitial]);

  // Polling effect - only start after initial fetch is complete
  useEffect(() => {
    if (!loading && hasInitiallyFetchedRef.current) {
      const poll = async () => {
        await pollNew();
        pollTimeout.current = window.setTimeout(poll, pollIntervalMs);
      };
      pollTimeout.current = window.setTimeout(poll, pollIntervalMs);
      
      return () => {
        if (pollTimeout.current) {
          clearTimeout(pollTimeout.current);
        }
      };
    }
  }, [loading, pollNew, pollIntervalMs]);

  return { workItems, loading };
}
