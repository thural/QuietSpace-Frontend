import { Container } from '@/core/modules/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { ContentRepository } from '../repositories/ContentRepository';
import { ContentDataService } from '../services/ContentDataService';
import { ContentFeatureService } from '../services/ContentFeatureService';

/**
 * Content Feature DI Container
 * 
 * Configures dependency injection for the content feature following enterprise patterns:
 * - Repositories: Transient scope (stateless data access)
 * - Data Services: Singleton scope (shared cache state)
 * - Feature Services: Singleton scope (business logic)
 * - Cache Service: Singleton scope (shared across features)
 */

export function createContentContainer(): Container {
  const container = new Container();
  
  // Core services (inherited from main container)
  // CacheService is registered as singleton in main AppContainer
  
  // Repositories (Transient - new instance per injection)
  container.registerTransientByToken(
    TYPES.CONTENT_REPOSITORY, 
    ContentRepository
  );
  
  // Data Services (Singleton - shared cache state)
  container.registerSingletonByToken(
    TYPES.CONTENT_DATA_SERVICE, 
    ContentDataService
  );
  
  // Feature Services (Singleton - business logic)
  container.registerSingletonByToken(
    TYPES.CONTENT_FEATURE_SERVICE, 
    ContentFeatureService
  );
  
  return container;
}

/**
 * Child container configuration
 * Creates a child container that inherits from the main AppContainer
 */
export function createContentChildContainer(parentContainer: Container): Container {
  const contentContainer = parentContainer.createChild();
  
  // Register content-specific services
  const contentSpecificContainer = createContentContainer();
  
  // Merge configurations
  contentContainer.registerTransientByToken(
    TYPES.CONTENT_REPOSITORY, 
    ContentRepository
  );
  
  contentContainer.registerSingletonByToken(
    TYPES.CONTENT_DATA_SERVICE, 
    ContentDataService
  );
  
  contentContainer.registerSingletonByToken(
    TYPES.CONTENT_FEATURE_SERVICE, 
    ContentFeatureService
  );
  
  return contentContainer;
}

/**
 * Container factory for testing
 */
export function createTestContentContainer(): Container {
  const container = new Container();
  
  // Mock implementations can be registered here for testing
  container.registerTransientByToken(
    TYPES.CONTENT_REPOSITORY, 
    ContentRepository // Replace with mock in tests
  );
  
  container.registerSingletonByToken(
    TYPES.CONTENT_DATA_SERVICE, 
    ContentDataService
  );
  
  container.registerSingletonByToken(
    TYPES.CONTENT_FEATURE_SERVICE, 
    ContentFeatureService
  );
  
  return container;
}
