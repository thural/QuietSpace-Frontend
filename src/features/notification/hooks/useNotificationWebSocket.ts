/**
 * Notification WebSocket Hook
 * 
 * Specialized hook for notification WebSocket functionality.
 * Provides notification-specific operations with enterprise integration.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDIContainer } from '@/core/di';
import type { INotificationWebSocketAdapter } from '@/features/notification/adapters';
import type { 
  NotificationWebSocketMessage,
  NotificationEventHandlers,
  NotificationSubscriptionOptions
} from '@/features/notification/adapters';

// Notification hook configuration
export interface UseNotificationWebSocketConfig {
  autoConnect?: boolean;
  enablePushNotifications?: boolean;
  enableBatchProcessing?: boolean;
  enablePriorityFiltering?: boolean;
  maxNotifications?: number;
  batchSize?: number;
  batchTimeout?: number;
  retentionPeriod?: number; // How long to keep notifications in memory
}

// Notification hook state
export interface NotificationWebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  notifications: NotificationWebSocketMessage[];
  unreadCount: number;
  batches: NotificationWebSocketMessage[][];
  preferences: any;
  metrics: any;
}

// Notification hook return value
export interface UseNotificationWebSocketReturn extends NotificationWebSocketState {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Notification operations
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  
  // Subscription management
  subscribeToNotifications: (options?: NotificationSubscriptionOptions) => () => void;
  subscribeToUnreadCount: (callback: (count: number) => void) => () => void;
  subscribeToBatches: (callback: (batches: NotificationWebSocketMessage[][]) => void) => () => void;
  
  // Preference management
  updatePreferences: (preferences: any) => Promise<void>;
  getPreferences: () => Promise<any>;
  
  // Utilities
  clearNotifications: () => void;
  getMetrics: () => any;
  reset: () => void;
}

/**
 * Notification WebSocket hook
 */
