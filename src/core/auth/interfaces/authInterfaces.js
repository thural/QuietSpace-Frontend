/**
 * Enterprise authentication interfaces
 * 
 * Defines contracts for modular authentication components
 * following dependency inversion and clean architecture principles.
 */

// Import types using JSDoc for JavaScript compatibility
/**
 * @typedef {import('../types/auth.domain.types.js').AuthEvent} AuthEvent
 * @typedef {import('../types/auth.domain.types.js').AuthErrorType} AuthErrorType
 * @typedef {import('../types/auth.domain.types.js').AuthProviderType} AuthProviderType
 * @typedef {import('../types/auth.domain.types.js').AuthCredentials} AuthCredentials
 * @typedef {import('../types/auth.domain.types.js').AuthResult} AuthResult
 * @typedef {import('../types/auth.domain.types.js').AuthSession} AuthSession
 */

/**
 * Authentication provider interface
 * 
 * @interface IAuthProvider
 * @description Defines contract for all authentication providers enabling easy swapping and testing of different auth mechanisms
 */
export class IAuthProvider {
    /**
     * Provider name for identification
     * 
     * @type {string}
     */
    name;

    /**
     * Provider type for categorization
     * 
     * @type {string}
     */
    type;

    /**
     * Provider configuration settings
     * 
     * @type {Record<string, any>}
     */
    config;

    /**
     * Creates an authentication provider
     * 
     * @constructor
     * @param {Object} provider - Provider configuration
     * @param {string} provider.name - Provider name
     * @param {string} provider.type - Provider type
     * @param {Record<string, any>} provider.config - Provider configuration
     * @description Creates a new authentication provider instance
     */
    constructor({ name, type, config }) {
        this.name = name;
        this.type = type;
        this.config = config;
    }

    /**
     * Authenticates user with credentials
     * 
     * @param {AuthCredentials} credentials - User authentication credentials
     * @returns {Promise<AuthResult>} Promise resolving to authentication result with session
     * @description Authenticates a user using provided credentials and returns session information
     */
    async authenticate(credentials) {
        throw new Error('Method authenticate() must be implemented by subclass');
    }

    /**
     * Registers new user
     * 
     * @param {AuthCredentials} userData - User registration data
     * @returns {Promise<AuthResult>} Promise resolving to registration result
     * @description Registers a new user account with the provided credentials
     */
    async register(userData) {
        throw new Error('Method register() must be implemented by subclass');
    }

    /**
     * Activates user account
     * 
     * @param {string} code - Activation code sent to user
     * @returns {Promise<AuthResult>} Promise resolving to activation result
     * @description Activates a user account using the provided activation code
     */
    async activate(code) {
        throw new Error('Method activate() must be implemented by subclass');
    }

    /**
     * Signs out user
     * 
     * @returns {Promise<AuthResult>} Promise resolving to signout result
     * @description Signs out the current user and invalidates their session
     */
    async signout() {
        throw new Error('Method signout() must be implemented by subclass');
    }

    /**
     * Refreshes authentication token
     * 
     * @returns {Promise<AuthResult>} Promise resolving to token refresh result
     * @description Refreshes the authentication token to extend session validity
     */
    async refreshToken() {
        throw new Error('Method refreshToken() must be implemented by subclass');
    }

    /**
     * Validates current session
     * 
     * @returns {Promise<AuthResult>} Promise resolving to session validation result
     * @description Checks if the current session is valid and active
     */
    async validateSession() {
        throw new Error('Method validateSession() must be implemented by subclass');
    }

    /**
     * Configures provider with settings
     * 
     * @param {Record<string, any>} config - Configuration settings
     * @returns {void}
     * @description Updates provider configuration with new settings
     */
    configure(config) {
        this.config = { ...this.config, ...config };
    }

    /**
     * Gets provider capabilities
     * 
     * @returns {string[]} Array of capability descriptions
     * @description Returns list of capabilities supported by this provider
     */
    getCapabilities() {
        return [
            'authenticate',
            'register',
            'activate',
            'signout',
            'refreshToken',
            'validateSession'
        ];
    }

