/**
 * Core System Shared Feature Flags
 * 
 * Centralized feature flags for the core system.
 * Provides clean feature flag exports following Black Box pattern.
 */

// Core Feature Flags
export const CORE_FEATURE_FLAGS = {
    // Metrics and Monitoring
    ENABLE_METRICS: true,
    ENABLE_PERFORMANCE_MONITORING: true,
    ENABLE_ERROR_REPORTING: true,

    // Debug and Development
    ENABLE_DEBUG_MODE: false,
    ENABLE_MOCK_SERVICES: false,
    ENABLE_DEVELOPER_TOOLS: false,

    // System Features
    ENABLE_HEALTH_CHECKS: true,
    ENABLE_AUTO_RECOVERY: true,
    ENABLE_GRACEFUL_SHUTDOWN: true,

    // Cache Features
    ENABLE_CACHE_METRICS: true,
    ENABLE_CACHE_COMPRESSION: false,
    ENABLE_CACHE_ENCRYPTION: false,

    // WebSocket Features
    ENABLE_WEBSOCKET_RECONNECT: true,
    ENABLE_WEBSOCKET_HEARTBEAT: true,
    ENABLE_WEBSOCKET_COMPRESSION: false,

    // Authentication Features
    ENABLE_AUTH_REFRESH: true,
    ENABLE_AUTH_MFA: false,
    ENABLE_AUTH_SOCIAL: false,

    // Theme Features
    ENABLE_THEME_ANIMATIONS: true,
    ENABLE_THEME_TRANSITIONS: true,
    ENABLE_THEME_CUSTOMIZATION: true,

    // Network Features
    ENABLE_NETWORK_RETRY: true,
    ENABLE_NETWORK_TIMEOUT: true,
    ENABLE_NETWORK_CACHING: false,

    // Service Features
    ENABLE_SERVICE_LOGGING: true,
    ENABLE_SERVICE_PROFILING: false,
    ENABLE_SERVICE_HEALTH_CHECKS: true
} as const;

// Environment-specific Feature Flags
export const ENVIRONMENT_FEATURE_FLAGS = {
    development: {
        ...CORE_FEATURE_FLAGS,
        ENABLE_DEBUG_MODE: true,
        ENABLE_MOCK_SERVICES: true,
        ENABLE_DEVELOPER_TOOLS: true,
        ENABLE_SERVICE_PROFILING: true
    },
    production: {
        ...CORE_FEATURE_FLAGS,
        ENABLE_DEBUG_MODE: false,
        ENABLE_MOCK_SERVICES: false,
        ENABLE_DEVELOPER_TOOLS: false,
        ENABLE_SERVICE_PROFILING: false
    },
    test: {
        ...CORE_FEATURE_FLAGS,
        ENABLE_DEBUG_MODE: true,
        ENABLE_MOCK_SERVICES: true,
        ENABLE_DEVELOPER_TOOLS: false,
        ENABLE_SERVICE_PROFILING: false
    }
} as const;

// Feature Flag Types
export type FeatureFlag = keyof typeof CORE_FEATURE_FLAGS;
export type Environment = 'development' | 'production' | 'test';

// Feature Flag Utilities
export function isFeatureEnabled(flag: FeatureFlag, environment: Environment = 'production'): boolean {
    return ENVIRONMENT_FEATURE_FLAGS[environment][flag];
}

export function getAllFeatureFlags(environment: Environment = 'production'): Record<string, boolean> {
    return ENVIRONMENT_FEATURE_FLAGS[environment];
}

export function enableFeature(flag: FeatureFlag, environment: Environment): void {
    (ENVIRONMENT_FEATURE_FLAGS[environment] as any)[flag] = true;
}

export function disableFeature(flag: FeatureFlag, environment: Environment): void {
    (ENVIRONMENT_FEATURE_FLAGS[environment] as any)[flag] = false;
}