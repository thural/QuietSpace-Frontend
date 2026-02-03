/**
 * Notification WebSocket Adapter
 * 
 * Bridges existing notification WebSocket implementations with the enterprise WebSocket infrastructure.
 * Provides notification-specific functionality while leveraging enterprise patterns for connection management,
 * message routing, caching, and monitoring.
 */

import { Injectable } from '@/core/modules/dependency-injection';
import { 
  IEnterpriseWebSocketService, 
  IMessageRouter,
  IWebSocketCacheManager 
} from '@/core/websocket';
import { WebSocketFeatureConfig, WebSocketMessage } from '@/core/websocket/types';
import { NotificationResponse, NotificationEvent } from '../domain/entities/NotificationEntities';
import { ResId } from '@/shared/api/models/common';

// Notification-specific WebSocket message types
export interface NotificationWebSocketMessage extends WebSocketMessage {
  feature: 'notification';
  messageType: 'notification_created' | 'notification_updated' | 'notification_deleted' | 'notification_read' | 'push_notification' | 'batch_update';
  userId?: string;
  notificationId?: string;
  data: any;
}

// Notification adapter configuration
export interface NotificationAdapterConfig {
  enableRealtimeNotifications: boolean;
  enablePushNotifications: boolean;
  enableBatchProcessing: boolean;
  enableNotificationDelivery: boolean;
  enableReadReceipts: boolean;
  batchSize: number;
  batchTimeout: number;
  deliveryRetries: number;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  priorityRouting: boolean;
}

// Notification adapter metrics
export interface NotificationAdapterMetrics {
  // Notification metrics
  notificationsSent: number;
  notificationsReceived: number;
  notificationsDelivered: number;
  notificationsRead: number;
  notificationsFailed: number;
  
  // Push notification metrics
  pushNotificationsSent: number;
  pushNotificationsDelivered: number;
  pushNotificationsFailed: number;
  
  // Batch processing metrics
  batchesProcessed: number;
  batchItemsProcessed: number;
  batchTimeouts: number;
  
  // Connection metrics
  connectionUptime: number;
  reconnectionAttempts: number;
  connectionErrors: number;
  
  // Performance metrics
  averageDeliveryLatency: number;
  deliverySuccessRate: number;
  cacheHitRate: number;
  
  // Error metrics
  errorCount: number;
  validationErrors: number;
  deliveryErrors: number;
  
  // Activity metrics
  lastActivity: number;
  activeSubscriptions: number;
  queuedNotifications: number;
}

// Notification event handlers
export interface NotificationEventHandlers {
  onNotificationCreated?: (notification: NotificationResponse) => void;
  onNotificationUpdated?: (notification: NotificationResponse) => void;
  onNotificationDeleted?: (notificationId: ResId) => void;
  onNotificationRead?: (notificationId: ResId, userId: ResId) => void;
  onPushNotification?: (notification: any) => void;
  onBatchUpdate?: (updates: any[]) => void;
  onError?: (error: NotificationWebSocketError) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onDeliveryStatus?: (notificationId: ResId, status: string) => void;
}

// Notification WebSocket error
export interface NotificationWebSocketError {
  type: 'connection' | 'notification' | 'validation' | 'delivery' | 'push' | 'batch';
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
  notificationId?: ResId;
}

// Notification subscription options
export interface NotificationSubscriptionOptions {
  includeTypes?: string[];
  excludeTypes?: string[];
  includeRead?: boolean;
  includeUnread?: boolean;
  priority?: 'low' | 'normal' | 'high';
  batchSize?: number;
  enableBatching?: boolean;
}

// Notification batch
export interface NotificationBatch {
  id: string;
  notifications: NotificationWebSocketMessage[];
  timestamp: number;
  userId?: string;
  priority: 'low' | 'normal' | 'high';
  processed: boolean;
  error?: string;
}

// Notification delivery status
export interface NotificationDeliveryStatus {
  notificationId: ResId;
  userId: ResId;
  status: 'pending' | 'delivered' | 'failed' | 'read';
  timestamp: number;
  attempts: number;
  error?: string;
}

/**
 * Notification WebSocket Adapter
 * 
 * Provides notification-specific WebSocket functionality using the enterprise infrastructure.
 * Maintains backward compatibility with existing notification components while adding enterprise features.
 */
