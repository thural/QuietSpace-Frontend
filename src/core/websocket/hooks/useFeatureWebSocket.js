/**
 * Enterprise WebSocket Hook.
 * 
 * Provides generic WebSocket functionality using the enterprise WebSocket infrastructure.
 * Feature-specific functionality should be implemented in respective feature modules.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

// Import types via JSDoc typedefs
/**
 * @typedef {import('../types/WebSocketTypes.js').WebSocketConnectionState} WebSocketConnectionState
 * @typedef {import('../services/EnterpriseWebSocketService.js').IEnterpriseWebSocketService} IEnterpriseWebSocketService
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketEventListener} WebSocketEventListener
 */

/**
 * Use enterprise WebSocket options interface
 * 
 * @interface UseEnterpriseWebSocketOptions
 * @description Configuration options for enterprise WebSocket hook
 */
export class UseEnterpriseWebSocketOptions {
    /**
     * Auto-connect on mount
     * 
     * @type {boolean}
     */
    autoConnect = true;

    /**
     * Reconnect on component mount
     * 
     * @type {boolean}
     */
    reconnectOnMount = false;

    /**
     * Enable metrics collection
     * 
     * @type {boolean}
     */
    enableMetrics = true;

    /**
     * Connection timeout in milliseconds
     * 
     * @type {number}
     */
    connectionTimeout = 10000;

    /**
     * Maximum reconnection attempts
     * 
     * @type {number}
     */
    maxReconnectAttempts = 3;

    /**
     * Retry delay in milliseconds
     * 
     * @type {number}
     */
    retryDelay = 1000;

    /**
     * Creates options instance
     * 
     * @param {Object} options - Options object
     * @returns {UseEnterpriseWebSocketOptions} Options instance
     * @description Creates new options instance
     */
    static create(options = {}) {
        const opts = new UseEnterpriseWebSocketOptions();
        Object.assign(opts, options);
        return opts;
    }
}

/**
 * Enterprise WebSocket state interface
 * 
 * @interface EnterpriseWebSocketState
 * @description Current WebSocket connection state
 */
export class EnterpriseWebSocketState {
    /**
     * Whether connected
     * 
     * @type {boolean}
     */
    isConnected = false;

    /**
     * Whether connecting
     * 
     * @type {boolean}
     */
    isConnecting = false;

    /**
     * Connection error
     * 
     * @type {Error}
     */
    error;

    /**
     * Last error timestamp
     * 
     * @type {Date}
     */
    lastError;

    /**
     * Connection state
     * 
     * @type {string}
     */
    connectionState = 'disconnected';

    /**
     * Connection metrics
     * 
     * @type {Object}
     */
    metrics;

    /**
     * Creates state instance
     * 
     * @param {Object} [state] - Initial state
     * @returns {EnterpriseWebSocketState} State instance
     * @description Creates new state instance
     */
    static create(state = {}) {
        const webSocketState = new EnterpriseWebSocketState();
        Object.assign(webSocketState, state);
        return webSocketState;
    }
}

/**
 * Enterprise WebSocket hook
 * 
 * @function useEnterpriseWebSocket
 * @param {UseEnterpriseWebSocketOptions} [options] - Hook options
 * @returns {Object} WebSocket state and functions
 * @description Hook for enterprise WebSocket functionality
 */