export function useNotificationWebSocket(config: UseNotificationWebSocketConfig = {}): UseNotificationWebSocketReturn {
  const {
    autoConnect = true,
    enablePushNotifications = true,
    enableBatchProcessing = true,
    enablePriorityFiltering = true,
    maxNotifications = 100,
    batchSize = 10,
    batchTimeout = 5000,
    retentionPeriod = 86400000 // 24 hours
  } = config;

  const container = useDIContainer();
  const [state, setState] = useState<NotificationWebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    notifications: [],
    unreadCount: 0,
    batches: [],
    preferences: null,
    metrics: null
  });

  // Refs for cleanup and state management
  const adapterRef = useRef<INotificationWebSocketAdapter | null>(null);
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up old notifications
  const cleanupOldNotifications = useCallback(() => {
    setState(prev => {
      const now = Date.now();
      const cutoffTime = now - retentionPeriod;
      
      const filteredNotifications = prev.notifications.filter(
        notification => new Date(notification.timestamp).getTime() > cutoffTime
      );
      
      const unreadCount = filteredNotifications.filter(n => !n.read).length;
      
      return {
        ...prev,
        notifications: filteredNotifications,
        unreadCount
      };
    });
  }, [retentionPeriod]);

  // Initialize adapter
  const initializeAdapter = useCallback(async () => {
    try {
      const adapter = container.resolve<INotificationWebSocketAdapter>('notificationWebSocketAdapter');
      await adapter.initialize({
        enablePushNotifications,
        enableBatchProcessing,
        enablePriorityFiltering,
        batchSize,
        batchTimeout
      });
      
      adapterRef.current = adapter;
      
      // Set up event handlers
      const eventHandlers: NotificationEventHandlers = {
        onNotificationReceived: (notification) => {
          setState(prev => {
            const newNotifications = [notification, ...prev.notifications.slice(0, maxNotifications - 1)];
            const unreadCount = newNotifications.filter(n => !n.read).length;
            
            return {
              ...prev,
              notifications: newNotifications,
              unreadCount
            };
          });
        },
        
        onNotificationRead: (notificationId) => {
          setState(prev => {
            const updatedNotifications = prev.notifications.map(notification =>
              notification.id === notificationId ? { ...notification, read: true } : notification
            );
            
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            return {
              ...prev,
              notifications: updatedNotifications,
              unreadCount
            };
          });
        },
        
        onAllNotificationsRead: () => {
          setState(prev => ({
            ...prev,
            notifications: prev.notifications.map(notification => ({ ...notification, read: true })),
            unreadCount: 0
          }));
        },
        
        onNotificationDeleted: (notificationId) => {
          setState(prev => {
            const updatedNotifications = prev.notifications.filter(
              notification => notification.id !== notificationId
            );
            
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            return {
              ...prev,
              notifications: updatedNotifications,
              unreadCount
            };
          });
        },
        
        onBatchProcessed: (batch) => {
          setState(prev => ({
            ...prev,
            batches: [batch, ...prev.batches.slice(0, 49)] // Keep last 50 batches
          }));
        },
        
        onPreferencesUpdated: (preferences) => {
          setState(prev => ({ ...prev, preferences }));
        },
        
        onConnectionChange: (isConnected) => {
          setState(prev => ({ 
            ...prev, 
            isConnected,
            isConnecting: false 
          }));
        },
        
        onError: (error) => {
          setState(prev => ({ 
            ...prev, 
            error: error.message,
            isConnecting: false 
          }));
        }
      };

      adapter.setEventHandlers(eventHandlers);
      
      setState(prev => ({
        ...prev,
        isConnected: adapter.isConnected,
        metrics: adapter.getMetrics()
      }));

      // Load initial preferences
      adapter.getPreferences().then(preferences => {
        setState(prev => ({ ...prev, preferences }));
      }).catch(error => {
        console.error('Failed to load notification preferences:', error);
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize notification adapter',
        isConnecting: false
      }));
    }
  }, [container, enablePushNotifications, enableBatchProcessing, enablePriorityFiltering, batchSize, batchTimeout, maxNotifications]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!adapterRef.current) {
      await initializeAdapter();
    }

    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      await adapterRef.current.connect();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null
      }));

      // Start cleanup interval
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      
      cleanupIntervalRef.current = setInterval(cleanupOldNotifications, 3600000); // Every hour

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
    }
  }, [initializeAdapter, cleanupOldNotifications]);

  // Disconnect from WebSocket
  const disconnect = useCallback(async () => {
    if (cleanupIntervalRef.current) {
      clearInterval(cleanupIntervalRef.current);
      cleanupIntervalRef.current = null;
    }

    // Clear all subscriptions
    subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
    subscriptionsRef.current.clear();

    try {
      if (adapterRef.current) {
        await adapterRef.current.disconnect();
      }
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Disconnection failed'
      }));
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    try {
      await adapterRef.current.markAsRead(notificationId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      }));
      throw error;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    try {
      await adapterRef.current.markAllAsRead();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      }));
      throw error;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    try {
      await adapterRef.current.deleteNotification(notificationId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete notification'
      }));
      throw error;
    }
  }, []);

  // Subscribe to notifications
  const subscribeToNotifications = useCallback((options?: NotificationSubscriptionOptions) => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToNotifications(options);
    subscriptionsRef.current.set('notifications', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('notifications');
    };
  }, []);

  // Subscribe to unread count
  const subscribeToUnreadCount = useCallback((callback: (count: number) => void) => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToUnreadCount(callback);
    subscriptionsRef.current.set('unreadCount', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('unreadCount');
    };
  }, []);

  // Subscribe to batches
  const subscribeToBatches = useCallback((callback: (batches: NotificationWebSocketMessage[][]) => void) => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    const unsubscribe = adapterRef.current.subscribeToBatches(callback);
    subscriptionsRef.current.set('batches', unsubscribe);

    return () => {
      unsubscribe();
      subscriptionsRef.current.delete('batches');
    };
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (preferences: any) => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    try {
      await adapterRef.current.updatePreferences(preferences);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update preferences'
      }));
      throw error;
    }
  }, []);

  // Get preferences
  const getPreferences = useCallback(async () => {
    if (!adapterRef.current) {
      throw new Error('Notification adapter not initialized');
    }

    try {
      const preferences = await adapterRef.current.getPreferences();
      setState(prev => ({ ...prev, preferences }));
      return preferences;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get preferences'
      }));
      throw error;
    }
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0,
      batches: []
    }));
  }, []);

  // Get metrics
  const getMetrics = useCallback(() => {
    if (!adapterRef.current) {
      return null;
    }

    const metrics = adapterRef.current.getMetrics();
    setState(prev => ({ ...prev, metrics }));
    return metrics;
  }, []);

  // Reset hook state
  const reset = useCallback(() => {
    disconnect();
    
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      notifications: [],
      unreadCount: 0,
      batches: [],
      preferences: null,
      metrics: null
    });
  }, [disconnect]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      reset();
    };
  }, [autoConnect, connect, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    subscribeToNotifications,
    subscribeToUnreadCount,
    subscribeToBatches,
    updatePreferences,
    getPreferences,
    clearNotifications,
    getMetrics,
    reset
  };
}

export default useNotificationWebSocket;
