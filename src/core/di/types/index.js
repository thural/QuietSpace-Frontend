/**
 * Dependency Injection Types.
 * 
 * Core types for the dependency injection system.
 * Provides type safety for service registration and injection.
 */

/**
 * Service identifier for type-safe dependency resolution
 * @typedef {string|symbol|Function} ServiceIdentifier
 * @template T
 */

/**
 * Service lifetime options
 */
export const ServiceLifetime = Object.freeze({
    TRANSIENT: 'transient',   // New instance every time
    SINGLETON: 'singleton',   // Single instance for container
    SCOPED: 'scoped'        // Single instance per scope
});

/**
 * Service descriptor for registration
 */
export class ServiceDescriptor {
    /** @type {ServiceIdentifier} */
    identifier;
    /** @type {Function} */
    factory;
    /** @type {string} */
    lifetime;
    /** @type {ServiceIdentifier[]|undefined} */
    dependencies;

    /**
     * @param {Object} data 
     */
    constructor(data) {
        this.identifier = data.identifier;
        this.factory = data.factory;
        this.lifetime = data.lifetime;
        this.dependencies = data.dependencies;
    }
}

/**
 * Service factory function type
 * @typedef {Function} ServiceFactory
 * @template T
 * @param {ServiceContainer} container
 * @returns {T}
 */

/**
 * Constructor type for dependency injection
 * @typedef {Function} Constructor
 * @template T
 */

/**
 * Service configuration options
 */
export class ServiceOptions {
    /** @type {string|undefined} */
    lifetime;
    /** @type {ServiceIdentifier[]|undefined} */
    dependencies;
    /** @type {Function|undefined} */
    factory;

    /**
     * @param {Object} options 
     */
    constructor(options = {}) {
        this.lifetime = options.lifetime;
        this.dependencies = options.dependencies;
        this.factory = options.factory;
    }
}

/**
 * Injection token for type-safe service identification
 */
export class InjectionToken {
    /** @type {string} */
    description;

    /**
     * @param {string} description 
     */
    constructor(description) {
        this.description = description;
    }
}

/**
 * Service container interface
 */
export class ServiceContainer {
    /**
     * @param {ServiceIdentifier} identifier 
     * @param {Function} factory 
     * @param {ServiceOptions} [options] 
     * @returns {void}
     */
    register(identifier, factory, options) {
        throw new Error('Method register() must be implemented');
    }

    /**
     * @param {ServiceIdentifier} identifier 
     * @param {*} instance 
     * @returns {void}
     */
    registerInstance(identifier, instance) {
        throw new Error('Method registerInstance() must be implemented');
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {T}
     */
    get(identifier) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {T|null}
     */
    tryGet(identifier) {
        throw new Error('Method tryGet() must be implemented');
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {boolean}
     */
    has(identifier) {
        throw new Error('Method has() must be implemented');
    }

    /**
     * @template T
     * @param {Constructor} constructor 
     * @returns {T}
     */
    resolve(constructor) {
        throw new Error('Method resolve() must be implemented');
    }

    /**
     * @returns {ServiceContainer}
     */
    createScope() {
        throw new Error('Method createScope() must be implemented');
    }

    /**
     * @returns {void}
     */
    dispose() {
        throw new Error('Method dispose() must be implemented');
    }
}

/**
 * Service registry interface
 */
export class ServiceRegistry {
    /**
     * @param {ServiceDescriptor} descriptor 
     * @returns {void}
     */
    register(descriptor) {
        throw new Error('Method register() must be implemented');
    }

    /**
     * @param {ServiceIdentifier} identifier 
     * @returns {void}
     */
    unregister(identifier) {
        throw new Error('Method unregister() must be implemented');
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {ServiceDescriptor|null}
     */
    get(identifier) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * @param {ServiceIdentifier} identifier 
     * @returns {boolean}
     */
    has(identifier) {
        throw new Error('Method has() must be implemented');
    }

    /**
     * @returns {ServiceDescriptor[]}
     */
    getAll() {
        throw new Error('Method getAll() must be implemented');
    }
}

/**
 * Service resolver interface
 */
export class ServiceResolver {
    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {T}
     */
    resolve(identifier) {
        throw new Error('Method resolve() must be implemented');
    }

    /**
     * @template T
     * @param {Constructor} constructor 
     * @returns {T}
     */
    resolveConstructor(constructor) {
        throw new Error('Method resolveConstructor() must be implemented');
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {T|null}
     */
    tryResolve(identifier) {
        throw new Error('Method tryResolve() must be implemented');
    }
}

/**
 * Dependency injection configuration
 */
export class DIConfiguration {
    /** @type {boolean|undefined} */
    enableAutoRegistration;
    /** @type {boolean|undefined} */
    enableCircularDependencyDetection;
    /** @type {boolean|undefined} */
    enableLazyLoading;
    /** @type {number|undefined} */
    maxDepth;

    /**
     * @param {Object} config 
     */
    constructor(config = {}) {
        this.enableAutoRegistration = config.enableAutoRegistration !== false;
        this.enableCircularDependencyDetection = config.enableCircularDependencyDetection !== false;
        this.enableLazyLoading = config.enableLazyLoading !== false;
        this.maxDepth = config.maxDepth || 100;
    }
}

/**
 * Service metadata
 */
export class ServiceMetadata {
    /** @type {string|undefined} */
    name;
    /** @type {string|undefined} */
    version;
    /** @type {string[]|undefined} */
    tags;
    /** @type {Object|undefined} */
    dependencies;
    /** @type {Object|undefined} */
    configuration;

    /**
     * @param {Object} metadata 
     */
    constructor(metadata = {}) {
        this.name = metadata.name;
        this.version = metadata.version;
        this.tags = metadata.tags;
        this.dependencies = metadata.dependencies;
        this.configuration = metadata.configuration;
    }
}

/**
 * Injection context for service creation
 */
export class InjectionContext {
    /** @type {ServiceContainer} */
    container;
    /** @type {Map} */
    resolved;
    /** @type {Set} */
    resolving;

    /**
     * @param {ServiceContainer} container 
     */
    constructor(container) {
        this.container = container;
        this.resolved = new Map();
        this.resolving = new Set();
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {T}
     */
    resolve(identifier) {
        throw new Error('Method resolve() must be implemented');
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @param {T} instance 
     * @returns {void}
     */
    cache(identifier, instance) {
        this.resolved.set(identifier, instance);
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {boolean}
     */
    isResolving(identifier) {
        return this.resolving.has(identifier);
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {void}
     */
    startResolving(identifier) {
        this.resolving.add(identifier);
    }

    /**
     * @template T
     * @param {ServiceIdentifier} identifier 
     * @returns {void}
     */
    stopResolving(identifier) {
        this.resolving.delete(identifier);
    }
}
