/**
 * Repository Factory for dependency injection.
 * 
 * This factory provides a centralized way to create and manage repository instances,
 * enabling proper dependency injection and environment-aware repository selection.
 * It supports both production and mock implementations based on configuration.
 */

import type { INotificationRepository } from "../domain/INotificationRepository";
import { NotificationRepository } from "./NotificationRepository";
import { MockNotificationRepository } from "./MockNotificationRepository";

/**
 * Repository configuration interface.
 * Defines how repositories should be created and configured.
 */
export interface RepositoryConfig {
  /** Whether to use mock repositories for testing/development */
  useMockRepositories?: boolean;
  /** Configuration for mock repositories */
  mockConfig?: {
    hasPendingNotifications?: boolean;
    hasUnreadChats?: boolean;
    simulateLoading?: boolean;
    simulateError?: boolean;
  };
}

/**
 * Factory class for creating repository instances.
 * Implements the Factory pattern for clean dependency injection.
 */
export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private config: RepositoryConfig;
  private notificationRepository: INotificationRepository | null = null;

  private constructor(config: RepositoryConfig = {}) {
    this.config = {
      useMockRepositories: process.env.NODE_ENV === 'development' || process.env.USE_MOCK_REPOSITORIES === 'true',
      mockConfig: {
        hasPendingNotifications: false,
        hasUnreadChats: false,
        simulateLoading: false,
        simulateError: false,
        ...config.mockConfig
      },
      ...config
    };
  }

  /**
   * Gets the singleton instance of the RepositoryFactory.
   * 
   * @param {RepositoryConfig} config - Configuration for the factory
   * @returns {RepositoryFactory} - Singleton instance
   */
  static getInstance(config?: RepositoryConfig): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory(config);
    }
    return RepositoryFactory.instance;
  }

  /**
   * Creates or returns a cached notification repository instance.
   * 
   * @returns {INotificationRepository} - Notification repository instance
   */
  createNotificationRepository(): INotificationRepository {
    if (!this.notificationRepository) {
      if (this.config.useMockRepositories) {
        this.notificationRepository = new MockNotificationRepository(this.config.mockConfig);
      } else {
        this.notificationRepository = new NotificationRepository();
      }
    }
    return this.notificationRepository;
  }

  /**
   * Resets the factory cache and creates new instances.
   * Useful for testing or configuration changes.
   */
  reset(): void {
    this.notificationRepository = null;
  }

  /**
   * Updates the factory configuration.
   * 
   * @param {RepositoryConfig} newConfig - New configuration
   */
  updateConfig(newConfig: Partial<RepositoryConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.reset(); // Reset to apply new configuration
  }

  /**
   * Gets the current factory configuration.
   * 
   * @returns {RepositoryConfig} - Current configuration
   */
  getConfig(): RepositoryConfig {
    return { ...this.config };
  }

  /**
   * Creates a new factory instance with different configuration.
   * Useful for testing scenarios.
   * 
   * @param {RepositoryConfig} config - Configuration for new factory
   * @returns {RepositoryFactory} - New factory instance
   */
  static createInstance(config?: RepositoryConfig): RepositoryFactory {
    return new RepositoryFactory(config);
  }
}

/**
 * Default repository factory instance for production use.
 * Uses environment-based configuration.
 */
export const defaultRepositoryFactory = RepositoryFactory.getInstance();

/**
 * Factory function for creating notification repositories.
 * Provides a simple API for dependency injection.
 * 
 * @param {RepositoryConfig} config - Optional configuration
 * @returns {INotificationRepository} - Notification repository instance
 */
export const createNotificationRepository = (config?: RepositoryConfig): INotificationRepository => {
  if (config) {
    const factory = RepositoryFactory.createInstance(config);
    return factory.createNotificationRepository();
  }
  return defaultRepositoryFactory.createNotificationRepository();
};

/**
 * Mock repository factory for testing and development.
 * Always returns mock repositories with configurable behavior.
 * 
 * @param {RepositoryConfig['mockConfig']} mockConfig - Mock configuration
 * @returns {INotificationRepository} - Mock notification repository instance
 */
export const createMockNotificationRepository = (mockConfig?: RepositoryConfig['mockConfig']): INotificationRepository => {
  const factory = RepositoryFactory.createInstance({
    useMockRepositories: true,
    mockConfig
  });
  return factory.createNotificationRepository();
};
