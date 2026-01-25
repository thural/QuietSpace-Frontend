/**
 * Notification WebSocket Adapters
 * 
 * Exports all notification WebSocket adapter components and types.
 * Provides enterprise-grade WebSocket functionality for notification features.
 */

// Main adapter
export { NotificationWebSocketAdapter } from './NotificationWebSocketAdapter';

// Message handlers
export { NotificationMessageHandlers } from './NotificationMessageHandlers';

// Types and interfaces
export {
  // Core types
  type NotificationWebSocketMessage,
  type NotificationMessageData,
  type NotificationAction,
  type PushNotificationData,
  type PushNotificationAction,
  type NotificationBatchData,
  type NotificationDeliveryConfirmation,
  
  // Configuration
  type NotificationAdapterConfig,
  
  // Metrics and monitoring
  type NotificationAdapterMetrics,
  type NotificationWebSocketError,
  
  // Event handlers
  type NotificationEventHandlers,
  
  // Subscriptions
  type NotificationSubscriptionOptions,
  type NotificationBatch,
  type NotificationQueue,
  type QueuedNotification,
  
  // Cache
  type NotificationCacheKeys,
  
  // Feature configuration
  type NotificationWebSocketFeatureConfig,
  
  // Interfaces
  type INotificationWebSocketAdapter,
  type INotificationWebSocketFactory,
  
  // Type guards
  isNotificationWebSocketMessage,
  isNotificationMessageData,
  isPushNotificationData,
  isNotificationBatchData,
  isNotificationDeliveryConfirmation,
  isNotificationWebSocketError
} from './NotificationWebSocketTypes';

// Constants
export const NOTIFICATION_WEBSOCKET_FEATURE_NAME = 'notification';

export const DEFAULT_NOTIFICATION_ADAPTER_CONFIG = {
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
    endTime: '08:00',
    timezone: 'UTC'
  },
  priorityRouting: true,
  contentFiltering: true,
  spamDetection: true,
  rateLimiting: {
    enabled: true,
    maxNotificationsPerMinute: 30,
    maxNotificationsPerHour: 200
  }
};

export const NOTIFICATION_CACHE_KEYS: NotificationCacheKeys = {
  notifications: (userId: string) => `notification:${userId}:notifications`,
  notification: (userId: string, notificationId: string) => `notification:${userId}:${notificationId}`,
  unreadCount: (userId: string) => `notification:${userId}:unread_count`,
  userPreferences: (userId: string) => `notification:${userId}:preferences`,
  deliveryStatus: (notificationId: string) => `notification:delivery:${notificationId}`,
  batchStatus: (batchId: string) => `notification:batch:${batchId}`,
  quietHours: (userId: string) => `notification:${userId}:quiet_hours`,
  rateLimit: (userId: string) => `notification:${userId}:rate_limit`
};

export const NOTIFICATION_WEBSOCKET_EVENTS = {
  // Notification events
  NOTIFICATION_CREATED: 'notification:created',
  NOTIFICATION_UPDATED: 'notification:updated',
  NOTIFICATION_DELETED: 'notification:deleted',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELIVERED: 'notification:delivered',
  NOTIFICATION_FAILED: 'notification:failed',
  
  // Push notification events
  PUSH_NOTIFICATION_SENT: 'notification:push:sent',
  PUSH_NOTIFICATION_DELIVERED: 'notification:push:delivered',
  PUSH_NOTIFICATION_CLICKED: 'notification:push:clicked',
  PUSH_NOTIFICATION_DISMISSED: 'notification:push:dismissed',
  PUSH_NOTIFICATION_FAILED: 'notification:push:failed',
  
  // Batch events
  BATCH_STARTED: 'notification:batch:started',
  BATCH_PROCESSED: 'notification:batch:processed',
  BATCH_FAILED: 'notification:batch:failed',
  BATCH_TIMEOUT: 'notification:batch:timeout',
  
  // Connection events
  NOTIFICATION_CONNECTED: 'notification:connected',
  NOTIFICATION_DISCONNECTED: 'notification:disconnected',
  NOTIFICATION_RECONNECTING: 'notification:reconnecting',
  NOTIFICATION_ERROR: 'notification:error',
  
  // User preference events
  PREFERENCES_UPDATED: 'notification:preferences:updated',
  QUIET_HOURS_CHANGED: 'notification:quiet_hours:changed',
  
  // Rate limiting events
  RATE_LIMIT_EXCEEDED: 'notification:rate_limit:exceeded',
  RATE_LIMIT_RESET: 'notification:rate_limit:reset',
  
  // Cache events
  NOTIFICATION_CACHE_INVALIDATED: 'notification:cache:invalidated',
  NOTIFICATION_CACHE_CLEARED: 'notification:cache:cleared'
} as const;

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

