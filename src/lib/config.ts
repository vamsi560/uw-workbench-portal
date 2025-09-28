/**
 * Configuration for WebSocket and API endpoints
 */

export const config = {
  // HARD-CODED URLs (switch to env later)
  sseUrl: 'https://uw-workbench-jade.vercel.app/sse/workitems',
  apiUrl: 'https://uw-workbench-jade.vercel.app',
  pollUrl: 'https://uw-workbench-jade.vercel.app/api/workitems/poll',
  
  // Realtime connection settings
  realtime: {
    reconnectIntervalMs: 3000,
    maxReconnectAttempts: 5,
    autoConnect: true,
  },
  
  // Polling settings
  polling: {
    intervalMs: 5000, // Poll every 5 seconds
    maxRetries: 3,
  },
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

// Helper function to get Polling URL
export function getPollUrl(): string {
  return config.pollUrl;
}
