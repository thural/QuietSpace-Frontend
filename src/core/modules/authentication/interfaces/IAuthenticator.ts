/**
 * Authentication Provider Interface
 *
 * Defines contract for core authentication operations only.
 * This interface focuses solely on authentication-related responsibilities
 * following the Interface Segregation Principle.
 */

import type { AuthCredentials, AuthResult, AuthSession, AuthProviderType } from '../types/auth.domain.types';

/**
 * Health check result for authentication providers
 */
export interface HealthCheckResult {
    /** Overall health status */
    healthy: boolean;

    /** Health check timestamp */
    timestamp: Date;

    /** Response time in milliseconds */
    responseTime: number;

    /** Health status message */
    message?: string;

    /** Additional health metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Performance metrics for authentication operations
 */
export interface PerformanceMetrics {
    /** Total authentication attempts */
    totalAttempts: number;

    /** Successful authentications */
    successfulAuthentications: number;

    /** Failed authentications */
    failedAuthentications: number;

    /** Average response time in milliseconds */
    averageResponseTime: number;

    /** Last authentication timestamp */
    lastAuthentication?: Date;

    /** Error breakdown by type */
    errorsByType: Record<string, number>;

    /** Performance statistics */
    statistics: {
        successRate: number;
        failureRate: number;
        throughput: number; // authentications per minute
    };
}

/**
 * Initialization options for authentication providers
 */
export interface InitializationOptions {
    /** Timeout for initialization in milliseconds */
    timeout?: number;

    /** Retry attempts for failed initialization */
    retryAttempts?: number;

    /** Whether to initialize asynchronously */
    async?: boolean;

    /** Additional initialization parameters */
    parameters?: Record<string, unknown>;
}

/**
 * Core authentication provider interface
 *
 * Provides essential authentication operations without user management concerns.
 * Implementations should focus only on authentication, validation, and token management.
 */
export interface IAuthenticator {
    /** Provider name for identification */
    readonly name: string;

    /** Provider type for categorization */
    readonly type: AuthProviderType;

    /** Provider configuration settings */
    readonly config: Record<string, unknown>;

    /**
     * Authenticates user with credentials
     * 
     * @param credentials - User authentication credentials
     * @returns Authentication result with session or error
     */
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Validates current authentication session
     * 
     * @returns Validation result with session validity
     */
    validateSession(): Promise<AuthResult<boolean>>;

    /**
     * Refreshes authentication token
     * 
     * @returns New session with refreshed token
     */
    refreshToken(): Promise<AuthResult<AuthSession>>;

    /**
     * Configures provider with settings
     * 
     * @param config - Configuration settings
     */
    configure(config: Record<string, unknown>): void;

    /**
     * Gets provider capabilities
     * 
     * @returns Array of capability identifiers
     */
    getCapabilities(): string[];

    /**
     * Initializes provider (optional)
     * 
     * @param options - Initialization options for advanced configuration
     * @returns Promise when initialization is complete
     */
    initialize?(options?: InitializationOptions): Promise<void>;

    /**
     * Performs health check on the authentication provider
     * 
     * @returns Health check result with status and metrics
     */
    healthCheck(): Promise<HealthCheckResult>;

    /**
     * Gets performance metrics for the authentication provider
     * 
     * @returns Performance metrics and statistics
     */
    getPerformanceMetrics(): PerformanceMetrics;

    /**
     * Resets performance metrics
     */
    resetPerformanceMetrics(): void;

    /**
     * Checks if provider is currently healthy
     * 
     * @returns True if provider is healthy and operational
     */
    isHealthy(): Promise<boolean>;

    /**
     * Gets provider initialization status
     * 
     * @returns True if provider is initialized and ready
     */
    isInitialized(): boolean;

    /**
     * Gets provider uptime in milliseconds
     * 
     * @returns Uptime since initialization or 0 if not initialized
     */
    getUptime(): number;

    /**
     * Gets core capabilities for authentication and token management
     * 
     * @returns Array of core capability identifiers
     */
    getCoreCapabilities(): string[];

    /**
     * Performs comprehensive authentication with token management
     * 
     * @param credentials - User authentication credentials
     * @returns Authentication result with session and token setup
     */
    authenticateWithToken(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Validates current session and refreshes token if needed
     * 
     * @returns Validation result with refreshed session if applicable
     */
    validateAndRefresh(): Promise<AuthResult<AuthSession>>;

    /**
     * Gracefully shuts down the provider
     * 
     * @param timeout - Optional timeout for shutdown in milliseconds
     * @returns Promise when shutdown is complete
     */
    shutdown?(timeout?: number): Promise<void>;
}
