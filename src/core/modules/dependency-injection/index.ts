/**
 * Dependency Injection System - Main Index.
 *
 * Enterprise-grade dependency injection system inspired by Flutter patterns.
 * Provides IoC container, service registry, decorators, and providers.
 * 
 * Note: React hooks (DIProvider, useDIContainer, etc.) are now exported from
 * @/core/hooks/ui/dependency-injection for better organization
 */

// Core types and interfaces
export type {
  ServiceIdentifier,
  ServiceFactory,
  ServiceDescriptor,
  ServiceLifetime,
  ServiceOptions,
  ServiceProvider,
  DIContext,
  Constructor,
  InjectionToken
} from './types/index';

// Service registry
export type { ServiceRegistry } from './registry';

// Service container
export type { ServiceContainer } from './types/index';

// Decorators
export {
  Injectable,
  Inject,
  getInjectableMetadata,
  getInjectionMetadata,
  getConstructorDependencies,
  isInjectable
} from './decorators';

// Factory functions
export {
  createContainer,
  createAutoContainer,
  createContainerWithServices,
  createScopedContainer,
  createChildContainer,
  createDevelopmentContainer,
  createProductionContainer,
  createTestContainer
} from './factory';

// Core classes
export {
  Container,
  ServiceContainer,
  ServiceRegistry
} from './container';
