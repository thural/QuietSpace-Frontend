/**
 * Real-time Components Index
 * 
 * This file exports all real-time components and utilities for easy importing
 * throughout the chat feature.
 * 
 * NOTE: Advanced real-time components have been moved to the core WebSocket system
 * to maintain proper separation of concerns and enterprise architecture.
 */

// Re-export core WebSocket hooks for convenience
export {
    useEnterpriseWebSocket,
    useFeatureWebSocket,
    useWebSocketConnection,
    useWebSocketMetrics
} from '@/core/websocket/hooks/useEnterpriseWebSocket';

// Export types from core WebSocket system
export type {
    UseEnterpriseWebSocketOptions,
    UseFeatureWebSocketOptions,
    WebSocketConnectionState,
    WebSocketMetrics
} from '@/core/websocket/hooks/useEnterpriseWebSocket';

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
        return `${Math.floor(diff / 8640000)} days ago`;
    }
};

export default RealTimeUtils;
