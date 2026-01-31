/**
 * Service Registry Implementation.
 * 
 * Central registry for managing service descriptors.
 * Provides service registration, lookup, and lifecycle management.
 */

/**
 * Service identifier for type-safe dependency resolution
 * 
 * @typedef {string|symbol|Function} ServiceIdentifier
 * @template T
 */

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
 * Service factory function type
 * 
 * @typedef {Function} ServiceFactory
 * @template T
 * @param {any} container - Service container instance
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
 * Service registry interface
 * 
 * @interface IServiceRegistry
 * @description Defines contract for service registries
 */
export class IServiceRegistry {
    /**
     * Register a service descriptor
     * 
     * @param {ServiceDescriptor} descriptor - Service descriptor
     * @returns {void}
     */
    register(descriptor) {
        throw new Error('Method register() must be implemented by subclass');
    }

    /**
     * Unregister a service by identifier
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {void}
     */
    unregister(identifier) {
        throw new Error('Method unregister() must be implemented by subclass');
    }

    /**
     * Get service descriptor by identifier
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {ServiceDescriptor|null} Service descriptor or null
     */
    get(identifier) {
        throw new Error('Method get() must be implemented by subclass');
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
     * Get all registered service descriptors
     * 
     * @returns {ServiceDescriptor[]} Array of service descriptors
     */
    getAll() {
        throw new Error('Method getAll() must be implemented by subclass');
    }

    /**
     * Clear all registered services
     * 
     * @returns {void}
     */
    clear() {
        throw new Error('Method clear() must be implemented by subclass');
    }
}

/**
 * Service registry implementation
 * 
 * @class ServiceRegistry
 * @implements {IServiceRegistry}
 * @description Central registry for managing service descriptors
 */
export class ServiceRegistry {
    /**
     * Map of service descriptors
     * 
     * @type {Map<any, ServiceDescriptor>}
     * @private
     */
    descriptors;

    /**
     * Creates a new service registry instance
     * 
     * @constructor
     * @description Initializes a new service registry
     */
    constructor() {
        this.descriptors = new Map();
    }

    /**
     * Register a service descriptor
     * 
     * @param {ServiceDescriptor} descriptor - Service descriptor
     * @returns {void}
     * @description Registers a service descriptor in the registry
     */
    register(descriptor) {
        this.descriptors.set(descriptor.identifier, descriptor);
    }

    /**
     * Unregister a service by identifier
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {void}
     * @description Removes a service descriptor from the registry
     */
    unregister(identifier) {
        this.descriptors.delete(identifier);
    }

    /**
     * Get service descriptor by identifier
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {ServiceDescriptor|null} Service descriptor or null
     * @description Retrieves a service descriptor by its identifier
     */
    get(identifier) {
        return this.descriptors.get(identifier) || null;
    }

    /**
     * Check if service is registered
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {boolean} Whether service is registered
     * @description Checks if a service is registered in the registry
     */
    has(identifier) {
        return this.descriptors.has(identifier);
    }

    /**
     * Get all registered service descriptors
     * 
     * @returns {ServiceDescriptor[]} Array of service descriptors
     * @description Returns all registered service descriptors
     */
    getAll() {
        return Array.from(this.descriptors.values());
    }

    /**
     * Clear all registered services
     * 
     * @returns {void}
     * @description Removes all service descriptors from the registry
     */
    clear() {
        this.descriptors.clear();
    }

    /**
     * Get service descriptors by lifetime
     * 
     * @param {string} lifetime - Service lifetime
     * @returns {ServiceDescriptor[]} Array of service descriptors with specified lifetime
     * @description Returns all services with the specified lifetime
     */
    getByLifetime(lifetime) {
        return this.getAll().filter(descriptor => descriptor.lifetime === lifetime);
    }

    /**
     * Get service descriptors with dependencies
     * 
     * @returns {ServiceDescriptor[]} Array of service descriptors with dependencies
     * @description Returns all services that have dependencies
     */
    getWithDependencies() {
        return this.getAll().filter(descriptor => 
            descriptor.dependencies && descriptor.dependencies.length > 0
        );
    }

    /**
     * Validate service dependencies
     * 
     * @param {ServiceIdentifier} identifier - Service identifier
     * @returns {string[]} Array of validation errors
     * @description Validates that all dependencies of a service are registered
     */
    validateDependencies(identifier) {
        const descriptor = this.get(identifier);
        if (!descriptor) {
            return [`Service ${String(identifier)} not found`];
        }

        const errors = [];
        if (descriptor.dependencies) {
            for (const dependency of descriptor.dependencies) {
                if (!this.has(dependency)) {
                    errors.push(`Dependency ${String(dependency)} not found for service ${String(identifier)}`);
                }
            }
        }

        return errors;
    }

    /**
     * Get dependency graph for debugging
     * 
     * @returns {Record<string, string[]>} Dependency graph object
     * @description Returns a graph representation of service dependencies
     */
    getDependencyGraph() {
        const graph = {};
        
        for (const descriptor of this.getAll()) {
            const key = String(descriptor.identifier);
            graph[key] = (descriptor.dependencies || []).map(dep => String(dep));
        }

        return graph;
    }
}
