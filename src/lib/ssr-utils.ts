import * as React from "react";

// SSR-safe hook to check if we're on the client side
export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// SSR-safe wrapper for components that have client-only dependencies
export function SSRSafeWrapper({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const isClient = useIsClient();
  
  if (!isClient) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// SSR-safe array mapping utility
export function safeMap<T, R>(
  array: T[] | undefined | null, 
  mapFn: (item: T, index: number, arr: T[]) => R
): R[] {
  return (array || []).map(mapFn);
}