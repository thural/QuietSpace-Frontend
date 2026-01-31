/**
 * Enterprise WebSocket React Hooks.
 * 
 * React hooks for integrating with the enterprise WebSocket system.
 * Provides type-safe WebSocket functionality for React components.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Import types via JSDoc typedefs
/**
 * @typedef {import('../services/EnterpriseWebSocketService.js').IEnterpriseWebSocketService} IEnterpriseWebSocketService
 * @typedef {import('../managers/ConnectionManager.js').IConnectionManager} IConnectionManager
 * @typedef {import('../services/MessageRouter.js').IMessageRouter} IMessageRouter
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketEventListener} WebSocketEventListener
 * @typedef {import('../services/EnterpriseWebSocketService.js').ConnectionMetrics} ConnectionMetrics
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
 * Use feature WebSocket options interface
 * 
 * @interface UseFeatureWebSocketOptions
 * @description Configuration options for feature-specific WebSocket hook
 */
export class UseFeatureWebSocketOptions {
    /**
     * Feature identifier
     * 
     * @type {string}
     */
    feature = '';

    /**
     * Auto-connect on mount
     * 
     * @type {boolean}
     */
    autoConnect = true;

    /**
     * Connection priority
     * 
     * @type {number}
     */
    priority = 0;

    /**
     * Message handler callback
     * 
     * @type {Function}
     */
    onMessage;

    /**
     * Error handler callback
     * 
     * @type {Function}
     */
    onError;

    /**
     * Connect handler callback
     * 
     * @type {Function}
     */
    onConnect;

    /**
     * Disconnect handler callback
     * 
     * @type {Function}
     */
    onDisconnect;

    /**
     * Creates options instance
     * 
     * @param {Object} options - Options object
     * @returns {UseFeatureWebSocketOptions} Options instance
     * @description Creates new options instance
     */
    static create(options = {}) {
        const opts = new UseFeatureWebSocketOptions();
        Object.assign(opts, options);
        return opts;
    }
}

/**
 * WebSocket connection state interface
 * 
 * @interface WebSocketConnectionState
 * @description Current WebSocket connection state
 */
export class WebSocketConnectionState {
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
     * Creates connection state instance
     * 
     * @param {Object} [state] - Initial state
     * @returns {WebSocketConnectionState} Connection state instance
     * @description Creates new connection state
     */
    static create(state = {}) {
        const connectionState = new WebSocketConnectionState();
        Object.assign(connectionState, state);
        return connectionState;
    }
}

/**
 * WebSocket metrics interface
 * 
 * @interface WebSocketMetrics
 * @description WebSocket connection metrics
 */
export class WebSocketMetrics {
    /**
     * Connection metrics
     * 
     * @type {ConnectionMetrics}
     */
    connectionMetrics;

    /**
     * Messages received count
     * 
     * @type {number}
     */
    messagesReceived = 0;

    /**
     * Messages sent count
     * 
     * @type {number}
     */
    messagesSent = 0;

    /**
     * Average latency in milliseconds
     * 
     * @type {number}
     */
    averageLatency = 0;

    /**
     * Connection uptime in milliseconds
     * 
     * @type {number}
     */
    connectionUptime = 0;

