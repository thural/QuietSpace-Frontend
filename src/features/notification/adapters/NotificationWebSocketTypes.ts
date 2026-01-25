/**
 * Notification WebSocket Types
 * 
 * Type definitions specific to notification WebSocket functionality.
 * Extends enterprise WebSocket types with notification-specific features.
 */

import { WebSocketMessage, WebSocketFeatureConfig } from '@/core/websocket/types';
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

// Notification message types
export interface NotificationMessageData {
  id: ResId;
  recipientId: ResId;
  actorId?: ResId;
  contentId?: ResId;
  type: string;
  message?: string;
  content?: string;
  isSeen: boolean;
  createDate: string;
  updateDate?: string;
  metadata?: {
    priority?: 'low' | 'normal' | 'high';
    urgent?: boolean;
    source?: string;
    category?: string;
    tags?: string[];
    actions?: NotificationAction[];
    expiresAt?: string;
    scheduledFor?: string;
  };
}

// Notification action
export interface NotificationAction {
  id: string;
  type: 'button' | 'link' | 'input';
  label: string;
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
  icon?: string;
  data?: Record<string, any>;
}

// Push notification data
export interface PushNotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: number;
  tag?: string;
  image?: string;
  data?: Record<string, any>;
  actions?: PushNotificationAction[];
  timestamp: number;
  userId?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  sound?: string;
}

// Push notification action
export interface PushNotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Notification batch data
export interface NotificationBatchData {
  batchId: string;
  notifications: NotificationWebSocketMessage[];
  timestamp: number;
  userId?: string;
  metadata?: {
    totalNotifications: number;
    validNotifications: number;
    errors?: string[];
    processingTime?: number;
    priority?: 'low' | 'normal' | 'high';
  };
}

// Notification delivery confirmation
export interface NotificationDeliveryConfirmation {
  notificationId: ResId;
  userId: ResId;
  status: 'pending' | 'delivered' | 'failed' | 'read';
  timestamp: number;
  attempts: number;
  error?: string;
  device?: string;
  channel?: 'in_app' | 'push' | 'email';
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
    timezone?: string;
  };
  priorityRouting: boolean;
  contentFiltering: boolean;
  spamDetection: boolean;
  rateLimiting: {
    enabled: boolean;
    maxNotificationsPerMinute: number;
    maxNotificationsPerHour: number;
  };
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
  pushNotificationsOpened: number;
  pushNotificationsDismissed: number;
  
  // Batch processing metrics
  batchesProcessed: number;
  batchItemsProcessed: number;
  batchTimeouts: number;
  averageBatchSize: number;
  
  // Connection metrics
  connectionUptime: number;
  reconnectionAttempts: number;
  connectionErrors: number;
  
  // Performance metrics
  averageDeliveryLatency: number;
  deliverySuccessRate: number;
  cacheHitRate: number;
  processingTime: number;
  
  // Error metrics
  errorCount: number;
  validationErrors: number;
  deliveryErrors: number;
  spamBlocked: number;
  rateLimited: number;
  
  // Activity metrics
  lastActivity: number;
  activeSubscriptions: number;
  queuedNotifications: number;
  processedNotifications: number;
}

// Notification event handlers
export interface NotificationEventHandlers {
  onNotificationCreated?: (notification: NotificationResponse) => void;
  onNotificationUpdated?: (notification: NotificationResponse) => void;
  onNotificationDeleted?: (notificationId: ResId) => void;
  onNotificationRead?: (notificationId: ResId, userId: ResId) => void;
  onPushNotification?: (pushData: PushNotificationData) => void;
  onPushNotificationClicked?: (notificationId: string, action?: string) => void;
  onPushNotificationDismissed?: (notificationId: string) => void;
  onBatchUpdate?: (updates: NotificationBatchData) => void;
  onError?: (error: NotificationWebSocketError) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onDeliveryStatus?: (confirmation: NotificationDeliveryConfirmation) => void;
  onQuietHoursChange?: (active: boolean) => void;
}