    /**
     * Initializes provider
     * 
     * @returns {Promise<void>} Promise resolving when initialization is complete
     * @description Performs any required initialization for the provider
     */
    async initialize() {
        // Default implementation - can be overridden
    }
}

/**
 * Authentication service interface
 * 
 * @interface IAuthService
 * @description Main service interface for authentication operations and session management
 */
export class IAuthService {
    /**
     * Creates an authentication service
     * 
     * @constructor
     * @description Creates a new authentication service instance
     */
    constructor() {
        // Initialize service properties
    }

    /**
     * Authenticates user with credentials
     * 
     * @param {AuthCredentials} credentials - User authentication credentials
     * @returns {Promise<AuthResult>} Promise resolving to authentication result with session
     * @description Authenticates a user and returns session information
     */
    async authenticate(credentials) {
        throw new Error('Method authenticate() must be implemented by subclass');
    }

    /**
     * Registers new user
     * 
     * @param {AuthCredentials} userData - User registration data
     * @returns {Promise<AuthResult>} Promise resolving to registration result
     * @description Registers a new user account with the provided credentials
     */
    async register(userData) {
        throw new Error('Method register() must be implemented by subclass');
    }

    /**
     * Activates user account
     * 
     * @param {string} code - Activation code sent to user
     * @returns {Promise<AuthResult>} Promise resolving to activation result
     * @description Activates a user account using the provided activation code
     */
    async activate(code) {
        throw new Error('Method activate() must be implemented by subclass');
    }

    /**
     * Signs out user
     * 
     * @returns {Promise<AuthResult>} Promise resolving to signout result
     * @description Signs out the current user and invalidates their session
     */
    async signout() {
        throw new Error('Method signout() must be implemented by subclass');
    }

    /**
     * Refreshes authentication token
     * 
     * @returns {Promise<AuthResult>} Promise resolving to token refresh result
     * @description Refreshes the authentication token to extend session validity
     */
    async refreshToken() {
        throw new Error('Method refreshToken() must be implemented by subclass');
    }

    /**
     * Validates current session
     * 
     * @returns {Promise<AuthResult>} Promise resolving to session validation result
     * @description Checks if the current session is valid and active
     */
    async validateSession() {
        throw new Error('Method validateSession() must be implemented by subclass');
    }

    /**
     * Gets current user session
     * 
     * @returns {Promise<AuthResult>} Promise resolving to current session or null
     * @description Retrieves the current user session information
     */
    async getCurrentSession() {
        throw new Error('Method getCurrentSession() must be implemented by subclass');
    }

    /**
     * Updates user session
     * 
     * @param {AuthSession} session - Updated session data
     * @returns {Promise<AuthResult>} Promise resolving to update result
     * @description Updates the current user session with new data
     */
    async updateSession(session) {
        throw new Error('Method updateSession() must be implemented by subclass');
    }

    /**
     * Clears current session
     * 
     * @returns {Promise<AuthResult>} Promise resolving to clear result
     * @description Clears the current user session
     */
    async clearSession() {
        throw new Error('Method clearSession() must be implemented by subclass');
    }
}

/**
 * Authentication repository interface
 * 
 * @interface IAuthRepository
 * @description Repository interface for authentication data persistence
 */
export class IAuthRepository {
    /**
     * Creates an authentication repository
     * 
     * @constructor
     * @description Creates a new authentication repository instance
     */
    constructor() {
        // Initialize repository properties
    }

    /**
     * Saves user session
     * 
     * @param {AuthSession} session - Session data to save
     * @returns {Promise<void>} Promise resolving when save is complete
     * @description Persists user session data to storage
     */
    async saveSession(session) {
        throw new Error('Method saveSession() must be implemented by subclass');
    }

    /**
     * Retrieves user session
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<AuthSession|null>} Promise resolving to session data or null
     * @description Retrieves stored session data for a user
     */
    async getSession(userId) {
        throw new Error('Method getSession() must be implemented by subclass');
    }

