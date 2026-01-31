/**
 * WebSocket Message Router Service.
 * 
 * Handles feature-based message routing, validation, and transformation
 * for enterprise WebSocket communications.
 */

import { TYPES } from '@core/di/types.js';
import { LoggerService } from '@core/services/index.js';
import { WebSocketMessage } from './EnterpriseWebSocketService.js';

/**
 * Message route interface
 * 
 * @interface MessageRoute
 * @description Route configuration for message handling
 */
export class MessageRoute {
    /**
     * Feature identifier
     * 
     * @type {string}
     */
    feature = '';

    /**
     * Message type
     * 
     * @type {string}
     */
    messageType = '';

    /**
     * Message handler function
     * 
     * @type {Function}
     */
    handler;

    /**
     * Message validator function
     * 
     * @type {Function}
     */
    validator;

    /**
     * Message transformer function
     * 
     * @type {Function}
     */
    transformer;

    /**
     * Route priority
     * 
     * @type {number}
     */
    priority = 0;

    /**
     * Whether route is enabled
     * 
     * @type {boolean}
     */
    enabled = true;

    /**
     * Creates message route
     * 
     * @param {Object} options - Route options
     * @returns {MessageRoute} Message route instance
     * @description Creates new message route
     */
    static create(options = {}) {
        const route = new MessageRoute();
        Object.assign(route, options);
        return route;
    }
}

/**
 * Message handler interface
 * 
 * @interface MessageHandler
 * @description Function type for message handling
 */
export class MessageHandler {
    /**
     * Handler function
     * 
     * @type {Function}
     */
    handler;

    /**
     * Creates message handler
     * 
     * @param {Function} handler - Handler function
     * @returns {MessageHandler} Message handler instance
     * @description Creates new message handler
     */
    constructor(handler) {
        this.handler = handler;
    }

    /**
     * Handles message
     * 
     * @param {WebSocketMessage} message - Message to handle
     * @returns {Promise} Handler result
     * @description Processes message with handler
     */
    async handle(message) {
        return await this.handler(message);
    }
}

/**
 * Message validator interface
 * 
 * @interface MessageValidator
 * @description Function type for message validation
 */
export class MessageValidator {
    /**
     * Validator function
     * 
     * @type {Function}
     */
    validator;

    /**
     * Creates message validator
     * 
     * @param {Function} validator - Validator function
     * @returns {MessageValidator} Message validator instance
     * @description Creates new message validator
     */
    constructor(validator) {
        this.validator = validator;
    }

    /**
     * Validates message
     * 
     * @param {WebSocketMessage} message - Message to validate
     * @returns {Promise<boolean>} Validation result
     * @description Validates message with validator
     */
    async validate(message) {
        return await this.validator(message);
    }
}

/**
 * Message transformer interface
 * 
 * @interface MessageTransformer
 * @description Function type for message transformation
 */
export class MessageTransformer {
    /**
     * Transformer function
     * 
     * @type {Function}
     */
    transformer;

    /**
     * Creates message transformer
     * 
     * @param {Function} transformer - Transformer function
     * @returns {MessageTransformer} Message transformer instance
     * @description Creates new message transformer
     */
    constructor(transformer) {
        this.transformer = transformer;
    }

    /**
     * Transforms message
     * 
     * @param {WebSocketMessage} message - Message to transform
     * @returns {Promise<WebSocketMessage>} Transformed message
     * @description Transforms message with transformer
     */
    async transform(message) {
        return await this.transformer(message);
    }
}

/**
 * Routing metrics interface
 * 
 * @interface RoutingMetrics
 * @description Metrics for message routing performance
 */
export class RoutingMetrics {
    /**
     * Total messages processed
     * 
     * @type {number}
     */
    totalMessages = 0;

    /**
     * Messages successfully routed
     * 
     * @type {number}
     */
    messagesRouted = 0;

    /**
     * Messages dropped
     * 
     * @type {number}
     */
    messagesDropped = 0;

    /**
     * Validation errors count
     * 
     * @type {number}
     */
    validationErrors = 0;

    /**
     * Transformation errors count
     * 
     * @type {number}
     */
    transformationErrors = 0;

    /**
     * Average processing time in milliseconds
     * 
     * @type {number}
     */
    averageProcessingTime = 0;

    /**
     * Feature-specific statistics
     * 
     * @type {Map}
     */
    featureStats = new Map();

    /**
     * Creates routing metrics
     * 
     * @returns {RoutingMetrics} Metrics instance
     * @description Creates new routing metrics
     */
    static create() {
        return new RoutingMetrics();
    }

    /**
     * Updates processing time average
     * 
     * @param {number} processingTime - Processing time in milliseconds
     * @returns {void}
     * @description Updates average processing time
     */
    updateAverageProcessingTime(processingTime) {
        if (this.totalMessages === 0) {
            this.averageProcessingTime = processingTime;
        } else {
            this.averageProcessingTime = (this.averageProcessingTime * (this.totalMessages - 1) + processingTime) / this.totalMessages;
        }
    }

