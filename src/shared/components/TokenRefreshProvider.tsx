import React, { useEffect, useRef, useCallback } from 'react';
import { createTokenRefreshManager, EnterpriseTokenRefreshManager } from '@/core/auth/services/TokenRefreshManager';

interface TokenRefreshProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  refreshInterval?: number;
  onTokenRefresh?: (data: unknown) => void;
  onRefreshError?: (error: Error) => void;
  // Enterprise features
  enableMultiTabSync?: boolean;
  enableSecurityMonitoring?: boolean;
  onMetricsUpdate?: (metrics: any) => void;
}

/**
 * Enterprise Token Refresh Provider Component
 * 
 * An enterprise-grade React component that uses the EnterpriseTokenRefreshManager
 * to handle automatic token refresh for child components with advanced features.
 * 
 * This provides enterprise-grade token management with:
 * - Multi-tab synchronization
 * - Security monitoring and analytics
 * - Circuit breaker pattern for reliability
 * - Performance metrics and monitoring
 * - Intelligent retry logic with exponential backoff
 */
export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({
  children,
  enabled = true,
  refreshInterval = 540000, // 9 minutes default
  onTokenRefresh,
  onRefreshError,
  enableMultiTabSync = true,
  enableSecurityMonitoring = true,
  onMetricsUpdate
}) => {
  const managerRef = useRef<EnterpriseTokenRefreshManager | null>(null);
  const isActiveRef = useRef(false);
  const metricsIntervalRef = useRef<number | null>(null);

  const startTokenRefresh = useCallback(() => {
    if (!enabled || isActiveRef.current) return;

    try {
      // Create enterprise manager instance
      managerRef.current = createTokenRefreshManager();
      
      // Start automatic refresh with enterprise features
      managerRef.current.startTokenAutoRefresh({
        refreshInterval,
        onSuccessFn: (data) => {
          onTokenRefresh?.(data);
        },
        onErrorFn: (error) => {
          onRefreshError?.(error);
          // Enterprise manager handles circuit breaker automatically
        },
        enableMultiTabSync,
        enableSecurityMonitoring
      });
      
      isActiveRef.current = true;

      // Start metrics monitoring if callback provided
      if (onMetricsUpdate) {
        metricsIntervalRef.current = window.setInterval(() => {
          if (managerRef.current) {
            const metrics = managerRef.current.getMetrics();
            const status = managerRef.current.getStatus();
            onMetricsUpdate({ ...metrics, ...status });
          }
        }, 30000); // Update metrics every 30 seconds
      }

    } catch (error) {
      onRefreshError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [enabled, refreshInterval, onTokenRefresh, onRefreshError, enableMultiTabSync, enableSecurityMonitoring, onMetricsUpdate]);

  const stopTokenRefresh = useCallback(() => {
    if (managerRef.current && isActiveRef.current) {
      managerRef.current.stopTokenAutoRefresh();
      isActiveRef.current = false;
    }

    // Clear metrics interval
    if (metricsIntervalRef.current) {
      window.clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
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
    isActive: isActiveRef.current,
    getMetrics: () => managerRef.current?.getMetrics(),
    getStatus: () => managerRef.current?.getStatus()
  };

  return (
    <>
      {children}
    </>
  );
};

export default TokenRefreshProvider;