export function getNotificationTypeLabel(type: string): string {
  const labelMap: { [key: string]: string } = {
    [NOTIFICATION_TYPES.SYSTEM]: 'System',
    [NOTIFICATION_TYPES.USER]: 'User Activity',
    [NOTIFICATION_TYPES.SECURITY]: 'Security',
    [NOTIFICATION_TYPES.MARKETING]: 'Marketing',
    [NOTIFICATION_TYPES.NEWSLETTER]: 'Newsletter',
    [NOTIFICATION_TYPES.REMINDER]: 'Reminder',
    [NOTIFICATION_TYPES.UPDATE]: 'Update',
    [NOTIFICATION_TYPES.ALERT]: 'Alert',
    [NOTIFICATION_TYPES.MESSAGE]: 'Message',
    [NOTIFICATION_TYPES.FOLLOW]: 'Follow',
    [NOTIFICATION_TYPES.LIKE]: 'Like',
    [NOTIFICATION_TYPES.COMMENT]: 'Comment',
    [NOTIFICATION_TYPES.MENTION]: 'Mention'
  };

  return labelMap[type] || 'Notification';
}

export function getNotificationChannelLabel(channel: string): string {
  const labelMap: { [key: string]: string } = {
    [NOTIFICATION_CHANNELS.IN_APP]: 'In-App',
    [NOTIFICATION_CHANNELS.PUSH]: 'Push',
    [NOTIFICATION_CHANNELS.EMAIL]: 'Email',
    [NOTIFICATION_CHANNELS.SMS]: 'SMS'
  };

  return labelMap[channel] || channel;
}

export function getNotificationPriorityLabel(priority: string): string {
  const labelMap: { [key: string]: string } = {
    [NOTIFICATION_PRIORITIES.LOW]: 'Low',
    [NOTIFICATION_PRIORITIES.NORMAL]: 'Normal',
    [NOTIFICATION_PRIORITIES.HIGH]: 'High',
    [NOTIFICATION_PRIORITIES.URGENT]: 'Urgent'
  };

  return labelMap[priority] || priority;
}

export function getNotificationErrorTypeLabel(errorType: string): string {
  const labelMap: { [key: string]: string } = {
    [NOTIFICATION_ERROR_TYPES.CONNECTION]: 'Connection Error',
    [NOTIFICATION_ERROR_TYPES.NOTIFICATION]: 'Notification Error',
    [NOTIFICATION_ERROR_TYPES.VALIDATION]: 'Validation Error',
    [NOTIFICATION_ERROR_TYPES.DELIVERY]: 'Delivery Error',
    [NOTIFICATION_ERROR_TYPES.PUSH]: 'Push Error',
    [NOTIFICATION_ERROR_TYPES.BATCH]: 'Batch Error',
    [NOTIFICATION_ERROR_TYPES.RATE_LIMIT]: 'Rate Limit Error',
    [NOTIFICATION_ERROR_TYPES.SPAM]: 'Spam Detection'
  };

  return labelMap[errorType] || errorType;
}

export function getNotificationErrorSeverityLabel(severity: string): string {
  const labelMap: { [key: string]: string } = {
    [NOTIFICATION_ERROR_SEVERITIES.LOW]: 'Low',
    [NOTIFICATION_ERROR_SEVERITIES.MEDIUM]: 'Medium',
    [NOTIFICATION_ERROR_SEVERITIES.HIGH]: 'High',
    [NOTIFICATION_ERROR_SEVERITIES.CRITICAL]: 'Critical'
  };

  return labelMap[severity] || severity;
}