    /**
     * Deletes user session
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<void>} Promise resolving when deletion is complete
     * @description Removes stored session data for a user
     */
    async deleteSession(userId) {
        throw new Error('Method deleteSession() must be implemented by subclass');
    }

    /**
     * Saves user credentials
     * 
     * @param {string} userId - User identifier
     * @param {AuthCredentials} credentials - User credentials to save
     * @returns {Promise<void>} Promise resolving when save is complete
     * @description Persists user credentials securely
     */
    async saveCredentials(userId, credentials) {
        throw new Error('Method saveCredentials() must be implemented by subclass');
    }

    /**
     * Retrieves user credentials
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<AuthCredentials|null>} Promise resolving to credentials or null
     * @description Retrieves stored credentials for a user
     */
    async getCredentials(userId) {
        throw new Error('Method getCredentials() must be implemented by subclass');
    }

    /**
     * Deletes user credentials
     * 
     * @param {string} userId - User identifier
     * @returns {Promise<void>} Promise resolving when deletion is complete
     * @description Removes stored credentials for a user
     */
    async deleteCredentials(userId) {
        throw new Error('Method deleteCredentials() must be implemented by subclass');
    }
}

/**
 * Authentication event handler interface
 * 
 * @interface IAuthEventHandler
 * @description Interface for handling authentication events
 */
export class IAuthEventHandler {
    /**
     * Creates an authentication event handler
     * 
     * @constructor
     * @description Creates a new authentication event handler instance
     */
    constructor() {
        // Initialize event handler properties
    }

    /**
     * Handles authentication event
     * 
     * @param {AuthEvent} event - Authentication event to handle
     * @returns {Promise<void>} Promise resolving when event is handled
     * @description Processes authentication events and triggers appropriate actions
     */
    async handleEvent(event) {
        throw new Error('Method handleEvent() must be implemented by subclass');
    }
}

/**
 * Authentication service factory interface
 * 
 * @interface IAuthServiceFactory
 * @description Factory interface for creating authentication services
 */
export class IAuthServiceFactory {
    /**
     * Creates an authentication service factory
     * 
     * @constructor
     * @description Creates a new authentication service factory instance
     */
    constructor() {
        // Initialize factory properties
    }

    /**
     * Creates authentication service
     * 
     * @returns {IAuthService} New authentication service instance
     * @description Creates and configures an authentication service instance
     */
    createAuthService() {
        throw new Error('Method createAuthService() must be implemented by subclass');
    }

    /**
     * Creates authentication provider
     * 
     * @param {string} type - Provider type to create
     * @param {Record<string, any>} [config] - Optional provider configuration
     * @returns {IAuthProvider} New authentication provider instance
     * @description Creates and configures an authentication provider instance
     */
    createProvider(type, config) {
        throw new Error('Method createProvider() must be implemented by subclass');
    }
}

/**
 * Authentication validator interface
 * 
 * @interface IAuthValidator
 * @description Defines contract for validation strategies enabling different validation rules and security policies
 */
export class IAuthValidator {
    /**
     * Creates an authentication validator
     * 
     * @constructor
     * @description Creates a new authentication validator instance
     */
    constructor() {
        // Initialize validator properties
    }

    /**
     * Validates user credentials
     * 
     * @param {AuthCredentials} credentials - User credentials to validate
     * @returns {Promise<boolean>} Promise resolving to validation result
     * @description Validates user credentials against security policies
     */
    async validateCredentials(credentials) {
        throw new Error('Method validateCredentials() must be implemented by subclass');
    }

    /**
     * Validates session data
     * 
     * @param {AuthSession} session - Session data to validate
     * @returns {Promise<boolean>} Promise resolving to validation result
     * @description Validates session data for integrity and security
     */
    async validateSession(session) {
        throw new Error('Method validateSession() must be implemented by subclass');
    }

