/**
 * Authentication System Black Box Index
 *
 * Provides clean public API for the authentication system following Black Box pattern.
 * Only interfaces, factory functions, and essential utilities are exported.
 * Implementation details and internal modules are properly hidden.
 */

// Public API - Clean interface for consumers
export {
    AuthModuleFactory
} from './AuthModule';

// Core authentication service - Clean API
export {
    EnterpriseAuthService
} from './AuthModule';

// Type exports for public API
export type {
    IAuthProvider,
    IAuthRepository,
    IAuthValidator,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from './AuthModule';

// Domain types - Clean API
export type {
    AuthResult,
    AuthUser,
    AuthCredentials,
    AuthToken,
    AuthSession,
    AuthEvent
} from './types/auth.domain.types';

// Factory functions - Clean service creation
export {
    createDefaultAuthService,
    createCustomAuthService,
    createAuthService
} from './factory';

// Feature authentication factory functions - DI-based auth for features
export {
    createFeatureAuthService,
    createFeatureAuthServiceFromDI,
    createSingletonFeatureAuthService
} from './factory/featureAuthFactory';

// Utility functions - Clean API
export {
    validateAuthConfig,
    sanitizeAuthData,
    extractAuthError,
    formatAuthResult,
    isAuthResult,
    isAuthError,
    isAuthToken,
    isAuthSession,
    isAuthUser,
    isTokenExpired,
    isSessionExpired,
    getTokenTimeToExpiry,
    getSessionTimeToExpiry,
    formatToken,
    createMockAuthResult,
    createMockAuthUser,
    createMockAuthToken,
    createMockAuthSession
} from './utils';

// Constants and enums - Clean API
export {
    AuthProviderType,
    AuthEventType,
    AuthErrorType,
    AuthStatus,
    DEFAULT_AUTH_CONFIG,
    AUTH_CONSTANTS,
    AuthLogLevel
} from './constants';

// Legacy exports for backward compatibility (with underscore prefix)
export {
    AnalyticsPlugin as _AnalyticsPlugin,
    SecurityPlugin as _SecurityPlugin
} from './AuthModule';

// Provider implementations moved to legacy exports (Black Box pattern)
// Note: These should be accessed through factory functions, not direct imports
// TODO: Uncomment when providers are implemented
// export {
//     JwtAuthProvider as _JwtAuthProvider,
//     OAuthAuthProvider as _OAuthAuthProvider,
//     SessionAuthProvider as _SessionAuthProvider,
//     SAMLAuthProvider as _SAMLAuthProvider,
//     LDAPAuthProvider as _LDAPAuthProvider
// } from './providers';

// Configuration functions - Use existing exports
export { AuthConfigLoader, createAuthConfigLoader, loadAuthConfiguration } from './config/AuthConfigLoader';

// Module information
export const AUTH_MODULE_VERSION = '1.0.0';
export const AUTH_MODULE_INFO = {
    name: 'Enterprise Authentication Module',
    version: AUTH_MODULE_VERSION,
    description: 'Centralized authentication management with enterprise patterns',
    deprecatedExports: [
        '_AnalyticsPlugin',
        '_SecurityPlugin',
        '_JwtAuthProvider',
        '_OAuthAuthProvider',
        '_SessionAuthProvider',
        '_SAMLAuthProvider',
        '_LDAPAuthProvider'
    ],
    migrationGuide: 'Use factory functions instead of direct provider imports'
};
export { EnvironmentAuthConfig, createEnvironmentAuthConfig } from './config/EnvironmentAuthConfig';

// Plugin functions - Clean API
export {
    createAuthPlugin,
    registerAuthPlugin,
    getAuthPlugin
} from './factory';

// React hooks for integration (if available)
// TODO: Uncomment when hooks are implemented
// export {
//     useAuth,
//     useAuthUser,
//     useAuthLogin,
//     useAuthLogout,
//     useAuthStatus
// } from './hooks';

// Feature authentication hooks - DI-based auth for features
export {
    useFeatureAuth,
    useReactiveFeatureAuth
} from './hooks/useFeatureAuth';
