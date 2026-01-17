/**
 * Main DI Container.
 * 
 * Central dependency injection container with auto-registration.
 * Provides enterprise-grade DI with reflection support.
 */

import { ServiceContainer } from '../container/ServiceContainer';
import { getInjectableMetadata, getConstructorDependencies } from '../decorators/Injectable';
import type { ServiceIdentifier } from '../registry/ServiceRegistry';

// Import ServiceLifetime as value, not type
import { ServiceLifetime } from '../registry/ServiceRegistry';

/**
 * Main DI container with automatic service registration
 */
export class Container {
  private readonly container = new ServiceContainer();
  private readonly autoRegistered = new Set<any>();

  /**
   * Create new container instance
   */
  static create(): Container {
    return new Container();
  }

  /**
   * Register a service class with automatic dependency resolution
   */
  register<T>(serviceClass: new (...args: any[]) => T, options?: { lifetime?: ServiceLifetime }): void {
    // Get injectable metadata
    const metadata = getInjectableMetadata(serviceClass);
    
    // Get constructor dependencies
    const dependencies = getConstructorDependencies(serviceClass);
    
    // Create factory function
    const factory = (container: any) => {
      // Resolve dependencies
      const resolvedDependencies = dependencies.map(dep => {
        if (typeof dep === 'string' || typeof dep === 'symbol') {
          return container.get(dep);
        }
        return dep; // Direct constructor injection
      });

      // Create instance with dependencies
      return new serviceClass(...(resolvedDependencies as any[]));
    };

    // Register with container
    this.container.register(serviceClass, factory, {
      lifetime: options?.lifetime || metadata.lifetime || ServiceLifetime.Transient,
      dependencies
    });

    this.autoRegistered.add(serviceClass);
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(serviceClass: new (...args: any[]) => T): void {
    this.register(serviceClass, { lifetime: ServiceLifetime.Singleton });
  }

  /**
   * Register a scoped service
   */
  registerScoped<T>(serviceClass: new (...args: any[]) => T): void {
    this.register(serviceClass, { lifetime: ServiceLifetime.Scoped });
  }

  /**
   * Register a service instance
   */
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void {
    this.container.registerInstance(identifier, instance);
  }

  /**
   * Get a service instance
   */
  get<T>(identifier: ServiceIdentifier<T>): T {
    return this.container.get(identifier);
  }

  /**
   * Try to get a service instance
   */
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null {
    return this.container.tryGet(identifier);
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
    const dependencyGraph = scopedContainer.getStats().dependencyGraph || {};
    for (const [identifier, descriptor] of Object.entries(dependencyGraph)) {
      if ((descriptor as any).lifetime === ServiceLifetime.Singleton) {
        const instance = this.container.tryGet(identifier as any);
        if (instance) {
          childContainer.registerInstance(identifier as any, instance);
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
  getDependencyTree(): { [key: string]: any } {
    const stats = this.container.getStats();
    return (stats.dependencyGraph as any) || {};
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
  scan(module: any): void {
    // This would implement reflection-based scanning
    // For now, manual registration is required
    console.warn('Auto-scanning not implemented yet. Please register services manually.');
  }

  /**
   * Create child container with inherited services
   */
  createChild(): Container {
    const childContainer = new Container();
    
    // Copy parent's singletons to child
    const dependencyGraph = this.container.getStats().dependencyGraph || {};
    const entries = Object.entries(dependencyGraph as Record<string, any>);
    for (const [identifier, descriptor] of entries) {
      if (descriptor.lifetime === ServiceLifetime.Singleton) {
        const instance = this.container.tryGet(identifier as any);
        if (instance) {
          childContainer.registerInstance(identifier as any, instance);
        }
      }
    }
    
    return childContainer;
  }
}