// Notification WebSocket error
export interface NotificationWebSocketError {
  type: 'connection' | 'notification' | 'validation' | 'delivery' | 'push' | 'batch' | 'rate_limit' | 'spam';
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
  retryable: boolean;
  notificationId?: ResId;
  userId?: ResId;
  severity?: 'low' | 'medium' | 'high' | 'critical';
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
  quietHours?: boolean;
  maxNotifications?: number;
  throttleMs?: number;
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
  processingTime?: number;
}

// Notification queue
export interface NotificationQueue {
  pending: QueuedNotification[];
  processing: QueuedNotification[];
  completed: QueuedNotification[];
  failed: QueuedNotification[];
  maxSize: number;
  processingDelay: number;
}

// Queued notification
export interface QueuedNotification {
  id: string;
  message: NotificationWebSocketMessage;
  timestamp: number;
  retries: number;
  maxRetries: number;
  lastRetry?: number;
  error?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: number;
}

// Notification cache keys
export interface NotificationCacheKeys {
  notifications: (userId: string) => string;
  notification: (userId: string, notificationId: string) => string;
  unreadCount: (userId: string) => string;
  userPreferences: (userId: string) => string;
  deliveryStatus: (notificationId: string) => string;
  batchStatus: (batchId: string) => string;
  quietHours: (userId: string) => string;
  rateLimit: (userId: string) => string;
}

// Notification WebSocket feature configuration
export interface NotificationWebSocketFeatureConfig extends WebSocketFeatureConfig {
  adapter: NotificationAdapterConfig;
  cacheKeys: NotificationCacheKeys;
  eventHandlers: NotificationEventHandlers;
  subscriptionOptions: NotificationSubscriptionOptions;
}

// Notification WebSocket adapter interface
export interface INotificationWebSocketAdapter {
  // Initialization
  initialize(config?: Partial<NotificationAdapterConfig>): Promise<void>;
  cleanup(): Promise<void>;
  
  // Connection management
  get isConnected(): boolean;
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  
  // Notification operations
  sendNotification(notification: NotificationResponse, userId?: ResId): Promise<void>;
  updateNotification(notification: NotificationResponse): Promise<void>;
  deleteNotification(notificationId: ResId, userId?: ResId): Promise<void>;
  markNotificationAsRead(notificationId: ResId, userId: ResId): Promise<void>;
  
  // Push notification operations
  sendPushNotification(pushData: PushNotificationData, userId?: ResId): Promise<void>;
  sendBulkPushNotifications(pushData: PushNotificationData[], userIds: ResId[]): Promise<void>;
  
  // Batch operations
  sendBatchNotifications(notifications: NotificationResponse[]): Promise<void>;
  
  // Subscriptions
  subscribeToNotifications(
    userId: ResId, 
    callback: (notification: NotificationResponse) => void, 
    options?: NotificationSubscriptionOptions
  ): () => void;
  subscribeToNotificationUpdates(
    userId: ResId, 
    callback: (notification: NotificationResponse) => void
  ): () => void;
  subscribeToNotificationDeletions(
    userId: ResId, 
    callback: (notificationId: ResId) => void
  ): () => void;
  subscribeToNotificationReadEvents(
    userId: ResId, 
    callback: (notificationId: ResId, readerId: ResId) => void
  ): () => void;
  subscribeToPushNotifications(
    userId: ResId, 
    callback: (pushData: PushNotificationData) => void
  ): () => void;
  subscribeToBatchUpdates(
    callback: (batch: NotificationBatchData) => void
  ): () => void;
  
  // Event handlers
  setEventHandlers(handlers: NotificationEventHandlers): void;
  
  // Metrics and monitoring
  getMetrics(): NotificationAdapterMetrics;
  getDeliveryStatus(notificationId: ResId): NotificationDeliveryConfirmation | undefined;
  getQueueStatus(): NotificationQueue;
  
  // Configuration
  updateConfig(config: Partial<NotificationAdapterConfig>): void;
  getConfig(): NotificationAdapterConfig;
  
  // Cache management
  invalidateNotificationCache(userId: ResId): Promise<void>;
  invalidateNotificationCacheById(notificationId: ResId): Promise<void>;
  clearCache(): Promise<void>;
  
  // User preferences
  getUserPreferences(userId: ResId): Promise<any>;
  updateUserPreferences(userId: ResId, preferences: any): Promise<void>;
  
