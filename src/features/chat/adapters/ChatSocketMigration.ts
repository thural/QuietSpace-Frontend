/**
 * Chat Socket Migration Hook
 * 
 * Provides gradual migration from legacy useChatSocket to enterprise useChatWebSocket.
 * Supports feature flags, performance monitoring, and automatic fallback.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import useChatSocket from '../data/useChatSocket';
import { useChatWebSocket } from '@/core/websocket/hooks';
import type { MessageRequest, MessageResponse } from '../data/models/chat';
import type { ResId } from '@/shared/api/models/common';

// Migration configuration
export interface ChatMigrationConfig {
  useEnterprise?: boolean;
  enableFallback?: boolean;
  fallbackTimeout?: number;
  enablePerformanceMonitoring?: boolean;
  logMigrationEvents?: boolean;
}

// Migration state
export interface ChatMigrationState {
  isUsingEnterprise: boolean;
  isFallbackActive: boolean;
  migrationErrors: string[];
  performanceMetrics: {
    enterpriseLatency?: number;
    legacyLatency?: number;
    messageCount: number;
    errorCount: number;
  };
  lastMigrationEvent: string;
}

// Return type matching legacy useChatSocket
export interface UseChatSocketMigrationReturn {
  sendChatMessage: (inputData: MessageRequest) => void;
  deleteChatMessage: (messageId: ResId) => void;
  setMessageSeen: (messageId: ResId) => void;
  isClientConnected: boolean;
  migration: ChatMigrationState;
}

/**
 * Migration hook for chat WebSocket functionality
 */
