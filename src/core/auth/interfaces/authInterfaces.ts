/**
 * Enterprise authentication interfaces
 * 
 * Defines contracts for modular authentication components
 * following dependency inversion and clean architecture principles.
 */

import {
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
 * @interface IAuthProvider
 * @description Defines contract for all authentication providers enabling easy swapping and testing of different auth mechanisms
 */
export interface IAuthProvider {
    /**
     * Provider name for identification
     * 
     * @type {string}
     */
    readonly name: string;

    /**
     * Provider type for categorization
     * 
     * @type {AuthProviderType}
     */
    readonly type: AuthProviderType;

    /**
     * Provider configuration settings
     * 
     * @type {Record<string, any>}
     */
    readonly config: Record<string, any>;

    /**
     * Authenticates user with credentials
     * 
     * @param {AuthCredentials} credentials - User authentication credentials
     * @returns {Promise<AuthResult<AuthSession>>} Promise resolving to authentication result with session
     * @description Authenticates a user using provided credentials and returns session information
     */
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Registers new user
     * 
     * @param {AuthCredentials} userData - User registration data
     * @returns {Promise<AuthResult<void>>} Promise resolving to registration result
     * @description Registers a new user account with the provided credentials
     */
    register(userData: AuthCredentials): Promise<AuthResult<void>>;

    /**
     * Activates user account
     * 
     * @param {string} code - Activation code sent to user
     * @returns {Promise<AuthResult<void>>} Promise resolving to activation result
     * @description Activates a user account using the provided activation code
     */
    activate(code: string): Promise<AuthResult<void>>;

    /**
     * Signs out user
     * 
     * @returns {Promise<AuthResult<void>>} Promise resolving to signout result
     * @description Signs out the current user and invalidates their session
     */
    signout(): Promise<AuthResult<void>>;

    /**
     * Refreshes authentication token
     * 
     * @returns {Promise<AuthResult>} Promise resolving to token refresh result
     * @description Refreshes the authentication token to extend session validity
     */
    refreshToken(): Promise<AuthResult>;

    /**
     * Validates current session
     * 
     * @returns {Promise<AuthResult<boolean>>} Promise resolving to session validation result
     * @description Checks if the current session is valid and active
     */
    validateSession(): Promise<AuthResult<boolean>>;

    /**
     * Configures provider with settings
     * 
     * @param {Record<string, any>} config - Configuration settings
     * @returns {void}
     * @description Updates provider configuration with new settings
     */
    configure(config: Record<string, any>): void;

    /**
     * Gets provider capabilities
     * 
     * @returns {string[]} Array of capability descriptions
     * @description Returns list of capabilities supported by this provider
     */
    getCapabilities(): string[];

    /**
     * Initializes provider
     * 
     * @returns {Promise<void>} Promise resolving when initialization is complete
     * @description Performs any required initialization for the provider
     */
    initialize?(): Promise<void>;
}

/**
 * Authentication service interface
 * 
 * @interface IAuthService
 * @description Main service interface for authentication operations and session management
 */
export interface IAuthService {
    /**
     * Authenticates user with credentials
     * 
     * @param {AuthCredentials} credentials - User authentication credentials
     * @returns {Promise<AuthResult<AuthSession>>} Promise resolving to authentication result with session
     * @description Authenticates a user and returns session information
     */
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Registers new user
     * 
     * @param {AuthCredentials} userData - User registration data
     * @returns {Promise<AuthResult<void>>} Promise resolving to registration result
     * @description Registers a new user account with the provided credentials
     */
    register(userData: AuthCredentials): Promise<AuthResult<void>>;

    /**
     * Activates user account
     * 
     * @param {string} code - Activation code sent to user
     * @returns {Promise<AuthResult<void>>} Promise resolving to activation result
     * @description Activates a user account using the provided activation code
     */
    activate(code: string): Promise<AuthResult<void>>;

    /**
     * Signs out user
     * 
     * @returns {Promise<AuthResult<void>>} Promise resolving to signout result
     * @description Signs out the current user and invalidates their session
     */
    signout(): Promise<AuthResult<void>>;

    /**
     * Refreshes authentication token
     * 
     * @returns {Promise<AuthResult>} Promise resolving to token refresh result
     * @description Refreshes the authentication token to extend session validity
     */
    refreshToken(): Promise<AuthResult>;

    /**
     * Validates current session
     * 
     * @returns {Promise<AuthResult<boolean>>} Promise resolving to session validation result
     * @description Checks if the current session is valid and active
     */
    validateSession(): Promise<AuthResult<boolean>>;

    /**
     * Gets current user session
     * 
     * @returns {Promise<AuthResult<AuthSession | null>>} Promise resolving to current session or null
     * @description Retrieves the current user session information
     */
    getCurrentSession(): Promise<AuthResult<AuthSession | null>>;

    /**
     * Updates user session
     * 
     * @param {AuthSession} session - Updated session data
     * @returns {Promise<AuthResult<void>>} Promise resolving to update result
     * @description Updates the current user session with new data
     */
    updateSession(session: AuthSession): Promise<AuthResult<void>>;

    /**
     * Clears current session
     * 
     * @returns {Promise<AuthResult<void>> Promise resolving to clear result
     * @description Clears the current user session
     */
    clearSession(): Promise<AuthResult<void>>;
}

/**
 * Authentication repository interface
 * 
 * @interface IAuthRepository
 * @description Repository interface for authentication data persistence
 */
export interface IAuthRepository {
    /**
     * Saves user session
     * 
     * @param {AuthSession} session - Session data to save
     * @returns {Promise<void>} Promise resolving when save is complete
     * @description Persists user session data to storage
     */
    saveSession(session: AuthSession): Promise<void>;

    /**
     * Retrieves user session
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<AuthSession | null>} Promise resolving to session data or null
     * @description Retrieves stored session data for a user
     */
    getSession(userId: string): Promise<AuthSession | null>;

    /**
     * Deletes user session
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<void>} Promise resolving when deletion is complete
     * @description Removes stored session data for a user
     */
    deleteSession(userId: string): Promise<void>;

    /**
     * Saves user credentials
     * 
     * @param {string} userId - User identifier
     * @param {AuthCredentials} credentials - User credentials to save
     * @returns {Promise<void>} Promise resolving when save is complete
     * @description Persists user credentials securely
     */
    saveCredentials(userId: string, credentials: AuthCredentials): Promise<void>;

    /**
     * Retrieves user credentials
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<AuthCredentials | null>} Promise resolving to credentials or null
     * @description Retrieves stored credentials for a user
     */
    getCredentials(userId: string): Promise<AuthCredentials | null>;

    /**
     * Deletes user credentials
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<void>} Promise resolving when deletion is complete
     * @description Removes stored credentials for a user
     */
    deleteCredentials(userId: string): Promise<void>;
}

/**
 * Authentication event handler interface
 * 
 * @interface IAuthEventHandler
 * @description Interface for handling authentication events
 */
export interface IAuthEventHandler {
    /**
     * Handles authentication event
     * 
     * @param {AuthEvent} event - Authentication event to handle
     * @returns {Promise<void>} Promise resolving when event is handled
     * @description Processes authentication events and triggers appropriate actions
     */
    handleEvent(event: AuthEvent): Promise<void>;
}

/**
 * Authentication service factory interface
 * 
 * @interface IAuthServiceFactory
 * @description Factory interface for creating authentication services
 */
export interface IAuthServiceFactory {
    /**
     * Creates authentication service
     * 
     * @returns {IAuthService} New authentication service instance
     * @description Creates and configures an authentication service instance
     */
    createAuthService(): IAuthService;

    /**
     * Creates authentication provider
     * 
     * @param {AuthProviderType} type - Provider type to create
     * @param {Record<string, any>} [config] - Optional provider configuration
     * @returns {IAuthProvider} New authentication provider instance
     * @description Creates and configures an authentication provider instance
     */
    createProvider(type: AuthProviderType, config?: Record<string, any>): IAuthProvider;
}

/**
 * Authentication validator interface
 * 
 * @interface IAuthValidator
 * @description Defines contract for validation strategies enabling different validation rules and security policies
 */
export interface IAuthValidator {
    /**
     * Validates user credentials
     * 
     * @param {AuthCredentials} credentials - User credentials to validate
     * @returns {Promise<boolean>} Promise resolving to validation result
     * @description Validates user credentials against security policies
     */
    validateCredentials(credentials: AuthCredentials): Promise<boolean>;

    /**
     * Validates session data
     * 
     * @param {AuthSession} session - Session data to validate
     * @returns {Promise<boolean>} Promise resolving to validation result
     * @description Validates session data for integrity and security
     */
    validateSession(session: AuthSession): Promise<boolean>;

    /**
     * Validates activation code
     * 
     * @param {string} code - Activation code to validate
     * @returns {Promise<boolean>} Promise resolving to validation result
     * @description Validates activation code format and validity
     */
    validateActivationCode(code: string): Promise<boolean>;
}

/**
 * Authentication security interface
 * 
 * @interface IAuthSecurity
 * @description Defines contract for security operations and policies
 */
export interface IAuthSecurity {
    /**
     * Hashes password
     * 
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Promise resolving to hashed password
     * @description Hashes a password using secure algorithm
     */
    hashPassword(password: string): Promise<string>;

    /**
     * Verifies password
     * 
     * @param {string} password - Plain text password
     * @param {string} hash - Hashed password to verify against
     * @returns {Promise<boolean>} Promise resolving to verification result
     * @description Verifies a password against its hash
     */
    verifyPassword(password: string, hash: string): Promise<boolean>;

    /**
     * Generates secure token
     * 
     * @param {number} [length=32] - Token length in bytes
     * @returns {Promise<string>} Promise resolving to generated token
     * @description Generates a cryptographically secure token
     */
    generateToken(length?: number): Promise<string>;

    /**
     * Validates token strength
     * 
     * @param {string} token - Token to validate
     * @returns {boolean} Token strength validation result
     * @description Validates token meets security requirements
     */
    validateTokenStrength(token: string): boolean;
}

/**
 * Authentication logger interface
 * 
 * @interface IAuthLogger
 * @description Defines contract for logging strategies enabling different logging destinations and formats
 */
export interface IAuthLogger {
    /**
     * Logger name for identification
     * 
     * @type {string}
     */
    readonly name: string;

    /**
     * Logging level for filtering messages
     * 
     * @type {'debug' | 'info' | 'warn' | 'error' | 'security'}
     */
    readonly level: 'debug' | 'info' | 'warn' | 'error' | 'security';

    /**
     * Logs authentication event
     * 
     * @param {AuthEvent} event - Authentication event to log
     * @returns {void}
     * @description Logs an authentication event with appropriate level and context
     */
    log(event: AuthEvent): void;

    /**
     * Logs error with context
     * 
     * @param {Error} error - Error to log
     * @param {Record<string, any>} [context] - Additional context information
     * @returns {void}
     * @description Logs an error with additional context information
     */
    logError(error: Error, context?: Record<string, any>): void;

    /**
     * Logs security event
     * 
     * @param {string} event - Security event description
     * @param {Record<string, any>} [context] - Additional security context
     * @returns {void}
     * @description Logs a security-related event with context
     */
    logSecurity(event: string, context?: Record<string, any>): void;
}

/**
 * Authentication metrics interface
 * 
 * @interface IAuthMetrics
 * @description Defines contract for collecting and reporting authentication metrics
 */
export interface IAuthMetrics {
    /**
     * Records authentication attempt
     * 
     * @param {string} provider - Provider name
     * @param {boolean} success - Whether authentication was successful
     * @param {number} [duration] - Authentication duration in milliseconds
     * @returns {void}
     * @description Records an authentication attempt with metrics
     */
    recordAttempt(provider: string, success: boolean, duration?: number): void;

    /**
     * Gets authentication statistics
     * 
     * @returns {Record<string, any>} Authentication statistics
     * @description Returns collected authentication statistics
     */
    getStats(): Record<string, any>;

    /**
     * Resets metrics
     * 
     * @returns {void}
     * @description Resets all collected metrics
     */
    reset(): void;
}

/**
 * Authentication security service interface
 * 
 * @interface IAuthSecurityService
 * @description Defines contract for security-related operations enabling different security strategies and threat detection
 */
export interface IAuthSecurityService {
    /**
     * Service name for identification
     * 
     * @type {string}
     */
    readonly name: string;

    /**
     * Detects suspicious activity patterns
     * 
     * @param {AuthEvent[]} events - Authentication events to analyze
     * @returns {AuthEvent[]} Suspicious events detected
     * @description Analyzes authentication events for suspicious patterns
     */
    detectSuspiciousActivity(events: AuthEvent[]): AuthEvent[];

    /**
     * Validates security headers
     * 
     * @param {Record<string, string>} headers - HTTP headers to validate
     * @returns {boolean} Whether headers are valid
     * @description Validates security-related HTTP headers
     */
    validateSecurityHeaders(headers: Record<string, string>): boolean;

    /**
     * Checks rate limiting
     * 
     * @param {string} userId - User identifier
     * @param {number} attempts - Number of attempts
     * @returns {boolean} Whether rate limit is exceeded
     * @description Checks if user has exceeded rate limit
     */
    checkRateLimit(userId: string, attempts: number): boolean;

    /**
     * Encrypts sensitive data
     * 
     * @param {any} data - Data to encrypt
     * @returns {string} Encrypted data
     * @description Encrypts sensitive data using secure algorithm
     */
    encryptSensitiveData(data: any): string;

    /**
     * Decrypts sensitive data
     * 
     * @param {string} encryptedData - Encrypted data to decrypt
     * @returns {any} Decrypted data
     * @description Decrypts sensitive data using secure algorithm
     */
    decryptSensitiveData(encryptedData: string): any;

    /**
     * Gets client IP address
     * 
     * @returns {Promise<string>} Promise resolving to client IP
     * @description Retrieves client IP address from request
     */
    getClientIP(): Promise<string>;
}

/**
 * Authentication configuration interface
 * 
 * @interface IAuthConfig
 * @description Defines contract for configuration management enabling environment-specific and feature-specific settings
 */
export interface IAuthConfig {
    /**
     * Gets configuration value
     * 
     * @template T - Type of configuration value
     * @param {string} key - Configuration key
     * @returns {T} Configuration value
     * @description Retrieves configuration value by key
     */
    get<T>(key: string): T;

    /**
     * Sets configuration value
     * 
     * @template T - Type of configuration value
     * @param {string} key - Configuration key
     * @param {T} value - Configuration value
     * @returns {void}
     * @description Sets configuration value by key
     */
    set<T>(key: string, value: T): void;

    /**
     * Gets all configuration
     * 
     * @returns {Record<string, any>} All configuration values
     * @description Retrieves all configuration values
     */
    getAll(): Record<string, any>;

    /**
     * Validates configuration
     * 
     * @returns {AuthResult<boolean>} Validation result
     * @description Validates current configuration
     */
    validate(): AuthResult<boolean>;

    /**
     * Resets to defaults
     * 
     * @returns {void}
     * @description Resets all configuration to default values
     */
    reset(): void;

    /**
     * Watches for configuration changes
     * 
     * @param {(key: string, value: any) => void} callback - Change callback
     * @returns {() => void} Unsubscribe function
     * @description Watches for configuration changes and triggers callback
     */
    watch(callback: (key: string, value: any) => void): () => void;
}

/**
 * Main authentication service interface
 * 
 * @interface IAuthService
 * @description Defines the contract for the primary authentication service that orchestrates all authentication operations
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
    execute(hook: string, ...args: any[]): Promise<any>;

    /**
     * Cleans up plugin
     */
    cleanup(): Promise<void>;

    /**
     * Gets plugin metadata
     */
    getMetadata(): Record<string, any>;
}
