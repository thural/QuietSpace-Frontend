/**
 * Core System Black Box Index
 *
 * Provides clean public API for all core modules following Black Box pattern.
 * Only interfaces, factory functions, and essential utilities are exported.
 * Implementation details and internal modules are properly hidden.
 */

// Import all shared types, enums, constants, and feature flags
export type {
  ICacheService,
  ICacheServiceManager,
  IWebSocketService,
  IAuthService,
  IThemeService,
  ILoggerService,
  INetworkService,
  IServiceContainer,
  ICoreServices,
  CacheEntry,
  CacheStats,
  CacheConfig,
  WebSocketMessage,
  WebSocketConfig,
  AuthCredentials,
  AuthUser,
  AuthToken,
  AuthSession,
  AuthResult,
  ThemeConfig,
  ThemeTokens,
  EnhancedTheme,
  ApiResponse,
  ApiError,
  IServiceConfig,
  ServiceIdentifier,
  ServiceFactory,
  ServiceDescriptor,
  CoreConfig,
  CoreSystemEvent
} from './configuration/shared';

// Import all shared enums
export {
  WebSocketState,
  LogLevel,
  CacheStrategy,
  AuthProvider,
  ThemeVariant,
  ServiceStatus,
  NetworkStatus,
  CoreSystemStatus
} from './configuration/shared';

// Import all shared constants
export {
  CORE_CONSTANTS,
  CORE_STATUS,
  CORE_EVENTS,
  SERVICE_PRIORITY,
  CORE_ERROR_CODES,
  CORE_ERROR_MESSAGES,
  CORE_SERVICE_NAMES,
  DEFAULT_CORE_CONFIG,
  CORE_VALIDATION_RULES,
  CORE_PERFORMANCE_METRICS,
  CORE_ENVIRONMENT_VARIABLES,
  HEALTH_CHECK_STATUS
} from './configuration/shared';

// Import all shared feature flags
export {
  CORE_FEATURE_FLAGS,
  ENVIRONMENT_FEATURE_FLAGS,
  isFeatureEnabled,
  getAllFeatureFlags,
  enableFeature,
  disableFeature
} from './configuration/shared';

// Export types for feature flags
export type { FeatureFlag, Environment } from './configuration/shared';

// Essential re-exports from compliant modules
export {
  container,
  initializeContainer,
  getContainer,
  createMockContainer
} from './modules/dependency-injection/injection';

export { TYPES } from './modules/dependency-injection/types';

// Legacy exports for backward compatibility (with underscore prefix)
// TODO: Create legacy exports if needed for backward compatibility
