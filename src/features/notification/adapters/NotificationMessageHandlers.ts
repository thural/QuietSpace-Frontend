/**
 * Notification Message Handlers
 * 
 * Provides specialized message handling for notification WebSocket messages.
 * Handles message validation, transformation, and business logic for notification operations.
 */

import { Injectable } from '@/core/modules/dependency-injection';
import { WebSocketMessage } from '@/core/websocket/types';
import { NotificationResponse, NotificationEvent } from '../domain/entities/NotificationEntities';
import { ResId } from '@/shared/api/models/common';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Message validation result
export interface NotificationValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedNotification?: NotificationResponse;
  priority?: 'low' | 'normal' | 'high';
}

// Push notification data
export interface PushNotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: number;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  timestamp: number;
  userId?: string;
}

// Notification batch data
export interface NotificationBatchData {
  batchId: string;
  notifications: NotificationResponse[];
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

// Notification delivery confirmation
export interface NotificationDeliveryConfirmation {
  notificationId: ResId;
  userId: ResId;
  status: 'delivered' | 'failed' | 'read';
  timestamp: number;
  error?: string;
  device?: string;
}

// Notification filtering result
export interface NotificationFilteringResult {
  shouldDeliver: boolean;
  reason?: string;
  quietHoursActive: boolean;
  userPreferences: {
    inApp: boolean;
    push: boolean;
    email: boolean;
  };
}

/**
 * Notification Message Handlers
 * 
 * Handles validation, transformation, and business logic for notification WebSocket messages.
 */
@Injectable()
export class NotificationMessageHandlers {
  
  /**
   * Handle incoming notification
   */
  async handleNotification(message: WebSocketMessage): Promise<NotificationValidationResult> {
    try {
      // Validate notification structure
      const validationResult = this.validateNotification(message.data);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      const notification = validationResult.sanitizedNotification!;
      
      // Apply business rules
      await this.applyNotificationBusinessRules(notification);
      
      // Transform notification if needed
      const transformedNotification = await this.transformNotification(notification);
      
      // Determine priority
      const priority = this.determineNotificationPriority(transformedNotification);
      
      return {
        isValid: true,
        errors: [],
        sanitizedNotification: transformedNotification,
        priority
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        sanitizedNotification: undefined
      };
    }
  }

  /**
   * Handle notification update
   */
  async handleNotificationUpdate(message: WebSocketMessage): Promise<NotificationValidationResult> {
    try {
      const validationResult = this.validateNotification(message.data);
      
      if (!validationResult.isValid) {
        return validationResult;
      }

      const notification = validationResult.sanitizedNotification!;
      
      // Apply update-specific business rules
      await this.applyNotificationUpdateRules(notification);
      
      // Transform notification
      const transformedNotification = await this.transformNotification(notification);
      
      const priority = this.determineNotificationPriority(transformedNotification);
      
      return {
        isValid: true,
        errors: [],
        sanitizedNotification: transformedNotification,
        priority
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        sanitizedNotification: undefined
      };
    }
  }

