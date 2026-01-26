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
    createAuthService,
    createAuthRepository,
    createAuthLogger,
    createAuthMetrics,
    createAuthSecurityService,
    createMockAuthService
} from './factory';

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

// Essential providers (commonly used) - Import from provider files
export { JwtAuthProvider } from './providers/JwtAuthProvider';
export { OAuthAuthProvider } from './providers/OAuthProvider';
export { SessionAuthProvider } from './providers/SessionAuthProvider';
export { SAMLAuthProvider } from './providers/SAMLProvider';
export { LDAPAuthProvider } from './providers/LDAPProvider';

// Configuration functions - Use existing exports
export { AuthConfigLoader, createAuthConfigLoader, loadAuthConfiguration } from './config/AuthConfigLoader';
export { EnvironmentAuthConfig, createEnvironmentAuthConfig } from './config/EnvironmentAuthConfig';

// Plugin functions - Clean API
export {
    createAuthPlugin,
    registerAuthPlugin,
    getAuthPlugin
} from './factory';

// React hooks for integration (if available)
export {
    useAuth,
    useAuthUser,
    useAuthLogin,
    useAuthLogout,
    useAuthStatus
} from './hooks';
