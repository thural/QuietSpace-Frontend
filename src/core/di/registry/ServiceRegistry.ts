/**
 * Service Registry Implementation.
 *
 * Central registry for managing service descriptors.
 * Provides service registration, lookup, and lifecycle management.
 */

/**
 * Service identifier for type-safe dependency resolution
 */
export type ServiceIdentifier<T = unknown> = string | symbol | (new (...args: unknown[]) => T);

/**
 * Service lifetime options
 */
export enum ServiceLifetime {
  Transient = 'transient',   // New instance every time
  Singleton = 'singleton',   // Single instance for container
  Scoped = 'scoped'        // Single instance per scope
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
export type ServiceFactory<T = unknown> = (container: unknown) => T;

/**
 * Service registry interface
 */
export interface IServiceRegistry {
  register(descriptor: ServiceDescriptor): void;
  unregister(identifier: ServiceIdentifier): void;
  get<T>(identifier: ServiceIdentifier<T>): ServiceDescriptor | null;
  has(identifier: ServiceIdentifier): boolean;
  getAll(): ServiceDescriptor[];
  clear(): void;
}

/**
 * Service registry implementation
 */
export class ServiceRegistry implements IServiceRegistry {
  private readonly descriptors = new Map<ServiceIdentifier, ServiceDescriptor>();

  /**
   * Register a service descriptor
   */
  register(descriptor: ServiceDescriptor): void {
    this.descriptors.set(descriptor.identifier, descriptor);
  }

  /**
   * Unregister a service by identifier
   */
  unregister(identifier: ServiceIdentifier): void {
    this.descriptors.delete(identifier);
  }

  /**
   * Get service descriptor by identifier
   */
  get<T>(identifier: ServiceIdentifier<T>): ServiceDescriptor | null {
    return this.descriptors.get(identifier) || null;
  }

  /**
   * Check if Service is registered
   */
  has(identifier: ServiceIdentifier): boolean {
    return this.descriptors.has(identifier);
  }

  /**
   * Get all registered service descriptors
   */
  getAll(): ServiceDescriptor[] {
    return Array.from(this.descriptors.values());
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.descriptors.clear();
  }

  /**
   * Get service descriptors by lifetime
   */
  getByLifetime(lifetime: string): ServiceDescriptor[] {
    return this.getAll().filter(descriptor => descriptor.lifetime === lifetime);
  }

  /**
   * Get service descriptors with dependencies
   */
  getWithDependencies(): ServiceDescriptor[] {
    return this.getAll().filter(descriptor =>
      descriptor.dependencies && descriptor.dependencies.length > 0
    );
  }

  /**
   * Validate service dependencies
   */
  validateDependencies(identifier: ServiceIdentifier): string[] {
    const descriptor = this.get(identifier);
    if (!descriptor) {
      return [`Service ${String(identifier)} not found`];
    }

    const errors: string[] = [];
    if (descriptor.dependencies) {
      for (const dependency of descriptor.dependencies) {
        if (!this.has(dependency)) {
          errors.push(`Dependency ${String(dependency)} not found for service ${String(identifier)}`);
        }
      }
    }

    return errors;
  }

  /**
   * Get dependency graph for debugging
   */
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {};

    for (const descriptor of this.getAll()) {
      const key = String(descriptor.identifier);
      graph[key] = (descriptor.dependencies || []).map(dep => String(dep));
    }

    return graph;
  }
}
