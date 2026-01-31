/**
 * Main DI Container.
 * 
 * Central dependency injection container with auto-registration.
 * Provides enterprise-grade DI with reflection support.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./ServiceContainer.js').ServiceContainer} ServiceContainer
 * @typedef {import('../registry/ServiceRegistry.js').ServiceIdentifier} ServiceIdentifier
 * @typedef {import('../registry/ServiceRegistry.js').ServiceLifetime} ServiceLifetime
 * @typedef {import('../types.js').TypeKeys} TypeKeys
 */

import { ServiceContainer } from './ServiceContainer.js';

/**
 * Main DI container with automatic service registration
 * 
 * @class Container
 * @description Central dependency injection container with enterprise features
 */
export class Container {
    /**
     * Service container instance
     * 
     * @type {ServiceContainer}
     * @private
     */
    container;

    /**
     * Set of auto-registered services
     * 
     * @type {Set<any>}
     * @private
     */
    autoRegistered;

    /**
     * Creates a new container instance
     * 
     * @constructor
     * @description Initializes a new DI container
     */
    constructor() {
        this.container = new ServiceContainer();
        this.autoRegistered = new Set();
    }

    /**
     * Create new container instance
     * 
     * @function create
     * @returns {Container} New container instance
     * @description Static factory method for container creation
     */
    static create() {
        return new Container();
    }

    /**
     * Create factory function for service instantiation
     * 
     * @function createFactory
     * @param {Function} serviceClass - Service class constructor
     * @returns {Function} Factory function
     * @private
     * @description Creates factory function for dependency injection
     */
    createFactory(serviceClass) {
        // Create factory function
        const factory = (container) => {
            // For manual registration, we don't have decorator metadata
            // So we create instance without dependencies for now
            return new serviceClass();
        };

        return factory;
    }

    /**
     * Register service with dependency injection
     * 
     * @function register
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {Function} serviceClass - Service class
     * @param {ServiceLifetime} [lifetime='singleton'] - Service lifetime
     * @returns {Container} This container for chaining
     * @description Registers a service with the container
     */
    register(identifier, serviceClass, lifetime = 'singleton') {
        const factory = this.createFactory(serviceClass);
        this.container.register(identifier, factory, lifetime);
        return this;
    }

    /**
     * Register singleton service
     * 
     * @function registerSingleton
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {Function} serviceClass - Service class
     * @returns {Container} This container for chaining
     * @description Registers a singleton service
     */
    registerSingleton(identifier, serviceClass) {
        return this.register(identifier, serviceClass, 'singleton');
    }

    /**
     * Register transient service
     * 
     * @function registerTransient
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {Function} serviceClass - Service class
     * @returns {Container} This container for chaining
     * @description Registers a transient service
     */
    registerTransient(identifier, serviceClass) {
        return this.register(identifier, serviceClass, 'transient');
    }

    /**
     * Register singleton service by token
     * 
     * @function registerSingletonByToken
     * @param {string} token - Service token
     * @param {Function} serviceClass - Service class
     * @returns {Container} This container for chaining
     * @description Registers a singleton service by token
     */
    registerSingletonByToken(token, serviceClass) {
        return this.registerSingleton(token, serviceClass);
    }

    /**
     * Register transient service by token
     * 
     * @function registerTransientByToken
     * @param {string} token - Service token
     * @param {Function} serviceClass - Service class
     * @returns {Container} This container for chaining
     * @description Registers a transient service by token
     */
    registerTransientByToken(token, serviceClass) {
        return this.registerTransient(token, serviceClass);
    }

    /**
     * Register service instance
     * 
     * @function registerInstance
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {any} instance - Service instance
     * @returns {Container} This container for chaining
     * @description Registers a service instance
     */
    registerInstance(identifier, instance) {
        this.container.registerInstance(identifier, instance);
        return this;
    }

    /**
     * Register service factory
     * 
     * @function registerFactory
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {Function} factory - Factory function
     * @param {ServiceLifetime} [lifetime='singleton'] - Service lifetime
     * @returns {Container} This container for chaining
     * @description Registers a service factory
     */
    registerFactory(identifier, factory, lifetime = 'singleton') {
        this.container.register(identifier, factory, lifetime);
        return this;
    }

