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
} from './AuthModule.js';

// Core authentication service - Clean API
export {
    EnterpriseAuthService
} from './AuthModule.js';

// Factory functions - Clean service creation
export {
    createDefaultAuthService,
    createCustomAuthService,
    createAuthService
} from './factory.js';

// Feature authentication factory functions - DI-based auth for features
export {
    createFeatureAuthService,
    createFeatureAuthServiceFromDI,
    createSingletonFeatureAuthService
} from './factory/featureAuthFactory.js';

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
} from './utils.js';

// Constants and enums - Clean API
export {
    AuthProviderType,
    AuthEventType,
    AuthLogLevel,
    AuthErrorType,
    AuthStatus,
    AuthPermission,
    AuthRole,
    AuthScope,
    AuthTokenType,
    AuthSessionStatus,
    AuthProviderStatus,
    AuthSecurityLevel,
    AuthAuditEventType,
    AuthMetricsType,
    AuthConfigKey,
    AuthValidationRule,
    AuthEnvironment,
    AuthFeatureFlag
} from './constants.js';

// Domain types - Clean API
export {
    AuthResult,
    AuthUser,
    AuthCredentials,
    AuthToken,
    AuthSession,
    AuthEvent
} from './types/auth.domain.types.js';

// Authentication interfaces - Clean API
export {
    IAuthProvider,
    IAuthRepository,
    IAuthValidator,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from './interfaces/authInterfaces.js';

// Authentication providers - Clean API
export {
    JwtAuthProvider,
    OAuthProvider,
    SAMLProvider,
    LDAPProvider,
    SessionProvider
} from './providers/index.js';

// Authentication services - Clean API
export {
    MFAService,
    TokenRefreshManager,
    SessionTimeoutManager,
    AdvancedTokenRotationManager,
    FeatureAuthService
} from './services/index.js';

// Authentication configuration - Clean API
export {
    AuthConfigLoader,
    EnvironmentAuthConfig,
    DefaultAuthConfig,
    ConfigurationWatcher
} from './config/index.js';

// Enterprise auth adapter - Clean API
export {
    EnterpriseAuthAdapter
} from './enterprise/AuthService.js';

// Health checking - Clean API
export {
    HealthChecker
} from './health/HealthChecker.js';

// Security services - Clean API
export {
    EnterpriseSecurityService
} from './security/EnterpriseSecurityService.js';

// Logging services - Clean API
export {
    ConsoleAuthLogger
} from './logging/ConsoleAuthLogger.js';

// Default export for convenience
export { AuthModuleFactory as default } from './AuthModule.js';
