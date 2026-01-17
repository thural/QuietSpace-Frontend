/**
 * Dependency Injection Container.
 * 
 * Master registry for all application services and repositories.
 * Uses Inversify for IoC container management.
 */

import { Container } from 'inversify';
import { TYPES } from './types';

/**
 * Main DI Container
 * 
 * Singleton container that manages all application dependencies.
 * Provides both real and mock implementations based on configuration.
 */
export const container = new Container();

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
  const mockContainer = new Container();
  
  // Mock bindings will be added here
  // This allows us to run the entire UI without backend
  
  return mockContainer;
};
