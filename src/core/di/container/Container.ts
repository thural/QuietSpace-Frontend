/**
 * Main DI Container.
 *
 * Central dependency injection container with auto-registration.
 * Provides enterprise-grade DI with reflection support.
 */

import { getConstructorDependencies, getInjectableMetadata } from '../decorators/Injectable';
import { ServiceLifetime } from '../registry/ServiceRegistry';

import { ServiceContainer } from './ServiceContainer';

import type { ServiceIdentifier } from '../registry/ServiceRegistry';
import type { TypeKeys } from '../types';

/**
 * Main DI container with automatic service registration
 */
export class Container {
  private readonly container = new ServiceContainer();
  private readonly autoRegistered = new Set<new (...args: unknown[]) => unknown>();

  /**
   * Create new container instance
   */
  static create(): Container {
    return new Container();
  }

  /**
   * Create factory function for service instantiation
   */
  private createFactory<T>(serviceClass: new (...args: unknown[]) => T) {
    // Get injectable metadata
    const metadata = getInjectableMetadata(serviceClass) as { lifetime?: ServiceLifetime };

    // Get constructor dependencies
    const dependencies = getConstructorDependencies(serviceClass) as (ServiceIdentifier | (new (...args: unknown[]) => unknown))[];

    // Create factory function
    const factory = (container: ServiceContainer) => {
      // Resolve dependencies
      const resolvedDependencies = dependencies.map((dep): unknown => {
        if (typeof dep === 'string' || typeof dep === 'symbol') {
          return container.get(dep as ServiceIdentifier);
        }
        // For constructor dependencies, resolve from container
        return container.get(dep as ServiceIdentifier);
      });

      // Create instance with dependencies
      return new serviceClass(...resolvedDependencies);
    };

    return { factory, dependencies, metadata };
  }

  /**
   * Register a service class with automatic dependency resolution
   */
  register<T>(serviceClass: new (...args: unknown[]) => T, options?: { lifetime?: ServiceLifetime }): void {
    const { factory, dependencies, metadata } = this.createFactory(serviceClass);

    // Register with container
    this.container.register(serviceClass, factory, {
      lifetime: options?.lifetime || (metadata?.lifetime) || ServiceLifetime.Transient,
      dependencies: dependencies as ServiceIdentifier[]
    });

    this.autoRegistered.add(serviceClass as new (...args: unknown[]) => unknown);
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(serviceClass: new (...args: unknown[]) => T): void {
    this.register(serviceClass, { lifetime: ServiceLifetime.Singleton });
  }

  /**
   * Register a scoped service
   */
  registerScoped<T>(serviceClass: new (...args: unknown[]) => T): void {
    this.register(serviceClass, { lifetime: ServiceLifetime.Scoped });
  }

  /**
   * Register a service instance
   */
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void {
    this.container.registerInstance(identifier, instance);
  }

  /**
   * Register a singleton service by string token with type safety
   */
  registerSingletonByToken<T>(token: TypeKeys, serviceClass: new (...args: unknown[]) => T): void {
    const { factory, dependencies, metadata } = this.createFactory(serviceClass);

    // Register with container as singleton using token
    this.container.register(token, factory, {
      lifetime: ServiceLifetime.Singleton,
      dependencies: dependencies as ServiceIdentifier[]
    });

    // Log warning if metadata suggests different lifetime than singleton
    if (metadata?.lifetime && metadata.lifetime !== ServiceLifetime.Singleton) {
      console.warn(`Service ${serviceClass.name} has metadata lifetime '${metadata.lifetime}' but is being registered as singleton via registerSingletonByToken`);
    }
  }

  /**
   * Register a transient service by string token with type safety
   */
  registerTransientByToken<T>(token: TypeKeys, serviceClass: new (...args: unknown[]) => T): void {
    const { factory, dependencies, metadata } = this.createFactory(serviceClass);

    // Register with container as transient using token
    this.container.register(token, factory, {
      lifetime: ServiceLifetime.Transient,
      dependencies: dependencies as ServiceIdentifier[]
    });

    // Log warning if metadata suggests different lifetime than transient
    if (metadata?.lifetime && metadata.lifetime !== ServiceLifetime.Transient) {
      console.warn(`Service ${serviceClass.name} has metadata lifetime '${metadata.lifetime}' but is being registered as transient via registerTransientByToken`);
    }
  }

  /**
   * Register a service instance by string token with type safety
   */
  registerInstanceByToken<T>(token: TypeKeys, instance: T): void {
    this.container.registerInstance(token, instance);
  }

  /**
   * Get a service instance
   */
  get<T>(identifier: ServiceIdentifier<T>): T {
    return this.container.get(identifier);
  }

  /**
   * Get a service by string token with type safety
   */
  getByToken<T>(token: TypeKeys): T {
    return this.container.get(token);
  }

  /**
   * Try to get a service instance
   */
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null {
    return this.container.tryGet(identifier);
  }

  /**
   * Try to get a service by string token with type safety
   */
  tryGetByToken<T>(token: TypeKeys): T | null {
    return this.container.tryGet(token);
  }

  /**
   * Check if service is registered
   */
  has<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.container.has(identifier);
  }

