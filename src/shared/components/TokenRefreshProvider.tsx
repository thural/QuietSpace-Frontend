import React, { useEffect, useRef, useCallback } from 'react';
import { createTokenRefreshManager } from '@/shared/utils/jwtAuthUtils';

interface TokenRefreshProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  refreshInterval?: number;
  onTokenRefresh?: (data: unknown) => void;
  onRefreshError?: (error: Error) => void;
}

/**
 * Token Refresh Provider Component
 * 
 * A lightweight React component that uses the createTokenRefreshManager utility
 * to handle automatic token refresh for child components.
 * 
 * This provides an alternative to the static TokenRefreshManager class for
 * scenarios where a factory-based approach is preferred.
 */
export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({
  children,
  enabled = true,
  refreshInterval = 540000, // 9 minutes default
  onTokenRefresh,
  onRefreshError
}) => {
  const managerRef = useRef<ReturnType<typeof createTokenRefreshManager> | null>(null);
  const isActiveRef = useRef(false);

  const startTokenRefresh = useCallback(() => {
    if (!enabled || isActiveRef.current) return;

    try {
      // Create a new manager instance
      managerRef.current = createTokenRefreshManager();
      
      // Start automatic refresh
      managerRef.current.startTokenAutoRefresh({
        refreshInterval,
        onSuccessFn: (data) => {
          onTokenRefresh?.(data);
        },
        onErrorFn: (error) => {
          onRefreshError?.(error);
          // Stop refresh on error to prevent continuous failed attempts
          stopTokenRefresh();
        }
      });
      
      isActiveRef.current = true;
    } catch (error) {
      onRefreshError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [enabled, refreshInterval, onTokenRefresh, onRefreshError]);

  const stopTokenRefresh = useCallback(() => {
    if (managerRef.current && isActiveRef.current) {
      managerRef.current.stopTokenAutoRefresh();
      isActiveRef.current = false;
    }
  }, []);

  // Start refresh when enabled or dependencies change
  useEffect(() => {
    if (enabled) {
      startTokenRefresh();
    } else {
      stopTokenRefresh();
    }

    // Cleanup on unmount
    return () => {
      stopTokenRefresh();
    };
  }, [enabled, startTokenRefresh, stopTokenRefresh]);

  // Provide context for manual control if needed
  const contextValue = {
    startTokenRefresh,
    stopTokenRefresh,
    isActive: isActiveRef.current
  };

  return (
    <>
      {children}
    </>
  );
};

export default TokenRefreshProvider;