    /**
     * Validates activation code
     * 
     * @param {string} code - Activation code to validate
     * @returns {Promise<boolean>} Promise resolving to validation result
     * @description Validates activation code format and validity
     */
    async validateActivationCode(code) {
        throw new Error('Method validateActivationCode() must be implemented by subclass');
    }
}

/**
 * Authentication security interface
 * 
 * @interface IAuthSecurity
 * @description Defines contract for security operations and policies
 */
export class IAuthSecurity {
    /**
     * Creates an authentication security service
     * 
     * @constructor
     * @description Creates a new authentication security service instance
     */
    constructor() {
        // Initialize security service properties
    }

    /**
     * Hashes password
     * 
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Promise resolving to hashed password
     * @description Hashes a password using secure algorithm
     */
    async hashPassword(password) {
        throw new Error('Method hashPassword() must be implemented by subclass');
    }

    /**
     * Verifies password
     * 
     * @param {string} password - Plain text password
     * @param {string} hash - Hashed password to verify against
     * @returns {Promise<boolean>} Promise resolving to verification result
     * @description Verifies a password against its hash
     */
    async verifyPassword(password, hash) {
        throw new Error('Method verifyPassword() must be implemented by subclass');
    }

    /**
     * Generates secure token
     * 
     * @param {number} [length=32] - Token length in bytes
     * @returns {Promise<string>} Promise resolving to generated token
     * @description Generates a cryptographically secure token
     */
    async generateToken(length = 32) {
        throw new Error('Method generateToken() must be implemented by subclass');
    }

    /**
     * Validates token strength
     * 
     * @param {string} token - Token to validate
     * @returns {boolean} Token strength validation result
     * @description Validates token meets security requirements
     */
    validateTokenStrength(token) {
        throw new Error('Method validateTokenStrength() must be implemented by subclass');
    }
}

/**
 * Authentication logger interface
 * 
 * @interface IAuthLogger
 * @description Defines contract for logging strategies enabling different logging destinations and formats
 */
export class IAuthLogger {
    /**
     * Creates an authentication logger
     * 
     * @constructor
     * @param {string} name - Logger name for identification
     * @param {string} level - Logging level for filtering messages
     * @description Creates a new authentication logger instance
     */
    constructor(name, level = 'info') {
        this.name = name;
        this.level = level;
    }

    /**
     * Logs authentication event
     * 
     * @param {AuthEvent} event - Authentication event to log
     * @returns {void}
     * @description Logs an authentication event with appropriate level and context
     */
    log(event) {
        throw new Error('Method log() must be implemented by subclass');
    }

    /**
     * Logs error with context
     * 
     * @param {Error} error - Error to log
     * @param {Record<string, any>} [context] - Additional context information
     * @returns {void}
     * @description Logs an error with additional context information
     */
    logError(error, context) {
        throw new Error('Method logError() must be implemented by subclass');
    }

    /**
     * Logs security event
     * 
     * @param {string} event - Security event description
     * @param {Record<string, any>} [context] - Additional security context
     * @returns {void}
     * @description Logs a security-related event with context
     */
    logSecurity(event, context) {
        throw new Error('Method logSecurity() must be implemented by subclass');
    }
}

/**
 * Authentication metrics interface
 * 
 * @interface IAuthMetrics
 * @description Defines contract for collecting and reporting authentication metrics
 */
export class IAuthMetrics {
    /**
     * Creates an authentication metrics collector
     * 
     * @constructor
     * @description Creates a new authentication metrics collector instance
     */
    constructor() {
        // Initialize metrics collector properties
    }

    /**
     * Records authentication attempt
     * 
     * @param {string} provider - Provider name
     * @param {boolean} success - Whether authentication was successful
     * @param {number} [duration] - Authentication duration in milliseconds
     * @returns {void}
     * @description Records an authentication attempt with metrics
     */
    recordAttempt(provider, success, duration) {
        throw new Error('Method recordAttempt() must be implemented by subclass');
    }