    /**
     * Creates metrics instance
     * 
     * @param {Object} [metrics] - Initial metrics
     * @returns {WebSocketMetrics} Metrics instance
     * @description Creates new metrics instance
     */
    static create(metrics = {}) {
        const webSocketMetrics = new WebSocketMetrics();
        Object.assign(webSocketMetrics, metrics);
        return webSocketMetrics;
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
    const container = useDIContainer();
    
    const [connectionState, setConnectionState] = useState(() => 
        WebSocketConnectionState.create()
    );
    
    const [metrics, setMetrics] = useState(() => 
        WebSocketMetrics.create()
    );

    const webSocketServiceRef = useRef(null);
    const connectionManagerRef = useRef(null);
    const messageRouterRef = useRef(null);

    // Initialize services
    useEffect(() => {
        try {
            webSocketServiceRef.current = container.getByToken('ENTERPRISE_WEBSOCKET_SERVICE');
            connectionManagerRef.current = container.getByToken('CONNECTION_MANAGER');
            messageRouterRef.current = container.getByToken('MESSAGE_ROUTER');
        } catch (error) {
            console.error('Failed to initialize WebSocket services:', error);
            setConnectionState(prev => ({
                ...prev,
                error,
                lastError: new Date()
            }));
        }
    }, [container]);

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

    // Update connection state
    const updateConnectionState = useCallback((newState) => {
        setConnectionState(prev => ({
            ...prev,
            ...newState,
            lastError: newState.error ? new Date() : prev.lastError
        }));
    }, []);

    // Update metrics
    const updateMetrics = useCallback(() => {
        if (opts.enableMetrics && webSocketServiceRef.current) {
            try {
                const serviceMetrics = webSocketServiceRef.current.getMetrics();
                setMetrics(prev => WebSocketMetrics.create({
                    ...prev,
                    connectionMetrics: serviceMetrics,
                    messagesReceived: serviceMetrics.messagesReceived,
                    messagesSent: serviceMetrics.messagesSent,
                    averageLatency: serviceMetrics.averageLatency,
                    connectionUptime: serviceMetrics.uptime
                }));
            } catch (error) {
                console.error('Failed to update metrics:', error);
            }
        }
    }, [opts.enableMetrics]);

    // Connect to WebSocket
    const connect = useCallback(async () => {
        if (!webSocketServiceRef.current) {
            return;
        }

        updateConnectionState({
            isConnecting: true,
            error: null,
            connectionState: 'connecting'
        });

        try {
            await webSocketServiceRef.current.connect();
            
            updateConnectionState({
                isConnected: true,
                isConnecting: false,
                connectionState: 'connected'
            });

            updateMetrics();
        } catch (error) {
            updateConnectionState({
                isConnected: false,
                isConnecting: false,
                error,
                connectionState: 'error'
            });
        }
    }, [updateConnectionState, updateMetrics]);

    // Disconnect from WebSocket
    const disconnect = useCallback(async () => {
        if (!webSocketServiceRef.current) {
            return;
        }

        try {
            await webSocketServiceRef.current.disconnect();
            
            updateConnectionState({
                isConnected: false,
                isConnecting: false,
                connectionState: 'disconnected'
            });
        } catch (error) {
            updateConnectionState({
                error,
                connectionState: 'error'
            });
        }
    }, [updateConnectionState]);

    // Reconnect to WebSocket
    const reconnect = useCallback(async () => {
        await disconnect();
        await connect();
    }, [disconnect, connect]);

    // Send message
    const sendMessage = useCallback(async (message) => {
        if (!webSocketServiceRef.current || !connectionState.isConnected) {
            throw new Error('WebSocket not connected');
        }

        try {
            await webSocketServiceRef.current.send(message);
            updateMetrics();
        } catch (error) {
            updateConnectionState({
                error,
                connectionState: 'error'
            });
            throw error;
        }
    }, [connectionState.isConnected, updateConnectionState, updateMetrics]);

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
            updateConnectionState({
                isConnected: true,
                isConnecting: false,
                connectionState: 'connected'
            });
            updateMetrics();
        });

        const disconnectListener = webSocketServiceRef.current.addEventListener('disconnect', () => {
            updateConnectionState({
                isConnected: false,
                isConnecting: false,
                connectionState: 'disconnected'
            });
        });

        const errorListener = webSocketServiceRef.current.addEventListener('error', (error) => {
            updateConnectionState({
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
    }, [updateConnectionState, updateMetrics]);

    return {
        // State
        connectionState,
        metrics,
        
        // Services
        webSocketService: webSocketServiceRef.current,
        connectionManager: connectionManagerRef.current,
        messageRouter: messageRouterRef.current,
        
        // Actions
        connect,
        disconnect,
        reconnect,
        sendMessage,
        addEventListener,
        removeEventListener,
        updateMetrics
    };
}

/**
 * Feature WebSocket hook
 * 
 * @function useFeatureWebSocket
 * @param {UseFeatureWebSocketOptions} options - Hook options
 * @returns {Object} Feature WebSocket state and functions
 * @description Hook for feature-specific WebSocket functionality
 */
export function useFeatureWebSocket(options) {
    const opts = UseFeatureWebSocketOptions.create(options);
    const enterpriseWebSocket = useEnterpriseWebSocket({
        autoConnect: opts.autoConnect,
        enableMetrics: true
    });

    const [featureMessages, setFeatureMessages] = useState([]);

    // Handle feature-specific messages
    useEffect(() => {
        if (!opts.feature || !enterpriseWebSocket.messageRouter) {
            return;
        }

        const messageHandler = (message) => {
            if (message.feature === opts.feature) {
                setFeatureMessages(prev => [...prev, message]);
                
                if (opts.onMessage) {
                    opts.onMessage(message);
                }
            }
        };

        const listener = enterpriseWebSocket.addEventListener('message', messageHandler);

        return () => {
            enterpriseWebSocket.removeEventListener('message', listener);
        };
    }, [opts.feature, enterpriseWebSocket.messageRouter, opts.onMessage]);

    // Send feature message
    const sendFeatureMessage = useCallback(async (payload, messageType = 'message') => {
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: messageType,
            feature: opts.feature,
            payload,
            timestamp: new Date()
        };

        return await enterpriseWebSocket.sendMessage(message);
    }, [opts.feature, enterpriseWebSocket.sendMessage]);

    return {
        ...enterpriseWebSocket,
        featureMessages,
        sendFeatureMessage
    };
}

/**
 * WebSocket migration hook
 * 
 * @function useWebSocketMigration
 * @param {string} feature - Feature name
 * @param {Object} [config] - Migration configuration
 * @returns {Object} Migration state and functions
 * @description Hook for WebSocket migration functionality
 */
export function useWebSocketMigration(feature, config = {}) {
    const [migrationState, setMigrationState] = useState({
        isMigrating: false,
        migrationProgress: 0,
        migrationError: null,
        completedSteps: [],
        totalSteps: 0
    });

    const enterpriseWebSocket = useEnterpriseWebSocket({
        autoConnect: false,
        enableMetrics: true
    });

    // Start migration
    const startMigration = useCallback(async () => {
        setMigrationState(prev => ({
            ...prev,
            isMigrating: true,
            migrationProgress: 0,
            migrationError: null,
            completedSteps: []
        }));

        try {
            // Migration logic would go here
            // This is a placeholder for actual migration implementation
            
            setMigrationState(prev => ({
                ...prev,
                isMigrating: false,
                migrationProgress: 100,
                migrationError: null
            }));
        } catch (error) {
            setMigrationState(prev => ({
                ...prev,
                isMigrating: false,
                migrationError: error
            }));
        }
    }, []);

    // Cancel migration
    const cancelMigration = useCallback(() => {
        setMigrationState(prev => ({
            ...prev,
            isMigrating: false,
            migrationError: new Error('Migration cancelled')
        }));
    }, []);

    return {
        migrationState,
        enterpriseWebSocket,
        startMigration,
        cancelMigration
    };
}
