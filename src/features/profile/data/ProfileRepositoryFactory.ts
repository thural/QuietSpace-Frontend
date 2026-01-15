/**
 * Profile Repository Factory.
 * 
 * Factory class for creating and managing profile repository instances.
 * Supports dependency injection and environment-aware repository selection.
 */

import type { IProfileRepository } from "../domain";
import { ProfileRepository } from "./ProfileRepository";
import { MockProfileRepository } from "./MockProfileRepository";
import { ReactiveProfileRepository } from "./ReactiveProfileRepository";

interface RepositoryConfig {
  useMockRepositories?: boolean;
  mockConfig?: {
    simulateLoading?: boolean;
    simulateError?: boolean;
    isPrivate?: boolean;
    isVerified?: boolean;
    followersCount?: number;
    followingsCount?: number;
    postsCount?: number;
    isFollowing?: boolean;
  };
  environment?: 'development' | 'testing' | 'production' | 'test';
}

export class ProfileRepositoryFactory {
  private static instance: ProfileRepositoryFactory;
  private config: RepositoryConfig;
  private repositories: Map<string, IProfileRepository> = new Map();

  private constructor(config: RepositoryConfig = {}) {
    this.config = {
      useMockRepositories: process.env.NODE_ENV === 'test',
      environment: (process.env.NODE_ENV as any) || 'development',
      ...config
    };
  }

  /**
   * Get singleton instance of the factory.
   */
  static getInstance(config?: RepositoryConfig): ProfileRepositoryFactory {
    if (!ProfileRepositoryFactory.instance) {
      ProfileRepositoryFactory.instance = new ProfileRepositoryFactory(config);
    }
    return ProfileRepositoryFactory.instance;
  }

  /**
   * Create a new instance of the factory.
   */
  static createInstance(config: RepositoryConfig = {}): ProfileRepositoryFactory {
    return new ProfileRepositoryFactory(config);
  }

  /**
   * Create profile repository instance.
   */
  createProfileRepository(config?: RepositoryConfig): IProfileRepository {
    const finalConfig = { ...this.config, ...config };
    const cacheKey = JSON.stringify(finalConfig);

    // Return cached instance if available
    if (this.repositories.has(cacheKey)) {
      return this.repositories.get(cacheKey)!;
    }

    let repository: IProfileRepository;

    if (finalConfig.useMockRepositories || finalConfig.environment === 'test') {
      repository = new MockProfileRepository(finalConfig.mockConfig);
    } else {
      // Keep React Query hydration in the data layer via a reactive adapter.
      repository = new ReactiveProfileRepository(new ProfileRepository());
    }

    // Cache the repository
    this.repositories.set(cacheKey, repository);
    return repository;
  }

  /**
   * Create mock profile repository.
   */
  createMockProfileRepository(config?: RepositoryConfig['mockConfig']): IProfileRepository {
    return new MockProfileRepository(config);
  }

  /**
   * Create production profile repository.
   */
  createProductionProfileRepository(): IProfileRepository {
    return new ProfileRepository();
  }

  /**
   * Update factory configuration.
   */
  updateConfig(newConfig: Partial<RepositoryConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // Clear cached repositories as config changed
    this.repositories.clear();
  }

  /**
   * Get current factory configuration.
   */
  getConfig(): RepositoryConfig {
    return { ...this.config };
  }

  /**
   * Reset factory and clear all cached repositories.
   */
  reset(): void {
    this.repositories.clear();
    this.config = {
      useMockRepositories: process.env.NODE_ENV === 'test',
      environment: (process.env.NODE_ENV as any) || 'development'
    };
  }

  /**
   * Check if using mock repositories.
   */
  isUsingMockRepositories(): boolean {
    return this.config.useMockRepositories || this.config.environment === 'test';
  }

  /**
   * Get repository statistics.
   */
  getRepositoryStats(): {
    totalRepositories: number;
    cachedRepositories: number;
    config: RepositoryConfig;
  } {
    return {
      totalRepositories: this.repositories.size,
      cachedRepositories: this.repositories.size,
      config: this.getConfig()
    };
  }
}

/**
 * Convenience functions for creating repositories.
 */
export const createProfileRepository = (config?: RepositoryConfig): IProfileRepository => {
  return ProfileRepositoryFactory.getInstance().createProfileRepository(config);
};

export const createMockProfileRepository = (config?: RepositoryConfig['mockConfig']): IProfileRepository => {
  return ProfileRepositoryFactory.getInstance().createMockProfileRepository(config);
};

export const getProfileRepositoryFactory = (): ProfileRepositoryFactory => {
  return ProfileRepositoryFactory.getInstance();
};
