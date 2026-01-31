/**
 * WebSocket Hooks Index.
 * 
 * Exports all WebSocket React hooks for enterprise functionality.
 */

// Export all hooks
export {
    useEnterpriseWebSocket,
    useFeatureWebSocket,
    useWebSocketMigration
} from './useEnterpriseWebSocket.js';

// Re-export for backward compatibility
export { useEnterpriseWebSocket as useWebSocket } from './useEnterpriseWebSocket.js';

// Export types
export {
    UseEnterpriseWebSocketOptions,
    UseFeatureWebSocketOptions,
    WebSocketConnectionState,
    WebSocketMetrics,
    WebSocketMigrationConfig,
    WebSocketMigrationState
} from './useEnterpriseWebSocket.js';
