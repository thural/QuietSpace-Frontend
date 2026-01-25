/**
 * Migrated Notification Socket Hook
 * 
 * This is the migrated version of useNotificationSocket that uses the enterprise WebSocket infrastructure
 * through the migration hook. It maintains the same API as the original hook while providing
 * enterprise-grade features and gradual migration capabilities.
 */

import { useNotificationSocketMigration } from '../adapters/NotificationSocketMigration';
import type { ResId } from '@/shared/api/models/common';

/**
 * Migrated version of useNotificationSocket with enterprise WebSocket infrastructure.
 * 
 * This hook provides the same API as the original useNotificationSocket but uses the
 * enterprise WebSocket infrastructure under the hood. It includes:
 * 
 * - Automatic fallback to legacy implementation
 * - Performance monitoring and metrics
 * - Enterprise-grade error handling
 * - Gradual migration support
 * 
 * @returns {{
 *     setNotificationSeen: (notificationId: ResId) => void, // Function to mark a notification as seen.
 *     isClientConnected: boolean,                           // Indicates if the WebSocket client is connected.
 *     migration: object                                      // Migration state and metrics
 * }}
 */
const useNotificationSocketMigrated = () => {
  // Use the migration hook with default configuration
  const migrationHook = useNotificationSocketMigration({
    // Enable enterprise hooks in development by default
    useEnterprise: process.env.NODE_ENV === 'development',
    // Enable fallback for production safety
    enableFallback: true,
    // Set reasonable timeout for fallback
    fallbackTimeout: 5000,
    // Enable performance monitoring
    enablePerformanceMonitoring: true,
    // Log migration events in development
    logMigrationEvents: process.env.NODE_ENV === 'development'
  });

  // Extract the standard API methods
  const {
    setNotificationSeen,
    isClientConnected,
    migration
  } = migrationHook;

  // Return the same API as the original hook with additional migration info
  return {
    setNotificationSeen,
    isClientConnected,
    migration // Additional migration state for monitoring
  };
};

export default useNotificationSocketMigrated;
