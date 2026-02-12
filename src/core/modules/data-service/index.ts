/**
 * Data Service Module - Public API
 *
 * Clean Black Box Module pattern with clean public API exports.
 * Only interfaces, factory functions, and types are exported.
 * Implementation classes are hidden to maintain Black Box principles.
 */

// Public interfaces
export type {
  IBaseDataService,
  ICacheConfig,
  WebSocketUpdateStrategy,
  IDataServiceFactoryOptions,
  IDataServiceQueryOptions,
  IDataServiceMutationOptions,
  IDataServiceInfiniteQueryOptions,
  IDataRepository,
  IDataState,
  IDataStateManager
} from './interfaces';

export type {
  ICacheManager,
  IUpdateStrategy,
  IWebSocketManager,
  IQueryExecutor
} from './services';

// Factory functions - Clean API for service creation
export {
  createDataService,
  createDefaultDataService,
  createDataServiceWithCache,
  createDataServiceWithServices,
  createDataServiceWithFullConfig,
  createDataServices,
  createDataServicesWithIndividualConfig,
  createDataServiceForEnvironment
} from './factory';

// Service classes - For advanced usage
export {
  CacheManager,
  UpdateStrategy,
  WebSocketManager,
  QueryExecutor,
  DataStateManager
} from './services';

// Base class for extension
export { BaseDataService } from './BaseDataService';

// Configuration - Remove config exports as they don't exist
// Note: Configuration is handled internally by the factory functions

// Re-exports for convenience
export type { ICacheProvider } from '@/core/cache';
export type { IWebSocketService } from '@/core/websocket/types';

// Note: React hooks (useQuery, useMutation, useInfiniteQuery) are now exported from
// @/core/hooks/query for better organization

/**
 * Data Service Module Version
 */
export const DATA_SERVICE_VERSION = '2.0.0';

/**
 * Data Service Module Information
 */
export const DATA_SERVICE_INFO = {
  name: 'Data Service Module',
  version: DATA_SERVICE_VERSION,
  description: 'Intelligent data coordination service with caching, WebSocket integration, and optimistic updates',
  features: [
    'Cache-first data fetching',
    'Real-time WebSocket integration',
    'Optimistic updates with rollback',
    'Intelligent cache invalidation',
    'Multiple cache strategies',
    'Dependency injection support',
    'TypeScript support',
    'Single Responsibility Principle',
    'Black Box architecture'
  ],
  architecture: '7-layer: Component → Hook → DI → Service → Data → Cache/Repository/WebSocket'
} as const;