    /**
     * Gets authentication statistics
     * 
     * @returns {Record<string, any>} Authentication statistics
     * @description Returns collected authentication statistics
     */
    getStats() {
        throw new Error('Method getStats() must be implemented by subclass');
    }

    /**
     * Resets metrics
     * 
     * @returns {void}
     * @description Resets all collected metrics
     */
    reset() {
        throw new Error('Method reset() must be implemented by subclass');
    }
}

/**
 * Authentication security service interface
 * 
 * @interface IAuthSecurityService
 * @description Defines contract for security-related operations enabling different security strategies and threat detection
 */
export class IAuthSecurityService {
    /**
     * Creates an authentication security service
     * 
     * @constructor
     * @param {string} name - Service name for identification
     * @description Creates a new authentication security service instance
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Detects suspicious activity patterns
     * 
     * @param {AuthEvent[]} events - Authentication events to analyze
     * @returns {AuthEvent[]} Suspicious events detected
     * @description Analyzes authentication events for suspicious patterns
     */
    detectSuspiciousActivity(events) {
        throw new Error('Method detectSuspiciousActivity() must be implemented by subclass');
    }

    /**
     * Validates security headers
     * 
     * @param {Record<string, string>} headers - HTTP headers to validate
     * @returns {boolean} Whether headers are valid
     * @description Validates security-related HTTP headers
     */
    validateSecurityHeaders(headers) {
        throw new Error('Method validateSecurityHeaders() must be implemented by subclass');
    }

    /**
     * Checks rate limiting
     * 
     * @param {string} userId - User identifier
     * @param {number} attempts - Number of attempts
     * @returns {boolean} Whether rate limit is exceeded
     * @description Checks if user has exceeded rate limit
     */
    checkRateLimit(userId, attempts) {
        throw new Error('Method checkRateLimit() must be implemented by subclass');
    }

    /**
     * Encrypts sensitive data
     * 
     * @param {any} data - Data to encrypt
     * @returns {string} Encrypted data
     * @description Encrypts sensitive data using secure algorithm
     */
    encryptSensitiveData(data) {
        throw new Error('Method encryptSensitiveData() must be implemented by subclass');
    }

    /**
     * Decrypts sensitive data
     * 
     * @param {string} encryptedData - Encrypted data to decrypt
     * @returns {any} Decrypted data
     * @description Decrypts sensitive data using secure algorithm
     */
    decryptSensitiveData(encryptedData) {
        throw new Error('Method decryptSensitiveData() must be implemented by subclass');
    }

    /**
     * Gets client IP address
     * 
     * @returns {Promise<string>} Promise resolving to client IP
     * @description Retrieves client IP address from request
     */
    async getClientIP() {
        throw new Error('Method getClientIP() must be implemented by subclass');
    }
}

/**
 * Authentication configuration interface
 * 
 * @interface IAuthConfig
 * @description Defines contract for configuration management enabling environment-specific and feature-specific settings
 */
export class IAuthConfig {
    /**
     * Creates an authentication configuration
     * 
     * @constructor
     * @description Creates a new authentication configuration instance
     */
    constructor() {
        // Initialize configuration properties
    }

    /**
     * Gets configuration value
     * 
     * @template T
     * @param {string} key - Configuration key
     * @returns {T} Configuration value
     * @description Retrieves configuration value by key
     */
    get(key) {
        throw new Error('Method get() must be implemented by subclass');
    }

    /**
     * Sets configuration value
     * 
     * @template T
     * @param {string} key - Configuration key
     * @param {T} value - Configuration value
     * @returns {void}
     * @description Sets configuration value by key
     */
    set(key, value) {
        throw new Error('Method set() must be implemented by subclass');
    }

    /**
     * Gets all configuration
     * 
     * @returns {Record<string, any>} All configuration values
     * @description Retrieves all configuration values
     */
    getAll() {
        throw new Error('Method getAll() must be implemented by subclass');
    }

    /**
     * Validates configuration
     * 
     * @returns {AuthResult} Validation result
     * @description Validates current configuration
     */
    validate() {
        throw new Error('Method validate() must be implemented by subclass');
    }

