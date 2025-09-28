/**
 * Configuration for WebSocket and API endpoints
 */

export const config = {
  // WebSocket URL - using your actual backend URL
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://uw-workbench-jade.vercel.app/ws/workitems',
  
  // API URL for other endpoints
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://uw-workbench-jade.vercel.app',
  
  // WebSocket connection settings
  websocket: {
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    autoConnect: true,
  },
  
  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Helper function to get WebSocket URL based on environment
export function getWebSocketUrl(): string {
  if (config.isDevelopment) {
    // For local development, you might want to use a different URL
    return process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws/workitems';
  }
  
  return config.websocketUrl;
}

// Helper function to get API URL
export function getApiUrl(): string {
  return config.apiUrl;
}
