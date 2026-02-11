/**
 * Authentication Module Interfaces Index
 *
 * Exports all authentication interfaces with proper organization
 * and enhanced individual interfaces for SOLID compliance.
 */

// Core authentication interfaces (enhanced with composite-like methods)
export type { IAuthenticator } from './IAuthenticator';
export type { ITokenManager } from './ITokenManager';
export type { IUserManager } from './IUserManager';
export type { IProviderManager } from './IProviderManager';
export type { IAuthValidator } from './IAuthValidator';

// Main authentication interfaces
export type {
    IAuthService,
    IAuthRepository,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from './authInterfaces';

// Re-export commonly used types
export type {
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthEvent,
    AuthErrorType,
    AuthProviderType,
    AuthUser,
    AuthToken
} from '../types/auth.domain.types';

// Legacy exports for backward compatibility
// These will be deprecated in future versions
export type {
    HealthCheckResult,
    PerformanceMetrics,
    InitializationOptions
} from './IAuthenticator';

export type {
    TokenInfo
} from './ITokenManager';

export type {
    ProviderPriority,
    ProviderRegistrationOptions,
    ProviderHealthStatus,
    ManagerStatistics
} from './IProviderManager';
