import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { createCacheProvider, type ICacheProvider } from '@/core/cache';
import { INotificationRepository } from '@features/navbar/domain/repositories/INotificationRepository';
import { NavbarDataService } from '../services/NavbarDataService';
import { NavbarFeatureService } from '../services/NavbarFeatureService';

/**
 * Navbar Feature DI Container
 * 
 * Configures dependency injection for the navbar feature following enterprise patterns:
 * - Repositories: Transient scope (stateless data access)
 * - Data Services: Singleton scope (shared cache state)
 * - Feature Services: Singleton scope (business logic)
 * - Cache Service: Singleton scope (shared across features)
 */

export function createNavbarContainer(): Container {
  const container = new Container();

  // Core services (inherited from main container)
  // CacheService is registered as singleton in main AppContainer

  // Repositories (Transient - new instance per injection)
  container.registerTransientByToken(
    TYPES.NOTIFICATION_REPOSITORY,
    INotificationRepository
  );

  // Data Services (Singleton - shared cache state)
  container.registerSingletonByToken(
    TYPES.NAVBAR_DATA_SERVICE,
    NavbarDataService
  );

  // Feature Services (Singleton - business logic)
  container.registerSingletonByToken(
    TYPES.NAVBAR_FEATURE_SERVICE,
    NavbarFeatureService
  );

  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createNavbarChildContainer(parentContainer: Container): Container {
  const navbarContainer = parentContainer.createChild();

  // Register navbar-specific services
  const navbarSpecificContainer = createNavbarContainer();

  // Merge configurations
  navbarContainer.registerTransientByToken(
    TYPES.NOTIFICATION_REPOSITORY,
    INotificationRepository
  );

  navbarContainer.registerSingletonByToken(
    TYPES.NAVBAR_DATA_SERVICE,
    NavbarDataService
  );

  navbarContainer.registerSingletonByToken(
    TYPES.NAVBAR_FEATURE_SERVICE,
    NavbarFeatureService
  );

  return navbarContainer;
}

/**
 * Container factory for testing
 */
export function createTestNavbarContainer(): Container {
  const container = new Container();

  // Mock implementations can be registered here for testing
  container.registerTransientByToken(
    TYPES.NOTIFICATION_REPOSITORY,
    INotIFICATIONRepository // Replace with mock in tests
  );

  container.registerSingletonByToken(
    TYPES.NAVBAR_DATA_SERVICE,
    NavbarDataService
  );

  container.registerSingletonByToken(
    TYPES.NAVBAR_FEATURE_SERVICE,
    NavbarFeatureService
  );

  return container;
}
