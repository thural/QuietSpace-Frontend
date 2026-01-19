/**
 * Notification Validators.
 * 
 * Validation functions for notification data and inputs.
 */

import type { NotificationResponse, NotificationType } from '@api/schemas/inferred/notification';
import type { ResId } from '@api/schemas/inferred/common';
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
  const validTypes: NotificationType[] = ['message', 'follow', 'like', 'comment', 'mention', 'system'];
  
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
      field: 'message',
      required: true,
      minLength: 1,
      maxLength: 500
    },
    {
      field: 'type',
      required: true,
      customValidator: validateNotificationType
    },
    {
      field: 'createdAt',
      required: true,
      customValidator: (value) => {
        if (!value || !(value instanceof Date)) {
          return 'Created date is required and must be a Date';
        }
        return null;
      }
    }
    }
  ];
  
  for (const rule of rules) {
    const value = notification[rule.field as keyof NotificationResponse];
    const error = rule.required && (!value || value === '') 
      ? { field: rule.field, message: `${rule.field} is required`, value }
      : rule.minLength && value && value.toString().length < rule.minLength
      ? { field: rule.field, message: `${rule.field} must be at least ${rule.minLength} characters`, value }
      : rule.maxLength && value && value.toString().length > rule.maxLength
      ? { field: rule.field, message: `${rule.field} must be ${rule.maxLength} characters or less`, value }
      : rule.customValidator && rule.customValidator
      ? rule.customValidator(value)
      : null;
    
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
