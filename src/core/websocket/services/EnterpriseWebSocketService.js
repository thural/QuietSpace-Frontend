/**
 * Enterprise WebSocket Service.
 * 
 * Centralized WebSocket management following enterprise architecture patterns.
 * Replaces scattered WebSocket implementations across features.
 */

import { TYPES } from '@core/di/types.js';
import { LoggerService } from '@core/services/index.js';

// Import types via JSDoc typedefs
/**
 * @typedef {import('@core/cache/index.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('@core/cache/index.js').FeatureCacheService} FeatureCacheService
 */

/**
 * WebSocket message interface for enterprise communication
 * 
 * @interface WebSocketMessage
 * @description Standardized message format for WebSocket communications
 */
export class WebSocketMessage {
    /**
     * Unique message identifier
     * 
     * @type {string}
     */
    id = '';

    /**
     * Message type for routing and handling
     * 
     * @type {string}
     */
    type = '';

    /**
     * Feature identifier for message categorization
     * 
     * @type {string}
     */
    feature = '';

    /**
     * Message payload data
     * 
     * @type {any}
     */
    payload;

    /**
     * Message creation timestamp
     * 
     * @type {Date}
     */
    timestamp = new Date();

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

    /**
     * Whether message requires acknowledgment
     * 
     * @type {boolean}
     */
    requiresAck = false;

    /**
     * Message expiration time
     * 
     * @type {Date}
     */
    expiresAt;

    /**
     * Message correlation ID for tracking
     * 
     * @type {string}
     */
    correlationId;

    /**
     * Message retry count
     * 
     * @type {number}
     */
    retryCount = 0;

    /**
     * Creates a WebSocket message
     * 
     * @param {Object} options - Message options
     * @returns {WebSocketMessage} Message instance
     * @description Creates a new WebSocket message with provided options
     */
    static create(options = {}) {
        const message = new WebSocketMessage();
        message.id = options.id || message.generateId();
        message.type = options.type || '';
        message.feature = options.feature || '';
        message.payload = options.payload;
        message.timestamp = options.timestamp || new Date();
        message.metadata = options.metadata || {};
        message.priority = options.priority || 0;
        message.requiresAck = options.requiresAck || false;
        message.expiresAt = options.expiresAt;
        message.correlationId = options.correlationId;
        return message;
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

    /**
     * Validates message structure
     * 
     * @returns {boolean} True if message is valid
     * @description Validates message has required fields
     */
    validate() {
        return this.id && this.type && this.feature;
    }

    /**
     * Checks if message is expired
     * 
     * @returns {boolean} True if message is expired
     * @description Checks if message has passed expiration time
     */
    isExpired() {
        if (!this.expiresAt) {
            return false;
        }
        return new Date() > this.expiresAt;
    }

    /**
     * Converts message to JSON
     * 
     * @returns {string} JSON string representation
     * @description Serializes message to JSON
     */
    toJSON() {
        return JSON.stringify({
            id: this.id,
            type: this.type,
            feature: this.feature,
            payload: this.payload,
            timestamp: this.timestamp,
            metadata: this.metadata,
            priority: this.priority,
            requiresAck: this.requiresAck,
            expiresAt: this.expiresAt,
            correlationId: this.correlationId,
            retryCount: this.retryCount
        });
    }

    /**
     * Creates message from JSON
     * 
     * @param {string} json - JSON string
     * @returns {WebSocketMessage} Message instance
     * @description Deserializes message from JSON
     */
    static fromJSON(json) {
        try {
            const data = JSON.parse(json);
            return WebSocketMessage.create(data);
        } catch (error) {
            throw new Error(`Failed to parse WebSocket message: ${error.message}`);
        }
    }
}

/**
 * WebSocket configuration interface
 * 
 * @interface WebSocketConfig
 * @description Configuration for WebSocket service
 */
export class WebSocketConfig {
    /**
     * WebSocket server URL
     * 
     * @type {string}
     */
    url = '';

    /**
     * Reconnection interval in milliseconds
     * 
     * @type {number}
     */
    reconnectInterval = 3000;

    /**
     * Maximum reconnection attempts
     * 
     * @type {number}
     */
    maxReconnectAttempts = 5;

    /**
     * Connection timeout in milliseconds
     * 
     * @type {number}
     */
    timeout = 10000;

    /**
     * Heartbeat interval in milliseconds
     * 
     * @type {number}
     */
    heartbeatInterval = 30000;

    /**
     * Enable message compression
     * 
     * @type {boolean}
     */
    enableCompression = false;

    /**
     * Enable message encryption
     * 
     * @type {boolean}
     */
    enableEncryption = false;

    /**
     * Enable metrics collection
     * 
     * @type {boolean}
     */
    enableMetrics = true;

    /**
     * Enable cache integration
     * 
     * @type {boolean}
     */
    enableCacheIntegration = false;