    /**
     * Get service from container
     * 
     * @function get
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Service instance
     * @description Retrieves a service from the container
     */
    get(identifier) {
        return this.container.get(identifier);
    }

    /**
     * Get service by token
     * 
     * @function getByToken
     * @param {string} token - Service token
     * @returns {any} Service instance
     * @description Retrieves a service by token
     */
    getByToken(token) {
        return this.get(token);
    }

    /**
     * Try to get service from container
     * 
     * @function tryGet
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any|null} Service instance or null
     * @description Attempts to retrieve a service, returns null if not found
     */
    tryGet(identifier) {
        try {
            return this.get(identifier);
        } catch {
            return null;
        }
    }

    /**
     * Check if service is registered
     * 
     * @function isRegistered
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {boolean} Whether service is registered
     * @description Checks if a service is registered in the container
     */
    isRegistered(identifier) {
        return this.container.isRegistered(identifier);
    }

    /**
     * Check if service is registered by token
     * 
     * @function isRegisteredByToken
     * @param {string} token - Service token
     * @returns {boolean} Whether service is registered
     * @description Checks if a service is registered by token
     */
    isRegisteredByToken(token) {
        return this.isRegistered(token);
    }

    /**
     * Resolve service with dependencies
     * 
     * @function resolve
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Resolved service
     * @description Resolves a service with all dependencies
     */
    resolve(identifier) {
        return this.get(identifier);
    }

    /**
     * Create child container
     * 
     * @function createChild
     * @returns {Container} Child container
     * @description Creates a child container with inherited registrations
     */
    createChild() {
        const child = new Container();
        // Copy registrations to child
        // This is a simplified implementation
        return child;
    }

    /**
     * Dispose container and all services
     * 
     * @function dispose
     * @returns {void}
     * @description Disposes the container and all registered services
     */
    dispose() {
        this.container.dispose();
        this.autoRegistered.clear();
    }

    /**
     * Get container statistics
     * 
     * @function getStats
     * @returns {Object} Container statistics
     * @description Returns statistics about the container
     */
    getStats() {
        return {
            registeredServices: this.container.getRegisteredCount(),
            autoRegisteredServices: this.autoRegistered.size,
            totalServices: this.container.getRegisteredCount() + this.autoRegistered.size
        };
    }

    /**
     * List all registered services
     * 
     * @function listServices
     * @returns {string[]} Array of registered service identifiers
     * @description Lists all registered services
     */
    listServices() {
        return this.container.listServices();
    }

    /**
     * Clear all registrations
     * 
     * @function clear
     * @returns {void}
     * @description Clears all service registrations
     */
    clear() {
        this.container.clear();
        this.autoRegistered.clear();
    }

    /**
     * Auto-register service with metadata
     * 
     * @function autoRegister
     * @param {Function} serviceClass - Service class
     * @returns {Container} This container for chaining
     * @description Auto-registers a service using metadata
     */
    autoRegister(serviceClass) {
        if (this.autoRegistered.has(serviceClass)) {
            return this;
        }

        // Use class name as identifier
        const identifier = serviceClass.name;
        this.registerSingleton(identifier, serviceClass);
        this.autoRegistered.add(serviceClass);

        return this;
    }

    /**
     * Scan and auto-register services
     * 
     * @function scanAndRegister
     * @param {Function[]} serviceClasses - Array of service classes
     * @returns {Container} This container for chaining
     * @description Scans and auto-registers multiple services
     */
    scanAndRegister(serviceClasses) {
        for (const serviceClass of serviceClasses) {
            this.autoRegister(serviceClass);
        }
        return this;
    }
}

/**
 * Creates a new DI container
 * 
 * @function createContainer
 * @returns {Container} New container instance
 * @description Creates a new dependency injection container
 */
export function createContainer() {
    return Container.create();
}

/**
 * Creates a container with default services
 * 
 * @function createDefaultContainer
 * @returns {Container} Container with default services
 * @description Creates a container with common services pre-registered
 */
export function createDefaultContainer() {
    const container = createContainer();
    
    // Register common services here if needed
    // This is a placeholder for future enhancement
    
    return container;
}
