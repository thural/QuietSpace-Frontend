import { Container } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import { AnalyticsRepository } from '../repositories/AnalyticsRepository';
import { AnalyticsDataService } from '../services/AnalyticsDataService';
import { AnalyticsFeatureService } from '../services/AnalyticsFeatureService';

/**
 * Analytics Feature DI Container
 * 
 * Configures dependency injection for the analytics feature following enterprise patterns:
 * - Repositories: Transient scope (stateless data access)
 * - Data Services: Singleton scope (shared cache state)
 * - Feature Services: Singleton scope (business logic)
 * - Cache Service: Singleton scope (shared across features)
 */

export function createAnalyticsContainer(): Container {
  const container = new Container();

  // Core services (inherited from main container)
  // CacheService is registered as singleton in main AppContainer

  // Repositories (Transient - new instance per injection)
  container.registerTransientByToken(
    TYPES.ANALYTICS_REPOSITORY,
    AnalyticsRepository
  );

  // Data Services (Singleton - shared cache state)
  container.registerSingletonByToken(
    TYPES.ANALYTICS_DATA_SERVICE,
    AnalyticsDataService
  );

  // Feature Services (Singleton - business logic)
  container.registerSingletonByToken(
    TYPES.ANALYTICS_FEATURE_SERVICE,
    AnalyticsFeatureService
  );

  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createAnalyticsChildContainer(parentContainer: Container): Container {
  const analyticsContainer = parentContainer.createChild();

  // Register analytics-specific services
  const analyticsSpecificContainer = createAnalyticsContainer();

  // Merge configurations
  analyticsContainer.registerTransientByToken(
    TYPES.ANALYTICS_REPOSITORY,
    AnalyticsRepository
  );

  analyticsContainer.registerSingletonByToken(
    TYPES.ANALYTICS_DATA_SERVICE,
    AnalyticsDataService
  );

  analyticsContainer.registerSingletonByToken(
    TYPES.ANALYTICS_FEATURE_SERVICE,
    AnalyticsFeatureService
  );

  return analyticsContainer;
}

/**
 * Container factory for testing
 */
export function createTestAnalyticsContainer(): Container {
  const container = new Container();

  // Mock implementations can be registered here for testing
  container.registerTransientByToken(
    TYPES.ANALYTICS_REPOSITORY,
    AnalyticsRepository // Replace with mock in tests
  );

  container.registerSingletonByToken(
    TYPES.ANALYTICS_DATA_SERVICE,
    AnalyticsDataService
  );

  container.registerSingletonByToken(
    TYPES.ANALYTICS_FEATURE_SERVICE,
    AnalyticsFeatureService
  );

  return container;
}
