/**
 * WebSocket System Factory Functions
 * 
 * Factory functions for creating WebSocket services following Black Box pattern.
 */

import { Container } from '../di/Container.js';

/**
 * WebSocket states enum
 * @readonly
 * @enum {string}
 */
export const WebSocketState = Object.freeze({
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    RECONNECTING: 'reconnecting',
    ERROR: 'error'
});

/**
 * Creates a WebSocket service with default configuration
 * @returns {Object} WebSocket service instance
 */
export function createDefaultWebSocketService() {
    const config = {
        url: '',
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        timeout: 10000
    };

    return createWebSocketService(config);
}

/**
 * Creates a WebSocket service with custom configuration
 * @param {Object} config - WebSocket configuration
 * @returns {Object} WebSocket service instance
 */
export function createWebSocketService(config) {
    return new WebSocketServiceImplementation(config);
}

/**
 * Creates a WebSocket service from DI container
 * @param {Container} container - DI container
 * @param {Object} [config] - Optional configuration
 * @returns {Object} WebSocket service instance
 */
export function createWebSocketServiceFromDI(container, config = {}) {
    try {
        return container.getByToken('WEBSOCKET_SERVICE');
    } catch {
        return createWebSocketService(config);
    }
}

/**
 * Creates a WebSocket factory
 * @param {Container} container - DI container
 * @returns {Object} WebSocket factory
 */
export function createWebSocketFactory(container) {
    return {
        createDefaultWebSocketService: () => createDefaultWebSocketService(),
        createWebSocketService: (config) => createWebSocketService(config),
        createWebSocketServiceFromDI: (config) => createWebSocketServiceFromDI(container, config),
        createWebSocketServiceForFeature: (feature, config) => createWebSocketServiceForFeature(feature, config)
    };
}

/**
 * Creates a WebSocket service for specific feature
 * @param {string} feature - Feature name
 * @param {Object} [config] - Feature-specific configuration
 * @returns {Object} WebSocket service instance
 */
export function createWebSocketServiceForFeature(feature, config = {}) {
    const featureConfig = {
        ...config,
        feature,
        url: config.url || '',
        reconnectInterval: config.reconnectInterval || 3000,
        maxReconnectAttempts: config.maxReconnectAttempts || 5,
        timeout: config.timeout || 10000
    };

    return createWebSocketService(featureConfig);
}

/**
 * WebSocket service implementation
 * @private
 */
class WebSocketServiceImplementation {
    constructor(config) {
        this.config = config;
        this.state = WebSocketState.DISCONNECTED;
        this.callbacks = {};
    }

    connect() {
        this.state = WebSocketState.CONNECTING;
        // Implementation would go here
    }

    disconnect() {
        this.state = WebSocketState.DISCONNECTED;
        // Implementation would go here
    }

    send(message) {
        // Implementation would go here
    }

    getState() {
        return this.state;
    }

    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    off(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
        }
    }
}
