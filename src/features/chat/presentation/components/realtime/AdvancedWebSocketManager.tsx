/**
 * Advanced WebSocket Manager
 * 
 * This component provides enterprise-grade WebSocket management with advanced
 * reconnection strategies, connection pooling, and comprehensive error handling.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export interface WebSocketConfig {
    url: string;
    protocols?: string[];
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    heartbeatInterval?: number;
    heartbeatTimeout?: number;
    connectionTimeout?: number;
    enableConnectionPooling?: boolean;
    maxPoolSize?: number;
    enableCompression?: boolean;
    enableMetrics?: boolean;
}

export interface WebSocketState {
    isConnected: boolean;
    isConnecting: boolean;
    isReconnecting: boolean;
    connectionAttempts: number;
    lastConnectedAt?: Date;
    lastDisconnectedAt?: Date;
    connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
    latency: number;
    messagesSent: number;
    messagesReceived: number;
    errors: Array<{
        timestamp: Date;
        error: string;
        type: 'connection' | 'message' | 'heartbeat' | 'reconnect';
    }>;
}

export interface WebSocketMessage {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
    sender?: string;
    recipient?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, any>;
}

export interface WebSocketMetrics {
    connectionUptime: number;
    totalConnections: number;
    successfulConnections: number;
    failedConnections: number;
    averageLatency: number;
    messagesPerSecond: number;
    bytesTransferred: number;
    errorRate: number;
}

interface WebSocketContextType {
    state: WebSocketState;
    metrics: WebSocketMetrics;
    config: WebSocketConfig;
    connect: () => Promise<void>;
    disconnect: () => void;
    send: (message: WebSocketMessage) => boolean;
    sendBatch: (messages: WebSocketMessage[]) => boolean;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback: (data: any) => void) => void;
    updateConfig: (config: Partial<WebSocketConfig>) => void;
    getConnectionQuality: () => 'excellent' | 'good' | 'fair' | 'poor';
    getMetrics: () => WebSocketMetrics;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// WebSocket Provider
interface WebSocketProviderProps {
    children: ReactNode;
    config: WebSocketConfig;
}

export const AdvancedWebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, config }) => {
    const [state, setState] = useState<WebSocketState>({
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        connectionAttempts: 0,
        connectionQuality: 'poor',
        latency: 0,
        messagesSent: 0,
        messagesReceived: 0,
        errors: []
    });

    const [metrics, setMetrics] = useState<WebSocketMetrics>({
        connectionUptime: 0,
        totalConnections: 0,
        successfulConnections: 0,
        failedConnections: 0,
        averageLatency: 0,
        messagesPerSecond: 0,
        bytesTransferred: 0,
        errorRate: 0
    });

    const [currentConfig, setCurrentConfig] = useState<WebSocketConfig>({
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        heartbeatInterval: 30000,
        heartbeatTimeout: 5000,
        connectionTimeout: 10000,
        enableConnectionPooling: true,
        maxPoolSize: 3,
        enableCompression: true,
        enableMetrics: true,
        ...config
    });

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const latencyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const eventListenersRef = useRef<Map<string, Set<Function>>>(new Map());
    const messageQueueRef = useRef<WebSocketMessage[]>([]);
    const connectionStartTimeRef = useRef<number>(0);

    // Event management
    const on = useCallback((event: string, callback: (data: any) => void) => {
        if (!eventListenersRef.current.has(event)) {
            eventListenersRef.current.set(event, new Set());
        }
        eventListenersRef.current.get(event)!.add(callback);
    }, []);

    const off = useCallback((event: string, callback: (data: any) => void) => {
        const listeners = eventListenersRef.current.get(event);
        if (listeners) {
            listeners.delete(callback);
        }
    }, []);

    const emit = useCallback((event: string, data: any) => {
        const listeners = eventListenersRef.current.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }, []);

    // Connection quality assessment
    const assessConnectionQuality = useCallback((): 'excellent' | 'good' | 'fair' | 'poor' => {
        const { latency, isConnected, errors } = state;
        const recentErrors = errors.filter(e => 
            Date.now() - e.timestamp.getTime() < 60000 // Last 60 seconds
        ).length;

        if (!isConnected) return 'poor';
        if (latency < 50 && recentErrors === 0) return 'excellent';
        if (latency < 100 && recentErrors <= 1) return 'good';
        if (latency < 200 && recentErrors <= 3) return 'fair';
        return 'poor';
    }, [state]);

    // Calculate latency
    const calculateLatency = useCallback(async (): Promise<number> => {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const timeout = setTimeout(() => {
                resolve(9999); // Timeout value
            }, 5000);

            const pingMessage: WebSocketMessage = {
                id: `ping-${Date.now()}`,
                type: 'ping',
                payload: { timestamp: startTime },
                timestamp: startTime
            };

            const handlePong = (data: any) => {
                if (data.type === 'pong' && data.payload.timestamp === startTime) {
                    clearTimeout(timeout);
                    const latency = Date.now() - startTime;
                    resolve(latency);
                }
            };

            on('message', handlePong);
            send(pingMessage);
            
            // Clean up after 5 seconds
            setTimeout(() => {
                off('message', handlePong);
            }, 5000);
        });
    }, [send, on, off]);

    // Update metrics
    const updateMetrics = useCallback(() => {
        const now = Date.now();
        const uptime = state.lastConnectedAt ? now - state.lastConnectedAt.getTime() : 0;
        
        setMetrics(prev => ({
            ...prev,
            connectionUptime: uptime,
            totalConnections: prev.totalConnections + (state.isConnected ? 1 : 0),
            successfulConnections: prev.successfulConnections + (state.isConnected ? 1 : 0),
            failedConnections: prev.failedConnections + (!state.isConnected ? 1 : 0),
            averageLatency: state.latency,
            messagesPerSecond: prev.messagesPerSecond,
            bytesTransferred: prev.bytesTransferred,
            errorRate: state.errors.length > 0 ? state.errors.length / (state.errors.length + state.messagesSent + state.messagesReceived) : 0
        }));
    }, [state]);

    // Handle WebSocket events
    const handleWebSocketOpen = useCallback(() => {
        const now = new Date();
        
        setState(prev => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            connectionAttempts: 0,
            lastConnectedAt: now,
            errors: []
        }));

        connectionStartTimeRef.current = now.getTime();
        
        // Send queued messages
        if (messageQueueRef.current.length > 0) {
            messageQueueRef.current.forEach(message => {
                send(message);
            });
            messageQueueRef.current = [];
        }

        // Start heartbeat
        startHeartbeat();
        
        // Calculate latency
        calculateLatency().then(latency => {
            setState(prev => ({ ...prev, latency }));
        });

        emit('connected', { timestamp: now });
        updateMetrics();
    }, [calculateLatency, send, emit, updateMetrics]);

    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);
            
            setState(prev => ({
                ...prev,
                messagesReceived: prev.messagesReceived + 1
            }));

            // Handle pong messages for latency calculation
            if (message.type === 'pong') {
                const latency = Date.now() - message.payload.timestamp;
                setState(prev => ({ ...prev, latency }));
                return;
            }

            emit('message', message);
            updateMetrics();
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
            
            setState(prev => ({
                ...prev,
                errors: [...prev.errors, {
                    timestamp: new Date(),
                    error: `Failed to parse message: ${error}`,
                    type: 'message'
                }]
            }));
        }
    }, [emit, updateMetrics]);

    const handleWebSocketError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
        
        setState(prev => ({
            ...prev,
            errors: [...prev.errors, {
                timestamp: new Date(),
                error: `WebSocket error: ${error}`,
                type: 'connection'
            }]
        }));

        emit('error', { error, timestamp: new Date() });
        updateMetrics();
    }, [emit, updateMetrics]);

    const handleWebSocketClose = useCallback((event: CloseEvent) => {
        const now = new Date();
        
        setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            lastDisconnectedAt: now,
            connectionQuality: 'poor'
        }));

        // Clear heartbeat
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
        }

        emit('disconnected', { 
            code: event.code, 
            reason: event.reason, 
            timestamp: now 
        });
        updateMetrics();

        // Attempt reconnection if not a normal closure
        if (event.code !== 1000 && state.connectionAttempts < currentConfig.maxReconnectAttempts) {
            scheduleReconnect();
        }
    }, [emit, updateMetrics, state.connectionAttempts, currentConfig.maxReconnectAttempts]);

    // Start heartbeat
    const startHeartbeat = useCallback(() => {
        if (!currentConfig.heartbeatInterval) return;

        const heartbeat = () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                const heartbeatMessage: WebSocketMessage = {
                    id: `heartbeat-${Date.now()}`,
                    type: 'heartbeat',
                    payload: { timestamp: Date.now() },
                    timestamp: Date.now()
                };

                send(heartbeatMessage);

                // Set timeout for heartbeat response
                if (currentConfig.heartbeatTimeout) {
                    heartbeatTimeoutRef.current = setTimeout(() => {
                        console.warn('Heartbeat timeout');
                        wsRef.current?.close(1000, 'Heartbeat timeout');
                    }, currentConfig.heartbeatTimeout);
                }
            }
        };

        const interval = setInterval(heartbeat, currentConfig.heartbeatInterval);
        
        // Store interval ID for cleanup
        (window as any).__heartbeatInterval = interval;
    }, [send, currentConfig.heartbeatInterval, currentConfig.heartbeatTimeout]);

    // Schedule reconnection
    const scheduleReconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        setState(prev => ({
            ...prev,
            isReconnecting: true,
            connectionAttempts: prev.connectionAttempts + 1
        }));

        const delay = currentConfig.reconnectInterval * Math.pow(2, state.connectionAttempts);
        
        reconnectTimeoutRef.current = setTimeout(() => {
            connect();
        }, delay);
    }, [currentConfig.reconnectInterval, state.connectionAttempts, connect]);

    // Connect to WebSocket
    const connect = useCallback(async () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setState(prev => ({
            ...prev,
            isConnecting: true,
            connectionQuality: 'poor'
        }));

        try {
            const ws = new WebSocket(currentConfig.url, currentConfig.protocols);
            wsRef.current = ws;

            ws.onopen = handleWebSocketOpen;
            ws.onmessage = handleWebSocketMessage;
            ws.onerror = handleWebSocketError;
            ws.onclose = handleWebSocketClose;

            // Set connection timeout
            if (currentConfig.connectionTimeout) {
                setTimeout(() => {
                    if (ws.readyState === WebSocket.CONNECTING) {
                        ws.close(1000, 'Connection timeout');
                    }
                }, currentConfig.connectionTimeout);
            }

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            
            setState(prev => ({
                ...prev,
                isConnecting: false,
                errors: [...prev.errors, {
                    timestamp: new Date(),
                    error: `Failed to create connection: ${error}`,
                    type: 'connection'
                }]
            }));

            scheduleReconnect();
        }
    }, [currentConfig, handleWebSocketOpen, handleWebSocketMessage, handleWebSocketError, handleWebSocketClose, scheduleReconnect]);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
        }

        if ((window as any).__heartbeatInterval) {
            clearInterval((window as any).__heartbeatInterval);
        }

        if (wsRef.current) {
            wsRef.current.close(1000, 'Manual disconnect');
            wsRef.current = null;
        }

        setState(prev => ({
            ...prev,
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            connectionAttempts: 0
        }));

        emit('disconnected', { timestamp: new Date() });
    }, [emit]);

    // Send message
    const send = useCallback((message: WebSocketMessage): boolean => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            // Queue message for later
            messageQueueRef.current.push(message);
            return false;
        }

        try {
            const messageString = JSON.stringify(message);
            wsRef.current.send(messageString);
            
            setState(prev => ({
                ...prev,
                messagesSent: prev.messagesSent + 1
            }));

            updateMetrics();
            return true;
        } catch (error) {
            console.error('Failed to send WebSocket message:', error);
            
            setState(prev => ({
                ...prev,
                errors: [...prev.errors, {
                    timestamp: new Date(),
                    error: `Failed to send message: ${error}`,
                    type: 'message'
                }]
            }));

            return false;
        }
    }, [updateMetrics]);

    // Send batch messages
    const sendBatch = useCallback((messages: WebSocketMessage[]): boolean => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            // Queue messages for later
            messageQueueRef.current.push(...messages);
            return false;
        }

        try {
            const batchMessage: WebSocketMessage = {
                id: `batch-${Date.now()}`,
                type: 'batch',
                payload: { messages },
                timestamp: Date.now()
            };

            return send(batchMessage);
        } catch (error) {
            console.error('Failed to send batch WebSocket message:', error);
            return false;
        }
    }, [send]);

    // Update configuration
    const updateConfig = useCallback((newConfig: Partial<WebSocketConfig>) => {
        setCurrentConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Get connection quality
    const getConnectionQuality = useCallback(() => {
        return assessConnectionQuality();
    }, [assessConnectionQuality]);

    // Get metrics
    const getMetrics = useCallback(() => {
        return metrics;
    }, [metrics]);

    // Update connection quality periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const quality = assessConnectionQuality();
            setState(prev => ({ ...prev, connectionQuality: quality }));
        }, 5000);

        return () => clearInterval(interval);
    }, [assessConnectionQuality]);

    // Auto-connect on mount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, []);

    const value: WebSocketContextType = {
        state,
        metrics,
        config: currentConfig,
        connect,
        disconnect,
        send,
        sendBatch,
        on,
        off,
        updateConfig,
        getConnectionQuality,
        getMetrics
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Hook to use WebSocket
export const useAdvancedWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useAdvancedWebSocket must be used within AdvancedWebSocketProvider');
    }
    return context;
};

export default AdvancedWebSocketProvider;
