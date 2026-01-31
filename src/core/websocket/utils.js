/**
 * WebSocket System Utilities.
 * 
 * Utility functions for WebSocket operations following Black Box pattern.
 * Provides clean utility functions for validation, initialization, and management.
 */

// Import types via JSDoc typedefs
/**
 * @typedef {import('../services/EnterpriseWebSocketService.js').IWebSocketService} IWebSocketService
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketConfig} WebSocketConfig
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 */

/**
 * Validates WebSocket configuration
 * 
 * @param {Object} config - Configuration to validate
 * @returns {Array} Array of validation errors
 * @description Validates WebSocket configuration object
 */
export function validateWebSocketConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate URL
    if (!config.url || typeof config.url !== 'string') {
        errors.push('URL is required and must be a string');
    } else if (!isValidWebSocketUrl(config.url)) {
        errors.push('URL must be a valid WebSocket URL (ws:// or wss://)');
    }

    // Validate timeout
    if (config.timeout !== undefined) {
        if (typeof config.timeout !== 'number' || config.timeout <= 0) {
            errors.push('Timeout must be a positive number');
        }
    }

    // Validate reconnect interval
    if (config.reconnectInterval !== undefined) {
        if (typeof config.reconnectInterval !== 'number' || config.reconnectInterval < 0) {
            errors.push('Reconnect interval must be a non-negative number');
        }
    }

    // Validate max reconnect attempts
    if (config.maxReconnectAttempts !== undefined) {
        if (typeof config.maxReconnectAttempts !== 'number' || config.maxReconnectAttempts < 0) {
            errors.push('Max reconnect attempts must be a non-negative number');
        }
    }

    // Validate heartbeat interval
    if (config.heartbeatInterval !== undefined) {
        if (typeof config.heartbeatInterval !== 'number' || config.heartbeatInterval <= 0) {
            errors.push('Heartbeat interval must be a positive number');
        }
    }

    return errors;
}

/**
 * Validates WebSocket message
 * 
 * @param {Object} message - Message to validate
 * @returns {Array} Array of validation errors
 * @description Validates WebSocket message object
 */
export function validateWebSocketMessage(message) {
    const errors = [];

    if (!message || typeof message !== 'object') {
        errors.push('Message must be an object');
        return errors;
    }

    // Validate ID
    if (!message.id || typeof message.id !== 'string') {
        errors.push('Message ID is required and must be a string');
    }

    // Validate type
    if (!message.type || typeof message.type !== 'string') {
        errors.push('Message type is required and must be a string');
    }

    // Validate feature
    if (!message.feature || typeof message.feature !== 'string') {
        errors.push('Message feature is required and must be a string');
    }

    // Validate timestamp
    if (!message.timestamp || !(message.timestamp instanceof Date)) {
        errors.push('Message timestamp is required and must be a Date object');
    }

    return errors;
}

/**
 * Creates WebSocket message
 * 
 * @param {Object} options - Message options
 * @returns {Object} WebSocket message
 * @description Creates new WebSocket message with default values
 */
export function createWebSocketMessage(options = {}) {
    return {
        id: options.id || generateMessageId(),
        type: options.type || 'message',
        feature: options.feature || 'unknown',
        payload: options.payload || null,
        timestamp: options.timestamp || new Date(),
        metadata: options.metadata || {},
        priority: options.priority || 0,
        requiresAck: options.requiresAck || false,
        expiresAt: options.expiresAt || null,
        correlationId: options.correlationId || null,
        retryCount: options.retryCount || 0
    };
}

/**
 * Creates WebSocket configuration
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} WebSocket configuration
 * @description Creates new WebSocket configuration with default values
 */
export function createWebSocketConfig(options = {}) {
    return {
        url: options.url || '',
        reconnectInterval: options.reconnectInterval || 3000,
        maxReconnectAttempts: options.maxReconnectAttempts || 5,
        timeout: options.timeout || 10000,
        heartbeatInterval: options.heartbeatInterval || 30000,
        enableCompression: options.enableCompression || false,
        enableEncryption: options.enableEncryption || false,
        enableMetrics: options.enableMetrics || true,
        enableCacheIntegration: options.enableCacheIntegration || false,
        enableAutoReconnect: options.enableAutoReconnect || true,
        enableMessageValidation: options.enableMessageValidation || true,
        headers: options.headers || {},
        subprotocols: options.subprotocols || []
    };
}

