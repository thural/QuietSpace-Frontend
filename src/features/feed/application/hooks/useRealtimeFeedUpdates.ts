/**
 * Feed Real-time Signal Updates.
 * 
 * WebSocket-based real-time updates for Feed feature.
 * Handles live post updates, reactions, and synchronization.
 * Integrates with Zustand store for state management.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useFeedUIStore } from '../stores/feedUIStore';
import type { PostResponse } from '@/features/feed/data/models/post';

/**
 * Real-time update types
 */
export interface RealtimePostUpdate {
    type: 'post_created' | 'post_updated' | 'post_deleted' | 'reaction_added' | 'reaction_removed' | 'comment_added' | 'comment_removed';
    postId: string;
    userId?: string;
    data: any;
    timestamp: Date;
}

/**
 * WebSocket connection status
 */
export interface WebSocketStatus {
    connected: boolean;
    connecting: boolean;
    error: string | null;
    lastConnected: Date | null;
}

/**
 * Real-time feed updates hook
 */
export const useRealtimeFeedUpdates = () => {
    const {
        setConnectionStatus,
        setLastSyncTime,
        addOptimisticUpdate,
        removeOptimisticUpdate
    } = useFeedUIStore();

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);

    /**
     * Handle incoming WebSocket messages
     */
    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const update: RealtimePostUpdate = JSON.parse(event.data);

            switch (update.type) {
                case 'post_created':
                    handlePostCreated(update);
                    break;
                case 'post_updated':
                    handlePostUpdated(update);
                    break;
                case 'post_deleted':
                    handlePostDeleted(update);
                    break;
                case 'reaction_added':
                    handleReactionAdded(update);
                    break;
                case 'reaction_removed':
                    handleReactionRemoved(update);
                    break;
                case 'comment_added':
                    handleCommentAdded(update);
                    break;
                case 'comment_removed':
                    handleCommentRemoved(update);
                    break;
            }

            setLastSyncTime(new Date());
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }, [setLastSyncTime]);

    /**
     * Handle post creation
     */
    const handlePostCreated = useCallback((update: RealtimePostUpdate) => {
        // Add optimistic update for new post
        addOptimisticUpdate({
            id: update.postId,
            type: 'create',
            timestamp: update.timestamp,
            data: update.data
        });

        // Remove optimistic update after delay (simulating server confirmation)
        setTimeout(() => {
            removeOptimisticUpdate(update.postId);
        }, 1000);
    }, [addOptimisticUpdate, removeOptimisticUpdate]);

    /**
     * Handle post update
     */
    const handlePostUpdated = useCallback((update: RealtimePostUpdate) => {
        // Post updates are handled by React Query refetch
        // Just update sync time to show user data is fresh
        setLastSyncTime(new Date());
    }, [setLastSyncTime]);

    /**
     * Handle post deletion
     */
    const handlePostDeleted = useCallback((update: RealtimePostUpdate) => {
        // Add optimistic update for deletion
        addOptimisticUpdate({
            id: update.postId,
            type: 'delete',
            timestamp: update.timestamp,
            data: update.data
        });

        // Remove optimistic update after delay
        setTimeout(() => {
            removeOptimisticUpdate(update.postId);
        }, 1000);
    }, [addOptimisticUpdate, removeOptimisticUpdate]);

    /**
     * Handle reaction addition
     */
    const handleReactionAdded = useCallback((update: RealtimePostUpdate) => {
        // Reactions are handled by React Query refetch
        setLastSyncTime(new Date());
    }, [setLastSyncTime]);

    /**
     * Handle reaction removal
     */
    const handleReactionRemoved = useCallback((update: RealtimePostUpdate) => {
        // Reactions are handled by React Query refetch
        setLastSyncTime(new Date());
    }, [setLastSyncTime]);

    /**
     * Handle comment addition
     */
    const handleCommentAdded = useCallback((update: RealtimePostUpdate) => {
        // Comments are handled by React Query refetch
        setLastSyncTime(new Date());
    }, [setLastSyncTime]);

    /**
     * Handle comment removal
     */
    const handleCommentRemoved = useCallback((update: RealtimePostUpdate) => {
        // Comments are handled by React Query refetch
        setLastSyncTime(new Date());
    }, [setLastSyncTime]);

    /**
     * Connect to WebSocket
     */
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setConnectionStatus('connecting');

        try {
            const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/feed-updates';
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setConnectionStatus('connected');
                reconnectAttemptsRef.current = 0;
                setLastSyncTime(new Date());
            };

            ws.onmessage = handleMessage;

            ws.onclose = (event) => {
                setConnectionStatus('disconnected');
                wsRef.current = null;

                // Attempt reconnection if not intentional
                if (!event.wasClean && reconnectAttemptsRef.current < 5) {
                    scheduleReconnect();
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('error');
            };

        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            setConnectionStatus('error');
        }
    }, [handleMessage, setConnectionStatus, setLastSyncTime]);

    /**
     * Schedule reconnection attempt
     */
    const scheduleReconnect = useCallback(() => {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);

        reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
        }, delay);
    }, [connect]);

    /**
     * Disconnect from WebSocket
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setConnectionStatus('disconnected');
    }, [setConnectionStatus]);

    /**
     * Send message to WebSocket
     */
    const sendMessage = useCallback((message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        connect,
        disconnect,
        sendMessage,
        isConnected: useFeedUIStore(state => state.connectionStatus === 'connected')
    };
};
