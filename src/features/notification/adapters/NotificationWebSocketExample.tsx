/**
 * Notification WebSocket Example Component
 * 
 * Demonstrates how to use the Notification WebSocket Adapter for real-time notification functionality.
 * Shows integration with enterprise WebSocket infrastructure while maintaining
 * backward compatibility with existing notification components.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDIContainer } from '@/core/di';
import { 
  NotificationWebSocketAdapter,
  type INotificationWebSocketAdapter,
  type NotificationAdapterConfig,
  type NotificationEventHandlers,
  type NotificationResponse,
  type PushNotificationData,
  type NotificationSubscriptionOptions
} from './index';
import { ResId } from '@/shared/api/models/common';

interface NotificationWebSocketExampleProps {
  userId: ResId;
  onNotification?: (notification: NotificationResponse) => void;
  onPushNotification?: (pushData: PushNotificationData) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

/**
 * Example component demonstrating Notification WebSocket Adapter usage
 */
export const NotificationWebSocketExample: React.FC<NotificationWebSocketExampleProps> = ({
  userId,
  onNotification,
  onPushNotification,
  onConnectionChange
}) => {
  const [adapter, setAdapter] = useState<INotificationWebSocketAdapter | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [pushNotifications, setPushNotifications] = useState<PushNotificationData[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [config, setConfig] = useState<NotificationAdapterConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isQuietHours, setIsQuietHours] = useState(false);

  const container = useDIContainer();

  // Initialize adapter
  useEffect(() => {
    const initializeAdapter = async () => {
      try {
        // Create adapter instance
        const notificationAdapter = new NotificationWebSocketAdapter(
          container.resolve('enterpriseWebSocketService'),
          container.resolve('messageRouter'),
          container.resolve('webSocketCacheManager')
        );

        // Configure adapter
        const adapterConfig: Partial<NotificationAdapterConfig> = {
          enableRealtimeNotifications: true,
          enablePushNotifications: true,
          enableBatchProcessing: true,
          enableNotificationDelivery: true,
          enableReadReceipts: true,
          batchSize: 5,
          batchTimeout: 3000,
          deliveryRetries: 3,
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00'
          },
          priorityRouting: true,
          contentFiltering: true,
          spamDetection: true,
          rateLimiting: {
            enabled: true,
            maxNotificationsPerMinute: 10,
            maxNotificationsPerHour: 100
          }
        };

        await notificationAdapter.initialize(adapterConfig);
        setConfig(notificationAdapter.getConfig());

        // Set up event handlers
        const eventHandlers: NotificationEventHandlers = {
          onNotificationCreated: (notification) => {
            setNotifications(prev => [notification, ...prev]);
            onNotification?.(notification);
          },
          onNotificationUpdated: (notification) => {
            setNotifications(prev => 
              prev.map(n => n.id === notification.id ? notification : n)
            );
            onNotification?.(notification);
          },
          onNotificationDeleted: (notificationId) => {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
          },
          onNotificationRead: (notificationId, readerId) => {
            setNotifications(prev => 
              prev.map(n => n.id === notificationId ? { ...n, isSeen: true } : n)
            );
          },
          onPushNotification: (pushData) => {
            setPushNotifications(prev => [pushData, ...prev]);
            onPushNotification?.(pushData);
          },
          onBatchUpdate: (batch) => {
            console.log('Batch update received:', batch);
          },
          onConnectionChange: (connected) => {
            setIsConnected(connected);
            onConnectionChange?.(connected);
          },
          onError: (error) => {
            setError(error.message);
          },
          onDeliveryStatus: (confirmation) => {
            console.log('Delivery status:', confirmation);
          },
          onQuietHoursChange: (active) => {
            setIsQuietHours(active);
          }
        };

        notificationAdapter.setEventHandlers(eventHandlers);

        // Subscribe to notifications
        const subscriptionOptions: NotificationSubscriptionOptions = {
          includeUnread: true,
          includeRead: false,
          priority: 'normal',
          enableBatching: true
        };

        const unsubscribeNotifications = notificationAdapter.subscribeToNotifications(
          userId,
          (notification) => {
            setNotifications(prev => [notification, ...prev]);
          },
          subscriptionOptions
        );

        const unsubscribePushNotifications = notificationAdapter.subscribeToPushNotifications(
          userId,
          (pushData) => {
            setPushNotifications(prev => [pushData, ...prev]);
          }
        );

        const unsubscribeUpdates = notificationAdapter.subscribeToNotificationUpdates(
          userId,
          (notification) => {
            setNotifications(prev => 
              prev.map(n => n.id === notification.id ? notification : n)
            );
          }
        );

        const unsubscribeDeletions = notificationAdapter.subscribeToNotificationDeletions(
          userId,
          (notificationId) => {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
          }
        );

        setAdapter(notificationAdapter);
        setIsConnected(notificationAdapter.isConnected);

        // Cleanup function
        return () => {
          unsubscribeNotifications();
          unsubscribePushNotifications();
          unsubscribeUpdates();
          unsubscribeDeletions();
        };

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize adapter');
      }
    };

    initializeAdapter();
  }, [userId, container, onNotification, onPushNotification, onConnectionChange]);

  // Update metrics periodically
  useEffect(() => {
    if (!adapter) return;

    const interval = setInterval(() => {
      const currentMetrics = adapter.getMetrics();
      setMetrics(currentMetrics);
    }, 5000);

    return () => clearInterval(interval);
  }, [adapter]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!adapter || !isConnected) {
      setError('Not connected to notification service');
      return;
    }

    try {
      const testNotification: NotificationResponse = {
        id: `test_${Date.now()}`,
        recipientId: userId,
        actorId: userId,
        type: 'system',
        message: `Test notification sent at ${new Date().toLocaleTimeString()}`,
        isSeen: false,
        createDate: new Date().toISOString(),
        metadata: {
          priority: 'normal',
          source: 'example_component',
          test: true
        }
      };

      await adapter.sendNotification(testNotification);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send notification');
    }
  }, [adapter, isConnected, userId]);

  // Send test push notification
  const sendTestPushNotification = useCallback(async () => {
    if (!adapter || !isConnected) {
      setError('Not connected to notification service');
      return;
    }

    try {
      const testPushData: PushNotificationData = {
        id: `push_test_${Date.now()}`,
        title: 'Test Push Notification',
        body: 'This is a test push notification from the WebSocket adapter',
        icon: '/icon.png',
        badge: 1,
        tag: 'test',
        data: {
          source: 'example_component',
          test: true
        },
        actions: [
          {
            action: 'open',
            title: 'Open'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ],
        timestamp: Date.now(),
        userId: String(userId)
      };

      await adapter.sendPushNotification(testPushData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send push notification');
    }
  }, [adapter, isConnected, userId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: ResId) => {
    if (!adapter || !isConnected) return;

    try {
      await adapter.markNotificationAsRead(notificationId, userId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [adapter, isConnected, userId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: ResId) => {
    if (!adapter || !isConnected) return;

    try {
      await adapter.deleteNotification(notificationId, userId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [adapter, isConnected, userId]);

  // Toggle quiet hours
  const toggleQuietHours = useCallback(async () => {
    if (!adapter) return;

    const newQuietHours = {
      enabled: !isQuietHours,
      startTime: '22:00',
      endTime: '08:00'
    };

    adapter.updateConfig({ quietHours: newQuietHours });
    setIsQuietHours(!isQuietHours);
  }, [adapter, isQuietHours]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adapter) {
        adapter.cleanup();
      }
    };
  }, [adapter]);

  return (
    <div className="notification-websocket-example">
      <div className="notification-header">
        <h3>Notification WebSocket Example</h3>
        <div className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
          {isQuietHours && <span className="quiet-hours">Quiet Hours Active</span>}
        </div>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="notification-info">
        <div>User ID: {userId}</div>
        <div>Notifications: {notifications.length}</div>
        <div>Push Notifications: {pushNotifications.length}</div>
        {config && (
          <div>Batch Processing: {config.enableBatchProcessing ? 'Enabled' : 'Disabled'}</div>
        )}
      </div>

      <div className="metrics">
        <h4>Metrics:</h4>
        {metrics && (
          <pre>{JSON.stringify(metrics, null, 2)}</pre>
        )}
      </div>

      <div className="actions">
        <button onClick={sendTestNotification} disabled={!isConnected}>
          Send Test Notification
        </button>
        <button onClick={sendTestPushNotification} disabled={!isConnected}>
          Send Test Push Notification
        </button>
        <button onClick={toggleQuietHours}>
          {isQuietHours ? 'Disable' : 'Enable'} Quiet Hours
        </button>
      </div>

      <div className="notifications">
        <h4>Notifications ({notifications.length}):</h4>
        {notifications.slice(0, 10).map((notification) => (
          <div key={notification.id} className="notification-item">
            <div className="notification-header">
              <strong>{notification.type}</strong>
              <span className="notification-time">
                {new Date(notification.createDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="notification-content">{notification.message}</div>
            <div className="notification-actions">
              {!notification.isSeen && (
                <button onClick={() => markAsRead(notification.id)}>
                  Mark as Read
                </button>
              )}
              <button onClick={() => deleteNotification(notification.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="push-notifications">
        <h4>Push Notifications ({pushNotifications.length}):</h4>
        {pushNotifications.slice(0, 5).map((push, index) => (
          <div key={`${push.id}-${index}`} className="push-notification-item">
            <div className="push-header">
              <strong>{push.title}</strong>
              <span className="push-time">
                {new Date(push.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="push-content">{push.body}</div>
            {push.actions && (
              <div className="push-actions">
                {push.actions.map((action, actionIndex) => (
                  <button key={actionIndex}>
                    {action.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="configuration">
        <h4>Configuration:</h4>
        {config && (
          <pre>{JSON.stringify(config, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default NotificationWebSocketExample;