/**
 * Generates unique message ID
 * 
 * @returns {string} Unique message ID
 * @description Generates unique identifier for WebSocket messages
 */
export function generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates WebSocket URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid WebSocket URL
 * @description Validates if URL is a valid WebSocket URL
 */
export function isValidWebSocketUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'ws:' || urlObj.protocol === 'wss:';
    } catch {
        return false;
    }
}

/**
 * Creates WebSocket error
 * 
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {any} [details] - Error details
 * @returns {Object} WebSocket error object
 * @description Creates standardized WebSocket error
 */
export function createWebSocketError(code, message, details) {
    return {
        code,
        message,
        details,
        timestamp: new Date(),
        type: 'websocket_error'
    };
}

/**
 * Formats WebSocket message for logging
 * 
 * @param {Object} message - WebSocket message
 * @returns {string} Formatted message string
 * @description Formats WebSocket message for logging purposes
 */
export function formatWebSocketMessage(message) {
    return `[${message.feature}:${message.type}] ${message.id} - ${JSON.stringify(message.payload).substring(0, 100)}${JSON.stringify(message.payload).length > 100 ? '...' : ''}`;
}

/**
 * Calculates message size in bytes
 * 
 * @param {Object} message - WebSocket message
 * @returns {number} Message size in bytes
 * @description Calculates size of WebSocket message when serialized
 */
export function calculateMessageSize(message) {
    try {
        const messageJson = JSON.stringify(message);
        return new Blob([messageJson]).size;
    } catch (error) {
        console.error('Failed to calculate message size:', error);
        return 0;
    }
}

/**
 * Checks if message is expired
 * 
 * @param {Object} message - WebSocket message
 * @returns {boolean} True if message is expired
 * @description Checks if WebSocket message has expired
 */
export function isMessageExpired(message) {
    if (!message.expiresAt) {
        return false;
    }
    return new Date() > message.expiresAt;
}

/**
 * Creates message correlation ID
 * 
 * @param {string} [prefix] - Optional prefix
 * @returns {string} Correlation ID
 * @description Creates correlation ID for message tracking
 */
export function createCorrelationId(prefix = 'corr') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitizes WebSocket URL
 * 
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL
 * @description Sanitizes WebSocket URL by removing sensitive information
 */
export function sanitizeWebSocketUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }

    try {
        const urlObj = new URL(url);

        // Remove sensitive query parameters
        const sensitiveParams = ['token', 'password', 'key', 'secret'];
        sensitiveParams.forEach(param => {
            urlObj.searchParams.delete(param);
        });

        return urlObj.toString();
    } catch {
        return url;
    }
}

/**
 * Parses WebSocket subprotocol
 * 
 * @param {string} protocol - Protocol string
 * @returns {Object} Parsed protocol information
 * @description Parses WebSocket subprotocol string
 */
export function parseWebSocketSubprotocol(protocol) {
    if (!protocol || typeof protocol !== 'string') {
        return { name: '', version: '', features: [] };
    }

    const parts = protocol.split('-');
    const name = parts[0] || '';
    const version = parts[1] || '';
    const features = parts.slice(2);

    return {
        name,
        version,
        features
    };
}

/**
 * Creates WebSocket connection timeout promise
 * 
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Timeout promise
 * @description Creates promise that rejects after specified timeout
 */
export function createConnectionTimeout(timeout) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(createWebSocketError('CONNECTION_TIMEOUT', `Connection timeout after ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Wraps WebSocket operation with timeout
 * 
 * @param {Promise} operation - Operation to wrap
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Wrapped operation promise
 * @description Wraps WebSocket operation with timeout handling
 */
export function withTimeout(operation, timeout) {
    return Promise.race([
        operation,
        createConnectionTimeout(timeout)
    ]);
}

/**
 * Retry WebSocket operation with exponential backoff
 * 
 * @param {Function} operation - Operation to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Operation result
 * @description Retries WebSocket operation with exponential backoff
 */
export async function retryWithBackoff(operation, maxAttempts = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            if (attempt === maxAttempts) {
                throw error;
            }

            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Debounces function calls
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 * @description Creates debounced version of function
 */
export function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Throttles function calls
 * 
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 * @description Creates throttled version of function
 */
export function throttle(func, delay) {
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();

        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}
