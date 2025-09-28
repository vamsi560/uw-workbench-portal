# SSE Backend Implementation Guide

## Problem
Your SSE endpoint is timing out after 5 minutes (300 seconds) on Vercel. This is because Vercel has a 5-minute timeout for serverless functions.

## Solution
Implement a proper SSE endpoint that works within Vercel's constraints.

## Backend Implementation

### 1. FastAPI SSE Endpoint

```python
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import asyncio
import json
import time
from typing import Dict, Set
import uuid

app = FastAPI()

# Store active connections
active_connections: Set[str] = set()

@app.get("/sse/workitems")
async def sse_workitems(request: Request):
    """SSE endpoint for work item updates"""
    
    async def event_generator():
        # Generate a unique connection ID
        connection_id = str(uuid.uuid4())
        active_connections.add(connection_id)
        
        try:
            # Send initial connection message
            yield f"data: {json.dumps({'event': 'connected', 'connection_id': connection_id})}\n\n"
            
            # Keep connection alive with heartbeat
            heartbeat_interval = 30  # Send heartbeat every 30 seconds
            last_heartbeat = time.time()
            
            while True:
                # Check if client disconnected
                if await request.is_disconnected():
                    break
                
                # Send heartbeat to keep connection alive
                current_time = time.time()
                if current_time - last_heartbeat >= heartbeat_interval:
                    yield f"data: {json.dumps({'event': 'heartbeat', 'timestamp': current_time})}\n\n"
                    last_heartbeat = current_time
                
                # Small delay to prevent excessive CPU usage
                await asyncio.sleep(1)
                
        except asyncio.CancelledError:
            # Client disconnected
            pass
        finally:
            # Clean up connection
            active_connections.discard(connection_id)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
        }
    )

# Function to broadcast new work items
async def broadcast_new_workitem(workitem_data: dict):
    """Broadcast new work item to all connected clients"""
    message = {
        "event": "new_workitem",
        "data": workitem_data
    }
    
    # In a real implementation, you'd use a message queue or pub/sub
    # For now, we'll just log it
    print(f"Broadcasting new work item: {message}")

# Your existing email intake endpoint
@app.post("/api/email/intake")
async def email_intake(email_data: dict):
    # Process email and create work item
    workitem = create_work_item(email_data)
    
    # Broadcast to all connected clients
    await broadcast_new_workitem({
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

### 2. Alternative: Use Redis for Real-time Broadcasting

If you want to implement proper broadcasting, use Redis:

```python
import redis
import asyncio
import json

# Redis client
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/sse/workitems")
async def sse_workitems(request: Request):
    """SSE endpoint with Redis pub/sub"""
    
    async def event_generator():
        # Create a unique channel for this connection
        channel = f"workitems:{uuid.uuid4()}"
        
        # Subscribe to work item updates
        pubsub = redis_client.pubsub()
        pubsub.subscribe("workitems_updates")
        
        try:
            # Send initial connection message
            yield f"data: {json.dumps({'event': 'connected'})}\n\n"
            
            # Listen for messages
            for message in pubsub.listen():
                if message['type'] == 'message':
                    yield f"data: {message['data'].decode('utf-8')}\n\n"
                    
        except asyncio.CancelledError:
            pass
        finally:
            pubsub.close()
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )

# Function to broadcast new work items via Redis
async def broadcast_new_workitem(workitem_data: dict):
    """Broadcast new work item via Redis"""
    message = {
        "event": "new_workitem",
        "data": workitem_data
    }
    
    # Publish to Redis channel
    redis_client.publish("workitems_updates", json.dumps(message))
```

### 3. Vercel Configuration

Create `vercel.json` in your backend:

```json
{
  "functions": {
    "app.py": {
      "maxDuration": 300
    }
  },
  "routes": [
    {
      "src": "/sse/workitems",
      "dest": "/app.py"
    }
  ]
}
```

## Testing

### 1. Test SSE Connection
- Open the "SSE Test" tab in your frontend
- Check if connection shows "Connected"
- Look for heartbeat messages in the console

### 2. Test Work Item Creation
- Use your backend test endpoint to create a work item
- Verify the frontend receives the real-time update

### 3. Monitor Backend Logs
- Check Vercel logs for connection status
- Look for timeout errors
- Monitor memory usage

## Troubleshooting

### Connection Issues
1. **CORS**: Ensure your backend allows SSE connections
2. **Headers**: Check that proper SSE headers are set
3. **Network**: Verify the URL is accessible

### Timeout Issues
1. **Heartbeat**: Implement regular heartbeat messages
2. **Client Reconnection**: Use the updated SSE hook with reconnection
3. **Connection Pooling**: Consider using Redis for better scalability

### Performance
1. **Connection Limits**: Monitor active connections
2. **Memory Usage**: Clean up disconnected connections
3. **Message Queue**: Use Redis or similar for production

## Frontend Changes Made

1. **Enhanced SSE Hook**: Added reconnection logic with exponential backoff
2. **SSE Test Component**: Added debugging interface
3. **Connection Status**: Shows real-time connection status in header
4. **Error Handling**: Better error handling and logging

The frontend is now ready to handle SSE connections with automatic reconnection and better error handling.
