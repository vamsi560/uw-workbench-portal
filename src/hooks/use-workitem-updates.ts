"use client";

import { useState, useCallback } from 'react';
import { WorkItem, NewWorkItemEvent, WorkItemUpdate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { usePolling, PollingFilters } from './use-polling';
import { config } from '@/lib/config';

export interface UseWorkItemUpdatesOptions {
  enableNotifications?: boolean;
  filters?: PollingFilters;
}

export function useWorkItemUpdates(options: UseWorkItemUpdatesOptions = {}) {
  const {
    enableNotifications = true,
    filters,
  } = options;

  const { toast } = useToast();
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [newWorkItems, setNewWorkItems] = useState<WorkItemUpdate[]>([]);

  const handleNewWorkItem = useCallback((event: NewWorkItemEvent | any) => {
    // Handle both legacy and new backend formats
    const data = event.data || event;
    
    const workItemUpdate: WorkItemUpdate = {
      id: data.id?.toString() || data.submission_id?.toString(),
      submission_id: data.submission_id,
      submission_ref: data.submission_ref,
      subject: data.subject || data.title,
      from_email: data.from_email,
      created_at: data.created_at,
      status: data.status,
      extracted_fields: data.extracted_fields,
      
      // Enhanced fields from new backend
      title: data.title,
      description: data.description,
      priority: data.priority,
      assigned_to: data.assigned_to,
      risk_score: data.risk_score,
      risk_categories: data.risk_categories,
      industry: data.industry,
      company_size: data.company_size,
      policy_type: data.policy_type,
      coverage_amount: data.coverage_amount,
      last_risk_assessment: data.last_risk_assessment,
      comments_count: data.comments_count,
      has_urgent_comments: data.has_urgent_comments,
      updated_at: data.updated_at,
      
      // Legacy fields with defaults
      owner: data.owner || 'System',
      type: data.type || 'New Submission',
      gwpcStatus: data.gwpcStatus || 'Pending',
      indicated: data.indicated || false,
      automationStatus: data.automationStatus || 'Not Applicable',
      exposureStatus: data.exposureStatus || 'New',
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

  // Polling primary transport
  const handleNewItems = useCallback((items: any[]) => {
    items.forEach((item) => {
      // Convert polling response to our expected format
      const event: NewWorkItemEvent = {
        event: 'new_workitem',
        data: {
          id: item.id || item.submission_id,
          submission_id: item.submission_id,
          submission_ref: item.submission_ref,
          subject: item.subject,
          from_email: item.from_email,
          created_at: item.created_at,
          status: item.status,
          extracted_fields: item.extracted_fields || {},
        }
      };
      handleNewWorkItem(event);
    });
  }, [handleNewWorkItem]);

  const { isPolling, error } = usePolling(handleNewItems, config.polling.intervalMs, filters);

  // Helper functions to determine work item properties from extracted data
  const determineWorkItemType = useCallback((extractedFields?: Record<string, any>) => {
    if (!extractedFields) return 'Email Review';
    
    const policyType = extractedFields.policy_type?.toLowerCase() || '';
    if (policyType.includes('cyber')) return 'Cyber Exposure Review';
    if (policyType.includes('liability')) return 'Liability Assessment';
    if (policyType.includes('property')) return 'Property Evaluation';
    return 'Policy Review';
  }, []);

  const determinePriority = useCallback((extractedFields?: Record<string, any>) => {
    if (!extractedFields) return 'Medium';
    
    const coverageAmount = extractedFields.coverage_amount || '';
    if (coverageAmount.toLowerCase().includes('high') || coverageAmount.includes('1,000,000')) return 'High';
    if (coverageAmount.toLowerCase().includes('medium') || coverageAmount.includes('500,000')) return 'Medium';
    return 'Low';
  }, []);

  // Add new work item to the main work items list
  const addNewWorkItem = useCallback((workItem: WorkItemUpdate) => {
    const newWorkItem: WorkItem = {
      // Core identifiers
      id: workItem.id,
      submission_id: workItem.submission_id,
      submission_ref: workItem.submission_ref,
      
      // Basic work item data
      title: workItem.title || workItem.subject || 'New Work Item',
      description: workItem.description,
      status: workItem.status,
      priority: workItem.priority || determinePriority(workItem.extracted_fields),
      assigned_to: workItem.assigned_to,
      
      // Cyber insurance specific fields
      risk_score: workItem.risk_score,
      risk_categories: workItem.risk_categories,
      industry: workItem.industry,
      company_size: workItem.company_size,
      policy_type: workItem.policy_type,
      coverage_amount: workItem.coverage_amount,
      last_risk_assessment: workItem.last_risk_assessment,
      
      // Collaboration data
      comments_count: workItem.comments_count || 0,
      has_urgent_comments: workItem.has_urgent_comments || false,
      
      // Timestamps
      created_at: workItem.created_at,
      updated_at: workItem.updated_at,
      
      // Legacy fields for backward compatibility
      owner: workItem.owner || 'System Generated',
      type: workItem.type || determineWorkItemType(workItem.extracted_fields),
      gwpcStatus: workItem.gwpcStatus || 'Pending Review',
      indicated: workItem.indicated || false,
      automationStatus: workItem.automationStatus || 'Automated',
      exposureStatus: workItem.exposureStatus || 'New Exposure',
      submissionId: workItem.submission_ref,
      extractedFields: workItem.extracted_fields,
    };

    setWorkItems(prev => [newWorkItem, ...prev]);
  }, [determineWorkItemType, determinePriority]);

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
    connected: isPolling,
    error,
  };
}
