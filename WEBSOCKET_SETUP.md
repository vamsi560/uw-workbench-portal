# Real-time Work Item Updates Setup

This document explains how to set up and use the real-time WebSocket functionality for work item updates in your UW Workbench Portal.

## Overview

The system provides real-time updates when new work items are created through your FastAPI backend. The frontend automatically connects to a WebSocket endpoint and receives notifications about new work items.

## Backend Requirements

Your FastAPI backend should implement the following:

### 1. WebSocket Endpoint

Add a WebSocket endpoint at `/ws/workitems` that:
- Accepts WebSocket connections
- Maintains a list of active connections
- Broadcasts new work item events to all connected clients

### 2. Event Broadcasting

After saving a new work item in your `/api/email/intake` endpoint, call a broadcast function:

```python
# Example FastAPI implementation
import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast_new_workitem(self, workitem: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json({
                    "event": "new_workitem",
                    "data": {
                        "id": workitem.get("id"),
                        "submission_id": workitem.get("submission_id"),
                        "submission_ref": workitem.get("submission_ref"),
                        "subject": workitem.get("subject"),
                        "from_email": workitem.get("from_email"),
                        "created_at": workitem.get("created_at"),
                        "status": workitem.get("status", "pending"),
                        "extracted_fields": workitem.get("extracted_fields", {})
                    }
                })
            except:
                # Remove dead connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

@app.websocket("/ws/workitems")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle any client messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# In your email intake endpoint
@app.post("/api/email/intake")
async def email_intake(email_data: dict):
    # Process email and create work item
    workitem = create_work_item(email_data)
    
    # Broadcast to all connected clients with the exact format
    await manager.broadcast_new_workitem({
        "id": workitem["id"],
        "submission_id": workitem["submission_id"],
        "submission_ref": workitem["submission_ref"],
        "subject": workitem["subject"],
        "from_email": workitem["from_email"],
        "created_at": workitem["created_at"],
        "status": workitem["status"],
        "extracted_fields": workitem.get("extracted_fields", {})
    })
    
    return {"status": "success", "workitem_id": workitem["id"]}
```

## Frontend Configuration

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_WEBSOCKET_URL=wss://uw-workbench-jade.vercel.app/ws/workitems
NEXT_PUBLIC_API_URL=https://uw-workbench-jade.vercel.app
```

Your backend is already deployed at [https://uw-workbench-jade.vercel.app/](https://uw-workbench-jade.vercel.app/) with the following endpoints:
- Health: `/health`
- Email Intake: `/api/email/intake`
- Submissions: `/api/submissions`
- Submission Detail: `/api/submissions/{submission_ref}`
- Confirm Submission: `/api/submissions/confirm/{submission_ref}`

### 2. WebSocket URL Configuration

The system automatically uses the configured WebSocket URL. For development, you can also use:

```env
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws/workitems
```

**Note**: Your backend is already configured and running at [https://uw-workbench-jade.vercel.app/](https://uw-workbench-jade.vercel.app/). The WebSocket endpoint should be available at `wss://uw-workbench-jade.vercel.app/ws/workitems` once implemented in your FastAPI backend.

## Features

### 1. Real-time Updates
- Automatically connects to WebSocket on page load
- Receives new work item notifications in real-time
- Updates the work items list automatically

### 2. Connection Status
- Shows connection status in the header (Live/Connecting/Offline)
- Automatic reconnection with exponential backoff
- Error handling and user notifications

### 3. Toast Notifications
- Shows toast notifications for new work items
- Displays work item details (subject, sender, status)
- Configurable notification settings

### 4. Error Handling
- Graceful handling of connection failures
- Automatic reconnection attempts
- User-friendly error messages

## Usage

### Basic Usage

The WebSocket functionality is automatically enabled when you use the `WorkbenchClient` component. No additional setup is required.

### Custom Configuration

You can customize the WebSocket behavior:

```typescript
const { websocket } = useWorkItemUpdates({
  websocketUrl: 'wss://custom-url.com/ws/workitems',
  enableNotifications: true,
  autoConnect: true,
});
```

### Manual Connection Control

```typescript
const { websocket } = useWorkItemUpdates({
  autoConnect: false, // Don't auto-connect
});

// Manually connect
websocket.connect();

// Manually disconnect
websocket.disconnect();
```

## Testing

### 1. Browser Console Testing

Use the provided WebSocket client example:

```javascript
// In browser console
const client = new WorkItemWebSocketClient('wss://your-vercel-app.vercel.app/ws/workitems');
client.connect();

// Custom message handler
client.handleNewWorkItem = function(data) {
  console.log('New work item:', data);
};
```

### 2. Manual Testing

1. Open your workbench in multiple browser tabs
2. Create a new work item through your backend API
3. Verify that all tabs receive the real-time update
4. Check the connection status indicator in the header

## Troubleshooting

### Connection Issues

1. **Check WebSocket URL**: Ensure the URL is correct and accessible
2. **CORS Issues**: Make sure your backend allows WebSocket connections from your domain
3. **Firewall**: Check if your network blocks WebSocket connections

### Development Issues

1. **Local Development**: Use `ws://localhost:8000/ws/workitems` for local testing
2. **HTTPS/WSS**: Production requires WSS (secure WebSocket) connections
3. **Environment Variables**: Ensure `.env.local` is properly configured

### Common Errors

- **"WebSocket connection failed"**: Check URL and network connectivity
- **"Max reconnection attempts reached"**: Check backend WebSocket endpoint
- **"Failed to parse message"**: Verify message format from backend

## Security Considerations

1. **Authentication**: Consider adding authentication to WebSocket connections
2. **Rate Limiting**: Implement rate limiting for WebSocket connections
3. **Message Validation**: Validate all incoming WebSocket messages
4. **CORS**: Configure proper CORS settings for your domain

## Performance

- **Connection Pooling**: The system handles multiple concurrent connections
- **Memory Management**: Dead connections are automatically cleaned up
- **Reconnection Logic**: Smart reconnection with exponential backoff
- **Message Batching**: Consider batching multiple updates if needed

## Monitoring

Monitor your WebSocket connections:

1. **Connection Count**: Track active connections
2. **Message Volume**: Monitor message throughput
3. **Error Rates**: Track connection failures and reconnections
4. **Performance**: Monitor message processing times