export function useChatSocketMigration(
  config: ChatMigrationConfig = {}
): UseChatSocketMigrationReturn {
  const {
    useEnterprise = process.env.NODE_ENV === 'development',
    enableFallback = true,
    fallbackTimeout = 5000,
    enablePerformanceMonitoring = true,
    logMigrationEvents = true
  } = config;

  // Legacy hook
  const legacyHook = useChatSocket();
  
  // Enterprise hook
  const enterpriseHook = useChatWebSocket({
    autoConnect: useEnterprise,
    enableMetrics: enablePerformanceMonitoring,
    connectionTimeout: fallbackTimeout
  });

  // Migration state
  const [migrationState, setMigrationState] = useState<ChatMigrationState>({
    isUsingEnterprise: useEnterprise,
    isFallbackActive: false,
    migrationErrors: [],
    performanceMetrics: {
      messageCount: 0,
      errorCount: 0
    },
    lastMigrationEvent: useEnterprise ? 'Initialized with enterprise hooks' : 'Initialized with legacy hooks'
  });

  // Refs for performance monitoring
  const performanceRef = useRef({
    enterpriseStartTime: 0,
    legacyStartTime: 0,
    messageCount: 0,
    errorCount: 0
  });

  // Log migration events
  const logEvent = useCallback((event: string, data?: any) => {
    if (logMigrationEvents) {
      console.log(`[Chat Migration] ${event}`, data);
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
        messageCount: prev.performanceMetrics.messageCount + 1
      }
    }));
    performanceRef.current.messageCount++;
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

  // Enterprise message handlers with performance monitoring
  const enterpriseSendChatMessage = useCallback((inputData: MessageRequest) => {
    const startTime = performance.now();
    
    try {
      // Convert legacy format to enterprise message format
      const enterpriseMessage = {
        type: 'chat_message',
        data: inputData,
        timestamp: Date.now(),
        feature: 'chat'
      };

      enterpriseHook.sendFeatureMessage(enterpriseMessage)
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise message sent successfully', { latency });
        })
        .catch((error) => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          addMigrationError(`Enterprise send failed: ${error.message}`);
          
          // Trigger fallback if enabled
          if (enableFallback) {
            triggerFallback();
          }
        });
    } catch (error) {
      addMigrationError(`Enterprise message error: ${error.message}`);
      if (enableFallback) {
        triggerFallback();
      }
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, enableFallback, triggerFallback, logEvent]);

  const enterpriseDeleteChatMessage = useCallback((messageId: ResId) => {
    const startTime = performance.now();
    
    try {
      const enterpriseMessage = {
        type: 'chat_delete',
        data: { messageId },
        timestamp: Date.now(),
        feature: 'chat'
      };

      enterpriseHook.sendFeatureMessage(enterpriseMessage)
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise delete sent successfully', { messageId, latency });
        })
        .catch((error) => {
          addMigrationError(`Enterprise delete failed: ${error.message}`);
          if (enableFallback) {
            triggerFallback();
          }
        });
    } catch (error) {
      addMigrationError(`Enterprise delete error: ${error.message}`);
      if (enableFallback) {
        triggerFallback();
      }
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, enableFallback, triggerFallback, logEvent]);

  const enterpriseSetMessageSeen = useCallback((messageId: ResId) => {
    const startTime = performance.now();
    
    try {
      const enterpriseMessage = {
        type: 'chat_seen',
        data: { messageId },
        timestamp: Date.now(),
        feature: 'chat'
      };

      enterpriseHook.sendFeatureMessage(enterpriseMessage)
        .then(() => {
          const latency = performance.now() - startTime;
          updatePerformanceMetrics(true, latency);
          logEvent('Enterprise seen sent successfully', { messageId, latency });
        })
        .catch((error) => {
          addMigrationError(`Enterprise seen failed: ${error.message}`);
          if (enableFallback) {
            triggerFallback();
          }
        });
    } catch (error) {
      addMigrationError(`Enterprise seen error: ${error.message}`);
      if (enableFallback) {
        triggerFallback();
      }
    }
  }, [enterpriseHook, updatePerformanceMetrics, addMigrationError, enableFallback, triggerFallback, logEvent]);

  // Legacy message handlers with performance monitoring
  const legacySendChatMessage = useCallback((inputData: MessageRequest) => {
    const startTime = performance.now();
    
    try {
      legacyHook.sendChatMessage(inputData);
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy message sent successfully', { latency });
    } catch (error) {
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      addMigrationError(`Legacy send failed: ${error.message}`);
    }
  }, [legacyHook, updatePerformanceMetrics, addMigrationError, logEvent]);

  const legacyDeleteChatMessage = useCallback((messageId: ResId) => {
    const startTime = performance.now();
    
    try {
      legacyHook.deleteChatMessage(messageId);
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy delete sent successfully', { messageId, latency });
    } catch (error) {
      addMigrationError(`Legacy delete failed: ${error.message}`);
    }
  }, [legacyHook, addMigrationError, logEvent]);

  const legacySetMessageSeen = useCallback((messageId: ResId) => {
    const startTime = performance.now();
    
    try {
      legacyHook.setMessageSeen(messageId);
      const latency = performance.now() - startTime;
      updatePerformanceMetrics(false, latency);
      logEvent('Legacy seen sent successfully', { messageId, latency });
    } catch (error) {
      addMigrationError(`Legacy seen failed: ${error.message}`);
    }
  }, [legacyHook, addMigrationError, logEvent]);

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
    sendChatMessage: useEnterpriseImplementation ? enterpriseSendChatMessage : legacySendChatMessage,
    deleteChatMessage: useEnterpriseImplementation ? enterpriseDeleteChatMessage : legacyDeleteChatMessage,
    setMessageSeen: useEnterpriseImplementation ? enterpriseSetMessageSeen : legacySetMessageSeen,
    isClientConnected: useEnterpriseImplementation ? enterpriseHook.isConnected : legacyHook.isClientConnected,
    migration: migrationState
  };
}

/**
 * Hook for migration monitoring and management
 */
export function useChatMigrationMonitor() {
  const [globalStats, setGlobalStats] = useState({
    totalMigrations: 0,
    activeEnterprise: 0,
    activeLegacy: 0,
    totalErrors: 0,
    averageLatency: 0
  });

  // This would typically connect to a global monitoring service
  // For now, we'll provide a basic implementation
  const updateStats = useCallback((migrationState: ChatMigrationState) => {
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

export default useChatSocketMigration;
