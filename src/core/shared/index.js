/**
 * Core System Shared Index
 * 
 * Centralized exports for all core system shared resources.
 * Provides clean exports following Black Box pattern.
 */

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
} from './enums.js';

// Export all API paths
export {
    API_PATHS,
    POST_URL,
    COMMENT_PATH,
    USER_URL,
    USER_PATH,
    USER_PROFILE,
    USER_PROFILE_URL,
    PHOTO_PATH,
    AUTH_URL,
    SEARCH_URL,
    NOTIFICATION_URL,
    UPLOAD_URL,
    SETTINGS_URL,
    CHAT_URL,
    MESSAGE_URL
} from './apiPath.js';

// Export all feature flags
export {
    CORE_FEATURE_FLAGS,
    ENVIRONMENT_FEATURE_FLAGS,
    isFeatureEnabled,
    getAllFeatureFlags,
    enableFeature,
    disableFeature
} from './featureFlags.js';

// Re-export types for JSDoc usage - available via typedefs in types.js
// Types are available through JSDoc typedefs in the types.js file
