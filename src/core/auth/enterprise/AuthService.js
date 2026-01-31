/**
 * Enterprise authentication service
 * 
 * Implements modular authentication with dependency injection
 * using the existing Inversify container for consistency.
 */

// Import types via JSDoc typedefs
/**
 * @typedef {import('../types/auth.domain.types.js').AuthCredentials} AuthCredentials
 * @typedef {import('../types/auth.domain.types.js').AuthResult} AuthResult
 * @typedef {import('../types/auth.domain.types.js').AuthSession} AuthSession
 * @typedef {import('../types/auth.domain.types.js').AuthErrorType} AuthErrorType
 * @typedef {import('../types/auth.domain.types.js').AuthUser} AuthUser
 * @typedef {import('../types/auth.domain.types.js').AuthToken} AuthToken
 */

// Import types via JSDoc typedefs
/**
 * Authentication configuration interface
 * @typedef {Object} IAuthConfig
 * @property {string} [provider] - Default authentication provider
 * @property {boolean} [enableLogging] - Enable authentication logging
 * @property {boolean} [enableMetrics] - Enable metrics collection
 * @property {number} [sessionTimeout] - Session timeout in milliseconds
 * @property {number} [maxLoginAttempts] - Maximum login attempts allowed
 * @property {boolean} [enableMultiFactor] - Enable multi-factor authentication
 * @property {(key: string): any} get - Get configuration value
 */

/**
 * Authentication logger interface
 * @typedef {Object} IAuthLogger
 * @property {(level: string, message: string, data?: any): void} log - Log authentication event
 * @property {(error: Error): void} error - Log authentication error
 * @property {(info: string, data?: any): void} info - Log info message
 * @property {(debug: string, data?: any): void} debug - Log debug message
 */

/**
 * Authentication metrics interface
 * @typedef {Object} IAuthMetrics
 * @property {() => number} getTotalLogins - Get total login attempts
 * @property {() => number} getSuccessfulLogins - Get successful login count
 * @property {() => number} getFailedLogins - Get failed login count
 * @property {() => number} getActiveSessions - Get active session count
 * @property {(event: string): void} recordEvent - Record authentication event
 * @property {() => void} incrementAuthenticationAttempt - Increment authentication attempts
 * @property {() => any} getMetrics - Get metrics data
 */

/**
 * Authentication plugin interface
 * @typedef {Object} IAuthPlugin
 * @property {string} name - Plugin name
 * @property {string} version - Plugin version
 * @property {(config: any): void} initialize - Initialize plugin with configuration
 * @property {(): void} cleanup - Cleanup plugin resources
 * @property {(): boolean} isInitialized - Check if plugin is initialized
 */

/**
 * Authentication repository interface
 * @typedef {Object} IAuthRepository
 * @property {(credentials: AuthCredentials): Promise<AuthResult>} authenticate - Authenticate user
 * @property {(token: string): Promise<AuthUser | null>} getUserByToken - Get user by token
 * @property {(userId: string): Promise<void>} invalidateSession - Invalidate user session
 * @property {(userId: string): Promise<AuthSession[]>} getUserSessions - Get user sessions
 */

/**
 * Authentication security service interface
 * @typedef {Object} IAuthSecurityService
 * @property {(password: string): Promise<string>} hashPassword - Hash password
 * @property {(token: string): Promise<boolean>} validateToken - Validate token
 * @property {(event: string, data: any): Promise<boolean>} checkSecurityEvent - Check security event
 * @property {(user: any): Promise<Object>} sanitizeUserData - Sanitize user data
 * @property {(error: any): Promise<void>} applySecurityMeasures - Apply security measures
 */

/**
 * Authentication service interface
 * @typedef {Object} IAuthService
 * @property {(credentials: AuthCredentials): Promise<AuthResult>} authenticate - Authenticate user
 * @property {(token: string): Promise<AuthUser | null>} getUserByToken - Get user by token
 * @property {(userId: string): Promise<void>} logout - Logout user
 * @property {(userId: string): Promise<boolean>} isAuthenticated - Check if user is authenticated
 * @property {(): Promise<AuthSession[]>} getActiveSessions - Get active sessions
 * @property {(): Promise<void>} cleanup - Cleanup resources
 */

/**
 * Authentication provider interface
 * @typedef {Object} IAuthProvider
 * @property {string} name - Provider name
 * @property {string} type - Provider type
 * @property {Object} config - Provider configuration
 * @property {(credentials: AuthCredentials): Promise<AuthResult>} authenticate - Authenticate user
 * @property {(): Promise<void>} cleanup - Cleanup provider resources
 * @property {(): boolean} isAvailable - Check if provider is available
 */

/**
 * Authentication validator interface
 * @typedef {Object} IAuthValidator
 * @property {(credentials: AuthCredentials): Promise<boolean>} validateCredentials - Validate credentials
 * @property {(user: any): Promise<boolean>} validateUser - Validate user data
 * @property {(token: string): Promise<boolean>} validateToken - Validate token format
 */

/**
 * Enterprise authentication service implementation
 * 
 * Provides comprehensive authentication with:
 * - Enterprise security features
 * - Comprehensive logging and metrics
 * - Multiple provider support
 */
export class EnterpriseAuthService {
    /** @type {IAuthRepository} */
    #repository;
    /** @type {IAuthLogger} */
    #logger;
    /** @type {IAuthMetrics} */
    #metrics;
    /** @type {IAuthSecurityService} */
    #security;
    /** @type {IAuthConfig} */
    #config;
    /** @type {Map<string, IAuthProvider>} */
    #providers = new Map();
    /** @type {Map<string, any>} */
    #plugins = new Map();
    /** @type {Map<string, IAuthValidator>} */
    #validators = new Map();
    /** @type {string|undefined} */
    #activeProvider;

