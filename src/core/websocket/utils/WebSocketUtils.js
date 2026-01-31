/**
 * WebSocket Utilities.
 * 
 * Utility functions and helpers for WebSocket operations.
 */

import { WEBSOCKET_MESSAGE_TYPES, WEBSOCKET_ERROR_CODES } from '../constants/WebSocketConstants.js';

// Import types via JSDoc typedefs
/**
 * @typedef {import('../services/EnterpriseWebSocketService.js').WebSocketMessage} WebSocketMessage
 */

/**
 * Message builder options interface
 * 
 * @interface MessageBuilderOptions
 * @description Options for building WebSocket messages
 */
export class MessageBuilderOptions {
    /**
     * Feature name
     * 
     * @type {string}
     */
    feature = '';

    /**
     * Message type
     * 
     * @type {string}
     */
    type = '';

    /**
     * Message payload
     * 
     * @type {any}
     */
    payload;

    /**
     * Message metadata
     * 
     * @type {Object}
     */
    metadata = {};

    /**
     * Message priority
     * 
     * @type {number}
     */
    priority = 0;
}

/**
 * Validation rule interface
 * 
 * @interface ValidationRule
 * @description Rule for validating message fields
 */
export class ValidationRule {
    /**
     * Field name
     * 
     * @type {string}
     */
    field = '';

    /**
     * Whether field is required
     * 
     * @type {boolean}
     */
    required = false;

    /**
     * Field type
     * 
     * @type {string}
     */
    type = 'string';

    /**
     * Minimum length
     * 
     * @type {number}
     */
    minLength;

    /**
     * Maximum length
     * 
     * @type {number}
     */
    maxLength;

    /**
     * Validation pattern
     * 
     * @type {RegExp}
     */
    pattern;

    /**
     * Custom validation function
     * 
     * @type {Function}
     */
    custom;
}

/**
 * Connection monitor configuration interface
 * 
 * @interface ConnectionMonitorConfig
 * @description Configuration for connection monitoring
 */
export class ConnectionMonitorConfig {
    /**
     * Heartbeat interval in milliseconds
     * 
     * @type {number}
     */
    heartbeatInterval = 30000;

    /**
     * Timeout threshold in milliseconds
     * 
     * @type {number}
     */
    timeoutThreshold = 60000;

    /**
     * Maximum missed heartbeats
     * 
     * @type {number}
     */
    maxMissedHeartbeats = 3;

    /**
     * Enable automatic reconnection
     * 
     * @type {boolean}
     */
    enableReconnect = true;
}

/**
 * WebSocket Message Builder
 * 
 * @class WebSocketMessageBuilder
 * @description Utility class for building WebSocket messages with validation
 */
export class WebSocketMessageBuilder {
    /**
     * Message being built
     * 
     * @type {Object}
     */
    message = {};

    /**
     * Creates a message builder instance
     * 
     * @param {MessageBuilderOptions} options - Builder options
     * @description Initializes message builder with options
     */
    constructor(options) {
        this.message = {
            id: this.generateId(),
            type: options.type,
            feature: options.feature,
            payload: options.payload,
            timestamp: new Date(),
            metadata: {
                ...options.metadata,
                priority: options.priority || 0
            }
        };
    }

    /**
     * Sets message ID
     * 
     * @param {string} id - Message ID
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Sets message ID
     */
    setId(id) {
        this.message.id = id;
        return this;
    }

    /**
     * Sets message type
     * 
     * @param {string} type - Message type
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Sets message type
     */
    setType(type) {
        this.message.type = type;
        return this;
    }

    /**
     * Sets message feature
     * 
     * @param {string} feature - Feature name
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Sets message feature
     */
    setFeature(feature) {
        this.message.feature = feature;
        return this;
    }

    /**
     * Sets message payload
     * 
     * @param {any} payload - Message payload
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Sets message payload
     */
    setPayload(payload) {
        this.message.payload = payload;
        return this;
    }

    /**
     * Adds metadata
     * 
     * @param {string} key - Metadata key
     * @param {any} value - Metadata value
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Adds metadata to message
     */
    addMetadata(key, value) {
        this.message.metadata[key] = value;
        return this;
    }

    /**
     * Sets message priority
     * 
     * @param {number} priority - Message priority
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Sets message priority
     */
    setPriority(priority) {
        this.message.metadata.priority = priority;
        return this;
    }

    /**
     * Sets timestamp
     * 
     * @param {Date} timestamp - Message timestamp
     * @returns {WebSocketMessageBuilder} Builder instance for chaining
     * @description Sets message timestamp
     */
    setTimestamp(timestamp) {
        this.message.timestamp = timestamp;
        return this;
    }

    /**
     * Builds the message
     * 
     * @returns {Object} Complete WebSocket message
     * @description Builds and returns the complete message
     */
    build() {
        return { ...this.message };
    }