    /**
     * Enable auto-reconnection
     * 
     * @type {boolean}
     */
    enableAutoReconnect = true;

    /**
     * Message validation enabled
     * 
     * @type {boolean}
     */
    enableMessageValidation = true;

    /**
     * Custom headers for connection
     * 
     * @type {Object}
     */
    headers = {};

    /**
     * Subprotocols to use
     * 
     * @type {string[]}
     */
    subprotocols = [];

    /**
     * Creates WebSocket configuration
     * 
     * @param {Object} options - Configuration options
     * @returns {WebSocketConfig} Configuration instance
     * @description Creates new WebSocket configuration
     */
    static create(options = {}) {
        const config = new WebSocketConfig();
        Object.assign(config, options);
        return config;
    }
}

/**
 * WebSocket event listener interface
 * 
 * @interface WebSocketEventListener
 * @description Event listener for WebSocket events
 */
export class WebSocketEventListener {
    /**
     * Event type
     * 
     * @type {string}
     */
    eventType = '';

    /**
     * Event handler function
     * 
     * @type {Function}
     */
    handler;

    /**
     * Event priority
     * 
     * @type {number}
     */
    priority = 0;

    /**
     * Whether listener is active
     * 
     * @type {boolean}
     */
    active = true;

    /**
     * Creates event listener
     * 
     * @param {string} eventType - Event type
     * @param {Function} handler - Event handler
     * @param {number} [priority] - Event priority
     * @returns {WebSocketEventListener} Event listener instance
     * @description Creates new event listener
     */
    constructor(eventType, handler, priority = 0) {
        this.eventType = eventType;
        this.handler = handler;
        this.priority = priority;
    }

    /**
     * Handles event
     * 
     * @param {Object} event - Event data
     * @returns {Promise} Handler result
     * @description Processes event with handler
     */
    async handle(event) {
        if (!this.active) {
            return;
        }
        try {
            return await this.handler(event);
        } catch (error) {
            console.error(`Error in WebSocket event listener for ${this.eventType}:`, error);
            throw error;
        }
    }

    /**
     * Activates listener
     * 
     * @returns {void}
     * @description Activates event listener
     */
    activate() {
        this.active = true;
    }

    /**
     * Deactivates listener
     * 
     * @returns {void}
     * @description Deactivates event listener
     */
    deactivate() {
        this.active = false;
    }
}

/**
 * Connection metrics interface
 * 
 * @interface ConnectionMetrics
 * @description Metrics for WebSocket connection performance
 */
export class ConnectionMetrics {
    /**
     * Connection start time
     * 
     * @type {Date}
     */
    startTime;

    /**
     * Connection end time
     * 
     * @type {Date}
     */
    endTime;

    /**
     * Total messages sent
     * 
     * @type {number}
     */
    messagesSent = 0;

    /**
     * Total messages received
     * 
     * @type {number}
     */
    messagesReceived = 0;

    /**
     * Total bytes sent
     * 
     * @type {number}
     */
    bytesSent = 0;

    /**
     * Total bytes received
     * 
     * @type {number}
     */
    bytesReceived = 0;

    /**
     * Number of reconnections
     * 
     * @type {number}
     */
    reconnections = 0;

    /**
     * Average latency in milliseconds
     * 
     * @type {number}
     */
    averageLatency = 0;

    /**
     * Connection duration in milliseconds
     * 
     * @type {number}
     */
    get duration() {
        if (this.startTime && this.endTime) {
            return this.endTime - this.startTime;
        }
        return 0;
    }

    /**
     * Gets connection uptime in milliseconds
     * 
     * @returns {number} Uptime duration
     * @description Calculates connection uptime
     */
    get uptime() {
        const endTime = this.endTime || new Date();
        return endTime - this.startTime;
    }

    /**
     * Updates average latency
     * 
     * @param {number} latency - New latency measurement
     * @returns {void}
     * @description Updates running average latency
     */
    updateAverageLatency(latency) {
        const totalMessages = this.messagesSent + this.messagesReceived;
        if (totalMessages === 0) {
            this.averageLatency = latency;
        } else {
            this.averageLatency = (this.averageLatency * (totalMessages - 1) + latency) / totalMessages;
        }
    }

    /**
     * Creates connection metrics
     * 
     * @returns {ConnectionMetrics} Metrics instance
     * @description Creates new connection metrics
     */
    static create() {
        const metrics = new ConnectionMetrics();
        metrics.startTime = new Date();
        return metrics;
    }
}

/**
 * Enterprise WebSocket Service Implementation
 * 
 * @class EnterpriseWebSocketService
 * @description Centralized WebSocket management service
 */
export class EnterpriseWebSocketService {
    /**
     * Service configuration
     * 
     * @type {WebSocketConfig}
     */
    config;