    /**
     * @param {IAuthRepository} repository 
     * @param {IAuthLogger} logger 
     * @param {IAuthMetrics} metrics 
     * @param {IAuthSecurityService} security 
     * @param {IAuthConfig} config 
     */
    constructor(repository, logger, metrics, security, config) {
        this.#repository = repository;
        this.#logger = logger;
        this.#metrics = metrics;
        this.#security = security;
        this.#config = config;
    }

    /**
     * Registers an authentication provider
     * @param {IAuthProvider} provider 
     */
    registerProvider(provider) {
        this.#providers.set(provider.type, provider);
        this.#logger.info(`Registered authentication provider: ${provider.name}`);
    }

    /**
     * Unregisters an authentication provider
     * @param {string} providerType 
     */
    unregisterProvider(providerType) {
        if (this.#providers.has(providerType)) {
            this.#providers.delete(providerType);
            this.#logger.info(`Unregistered authentication provider: ${providerType}`);
        }
    }

    /**
     * Sets the active authentication provider
     * @param {string} providerType 
     */
    setActiveProvider(providerType) {
        if (this.#providers.has(providerType)) {
            this.#activeProvider = providerType;
            this.#logger.info(`Set active provider to: ${providerType}`);
        } else {
            throw new Error(`Provider not found: ${providerType}`);
        }
    }

    /**
     * Gets the active authentication provider
     * @returns {IAuthProvider|undefined}
     */
    getActiveProvider() {
        if (this.#activeProvider) {
            return this.#providers.get(this.#activeProvider);
        }
        return undefined;
    }

    /**
     * Authenticates user credentials
     * @param {string} providerType 
     * @param {AuthCredentials} credentials 
     * @returns {Promise<AuthResult<AuthSession>>}
     */
    async authenticate(providerType, credentials) {
        const startTime = Date.now();

        try {
            const provider = this.#providers.get(providerType);
            if (!provider) {
                throw new Error(`Provider not found: ${providerType}`);
            }

            // Validate credentials
            const validationResult = await this.#validateCredentials(credentials);
            if (!validationResult.success) {
                return validationResult;
            }

            // Perform authentication
            const result = await provider.authenticate(credentials);

            // Log authentication attempt
            this.#metrics.incrementAuthenticationAttempt(providerType, result.success);
            this.#logger.info(`Authentication attempt for provider: ${providerType}`, {
                success: result.success,
                duration: Date.now() - startTime
            });

            // Apply security measures
            if (result.success && result.data) {
                await this.#security.applySecurityMeasures(result.data);
            }

            return result;
        } catch (error) {
            this.#logger.error(`Authentication error for provider: ${providerType}`, error);
            this.#metrics.incrementAuthenticationAttempt(providerType, false);

            return {
                success: false,
                error: {
                    type: 'INTERNAL_ERROR',
                    message: 'Authentication failed',
                    details: error.message
                }
            };
        }
    }

    /**
     * Validates user credentials
     * @param {AuthCredentials} credentials 
     * @returns {Promise<AuthResult<boolean>>}
     * @private
     */
    async #validateCredentials(credentials) {
        try {
            // Basic validation
            if (!credentials || (!credentials.email && !credentials.token)) {
                return {
                    success: false,
                    error: {
                        type: 'VALIDATION_ERROR',
                        message: 'Invalid credentials provided'
                    }
                };
            }

            // Email validation
            if (credentials.email && !this.#isValidEmail(credentials.email)) {
                return {
                    success: false,
                    error: {
                        type: 'VALIDATION_ERROR',
                        message: 'Invalid email format'
                    }
                };
            }

            // Password validation
            if (credentials.password && !this.#isValidPassword(credentials.password)) {
                return {
                    success: false,
                    error: {
                        type: 'VALIDATION_ERROR',
                        message: 'Invalid password format'
                    }
                };
            }

            return { success: true, data: true };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'VALIDATION_ERROR',
                    message: 'Credential validation failed',
                    details: error.message
                }
            };
        }
    }

    /**
     * Validates email format
     * @param {string} email 
     * @returns {boolean}
     * @private
     */
    #isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validates password format
     * @param {string} password 
     * @returns {boolean}
     * @private
     */
    #isValidPassword(password) {
        const minLength = this.#config.get('passwordMinLength') || 8;
        return password && password.length >= minLength;
    }

    /**
     * Registers a plugin
     * @param {string} name 
     * @param {IAuthPlugin} plugin 
     */
    registerPlugin(name, plugin) {
        this.#plugins.set(name, plugin);
        this.#logger.info(`Registered authentication plugin: ${name}`);
    }

    /**
     * Unregisters a plugin
     * @param {string} name 
     */
    unregisterPlugin(name) {
        if (this.#plugins.has(name)) {
            this.#plugins.delete(name);
            this.#logger.info(`Unregistered authentication plugin: ${name}`);
        }
    }

    /**
     * Gets authentication metrics
     * @returns {Record<string, any>}
     */
    getMetrics() {
        return this.#metrics.getMetrics();
    }

    /**
     * Gets service configuration
     * @returns {IAuthConfig}
     */
    getConfig() {
        return this.#config;
    }

    /**
     * Gets registered providers
     * @returns {IAuthProvider[]}
     */
    getProviders() {
        return Array.from(this.#providers.values());
    }

    /**
     * Gets registered plugins
     * @returns {Map<string, IAuthPlugin>}
     */
    getPlugins() {
        return new Map(this.#plugins);
    }
}