    /**
     * Generates unique message ID
     * 
     * @returns {string} Unique message ID
     * @description Generates unique identifier for message
     */
    generateId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * WebSocket Message Validator
 * 
 * @class WebSocketMessageValidator
 * @description Utility class for validating WebSocket messages
 */
export class WebSocketMessageValidator {
    /**
     * Validation rules
     * 
     * @type {ValidationRule[]}
     */
    rules = [];

    /**
     * Creates a message validator instance
     * 
     * @param {ValidationRule[]} [rules] - Validation rules
     * @description Initializes validator with rules
     */
    constructor(rules = []) {
        this.rules = rules;
    }

    /**
     * Adds validation rule
     * 
     * @param {ValidationRule} rule - Validation rule
     * @returns {WebSocketMessageValidator} Validator instance for chaining
     * @description Adds validation rule
     */
    addRule(rule) {
        this.rules.push(rule);
        return this;
    }

    /**
     * Validates message
     * 
     * @param {Object} message - Message to validate
     * @returns {Object} Validation result
     * @description Validates message against rules
     */
    validate(message) {
        const errors = [];
        const warnings = [];

        for (const rule of this.rules) {
            const result = this.validateField(message, rule);
            if (!result.valid) {
                errors.push(...result.errors);
            }
            warnings.push(...result.warnings);
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates specific field
     * 
     * @private
     * @param {Object} message - Message to validate
     * @param {ValidationRule} rule - Validation rule
     * @returns {Object} Field validation result
     * @description Validates specific field against rule
     */
    validateField(message, rule) {
        const errors = [];
        const warnings = [];
        const value = this.getNestedValue(message, rule.field);

        // Check required fields
        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`Field '${rule.field}' is required`);
            return { valid: false, errors, warnings };
        }

        // Skip validation if field is not provided and not required
        if (value === undefined || value === null) {
            return { valid: true, errors, warnings };
        }

        // Type validation
        if (rule.type && !this.validateType(value, rule.type)) {
            errors.push(`Field '${rule.field}' must be of type ${rule.type}`);
        }

        // Length validation
        if (typeof value === 'string') {
            if (rule.minLength !== undefined && value.length < rule.minLength) {
                errors.push(`Field '${rule.field}' must be at least ${rule.minLength} characters long`);
            }
            if (rule.maxLength !== undefined && value.length > rule.maxLength) {
                errors.push(`Field '${rule.field}' must be no more than ${rule.maxLength} characters long`);
            }
        }

        // Pattern validation
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            errors.push(`Field '${rule.field}' does not match required pattern`);
        }

