"use client";

import { useState, useCallback } from 'react';
import { useWebSocket } from './use-websocket';
import { WorkItem, NewWorkItemEvent, WorkItemUpdate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getWebSocketUrl } from '@/lib/config';
import { useSse } from './use-sse';

export interface UseWorkItemUpdatesOptions {
  websocketUrl?: string;
  enableNotifications?: boolean;
  autoConnect?: boolean;
}

export function useWorkItemUpdates(options: UseWorkItemUpdatesOptions = {}) {
  const {
    websocketUrl = getWebSocketUrl(),
    enableNotifications = true,
    autoConnect = false,
  } = options;

  const { toast } = useToast();
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [newWorkItems, setNewWorkItems] = useState<WorkItemUpdate[]>([]);

  const handleNewWorkItem = useCallback((event: NewWorkItemEvent) => {
    const workItemUpdate: WorkItemUpdate = {
      id: event.data.id.toString(),
      submission_id: event.data.submission_id,
      submission_ref: event.data.submission_ref,
      subject: event.data.subject,
      from_email: event.data.from_email,
      created_at: event.data.created_at,
      status: event.data.status,
      extracted_fields: event.data.extracted_fields,
      // Set default values for missing fields
      owner: 'System',
      type: 'New Submission',
      priority: 'Medium',
      gwpcStatus: 'Pending',
      indicated: false,
      automationStatus: 'Not Applicable',
      exposureStatus: 'New',
    };

    setNewWorkItems(prev => [workItemUpdate, ...prev]);

    if (enableNotifications) {
      toast({
        title: "New Work Item Created",
        description: `${event.data.subject} from ${event.data.from_email || 'Unknown'}`,
        duration: 5000,
      });
    }
  }, [enableNotifications, toast]);

  const handleWebSocketMessage = useCallback((event: any) => {
    if (event.event === 'new_workitem') {
      handleNewWorkItem(event as NewWorkItemEvent);
    }
  }, [handleNewWorkItem]);

  // SSE primary transport
  const handleSseMessage = useCallback((msg: any) => {
    if (msg?.event === 'new_workitem') {
      handleNewWorkItem(msg as NewWorkItemEvent);
    }
  }, [handleNewWorkItem]);

  const { connected: sseConnected } = useSse(handleSseMessage);

  const handleWebSocketError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
    if (enableNotifications) {
      toast({
        title: "Connection Error",
        description: "Lost connection to real-time updates. Attempting to reconnect...",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [enableNotifications, toast]);

  const handleWebSocketConnect = useCallback(() => {
    console.log('Connected to work item updates');
    if (enableNotifications) {
      toast({
        title: "Connected",
        description: "Real-time updates are now active",
        duration: 2000,
      });
    }
  }, [enableNotifications, toast]);

  const handleWebSocketDisconnect = useCallback(() => {
    console.log('Disconnected from work item updates');
  }, []);

  // Optional WebSocket fallback (kept disabled by default)
  const websocket = useWebSocket({
    url: websocketUrl,
    onMessage: handleWebSocketMessage,
    onConnect: handleWebSocketConnect,
    onDisconnect: handleWebSocketDisconnect,
    onError: handleWebSocketError,
    autoConnect,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  // Add new work item to the main work items list
  const addNewWorkItem = useCallback((workItem: WorkItemUpdate) => {
    const newWorkItem: WorkItem = {
      id: workItem.id,
      owner: workItem.owner || 'System',
      type: workItem.type || 'New Submission',
      priority: workItem.priority || 'Medium',
      gwpcStatus: workItem.gwpcStatus || 'Pending',
      status: workItem.status,
      indicated: workItem.indicated || false,
      automationStatus: workItem.automationStatus || 'Not Applicable',
      exposureStatus: workItem.exposureStatus || 'New',
      submissionId: workItem.submission_ref,
    };

    setWorkItems(prev => [newWorkItem, ...prev]);
  }, []);

  // Remove work item from new items list
  const acknowledgeNewWorkItem = useCallback((workItemId: string) => {
    setNewWorkItems(prev => prev.filter(item => item.id !== workItemId));
  }, []);

  // Clear all new work items
  const clearNewWorkItems = useCallback(() => {
    setNewWorkItems([]);
  }, []);

  return {
    workItems,
    newWorkItems,
    addNewWorkItem,
    acknowledgeNewWorkItem,
    clearNewWorkItems,
    // unified connection status prioritizing SSE
    connected: sseConnected || websocket.isConnected,
    websocket,
  };
}
