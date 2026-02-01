/**
 * Dependency Injection Container.
 * 
 * Master registry for all application services and repositories.
 * Uses custom DI container for IoC management.
 */

import { Container } from './container';

/**
 * Main DI Container
 * 
 * Singleton container that manages all application dependencies.
 * Provides both real and mock implementations based on configuration.
 */
export const container = Container.create();

/**
 * Initialize container with default bindings
 */
export const initializeContainer = () => {
  // Core services will be bound here
  // This will be expanded as we add more services

  console.log('DI Container initialized');
};

/**
 * Get container instance
 */
export const getContainer = () => container;

/**
 * Create container with mock bindings for testing
 */
export const createMockContainer = () => {
  const mockContainer = Container.create();

  // Mock bindings will be added here
  // This allows us to run the entire UI without backend

  return mockContainer;
};
