/**
 * Search Feature DI Container
 * 
 * Enterprise-grade dependency injection container for search feature
 * Provides proper service registration and lifecycle management
 */

import { Container } from '@/core/di';
import { TYPES } from '@/core/di/types';
import { CacheService } from '@/core/cache/CacheProvider';
import { SearchRepositoryImpl } from '../../data/repositories/SearchRepositoryImpl';
import { SearchDataService } from '../../data/services/SearchDataService';
import { SearchFeatureService } from '../../application/services/SearchFeatureService';

/**
 * Creates and configures the search feature DI container
 * 
 * @returns {Container} Configured DI container for search feature
 */
export function createSearchContainer(): Container {
  const container = new Container();

  // Register repositories (transient scope - stateless)
  container.bind(TYPES.SEARCH_REPOSITORY)
    .to(SearchRepositoryImpl)
    .inTransientScope();

  // Register data services (singleton scope - shared cache state)
  container.bind(TYPES.SEARCH_DATA_SERVICE)
    .to(SearchDataService)
    .inSingletonScope();

  // Register feature services (singleton scope - stateless business logic)
  container.bind(TYPES.SEARCH_FEATURE_SERVICE)
    .to(SearchFeatureService)
    .inSingletonScope();

  return container;
}

/**
 * Search container factory
 * 
 * Provides a clean interface for creating the search container
 * with proper configuration and validation
 */
export class SearchContainerFactory {
  private static container: Container | null = null;

  /**
   * Creates or returns the search container
   * 
   * @returns {Container} Search DI container
   */
  static create(): Container {
    if (!this.container) {
      this.container = createSearchContainer();
    }
    return this.container;
  }

  /**
   * Resets the container factory
   * Useful for testing or configuration changes
   */
  static reset(): void {
    this.container = null;
  }

  /**
   * Validates container configuration
   * 
   * @returns {boolean} True if container is properly configured
   */
  static validate(): boolean {
    try {
      const container = this.create();
      
      // Check if all required services are registered
      const requiredServices = [
        TYPES.SEARCH_REPOSITORY,
        TYPES.SEARCH_DATA_SERVICE,
        TYPES.SEARCH_FEATURE_SERVICE
      ];

      for (const serviceType of requiredServices) {
        if (!container.isBound(serviceType)) {
          console.error(`Search container: Service ${serviceType} is not bound`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Search container validation failed:', error);
      return false;
    }
  }

  /**
   * Gets container statistics
   * 
   * @returns {Object} Container statistics
   */
  static getStats(): Record<string, any> {
    const container = this.create();
    
    return {
      boundServices: container.bindings.size,
      registeredServices: Array.from(container.bindings.keys()),
      containerId: container.id,
      createdAt: new Date().toISOString()
    };
  }
}

/**
 * Default export - container factory function
 */
export default createSearchContainer;
