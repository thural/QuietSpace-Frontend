/**
 * Dependency Injection Container.
 * 
 * Master registry for all application services and repositories.
 * Uses custom DI container for IoC management.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./container/Container.js').Container} ContainerType
 */

import { Container } from './container/Container.js';

/**
 * Main DI Container
 * 
 * Singleton container that manages all application dependencies.
 * Provides both real and mock implementations based on configuration.
 * 
 * @type {ContainerType}
 */
export const container = Container.create();

/**
 * Initialize container with default bindings
 * 
 * @function initializeContainer
 * @returns {void}
 * @description Initializes the DI container with default service bindings
 */
export const initializeContainer = () => {
  // Core services will be bound here
  // This will be expanded as we add more services

  console.log('DI Container initialized');
};

/**
 * Get container instance
 * 
 * @function getContainer
 * @returns {ContainerType} The main DI container instance
 * @description Returns the singleton DI container instance
 */
export const getContainer = () => container;

/**
 * Create container with mock bindings for testing
 * 
 * @function createMockContainer
 * @returns {ContainerType} Mock container for testing
 * @description Creates a new container with mock service bindings for testing
 */
export const createMockContainer = () => {
  const mockContainer = Container.create();

  // Mock bindings will be added here
  // This allows us to run the entire UI without backend

  return mockContainer;
};
