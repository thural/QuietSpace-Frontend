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

// Service registry
export { ServiceRegistry } from './registry';
export type { IServiceRegistry } from './registry';

// Service container
export { ServiceContainer } from './container';
export type { IServiceContainer } from './container';
export { Container } from './container';

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

// Main container
export { Container as DIContainer } from './container';
