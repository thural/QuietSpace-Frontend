import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { AuthRepository } from '../repositories/AuthRepository';
import { AuthDataService } from '../services/AuthDataService';
import { AuthFeatureService } from '../services/AuthFeatureService';

/**
 * Auth Feature DI Container
 * 
 * Configures dependency injection for the auth feature following enterprise patterns:
 * - Repositories: Transient scope (stateless data access)
 * - Data Services: Singleton scope (shared cache state)
 * - Feature Services: Singleton scope (business logic)
 * - Cache Service: Singleton scope (shared across features)
 */

export function createAuthContainer(): Container {
  const container = new Container();

  // Core services (inherited from main container)
  // CacheService is registered as singleton in main AppContainer

  // Repositories (Transient - new instance per injection)
  container.registerTransientByToken(
    TYPES.IAUTH_REPOSITORY,
    AuthRepository
  );

  // Data Services (Singleton - shared cache state)
  container.registerSingletonByToken(
    TYPES.AUTH_DATA_SERVICE,
    AuthDataService
  );

  // Feature Services (Singleton - business logic)
  container.registerSingletonByToken(
    TYPES.AUTH_FEATURE_SERVICE,
    AuthFeatureService
  );

  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createAuthChildContainer(parentContainer: Container): Container {
  const authContainer = parentContainer.createChild();

  // Register auth-specific services
  const authSpecificContainer = createAuthContainer();

  // Merge configurations
  authContainer.registerTransientByToken(
    TYPES.IAUTH_REPOSITORY,
    AuthRepository
  );

  authContainer.registerSingletonByToken(
    TYPES.AUTH_DATA_SERVICE,
    AuthDataService
  );

  authContainer.registerSingletonByToken(
    TYPES.AUTH_FEATURE_SERVICE,
    AuthFeatureService
  );

  return authContainer;
}

/**
 * Container factory for testing
 */
export function createTestAuthContainer(): Container {
  const container = new Container();

  // Mock implementations can be registered here for testing
  container.registerTransientByToken(
    TYPES.IAUTH_REPOSITORY,
    AuthRepository // Replace with mock in tests
  );

  container.registerSingletonByToken(
    TYPES.AUTH_DATA_SERVICE,
    AuthDataService
  );

  container.registerSingletonByToken(
    TYPES.AUTH_FEATURE_SERVICE,
    AuthFeatureService
  );

  return container;
}
