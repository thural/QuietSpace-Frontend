/**
 * Migrated Chat Socket Hook
 * 
 * This is the migrated version of useChatSocket that uses the enterprise WebSocket infrastructure
 * through the migration hook. It maintains the same API as the original hook while providing
 * enterprise-grade features and gradual migration capabilities.
 */

import { useChatSocketMigration } from '../adapters/ChatSocketMigration';
import type { MessageRequest, MessageResponse } from './models/chat';
import type { ResId } from '@/shared/api/models/common';

/**
 * Migrated version of useChatSocket with enterprise WebSocket infrastructure.
 * 
 * This hook provides the same API as the original useChatSocket but uses the
 * enterprise WebSocket infrastructure under the hood. It includes:
 * 
 * - Automatic fallback to legacy implementation
 * - Performance monitoring and metrics
 * - Enterprise-grade error handling
 * - Gradual migration support
 * 
 * @returns {{
 *     sendChatMessage: (inputData: MessageRequest) => void, // Function to send a chat message.
 *     deleteChatMessage: (messageId: ResId) => void,        // Function to delete a chat message.
 *     setMessageSeen: (messageId: ResId) => void,           // Function to mark a message as seen.
 *     isClientConnected: boolean,                           // Indicates if the WebSocket client is connected.
 *     migration: object                                      // Migration state and metrics
 * }}
 */
const useChatSocketMigrated = () => {
  // Use the migration hook with default configuration
  const migrationHook = useChatSocketMigration({
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
    sendChatMessage,
    deleteChatMessage,
    setMessageSeen,
    isClientConnected,
    migration
  } = migrationHook;

  // Return the same API as the original hook with additional migration info
  return {
    sendChatMessage,
    deleteChatMessage,
    setMessageSeen,
    isClientConnected,
    migration // Additional migration state for monitoring
  };
};

export default useChatSocketMigrated;
