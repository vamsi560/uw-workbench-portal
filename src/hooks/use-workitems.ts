import { useEffect, useRef, useState, useCallback } from "react";

export interface WorkItem {
  id: number; // Adjust type if your backend uses string
  // ...other fields
}

export function useWorkitems(pollIntervalMs = 60000) {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lastSeenIdRef = useRef<number | null>(null);
  // Use number for browser setTimeout
  const pollTimeout = useRef<number | null>(null);

  // Fetch initial 20 most recent work items
  const fetchInitial = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/workitems?limit=20");
    const data: WorkItem[] = await res.json();
    setWorkItems(data);
    if (data.length > 0) {
      lastSeenIdRef.current = data[0].id; // assuming descending order (newest first)
    }
    setLoading(false);
  }, []);

  // Poll for new work items since lastSeenId
  const pollNew = useCallback(async () => {
    if (!lastSeenIdRef.current) return;
    const res = await fetch(`/api/workitems?since_id=${lastSeenIdRef.current}`);
    const newItems: WorkItem[] = await res.json();
    if (newItems.length > 0) {
      setWorkItems((prev: WorkItem[]) => [...newItems, ...prev]);
      lastSeenIdRef.current = newItems[0].id;
    }
  }, []);

  // Polling effect
  useEffect(() => {
    fetchInitial();
    return () => {
      if (pollTimeout.current) clearTimeout(pollTimeout.current);
    };
  }, [fetchInitial]);

  useEffect(() => {
    if (!loading) {
      const poll = async () => {
        await pollNew();
        pollTimeout.current = setTimeout(poll, pollIntervalMs);
      };
      pollTimeout.current = setTimeout(poll, pollIntervalMs);
      return () => {
        if (pollTimeout.current) clearTimeout(pollTimeout.current);
      };
    }
  }, [loading, pollNew, pollIntervalMs]);

  return { workItems, loading };
}