  /**
   * Resolve a service from constructor
   */
  resolve<T>(constructor: new (...args: any[]) => T): T {
    // Auto-register if not already registered
    if (!this.autoRegistered.has(constructor)) {
      this.register(constructor);
    }

    return this.container.get(constructor);
  }

  /**
   * Create a scoped container
   */
  createScope(): Container {
    const scopedContainer = this.container.createScope();
    const childContainer = new Container();
    // Copy parent's singletons to child
    const dependencyGraph = scopedContainer.getStats().dependencyGraph as Record<string, { lifetime?: ServiceLifetime }>;
    for (const [identifier, descriptor] of Object.entries(dependencyGraph)) {
      if (descriptor.lifetime === ServiceLifetime.Singleton) {
        const instance = this.container.tryGet(identifier);
        if (instance) {
          childContainer.registerInstance(identifier, instance);
        }
      }
    }
    return childContainer;
  }

  /**
   * Validate all registered services
   */
  validate(): string[] {
    return this.container.validate();
  }

  /**
   * Get dependency tree for debugging
   */
  getDependencyTree(): Record<string, unknown> {
    const stats = this.container.getStats();
    return (stats.dependencyGraph as Record<string, unknown>) || {};
  }

  /**
   * Get container statistics
   */
  getStats() {
    return {
      ...this.container.getStats(),
      autoRegistered: this.autoRegistered.size
    };
  }

  /**
   * Dispose container and cleanup resources
   */
  dispose(): void {
    this.container.dispose();
    this.autoRegistered.clear();
  }

  /**
   * Scan and auto-register services from a module
   */
  scan(module: Record<string, unknown>): void {
    if (!module) {
      console.warn('No module provided for scanning.');
      return;
    }

    // Scan for service classes in the module
    for (const key in module) {
      const service = module[key];

      // Check if it's a class constructor (service)
      if (typeof service === 'function' && (service as { prototype?: unknown }).prototype) {
        // Check if it has Injectable decorator or follows naming convention
        const serviceName = (service as { name: string }).name;
        if (serviceName.endsWith('Service') || serviceName.endsWith('Repository')) {
          try {
            // Verify it's actually a constructor before registering
            if (service.toString().startsWith('class ')) {
              this.register(service as new (...args: unknown[]) => unknown);
              this.autoRegistered.add(service as new (...args: unknown[]) => unknown);
              console.log(`Auto-registered service: ${serviceName}`);
            } else {
              console.warn(`Skipping non-class function: ${serviceName}`);
            }
          } catch (error) {
            console.warn(`Failed to auto-register ${serviceName}:`, error);
          }
        }
      }
    }
  }

  /**
   * Create child container with inherited services
   */
  createChild(): Container {
    const childContainer = new Container();

    // Copy parent's singletons to child
    const dependencyGraph = this.container.getStats().dependencyGraph as Record<string, { lifetime?: ServiceLifetime }>;
    const entries = Object.entries(dependencyGraph);
    for (const [identifier, descriptor] of entries) {
      if (descriptor.lifetime === ServiceLifetime.Singleton) {
        const instance = this.container.tryGet(identifier);
        if (instance) {
          childContainer.registerInstance(identifier, instance);
        }
      }
    }

    return childContainer;
  }
}
