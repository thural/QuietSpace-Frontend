/**
 * Data Transformation Utilities.
 *
 * Helper functions for transforming data between different layers.
 * Ensures consistent data mapping and validation.
 */

import {
  ValidationError,
  AuthenticationFailure,
  AuthorizationFailure,
  NetworkFailure
} from '../errors/failures';

/**
 * Transform API post response to domain entity
 */
export const transformPost = (apiPost: any): any => {
  // This will be implemented when we have the PostFactory
  // For now, return the transformed data
  return {
    ...apiPost,
    // Add any necessary transformations
    transformedAt: new Date().toISOString()
  };
};

/**
 * Transform API error to domain failure
 */
export const transformError = (error: any): Error => {
  if (error.response) {
    // API error
    const statusCode = error.response.status;
    const message = error.response.data?.message || error.message;

    switch (statusCode) {
      case 400:
        return new ValidationError(message);
      case 401:
        return new AuthenticationFailure(message);
      case 403:
        return new AuthorizationFailure(message);
      case 404:
        return new NetworkFailure('Resource not found');
      case 429:
        return new NetworkFailure('Too many requests');
      case 500:
        return new NetworkFailure('Server error');
      default:
        return new NetworkFailure(message);
    }
  } else if (error.request) {
    // Network error
    return new NetworkFailure('Network connection failed');
  } else {
    // Unknown error
    return new NetworkFailure(error.message || 'Unknown error');
  }
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^>]*>)*>/gi, '')
    .replace(/javascript:/gi, '')
    .substring(0, 1000); // Limit length
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
