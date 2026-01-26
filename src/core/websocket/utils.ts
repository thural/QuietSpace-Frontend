/**
 * WebSocket System Utilities
 * 
 * Utility functions for WebSocket operations following Black Box pattern.
 * Provides clean utility functions for validation, initialization, and management.
 */

import type {
    IWebSocketService,
    WebSocketConfig,
    WebSocketMessage
} from '../shared';

import {
    WebSocketState,
    CORE_CONSTANTS,
    CORE_VALIDATION_RULES,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES
} from '../shared';

/**
 * Validates WebSocket configuration
 * 
 * @param config - Configuration to validate
 * @returns Array of validation errors
 */
export function validateWebSocketConfig(config: any): string[] {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate URL
    if (!config.url || typeof config.url !== 'string') {
        errors.push('WebSocket URL is required and must be a string');
    } else if (!config.url.match(/^(ws|wss):\/\/.+/)) {
        errors.push('WebSocket URL must start with ws:// or wss://');
    } else if (config.url.length > 2048) {
        errors.push('WebSocket URL must be less than 2048 characters');
    }

    // Validate reconnectInterval
    if (config.reconnectInterval !== undefined) {
        const intervalRule = CORE_VALIDATION_RULES.websocket.reconnectInterval;
        if (config.reconnectInterval < intervalRule.min || config.reconnectInterval > intervalRule.max) {
            errors.push(`Reconnect interval must be between ${intervalRule.min} and ${intervalRule.max}ms`);
        }
    }

    // Validate maxReconnectAttempts
    if (config.maxReconnectAttempts !== undefined) {
        const attemptsRule = CORE_VALIDATION_RULES.websocket.maxReconnectAttempts;
        if (config.maxReconnectAttempts < attemptsRule.min || config.maxReconnectAttempts > attemptsRule.max) {
            errors.push(`Max reconnect attempts must be between ${attemptsRule.min} and ${attemptsRule.max}`);
        }
    }

    // Validate timeout
    if (config.timeout !== undefined) {
        const timeoutRule = CORE_VALIDATION_RULES.websocket.timeout;
        if (config.timeout < timeoutRule.min || config.timeout > timeoutRule.max) {
            errors.push(`Timeout must be between ${timeoutRule.min} and ${timeoutRule.max}ms`);
        }
    }

    return errors;
}

/**
 * Creates a default WebSocket configuration
 * 
 * @param overrides - Optional configuration overrides
 * @returns Default WebSocket configuration
 */
export function createDefaultWebSocketConfig(overrides?: Partial<WebSocketConfig>): WebSocketConfig {
    return {
        url: '',
        reconnectInterval: CORE_CONSTANTS.DEFAULT_RECONNECT_INTERVAL,
        maxReconnectAttempts: CORE_CONSTANTS.DEFAULT_MAX_RECONNECT_ATTEMPTS,
        timeout: CORE_CONSTANTS.DEFAULT_WEBSOCKET_TIMEOUT,
        protocols: ['websocket'],
        ...overrides
    };
}

/**
 * Creates a WebSocket message with metadata
 * 
 * @param type - Message type
 * @param data - Message data
 * @param id - Optional message ID
 * @returns WebSocket message
 */
export function createWebSocketMessage(
    type: string,
    data: any,
    id?: string
): WebSocketMessage {
    return {
        type,
        data,
        timestamp: Date.now(),
        id: id || generateMessageId()
    };
}

/**
 * Creates a WebSocket request message
 * 
 * @param requestId - Request ID
 * @param method - Request method
 * @param params - Request parameters
 * @returns WebSocket request message
 */
export function createWebSocketRequest(
    requestId: string,
    method: string,
    params?: Record<string, any>
): WebSocketMessage {
    return createWebSocketMessage('request', {
        requestId,
        method,
        params
    }, requestId);
}

/**
 * Creates a WebSocket response message
 * 
 * @param requestId - Request ID
 * @param success - Whether the request was successful
 * @param data - Response data
 * @param error - Error information
 * @returns WebSocket response message
 */
