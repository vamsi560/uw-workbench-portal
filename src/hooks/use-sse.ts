"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSseUrl } from '@/lib/config';

export type SseMessage = any;

export function useSse(onMessage?: (msg: SseMessage) => void) {
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = useCallback(() => {
    const url = getSseUrl();
    if (!url) return;

    // Close existing connection
    if (esRef.current) {
      esRef.current.close();
    }

    console.log(`Connecting to SSE: ${url} (attempt ${reconnectAttempts + 1})`);
    const es = new EventSource(url, { withCredentials: false });
    esRef.current = es;

    es.onopen = () => {
      console.log('SSE connected');
      setConnected(true);
      setReconnectAttempts(0);
    };

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        console.log('SSE message received:', msg);
        onMessage?.(msg);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    es.onerror = (error) => {
      console.error('SSE error:', error);
      setConnected(false);
      
      // Implement reconnection with exponential backoff
      if (reconnectAttempts < maxReconnectAttempts) {
        const delay = reconnectDelay * Math.pow(2, reconnectAttempts);
        console.log(`Reconnecting in ${delay}ms...`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1);
          connect();
        }, delay);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };
  }, [onMessage, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    
    setConnected(false);
    setReconnectAttempts(0);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { 
    connected, 
    reconnectAttempts, 
    connect, 
    disconnect 
  };
}


