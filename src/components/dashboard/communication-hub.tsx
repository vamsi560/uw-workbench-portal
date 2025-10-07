'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  MessageSquare,
  Send,
  User,
  Clock,
  Paperclip,
  AlertCircle,
  CheckCircle,
  Info,
  FileText
} from 'lucide-react'

interface Communication {
  id: string
  type: 'broker' | 'internal' | 'system'
  sender: string
  recipient?: string
  subject: string
  message: string
  timestamp: string
  attachments?: string[]
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'sent' | 'read' | 'replied'
}

interface CommunicationHubProps {
  communications: Communication[]
  workItemId: string
}

export function CommunicationHub({ communications, workItemId }: CommunicationHubProps) {
  const [activeTab, setActiveTab] = useState<'broker' | 'internal' | 'all'>('all')
  const [newMessage, setNewMessage] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [messageType, setMessageType] = useState<'broker' | 'internal'>('broker')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'High':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'Low':
        return 'text-green-600 bg-green-100 border-green-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'broker':
        return <User className="h-4 w-4 text-blue-600" />
      case 'internal':
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'system':
        return <Info className="h-4 w-4 text-gray-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="h-3 w-3 text-blue-500" />
      case 'read':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'replied':
        return <MessageSquare className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const filteredCommunications = communications.filter(comm => {
    if (activeTab === 'all') return true
    return comm.type === activeTab
  })

  const handleSendMessage = () => {
    if (!newMessage.trim() || !newSubject.trim()) return

    // Here you would typically send the message via API
    console.log('Sending message:', {
      workItemId,
      type: messageType,
      subject: newSubject,
      message: newMessage
    })

    // Reset form
    setNewMessage('')
    setNewSubject('')
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Communication Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              All Messages
            </Button>
            <Button
              variant={activeTab === 'broker' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('broker')}
            >
              Broker Correspondence
            </Button>
            <Button
              variant={activeTab === 'internal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('internal')}
            >
              Internal Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Message Thread</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCommunications.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredCommunications.map((comm) => (
                <div key={comm.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(comm.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{comm.sender}</span>
                          {comm.recipient && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="text-gray-600">{comm.recipient}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(comm.timestamp)}
                          </span>
                          {getStatusIcon(comm.status)}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(comm.priority)}`}
                    >
                      {comm.priority}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-2">{comm.subject}</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comm.message}</p>
                  </div>

                  {comm.attachments && comm.attachments.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Attachments:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {comm.attachments.map((attachment, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Send Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="messageType">Message Type</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={messageType === 'broker' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMessageType('broker')}
                >
                  Broker Correspondence
                </Button>
                <Button
                  variant={messageType === 'internal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMessageType('internal')}
                >
                  Internal Note
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter message subject"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach File
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !newSubject.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Request History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Information Request History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communications
              .filter(comm => comm.type === 'broker' && comm.subject.toLowerCase().includes('request'))
              .map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{request.subject}</span>
                    <p className="text-sm text-gray-600">{request.message}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(request.timestamp)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ml-2 ${getPriorityColor(request.priority)}`}
                    >
                      {request.priority}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
