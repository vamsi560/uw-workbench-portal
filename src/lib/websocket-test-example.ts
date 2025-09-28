/**
 * Example of how to test WebSocket functionality
 * This can be used in browser console or as a standalone test
 */

import { WorkItemWebSocketClient } from './websocket-client-example';

// Example usage for testing
export function testWebSocketConnection() {
  // Using your actual backend URL
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://uw-workbench-jade.vercel.app/ws/workitems';
  
  const client = new WorkItemWebSocketClient(wsUrl);
  
  // Custom handlers for testing
  client.handleNewWorkItem = function(data) {
    console.log('🆕 Test: New work item received:', data);
    
    // Simulate adding to UI
    const container = document.getElementById('test-container');
    if (container) {
      const item = document.createElement('div');
      item.className = 'test-work-item p-2 border rounded mb-2';
      item.innerHTML = `
        <strong>${data.subject}</strong><br>
        <small>From: ${data.from_email || 'Unknown'} | Status: ${data.status}</small>
      `;
      container.appendChild(item);
    }
  };
  
  client.onConnect = function() {
    console.log('✅ Test: Connected to WebSocket');
    // Send a test message
    client.sendMessage({ type: 'test', message: 'Hello from test client' });
  };
  
  client.onDisconnect = function() {
    console.log('❌ Test: Disconnected from WebSocket');
  };
  
  client.onError = function(error) {
    console.error('❌ Test: WebSocket error:', error);
  };
  
  // Connect
  client.connect();
  
  return client;
}

// Example of simulating a new work item (for testing purposes)
export function simulateNewWorkItem() {
  const mockWorkItem = {
    event: 'new_workitem',
    data: {
      id: Math.floor(Math.random() * 10000),
      submission_id: Math.floor(Math.random() * 1000),
      submission_ref: `S${Math.floor(Math.random() * 100000)}`,
      subject: 'Test Insurance Policy Submission',
      from_email: 'test@example.com',
      created_at: new Date().toISOString(),
      status: 'pending',
      extracted_fields: {
        policy_type: 'Cyber Insurance',
        coverage_amount: '$1,000,000',
        company_name: 'Test Company Inc.',
        broker_name: 'John Doe'
      }
    }
  };
  
  // This would normally come from your backend
  console.log('Simulating new work item:', mockWorkItem);
  return mockWorkItem;
}

// Browser console usage:
// const client = testWebSocketConnection();
// simulateNewWorkItem();
