/**
 * Core System Black Box Index
 * 
 * Provides clean public API for all core modules following Black Box pattern.
 * Only interfaces, factory functions, and essential utilities are exported.
 * Implementation details and internal modules are properly hidden.
 */

// Public types - Clean API for consumers
export type {
  ICacheService,
  ICacheServiceManager,
  IWebSocketService,
  IAuthService,
  IThemeService,
  INetworkService,
  IServiceContainer,
  IApiClient
} from './types';

// Factory functions - Clean service creation
export {
  createCoreServices,
  createCacheService,
  createWebSocketService,
  createAuthService,
  createThemeService,
  createNetworkService,
  createServiceContainer
} from './factory';

// Essential hooks - Clean API
export {
  useCoreServices,
  useCacheService,
  useWebSocketService,
  useAuthService,
  useThemeService
} from './hooks';

// Configuration types - Clean API
export type {
  CoreConfig,
  CacheConfig,
  WebSocketConfig,
  AuthConfig,
  ThemeConfig,
  NetworkConfig
} from './config';

// Constants and enums - Clean API
export {
  CORE_CONSTANTS,
  CORE_STATUS,
  CORE_EVENTS
} from './constants';

// Utility functions - Clean API
export {
  validateCoreConfig,
  initializeCoreSystem,
  shutdownCoreSystem
} from './utils';

// Legacy exports for backward compatibility (with underscore prefix)
export {
  CacheProvider as _CacheProvider,
  CacheServiceManager as _CacheServiceManager,
  EnterpriseWebSocketService as _EnterpriseWebSocketService,
  apiClient as _ApiClient
} from './legacy';

// Essential re-exports from compliant modules
export {
  container,
  initializeContainer,
  getContainer,
  createMockContainer
} from './di/injection';

export { TYPES } from './di/types';

// Re-export types from compliant modules
export type {
  CacheEntry,
  CacheStats,
  CacheEvents
} from './cache';

export type {
  WebSocketMessage,
  WebSocketConfig as WebSocketConfigType
} from './websocket';

export type {
  AuthResult,
  AuthUser,
  AuthToken
} from './auth';

export type {
  ThemeTokens,
  EnhancedTheme
} from './theme';

export type {
  ApiResponse,
  ApiError
} from './network';
