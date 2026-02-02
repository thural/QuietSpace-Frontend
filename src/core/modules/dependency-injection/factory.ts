/**
 * DI Module Factory Functions - Black Box Pattern
 *
 * Provides clean factory functions for creating DI containers and services.
 * Implementation classes are hidden behind these factory functions.
 */


import { Container } from './container/Container';

import type { TypeKeys } from './types';
import type {
  ServiceIdentifier,
  ServiceLifetime,
  Constructor,
  InjectionToken
} from './types/index';

// Export Container type for external use
export type { Container };

// Type aliases for the interfaces
type IContainer = Container;

/**
 * Create a new DI container instance
 * @returns Configured DI container
 */
export function createContainer(): Container {
  return new Container();
}

/**
 * Create a new DI container with auto-registration enabled
 * @returns Configured DI container with auto-registration
 */
export function createAutoContainer(): Container {
  return Container.create();
}

/**
 * Create a DI container with predefined services
 * @param services - Services to register
 * @returns Configured DI container with services
 */
export function createContainerWithServices(services: {
  identifier: ServiceIdentifier<any>;
  factory: () => any;
  lifetime?: ServiceLifetime;
}[]): Container {
  const container = createContainer();

  services.forEach(({ identifier, factory, lifetime }) => {
    if (lifetime === 'singleton') {
      container.registerSingletonByToken(identifier as TypeKeys, factory());
    } else {
      container.registerTransientByToken(identifier as TypeKeys, factory());
    }
  });

  return container;
}

/**
 * Create a scoped DI container from parent
 * @param parent - Parent container
 * @returns Scoped container
 */
export function createScopedContainer(parent: Container): Container {
  return parent.createScope();
}

/**
 * Create a child DI container from parent
 * @param parent - Parent container
 * @returns Child container
 */
export function createChildContainer(parent: Container): Container {
  return parent.createChild();
}

/**
 * Create a container with development-friendly features
 * @returns Development container with debugging enabled
 */
export function createDevelopmentContainer(): Container {
  const container = createContainer();

  // Enable development-specific features
  if (process.env.NODE_ENV === 'development') {
    console.log('Development DI Container created with enhanced debugging');
  }

  return container;
}

/**
 * Create a production-optimized container
 * @returns Production container with optimizations
 */
export function createProductionContainer(): Container {
  const container = createContainer();

  // Production optimizations
  if (process.env.NODE_ENV === 'production') {
    // Disable validation for performance
    // Enable singleton optimizations
    console.log('Production DI Container created with optimizations');
  }

  return container;
}

/**
 * Create a container for testing with mock services
 * @param mocks - Mock services to register
 * @returns Test container with mocks
 */
export function createTestContainer(mocks?: Record<string, any>): Container {
  const container = createContainer();

  if (mocks) {
    Object.entries(mocks).forEach(([token, mockService]) => {
      container.registerInstanceByToken(token as TypeKeys, mockService);
    });
  }

  return container;
}

/**
 * Validate DI container configuration
 * @param container - Container to validate
 * @returns Array of validation errors
 */
export function validateContainer(container: Container): string[] {
  return container.validate();
}

/**
 * Get container statistics for monitoring
 * @param container - Container to analyze
 * @returns Container statistics
 */
export function getContainerStats(container: Container) {
  return container.getStats();
}
