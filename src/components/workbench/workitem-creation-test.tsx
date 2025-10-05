"use client";

import { useState, useEffect } from 'react';
import { useWorkItemUpdates } from '@/hooks/use-workitem-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wifi, WifiOff, Plus, Trash2 } from 'lucide-react';

export function WorkItemCreationTest() {
  const { 
    workItems, 
    newWorkItems, 
    addNewWorkItem, 
    acknowledgeNewWorkItem, 
    clearNewWorkItems, 
    connected 
  } = useWorkItemUpdates({
    enableNotifications: true,
  });

  const [testWorkItems, setTestWorkItems] = useState<any[]>([]);

  // Simulate creating a test work item
          <div className="flex items-center space-x-4">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5" />
                  <span>Work Item Creation Test</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
    const testWorkItem = {
      id: `W${Date.now()}`,
      submission_id: Math.floor(Math.random() * 1000),
      submission_ref: `S${Math.floor(Math.random() * 100000)}`,
      subject: `Test Insurance Policy ${Math.floor(Math.random() * 1000)}`,
      from_email: 'test@example.com',
      created_at: new Date().toISOString(),
      status: 'pending',
      extracted_fields: {
            {newWorkItems.map((item, idx) => (
              <div key={idx} className="p-2 bg-white/10 rounded-lg">
                <div className="font-semibold">{item.subject}</div>
                <div className="text-xs text-white/80">ID: {item.id}</div>
              </div>
            ))}

    // Simulate SSE message
    const sseMessage = {
      event: 'new_workitem',
      data: testWorkItem
    };

    // Add to test items
    setTestWorkItems(prev => [testWorkItem, ...prev]);

    // Simulate the SSE handler
    addNewWorkItem(testWorkItem);
  };

  const clearTestItems = () => {
    setTestWorkItems([]);
    clearNewWorkItems();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>Work Item Creation Test</span>
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
                  <span>SSE Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>SSE Disconnected</span>
                </>
              )}
            </Badge>
            
            <Button
              onClick={createTestWorkItem}
              className="flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Create Test Work Item</span>
            </Button>

            <Button
              variant="outline"
              onClick={clearTestItems}
              className="flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Work Items</p>
              <p className="font-semibold">{workItems.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">New Work Items</p>
              <p className="font-semibold">{newWorkItems.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Test Items</p>
              <p className="font-semibold">{testWorkItems.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Connection</p>
              <p className="font-semibold">{connected ? 'Connected' : 'Disconnected'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {newWorkItems.length > 0 && (
          <Card variant="gradient">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>New Work Items ({newWorkItems.length})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearNewWorkItems}
                >
                  Clear
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => acknowledgeNewWorkItem(item.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      )}

      {testWorkItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Work Items Created</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testWorkItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.from_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Work Items Table (Live Data)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>GWPC Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workItems.slice(0, 10).map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.gwpcStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