    /**
     * Resets to defaults
     * 
     * @returns {void}
     * @description Resets all configuration to default values
     */
    reset() {
        throw new Error('Method reset() must be implemented by subclass');
    }

    /**
     * Watches for configuration changes
     * 
     * @param {(key: string, value: any) => void} callback - Change callback
     * @returns {() => void} Unsubscribe function
     * @description Watches for configuration changes and triggers callback
     */
    watch(callback) {
        throw new Error('Method watch() must be implemented by subclass');
    }
}

/**
 * Main authentication service interface
 * 
 * @interface IMainAuthService
 * @description Defines the contract for the primary authentication service that orchestrates all authentication operations
 */
export class IMainAuthService {
    /**
     * Creates a main authentication service
     * 
     * @constructor
     * @description Creates a new main authentication service instance
     */
    constructor() {
        // Initialize main service properties
        this.providers = new Map();
        this.plugins = new Map();
    }

    /**
     * Registers authentication provider
     * 
     * @param {IAuthProvider} provider - Authentication provider to register
     * @returns {void}
     * @description Registers an authentication provider with the service
     */
    registerProvider(provider) {
        throw new Error('Method registerProvider() must be implemented by subclass');
    }

    /**
     * Registers plugin
     * 
     * @param {IAuthPlugin} plugin - Authentication plugin to register
     * @returns {void}
     * @description Registers an authentication plugin with the service
     */
    registerPlugin(plugin) {
        throw new Error('Method registerPlugin() must be implemented by subclass');
    }

    /**
     * Authenticates user with comprehensive validation and security
     * 
     * @param {string} providerName - Name of the provider to use
     * @param {AuthCredentials} credentials - User authentication credentials
     * @returns {Promise<AuthResult>} Promise resolving to authentication result with session
     * @description Authenticates user using specified provider with comprehensive validation
     */
    async authenticate(providerName, credentials) {
        throw new Error('Method authenticate() must be implemented by subclass');
    }

    /**
     * Gets current authentication session
     * 
     * @returns {Promise<AuthSession|null>} Promise resolving to current session or null
     * @description Retrieves the current authentication session
     */
    async getCurrentSession() {
        throw new Error('Method getCurrentSession() must be implemented by subclass');
    }

    /**
     * Signs out from all providers with comprehensive cleanup
     * 
     * @returns {Promise<void>} Promise resolving when signout is complete
     * @description Signs out from all providers and performs comprehensive cleanup
     */
    async globalSignout() {
        throw new Error('Method globalSignout() must be implemented by subclass');
    }

    /**
     * Gets service capabilities
     * 
     * @returns {string[]} Array of capability descriptions
     * @description Returns list of capabilities supported by this service
     */
    getCapabilities() {
        throw new Error('Method getCapabilities() must be implemented by subclass');
    }

    /**
     * Initializes all providers and plugins
     * 
     * @returns {Promise<void>} Promise resolving when initialization is complete
     * @description Initializes all registered providers and plugins
     */
    async initialize() {
        throw new Error('Method initialize() must be implemented by subclass');
    }
}

/**
 * Authentication plugin interface
 * 
 * @interface IAuthPlugin
 * @description Defines contract for extensible authentication plugins enabling runtime addition of new features
 */
export class IAuthPlugin {
    /**
     * Creates an authentication plugin
     * 
     * @constructor
     * @param {string} name - Plugin name
     * @param {string} version - Plugin version
     * @param {string[]} dependencies - Plugin dependencies
     * @description Creates a new authentication plugin instance
     */
    constructor(name, version, dependencies = []) {
        this.name = name;
        this.version = version;
        this.dependencies = dependencies;
    }

    /**
     * Initializes plugin
     * 
     * @param {IMainAuthService} authService - Authentication service instance
     * @returns {Promise<void>} Promise resolving when initialization is complete
     * @description Initializes plugin with authentication service
     */
    async initialize(authService) {
        throw new Error('Method initialize() must be implemented by subclass');
    }

