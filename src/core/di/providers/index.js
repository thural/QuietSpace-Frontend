/**
 * Dependency Injection System - Providers Index.
 * 
 * Exports React provider components and hooks for dependency injection.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./ReactProvider.js').ServiceProvider} ServiceProvider
 * @typedef {import('./ReactProvider.js').DIContext} DIContext
 */

// Export React provider and hooks
export { 
  DIProvider, 
  useDIContainer, 
  useDIContext, 
  useService, 
  useTryService, 
  useHasService, 
  useDIScope 
} from './ReactProvider.js';