export function createWebSocketResponse(
    requestId: string,
    success: boolean,
    data?: any,
    error?: any
): WebSocketMessage {
    return createWebSocketMessage('response', {
        requestId,
        success,
        data,
        error
    }, requestId);
}

/**
 * Generates a unique message ID
 * 
 * @returns Unique message ID
 */
export function generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates a WebSocket message
 * 
 * @param message - Message to validate
 * @returns True if message is valid
 */
export function isValidWebSocketMessage(message: any): message is WebSocketMessage {
    if (!message || typeof message !== 'object') {
        return false;
    }

    return (
        typeof message.type === 'string' &&
        typeof message.timestamp === 'number' &&
        message.timestamp > 0
    );
}

/**
 * Checks if a WebSocket message is expired
 * 
 * @param message - Message to check
 * @param maxAge - Maximum age in milliseconds
 * @returns True if message is expired
 */
export function isMessageExpired(message: WebSocketMessage, maxAge: number = 60000): boolean {
    return Date.now() - message.timestamp > maxAge;
}

/**
 * Formats WebSocket state for display
 * 
 * @param state - WebSocket state
 * @returns Formatted state string
 */
export function formatWebSocketState(state: WebSocketState): string {
    const stateMap = {
        [WebSocketState.DISCONNECTED]: 'Disconnected',
        [WebSocketState.CONNECTING]: 'Connecting',
        [WebSocketState.CONNECTED]: 'Connected',
        [WebSocketState.RECONNECTING]: 'Reconnecting',
        [WebSocketState.ERROR]: 'Error'
    };

    return stateMap[state] || 'Unknown';
}

/**
 * Gets WebSocket connection info as a formatted string
 * 
 * @param url - WebSocket URL
 * @param state - WebSocket state
 * @param reconnectAttempts - Number of reconnect attempts
 * @returns Formatted connection info
 */
export function formatConnectionInfo(
    url: string,
    state: WebSocketState,
    reconnectAttempts: number = 0
): string {
    return `WebSocket Connection:
  URL: ${url}
  State: ${formatWebSocketState(state)}
  Reconnect Attempts: ${reconnectAttempts}
  Timestamp: ${new Date().toISOString()}`;
}

/**
 * Creates a WebSocket error with proper error code
 * 
 * @param message - Error message
 * @param code - Error code
 * @param details - Additional error details
 * @returns WebSocket error object
 */
export function createWebSocketError(
    message: string,
    code: string = CORE_ERROR_CODES.WEBSOCKET_ERROR,
    details?: any
): Error {
    const error = new Error(message) as any;
    error.code = code;
    error.details = details;
    error.timestamp = Date.now();
    return error;
}

/**
 * Checks if a WebSocket URL is secure
 * 
 * @param url - WebSocket URL
 * @returns True if URL is secure (wss://)
 */
export function isSecureWebSocketUrl(url: string): boolean {
    return url.startsWith('wss://');
}

/**
 * Converts HTTP URL to WebSocket URL
 * 
 * @param httpUrl - HTTP URL
 * @param secure - Whether to use secure WebSocket
 * @returns WebSocket URL
 */