  // Quiet hours
  setQuietHours(userId: ResId, quietHours: any): Promise<void>;
  getQuietHours(userId: ResId): Promise<any>;
  isQuietHoursActive(userId: ResId): Promise<boolean>;
}

// Notification WebSocket factory
export interface INotificationWebSocketFactory {
  createAdapter(config?: Partial<NotificationAdapterConfig>): Promise<INotificationWebSocketAdapter>;
  getDefaultConfig(): NotificationAdapterConfig;
  validateConfig(config: NotificationAdapterConfig): boolean;
}

// Type guards
export function isNotificationWebSocketMessage(message: WebSocketMessage): message is NotificationWebSocketMessage {
  return message.feature === 'notification';
}

export function isNotificationMessageData(data: any): data is NotificationMessageData {
  return data && 
         typeof data.id === 'string' &&
         typeof data.recipientId === 'string' &&
         typeof data.type === 'string' &&
         typeof data.isSeen === 'boolean';
}

export function isPushNotificationData(data: any): data is PushNotificationData {
  return data &&
         typeof data.id === 'string' &&
         typeof data.title === 'string' &&
         typeof data.body === 'string' &&
         typeof data.timestamp === 'number';
}

export function isNotificationBatchData(data: any): data is NotificationBatchData {
  return data &&
         typeof data.batchId === 'string' &&
         Array.isArray(data.notifications) &&
         typeof data.timestamp === 'number';
}

export function isNotificationDeliveryConfirmation(data: any): data is NotificationDeliveryConfirmation {
  return data &&
         typeof data.notificationId === 'string' &&
         typeof data.userId === 'string' &&
         typeof data.status === 'string' &&
         typeof data.timestamp === 'number';
}

export function isNotificationWebSocketError(error: any): error is NotificationWebSocketError {
  return error &&
         typeof error.type === 'string' &&
         typeof error.message === 'string' &&
         typeof error.timestamp === 'number' &&
         typeof error.retryable === 'boolean';
}

// Notification priority utilities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  USER: 'user',
  SECURITY: 'security',
  MARKETING: 'marketing',
  NEWSLETTER: 'newsletter',
  REMINDER: 'reminder',
  UPDATE: 'update',
  ALERT: 'alert',
  MESSAGE: 'message',
  FOLLOW: 'follow',
  LIKE: 'like',
  COMMENT: 'comment',
  MENTION: 'mention'
} as const;

export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms'
} as const;

export const NOTIFICATION_ERROR_TYPES = {
  CONNECTION: 'connection',
  NOTIFICATION: 'notification',
  VALIDATION: 'validation',
  DELIVERY: 'delivery',
  PUSH: 'push',
  BATCH: 'batch',
  RATE_LIMIT: 'rate_limit',
  SPAM: 'spam'
} as const;

export const NOTIFICATION_ERROR_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

// Utility functions
export function createNotificationMessage(
  recipientId: string,
  type: string,
  message: string,
  options?: Partial<NotificationMessageData>
): NotificationMessageData {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientId,
    type,
    message: message.trim(),
    isSeen: false,
    createDate: new Date().toISOString(),
    metadata: {
      priority: NOTIFICATION_PRIORITIES.NORMAL,
      source: 'websocket_adapter',
      ...options?.metadata
    },
    ...options
  };
}

export function createPushNotification(
  title: string,
  body: string,
  options?: Partial<PushNotificationData>
): PushNotificationData {
  return {
    id: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: title.trim(),
    body: body.trim(),
    timestamp: Date.now(),
    requireInteraction: false,
    silent: false,
    ...options
  };
}

export function createNotificationBatch(
  notifications: NotificationWebSocketMessage[],
  userId?: string
): NotificationBatchData {
  return {
    batchId: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    notifications,
    timestamp: Date.now(),
    userId,
    metadata: {
      totalNotifications: notifications.length,
      validNotifications: notifications.length,
      processingTime: 0
    }
  };
}

export function createDeliveryConfirmation(
  notificationId: string,
  userId: string,
  status: string,
  options?: Partial<NotificationDeliveryConfirmation>
): NotificationDeliveryConfirmation {
  return {
    notificationId,
    userId,
    status: status as any,
    timestamp: Date.now(),
    attempts: 0,
    ...options
  };
}

