/**
 * Feed Socket Migration Hook
 * 
 * Provides gradual migration from legacy useRealtimeFeedUpdates to enterprise useFeedWebSocket.
 * Supports feature flags, performance monitoring, and automatic fallback.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import useRealtimeFeedUpdates from '../application/hooks/useRealtimeFeedUpdates';
import { useFeedWebSocket } from '@/core/websocket/hooks';
import type { RealtimePostUpdate } from '../application/hooks/useRealtimeFeedUpdates';

// Migration configuration
export interface FeedMigrationConfig {
  useEnterprise?: boolean;
  enableFallback?: boolean;
  fallbackTimeout?: number;
  enablePerformanceMonitoring?: boolean;
  logMigrationEvents?: boolean;
}

// Migration state
export interface FeedMigrationState {
  isUsingEnterprise: boolean;
  isFallbackActive: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseLatency?: number;
    legacyLatency?: number;
    updateCount: number;
    errorCount: number;
  };
  lastMigrationEvent: string;
}

// Return type matching legacy useRealtimeFeedUpdates
export interface UseFeedSocketMigrationReturn {
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
  isConnected: boolean;
  migration: FeedMigrationState;
}

/**
 * Migration hook for feed WebSocket functionality
 */
export function useFeedSocketMigration(
  config: FeedMigrationConfig = {}
): UseFeedSocketMigrationReturn {
  const {
    useEnterprise = process.env.NODE_ENV === 'development',
    enableFallback = true,
    fallbackTimeout = 5000,
    enablePerformanceMonitoring = true,
    logMigrationEvents = true
  } = config;

  // Legacy hook
  const legacyHook = useRealtimeFeedUpdates();
  
  // Enterprise hook
  const enterpriseHook = useFeedWebSocket({
    autoConnect: useEnterprise,
    enableMetrics: enablePerformanceMonitoring,
    connectionTimeout: fallbackTimeout
  });

  // Migration state
  const [migrationState, setMigrationState] = useState<FeedMigrationState>({
    isUsingEnterprise: useEnterprise,
    isFallbackActive: false,
    migrationErrors: [],
    performanceMetrics: {
      updateCount: 0,
      errorCount: 0
    },
    lastMigrationEvent: useEnterprise ? 'Initialized with enterprise hooks' : 'Initialized with legacy hooks'
  });

  // Refs for performance monitoring
  const performanceRef = useRef({
    enterpriseStartTime: 0,
    legacyStartTime: 0,
    updateCount: 0,
    errorCount: 0
  });

  // Log migration events
  const logEvent = useCallback((event: string, data?: any) => {
    if (logMigrationEvents) {
      console.log(`[Feed Migration] ${event}`, data);
    }
    setMigrationState(prev => ({
      ...prev,
      lastMigrationEvent: event
    }));
  }, [logMigrationEvents]);

  // Add migration error
  const addMigrationError = useCallback((error: string) => {
    logEvent('Migration error', { error });
    setMigrationState(prev => ({
      ...prev,
      migrationErrors: [...prev.migrationErrors, error],
      performanceMetrics: {
        ...prev.performanceMetrics,
        errorCount: prev.performanceMetrics.errorCount + 1
      }
    }));
    performanceRef.current.errorCount++;
  }, [logEvent]);

  // Update performance metrics
  const updatePerformanceMetrics = useCallback((isEnterprise: boolean, latency?: number) => {
    if (!enablePerformanceMonitoring) return;

    setMigrationState(prev => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        ...(isEnterprise && latency && { enterpriseLatency: latency }),
        ...(!isEnterprise && latency && { legacyLatency: latency }),
        updateCount: prev.performanceMetrics.updateCount + 1
      }
    }));
    performanceRef.current.updateCount++;
  }, [enablePerformanceMonitoring]);

  // Fallback mechanism
  const triggerFallback = useCallback(() => {
    if (!enableFallback || migrationState.isFallbackActive) return;

    logEvent('Triggering fallback to legacy implementation');
    setMigrationState(prev => ({
      ...prev,
      isUsingEnterprise: false,
      isFallbackActive: true,
      lastMigrationEvent: 'Fallback activated - switching to legacy hooks'
    }));
  }, [enableFallback, migrationState.isFallbackActive, logEvent]);

  // Enterprise feed handlers with performance monitoring
  const enterpriseConnect = useCallback(() => {
    const startTime = performance.now();
    
    try {
      enterpriseHook.connect()
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise feed connected successfully', { latency });
        })
        .catch((error) => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          addMigrationError(`Enterprise feed connect failed: ${error.message}`);
          
          // Trigger fallback if enabled
          if (enableFallback) {
            triggerFallback();
          }
        });
    } catch (error) {
      addMigrationError(`Enterprise feed connect error: ${error.message}`);
      if (enableFallback) {
        triggerFallback();
      }
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, enableFallback, triggerFallback, logEvent]);

  const enterpriseDisconnect = useCallback(() => {
    const startTime = performance.now();
    
    try {
      enterpriseHook.disconnect()
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise feed disconnected successfully', { latency });
        })
        .catch((error) => {
          addMigrationError(`Enterprise feed disconnect failed: ${error.message}`);
        });
    } catch (error) {
      addMigrationError(`Enterprise feed disconnect error: ${error.message}`);
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, logEvent]);

  const enterpriseSendMessage = useCallback((message: any) => {
    const startTime = performance.now();
    
    try {
      // Convert legacy RealtimePostUpdate to enterprise message format
      const enterpriseMessage = {
        type: 'feed_update',
        data: message,
        timestamp: Date.now(),
        feature: 'feed'
      };

      enterpriseHook.sendFeatureMessage(enterpriseMessage)
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise feed message sent successfully', { latency });
        })
        .catch((error) => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          addMigrationError(`Enterprise feed message failed: ${error.message}`);
          
          // Trigger fallback if enabled
          if (enableFallback) {
            triggerFallback();
          }
        });
    } catch (error) {
      addMigrationError(`Enterprise feed message error: ${error.message}`);
      if (enableFallback) {
        triggerFallback();
      }
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, enableFallback, triggerFallback, logEvent]);

  // Legacy feed handlers with performance monitoring
  const legacyConnect = useCallback(() => {
    const startTime = performance.now();
    
    try {
      legacyHook.connect();
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy feed connected successfully', { latency });
    } catch (error) {
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      addMigrationError(`Legacy feed connect failed: ${error.message}`);
    }
  }, [legacyHook, updatePerformanceMetrics, addMigrationError, logEvent]);

  const legacyDisconnect = useCallback(() => {
    const startTime = performance.now();
    
    try {
      legacyHook.disconnect();
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy feed disconnected successfully', { latency });
    } catch (error) {
      addMigrationError(`Legacy feed disconnect failed: ${error.message}`);
    }
  }, [legacyHook, updatePerformanceMetrics, addMigrationError, logEvent]);

  const legacySendMessage = useCallback((message: any) => {
    const startTime = performance.now();
    
    try {
      legacyHook.sendMessage(message);
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy feed message sent successfully', { latency });
    } catch (error) {
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      addMigrationError(`Legacy feed message failed: ${error.message}`);
    }
  }, [legacyHook, updatePerformanceMetrics, addMigrationError, logEvent]);

  // Determine which implementation to use
  const useEnterpriseImplementation = migrationState.isUsingEnterprise && !migrationState.isFallbackActive;

  // Monitor enterprise connection health
  useEffect(() => {
    if (!useEnterpriseImplementation) return;

    const checkConnection = () => {
      if (!enterpriseHook.isConnected && migrationState.isUsingEnterprise) {
        logEvent('Enterprise connection lost, considering fallback');
        if (enableFallback) {
          setTimeout(triggerFallback, fallbackTimeout);
        }
      }
    };

    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, [enterpriseHook.isConnected, migrationState.isUsingEnterprise, enableFallback, fallbackTimeout, triggerFallback, logEvent]);

  // Log migration state changes
  useEffect(() => {
    logEvent('Migration state updated', {
      isUsingEnterprise: migrationState.isUsingEnterprise,
      isFallbackActive: migrationState.isFallbackActive,
      errorCount: migrationState.performanceMetrics.errorCount
    });
  }, [migrationState.isUsingEnterprise, migrationState.isFallbackActive, logEvent]);

  // Return appropriate implementation based on migration state
  return {
    connect: useEnterpriseImplementation ? enterpriseConnect : legacyConnect,
    disconnect: useEnterpriseImplementation ? enterpriseDisconnect : legacyDisconnect,
    sendMessage: useEnterpriseImplementation ? enterpriseSendMessage : legacySendMessage,
    isConnected: useEnterpriseImplementation ? enterpriseHook.isConnected : legacyHook.isConnected,
    migration: migrationState
  };
}

/**
 * Hook for feed migration monitoring and management
 */
export function useFeedMigrationMonitor() {
  const [globalStats, setGlobalStats] = useState({
    totalMigrations: 0,
    activeEnterprise: 0,
    activeLegacy: 0,
    totalErrors: 0,
    averageLatency: 0
  });

  // This would typically connect to a global monitoring service
  // For now, we'll provide a basic implementation
  const updateStats = useCallback((migrationState: FeedMigrationState) => {
    setGlobalStats(prev => ({
      totalMigrations: prev.totalMigrations + 1,
      activeEnterprise: migrationState.isUsingEnterprise ? prev.activeEnterprise + 1 : prev.activeEnterprise,
      activeLegacy: !migrationState.isUsingEnterprise ? prev.activeLegacy + 1 : prev.activeLegacy,
      totalErrors: prev.totalErrors + migrationState.performanceMetrics.errorCount,
      averageLatency: (prev.averageLatency + 
        (migrationState.performanceMetrics.enterpriseLatency || 0) + 
        (migrationState.performanceMetrics.legacyLatency || 0)) / 2
    }));
  }, []);

  return {
    ...globalStats,
    updateStats
  };
}

export default useFeedSocketMigration;
