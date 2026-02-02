/**
 * Enterprise authentication interfaces
 *
 * Defines contracts for modular authentication components
 * following dependency inversion and clean architecture principles.
 */

import type {
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthEvent,
    AuthErrorType,
    AuthProviderType
} from '../types/auth.domain.types';

// Re-export commonly used types for convenience
export type { AuthEvent, AuthErrorType, AuthProviderType, AuthCredentials, AuthResult, AuthSession };

/**
 * Authentication provider interface
 *
 * Defines contract for all authentication providers
 * enabling easy swapping and testing of different auth mechanisms.
 */
export interface IAuthProvider {
    readonly name: string;
    readonly type: AuthProviderType;
    readonly config: Record<string, unknown>;

    /**
     * Authenticates user with credentials
     */
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Registers new user
     */
    register(userData: AuthCredentials): Promise<AuthResult<void>>;

    /**
     * Activates user account
     */
    activate(code: string): Promise<AuthResult<void>>;

    /**
     * Signs out user
     */
    signout(): Promise<AuthResult<void>>;

    /**
     * Refreshes authentication token
     */
    refreshToken(): Promise<AuthResult>;

    /**
     * Validates current session
     */
    validateSession(): Promise<AuthResult<boolean>>;

    /**
     * Configures provider with settings
     */
    configure(config: Record<string, unknown>): void;

    /**
     * Gets provider capabilities
     */
    getCapabilities(): string[];

    /**
     * Initializes provider
     */
    initialize?(): Promise<void>;
}

/**
 * Authentication repository interface
 *
 * Defines contract for data access layer
 * enabling different storage mechanisms and caching strategies.
 */
export interface IAuthRepository {
    /**
     * Stores authentication session
     */
    storeSession(session: AuthSession): Promise<void>;

    /**
     * Retrieves stored session
     */
    getSession(): Promise<AuthSession | null>;

    /**
     * Removes stored session
     */
    removeSession(): Promise<void>;

    /**
     * Stores refresh token
     */
    storeRefreshToken(token: string): Promise<void>;

    /**
     * Retrieves refresh token
     */
    getRefreshToken(): Promise<string | null>;

    /**
     * Clears all authentication data
     */
    clear(): Promise<void>;
}

/**
 * Authentication validator interface
 *
 * Defines contract for validation strategies
 * enabling different validation rules and security policies.
 */
export interface IAuthValidator {
    readonly name: string;
    readonly rules: Record<string, unknown>;

    /**
     * Validates credentials
     */
    validateCredentials(credentials: AuthCredentials): AuthResult<boolean>;

    /**
     * Validates token format
     */
    validateToken(token: string): AuthResult<boolean>;

    /**
     * Validates user data
     */
    validateUser(user: unknown): AuthResult<boolean>;

    /**
     * Adds validation rule
     */
    addRule(name: string, rule: (data: unknown) => boolean): void;

    /**
     * Removes validation rule
     */
    removeRule(name: string): void;
}

/**
 * Authentication logger interface
 *
 * Defines contract for logging strategies
 * enabling different logging destinations and formats.
 */
export interface IAuthLogger {
    readonly name: string;
    readonly level: 'debug' | 'info' | 'warn' | 'error' | 'security';

    /**
     * Logs authentication event
     */
    log(event: AuthEvent): void;

    /**
     * Logs error with context
     */
    logError(error: Error, context?: Record<string, unknown>): void;

    /**
     * Logs security event
     */
    logSecurity(event: AuthEvent): void;

    /**
     * Retrieves events with filters
     */
    getEvents(filters?: Partial<AuthEvent>): AuthEvent[];

    /**
     * Clears log buffer
     */
    clear(): void;

    /**
     * Sets log level
     */
    setLevel(level: 'debug' | 'info' | 'warn' | 'error' | 'security'): void;
}

/**
 * Authentication metrics interface
 *
 * Defines contract for metrics collection
 * enabling performance monitoring and security analytics.
 */
export interface IAuthMetrics {
    readonly name: string;

    /**
     * Records authentication attempt
     */
    recordAttempt(type: string, duration: number): void;

    /**
     * Records successful authentication
     */
    recordSuccess(type: string, duration: number): void;

    /**
     * Records authentication failure
     */
    recordFailure(type: string, error: AuthErrorType, duration: number): void;

    /**
     * Gets performance metrics
     */
    getMetrics(timeRange?: { start: Date; end: Date }): {
        totalAttempts: number;
        successRate: number;
        failureRate: number;
        averageDuration: number;
        errorsByType: Record<string, number>;
    };

    /**
     * Resets metrics
     */
    reset(): void;
}

/**
 * Authentication security service interface
 *
 * Defines contract for security-related operations
 * enabling different security strategies and threat detection.
 */
export interface IAuthSecurityService {
    readonly name: string;

    /**
     * Detects suspicious activity patterns
     */
    detectSuspiciousActivity(events: AuthEvent[]): AuthEvent[];

    /**
     * Validates security headers
     */
    validateSecurityHeaders(headers: Record<string, string>): boolean;

    /**
     * Checks rate limiting
     */
    checkRateLimit(userId: string, attempts: number): boolean;

    /**
     * Encrypts sensitive data
     */
    encryptSensitiveData(data: unknown): string;

    /**
     * Decrypts sensitive data
     */
    decryptSensitiveData(encryptedData: string): unknown;

    /**
     * Gets client IP address
     */
    getClientIP(): Promise<string>;
}

/**
 * Authentication configuration interface
 *
 * Defines contract for configuration management
 * enabling environment-specific and feature-specific settings.
 */
export interface IAuthConfig {
    /**
     * Gets configuration value
     */
    get<T>(key: string): T;

    /**
     * Sets configuration value
     */
    set<T>(key: string, value: T): void;

    /**
     * Gets all configuration
     */
    getAll(): Record<string, unknown>;

    /**
     * Validates configuration
     */
    validate(): AuthResult<boolean>;

    /**
     * Resets to defaults
     */
    reset(): void;

    /**
     * Watches for configuration changes
     */
    watch(key: string, callback: (value: unknown) => void): () => void;
}

/**
 * Main authentication service interface
 *
 * Defines the contract for the primary authentication service
 * that orchestrates all authentication operations.
 */
export interface IAuthService {
    /**
     * Registers authentication provider
     */
    registerProvider(provider: IAuthProvider): void;

    /**
     * Registers plugin
     */
    registerPlugin(plugin: IAuthPlugin): void;

    /**
     * Authenticates user with comprehensive validation and security
     */
    authenticate(providerName: string, credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Gets current authentication session
     */
    getCurrentSession(): Promise<AuthSession | null>;

    /**
     * Signs out from all providers with comprehensive cleanup
     */
    globalSignout(): Promise<void>;

    /**
     * Gets service capabilities
     */
    getCapabilities(): string[];

    /**
     * Initializes all providers and plugins
     */
    initialize(): Promise<void>;
}

/**
 * Authentication plugin interface
 *
 * Defines contract for extensible authentication plugins
 * enabling runtime addition of new features.
 */
export interface IAuthPlugin {
    readonly name: string;
    readonly version: string;
    readonly dependencies: string[];

    /**
     * Initializes plugin
     */
    initialize(authService: IAuthService): Promise<void>;

    /**
     * Executes plugin hook
     */
    execute(hook: string, ...args: unknown[]): Promise<unknown>;

    /**
     * Cleans up plugin
     */
    cleanup(): Promise<void>;

    /**
     * Gets plugin metadata
     */
    getMetadata(): Record<string, unknown>;
}
