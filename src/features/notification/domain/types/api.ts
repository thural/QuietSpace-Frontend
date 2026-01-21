/**
 * API Types Barrel Export.
 * 
 * Centralized exports for API types used in the notification feature.
 * This provides a clean import path and avoids long relative imports.
 * 
 * Note: Using relative paths here due to TypeScript alias resolution issues.
 * The benefit is that all other files can use the clean '../types/api' import.
 */

// Import the enum for runtime use
export { NotificationType } from '@/features/notification/data/models/notificationNative';

// Re-export API types
export type {
  NotificationPage,
  NotificationResponse
} from '@/features/notification/data/models/notification';

export type {
  ResId,
  JwtToken
} from '@/shared/api/models/common';
