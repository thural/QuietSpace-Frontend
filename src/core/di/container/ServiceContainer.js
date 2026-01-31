/**
 * Service Container Implementation.
 * 
 * Main IoC container for dependency injection.
 * Provides service registration, resolution, and lifecycle management.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('../registry/ServiceRegistry.js').ServiceRegistry} ServiceRegistry
 */

import { ServiceRegistry } from '../registry/ServiceRegistry.js';

/**
 * Service lifetime options
 * 
 * @readonly
 * @enum {string}
 */
export const ServiceLifetime = Object.freeze({
    TRANSIENT: 'transient',   // New instance every time
    SINGLETON: 'singleton',   // Single instance for container
    SCOPED: 'scoped'        // Single instance per scope
});

/**
 * Service identifier for type-safe dependency resolution
 * 
 * @typedef {string|symbol|Function} ServiceIdentifier
 * @template T
 */

/**
 * Service factory function type
 * 
 * @typedef {Function} ServiceFactory
 * @template T
 * @param {ServiceContainer} container - Service container instance
 * @returns {T} Service instance
 */

/**
 * Service descriptor for registration
 * 
 * @typedef {Object} ServiceDescriptor
 * @property {ServiceIdentifier} identifier - Service identifier
 * @property {ServiceFactory} factory - Service factory function
 * @property {ServiceLifetime} lifetime - Service lifetime
 * @property {ServiceIdentifier[]} [dependencies] - Service dependencies
 */

/**
 * Service container interface
 * 
 * @interface IServiceContainer
 * @description Defines contract for service containers
 */
export class IServiceContainer {
    /**
     * Register a service with factory
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {ServiceFactory} factory - Service factory function
     * @param {Object} [options] - Registration options
     * @returns {void}
     */
    register(identifier, factory, options) {
        throw new Error('Method register() must be implemented by subclass');
    }

    /**
     * Register a service instance
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {any} instance - Service instance
     * @returns {void}
     */
    registerInstance(identifier, instance) {
        throw new Error('Method registerInstance() must be implemented by subclass');
    }

    /**
     * Get a service instance
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Service instance
     */
    get(identifier) {
        throw new Error('Method get() must be implemented by subclass');
    }

    /**
     * Try to get a service instance
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any|null} Service instance or null
     */
    tryGet(identifier) {
        throw new Error('Method tryGet() must be implemented by subclass');
    }

    /**
     * Check if service is registered
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {boolean} Whether service is registered
     */
    has(identifier) {
        throw new Error('Method has() must be implemented by subclass');
    }

    /**
     * Resolve a service from constructor
     * 
     * @param {Function} constructor - Service constructor
     * @returns {any} Service instance
     */
    resolve(constructor) {
        throw new Error('Method resolve() must be implemented by subclass');
    }

    /**
     * Create a scoped container
     * 
     * @returns {IServiceContainer} Scoped container
     */
    createScope() {
        throw new Error('Method createScope() must be implemented by subclass');
    }

    /**
     * Dispose container and cleanup resources
     * 
     * @returns {void}
     */
    dispose() {
        throw new Error('Method dispose() must be implemented by subclass');
    }
}

/**
 * Service container implementation
 * 
 * @class ServiceContainer
 * @implements {IServiceContainer}
 * @description Main IoC container for dependency injection
 */
export class ServiceContainer {
    /**
     * Service registry instance
     * 
     * @type {ServiceRegistry}
     * @private
     */
    registry;

    /**
     * Map of singleton instances
     * 
     * @type {Map<any, any>}
     * @private
     */
    instances;

    /**
     * Set of child scopes
     * 
     * @type {Set<ServiceContainer>}
     * @private
     */
    scopes;

    /**
     * Parent container reference
     * 
     * @type {ServiceContainer}
     * @private
     */
    parent;

    /**
     * Creates a new service container instance
     * 
     * @constructor
     * @param {ServiceContainer} [parent] - Parent container for scoping
     * @description Initializes a new service container with optional parent
     */
    constructor(parent) {
        this.registry = new ServiceRegistry();
        this.instances = new Map();
        this.scopes = new Set();
        this.parent = parent;
    }