    /**
     * WebSocket connection instance
     * 
     * @type {WebSocket}
     */
    connection;

    /**
     * Event listeners
     * 
     * @type {Map}
     */
    listeners = new Map();

    /**
     * Connection metrics
     * 
     * @type {ConnectionMetrics}
     */
    metrics;

    /**
     * Logger service
     * 
     * @type {LoggerService}
     */
    logger;

    /**
     * Cache service manager
     * 
     * @type {ICacheServiceManager}
     */
    cacheManager;

    /**
     * Connection state
     * 
     * @type {string}
     */
    connectionState = 'disconnected';

    /**
     * Reconnection timer
     * 
     * @type {number}
     */
    reconnectTimer;

    /**
     * Heartbeat timer
     * 
     * @type {number}
     */
    heartbeatTimer;

    /**
     * Message queue
     * 
     * @type {Array}
     */
    messageQueue = [];

    /**
     * Creates enterprise WebSocket service
     * 
     * @param {WebSocketConfig} config - Service configuration
     * @param {LoggerService} [logger] - Logger service
     * @param {ICacheServiceManager} [cacheManager] - Cache service manager
     * @description Initializes enterprise WebSocket service
     */
    constructor(config, logger, cacheManager) {
        this.config = WebSocketConfig.create(config);
        this.logger = logger || new LoggerService();
        this.cacheManager = cacheManager;
        this.metrics = ConnectionMetrics.create();
        this.setupEventListeners();
    }

    /**
     * Connects to WebSocket server
     * 
     * @param {string} [url] - WebSocket URL (overrides config)
     * @returns {Promise} Connection promise
     * @description Establishes WebSocket connection
     */
    async connect(url) {
        const connectUrl = url || this.config.url;

        try {
            this.connectionState = 'connecting';
            this.connection = new WebSocket(connectUrl);

            this.setupConnectionHandlers();
            this.startHeartbeat();

            this.logger.info(`WebSocket connecting to: ${connectUrl}`);

            return new Promise((resolve, reject) => {
                this.connection.onopen = () => {
                    this.connectionState = 'connected';
                    this.metrics.startTime = new Date();
                    this.logger.info('WebSocket connected successfully');
                    resolve();
                };

                this.connection.onerror = (error) => {
                    this.connectionState = 'error';
                    this.logger.error('WebSocket connection error:', error);
                    reject(error);
                };
            });
        } catch (error) {
            this.connectionState = 'error';
            this.logger.error('Failed to create WebSocket connection:', error);
            throw error;
        }
    }

    /**
     * Disconnects from WebSocket server
     * 
     * @returns {Promise} Disconnection promise
     * @description Closes WebSocket connection
     */
    async disconnect() {
        if (this.connection) {
            this.connectionState = 'disconnecting';
            this.stopHeartbeat();
            this.stopReconnectTimer();

            return new Promise((resolve) => {
                this.connection.onclose = () => {
                    this.connectionState = 'disconnected';
                    this.metrics.endTime = new Date();
                    this.logger.info('WebSocket disconnected');
                    resolve();
                };

                this.connection.close();
            });
        }
    }

    /**
     * Sends message through WebSocket
     * 
     * @param {WebSocketMessage} message - Message to send
     * @returns {Promise} Send promise
     * @description Sends message through WebSocket connection
     */
    async send(message) {
        if (!this.connection || this.connectionState !== 'connected') {
            throw new Error('WebSocket not connected');
        }

        try {
            const messageJson = message.toJSON();
            this.connection.send(messageJson);

            this.metrics.messagesSent++;
            this.metrics.bytesSent += new Blob([messageJson]).size;

            this.logger.debug(`Message sent: ${message.id}`);

            return message;
        } catch (error) {
            this.logger.error('Failed to send message:', error);
            throw error;
        }
    }

    /**
     * Adds event listener
     * 
     * @param {string} eventType - Event type
     * @param {Function} handler - Event handler
     * @param {number} [priority] - Event priority
     * @returns {WebSocketEventListener} Event listener
     * @description Adds event listener for WebSocket events
     */
    addEventListener(eventType, handler, priority = 0) {
        const listener = new WebSocketEventListener(eventType, handler, priority);

        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }

        this.listeners.get(eventType).push(listener);
        this.listeners.get(eventType).sort((a, b) => b.priority - a.priority);

        return listener;
    }

    /**
     * Removes event listener
     * 
     * @param {string} eventType - Event type
     * @param {WebSocketEventListener} listener - Event listener
     * @returns {boolean} True if removed
     * @description Removes event listener
     */
    removeEventListener(eventType, listener) {
        if (!this.listeners.has(eventType)) {
            return false;
        }

        const listeners = this.listeners.get(eventType);
        const index = listeners.indexOf(listener);

        if (index > -1) {
            listeners.splice(index, 1);
            return true;
        }

        return false;
    }