    /**
     * Gets feature statistics
     * 
     * @param {string} feature - Feature name
     * @returns {FeatureMessageStats} Feature statistics
     * @description Gets statistics for specific feature
     */
    getFeatureStats(feature) {
        if (!this.featureStats.has(feature)) {
            this.featureStats.set(feature, new FeatureMessageStats());
        }
        return this.featureStats.get(feature);
    }
}

/**
 * Feature message statistics interface
 * 
 * @interface FeatureMessageStats
 * @description Statistics for feature-specific messages
 */
export class FeatureMessageStats {
    /**
     * Message count for feature
     * 
     * @type {number}
     */
    messageCount = 0;

    /**
     * Average latency in milliseconds
     * 
     * @type {number}
     */
    averageLatency = 0;

    /**
     * Error count for feature
     * 
     * @type {number}
     */
    errorCount = 0;

    /**
     * Last message timestamp
     * 
     * @type {Date}
     */
    lastMessageAt;

    /**
     * Creates feature message statistics
     * 
     * @returns {FeatureMessageStats} Statistics instance
     * @description Creates new feature message statistics
     */
    static create() {
        return new FeatureMessageStats();
    }

    /**
     * Updates average latency
     * 
     * @param {number} latency - Latency in milliseconds
     * @returns {void}
     * @description Updates average latency
     */
    updateAverageLatency(latency) {
        if (this.messageCount === 0) {
            this.averageLatency = latency;
        } else {
            this.averageLatency = (this.averageLatency * (this.messageCount - 1) + latency) / this.messageCount;
        }
    }

    /**
     * Increments message count
     * 
     * @returns {void}
     * @description Increments message count
     */
    incrementMessageCount() {
        this.messageCount++;
        this.lastMessageAt = new Date();
    }

    /**
     * Increments error count
     * 
     * @returns {void}
     * @description Increments error count
     */
    incrementErrorCount() {
        this.errorCount++;
    }
}

/**
 * Message router configuration interface
 * 
 * @interface MessageRouterConfig
 * @description Configuration for message router
 */
export class MessageRouterConfig {
    /**
     * Enable message validation
     * 
     * @type {boolean}
     */
    enableValidation = true;

    /**
     * Enable message transformation
     * 
     * @type {boolean}
     */
    enableTransformation = false;

    /**
     * Enable metrics collection
     * 
     * @type {boolean}
     */
    enableMetrics = true;

    /**
     * Default timeout for message processing
     * 
     * @type {number}
     */
    defaultTimeout = 30000;

    /**
     * Maximum concurrent message processing
     * 
     * @type {number}
     */
    maxConcurrentMessages = 100;

    /**
     * Enable message queuing
     * 
     * @type {boolean}
     */
    enableQueuing = true;

    /**
     * Maximum queue size
     * 
     * @type {number}
     */
    maxQueueSize = 1000;

    /**
     * Creates message router configuration
     * 
     * @param {Object} options - Configuration options
     * @returns {MessageRouterConfig} Configuration instance
     * @description Creates new message router configuration
     */
    static create(options = {}) {
        const config = new MessageRouterConfig();
        Object.assign(config, options);
        return config;
    }
}

/**
 * WebSocket Message Router Implementation
 * 
 * @class MessageRouter
 * @description Routes WebSocket messages to appropriate handlers
 */
export class MessageRouter {
    /**
     * Router configuration
     * 
     * @type {MessageRouterConfig}
     */
    config;

    /**
     * Registered message routes
     * 
     * @type {Array}
     */
    routes = [];

    /**
     * Logger service
     * 
     * @type {LoggerService}
     */
    logger;

    /**
     * Routing metrics
     * 
     * @type {RoutingMetrics}
     */
    metrics;

    /**
     * Message queue
     * 
     * @type {Array}
     */
    messageQueue = [];

    /**
     * Currently processing messages
     * 
     * @type {number}
     */
    processingMessages = 0;

    /**
     * Creates message router
     * 
     * @param {MessageRouterConfig} config - Router configuration
     * @param {LoggerService} [logger] - Logger service
     * @description Initializes message router
     */
    constructor(config, logger) {
        this.config = MessageRouterConfig.create(config);
        this.logger = logger || new LoggerService();
        this.metrics = RoutingMetrics.create();
    }

    /**
     * Registers message route
     * 
     * @param {MessageRoute} route - Message route to register
     * @returns {void}
     * @description Registers new message route
     */
    registerRoute(route) {
        this.routes.push(route);
        this.routes.sort((a, b) => b.priority - a.priority);
        this.logger.info(`Registered message route: ${route.feature}:${route.messageType}`);
    }

