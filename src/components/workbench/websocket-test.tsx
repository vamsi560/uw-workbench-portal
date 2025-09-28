"use client";

import { useState } from 'react';
import { useWorkItemUpdates } from '@/hooks/use-workitem-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function WebSocketTest() {
  const { websocket, newWorkItems, clearNewWorkItems } = useWorkItemUpdates({
    enableNotifications: true,
    autoConnect: true,
  });

  const [testMessage, setTestMessage] = useState('');

  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      websocket.sendMessage({ type: 'test', message: testMessage });
      setTestMessage('');
    }
  };

  const handleReconnect = () => {
    websocket.disconnect();
    setTimeout(() => {
      websocket.connect();
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>WebSocket Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Badge 
              variant={websocket.isConnected ? "default" : websocket.isConnecting ? "secondary" : "destructive"}
              className="flex items-center space-x-1"
            >
              {websocket.isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Connected</span>
                </>
              ) : websocket.isConnecting ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Connecting</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Disconnected</span>
                </>
              )}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconnect}
              disabled={websocket.isConnecting}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reconnect
            </Button>
          </div>

          {websocket.error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              Error: {websocket.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Test Message</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message..."
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
              />
              <Button
                onClick={handleSendTestMessage}
                disabled={!websocket.isConnected || !testMessage.trim()}
                size="sm"
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {newWorkItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>New Work Items ({newWorkItems.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearNewWorkItems}
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {newWorkItems.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg bg-blue-50">
                  <div className="font-medium">{item.subject}</div>
                  <div className="text-sm text-gray-600">
                    From: {item.from_email || 'Unknown'} | 
                    Status: {item.status} | 
                    Created: {new Date(item.created_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {item.id} | Submission ID: {item.submission_id} | Ref: {item.submission_ref}
                  </div>
                  {item.extracted_fields && Object.keys(item.extracted_fields).length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Extracted Fields: {Object.keys(item.extracted_fields).length} fields
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {websocket.lastMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Last Message</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(websocket.lastMessage, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
