"use client";

import { useEffect, useRef, useState } from 'react';
import { getSseUrl } from '@/lib/config';

export type SseMessage = any;

export function useSse(onMessage?: (msg: SseMessage) => void) {
  const esRef = useRef<EventSource | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = getSseUrl();
    if (!url) return;

    const es = new EventSource(url, { withCredentials: false });
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        onMessage?.(msg);
      } catch {
        // ignore malformed messages
      }
    };
    es.onerror = () => {
      setConnected(false);
      // Let browser auto-retry; optionally implement custom backoff
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [onMessage]);

  return { connected };
}


