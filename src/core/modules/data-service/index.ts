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
  IDataServiceQueryOptions,
  IDataServiceMutationOptions,
  IDataServiceInfiniteQueryOptions,
  IDataServiceFactoryOptions,
  IDataRepository,
  IDataServiceStats,
  IDataState,
  IDataStateWithMetadata,
  IDataStateManager
} from './interfaces';

// Factory functions
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

// Re-export types from dependencies for convenience
export type { ICacheProvider } from '@/core/cache';
export type { IWebSocketService } from '@/core/websocket/types';

// Service types for advanced usage (interfaces only)
export type {
  ICacheManager,
  IUpdateStrategy,
  IWebSocketManager,
  IQueryExecutor,
  UpdateStrategyType
} from './services';

// Export configuration
export { DataServiceConfig } from './config/DataServiceConfig';

// React hooks for data fetching
export {
  useQuery,
  useMutation,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type UseMutationOptions,
  type UseMutationResult,
  type UseInfiniteQueryResult
} from './hooks';

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
