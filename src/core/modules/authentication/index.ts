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

// NEW: SOLID architecture services
export {
    AuthOrchestrator
} from './enterprise/AuthOrchestrator';
export {
    ProviderManager
} from './enterprise/ProviderManager';
export {
    AuthValidator
} from './enterprise/AuthValidator';

// NEW: MFA services (refactored from MFAService)
export {
    UnifiedMFAOrchestrator
} from './mfa';

// NEW: Security services
export {
    AuthRateLimiter,
    RateLimiter,
    InMemoryRateLimitStorage,
    DefaultRateLimitConfigs
} from './security/AuthRateLimiting';
export type {
    IRateLimitConfig,
    IRateLimitEntry,
    IRateLimitResult,
    IRateLimitStorage
} from './security/AuthRateLimiting';

// MFA Factory functions
export {
    createDefaultMFAOrchestrator,
    createCustomMFAOrchestrator,
    createTestMFAOrchestrator
} from './mfa';

// Type exports for public API
export type {
    IAuthRepository,
    IAuthValidator,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from './interfaces/authInterfaces';

// NEW: Segregated interfaces for SOLID compliance
export type {
    IAuthenticator
} from './interfaces/IAuthenticator';
export type {
    IUserManager
} from './interfaces/IUserManager';
export type {
    ITokenManager
} from './interfaces/ITokenManager';
export type {
    IProviderManager
} from './interfaces/IProviderManager';
export type {
    SecurityContext,
    ValidationResult
} from './interfaces/IAuthValidator';
export type {
    TokenInfo
} from './interfaces/ITokenManager';

// Domain types - Clean API
export type {
    AuthResult,
    AuthUser,
    AuthCredentials,
    AuthToken,
    AuthSession,
    AuthEvent
} from './types/auth.domain.types';

// Utility functions - Enhanced workflow API
export {
    createCompleteAuthService,
    getAuthCoreCapabilities,
    getAuthManagementCapabilities,
    getAllAuthCapabilities,
    performAuthWithToken,
    performValidateAndRefresh,
    performManageUser,
    performManageProviders,
    performCompleteAuthentication,
    getServiceHealthStatus
} from './utils/authWorkflows';

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

// Module information
export const AUTH_MODULE_VERSION = '1.0.0';
export const AUTH_MODULE_INFO = {
    name: 'Enterprise Authentication Module',
    version: '2.0.0',
    description: 'SOLID-compliant authentication with enterprise patterns',
    architecture: 'SOLID principles with interface segregation',
    newFeatures: [
        'SOLID principles compliance',
        'Interface segregation',
        'Service responsibility separation',
        'Enhanced validation',
        'Provider management'
    ]
};
export { EnvironmentAuthConfig, createEnvironmentAuthConfig } from './config/EnvironmentAuthConfig';

// Plugin functions - Clean API
export {
    createAuthPlugin,
    registerAuthPlugin,
    getAuthPlugin
} from './factory';

// React hooks for integration (if available)
// Note: React hooks are planned but not yet implemented
// TODO: Implement React hooks for authentication
// export {
//     useAuth,
//     useAuthUser,
//     useAuthLogin,
//     useAuthLogout,
//     useAuthStatus
// } from './hooks';

// Enterprise Token Refresh Manager
export {
    EnterpriseTokenRefreshManager,
    createTokenRefreshManager
} from './services/TokenRefreshManager';

export type {
    TokenRefreshOptions,
    TokenRefreshMetrics
} from './services/TokenRefreshManager';

// Permission System - Export from feature domain
// Note: Permission system should be imported from the feature layer when needed
// export {
//     PERMISSIONS,
//     ROLES,
//     ROLE_PERMISSIONS,
//     hasPermission,
//     getRolePermissions,
//     checkUserPermissions,
//     type Permission,
//     type Role
// } from '@/features/auth/domain/permissions';
