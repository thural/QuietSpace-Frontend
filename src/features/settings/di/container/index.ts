import { Container } from '@/core/di/container/Container';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { SettingsDataService } from '../services/SettingsDataService';
import { SettingsFeatureService } from '../services/SettingsFeatureService';

/**
 * Settings Feature DI Container
 * 
 * Configures dependency injection for the settings feature following enterprise patterns:
 * - Repositories: Transient scope (stateless data access)
 * - Data Services: Singleton scope (shared cache state)
 * - Feature Services: Singleton scope (business logic)
 * - Cache Service: Singleton scope (shared across features)
 */

export function createSettingsContainer(): Container {
  const container = new Container();

  // Core services (inherited from main container)
  // CacheService is registered as singleton in main AppContainer

  // Repositories (Transient - new instance per injection)
  container.registerTransientByToken(
    TYPES.SETTINGS_REPOSITORY,
    SettingsRepository
  );

  // Data Services (Singleton - shared cache state)
  container.registerSingletonByToken(
    TYPES.SETTINGS_DATA_SERVICE,
    SettingsDataService
  );

  // Feature Services (Singleton - business logic)
  container.registerSingletonByToken(
    TYPES.SETTINGS_FEATURE_SERVICE,
    SettingsFeatureService
  );

  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createSettingsChildContainer(parentContainer: Container): Container {
  const settingsContainer = parentContainer.createChild();

  // Register settings-specific services
  const settingsSpecificContainer = createSettingsContainer();

  // Merge configurations
  settingsContainer.registerTransientByToken(
    TYPES.SETTINGS_REPOSITORY,
    SettingsRepository
  );

  settingsContainer.registerSingletonByToken(
    TYPES.SETTINGS_DATA_SERVICE,
    SettingsDataService
  );

  settingsContainer.registerSingletonByToken(
    TYPES.SETTINGS_FEATURE_SERVICE,
    SettingsFeatureService
  );

  return settingsContainer;
}

/**
 * Container factory for testing
 */
export function createTestSettingsContainer(): Container {
  const container = new Container();

  // Mock implementations can be registered here for testing
  container.registerTransientByToken(
    TYPES.SETTINGS_REPOSITORY,
    SettingsRepository // Replace with mock in tests
  );

  container.registerSingletonByToken(
    TYPES.SETTINGS_DATA_SERVICE,
    SettingsDataService
  );

  container.registerSingletonByToken(
    TYPES.SETTINGS_FEATURE_SERVICE,
    SettingsFeatureService
  );

  return container;
}