    /**
     * Register a service with factory
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {ServiceFactory} factory - Service factory function
     * @param {Object} [options={}] - Registration options
     * @param {ServiceLifetime} [options.lifetime=ServiceLifetime.TRANSIENT] - Service lifetime
     * @param {ServiceIdentifier[]} [options.dependencies] - Service dependencies
     * @returns {void}
     * @description Registers a service with the container
     */
    register(identifier, factory, options = {}) {
        this.registry.register({
            identifier,
            factory,
            lifetime: options.lifetime || ServiceLifetime.TRANSIENT,
            dependencies: options.dependencies
        });
    }

    /**
     * Register a service instance
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @param {any} instance - Service instance
     * @returns {void}
     * @description Registers a pre-created service instance
     */
    registerInstance(identifier, instance) {
        this.instances.set(identifier, instance);
    }

    /**
     * Get a service instance
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Service instance
     * @throws {Error} If service is not registered
     * @description Resolves a service instance from the container
     */
    get(identifier) {
        // Check for existing instance
        if (this.instances.has(identifier)) {
            return this.instances.get(identifier);
        }

        // Get service descriptor
        const descriptor = this.registry.get(identifier);
        if (!descriptor) {
            throw new Error(`Service ${String(identifier)} not registered`);
        }

        // Create instance based on lifetime
        const instance = this.createInstance(descriptor, identifier);
        
        // Store singleton instances
        if (descriptor.lifetime === ServiceLifetime.SINGLETON) {
            this.instances.set(identifier, instance);
        }

        return instance;
    }

    /**
     * Try to get a service instance
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any|null} Service instance or null
     * @description Safely resolves a service instance, returns null if not found
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
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {boolean} Whether service is registered
     * @description Checks if a service is registered in the container
     */
    has(identifier) {
        return this.registry.has(identifier) || this.instances.has(identifier);
    }

    /**
     * Resolve a service from constructor
     * 
     * @param {Function} constructor - Service constructor
     * @returns {any} Service instance
     * @description Resolves a service using its constructor as identifier
     */
    resolve(constructor) {
        return this.get(constructor);
    }

    /**
     * Create a scoped container
     * 
     * @returns {ServiceContainer} Scoped container
     * @description Creates a child container with this as parent
     */
    createScope() {
        const scope = new ServiceContainer(this);
        this.scopes.add(scope);
        return scope;
    }

    /**
     * Create service instance with dependency injection
     * 
     * @private
     * @param {ServiceDescriptor} descriptor - Service descriptor
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {any} Service instance
     * @description Creates a service instance using its factory function
     */
    createInstance(descriptor, identifier) {
        // Create instance with dependencies
        return descriptor.factory(this);
    }

    /**
     * Validate all registered services
     * 
     * @returns {string[]} Array of validation errors
     * @description Validates all registered services for missing dependencies
     */
    validate() {
        const errors = [];
        
        for (const descriptor of this.registry.getAll()) {
            const validationErrors = this.registry.validateDependencies(descriptor.identifier);
            errors.push(...validationErrors);
        }

        return errors;
    }

    /**
     * Get dependency tree for debugging
     * 
     * @returns {Record<string, any>} Dependency tree object
     * @description Returns a tree representation of all services and their dependencies
     */
    getDependencyTree() {
        const tree = {};
        
        for (const descriptor of this.registry.getAll()) {
            const key = String(descriptor.identifier);
            tree[key] = {
                lifetime: descriptor.lifetime,
                dependencies: descriptor.dependencies?.map(dep => String(dep)) || [],
                hasInstance: this.instances.has(descriptor.identifier)
            };
        }

        return tree;
    }

    /**
     * Dispose container and cleanup resources
     * 
     * @returns {void}
     * @description Disposes all resources and cleans up the container
     */
    dispose() {
        // Dispose all scopes
        const scopesArray = Array.from(this.scopes);
        for (const scope of scopesArray) {
            scope.dispose();
        }
        this.scopes.clear();

        // Clear instances
        this.instances.clear();

        // Clear registry
        this.registry.clear();
    }

    /**
     * Get container statistics
     * 
     * @returns {Object} Container statistics
     * @property {number} registeredServices - Number of registered services
     * @property {number} singletonInstances - Number of singleton instances
     * @property {number} activeScopes - Number of active scopes
     * @property {Object} dependencyGraph - Dependency graph information
     * @description Returns statistics about the container state
     */
    getStats() {
        return {
            registeredServices: this.registry.getAll().length,
            singletonInstances: this.instances.size,
            activeScopes: this.scopes.size,
            dependencyGraph: this.registry.getDependencyGraph()
        };
    }
}