// Validation utilities
export function validateNotificationMessage(message: NotificationMessageData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!message.id) {
    errors.push('Notification ID is required');
  }

  if (!message.recipientId) {
    errors.push('Recipient ID is required');
  }

  if (!message.type) {
    errors.push('Notification type is required');
  }

  const content = message.message || message.content || '';
  if (!content || content.trim().length === 0) {
    errors.push('Notification content is required');
  } else if (content.length > 1000) {
    errors.push('Notification content too long (max 1000 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePushNotification(pushData: PushNotificationData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!pushData.id) {
    errors.push('Push notification ID is required');
  }

  if (!pushData.title || pushData.title.trim().length === 0) {
    errors.push('Push notification title is required');
  }

  if (!pushData.body || pushData.body.trim().length === 0) {
    errors.push('Push notification body is required');
  }

  if (pushData.title && pushData.title.length > 100) {
    errors.push('Push notification title too long (max 100 characters)');
  }

  if (pushData.body && pushData.body.length > 500) {
    errors.push('Push notification body too long (max 500 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Rate limiting utilities
export function checkRateLimit(
  userId: string,
  currentCount: number,
  maxPerMinute: number,
  maxPerHour: number,
  lastMinuteReset: number,
  lastHourReset: number
): {
  allowed: boolean;
  resetTime?: number;
  reason?: string;
} {
  const now = Date.now();
  const minuteAgo = now - 60000;
  const hourAgo = now - 3600000;

  // Check minute limit
  if (now - lastMinuteReset < 60000 && currentCount >= maxPerMinute) {
    return {
      allowed: false,
      resetTime: lastMinuteReset + 60000,
      reason: 'Minute rate limit exceeded'
    };
  }

  // Check hour limit
  if (now - lastHourReset < 3600000 && currentCount >= maxPerHour) {
    return {
      allowed: false,
      resetTime: lastHourReset + 3600000,
      reason: 'Hour rate limit exceeded'
    };
  }

  return { allowed: true };
}

// Quiet hours utilities
export function isQuietHoursActive(
  quietHours: { enabled: boolean; startTime: string; endTime: string; timezone?: string },
  currentTime: Date = new Date()
): boolean {
  if (!quietHours.enabled) {
    return false;
  }

  const [startHour, startMinute] = quietHours.startTime.split(':').map(Number);
  const [endHour, endMinute] = quietHours.endTime.split(':').map(Number);
  
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  if (startTimeInMinutes <= endTimeInMinutes) {
    // Same day range (e.g., 22:00 to 08:00 next day would be handled below)
    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
  } else {
    // Overnight range (e.g., 22:00 to 08:00)
    return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes <= endTimeInMinutes;
  }
}

export function getNextQuietHoursChange(
  quietHours: { enabled: boolean; startTime: string; endTime: string },
  currentTime: Date = new Date()
): Date {
  if (!quietHours.enabled) {
    return new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Next day
  }

  const [startHour, startMinute] = quietHours.startTime.split(':').map(Number);
  const [endHour, endMinute] = quietHours.endTime.split(':').map(Number);
  
  const today = new Date(currentTime);
  const tomorrow = new Date(currentTime);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startTimeToday = new Date(today);
  startTimeToday.setHours(startHour, startMinute, 0, 0);

  const endTimeToday = new Date(today);
  endTimeToday.setHours(endHour, endMinute, 0, 0);

  const startTimeTomorrow = new Date(tomorrow);
  startTimeTomorrow.setHours(startHour, startMinute, 0, 0);

  const endTimeTomorrow = new Date(tomorrow);
  endTimeTomorrow.setHours(endHour, endMinute, 0, 0);

  if (currentTime < startTimeToday) {
    return startTimeToday;
  } else if (currentTime < endTimeToday) {
    return endTimeToday;
  } else if (startHour > endHour) {
    // Overnight range
    return startTimeTomorrow;
  } else {
    return startTimeTomorrow;
  }
}
