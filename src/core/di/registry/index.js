/**
 * Dependency Injection System - Registry Index.
 * 
 * Exports registry-related classes and types for the DI system.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./ServiceRegistry.js').ServiceRegistry} ServiceRegistryType
 * @typedef {import('./ServiceRegistry.js').ServiceDescriptor} ServiceDescriptor
 * @typedef {import('./ServiceRegistry.js').IServiceRegistry} IServiceRegistry
 */

// Export ServiceRegistry class
export { ServiceRegistry } from './ServiceRegistry.js';
