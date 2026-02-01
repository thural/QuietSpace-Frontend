/**
 * Service Container Implementation.
 * 
 * Main IoC container for dependency injection.
 * Provides service registration, resolution, and lifecycle management.
 */

import { ServiceRegistry } from '../registry/ServiceRegistry';

/**
 * Service identifier for type-safe dependency resolution
 */
type ServiceIdentifier<T = any> = string | symbol | (new (...args: any[]) => T);

/**
 * Service lifetime options
 */
enum ServiceLifetime {
  Transient = 'transient',   // New instance every time
  Singleton = 'singleton',   // Single instance for container
  Scoped = 'scoped',        // Single instance per scope
}

/**
 * Service descriptor for registration
 */
interface ServiceDescriptor {
  identifier: ServiceIdentifier;
  factory: ServiceFactory;
  lifetime: ServiceLifetime;
  dependencies?: ServiceIdentifier[];
}

/**
 * Service factory function type
 */
type ServiceFactory<T = any> = (container: any) => T;

/**
 * Service container interface
 */
interface IServiceContainer {
  register<T>(identifier: ServiceIdentifier<T>, factory: ServiceFactory<T>, options?: any): void;
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void;
  get<T>(identifier: ServiceIdentifier<T>): T;
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null;
  has<T>(identifier: ServiceIdentifier<T>): boolean;
  resolve<T>(constructor: new (...args: any[]) => T): T;
  createScope(): IServiceContainer;
  dispose(): void;
}

/**
 * Service container implementation
 */
export class ServiceContainer implements IServiceContainer {
  private readonly registry = new ServiceRegistry();
  private readonly instances = new Map<ServiceIdentifier, any>();
  private readonly scopes = new Set<ServiceContainer>();
  private parent?: ServiceContainer;

  constructor(parent?: ServiceContainer) {
    this.parent = parent;
  }

  /**
   * Register a service with factory
   */
  register<T>(
    identifier: ServiceIdentifier<T>, 
    factory: ServiceFactory<T>, 
    options: any = {}
  ): void {
    this.registry.register({
      identifier,
      factory,
      lifetime: options.lifetime || ServiceLifetime.Transient,
      dependencies: options.dependencies
    });
  }

  /**
   * Register a service instance
   */
  registerInstance<T>(identifier: ServiceIdentifier<T>, instance: T): void {
    this.instances.set(identifier, instance);
  }

  /**
   * Get a service instance
   */
  get<T>(identifier: ServiceIdentifier<T>): T {
    // Check for existing instance
    if (this.instances.has(identifier)) {
      return this.instances.get(identifier);
    }

    // Get service descriptor
    const descriptor = this.registry.get(identifier);
    if (!descriptor) {
      throw new Error(`Service ${String(identifier)} not registered`);
    }

    // Create instance based on lifetime
    const instance = this.createInstance(descriptor, identifier);
    
    // Store singleton instances
    if (descriptor.lifetime === ServiceLifetime.Singleton) {
      this.instances.set(identifier, instance);
    }

    return instance;
  }

  /**
   * Try to get a service instance
   */
  tryGet<T>(identifier: ServiceIdentifier<T>): T | null {
    try {
      return this.get(identifier);
    } catch {
      return null;
    }
  }

  /**
   * Check if Service is registered
   */
  has<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.registry.has(identifier) || this.instances.has(identifier);
  }

  /**
   * Resolve a service from constructor
   */
  resolve<T>(constructor: new (...args: any[]) => T): T {
    return this.get(constructor);
  }

  /**
   * Create a scoped container
   */
  createScope(): ServiceContainer {
    const scope = new ServiceContainer(this);
    this.scopes.add(scope);
    return scope;
  }

  /**
   * Create service instance with dependency injection
   */
  private createInstance<T>(descriptor: ServiceDescriptor, identifier: ServiceIdentifier<T>): T {
    // Create instance with dependencies
    return descriptor.factory(this);
  }

  /**
   * Validate all registered services
   */
  validate(): string[] {
    const errors: string[] = [];
    
    for (const descriptor of this.registry.getAll()) {
      const validationErrors = this.registry.validateDependencies(descriptor.identifier);
      errors.push(...validationErrors);
    }

    return errors;
  }

  /**
   * Get dependency tree for debugging
   */
  getDependencyTree(): Record<string, any> {
    const tree: Record<string, any> = {};
    
    for (const descriptor of this.registry.getAll()) {
      const key = String(descriptor.identifier);
      tree[key] = {
        lifetime: descriptor.lifetime,
        dependencies: descriptor.dependencies?.map(dep => String(dep)) || [],
        hasInstance: this.instances.has(descriptor.identifier)
      };
    }

    return tree;
  }

  /**
   * Dispose container and cleanup resources
   */
  dispose(): void {
    // Dispose all scopes
    const scopesArray = Array.from(this.scopes);
    for (const scope of scopesArray) {
      scope.dispose();
    }
    this.scopes.clear();

    // Clear instances
    this.instances.clear();

    // Clear registry
    this.registry.clear();
  }

  /**
   * Get container statistics
   */
  getStats() {
    return {
      registeredServices: this.registry.getAll().length,
      singletonInstances: this.instances.size,
      activeScopes: this.scopes.size,
      dependencyGraph: this.registry.getDependencyGraph()
    };
  }
}

// Export types for external use
export type { ServiceIdentifier, ServiceFactory, ServiceDescriptor, IServiceContainer };
export { ServiceLifetime };
