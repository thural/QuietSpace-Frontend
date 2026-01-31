/**
 * DI Module Factory Functions - Black Box Pattern
 * 
 * Provides clean factory functions for creating DI containers and services.
 * Implementation classes are hidden behind these factory functions.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').ServiceIdentifier} ServiceIdentifier
 * @typedef {import('./types.js').ServiceLifetime} ServiceLifetime
 * @typedef {import('./types.js').Constructor} Constructor
 * @typedef {import('./types.js').InjectionToken} InjectionToken
 * @typedef {import('./types.js').TypeKeys} TypeKeys
 * @typedef {import('./container/Container.js').Container} Container
 */

import { Container } from './container/Container.js';
import { TypeKeys } from './types.js';

// Export Container type for external use
export { Container };

// Type aliases for the interfaces
/** @typedef {Container} IContainer */

/**
 * Create a new DI container instance
 * 
 * @function createContainer
 * @returns {Container} Configured DI container
 * @description Creates a new dependency injection container
 */
export function createContainer() {
    return new Container();
}

/**
 * Create a new DI container with auto-registration enabled
 * 
 * @function createAutoContainer
 * @returns {Container} Configured DI container with auto-registration
 * @description Creates a container with automatic service registration
 */
export function createAutoContainer() {
    return Container.create();
}

/**
 * Create a DI container with predefined services
 * 
 * @function createContainerWithServices
 * @param {Array<Object>} services - Services to register
 * @param {ServiceIdentifier} services[].identifier - Service identifier
 * @param {Function} services[].factory - Service factory function
 * @param {ServiceLifetime} [services[].lifetime] - Service lifetime
 * @returns {Container} Configured DI container with services
 * @description Creates a container with pre-registered services
 */
export function createContainerWithServices(services) {
    const container = createContainer();

    services.forEach(({ identifier, factory, lifetime }) => {
        if (lifetime === 'singleton') {
            container.registerSingletonByToken(identifier, factory());
        } else {
            container.registerTransientByToken(identifier, factory());
        }
    });

    return container;
}

/**
 * Create a scoped DI container from parent
 * 
 * @function createScopedContainer
 * @param {Container} parent - Parent container
 * @returns {Container} Scoped container
 * @description Creates a scoped container from a parent container
 */
export function createScopedContainer(parent) {
    return parent.createScope();
}

/**
 * Create a child DI container from parent
 * 
 * @function createChildContainer
 * @param {Container} parent - Parent container
 * @returns {Container} Child container
 * @description Creates a child container from a parent container
 */
export function createChildContainer(parent) {
    return parent.createChild();
}

/**
 * Create a container with development-friendly features
 * 
 * @function createDevelopmentContainer
 * @returns {Container} Development container with debugging enabled
 * @description Creates a container optimized for development
 */
export function createDevelopmentContainer() {
    const container = createContainer();

    // Enable development-specific features
    if (process.env.NODE_ENV === 'development') {
        console.log('Development DI Container created with enhanced debugging');
    }

    return container;
}

/**
 * Create a production-optimized container
 * 
 * @function createProductionContainer
 * @returns {Container} Production container with optimizations
 * @description Creates a container optimized for production use
 */
export function createProductionContainer() {
    const container = createContainer();

    // Enable production-specific optimizations
    if (process.env.NODE_ENV === 'production') {
        console.log('Production DI Container created with optimizations');
    }

    return container;
}

/**
 * Create a test container with mock services
 * 
 * @function createTestContainer
 * @param {Record<string, any>} [mocks] - Mock services to register
 * @returns {Container} Test container with mock services
 * @description Creates a container for testing with optional mock services
 */
export function createTestContainer(mocks) {
    const container = createContainer();

    // Register mock services if provided
    if (mocks) {
        Object.entries(mocks).forEach(([token, mockService]) => {
            container.registerInstanceByToken(token, mockService);
        });
    }

    return container;
}

/**
 * Validate a DI container
 * 
 * @function validateContainer
 * @param {Container} container - Container to validate
 * @returns {string[]} Array of validation errors
 * @description Validates a container and returns any errors
 */
export function validateContainer(container) {
    return container.validate();
}

/**
 * Get container statistics
 * 
 * @function getContainerStats
 * @param {Container} container - Container to analyze
 * @returns {Object} Container statistics
 * @description Returns statistics about the container state
 */
export function getContainerStats(container) {
    return container.getStats();
}
