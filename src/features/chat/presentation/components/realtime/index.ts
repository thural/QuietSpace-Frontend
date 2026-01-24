/**
 * Real-time Components Index
 * 
 * This file exports all real-time components and utilities for easy importing
 * throughout the chat feature.
 */

// Main Real-time Components
export { default as AdvancedWebSocketManager } from './AdvancedWebSocketManager';
export { default as RealTimePresenceProvider } from './RealTimePresenceManager';
export { default as LiveCollaborationManager } from './LiveCollaborationManager';
export { default as RealTimeNotificationManager } from './RealTimeNotificationManager';

// Re-export for convenience
export {
    // WebSocket Management
    AdvancedWebSocketManager as ChatAdvancedWebSocketManager,
    
    // Presence Management
    RealTimePresenceProvider as ChatRealTimeProvider,
    
    // Collaboration
    LiveCollaborationManager as ChatLiveCollaborationManager,
    
    // Notifications
    RealTimeNotificationManager as ChatRealTimeNotificationManager
} from './AdvancedWebSocketManager';

// Components
export { UserCursor } from './LiveCollaborationManager';
export { UserSelection } from './LiveCollaborationManager';
export { DocumentLockIndicator } from './LiveCollaborationManager';
export { PresenceStatus } from './RealTimePresenceManager';
export { TypingIndicator } from './RealTimePresenceManager';
export { NotificationItem } from './RealTimeNotificationManager';
export { NotificationBell } from './RealTimeNotificationManager';

// Types and Interfaces
export type { 
    WebSocketConfig, 
    WebSocketState, 
    WebSocketMessage, 
    WebSocketMetrics 
} from './AdvancedWebSocketManager';

export type { 
    UserPresence, 
    TypingIndicator, 
    PresenceConfig 
} from './RealTimePresenceManager';

export type { 
    CollaborationEvent, 
    UserCursor, 
    UserSelection, 
    EditOperation, 
    DocumentLock, 
    CollaborationSession, 
    CollaborationConfig 
} from './LiveCollaborationManager';

export type { 
    Notification, 
    NotificationConfig, 
    NotificationFilters 
} from './RealTimeNotificationManager';

// Hooks
export { useAdvancedWebSocket } from './AdvancedWebSocketManager';
export { useRealTimePresence } from './RealTimePresenceManager';
export { useLiveCollaboration } from './LiveCollaborationManager';
export { useRealTimeNotifications } from './RealTimeNotificationManager';

// Utilities
export const RealTimeUtils = {
    // WebSocket utilities
    createWebSocketUrl: (protocol: string, host: string, port: number, path: string) => {
        return `${protocol}://${host}:${port}${path}`;
    },
    
    // Presence utilities
    generateUserColor: (userId: string) => {
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
        ];
        
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
    },
    
    // Notification utilities
    createNotificationId: () => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Collaboration utilities
    generateSessionId: () => {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Time utilities
    formatTimestamp: (timestamp: Date) => {
        return timestamp.toLocaleTimeString();
    },
    
    formatRelativeTime: (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return `${Math.floor(diff / 86400000)} days ago`;
    }
};

export default RealTimeUtils;