        // Custom validation
        if (rule.custom && typeof rule.custom === 'function') {
            try {
                if (!rule.custom(value)) {
                    errors.push(`Field '${rule.field}' failed custom validation`);
                }
            } catch (error) {
                errors.push(`Custom validation for field '${rule.field}' failed: ${error.message}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Validates value type
     * 
     * @private
     * @param {any} value - Value to validate
     * @param {string} type - Expected type
     * @returns {boolean} True if type matches
     * @description Validates value type
     */
    validateType(value, type) {
        switch (type) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'object':
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            case 'array':
                return Array.isArray(value);
            default:
                return true;
        }
    }

    /**
     * Gets nested value from object
     * 
     * @private
     * @param {Object} obj - Object to get value from
     * @param {string} path - Path to value
     * @returns {any} Nested value
     * @description Gets nested value using dot notation
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }
}

/**
 * WebSocket Connection Monitor
 * 
 * @class WebSocketConnectionMonitor
 * @description Monitors WebSocket connection health and performance
 */
export class WebSocketConnectionMonitor {
    /**
     * Monitor configuration
     * 
     * @type {ConnectionMonitorConfig}
     */
    config;

    /**
     * Connection state
     * 
     * @type {string}
     */
    connectionState = 'disconnected';

    /**
     * Last heartbeat timestamp
     * 
     * @type {Date}
     */
    lastHeartbeat;

    /**
     * Missed heartbeat count
     * 
     * @type {number}
     */
    missedHeartbeats = 0;

    /**
     * Heartbeat interval timer
     * 
     * @type {number}
     */
    heartbeatTimer;

    /**
     * Connection callbacks
     * 
     * @type {Object}
     */
    callbacks = {};

    /**
     * Creates a connection monitor instance
     * 
     * @param {ConnectionMonitorConfig} config - Monitor configuration
     * @description Initializes connection monitor
     */
    constructor(config) {
        this.config = {
            heartbeatInterval: 30000,
            timeoutThreshold: 60000,
            maxMissedHeartbeats: 3,
            enableReconnect: true,
            ...config
        };

        this.callbacks = {
            onHeartbeat: [],
            onTimeout: [],
            onReconnect: [],
            onDisconnect: []
        };
    }

    /**
     * Starts monitoring
     * 
     * @returns {void}
     * @description Starts connection monitoring
     */
    start() {
        this.startHeartbeat();
    }

    /**
     * Stops monitoring
     * 
     * @returns {void}
     * @description Stops connection monitoring
     */
    stop() {
        this.stopHeartbeat();
    }

    /**
     * Updates connection state
     * 
     * @param {string} state - New connection state
     * @returns {void}
     * @description Updates connection state
     */
    updateConnectionState(state) {
        const previousState = this.connectionState;
        this.connectionState = state;

        if (state === 'connected') {
            this.missedHeartbeats = 0;
            this.lastHeartbeat = new Date();
        }

        // Trigger state change callbacks
        this.triggerStateChangeCallbacks(previousState, state);
    }

    /**
     * Handles heartbeat
     * 
     * @returns {void}
     * @description Handles heartbeat message
     */
    handleHeartbeat() {
        this.lastHeartbeat = new Date();
        this.missedHeartbeats = 0;

        // Trigger heartbeat callbacks
        this.callbacks.onHeartbeat.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Heartbeat callback error:', error);
            }
        });
    }

    /**
     * Checks connection health
     * 
     * @returns {Object} Health status
     * @description Checks connection health
     */
    checkHealth() {
        const now = new Date();
        const timeSinceLastHeartbeat = this.lastHeartbeat ? now - this.lastHeartbeat : Infinity;

        const isHealthy = this.connectionState === 'connected' && 
                         timeSinceLastHeartbeat < this.config.timeoutThreshold &&
                         this.missedHeartbeats < this.config.maxMissedHeartbeats;

        return {
            healthy: isHealthy,
            connectionState: this.connectionState,
            lastHeartbeat: this.lastHeartbeat,
            timeSinceLastHeartbeat,
            missedHeartbeats: this.missedHeartbeats,
            config: this.config
        };
    }

    /**
     * Adds callback for connection events
     * 
     * @param {string} event - Event type
     * @param {Function} callback - Callback function
     * @returns {void}
     * @description Adds callback for connection events
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * Starts heartbeat timer
     * 
     * @private
     * @returns {void}
     * @description Starts heartbeat monitoring
     */
    startHeartbeat() {
        this.stopHeartbeat(); // Clear existing timer

        this.heartbeatTimer = setInterval(() => {
            this.checkHeartbeatTimeout();
        }, this.config.heartbeatInterval);
    }

    /**
     * Stops heartbeat timer
     * 
     * @private
     * @returns {void}
     * @description Stops heartbeat monitoring
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * Checks heartbeat timeout
     * 
     * @private
     * @returns {void}
     * @description Checks for heartbeat timeout
     */
    checkHeartbeatTimeout() {
        const now = new Date();
        const timeSinceLastHeartbeat = this.lastHeartbeat ? now - this.lastHeartbeat : Infinity;

        if (timeSinceLastHeartbeat > this.config.timeoutThreshold) {
            this.missedHeartbeats++;

            if (this.missedHeartbeats >= this.config.maxMissedHeartbeats) {
                this.handleTimeout();
            }
        }
    }

    /**
     * Handles connection timeout
     * 
     * @private
     * @returns {void}
     * @description Handles connection timeout
     */
    handleTimeout() {
        this.updateConnectionState('disconnected');

        // Trigger timeout callbacks
        this.callbacks.onTimeout.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Timeout callback error:', error);
            }
        });

        // Attempt reconnection if enabled
        if (this.config.enableReconnect) {
            this.attemptReconnect();
        }
    }

    /**
     * Attempts reconnection
     * 
     * @private
     * @returns {void}
     * @description Attempts to reconnect
     */
    attemptReconnect() {
        this.updateConnectionState('reconnecting');

        // Trigger reconnect callbacks
        this.callbacks.onReconnect.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Reconnect callback error:', error);
            }
        });
    }

    /**
     * Triggers state change callbacks
     * 
     * @private
     * @param {string} previousState - Previous connection state
     * @param {string} newState - New connection state
     * @returns {void}
     * @description Triggers callbacks for state changes
     */
    triggerStateChangeCallbacks(previousState, newState) {
        if (previousState === 'connected' && newState !== 'connected') {
            this.callbacks.onDisconnect.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.error('Disconnect callback error:', error);
                }
            });
        }
    }
}

/**
 * Creates WebSocket message builder
 * 
 * @param {MessageBuilderOptions} options - Builder options
 * @returns {WebSocketMessageBuilder} Message builder instance
 * @description Creates new message builder
 */
export function createWebSocketMessageBuilder(options) {
    return new WebSocketMessageBuilder(options);
}

/**
 * Creates WebSocket message validator
 * 
 * @param {ValidationRule[]} [rules] - Validation rules
 * @returns {WebSocketMessageValidator} Message validator instance
 * @description Creates new message validator
 */
export function createWebSocketMessageValidator(rules) {
    return new WebSocketMessageValidator(rules);
}

/**
 * Creates WebSocket connection monitor
 * 
 * @param {ConnectionMonitorConfig} config - Monitor configuration
 * @returns {WebSocketConnectionMonitor} Connection monitor instance
 * @description Creates new connection monitor
 */
export function createWebSocketConnectionMonitor(config) {
    return new WebSocketConnectionMonitor(config);
}

/**
 * Validates WebSocket URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid WebSocket URL
 * @description Validates WebSocket URL format
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
