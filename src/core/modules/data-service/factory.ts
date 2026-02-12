/**
 * Data Service Module - Factory Functions
 *
 * Following Black Box Module pattern with clean factory functions
 * for creating data services with proper dependency injection.
 */

import type { BaseDataService } from './BaseDataService';
import type { IDataServiceFactoryOptions, ICacheConfig } from './interfaces';
import type { ICacheProvider } from '@/core/cache';
import type { IWebSocketService } from '@/core/websocket/types';

import { useDIContainer } from '@/core/hooks/ui/dependency-injection';
import { TYPES } from '@/core/modules/dependency-injection/types';


/**
 * Factory function to create a data service instance with custom configuration
 *
 * @param options Configuration options for the data service
 * @returns Configured data service instance
 */
export function createDataService<T extends BaseDataService>(
  DataServiceClass: new () => T,
  options: IDataServiceFactoryOptions = {}
): T {
  const container = useDIContainer();

  // Use provided services or get from DI container
  const cache = options.cache || container.getByToken<ICacheProvider>(TYPES.CACHE_SERVICE);
  const webSocket = options.webSocket || container.getByToken<IWebSocketService>(TYPES.WEBSOCKET_SERVICE);

  // Create data service instance
  const dataService = new DataServiceClass();

  // Inject dependencies (if needed)
  if (options.cache || options.webSocket) {
    (dataService as any).cache = cache;
    (dataService as any).webSocket = webSocket;
  }

  // Apply custom cache configuration if provided
  if (options.customCacheConfig) {
    (dataService as any).CACHE_CONFIG = {
      ...(dataService as any).CACHE_CONFIG,
      ...options.customCacheConfig
    };
  }

  return dataService;
}

/**
 * Factory function to create a data service with default configuration
 *
 * @param DataServiceClass The data service class to instantiate
 * @returns Data service instance with default DI services
 */
export function createDefaultDataService<T extends BaseDataService>(
  DataServiceClass: new () => T
): T {
  return createDataService(DataServiceClass);
}

/**
 * Factory function to create a data service with custom cache configuration
 *
 * @param DataServiceClass The data service class to instantiate
 * @param customCacheConfig Custom cache configuration to merge with defaults
 * @returns Data service instance with custom cache settings
 */
export function createDataServiceWithCache<T extends BaseDataService>(
  DataServiceClass: new () => T,
  customCacheConfig: Partial<ICacheConfig>
): T {
  return createDataService(DataServiceClass, {
    customCacheConfig
  });
}

/**
 * Factory function to create a data service with custom services
 *
 * @param DataServiceClass The data service class to instantiate
 * @param cache Custom cache provider
 * @param webSocket Custom WebSocket service
 * @returns Data service instance with custom services
 */
export function createDataServiceWithServices<T extends BaseDataService>(
  DataServiceClass: new () => T,
  cache: ICacheProvider,
  webSocket: IWebSocketService
): T {
  return createDataService(DataServiceClass, {
    cache,
    webSocket
  });
}

/**
 * Factory function to create a data service with full custom configuration
 *
 * @param DataServiceClass The data service class to instantiate
 * @param options Complete configuration options
 * @returns Fully configured data service instance
 */
export function createDataServiceWithFullConfig<T extends BaseDataService>(
  DataServiceClass: new () => T,
  options: IDataServiceFactoryOptions
): T {
  return createDataService(DataServiceClass, options);
}

/**
 * Utility function to create multiple data services with shared configuration
 *
 * @param dataServiceClasses Array of data service classes to create
 * @param sharedOptions Shared configuration for all data services
 * @returns Array of configured data service instances
 */
export function createDataServices<T extends BaseDataService>(
  dataServiceClasses: (new () => T)[],
  sharedOptions: IDataServiceFactoryOptions = {}
): T[] {
  return dataServiceClasses.map(DataServiceClass =>
    createDataService(DataServiceClass, sharedOptions)
  );
}

/**
 * Utility function to create data services with individual configurations
 *
 * @param dataServiceConfig Array of tuples containing class and its specific options
 * @returns Array of configured data service instances
 */
export function createDataServicesWithIndividualConfig<T extends BaseDataService>(
  dataServiceConfig: [new () => T, IDataServiceFactoryOptions][]
): T[] {
  return dataServiceConfig.map(([DataServiceClass, options]) =>
    createDataService(DataServiceClass, options)
  );
}

/**
 * Factory function for creating data services with environment-specific configuration
 *
 * @param DataServiceClass The data service class to instantiate
 * @param environment Environment name ('development', 'production', 'test')
 * @returns Data service instance configured for the specified environment
 */
export function createDataServiceForEnvironment<T extends BaseDataService>(
  DataServiceClass: new () => T,
  environment: 'development' | 'production' | 'test' = 'production'
): T {
  const environmentConfigs = {
    development: {
      customCacheConfig: {
        REALTIME: {
          staleTime: 5 * 1000,  // 5 seconds - faster refresh for development
          cacheTime: 30 * 1000, // 30 seconds - shorter cache for development
          refetchInterval: 10 * 1000 // 10 seconds
        },
        USER_CONTENT: {
          staleTime: 30 * 1000, // 30 seconds
          cacheTime: 2 * 60 * 1000, // 2 minutes
          refetchInterval: 60 * 1000 // 1 minute
        }
      }
    },
    production: {
      customCacheConfig: {
        REALTIME: {
          staleTime: 30 * 1000, // 30 seconds
          cacheTime: 5 * 60 * 1000, // 5 minutes
          refetchInterval: 60 * 1000 // 1 minute
        },
        USER_CONTENT: {
          staleTime: 2 * 60 * 1000, // 2 minutes
          cacheTime: 15 * 60 * 1000, // 15 minutes
          refetchInterval: 5 * 60 * 1000 // 5 minutes
        }
      }
    },
    test: {
      customCacheConfig: {
        REALTIME: {
          staleTime: 0, // No caching for tests
          cacheTime: 0,
          refetchInterval: undefined
        },
        USER_CONTENT: {
          staleTime: 0, // No caching for tests
          cacheTime: 0,
          refetchInterval: undefined
        }
      }
    }
  };

  return createDataService(DataServiceClass, environmentConfigs[environment]);
}