export function useEnterpriseWebSocket(options = {}) {
    const opts = UseEnterpriseWebSocketOptions.create(options);
    
    const [state, setState] = useState(() => 
        EnterpriseWebSocketState.create()
    );

    const webSocketServiceRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize container
    useEffect(() => {
        // Container initialization would go here
        // This is a placeholder for actual DI container integration
        containerRef.current = {
            getByToken: (token) => {
                // Mock implementation
                return null;
            }
        };
    }, []);

    // Initialize WebSocket service
    useEffect(() => {
        if (containerRef.current) {
            try {
                webSocketServiceRef.current = containerRef.current.getByToken('ENTERPRISE_WEBSOCKET_SERVICE');
            } catch (error) {
                console.error('Failed to initialize WebSocket service:', error);
                setState(prev => ({
                    ...prev,
                    error,
                    lastError: new Date()
                }));
            }
        }
    }, [containerRef.current]);

    // Auto-connect on mount
    useEffect(() => {
        if (opts.autoConnect && webSocketServiceRef.current) {
            connect();
        }
    }, [opts.autoConnect]);

    // Reconnect on mount
    useEffect(() => {
        if (opts.reconnectOnMount && webSocketServiceRef.current) {
            reconnect();
        }
    }, [opts.reconnectOnMount]);

    // Update state
    const updateState = useCallback((newState) => {
        setState(prev => ({
            ...prev,
            ...newState,
            lastError: newState.error ? new Date() : prev.lastError
        }));
    }, []);

    // Connect to WebSocket
    const connect = useCallback(async () => {
        if (!webSocketServiceRef.current) {
            return;
        }

        updateState({
            isConnecting: true,
            error: null,
            connectionState: 'connecting'
        });

        try {
            await webSocketServiceRef.current.connect();
            
            updateState({
                isConnected: true,
                isConnecting: false,
                connectionState: 'connected'
            });
        } catch (error) {
            updateState({
                isConnected: false,
                isConnecting: false,
                error,
                connectionState: 'error'
            });
        }
    }, [updateState]);

    // Disconnect from WebSocket
    const disconnect = useCallback(async () => {
        if (!webSocketServiceRef.current) {
            return;
        }

        try {
            await webSocketServiceRef.current.disconnect();
            
            updateState({
                isConnected: false,
                isConnecting: false,
                connectionState: 'disconnected'
            });
        } catch (error) {
            updateState({
                error,
                connectionState: 'error'
            });
        }
    }, [updateState]);

    // Reconnect to WebSocket
    const reconnect = useCallback(async () => {
        await disconnect();
        await connect();
    }, [disconnect, connect]);

    // Send message
    const sendMessage = useCallback(async (message) => {
        if (!webSocketServiceRef.current || !state.isConnected) {
            throw new Error('WebSocket not connected');
        }

        try {
            await webSocketServiceRef.current.send(message);
        } catch (error) {
            updateState({
                error,
                connectionState: 'error'
            });
            throw error;
        }
    }, [state.isConnected, updateState]);

    // Add event listener
    const addEventListener = useCallback((eventType, handler, priority) => {
        if (!webSocketServiceRef.current) {
            return null;
        }

        return webSocketServiceRef.current.addEventListener(eventType, handler, priority);
    }, []);

    // Remove event listener
    const removeEventListener = useCallback((eventType, listener) => {
        if (!webSocketServiceRef.current) {
            return false;
        }

        return webSocketServiceRef.current.removeEventListener(eventType, listener);
    }, []);

    // Setup event listeners
    useEffect(() => {
        if (!webSocketServiceRef.current) {
            return;
        }

        const connectListener = webSocketServiceRef.current.addEventListener('connect', () => {
            updateState({
                isConnected: true,
                isConnecting: false,
                connectionState: 'connected'
            });
        });

        const disconnectListener = webSocketServiceRef.current.addEventListener('disconnect', () => {
            updateState({
                isConnected: false,
                isConnecting: false,
                connectionState: 'disconnected'
            });
        });

        const errorListener = webSocketServiceRef.current.addEventListener('error', (error) => {
            updateState({
                isConnected: false,
                isConnecting: false,
                error,
                connectionState: 'error'
            });
        });

        return () => {
            webSocketServiceRef.current.removeEventListener('connect', connectListener);
            webSocketServiceRef.current.removeEventListener('disconnect', disconnectListener);
            webSocketServiceRef.current.removeEventListener('error', errorListener);
        };
    }, [updateState]);

    return {
        // State
        state,
        
        // Services
        webSocketService: webSocketServiceRef.current,
        container: containerRef.current,
        
        // Actions
        connect,
        disconnect,
        reconnect,
        sendMessage,
        addEventListener,
        removeEventListener
    };
}
