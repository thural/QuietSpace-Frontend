/**
 * Dependency Injection System - Container Index.
 * 
 * Exports container-related classes and types for the DI system.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./ServiceContainer.js').ServiceContainer} ServiceContainer
 * @typedef {import('./ServiceContainer.js').ServiceIdentifier} ServiceIdentifier
 * @typedef {import('./ServiceContainer.js').ServiceFactory} ServiceFactory
 * @typedef {import('./ServiceContainer.js').ServiceDescriptor} ServiceDescriptor
 * @typedef {import('./ServiceContainer.js').IServiceContainer} IServiceContainer
 * @typedef {import('./Container.js').Container} Container
 */

// Export ServiceContainer class
export { ServiceContainer } from './ServiceContainer.js';

// Export Container class
export { Container } from './Container.js';
