/**
 * Real-time Notification Service.
 * 
 * Service for managing real-time notification updates via WebSocket.
 * Handles connection management, message processing, and state synchronization.
 */

import { useEffect, useRef, useCallback } from 'react';
import type { NotificationEvent, NotificationMessage } from '../../domain/entities/NotificationEntities';
import type { NotificationResponse } from '@api/schemas/inferred/notification';
import { useNotificationUIStore } from '../stores/notificationUIStore';

/**
 * WebSocket connection status.
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Real-time notification event types.
 */
export interface RealtimeNotificationEvent {
    type: 'NOTIFICATION_CREATED' | 'NOTIFICATION_UPDATED' | 'NOTIFICATION_DELETED' | 'NOTIFICATION_READ';
    data: NotificationEvent;
    timestamp: string;
}

/**
 * Real-time notification service interface.
 */
export interface IRealtimeNotificationService {
    connect: (userId: string) => Promise<void>;
    disconnect: () => void;
    isConnected: () => boolean;
    getConnectionStatus: () => ConnectionStatus;
    sendEvent: (event: RealtimeNotificationEvent) => void;
}

/**
 * Real-time Notification Service Implementation.
 */
export class RealtimeNotificationService implements IRealtimeNotificationService {
    private ws: WebSocket | null = null;
    private userId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private connectionStatus: ConnectionStatus = 'disconnected';
    private eventListeners: Map<string, ((event: RealtimeNotificationEvent) => void)[]> = new Map();

    constructor() {
        this.setupConnectionMonitoring();
    }

    /**
     * Connect to WebSocket for real-time notifications.
     */
    async connect(userId: string): Promise<void> {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return;
        }

        this.userId = userId;
        this.connectionStatus = 'connecting';
        this.notifyStatusChange();

        try {
            const wsUrl = this.getWebSocketUrl(userId);
            this.ws = new WebSocket(wsUrl);

            this.setupWebSocketHandlers();
            
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 10000);

                this.ws!.onopen = () => {
                    clearTimeout(timeout);
                    this.connectionStatus = 'connected';
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    this.notifyStatusChange();
                    resolve();
                };

                this.ws!.onerror = (error) => {
                    clearTimeout(timeout);
                    reject(error);
                };
            });
        } catch (error) {
            this.connectionStatus = 'error';
            this.notifyStatusChange();
            throw error;
        }
    }

    /**
     * Disconnect from WebSocket.
     */
    disconnect(): void {
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.connectionStatus = 'disconnected';
        this.notifyStatusChange();
    }

    /**
     * Check if connected.
     */
    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN && this.connectionStatus === 'connected';
    }

    /**
     * Get current connection status.
     */
    getConnectionStatus(): ConnectionStatus {
        return this.connectionStatus;
    }

    /**
     * Send event to WebSocket.
     */
    sendEvent(event: RealtimeNotificationEvent): void {
        if (this.isConnected() && this.ws) {
            this.ws.send(JSON.stringify(event));
        }
    }

    /**
     * Add event listener.
     */
    addEventListener(eventType: string, listener: (event: RealtimeNotificationEvent) => void): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType)!.push(listener);
    }

    /**
     * Remove event listener.
     */
    removeEventListener(eventType: string, listener: (event: RealtimeNotificationEvent) => void): void {
        const listeners = this.eventListeners.get(eventType);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Get WebSocket URL.
     */
    private getWebSocketUrl(userId: string): string {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${protocol}//${host}/ws/notifications/${userId}`;
    }

    /**
     * Setup WebSocket event handlers.
     */
    private setupWebSocketHandlers(): void {
        if (!this.ws) return;

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            this.connectionStatus = 'disconnected';
            this.notifyStatusChange();
            this.stopHeartbeat();

            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            this.connectionStatus = 'error';
            this.notifyStatusChange();
            console.error('WebSocket error:', error);
        };
    }

    /**
     * Handle incoming WebSocket message.
     */
    private handleMessage(data: any): void {
        const event: RealtimeNotificationEvent = {
            type: data.type,
            data: data.data,
            timestamp: data.timestamp || new Date().toISOString()
        };

        // Update last sync time
        const { updateLastSyncTime } = useNotificationUIStore.getState();
        updateLastSyncTime();

        // Notify listeners
        const listeners = this.eventListeners.get(event.type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(event);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }

    /**
     * Setup connection monitoring.
     */
    private setupConnectionMonitoring(): void {
        // Monitor connection status changes
        setInterval(() => {
            if (this.isConnected() && this.heartbeatInterval) {
                // Connection is healthy
                return;
            }

            if (this.connectionStatus === 'connected' && !this.isConnected()) {
                // Connection lost, attempt reconnect
                this.connectionStatus = 'disconnected';
                this.notifyStatusChange();
                this.scheduleReconnect();
            }
        }, 5000);
    }

    /**
     * Start heartbeat to keep connection alive.
     */
    private startHeartbeat(): void {
        this.stopHeartbeat();
        
        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected() && this.ws) {
                this.ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
            }
        }, 30000); // 30 seconds
    }

    /**
     * Stop heartbeat.
     */
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Schedule reconnection attempt.
     */
    private scheduleReconnect(): void {
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
        
        setTimeout(() => {
            if (this.userId && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                this.connect(this.userId).catch(() => {
                    // Reconnect failed, will try again
                });
            }
        }, delay);
    }

    /**
     * Notify status change to UI store.
     */
    private notifyStatusChange(): void {
        const { setConnectionStatus } = useNotificationUIStore.getState();
        setConnectionStatus(this.connectionStatus);
    }
}

