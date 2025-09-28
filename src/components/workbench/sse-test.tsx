"use client";

import { useState } from 'react';
import { useSse } from '@/hooks/use-sse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';

export function SseTest() {
  const [messages, setMessages] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('');

  const handleMessage = (msg: any) => {
    console.log('SSE Test received message:', msg);
    setMessages(prev => [msg, ...prev.slice(0, 9)]); // Keep last 10 messages
  };

  const { connected, reconnectAttempts, connect, disconnect } = useSse(handleMessage);

  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      // This would normally send to your backend test endpoint
      console.log('Test message:', testMessage);
      setTestMessage('');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>SSE Connection Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Badge 
              variant={connected ? "default" : "destructive"}
              className="flex items-center space-x-1"
            >
              {connected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Disconnected</span>
                </>
              )}
            </Badge>
            
            {reconnectAttempts > 0 && (
              <Badge variant="secondary">
                Attempts: {reconnectAttempts}
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={connected ? disconnect : connect}
            >
              {connected ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Disconnect
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Connect
                </>
              )}
            </Button>
          </div>

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
                disabled={!testMessage.trim()}
                size="sm"
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Received Messages ({messages.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
              >
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className="p-3 border rounded-lg bg-blue-50">
                  <div className="font-medium text-sm">
                    {msg.event || 'Unknown Event'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date().toLocaleTimeString()}
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(msg, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Connection Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <div><strong>SSE URL:</strong> https://uw-workbench-jade.vercel.app/sse/workitems</div>
            <div><strong>Status:</strong> {connected ? 'Connected' : 'Disconnected'}</div>
            <div><strong>Reconnect Attempts:</strong> {reconnectAttempts}</div>
            <div><strong>Messages Received:</strong> {messages.length}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
