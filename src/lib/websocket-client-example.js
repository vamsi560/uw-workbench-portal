/**
 * Sample JavaScript WebSocket client for testing real-time work item updates
 * 
 * This is a standalone example that can be used to test your WebSocket endpoint
 * without the React frontend. You can run this in a browser console or Node.js.
 */

class WorkItemWebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.shouldReconnect = true;
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('Already connected');
      return;
    }

    console.log(`Connecting to ${this.url}...`);
    
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('✅ Connected to WebSocket');
        this.reconnectAttempts = 0;
        this.onConnect();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Received message:', message);
          this.onMessage(message);
        } catch (error) {
          console.error('❌ Failed to parse message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        this.onDisconnect();

        if (this.shouldReconnect && event.code !== 1000) {
          this.attemptReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.onError(error);
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.socket) {
      this.socket.close(1000, 'Manual disconnect');
      this.socket = null;
    }
    console.log('🔌 Manually disconnected');
  }

  sendMessage(message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      console.log('📤 Sent message:', message);
      return true;
    } else {
      console.log('❌ Cannot send message - not connected');
      return false;
    }
  }

  // Event handlers - override these in your implementation
  onConnect() {
    console.log('🎉 WebSocket connected successfully');
  }

  onMessage(message) {
    if (message.event === 'new_workitem') {
      console.log('🆕 New work item received:', message.data);
      this.handleNewWorkItem(message.data);
    } else {
      console.log('📋 Other message received:', message);
    }
  }

  onDisconnect() {
    console.log('🔌 WebSocket disconnected');
  }

  onError(error) {
    console.error('❌ WebSocket error occurred:', error);
  }

  handleNewWorkItem(data) {
    console.log('🆕 New Work Item Details:');
    console.log(`  ID: ${data.id}`);
    console.log(`  Submission ID: ${data.submission_id}`);
    console.log(`  Subject: ${data.subject}`);
    console.log(`  From: ${data.from_email || 'Unknown'}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  Created: ${data.created_at}`);
    console.log(`  Submission Ref: ${data.submission_ref}`);
    if (data.extracted_fields) {
      console.log(`  Extracted Fields:`, data.extracted_fields);
    }
    
    // Here you would typically update your UI
    // For example, add to a list, show notification, etc.
    this.updateUI(data);
  }

  updateUI(workItem) {
    // Example: Add to a list in the DOM
    const container = document.getElementById('work-items-list');
    if (container) {
      const item = document.createElement('div');
      item.className = 'work-item';
      item.innerHTML = `
        <h3>${workItem.subject}</h3>
        <p>From: ${workItem.from_email || 'Unknown'}</p>
        <p>Status: ${workItem.status}</p>
        <p>Created: ${new Date(workItem.created_at).toLocaleString()}</p>
        <p>ID: ${workItem.id} | Submission ID: ${workItem.submission_id}</p>
        ${workItem.extracted_fields ? `<p>Extracted Fields: ${Object.keys(workItem.extracted_fields).length} fields</p>` : ''}
      `;
      container.insertBefore(item, container.firstChild);
    }
  }
}

// Usage example:
// const client = new WorkItemWebSocketClient('wss://uw-workbench-jade.vercel.app/ws/workitems');
// client.connect();

// Example of handling new work items
// client.handleNewWorkItem = function(data) {
//   console.log('Custom handler for new work item:', data);
//   // Your custom logic here
// };

export default WorkItemWebSocketClient;
