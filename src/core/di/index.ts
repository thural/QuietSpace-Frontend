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
export type { IServiceRegistry } from './registry';

// Service container - Implementation moved to legacy exports
export type { IServiceContainer } from './container';

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

// Main container - Implementation moved to legacy exports
// Note: Use DIContainer alias for clean API

// Legacy exports for backward compatibility (with underscore prefix)
export {
  ServiceContainer as _ServiceContainer,
  Container as _Container
} from './container';

export { ServiceRegistry as _ServiceRegistry } from './registry';
