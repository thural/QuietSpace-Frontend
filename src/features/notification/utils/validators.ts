/**
 * Notification Validators.
 * 
 * Validation functions for notification data and inputs.
 */

import type { NotificationResponse } from '../types/api';
import { NotificationType } from '../types/api';
import type { ResId } from '../types/api';
import type { NotificationValidationRule, NotificationValidationError } from '../types';

/**
 * Validate notification ID
 */
export const validateNotificationId = (id: string): NotificationValidationError | null => {
  if (!id || id.trim() === '') {
    return {
      field: 'id',
      message: 'Notification ID is required',
      value: id
    };
  }
  
  if (id.length > 50) {
    return {
      field: 'id',
      message: 'Notification ID must be 50 characters or less',
      value: id
    };
  }
  
  return null;
};

/**
 * Validate notification message
 */
export const validateNotificationMessage = (message: string): NotificationValidationError | null => {
  if (!message || message.trim() === '') {
    return {
      field: 'message',
      message: 'Notification message is required',
      value: message
    };
  }
  
  if (message.length > 500) {
    return {
      field: 'message',
      message: 'Notification message must be 500 characters or less',
      value: message
    };
  }
  
  return null;
};

/**
 * Validate notification type
 */
export const validateNotificationType = (type: NotificationType): NotificationValidationError | null => {
  const validTypes: NotificationType[] = [
    NotificationType.FOLLOW_REQUEST,
    NotificationType.POST_REACTION,
    NotificationType.MENTION,
    NotificationType.COMMENT,
    NotificationType.COMMENT_REACTION,
    NotificationType.COMMENT_REPLY,
    NotificationType.REPOST
  ];
  
  if (!type) {
    return {
      field: 'type',
      message: 'Notification type is required',
      value: type
    };
  }
  
  if (!validTypes.includes(type)) {
    return {
      field: 'type',
      message: `Invalid notification type. Must be one of: ${validTypes.join(', ')}`,
      value: type
    };
  }
  
  return null;
};

/**
 * Validate user ID
 */
export const validateUserId = (userId: string): NotificationValidationError | null => {
  if (!userId || userId.trim() === '') {
    return {
      field: 'userId',
      message: 'User ID is required',
      value: userId
    };
  }
  
  if (userId.length < 3) {
    return {
      field: 'userId',
      message: 'User ID must be at least 3 characters',
      value: userId
    };
  }
  
  return null;
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (page: number, size: number): NotificationValidationError | null => {
  if (page < 0) {
    return {
      field: 'page',
      message: 'Page number must be 0 or greater',
      value: page
    };
  }
  
  if (size < 1 || size > 100) {
    return {
      field: 'size',
      message: 'Page size must be between 1 and 100',
      value: size
    };
  }
  
  return null;
};

/**
 * Validate notification object using multiple rules
 */
export const validateNotification = (notification: Partial<NotificationResponse>): NotificationValidationError[] => {
  const errors: NotificationValidationError[] = [];
  const rules: NotificationValidationRule[] = [
    {
      field: 'id',
      required: true,
      minLength: 1,
      maxLength: 50
    },
    {
      field: 'type',
      required: true,
      customValidator: (value) => {
        const error = validateNotificationType(value);
        return error ? error.message : null;
      }
    },
    {
      field: 'createDate',
      required: true,
      customValidator: (value) => {
        if (!value || !(value instanceof Date) && typeof value !== 'string') {
          return 'Created date is required and must be a Date or string';
        }
        return null;
      }
    }
  ];
  
  for (const rule of rules) {
    const value = notification[rule.field as keyof NotificationResponse];
    let error: NotificationValidationError | null = null;
    
    if (rule.required && (!value || value === '')) {
      error = { field: String(rule.field), message: `${rule.field} is required`, value };
    } else if (rule.minLength && value && value.toString().length < rule.minLength) {
      error = { field: String(rule.field), message: `${rule.field} must be at least ${rule.minLength} characters`, value };
    } else if (rule.maxLength && value && value.toString().length > rule.maxLength) {
      error = { field: String(rule.field), message: `${rule.field} must be ${rule.maxLength} characters or less`, value };
    } else if (rule.customValidator && rule.customValidator) {
      const customError = rule.customValidator(value);
      if (customError) {
        if (typeof customError === 'string') {
          error = { field: String(rule.field), message: customError, value };
        } else {
          error = customError;
        }
      }
    }
    
    if (error) {
      errors.push(error);
    }
  }
  
  return errors;
};

/**
 * Check if notification is valid
 */
export const isValidNotification = (notification: Partial<NotificationResponse>): boolean => {
  return validateNotification(notification).length === 0;
};
