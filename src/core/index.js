/**
 * Core System Black Box Index
 * 
 * Provides clean public API for all core modules following Black Box pattern.
 * Only interfaces, factory functions, and essential utilities are exported.
 * Implementation details and internal modules are properly hidden.
 */

// Import all shared types, enums, constants, and feature flags
// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('./types.js').ICacheService} ICacheService
 * @typedef {import('./types.js').ICacheServiceManager} ICacheServiceManager
 * @typedef {import('./types.js').IWebSocketService} IWebSocketService
 * @typedef {import('./types.js').IAuthService} IAuthService
 * @typedef {import('./types.js').IThemeService} IThemeService
 * @typedef {import('./types.js').ILoggerService} ILoggerService
 * @typedef {import('./types.js').INetworkService} INetworkService
 * @typedef {import('./types.js').IServiceContainer} IServiceContainer
 * @typedef {import('./types.js').ICoreServices} ICoreServices
 * @typedef {import('./types.js').CacheEntry} CacheEntry
 * @typedef {import('./types.js').CacheStats} CacheStats
 * @typedef {import('./config.js').CacheConfig} CacheConfig
 * @typedef {import('./types.js').WebSocketMessage} WebSocketMessage
 * @typedef {import('./config.js').WebSocketConfig} WebSocketConfig
 * @typedef {import('./types.js').AuthCredentials} AuthCredentials
 * @typedef {import('./types.js').AuthUser} AuthUser
 * @typedef {import('./types.js').AuthToken} AuthToken
 * @typedef {import('./types.js').AuthSession} AuthSession
 * @typedef {import('./types.js').AuthResult} AuthResult
 * @typedef {import('./types.js').ThemeConfig} ThemeConfig
 * @typedef {import('./types.js').NetworkConfig} NetworkConfig
 * @typedef {import('./config.js').ServiceConfig} ServiceConfig
 * @typedef {import('./types.js').ServiceLifetime} ServiceLifetime
 * @typedef {import('./types.js').ServiceIdentifier} ServiceIdentifier
 */

// Import factory functions
import {
    createCoreServices,
    createServiceContainer,
    createCacheService,
    createAuthService,
    createThemeService,
    createLoggerService,
    createNetworkService,
    createWebSocketService,
    validateCoreServicesConfig
} from './factory.js';

// Import constants and enums
import {
    CORE_CONSTANTS,
    CORE_STATUS,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,
    CORE_VALIDATION_RULES
} from './constants.js';

// Import feature flags that exist
import {
    FEATURE_FLAGS,
    isFeatureEnabled,
    getEnabledFeatures,
    setFeatureFlag,
    getFeatureFlag,
    isValidFeatureFlag
} from './featureFlags.js';

// Import hooks that exist
import {
    useCoreServices,
    useCoreServicesReady,
    useCoreServicesStatus,
    useServiceWithErrorHandling,
    useServiceAvailability
} from './hooks.js';

// Import DI types

// Import configuration

// Export factory functions
export {
    createCoreServices,
    createServiceContainer,
    createCacheService,
    createAuthService,
    createThemeService,
    createLoggerService,
    createNetworkService,
    createWebSocketService
};

// Export constants
export {
    CORE_CONSTANTS,
    CORE_STATUS,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,
    CORE_VALIDATION_RULES
};

// Export feature flags
export {
    FEATURE_FLAGS,
    isFeatureEnabled,
    getEnabledFeatures,
    setFeatureFlag,
    getFeatureFlag,
    isValidFeatureFlag
};

// Export hooks
export {
    useCoreServices,
    useCoreServicesReady,
    useCoreServicesStatus,
    useServiceWithErrorHandling,
    useServiceAvailability
};

// Export context provider for React integration
export { CoreServicesContext } from './hooks.js';

// Export utility functions for backward compatibility
export {
    // Legacy exports with underscore prefix for deprecation
    createCoreServices as createCoreServicesLegacy,
    createServiceContainer as createServiceContainerLegacy,
    validateCoreServicesConfig as validateCoreServicesConfigLegacy
};

// Default export for convenience
export default {
    // Factory functions
    createCoreServices,
    createServiceContainer,
    createCacheService,
    createAuthService,
    createThemeService,
    createLoggerService,
    createNetworkService,
    createWebSocketService,

    // Constants
    CORE_CONSTANTS,
    CORE_STATUS,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,
    CORE_VALIDATION_RULES,

    // Constants
    CORE_CONSTANTS,
    CORE_STATUS,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES,

    // Feature flags
    FEATURE_FLAGS,
    isFeatureEnabled,
    getEnabledFeatures,
    getDisabledFeatures,

    // Hooks
    useCoreServices,
    useCacheService,
    useAuthService,
    useThemeService,
    useLoggerService,
    useNetworkService,
    useWebSocketService
};