    /**
     * Gets connection metrics
     * 
     * @returns {ConnectionMetrics} Current metrics
     * @description Returns current connection metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Gets connection state
     * 
     * @returns {string} Current connection state
     * @description Returns current connection state
     */
    getConnectionState() {
        return this.connectionState;
    }

    /**
     * Sets up connection event handlers
     * 
     * @private
     * @returns {void}
     * @description Sets up WebSocket connection event handlers
     */
    setupConnectionHandlers() {
        this.connection.onmessage = (event) => {
            this.handleMessage(event);
        };

        this.connection.onclose = (event) => {
            this.handleDisconnection(event);
        };

        this.connection.onerror = (event) => {
            this.handleError(event);
        };
    }

    /**
     * Handles incoming message
     * 
     * @private
     * @param {MessageEvent} event - Message event
     * @returns {void}
     * @description Processes incoming WebSocket message
     */
    handleMessage(event) {
        try {
            const message = WebSocketMessage.fromJSON(event.data);
            this.metrics.messagesReceived++;
            this.metrics.bytesReceived += new Blob([event.data]).size;

            this.emitEvent('message', message);

            this.logger.debug(`Message received: ${message.id}`);
        } catch (error) {
            this.logger.error('Failed to handle message:', error);
        }
    }

    /**
     * Handles disconnection
     * 
     * @private
     * @param {CloseEvent} event - Close event
     * @returns {void}
     * @description Handles WebSocket disconnection
     */
    handleDisconnection(event) {
        this.connectionState = 'disconnected';
        this.metrics.endTime = new Date();

        this.emitEvent('disconnect', event);

        if (this.config.enableAutoReconnect) {
            this.scheduleReconnect();
        }

        this.logger.info(`WebSocket disconnected: ${event.code} ${event.reason}`);
    }

    /**
     * Handles connection error
     * 
     * @private
     * @param {Event} event - Error event
     * @returns {void}
     * @description Handles WebSocket connection error
     */
    handleError(event) {
        this.connectionState = 'error';

        this.emitEvent('error', event);

        this.logger.error('WebSocket error:', event);
    }

    /**
     * Emits event to listeners
     * 
     * @private
     * @param {string} eventType - Event type
     * @param {any} data - Event data
     * @returns {Promise} Event handling results
     * @description Emits event to all registered listeners
     */
    async emitEvent(eventType, data) {
        const listeners = this.listeners.get(eventType) || [];

        for (const listener of listeners) {
            try {
                await listener.handle(data);
            } catch (error) {
                this.logger.error(`Error in event listener for ${eventType}:`, error);
            }
        }
    }

    /**
     * Starts heartbeat monitoring
     * 
     * @private
     * @returns {void}
     * @description Starts heartbeat interval
     */
    startHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
        }

        this.heartbeatTimer = setInterval(() => {
            if (this.connectionState === 'connected') {
                this.sendHeartbeat();
            }
        }, this.config.heartbeatInterval);
    }

    /**
     * Stops heartbeat monitoring
     * 
     * @private
     * @returns {void}
     * @description Stops heartbeat interval
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * Sends heartbeat message
     * 
     * @private
     * @returns {void}
     * @description Sends heartbeat message
     */
    sendHeartbeat() {
        const heartbeatMessage = WebSocketMessage.create({
            type: 'heartbeat',
            feature: 'system',
            payload: { timestamp: new Date().toISOString() }
        });

        this.send(heartbeatMessage).catch(error => {
            this.logger.error('Failed to send heartbeat:', error);
        });
    }

    /**
     * Schedules reconnection
     * 
     * @private
     * @returns {void}
     * @description Schedules automatic reconnection
     */
    scheduleReconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        this.reconnectTimer = setTimeout(() => {
            if (this.metrics.reconnections < this.config.maxReconnectAttempts) {
                this.metrics.reconnections++;
                this.logger.info(`Attempting reconnection ${this.metrics.reconnections}/${this.config.maxReconnectAttempts}`);
                this.connect().catch(error => {
                    this.logger.error('Reconnection failed:', error);
                });
            } else {
                this.logger.error('Max reconnection attempts reached');
            }
        }, this.config.reconnectInterval);
    }

    /**
     * Stops reconnection timer
     * 
     * @private
     * @returns {void}
     * @description Stops reconnection attempts
     */
    stopReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    /**
     * Sets up event listeners
     * 
     * @private
     * @returns {void}
     * @description Sets up default event listeners
     */
    setupEventListeners() {
        // Add default listeners for system events
        this.addEventListener('connect', () => {
            this.logger.info('WebSocket connected');
        });

        this.addEventListener('disconnect', () => {
            this.logger.info('WebSocket disconnected');
        });

        this.addEventListener('error', (error) => {
            this.logger.error('WebSocket error:', error);
        });
    }
}
