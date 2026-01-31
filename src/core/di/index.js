/**
 * Dependency Injection System - Main Index.
 * 
 * Enterprise-grade dependency injection system inspired by Flutter patterns.
 * Provides IoC container, service registry, decorators, and providers.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').ServiceIdentifier} ServiceIdentifier
 * @typedef {import('./types.js').ServiceFactory} ServiceFactory
 * @typedef {import('./types.js').ServiceDescriptor} ServiceDescriptor
 * @typedef {import('./types.js').ServiceLifetime} ServiceLifetime
 * @typedef {import('./types.js').ServiceOptions} ServiceOptions
 * @typedef {import('./types.js').ServiceProvider} ServiceProvider
 * @typedef {import('./types.js').DIContext} DIContext
 * @typedef {import('./types.js').Constructor} Constructor
 * @typedef {import('./types.js').InjectionToken} InjectionToken
 * @typedef {import('./registry/ServiceRegistry.js').ServiceRegistry} ServiceRegistry
 * @typedef {import('./container/ServiceContainer.js').ServiceContainer} ServiceContainer
 * @typedef {import('./container/Container.js').Container} Container
 */

// Core types and interfaces
export {
    ServiceIdentifier,
    ServiceFactory,
    ServiceDescriptor,
    ServiceLifetime,
    ServiceOptions,
    ServiceProvider,
    DIContext,
    Constructor,
    InjectionToken
} from './types.js';

// Service registry - Implementation moved to legacy exports
export { ServiceRegistry } from './registry/ServiceRegistry.js';

// Service container - Implementation moved to legacy exports
export { ServiceContainer } from './container/ServiceContainer.js';

// Factory functions - Clean API for service creation
export {
    createContainer,
    createAutoContainer,
    createContainerWithServices,
    createScopedContainer,
    createChildContainer,
    createDevelopmentContainer,
    createProductionContainer,
    createTestContainer,
    validateContainer,
    getContainerStats
} from './factory.js';

// Platform-specific factory functions - Manual Registration + Factory Functions
export {
    createPlatformContainer,
    createDevelopmentContainer as createPlatformDevelopmentContainer,
    createProductionContainer as createPlatformProductionContainer,
    createTestContainer as createPlatformTestContainer,
    getContainerStats as getPlatformContainerStats
} from './factories/PlatformContainerFactory.js';

// Legacy exports for backward compatibility (with underscore prefix)
export {
    ServiceContainer as _ServiceContainer,
    Container as _Container
} from './container/Container.js';

export { ServiceRegistry as _ServiceRegistry } from './registry/ServiceRegistry.js';
