import { useCallback, useRef, useEffect } from 'react';
import { createTokenRefreshManager, EnterpriseTokenRefreshManager } from '@/core/auth/services/TokenRefreshManager';

interface UseTokenRefreshOptions {
  autoStart?: boolean;
  refreshInterval?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  // Enterprise features
  enableMultiTabSync?: boolean;
  enableSecurityMonitoring?: boolean;
  onMetricsUpdate?: (metrics: any) => void;
  // Advanced token rotation features
  enableAdvancedRotation?: boolean;
  rotationStrategy?: 'eager' | 'lazy' | 'adaptive' | 'custom';
  rotationBuffer?: number;
  enableRefreshTokenRotation?: boolean;
}

/**
 * Enterprise Token Refresh Hook
 * 
 * Provides a React interface for managing enterprise-grade token refresh
 * with advanced features like multi-tab synchronization, security monitoring,
 * and performance metrics.
 * 
 * @param options - Configuration options including enterprise features
 * @returns Token refresh control functions, state, and metrics
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    autoStart = false,
    refreshInterval = 540000,
    onSuccess,
    onError,
    enableMultiTabSync = true,
    enableSecurityMonitoring = true,
    onMetricsUpdate,
    // Advanced rotation options
    enableAdvancedRotation = false,
    rotationStrategy = 'adaptive',
    rotationBuffer = 5 * 60 * 1000, // 5 minutes
    enableRefreshTokenRotation = true
  } = options;

  const managerRef = useRef<EnterpriseTokenRefreshManager | null>(null);
  const isActiveRef = useRef(false);
  const metricsIntervalRef = useRef<number | null>(null);

  const startTokenRefresh = useCallback(async () => {
    if (isActiveRef.current) return;

    try {
      // Create enterprise manager instance
      managerRef.current = createTokenRefreshManager();
      
      // Start automatic refresh with enterprise and advanced features
      managerRef.current.startTokenAutoRefresh({
        refreshInterval,
        onSuccessFn: (data) => {
          onSuccess?.(data);
        },
        onErrorFn: (error) => {
          onError?.(error);
          // Enterprise manager handles circuit breaker automatically
        },
        enableMultiTabSync,
        enableSecurityMonitoring,
        // Advanced rotation options
        enableAdvancedRotation,
        rotationStrategy,
        rotationBuffer,
        enableRefreshTokenRotation
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
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }, [refreshInterval, onSuccess, onError, enableMultiTabSync, enableSecurityMonitoring, onMetricsUpdate, enableAdvancedRotation, rotationStrategy, rotationBuffer, enableRefreshTokenRotation]);

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

  // Get current metrics and status
  const getMetrics = useCallback(() => {
    return managerRef.current ? managerRef.current.getMetrics() : null;
  }, []);

  const getStatus = useCallback(() => {
    return managerRef.current ? managerRef.current.getStatus() : null;
  }, []);

  // Force immediate token rotation
  const forceRotation = useCallback(async (): Promise<boolean> => {
    if (!managerRef.current) {
      console.warn('Token refresh manager not initialized');
      return false;
    }

    try {
      // This would need to be added to the EnterpriseTokenRefreshManager
      // For now, return false as it's not implemented in the base manager
      console.warn('Force rotation not implemented in base manager. Use advanced rotation.');
      return false;
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }, [onError]);

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
    isActive: isActiveRef.current,
    // Enterprise features
    getMetrics,
    getStatus,
    // Advanced rotation features
    forceRotation
  };
};

export default useTokenRefresh;