    /**
     * Executes plugin hook
     * 
     * @param {string} hook - Hook name to execute
     * @param {...any} args - Hook arguments
     * @returns {Promise<any>} Promise resolving to hook result
     * @description Executes a plugin hook with provided arguments
     */
    async execute(hook, ...args) {
        throw new Error('Method execute() must be implemented by subclass');
    }

    /**
     * Cleans up plugin
     * 
     * @returns {Promise<void>} Promise resolving when cleanup is complete
     * @description Performs plugin cleanup operations
     */
    async cleanup() {
        throw new Error('Method cleanup() must be implemented by subclass');
    }

    /**
     * Gets plugin metadata
     * 
     * @returns {Record<string, any>} Plugin metadata
     * @description Returns plugin metadata information
     */
    getMetadata() {
        return {
            name: this.name,
            version: this.version,
            dependencies: this.dependencies
        };
    }
}

/**
 * Creates an authentication provider
 * 
 * @function createAuthProvider
 * @param {string} name - Provider name
 * @param {string} type - Provider type
 * @param {Record<string, any>} config - Provider configuration
 * @returns {IAuthProvider} Authentication provider instance
 * @description Creates a new authentication provider with specified configuration
 */
export function createAuthProvider(name, type, config) {
    return new IAuthProvider({ name, type, config });
}

/**
 * Creates an authentication service
 * 
 * @function createAuthService
 * @returns {IAuthService} Authentication service instance
 * @description Creates a new authentication service instance
 */
export function createAuthService() {
    return new IAuthService();
}

/**
 * Creates an authentication repository
 * 
 * @function createAuthRepository
 * @returns {IAuthRepository} Authentication repository instance
 * @description Creates a new authentication repository instance
 */
export function createAuthRepository() {
    return new IAuthRepository();
}

/**
 * Creates an authentication validator
 * 
 * @function createAuthValidator
 * @returns {IAuthValidator} Authentication validator instance
 * @description Creates a new authentication validator instance
 */
export function createAuthValidator() {
    return new IAuthValidator();
}

/**
 * Creates an authentication security service
 * 
 * @function createAuthSecurity
 * @returns {IAuthSecurity} Authentication security service instance
 * @description Creates a new authentication security service instance
 */
export function createAuthSecurity() {
    return new IAuthSecurity();
}

/**
 * Creates an authentication logger
 * 
 * @function createAuthLogger
 * @param {string} name - Logger name
 * @param {string} level - Logging level
 * @returns {IAuthLogger} Authentication logger instance
 * @description Creates a new authentication logger instance
 */
export function createAuthLogger(name, level = 'info') {
    return new IAuthLogger(name, level);
}

/**
 * Creates an authentication metrics collector
 * 
 * @function createAuthMetrics
 * @returns {IAuthMetrics} Authentication metrics instance
 * @description Creates a new authentication metrics collector instance
 */
export function createAuthMetrics() {
    return new IAuthMetrics();
}

/**
 * Creates an authentication configuration
 * 
 * @function createAuthConfig
 * @returns {IAuthConfig} Authentication configuration instance
 * @description Creates a new authentication configuration instance
 */
export function createAuthConfig() {
    return new IAuthConfig();
}

/**
 * Creates a main authentication service
 * 
 * @function createMainAuthService
 * @returns {IMainAuthService} Main authentication service instance
 * @description Creates a new main authentication service instance
 */
export function createMainAuthService() {
    return new IMainAuthService();
}

/**
 * Creates an authentication plugin
 * 
 * @function createAuthPlugin
 * @param {string} name - Plugin name
 * @param {string} version - Plugin version
 * @param {string[]} dependencies - Plugin dependencies
 * @returns {IAuthPlugin} Authentication plugin instance
 * @description Creates a new authentication plugin instance
 */
export function createAuthPlugin(name, version, dependencies = []) {
    return new IAuthPlugin(name, version, dependencies);
}
