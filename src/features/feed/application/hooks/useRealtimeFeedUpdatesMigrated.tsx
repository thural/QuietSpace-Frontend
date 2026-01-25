/**
 * Migrated Feed Real-time Updates Hook
 * 
 * This is the migrated version of useRealtimeFeedUpdates that uses the enterprise WebSocket infrastructure
 * through the migration hook. It maintains the same API as the original hook while providing
 * enterprise-grade features and gradual migration capabilities.
 */

import { useFeedSocketMigration } from '../adapters/FeedSocketMigration';
import type { RealtimePostUpdate } from './useRealtimeFeedUpdates';

/**
 * Migrated version of useRealtimeFeedUpdates with enterprise WebSocket infrastructure.
 * 
 * This hook provides the same API as the original useRealtimeFeedUpdates but uses the
 * enterprise WebSocket infrastructure under the hood. It includes:
 * 
 * - Automatic fallback to legacy implementation
 * - Performance monitoring and metrics
 * - Enterprise-grade error handling
 * - Gradual migration support
 * 
 * @returns {{
 *     connect: () => void,                    // Function to connect to WebSocket
 *     disconnect: () => void,                 // Function to disconnect from WebSocket
 *     sendMessage: (message: any) => void,    // Function to send message to WebSocket
 *     isConnected: boolean,                   // Indicates if the WebSocket client is connected
 *     migration: object                       // Migration state and metrics
 * }}
 */
const useRealtimeFeedUpdatesMigrated = () => {
  // Use the migration hook with default configuration
  const migrationHook = useFeedSocketMigration({
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
    connect,
    disconnect,
    sendMessage,
    isConnected,
    migration
  } = migrationHook;

  // Return the same API as the original hook with additional migration info
  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    migration // Additional migration state for monitoring
  };
};

export default useRealtimeFeedUpdatesMigrated;
