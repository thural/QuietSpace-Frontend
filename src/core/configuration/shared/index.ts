/**
 * Core System Shared Index
 *
 * Centralized exports for all core system shared resources.
 * Provides clean exports following Black Box pattern.
 */

// Export all types
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
} from './types';

// Export all enums
export {
    WebSocketState,
    LogLevel,
    CacheStrategy,
    AuthProvider,
    ThemeVariant,
    ServiceStatus,
    NetworkStatus,
    CoreSystemStatus
} from './enums';

// Export all constants
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
} from './constants';

// Export all feature flags
export {
    CORE_FEATURE_FLAGS,
    ENVIRONMENT_FEATURE_FLAGS,
    isFeatureEnabled,
    getAllFeatureFlags,
    enableFeature,
    disableFeature
} from './featureFlags';

// Export types for feature flags
export type { FeatureFlag, Environment } from './featureFlags';
