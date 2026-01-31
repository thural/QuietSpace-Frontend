/**
 * Data Service Module - Factory Functions
 * 
 * Following Black Box Module pattern with clean factory functions
 * for creating data services with proper dependency injection.
 */

import { useDIContainer } from '../di/index.js';
import { BaseDataService } from './BaseDataService.js';

/**
 * Factory function to create a data service instance with custom configuration
 * 
 * @param {Function} DataServiceClass - The data service class to instantiate
 * @param {Object} [options] - Configuration options for the data service
 * @returns {Object} Configured data service instance
 */
export function createDataService(DataServiceClass, options = {}) {
  const container = useDIContainer();

  // Use provided services or get from DI container
  const cache = options.cache || container.get('CACHE_SERVICE');
  const webSocket = options.webSocket || container.get('WEBSOCKET_SERVICE');

  // Create data service instance
  const dataService = new DataServiceClass();

  // Inject dependencies (if needed)
  if (options.cache || options.webSocket) {
    dataService.cache = cache;
    dataService.webSocket = webSocket;
  }

  // Apply custom cache configuration if provided
  if (options.customCacheConfig) {
    dataService.CACHE_CONFIG = {
      ...dataService.CACHE_CONFIG,
      ...options.customCacheConfig,
    };
  }

  return dataService;
}

/**
 * Factory function to create a data service with default configuration
 * 
 * @param {Function} DataServiceClass - The data service class to instantiate
 * @returns {Object} Data service instance with default DI services
 */
export function createDefaultDataService(DataServiceClass) {
  return createDataService(DataServiceClass);
}

/**
 * Factory function to create a data service with custom cache configuration
 * 
 * @param {Function} DataServiceClass - The data service class to instantiate
 * @param {Object} customCacheConfig - Custom cache configuration to merge with defaults
 * @returns {Object} Data service instance with custom cache settings
 */
export function createDataServiceWithCache(DataServiceClass, customCacheConfig) {
  return createDataService(DataServiceClass, {
    customCacheConfig,
  });
}

/**
 * Factory function to create a data service with custom services
 * 
 * @param {Function} DataServiceClass - The data service class to instantiate
 * @param {Object} cache - Custom cache provider
 * @param {Object} webSocket - Custom WebSocket service
 * @returns {Object} Data service instance with custom services
 */
export function createDataServiceWithServices(DataServiceClass, cache, webSocket) {
  return createDataService(DataServiceClass, {
    cache,
    webSocket,
  });
}

/**
 * Factory function to create a data service with full custom configuration
 * 
 * @param {Function} DataServiceClass - The data service class to instantiate
 * @param {Object} options - Complete configuration options
 * @returns {Object} Fully configured data service instance
 */
export function createDataServiceWithFullConfig(DataServiceClass, options) {
  return createDataService(DataServiceClass, options);
}

/**
 * Utility function to create multiple data services with shared configuration
 * 
 * @param {Function[]} dataServiceClasses - Array of data service classes to create
 * @param {Object} [sharedOptions] - Shared configuration for all data services
 * @returns {Object[]} Array of configured data service instances
 */
export function createDataServices(dataServiceClasses, sharedOptions = {}) {
  return dataServiceClasses.map(DataServiceClass =>
    createDataService(DataServiceClass, sharedOptions)
  );
}

/**
 * Utility function to create data services with individual configurations
 * 
 * @param {Array} dataServiceConfig - Array of tuples containing class and its specific options
 * @returns {Object[]} Array of configured data service instances
 */
export function createDataServicesWithIndividualConfig(dataServiceConfig) {
  return dataServiceConfig.map(([DataServiceClass, options]) =>
    createDataService(DataServiceClass, options)
  );
}

/**
 * Factory function for creating data services with environment-specific configuration
 * 
 * @param {Function} DataServiceClass - The data service class to instantiate
 * @param {string} environment - Environment name ('development', 'production', 'test')
 * @returns {Object} Data service instance configured for the specified environment
 */
export function createDataServiceForEnvironment(DataServiceClass, environment = 'production') {
  const environmentConfigs = {
    development: {
      customCacheConfig: {
        REALTIME: {
          staleTime: 5 * 1000,  // 5 seconds - faster refresh for development
          cacheTime: 30 * 1000, // 30 seconds - shorter cache for development
          refetchInterval: 10 * 1000, // 10 seconds
        },
        USER_CONTENT: {
          staleTime: 30 * 1000, // 30 seconds
          cacheTime: 2 * 60 * 1000, // 2 minutes
          refetchInterval: 60 * 1000, // 1 minute
        },
      },
    },
    production: {
      customCacheConfig: {
        REALTIME: {
          staleTime: 30 * 1000, // 30 seconds
          cacheTime: 5 * 60 * 1000, // 5 minutes
          refetchInterval: 60 * 1000, // 1 minute
        },
        USER_CONTENT: {
          staleTime: 2 * 60 * 1000, // 2 minutes
          cacheTime: 15 * 60 * 1000, // 15 minutes
          refetchInterval: 5 * 60 * 1000, // 5 minutes
        },
      },
    },
    test: {
      customCacheConfig: {
        REALTIME: {
          staleTime: 0, // No caching for tests
          cacheTime: 0,
          refetchInterval: undefined,
        },
        USER_CONTENT: {
          staleTime: 0, // No caching for tests
          cacheTime: 0,
          refetchInterval: undefined,
        },
      },
    },
  };

  return createDataService(DataServiceClass, environmentConfigs[environment]);
}
