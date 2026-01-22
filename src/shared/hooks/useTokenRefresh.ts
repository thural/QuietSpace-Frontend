import { useCallback, useRef, useEffect } from 'react';
import { createTokenRefreshManager } from '@/shared/utils';

interface UseTokenRefreshOptions {
  autoStart?: boolean;
  refreshInterval?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for using the createTokenRefreshManager utility
 * 
 * Provides a simple React interface for managing token refresh
 * using the factory-based token refresh manager.
 * 
 * @param options - Configuration options
 * @returns Token refresh control functions and state
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    autoStart = false,
    refreshInterval = 540000,
    onSuccess,
    onError
  } = options;

  const managerRef = useRef<ReturnType<typeof createTokenRefreshManager> | null>(null);
  const isActiveRef = useRef(false);

  const startTokenRefresh = useCallback(async () => {
    if (isActiveRef.current) return;

    try {
      // Create new manager instance
      managerRef.current = createTokenRefreshManager();
      
      // Start automatic refresh
      managerRef.current.startTokenAutoRefresh({
        refreshInterval,
        onSuccessFn: (data) => {
          onSuccess?.(data);
        },
        onErrorFn: (error) => {
          onError?.(error);
          // Stop refresh on error to prevent continuous failed attempts
          stopTokenRefresh();
        }
      });
      
      isActiveRef.current = true;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [refreshInterval, onSuccess, onError]);

  const stopTokenRefresh = useCallback(() => {
    if (managerRef.current && isActiveRef.current) {
      managerRef.current.stopTokenAutoRefresh();
      isActiveRef.current = false;
    }
  }, []);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) {
      startTokenRefresh();
    }

    // Cleanup on unmount
    return () => {
      stopTokenRefresh();
    };
  }, [autoStart, startTokenRefresh, stopTokenRefresh]);

  return {
    startTokenRefresh,
    stopTokenRefresh,
    isActive: isActiveRef.current
  };
};

export default useTokenRefresh;