/**
 * Global real-time notification service instance.
 */
export const realtimeNotificationService = new RealtimeNotificationService();

/**
 * Hook for using real-time notifications.
 */
export const useRealtimeNotifications = (userId: string | null) => {
    const {
        isRealTimeEnabled,
        setConnectionStatus,
        updateLastSyncTime,
        addOptimisticUpdate,
        removeOptimisticUpdate
    } = useNotificationUIStore();

    const eventHandlersRef = useRef<Map<string, ((event: RealtimeNotificationEvent) => void)>>(new Map());

    // Handle notification created event
    const handleNotificationCreated = useCallback((event: RealtimeNotificationEvent) => {
        // Add optimistic update
        addOptimisticUpdate(`notification-${event.data.id}`, {
            type: 'created',
            data: event.data,
            timestamp: event.timestamp
        });

        // Update last sync time
        updateLastSyncTime();
    }, [addOptimisticUpdate, updateLastSyncTime]);

    // Handle notification updated event
    const handleNotificationUpdated = useCallback((event: RealtimeNotificationEvent) => {
        // Add optimistic update
        addOptimisticUpdate(`notification-${event.data.id}`, {
            type: 'updated',
            data: event.data,
            timestamp: event.timestamp
        });

        updateLastSyncTime();
    }, [addOptimisticUpdate, updateLastSyncTime]);

    // Handle notification deleted event
    const handleNotificationDeleted = useCallback((event: RealtimeNotificationEvent) => {
        // Add optimistic update
        addOptimisticUpdate(`notification-${event.data.id}`, {
            type: 'deleted',
            data: event.data,
            timestamp: event.timestamp
        });

        updateLastSyncTime();
    }, [addOptimisticUpdate, updateLastSyncTime]);

    // Handle notification read event
    const handleNotificationRead = useCallback((event: RealtimeNotificationEvent) => {
        // Add optimistic update
        addOptimisticUpdate(`notification-${event.data.id}`, {
            type: 'read',
            data: event.data,
            timestamp: event.timestamp
        });

        updateLastSyncTime();
    }, [addOptimisticUpdate, updateLastSyncTime]);

    // Setup event listeners
    useEffect(() => {
        if (!userId || !isRealTimeEnabled) {
            return;
        }

        const service = realtimeNotificationService;

        // Register event handlers
        service.addEventListener('NOTIFICATION_CREATED', handleNotificationCreated);
        service.addEventListener('NOTIFICATION_UPDATED', handleNotificationUpdated);
        service.addEventListener('NOTIFICATION_DELETED', handleNotificationDeleted);
        service.addEventListener('NOTIFICATION_READ', handleNotificationRead);

        // Store handlers for cleanup
        eventHandlersRef.current.set('NOTIFICATION_CREATED', handleNotificationCreated);
        eventHandlersRef.current.set('NOTIFICATION_UPDATED', handleNotificationUpdated);
        eventHandlersRef.current.set('NOTIFICATION_DELETED', handleNotificationDeleted);
        eventHandlersRef.current.set('NOTIFICATION_READ', handleNotificationRead);

        // Connect to WebSocket
        service.connect(userId).catch((error) => {
            console.error('Failed to connect to real-time notifications:', error);
            setConnectionStatus('error');
        });

        // Cleanup
        return () => {
            service.removeEventListener('NOTIFICATION_CREATED', handleNotificationCreated);
            service.removeEventListener('NOTIFICATION_UPDATED', handleNotificationUpdated);
            service.removeEventListener('NOTIFICATION_DELETED', handleNotificationDeleted);
            service.removeEventListener('NOTIFICATION_READ', handleNotificationRead);
            
            eventHandlersRef.current.clear();
            
            if (service.getConnectionStatus() === 'connected') {
                service.disconnect();
            }
        };
    }, [userId, isRealTimeEnabled, handleNotificationCreated, handleNotificationUpdated, handleNotificationDeleted, handleNotificationRead, setConnectionStatus]);

    // Disconnect when real-time is disabled
    useEffect(() => {
        if (!isRealTimeEnabled && realtimeNotificationService.isConnected()) {
            realtimeNotificationService.disconnect();
        }
    }, [isRealTimeEnabled]);

    return {
        isConnected: realtimeNotificationService.isConnected(),
        connectionStatus: realtimeNotificationService.getConnectionStatus(),
        service: realtimeNotificationService
    };
};
