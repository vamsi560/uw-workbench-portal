/**
 * Configuration for WebSocket and API endpoints
 */

export const config = {
  // HARD-CODED URLs (switch to env later)
  sseUrl: 'https://uw-workbench-jade.vercel.app/sse/workitems',
  apiUrl: 'https://uw-workbench-jade.vercel.app',
  
  // Realtime connection settings (SSE only)
  realtime: {
    reconnectIntervalMs: 3000,
    maxReconnectAttempts: 5,
    autoConnect: true,
  },
  
  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Helper function to get WebSocket URL based on environment
export function getSseUrl(): string {
  // Always use hardcoded for now
  return config.sseUrl;
}

// Helper function to get API URL
export function getApiUrl(): string {
  return config.apiUrl;
}
