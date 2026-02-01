/**
 * Dependency Injection System - Main Index.
 *
 * Enterprise-grade dependency injection system inspired by Flutter patterns.
 * Provides IoC container, service registry, decorators, and providers.
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

// Service registry - Implementation moved to legacy exports
export type { ServiceRegistry } from './registry';

// Service container - Implementation moved to legacy exports
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

// React providers
export {
  DIProvider,
  useDIContainer,
  useDIContext,
  useService,
  useTryService,
  useHasService,
  useDIScope
} from './providers';

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
} from './factory';

// Platform-specific factory functions - Manual Registration + Factory Functions
export {
  createPlatformContainer,
  createDevelopmentContainer as createPlatformDevelopmentContainer,
  createProductionContainer as createPlatformProductionContainer,
  createTestContainer as createPlatformTestContainer,
  getContainerStats as getPlatformContainerStats
} from './factories/PlatformContainerFactory';

// Legacy exports for backward compatibility (with underscore prefix)
export {
  ServiceContainer as _ServiceContainer,
  Container as _Container
} from './container';

// Main exports for new code
export { Container } from './container';
export { ServiceRegistry as _ServiceRegistry } from './registry';