@Injectable()
export class NotificationWebSocketAdapter {
  private config: NotificationAdapterConfig;
  private metrics: NotificationAdapterMetrics;
  private eventHandlers: NotificationEventHandlers = {};
  private activeSubscriptions: Map<string, () => void> = new Map();
  private notificationQueue: NotificationWebSocketMessage[] = [];
  private batchProcessor: NodeJS.Timeout | null = null;
  private deliveryStatuses: Map<string, NotificationDeliveryStatus> = new Map();
  private isInitialized = false;
  private startTime = Date.now();

  constructor(
    private enterpriseWebSocket: IEnterpriseWebSocketService,
    private messageRouter: IMessageRouter,
    private cacheManager: IWebSocketCacheManager
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
  }

  /**
   * Initialize the notification WebSocket adapter
   */
  async initialize(config?: Partial<NotificationAdapterConfig>): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Merge configuration
    this.config = { ...this.config, ...config };

    // Register notification feature with enterprise WebSocket
    const featureConfig: WebSocketFeatureConfig = {
      name: 'notification',
      enabled: true,
      priority: 2,
      maxConnections: 3,
      heartbeatInterval: 30000,
      reconnectAttempts: 5,
      messageValidation: true,
      cacheInvalidation: true,
      customRoutes: this.getNotificationMessageRoutes()
    };

    await this.enterpriseWebSocket.registerFeature(featureConfig);

    // Register message handlers with enterprise router
    await this.registerMessageHandlers();

    // Set up connection monitoring
    this.setupConnectionMonitoring();

    // Start batch processor if enabled
    if (this.config.enableBatchProcessing) {
      this.startBatchProcessor();
    }