export function sanitizeNotificationContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function isValidNotificationContent(content: string, maxLength: number = 1000): boolean {
  const sanitized = sanitizeNotificationContent(content);
  return sanitized.length > 0 && sanitized.length <= maxLength;
}

export function isUrgentNotification(notification: NotificationMessageData): boolean {
  return notification.metadata?.urgent === true ||
         notification.metadata?.priority === NOTIFICATION_PRIORITIES.HIGH ||
         notification.metadata?.priority === NOTIFICATION_PRIORITIES.URGENT;
}

export function getNotificationPriority(notification: NotificationMessageData): string {
  if (notification.metadata?.priority) {
    return notification.metadata.priority;
  }

  // Determine priority based on type
  const urgentTypes = [NOTIFICATION_TYPES.SECURITY, NOTIFICATION_TYPES.ALERT];
  const highTypes = [NOTIFICATION_TYPES.SYSTEM, NOTIFICATION_TYPES.MESSAGE];
  const lowTypes = [NOTIFICATION_TYPES.MARKETING, NOTIFICATION_TYPES.NEWSLETTER];

  if (urgentTypes.includes(notification.type as any)) {
    return NOTIFICATION_PRIORITIES.HIGH;
  }

  if (highTypes.includes(notification.type as any)) {
    return NOTIFICATION_PRIORITIES.NORMAL;
  }

  if (lowTypes.includes(notification.type as any)) {
    return NOTIFICATION_PRIORITIES.LOW;
  }

  return NOTIFICATION_PRIORITIES.NORMAL;
}

export function formatNotificationTimestamp(timestamp: string | number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function formatRelativeNotificationTime(timestamp: string | number): string {
  const now = Date.now();
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diff = now - time;
  
  if (diff < 60000) { // Less than 1 minute
    return 'just now';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) { // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else if (diff < 604800000) { // Less than 1 week
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  } else {
    const weeks = Math.floor(diff / 604800000);
    return `${weeks}w ago`;
  }
}

export function shouldShowNotification(notification: NotificationMessageData, userPreferences?: any): boolean {
  // Check if notification type is enabled
  if (userPreferences?.notificationTypes?.[notification.type] === false) {
    return false;
  }

  // Check if in-app notifications are enabled
  if (userPreferences?.enableInAppNotifications === false) {
    return false;
  }

  // Check if notification is already seen
  if (notification.isSeen && userPreferences?.hideSeenNotifications === true) {
    return false;
  }

  return true;
}

export function getNotificationIcon(type: string): string {
  const iconMap: { [key: string]: string } = {
    [NOTIFICATION_TYPES.SYSTEM]: '🔧',
    [NOTIFICATION_TYPES.USER]: '👤',
    [NOTIFICATION_TYPES.SECURITY]: '🔒',
    [NOTIFICATION_TYPES.MARKETING]: '📢',
    [NOTIFICATION_TYPES.NEWSLETTER]: '📧',
    [NOTIFICATION_TYPES.REMINDER]: '⏰',
    [NOTIFICATION_TYPES.UPDATE]: '🔄',
    [NOTIFICATION_TYPES.ALERT]: '⚠️',
    [NOTIFICATION_TYPES.MESSAGE]: '💬',
    [NOTIFICATION_TYPES.FOLLOW]: '👥',
    [NOTIFICATION_TYPES.LIKE]: '❤️',
    [NOTIFICATION_TYPES.COMMENT]: '💭',
    [NOTIFICATION_TYPES.MENTION]: '@'
  };

  return iconMap[type] || '📢';
}

export function getNotificationColor(priority: string): string {
  const colorMap: { [key: string]: string } = {
    [NOTIFICATION_PRIORITIES.LOW]: '#6B7280',
    [NOTIFICATION_PRIORITIES.NORMAL]: '#3B82F6',
    [NOTIFICATION_PRIORITIES.HIGH]: '#F59E0B',
    [NOTIFICATION_PRIORITIES.URGENT]: '#EF4444'
  };

  return colorMap[priority] || '#3B82F6';
}
