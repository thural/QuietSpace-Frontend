/**
 * Dependency Injection Types.
 *
 * Core types for the dependency injection system.
 * Provides type safety for service registration and injection.
 */

/**
 * Service identifier for type-safe dependency resolution
 */
export type ServiceIdentifier<T = unknown> = string | symbol | (new (...args: unknown[]) => T);

/**
 * Service lifetime options
 */
export enum ServiceLifetime {
  TRANSIENT = 'transient',   // New instance every time
  SINGLETON = 'singleton',   // Single instance for container
  SCOPED = 'scoped'        // Single instance per scope
}

/**
 * Service descriptor for registration
 */
export interface ServiceDescriptor {
  identifier: ServiceIdentifier;
  factory: ServiceFactory;
  lifetime: ServiceLifetime;
  dependencies?: ServiceIdentifier[];
}

/**
 * Service factory function type
 */
export type ServiceFactory<T = unknown> = (container: ServiceContainer) => T;

/**
 * Constructor type for dependency injection
 */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

/**
 * Service configuration options
 */
export interface ServiceOptions {
  lifetime?: ServiceLifetime;
  dependencies?: ServiceIdentifier[];
  factory?: ServiceFactory;
}

/**
 * Injection token for type-safe service identification
 */
export class InjectionToken {
  /**
   * Creates an injection token with description
   * @param description - The token description
   */
  public constructor(public readonly description: string) { }
}

/**
 * Service container interface
 */
export interface ServiceContainer {
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    options?: ServiceOptions
  ): void;
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void;
  get<T>(identifier: ServiceIdentifier<T>): T;
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null;
  has<T>(identifier: ServiceIdentifier<T>): boolean;
  resolve<T>(constructor: Constructor<T>): T;
  createScope(): ServiceContainer;
  dispose(): void;
}

/**
 * Service registry interface
 */
export interface ServiceRegistry {
  register(descriptor: ServiceDescriptor): void;
  unregister(identifier: ServiceIdentifier): void;
  get<T>(identifier: ServiceIdentifier<T>): ServiceDescriptor | null;
  has(identifier: ServiceIdentifier): boolean;
  getAll(): ServiceDescriptor[];
  clear(): void;
}

/**
 * Service provider interface
 */
export interface ServiceProvider {
  get<T>(identifier: ServiceIdentifier<T>): T;
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null;
  has(identifier: ServiceIdentifier): boolean;
}

/**
 * Dependency injection context
 */
export interface DIContext {
  container: ServiceContainer;
  provider: ServiceProvider;
  scope?: ServiceContainer;
}
