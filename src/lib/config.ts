/**
 * Configuration for WebSocket and API endpoints
 */

export const config = {
  // HARD-CODED URLs (switch to env later)
  sseUrl: 'https://uw-workbench-jade.vercel.app/sse/workitems',
  websocketUrl: 'wss://uw-workbench-jade.vercel.app/ws/workitems',
  apiUrl: 'https://uw-workbench-jade.vercel.app',
  
  // Realtime connection settings
  realtime: {
    reconnectIntervalMs: 3000,
    maxReconnectAttempts: 5,
    autoConnect: true,
    websocketFallbackDelayMs: 8000,
  },
  
  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Helper function to get WebSocket URL based on environment
export function getSseUrl(): string {
  // Always use hardcoded for now
  return config.sseUrl;
}

export function getWebSocketUrl(): string {
  // Always use hardcoded for now
  return config.websocketUrl;
}

// Helper function to get API URL
export function getApiUrl(): string {
  return config.apiUrl;
}
