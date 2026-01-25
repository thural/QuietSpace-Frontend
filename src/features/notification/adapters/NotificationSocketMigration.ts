/**
 * Notification Socket Migration Hook
 * 
 * Provides gradual migration from legacy useNotificationSocket to enterprise useNotificationWebSocket.
 * Supports feature flags, performance monitoring, and automatic fallback.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import useNotificationSocket from '../application/hooks/useNotificationSocket';
import { useNotificationWebSocket } from '@/core/websocket/hooks';
import type { ResId } from '@/shared/api/models/common';

// Migration configuration
export interface NotificationMigrationConfig {
  useEnterprise?: boolean;
  enableFallback?: boolean;
  fallbackTimeout?: number;
  enablePerformanceMonitoring?: boolean;
  logMigrationEvents?: boolean;
}

// Migration state
export interface NotificationMigrationState {
  isUsingEnterprise: boolean;
  isFallbackActive: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseLatency?: number;
    legacyLatency?: number;
    notificationCount: number;
    errorCount: number;
  };
  lastMigrationEvent: string;
}

// Return type matching legacy useNotificationSocket
export interface UseNotificationSocketMigrationReturn {
  setNotificationSeen: (notificationId: ResId) => void;
  isClientConnected: boolean;
  migration: NotificationMigrationState;
}

/**
 * Migration hook for notification WebSocket functionality
 */
export function useNotificationSocketMigration(
  config: NotificationMigrationConfig = {}
): UseNotificationSocketMigrationReturn {
  const {
    useEnterprise = process.env.NODE_ENV === 'development',
    enableFallback = true,
    fallbackTimeout = 5000,
    enablePerformanceMonitoring = true,
    logMigrationEvents = true
  } = config;

  // Legacy hook
  const legacyHook = useNotificationSocket();
  
  // Enterprise hook
  const enterpriseHook = useNotificationWebSocket({
    autoConnect: useEnterprise,
    enableMetrics: enablePerformanceMonitoring,
    connectionTimeout: fallbackTimeout
  });

  // Migration state
  const [migrationState, setMigrationState] = useState<NotificationMigrationState>({
    isUsingEnterprise: useEnterprise,
    isFallbackActive: false,
    migrationErrors: [],
    performanceMetrics: {
      notificationCount: 0,
      errorCount: 0
    },
    lastMigrationEvent: useEnterprise ? 'Initialized with enterprise hooks' : 'Initialized with legacy hooks'
  });

  // Refs for performance monitoring
  const performanceRef = useRef({
    enterpriseStartTime: 0,
    legacyStartTime: 0,
    notificationCount: 0,
    errorCount: 0
  });

  // Log migration events
  const logEvent = useCallback((event: string, data?: any) => {
    if (logMigrationEvents) {
      console.log(`[Notification Migration] ${event}`, data);
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
        notificationCount: prev.performanceMetrics.notificationCount + 1
      }
    }));
    performanceRef.current.notificationCount++;
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

  // Enterprise notification handlers with performance monitoring
  const enterpriseSetNotificationSeen = useCallback((notificationId: ResId) => {
    const startTime = performance.now();
    
    try {
      // Convert legacy format to enterprise message format
      const enterpriseMessage = {
        type: 'notification_seen',
        data: { notificationId },
        timestamp: Date.now(),
        feature: 'notification'
      };

      enterpriseHook.sendFeatureMessage(enterpriseMessage)
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise notification seen sent successfully', { notificationId, latency });
        })
        .catch((error) => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          addMigrationError(`Enterprise notification seen failed: ${error.message}`);
          
          // Trigger fallback if enabled
          if (enableFallback) {
            triggerFallback();
          }
        });
    } catch (error) {
      addMigrationError(`Enterprise notification seen error: ${error.message}`);
      if (enableFallback) {
        triggerFallback();
      }
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, enableFallback, triggerFallback, logEvent]);

  // Legacy notification handlers with performance monitoring
  const legacySetNotificationSeen = useCallback((notificationId: ResId) => {
    const startTime = performance.now();
    
    try {
      legacyHook.setNotificationSeen(notificationId);
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy notification seen sent successfully', { notificationId, latency });
    } catch (error) {
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      addMigrationError(`Legacy notification seen failed: ${error.message}`);
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
    setNotificationSeen: useEnterpriseImplementation ? enterpriseSetNotificationSeen : legacySetNotificationSeen,
    isClientConnected: useEnterpriseImplementation ? enterpriseHook.isConnected : legacyHook.isClientConnected,
    migration: migrationState
  };
}

/**
 * Hook for notification migration monitoring and management
 */
export function useNotificationMigrationMonitor() {
  const [globalStats, setGlobalStats] = useState({
    totalMigrations: 0,
    activeEnterprise: 0,
    activeLegacy: 0,
    totalErrors: 0,
    averageLatency: 0
  });

  // This would typically connect to a global monitoring service
  // For now, we'll provide a basic implementation
  const updateStats = useCallback((migrationState: NotificationMigrationState) => {
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

export default useNotificationSocketMigration;
