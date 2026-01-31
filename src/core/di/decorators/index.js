/**
 * Dependency Injection System - Decorators Index.
 * 
 * Exports decorator utilities for dependency injection.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./Injectable.js').InjectableOptions} InjectableOptions
 */

// Export decorator functions and utilities
export { 
  Injectable, 
  Inject, 
  getInjectableMetadata, 
  getInjectionMetadata, 
  getConstructorDependencies, 
  isInjectable 
} from './Injectable.js';