    this.isInitialized = true;
    this.startTime = Date.now();
  }

  /**
   * Send a notification
   */
  async sendNotification(notification: NotificationResponse, userId?: ResId): Promise<void> {
    try {
      const notificationMessage: NotificationWebSocketMessage = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'notification',
        messageType: 'notification_created',
        type: 'notification',
        userId: userId || String(notification.recipientId),
        notificationId: String(notification.id),
        data: notification,
        timestamp: Date.now(),
        priority: this.getNotificationPriority(notification)
      };

      if (this.config.enableBatchProcessing && this.config.batchSize > 1) {
        this.addToBatch(notificationMessage);
      } else {
        await this.enterpriseWebSocket.sendMessage(notificationMessage);
      }

      this.metrics.notificationsSent++;
      this.metrics.lastActivity = Date.now();

      // Update cache
      await this.updateNotificationCache(notification);

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as NotificationWebSocketError);
      throw error;
    }
  }

  /**
   * Update a notification
   */
  async updateNotification(notification: NotificationResponse): Promise<void> {
    try {
      const updateMessage: NotificationWebSocketMessage = {
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'notification',
        messageType: 'notification_updated',
        type: 'notification_update',
        userId: String(notification.recipientId),
        notificationId: String(notification.id),
        data: notification,
        timestamp: Date.now(),
        priority: this.getNotificationPriority(notification)
      };

      await this.enterpriseWebSocket.sendMessage(updateMessage);
      this.metrics.notificationsSent++;
      this.metrics.lastActivity = Date.now();

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as NotificationWebSocketError);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: ResId, userId?: ResId): Promise<void> {
    try {
      const deleteMessage: NotificationWebSocketMessage = {
        id: `delete_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'notification',
        messageType: 'notification_deleted',
        type: 'notification_delete',
        userId: userId || '',
        notificationId: String(notificationId),
        data: { notificationId },
        timestamp: Date.now(),
        priority: 'high'
      };

      await this.enterpriseWebSocket.sendMessage(deleteMessage);
      this.metrics.notificationsSent++;
      this.metrics.lastActivity = Date.now();

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as NotificationWebSocketError);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: ResId, userId: ResId): Promise<void> {
    try {
      const readMessage: NotificationWebSocketMessage = {
        id: `read_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'notification',
        messageType: 'notification_read',
        type: 'notification_read',
        userId: String(userId),
        notificationId: String(notificationId),
        data: { notificationId, userId },
        timestamp: Date.now(),
        priority: 'medium'
      };

      await this.enterpriseWebSocket.sendMessage(readMessage);
      this.metrics.notificationsSent++;
      this.metrics.lastActivity = Date.now();

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as NotificationWebSocketError);
      throw error;
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(pushData: any, userId?: ResId): Promise<void> {
    if (!this.config.enablePushNotifications) {
      return;
    }

    try {
      const pushMessage: NotificationWebSocketMessage = {
        id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'notification',
        messageType: 'push_notification',
        type: 'push_notification',
        userId: userId || '',
        data: pushData,
        timestamp: Date.now(),
        priority: 'high'
      };

      await this.enterpriseWebSocket.sendMessage(pushMessage);
      this.metrics.pushNotificationsSent++;
      this.metrics.lastActivity = Date.now();

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as NotificationWebSocketError);
      throw error;
    }
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(
    userId: ResId,
    callback: (notification: NotificationResponse) => void,
    options?: NotificationSubscriptionOptions
  ): () => void {
    const subscriptionId = `notifications_${userId}_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'notification', messageType: 'notification_created', userId: String(userId) },
      async (message: NotificationWebSocketMessage) => {
        if (this.shouldProcessNotification(message, options)) {
          this.metrics.notificationsReceived++;
          this.metrics.lastActivity = Date.now();
          callback(message.data as NotificationResponse);
        }
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Subscribe to notification updates
   */
  subscribeToNotificationUpdates(
    userId: ResId,
    callback: (notification: NotificationResponse) => void
  ): () => void {
    const subscriptionId = `updates_${userId}_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'notification', messageType: 'notification_updated', userId: String(userId) },
      async (message: NotificationWebSocketMessage) => {
        this.metrics.notificationsReceived++;
        this.metrics.lastActivity = Date.now();
        callback(message.data as NotificationResponse);
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Subscribe to notification deletions
   */
  subscribeToNotificationDeletions(
    userId: ResId,
    callback: (notificationId: ResId) => void
  ): () => void {
    const subscriptionId = `deletions_${userId}_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'notification', messageType: 'notification_deleted', userId: String(userId) },
      async (message: NotificationWebSocketMessage) => {
        this.metrics.notificationsReceived++;
        this.metrics.lastActivity = Date.now();
        callback(message.data.notificationId as ResId);
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Subscribe to notification read events
   */
  subscribeToNotificationReadEvents(
    userId: ResId,
    callback: (notificationId: ResId, readerId: ResId) => void
  ): () => void {
    const subscriptionId = `reads_${userId}_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'notification', messageType: 'notification_read', userId: String(userId) },
      async (message: NotificationWebSocketMessage) => {
        this.metrics.notificationsReceived++;
        this.metrics.lastActivity = Date.now();
        const { notificationId, userId: readerId } = message.data;
        callback(notificationId as ResId, readerId as ResId);
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Subscribe to push notifications
   */
  subscribeToPushNotifications(
    userId: ResId,
    callback: (pushData: any) => void
  ): () => void {
    const subscriptionId = `push_${userId}_${Date.now()}`;
    
    const unsubscribe = this.messageRouter.subscribe(
      { feature: 'notification', messageType: 'push_notification', userId: String(userId) },
      async (message: NotificationWebSocketMessage) => {
        this.metrics.pushNotificationsDelivered++;
        this.metrics.lastActivity = Date.now();
        callback(message.data);
      }
    );

    this.activeSubscriptions.set(subscriptionId, unsubscribe);
    this.metrics.activeSubscriptions = this.activeSubscriptions.size;

    return () => {
      unsubscribe();
      this.activeSubscriptions.delete(subscriptionId);
      this.metrics.activeSubscriptions = this.activeSubscriptions.size;
    };
  }

  /**
   * Get current connection status
   */
  get isConnected(): boolean {
    return this.enterpriseWebSocket.isConnected;
  }

  /**
   * Get connection state
   */
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    return this.enterpriseWebSocket.connectionState;
  }

  /**
   * Get adapter metrics
   */
  getMetrics(): NotificationAdapterMetrics {
    return {
      ...this.metrics,
      connectionUptime: Date.now() - this.startTime,
      queuedNotifications: this.notificationQueue.length
    };
  }

  /**
   * Get delivery status for a notification
   */
  getDeliveryStatus(notificationId: ResId): NotificationDeliveryStatus | undefined {
    return this.deliveryStatuses.get(String(notificationId));
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers: NotificationEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<NotificationAdapterConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart batch processor if settings changed
    if (config.enableBatchProcessing !== undefined || config.batchTimeout !== undefined) {
      if (this.batchProcessor) {
        clearInterval(this.batchProcessor);
        this.batchProcessor = null;
      }
      
      if (this.config.enableBatchProcessing) {
        this.startBatchProcessor();
      }
    }
  }

  /**
   * Cleanup adapter resources
   */
  async cleanup(): Promise<void> {
    // Clear all subscriptions
    this.activeSubscriptions.forEach(unsubscribe => unsubscribe());
    this.activeSubscriptions.clear();

    // Stop batch processor
    if (this.batchProcessor) {
      clearInterval(this.batchProcessor);
      this.batchProcessor = null;
    }

    // Clear queues and caches
    this.notificationQueue = [];
    this.deliveryStatuses.clear();
    this.eventHandlers = {};
    
    await this.enterpriseWebSocket.unregisterFeature('notification');
    this.isInitialized = false;
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): NotificationAdapterConfig {
    return {
      enableRealtimeNotifications: true,
      enablePushNotifications: true,
      enableBatchProcessing: true,
      enableNotificationDelivery: true,
      enableReadReceipts: true,
      batchSize: 10,
      batchTimeout: 5000,
      deliveryRetries: 3,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      priorityRouting: true
    };
  }

  /**
   * Get default metrics
   */
  private getDefaultMetrics(): NotificationAdapterMetrics {
    return {
      notificationsSent: 0,
      notificationsReceived: 0,
      notificationsDelivered: 0,
      notificationsRead: 0,
      notificationsFailed: 0,
      pushNotificationsSent: 0,
      pushNotificationsDelivered: 0,
      pushNotificationsFailed: 0,
      batchesProcessed: 0,
      batchItemsProcessed: 0,
      batchTimeouts: 0,
      connectionUptime: 0,
      reconnectionAttempts: 0,
      connectionErrors: 0,
      averageDeliveryLatency: 0,
      deliverySuccessRate: 100,
      cacheHitRate: 0,
      errorCount: 0,
      validationErrors: 0,
      deliveryErrors: 0,
      lastActivity: Date.now(),
      activeSubscriptions: 0,
      queuedNotifications: 0
    };
  }

  /**
   * Get notification-specific message routes
   */
  private getNotificationMessageRoutes(): any[] {
    return [
      {
        pattern: { feature: 'notification', messageType: 'notification_created' },
        handler: 'handleNotificationCreated',
        priority: 'high',
        validation: true
      },
      {
        pattern: { feature: 'notification', messageType: 'notification_updated' },
        handler: 'handleNotificationUpdated',
        priority: 'medium',
        validation: true
      },
      {
        pattern: { feature: 'notification', messageType: 'notification_deleted' },
        handler: 'handleNotificationDeleted',
        priority: 'high',
        validation: false
      },
      {
        pattern: { feature: 'notification', messageType: 'notification_read' },
        handler: 'handleNotificationRead',
        priority: 'medium',
        validation: false
      },
      {
        pattern: { feature: 'notification', messageType: 'push_notification' },
        handler: 'handlePushNotification',
        priority: 'high',
        validation: false
      },
      {
        pattern: { feature: 'notification', messageType: 'batch_update' },
        handler: 'handleBatchUpdate',
        priority: 'medium',
        validation: true
      }
    ];
  }

  /**
   * Register message handlers with enterprise router
   */
  private async registerMessageHandlers(): Promise<void> {
    // Register notification created handler
    this.messageRouter.registerHandler(
      'handleNotificationCreated',
      async (message: NotificationWebSocketMessage) => {
        this.eventHandlers.onNotificationCreated?.(message.data as NotificationResponse);
      }
    );

    // Register notification updated handler
    this.messageRouter.registerHandler(
      'handleNotificationUpdated',
      async (message: NotificationWebSocketMessage) => {
        this.eventHandlers.onNotificationUpdated?.(message.data as NotificationResponse);
      }
    );

    // Register notification deleted handler
    this.messageRouter.registerHandler(
      'handleNotificationDeleted',
      async (message: NotificationWebSocketMessage) => {
        this.eventHandlers.onNotificationDeleted?.(message.data.notificationId as ResId);
      }
    );

    // Register notification read handler
    this.messageRouter.registerHandler(
      'handleNotificationRead',
      async (message: NotificationWebSocketMessage) => {
        const { notificationId, userId } = message.data;
        this.eventHandlers.onNotificationRead?.(notificationId as ResId, userId as ResId);
      }
    );

    // Register push notification handler
    this.messageRouter.registerHandler(
      'handlePushNotification',
      async (message: NotificationWebSocketMessage) => {
        this.eventHandlers.onPushNotification?.(message.data);
      }
    );

    // Register batch update handler
    this.messageRouter.registerHandler(
      'handleBatchUpdate',
      async (message: NotificationWebSocketMessage) => {
        this.eventHandlers.onBatchUpdate?.(message.data);
      }
    );
  }

  /**
   * Set up connection monitoring
   */
  private setupConnectionMonitoring(): void {
    this.enterpriseWebSocket.onConnect(() => {
      this.eventHandlers.onConnectionChange?.(true);
    });

    this.enterpriseWebSocket.onDisconnect(() => {
      this.eventHandlers.onConnectionChange?.(false);
    });
  }

  /**
   * Get notification priority based on notification data
   */
  private getNotificationPriority(notification: NotificationResponse): 'low' | 'normal' | 'high' {
    // Determine priority based on notification type and metadata
    if (notification.metadata?.urgent) {
      return 'high';
    }

    const highPriorityTypes = ['system_alert', 'security', 'urgent_message'];
    if (highPriorityTypes.includes(notification.type)) {
      return 'high';
    }

    const lowPriorityTypes = ['marketing', 'newsletter', 'update'];
    if (lowPriorityTypes.includes(notification.type)) {
      return 'low';
    }

    return 'normal';
  }

  /**
   * Check if notification should be processed based on subscription options
   */
  private shouldProcessNotification(
    message: NotificationWebSocketMessage,
    options?: NotificationSubscriptionOptions
  ): boolean {
    if (!options) {
      return true;
    }

    const notification = message.data as NotificationResponse;

    // Check include types
    if (options.includeTypes && !options.includeTypes.includes(notification.type)) {
      return false;
    }

    // Check exclude types
    if (options.excludeTypes && options.excludeTypes.includes(notification.type)) {
      return false;
    }

    // Check read status
    if (options.includeRead !== undefined && notification.isSeen !== options.includeRead) {
      return false;
    }

    if (options.includeUnread !== undefined && !notification.isSeen !== options.includeUnread) {
      return false;
    }

    return true;
  }

  /**
   * Add notification to batch
   */
  private addToBatch(message: NotificationWebSocketMessage): void {
    this.notificationQueue.push(message);
    this.metrics.queuedNotifications = this.notificationQueue.length;

    // Process batch immediately if it's full
    if (this.notificationQueue.length >= this.config.batchSize) {
      this.processBatch();
    }
  }

  /**
   * Start batch processor
   */
  private startBatchProcessor(): void {
    this.batchProcessor = setInterval(() => {
      if (this.notificationQueue.length > 0) {
        this.processBatch();
      }
    }, this.config.batchTimeout);
  }

  /**
   * Process notification batch
   */
  private async processBatch(): Promise<void> {
    if (this.notificationQueue.length === 0) {
      return;
    }

    const batch = this.notificationQueue.splice(0, this.config.batchSize);
    this.metrics.queuedNotifications = this.notificationQueue.length;

    try {
      const batchMessage: NotificationWebSocketMessage = {
        id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        feature: 'notification',
        messageType: 'batch_update',
        type: 'notification_batch',
        data: {
          notifications: batch,
          batchId: `batch_${Date.now()}`,
          timestamp: Date.now()
        },
        timestamp: Date.now(),
        priority: 'normal'
      };

      await this.enterpriseWebSocket.sendMessage(batchMessage);
      this.metrics.batchesProcessed++;
      this.metrics.batchItemsProcessed += batch.length;

    } catch (error) {
      this.metrics.errorCount++;
      this.eventHandlers.onError?.(error as NotificationWebSocketError);
      
      // Re-queue failed notifications
      this.notificationQueue.unshift(...batch);
    }
  }

  /**
   * Update notification cache
   */
  private async updateNotificationCache(notification: NotificationResponse): Promise<void> {
    try {
      const cacheKey = `notification:${notification.recipientId}:${notification.id}`;
      await this.cacheManager.set(cacheKey, notification, 300000); // 5 minutes TTL
      
      // Invalidate user notification list cache
      await this.cacheManager.invalidatePattern(`notification:${notification.recipientId}:list:*`);
    } catch (error) {
      console.error('Failed to update notification cache:', error);
    }
  }
}