  /**
   * Handle notification deletion
   */
  async handleNotificationDeletion(message: WebSocketMessage): Promise<{ success: boolean; error?: string }> {
    try {
      const { notificationId, userId } = message.data;
      
      // Validate deletion data
      if (!notificationId) {
        return { success: false, error: 'Notification ID is required' };
      }

      // Apply deletion business rules
      await this.applyNotificationDeletionRules(notificationId, userId);
      
      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Handle notification read event
   */
  async handleNotificationRead(message: WebSocketMessage): Promise<{ success: boolean; error?: string }> {
    try {
      const { notificationId, userId } = message.data;
      
      // Validate read event data
      if (!notificationId || !userId) {
        return { success: false, error: 'Notification ID and User ID are required' };
      }

      // Apply read event business rules
      await this.applyNotificationReadRules(notificationId, userId);
      
      return { success: true };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Handle push notification
   */
  async handlePushNotification(message: WebSocketMessage): Promise<PushNotificationData> {
    const pushData = message.data;
    
    // Validate push notification data
    if (!pushData.title || !pushData.body) {
      throw new Error('Push notification must have title and body');
    }

    // Sanitize and validate content
    const sanitizedPushData: PushNotificationData = {
      id: pushData.id || `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: this.sanitizeText(pushData.title),
      body: this.sanitizeText(pushData.body),
      icon: pushData.icon,
      badge: pushData.badge,
      tag: pushData.tag,
      data: pushData.data || {},
      actions: pushData.actions || [],
      timestamp: Date.now(),
      userId: pushData.userId
    };

    // Apply push notification business rules
    await this.applyPushNotificationRules(sanitizedPushData);

    return sanitizedPushData;
  }

  /**
   * Handle notification batch
   */
  async handleNotificationBatch(message: WebSocketMessage): Promise<NotificationBatchData> {
    const batchData = message.data;
    
    // Validate batch data
    if (!batchData.notifications || !Array.isArray(batchData.notifications)) {
      throw new Error('Batch must contain notifications array');
    }

    const validatedNotifications: NotificationResponse[] = [];
    const errors: string[] = [];

    // Validate each notification in the batch
    for (const notification of batchData.notifications) {
      try {
        const validationResult = await this.handleNotification({ data: notification } as WebSocketMessage);
        
        if (validationResult.isValid && validationResult.sanitizedNotification) {
          validatedNotifications.push(validationResult.sanitizedNotification);
        } else {
          errors.push(`Invalid notification: ${validationResult.errors.join(', ')}`);
        }
      } catch (error) {
        errors.push(`Notification validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (validatedNotifications.length === 0) {
      throw new Error(`No valid notifications in batch. Errors: ${errors.join('; ')}`);
    }

    const batch: NotificationBatchData = {
      batchId: batchData.batchId || `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notifications: validatedNotifications,
      timestamp: Date.now(),
      userId: batchData.userId,
      metadata: {
        totalNotifications: batchData.notifications.length,
        validNotifications: validatedNotifications.length,
        errors,
        ...batchData.metadata
      }
    };

    // Apply batch processing rules
    await this.applyBatchProcessingRules(batch);

    return batch;
  }

  /**
   * Filter notifications based on user preferences and quiet hours
   */
  async filterNotification(
    notification: NotificationResponse,
    userPreferences?: any,
    quietHours?: any
  ): Promise<NotificationFilteringResult> {
    const result: NotificationFilteringResult = {
      shouldDeliver: true,
      quietHoursActive: false,
      userPreferences: {
        inApp: true,
        push: true,
        email: true
      }
    };

    // Check quiet hours
    if (quietHours?.enabled) {
      const currentTime = new Date();
      const startTime = this.parseTime(quietHours.startTime);
      const endTime = this.parseTime(quietHours.endTime);
      
      if (this.isTimeInRange(currentTime, startTime, endTime)) {
        result.quietHoursActive = true;
        
        // Only allow urgent notifications during quiet hours
        if (!this.isUrgentNotification(notification)) {
          result.shouldDeliver = false;
          result.reason = 'Quiet hours active and notification is not urgent';
        }
      }
    }

    // Check user preferences
    if (userPreferences) {
      result.userPreferences = {
        inApp: userPreferences.enableInAppNotifications !== false,
        push: userPreferences.enablePushNotifications !== false,
        email: userPreferences.enableEmailNotifications !== false
      };

      // Check notification type preferences
      if (userPreferences.notificationTypes) {
        const typeEnabled = userPreferences.notificationTypes[notification.type];
        if (typeEnabled === false) {
          result.shouldDeliver = false;
          result.reason = `Notification type ${notification.type} is disabled`;
        }
      }
    }

    return result;
  }

  /**
   * Validate notification structure and content
   */
  private validateNotification(notificationData: any): NotificationValidationResult {
    const errors: string[] = [];

    try {
      // Basic structure validation
      if (!notificationData) {
        return {
          isValid: false,
          errors: ['Notification data is required'],
          sanitizedNotification: undefined
        };
      }

      // Required fields
      if (!notificationData.id) {
        errors.push('Notification ID is required');
      }

      if (!notificationData.recipientId) {
        errors.push('Recipient ID is required');
      }

      if (!notificationData.type) {
        errors.push('Notification type is required');
      }

      if (!notificationData.message && !notificationData.content) {
        errors.push('Notification message or content is required');
      }

      // Content validation
      const content = notificationData.message || notificationData.content || '';
      if (typeof content !== 'string') {
        errors.push('Notification content must be a string');
      } else if (content.trim().length === 0) {
        errors.push('Notification content cannot be empty');
      } else if (content.length > 1000) {
        errors.push('Notification content too long (max 1000 characters)');
      }

      // Check for forbidden content
      if (this.containsForbiddenContent(content)) {
        errors.push('Notification contains forbidden content');
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          errors,
          sanitizedNotification: undefined
        };
      }

      // Sanitize notification
      const sanitizedNotification = this.sanitizeNotification(notificationData);

      return {
        isValid: true,
        errors: [],
        sanitizedNotification
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
        sanitizedNotification: undefined
      };
    }
  }

  /**
   * Apply business rules to notification
   */
  private async applyNotificationBusinessRules(notification: NotificationResponse): Promise<void> {
    // Add timestamp if not present
    if (!notification.createDate) {
      notification.createDate = new Date().toISOString();
    }

    // Add ID if not present
    if (!notification.id) {
      notification.id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Set default values
    if (notification.isSeen === undefined) {
      notification.isSeen = false;
    }

    // Add metadata if not present
    if (!notification.metadata) {
      notification.metadata = {};
    }

    notification.metadata.processedAt = Date.now();
    notification.metadata.version = '1.0';
  }

  /**
   * Apply update-specific business rules
   */
  private async applyNotificationUpdateRules(notification: NotificationResponse): Promise<void> {
    // Add update timestamp
    if (!notification.updateDate) {
      notification.updateDate = new Date().toISOString();
    }

    // Mark as updated in metadata
    if (!notification.metadata) {
      notification.metadata = {};
    }

    notification.metadata.updatedAt = Date.now();
    notification.metadata.lastUpdateAction = 'websocket_update';
  }

  /**
   * Apply deletion business rules
   */
  private async applyNotificationDeletionRules(notificationId: ResId, userId?: ResId): Promise<void> {
    // Log deletion for audit
    console.log(`Notification ${notificationId} deleted by user ${userId || 'system'} at ${new Date().toISOString()}`);
    
    // Additional deletion logic would go here
    // - Check permissions
    // - Update audit logs
    // - Notify other systems
  }

  /**
   * Apply read event business rules
   */
  private async applyNotificationReadRules(notificationId: ResId, userId: ResId): Promise<void> {
    // Log read event for analytics
    console.log(`Notification ${notificationId} read by user ${userId} at ${new Date().toISOString()}`);
    
    // Additional read logic would go here
    // - Update read statistics
    // - Trigger follow-up actions
    // - Update user engagement metrics
  }

  /**
   * Apply push notification rules
   */
  private async applyPushNotificationRules(pushData: PushNotificationData): Promise<void> {
    // Add platform-specific data
    if (!pushData.data) {
      pushData.data = {};
    }

    pushData.data.platform = 'web';
    pushData.data.source = 'websocket_adapter';
    pushData.data.version = '1.0';
  }

  /**
   * Apply batch processing rules
   */
  private async applyBatchProcessingRules(batch: NotificationBatchData): Promise<void> {
    // Sort notifications by priority
    batch.notifications.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const aPriority = this.determineNotificationPriority(a);
      const bPriority = this.determineNotificationPriority(b);
      return priorityOrder[bPriority] - priorityOrder[aPriority];
    });

    // Add batch metadata
    if (!batch.metadata) {
      batch.metadata = {};
    }

    batch.metadata.processedAt = Date.now();
    batch.metadata.totalNotifications = batch.notifications.length;
    batch.metadata.batchSize = batch.notifications.length;
  }

  /**
   * Transform notification if needed
   */
  private async transformNotification(notification: NotificationResponse): Promise<NotificationResponse> {
    const transformed = { ...notification };

    // Process content
    if (transformed.message) {
      transformed.message = this.processNotificationContent(transformed.message);
    }

    // Add processed metadata
    if (!transformed.metadata) {
      transformed.metadata = {};
    }

    transformed.metadata.transformedAt = Date.now();
    transformed.metadata.transformer = 'notification_message_handlers';

    return transformed;
  }

  /**
   * Sanitize notification
   */
  private sanitizeNotification(notification: any): NotificationResponse {
    const sanitized = { ...notification };

    // Sanitize content
    if (sanitized.message) {
      sanitized.message = this.sanitizeText(sanitized.message);
    }

    if (sanitized.content) {
      sanitized.content = this.sanitizeText(sanitized.content);
    }

    // Ensure required fields have proper types
    sanitized.id = String(sanitized.id || '');
    sanitized.recipientId = String(sanitized.recipientId || '');
    sanitized.type = String(sanitized.type || '');
    sanitized.isSeen = Boolean(sanitized.isSeen);

    return sanitized as NotificationResponse;
  }

  /**
   * Sanitize text content
   */
  private sanitizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Process notification content
   */
  private processNotificationContent(content: string): string {
    // Process mentions
    let processed = content.replace(/@(\w+)/g, '<mention>$1</mention>');
    
    // Process links
    processed = processed.replace(/(https?:\/\/[^\s]+)/g, '<link>$1</link>');
    
    // Process emojis (basic)
    processed = processed.replace(/:([a-z_]+):/g, (match, emojiName) => {
      const emojiMap: { [key: string]: string } = {
        'smile': '😊',
        'heart': '❤️',
        'thumbsup': '👍',
        'warning': '⚠️',
        'info': 'ℹ️'
      };
      return emojiMap[emojiName] || match;
    });

    return processed;
  }

  /**
   * Determine notification priority
   */
  private determineNotificationPriority(notification: NotificationResponse): 'low' | 'normal' | 'high' {
    // Check metadata for explicit priority
    if (notification.metadata?.priority) {
      const priority = notification.metadata.priority;
      if (['low', 'normal', 'high'].includes(priority)) {
        return priority as 'low' | 'normal' | 'high';
      }
    }

    // Determine based on notification type
    const highPriorityTypes = ['system_alert', 'security', 'urgent_message', 'account_suspended'];
    const lowPriorityTypes = ['marketing', 'newsletter', 'update', 'reminder'];

    if (highPriorityTypes.includes(notification.type)) {
      return 'high';
    }

    if (lowPriorityTypes.includes(notification.type)) {
      return 'low';
    }

    return 'normal';
  }

  /**
   * Check if notification is urgent
   */
  private isUrgentNotification(notification: NotificationResponse): boolean {
    return this.determineNotificationPriority(notification) === 'high';
  }

  /**
   * Check for forbidden content
   */
  private containsForbiddenContent(content: string): boolean {
    const forbiddenWords = ['spam', 'abuse', 'inappropriate', 'malicious'];
    const lowerContent = content.toLowerCase();
    return forbiddenWords.some(word => lowerContent.includes(word));
  }

  /**
   * Parse time string to Date object
   */
  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /**
   * Check if current time is in range
   */
  private isTimeInRange(current: Date, start: Date, end: Date): boolean {
    const currentTime = current.getHours() * 60 + current.getMinutes();
    const startTime = start.getHours() * 60 + start.getMinutes();
    const endTime = end.getHours() * 60 + end.getMinutes();

    if (startTime <= endTime) {
      // Same day range
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Overnight range
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Get notification statistics
   */
  getNotificationStats(notification: NotificationResponse): {
    contentLength: number;
    wordCount: number;
    hasMentions: boolean;
    hasLinks: boolean;
    priority: string;
  } {
    const content = notification.message || notification.content || '';
    
    return {
      contentLength: content.length,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      hasMentions: /@\w+/.test(content),
      hasLinks: /https?:\/\/[^\s]+/.test(content),
      priority: this.determineNotificationPriority(notification)
    };
  }

  /**
   * Check if notification should be batched
   */
  shouldBatchNotification(notification: NotificationResponse): boolean {
    // Don't batch urgent notifications
    if (this.isUrgentNotification(notification)) {
      return false;
    }

    // Batch low and normal priority notifications
    return ['low', 'normal'].includes(this.determineNotificationPriority(notification));
  }

  /**
   * Get notification delivery channels
   */
  getDeliveryChannels(notification: NotificationResponse, userPreferences?: any): string[] {
    const channels: string[] = [];

    if (userPreferences?.enableInAppNotifications !== false) {
      channels.push('in_app');
    }

    if (userPreferences?.enablePushNotifications !== false) {
      channels.push('push');
    }

    if (userPreferences?.enableEmailNotifications !== false) {
      channels.push('email');
    }

    return channels;
  }
}