export function httpToWebSocketUrl(httpUrl: string, secure: boolean = true): string {
    const protocol = secure ? 'wss://' : 'ws://';
    return httpUrl.replace(/^https?:\/\//, protocol);
}

/**
 * Gets the protocol from WebSocket URL
 * 
 * @param url - WebSocket URL
 * @returns Protocol (ws or wss)
 */
export function getWebSocketProtocol(url: string): 'ws' | 'wss' {
    return url.startsWith('wss://') ? 'wss' : 'ws';
}

/**
 * Creates a heartbeat message
 * 
 * @returns Heartbeat message
 */
export function createHeartbeatMessage(): WebSocketMessage {
    return createWebSocketMessage('heartbeat', { timestamp: Date.now() });
}

/**
 * Creates a ping message
 * 
 * @returns Ping message
 */
export function createPingMessage(): WebSocketMessage {
    return createWebSocketMessage('ping', { timestamp: Date.now() });
}

/**
 * Creates a pong message
 * 
 * @param pingTimestamp - Timestamp from ping message
 * @returns Pong message
 */
export function createPongMessage(pingTimestamp?: number): WebSocketMessage {
    return createWebSocketMessage('pong', {
        pingTimestamp: pingTimestamp || Date.now(),
        pongTimestamp: Date.now()
    });
}

/**
 * Calculates round-trip time from ping/pong messages
 * 
 * @param pingMessage - Ping message
 * @param pongMessage - Pong message
 * @returns Round-trip time in milliseconds
 */
export function calculateRoundTripTime(
    pingMessage: WebSocketMessage,
    pongMessage: WebSocketMessage
): number {
    return pongMessage.timestamp - pingMessage.timestamp;
}

/**
 * Checks if a message is a heartbeat message
 * 
 * @param message - Message to check
 * @returns True if message is a heartbeat
 */
export function isHeartbeatMessage(message: WebSocketMessage): boolean {
    return message.type === 'heartbeat';
}

/**
 * Checks if a message is a ping message
 * 
 * @param message - Message to check
 * @returns True if message is a ping
 */
export function isPingMessage(message: WebSocketMessage): boolean {
    return message.type === 'ping';
}

/**
 * Checks if a message is a pong message
 * 
 * @param message - Message to check
 * @returns True if message is a pong
 */
export function isPongMessage(message: WebSocketMessage): boolean {
    return message.type === 'pong';
}

/**
 * Serializes a WebSocket message to JSON string
 * 
 * @param message - Message to serialize
 * @returns JSON string
 */
export function serializeMessage(message: WebSocketMessage): string {
    return JSON.stringify(message);
}

/**
 * Deserializes a JSON string to WebSocket message
 * 
 * @param data - JSON string to deserialize
 * @returns WebSocket message
 */
export function deserializeMessage(data: string): WebSocketMessage {
    try {
        const message = JSON.parse(data);
        if (isValidWebSocketMessage(message)) {
            return message;
        }
        throw new Error('Invalid message format');
    } catch (error) {
        throw createWebSocketError(`Failed to deserialize message: ${error.message}`);
    }
}

/**
 * Creates a subscription filter function
 * 
 * @param eventType - Event type to filter for
 * @returns Filter function
 */
export function createEventFilter(eventType: string) {
    return (message: WebSocketMessage): boolean => {
        return message.type === eventType;
    };
}

/**
 * Creates a subscription filter for multiple event types
 * 
 * @param eventTypes - Event types to filter for
 * @returns Filter function
 */
export function createMultiEventFilter(eventTypes: string[]) {
    return (message: WebSocketMessage): boolean => {
        return eventTypes.includes(message.type);
    };
}

/**
 * Creates a subscription filter with custom predicate
 * 
 * @param predicate - Custom filter predicate
 * @returns Filter function
 */
export function createCustomFilter(predicate: (message: WebSocketMessage) => boolean) {
    return predicate;
}

/**
 * Debounces WebSocket messages
 * 
 * @param delay - Delay in milliseconds
 * @returns Debounced message handler
 */
export function debounceMessageHandler(
    delay: number
): (handler: (message: WebSocketMessage) => void) => (message: WebSocketMessage) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (handler: (message: WebSocketMessage) => void) => {
        return (message: WebSocketMessage) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                handler(message);
                timeoutId = null;
            }, delay);
        };
    };
}

/**
 * Throttles WebSocket messages
 * 
 * @param limit - Minimum time between messages in milliseconds
 * @returns Throttled message handler
 */
export function throttleMessageHandler(
    limit: number
): (handler: (message: WebSocketMessage) => void) => (message: WebSocketMessage) => void {
    let lastCall = 0;

    return (handler: (message: WebSocketMessage) => void) => {
        return (message: WebSocketMessage) => {
            const now = Date.now();
            if (now - lastCall >= limit) {
                handler(message);
                lastCall = now;
            }
        };
    };
}
