import { useCallback, useEffect, useState } from 'react';
import { createTokenRefreshHookService } from './TokenRefreshHookService';

interface UseTokenRefreshOptions {
  autoStart?: boolean;
  refreshInterval?: number;
  onSuccess?: (data: any) => void;
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
 * Now uses TokenRefreshHookService for better performance and resource management.
 * Maintains backward compatibility while leveraging enterprise class-based patterns.
 * 
 * @param options - Configuration options including enterprise features
 * @returns Token refresh control functions, state, and metrics
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const [service] = useState(() => createTokenRefreshHookService(options));
  const [refreshState, setRefreshState] = useState(service.getRefreshState());

  useEffect(() => {
    // Subscribe to refresh state changes
    const unsubscribe = service.subscribe((newState) => {
      setRefreshState(newState);
    });

    return unsubscribe;
  }, [service]);

  // Update service if options change
  useEffect(() => {
    const newService = createTokenRefreshHookService(options);
    setService(newService);
    setRefreshState(newService.getRefreshState());
  }, [options]);

  return {
    startTokenRefresh: service.startTokenRefresh,
    stopTokenRefresh: service.stopTokenRefresh,
    forceRotation: service.forceRotation,
    startMetricsMonitoring: service.startMetricsMonitoring,
    stopMetricsMonitoring: service.stopMetricsMonitoring,
    getMetrics: service.getMetrics,
    getStatus: service.getStatus,
    getRefreshState: service.getRefreshState
  };
};

export default useTokenRefresh;