    /**
     * Unregisters message route
     * 
     * @param {string} feature - Feature name
     * @param {string} messageType - Message type
     * @returns {boolean} True if route was unregistered
     * @description Unregisters message route
     */
    unregisterRoute(feature, messageType) {
        const index = this.routes.findIndex(route =>
            route.feature === feature && route.messageType === messageType
        );

        if (index > -1) {
            this.routes.splice(index, 1);
            this.logger.info(`Unregistered message route: ${feature}:${messageType}`);
            return true;
        }

        return false;
    }

    /**
     * Routes message to appropriate handler
     * 
     * @param {WebSocketMessage} message - Message to route
     * @returns {Promise} Routing result
     * @description Routes message through registered routes
     */
    async routeMessage(message) {
        const startTime = Date.now();

        try {
            this.metrics.totalMessages++;

            // Find matching route
            const route = this.findRoute(message);
            if (!route) {
                this.metrics.messagesDropped++;
                this.logger.warn(`No route found for message: ${message.feature}:${message.type}`);
                return { success: false, reason: 'No route found' };
            }

            // Validate message if enabled
            if (this.config.enableValidation && route.validator) {
                const isValid = await route.validator.validate(message);
                if (!isValid) {
                    this.metrics.validationErrors++;
                    this.logger.warn(`Message validation failed: ${message.id}`);
                    return { success: false, reason: 'Validation failed' };
                }
            }

            // Transform message if enabled
            let processedMessage = message;
            if (this.config.enableTransformation && route.transformer) {
                try {
                    processedMessage = await route.transformer.transform(message);
                } catch (error) {
                    this.metrics.transformationErrors++;
                    this.logger.error(`Message transformation failed: ${message.id}`, error);
                    return { success: false, reason: 'Transformation failed' };
                }
            }

            // Handle message
            await route.handler(processedMessage);

            // Update metrics
            this.metrics.messagesRouted++;
            const processingTime = Date.now() - startTime;
            this.metrics.updateAverageProcessingTime(processingTime);

            // Update feature stats
            const featureStats = this.metrics.getFeatureStats(message.feature);
            featureStats.incrementMessageCount();
            featureStats.updateAverageLatency(processingTime);

            this.logger.debug(`Message routed successfully: ${message.id}`);

            return { success: true, message: processedMessage };

        } catch (error) {
            // Update error metrics
            this.metrics.messagesDropped++;
            const featureStats = this.metrics.getFeatureStats(message.feature);
            featureStats.incrementErrorCount();

            this.logger.error(`Error routing message: ${message.id}`, error);
            return { success: false, reason: 'Handler error', error };
        }
    }

    /**
     * Queues message for processing
     * 
     * @param {WebSocketMessage} message - Message to queue
     * @returns {boolean} True if message was queued
     * @description Queues message if queuing is enabled
     */
    queueMessage(message) {
        if (!this.config.enableQueuing) {
            return false;
        }

        if (this.messageQueue.length >= this.config.maxQueueSize) {
            this.messageQueue.shift(); // Remove oldest message
            this.logger.warn('Message queue full, dropped oldest message');
        }

        this.messageQueue.push(message);
        this.logger.debug(`Message queued: ${message.id}`);
        return true;
    }

    /**
     * Processes queued messages
     * 
     * @returns {Promise} Processing results
     * @description Processes all queued messages
     */
    async processQueuedMessages() {
        const messages = [...this.messageQueue];
        this.messageQueue = [];

        const results = [];
        for (const message of messages) {
            const result = await this.routeMessage(message);
            results.push(result);
        }

        return results;
    }

    /**
     * Gets routing metrics
     * 
     * @returns {RoutingMetrics} Current metrics
     * @description Returns current routing metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Gets registered routes
     * 
     * @returns {Array} Registered routes
     * @description Returns all registered routes
     */
    getRoutes() {
        return [...this.routes];
    }

    /**
     * Finds matching route for message
     * 
     * @private
     * @param {WebSocketMessage} message - Message to find route for
     * @returns {MessageRoute|null} Matching route or null
     * @description Finds route that matches message
     */
    findRoute(message) {
        return this.routes.find(route =>
            route.enabled &&
            route.feature === message.feature &&
            route.messageType === message.type
        ) || null;
    }

    /**
     * Clears all routes
     * 
     * @returns {void}
     * @description Removes all registered routes
     */
    clearRoutes() {
        this.routes = [];
        this.logger.info('All message routes cleared');
    }

    /**
     * Gets route statistics
     * 
     * @returns {Object} Route statistics
     * @description Returns statistics about registered routes
     */
    getRouteStatistics() {
        const stats = {
            totalRoutes: this.routes.length,
            enabledRoutes: this.routes.filter(route => route.enabled).length,
            routesByFeature: {},
            routesByType: {}
        };

        for (const route of this.routes) {
            // Group by feature
            if (!stats.routesByFeature[route.feature]) {
                stats.routesByFeature[route.feature] = 0;
            }
            stats.routesByFeature[route.feature]++;

            // Group by type
            if (!stats.routesByType[route.messageType]) {
                stats.routesByType[route.messageType] = 0;
            }
            stats.routesByType[route.messageType]++;
        }

        return stats;
    }
}
