import type { IProfileRepository } from "../domain";

/**
 * Lightweight dependency injection container for the Profile feature.
 *
 * Provides:
 * - Registration of dependencies (e.g., repositories, services)
 * - Runtime resolution of dependencies
 * - Configuration for mock vs real implementations
 *
 * This container is intentionally simple and feature-scoped.
 */
export class ProfileContainer {
  private static instance: ProfileContainer | null = null;

  private dependencies = new Map<string, { factory: () => any; singleton?: boolean; instance?: any }>();
  private config = {
    useMockRepositories: false,
    environment: "production" as "production" | "test" | "development"
  };

  private constructor() {}

  static getInstance(): ProfileContainer {
    if (!ProfileContainer.instance) {
      ProfileContainer.instance = new ProfileContainer();
    }
    return ProfileContainer.instance;
  }

  /**
   * Configure the container (e.g., switch to mock repositories).
   */
  configure(options: {
    useMockRepositories?: boolean;
    environment?: "production" | "test" | "development";
  }): void {
    if (options.useMockRepositories !== undefined) {
      this.config.useMockRepositories = options.useMockRepositories;
    }
    if (options.environment !== undefined) {
      this.config.environment = options.environment;
    }
  }

  /**
   * Register a dependency by key.
   */
  register<T>(key: string, factory: () => T): void {
    this.dependencies.set(key, { factory });
  }

  /**
   * Register a singleton dependency.
   */
  registerSingleton<T>(key: string, factory: () => T): void {
    // Overwriting registration should reset cached instance.
    this.dependencies.set(key, { factory, singleton: true, instance: undefined });
  }

  /**
   * Resolve a dependency by key.
   */
  resolve<T>(key: string): T {
    const entry = this.dependencies.get(key);
    if (!entry) {
      throw new Error(`Dependency '${key}' not registered in ProfileContainer`);
    }
    if (entry.singleton) {
      if (!entry.instance) {
        entry.instance = entry.factory();
      }
      return entry.instance as T;
    }
    return entry.factory() as T;
  }

  /**
   * Check if a dependency is registered.
   */
  has(key: string): boolean {
    return this.dependencies.has(key);
  }

  /**
   * Get current configuration.
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Reset the container (useful for tests).
   */
  reset(): void {
    this.dependencies.clear();
    this.config = {
      useMockRepositories: false,
      environment: "production"
    };
  }
}

/**
 * Convenience function to get the ProfileContainer singleton.
 */
export const getProfileContainer = () => ProfileContainer.getInstance();

/**
 * Dependency keys used throughout the Profile feature.
 */
export const ProfileDependencies = {
  REPOSITORY: "IProfileRepository"
} as const;
