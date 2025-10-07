'use client'

import { useState, useEffect, useRef } from 'react'

interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

interface UseWebSocketReturn {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  disconnect: () => void
  connect: () => void
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      // Use wss:// for production, ws:// for development
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}${url}`
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        reconnectAttempts.current = 0
        
        // Send authentication if needed
        if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
          ws.send(JSON.stringify({
            type: 'auth',
            token: localStorage.getItem('auth_token')
          }))
        }
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          setLastMessage({
            ...message,
            timestamp: Date.now()
          })
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        wsRef.current = null

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectAttempts.current++
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            connect()
          }, delay)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect')
      wsRef.current = null
    }
    
    setIsConnected(false)
  }

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Cannot send message.')
    }
  }

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [url])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    connect,
  }
}