/**
 * Enterprise authentication types and interfaces
 * 
 * Provides comprehensive type definitions for authentication
 * with proper separation of concerns and enterprise features.
 */

/**
 * Authentication provider types
 * 
 * @readonly
 * @enum {string}
 */
export const AuthProviderType = Object.freeze({
    JWT: 'jwt',
    OAUTH: 'oauth',
    SAML: 'saml',
    LDAP: 'ldap',
    API_KEY: 'api_key',
    SESSION: 'session'
});

/**
 * Authentication event types
 * 
 * @readonly
 * @enum {string}
 */
export const AuthEventType = Object.freeze({
    LOGIN_ATTEMPT: 'login_attempt',
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILURE: 'login_failure',
    REGISTER_ATTEMPT: 'register_attempt',
    REGISTER_SUCCESS: 'register_success',
    REGISTER_FAILURE: 'register_failure',
    ACTIVATE_ATTEMPT: 'activate_attempt',
    ACTIVATE_SUCCESS: 'activate_success',
    ACTIVATE_FAILURE: 'activate_failure',
    LOGOUT_ATTEMPT: 'logout_attempt',
    LOGOUT_SUCCESS: 'logout_success',
    LOGOUT_FAILURE: 'logout_failure',
    TOKEN_REFRESH: 'token_refresh',
    TOKEN_REFRESH_SUCCESS: 'token_refresh_success',
    TOKEN_REFRESH_FAILURE: 'token_refresh_failure'
});

/**
 * Authentication error types
 * 
 * @readonly
 * @enum {string}
 */
export const AuthErrorType = Object.freeze({
    VALIDATION_ERROR: 'validation_error',
    NETWORK_ERROR: 'network_error',
    SERVER_ERROR: 'server_error',
    TOKEN_EXPIRED: 'token_expired',
    TOKEN_INVALID: 'token_invalid',
    CREDENTIALS_INVALID: 'credentials_invalid',
    ACCOUNT_LOCKED: 'account_locked',
    RATE_LIMITED: 'rate_limited',
    UNKNOWN_ERROR: 'unknown_error'
});

/**
 * Authentication status types
 * 
 * @readonly
 * @enum {string}
 */
export const AuthStatus = Object.freeze({
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
});

/**
 * Authentication event interface
 * 
 * @interface AuthEvent
 * @description Represents an authentication event with metadata
 */
export class AuthEvent {
    /**
     * Event type
     * 
     * @type {string}
     */
    type;

    /**
     * Event timestamp
     * 
     * @type {Date}
     */
    timestamp;

    /**
     * User identifier
     * 
     * @type {string|undefined}
     */
    userId;

    /**
     * Provider type
     * 
     * @type {string|undefined}
     */
    providerType;

    /**
     * Event details
     * 
     * @type {Record<string, any>|undefined}
     */
    details;

    /**
     * Error type
     * 
     * @type {string|undefined}
     */
    error;

    /**
     * Event metadata
     * 
     * @type {Object|undefined}
     * @property {string} [ipAddress] - Client IP address
     * @property {string} [userAgent] - Client user agent
     * @property {string} [sessionId] - Session identifier
     * @property {string} [requestId] - Request identifier
     */
    metadata;

    /**
     * Creates a new authentication event
     * 
     * @constructor
     * @param {Object} event - Event data
     * @param {string} event.type - Event type
     * @param {Date} [event.timestamp] - Event timestamp (defaults to now)
     * @param {string} [event.userId] - User identifier
     * @param {string} [event.providerType] - Provider type
     * @param {Record<string, any>} [event.details] - Event details
     * @param {string} [event.error] - Error type
     * @param {Object} [event.metadata] - Event metadata
     * @description Creates a new authentication event instance
     */
    constructor({ type, timestamp = new Date(), userId, providerType, details, error, metadata }) {
        this.type = type;
        this.timestamp = timestamp;
        this.userId = userId;
        this.providerType = providerType;
        this.details = details;
        this.error = error;
        this.metadata = metadata;
    }
}

/**
 * Authentication result type
 * 
 * @typedef {Object} AuthResult
 * @property {boolean} success - Whether operation was successful
 * @property {any|null} [data] - Result data
 * @property {Object|null} [error] - Error information
 * @property {string} error.type - Error type
 * @property {string} error.message - Error message
 * @property {string} [error.code] - Error code
 * @property {Record<string, any>} [error.details] - Additional error details
 * @property {Object|null} [metadata] - Result metadata
 * @property {Date} metadata.timestamp - Result timestamp
 * @property {number} metadata.duration - Operation duration in milliseconds
 * @property {string} metadata.requestId - Request identifier
 */

/**
 * Creates an authentication result
 * 
 * @function createAuthResult
 * @param {boolean} success - Whether operation was successful
 * @param {any|null} [data] - Result data
 * @param {Object|null} [error] - Error information
 * @param {Object} [metadata] - Result metadata
 * @returns {AuthResult} Authentication result
 * @description Creates a standardized authentication result
 */
export function createAuthResult(success, data = undefined, error = undefined, metadata = undefined) {
    return /** @type {AuthResult} */ ({
        success,
        data,
        error,
        metadata: metadata || {
            timestamp: new Date(),
            duration: 0,
            requestId: generateRequestId()
        }
    });
}

/**
 * Authentication credentials interface
 * 
 * @interface AuthCredentials
 * @description Represents user authentication credentials
 */
export class AuthCredentials {
    /**
     * User email
     * 
     * @type {string|undefined}
     */
    email;

    /**
     * User password
     * 
     * @type {string|undefined}
     */
    password;

    /**
     * Username
     * 
     * @type {string|undefined}
     */
    username;

    /**
     * Authentication token
     * 
     * @type {string|undefined}
     */
    token;

    /**
     * API key
     * 
     * @type {string|undefined}
     */
    apiKey;

    /**
     * Creates new authentication credentials
     * 
     * @constructor
     * @param {Object} credentials - Credentials data
     * @param {string} [credentials.email] - User email
     * @param {string} [credentials.password] - User password
     * @param {string} [credentials.username] - Username
     * @param {string} [credentials.token] - Authentication token
     * @param {string} [credentials.apiKey] - API key
     * @description Creates new authentication credentials instance
     */
    constructor({ email, password, username, token, apiKey } = {}) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.token = token;
        this.apiKey = apiKey;
    }
}

/**
 * Authentication token interface
 * 
 * @interface AuthToken
 * @description Represents an authentication token
 */
export class AuthToken {
    /**
     * Access token
     * 
     * @type {string}
     */
    accessToken;

    /**
     * Refresh token
     * 
     * @type {string}
     */
    refreshToken;

    /**
     * Token expiration date
     * 
     * @type {Date}
     */
    expiresAt;

    /**
     * Token type
     * 
     * @type {string}
     */
    tokenType;

    /**
     * Token scope
     * 
     * @type {string[]|undefined}
     */
    scope;

    /**
     * Token metadata
     * 
     * @type {Object|undefined}
     * @property {string} issuer - Token issuer
     * @property {string} audience - Token audience
     * @property {Date} issuedAt - Token issue date
     */
    metadata;

    /**
     * Creates a new authentication token
     * 
     * @constructor
     * @param {Object} token - Token data
     * @param {string} token.accessToken - Access token
     * @param {string} token.refreshToken - Refresh token
     * @param {Date} token.expiresAt - Token expiration date
     * @param {string} token.tokenType - Token type
     * @param {string[]} [token.scope] - Token scope
     * @param {Object} [token.metadata] - Token metadata
     * @description Creates a new authentication token instance
     */
    constructor({ accessToken, refreshToken, expiresAt, tokenType, scope, metadata }) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.tokenType = tokenType;
        this.scope = scope;
        this.metadata = metadata;
    }
}

/**
 * Authentication user interface
 * 
 * @interface AuthUser
 * @description Represents an authenticated user
 */
export class AuthUser {
    /**
     * User identifier
     * 
     * @type {string}
     */
    id;

    /**
     * User email
     * 
     * @type {string}
     */
    email;

    /**
     * Username
     * 
     * @type {string|undefined}
     */
    username;

    /**
     * User roles
     * 
     * @type {string[]}
     */
    roles;

    /**
     * User permissions
     * 
     * @type {string[]}
     */
    permissions;

    /**
     * User profile information
     * 
     * @type {Object|undefined}
     * @property {string} [firstName] - First name
     * @property {string} [lastName] - Last name
     * @property {string} [avatar] - Avatar URL
     * @property {string} [bio] - User biography
     */
    profile;

    /**
     * User security information
     * 
     * @type {Object|undefined}
     * @property {Date} [lastLogin] - Last login timestamp
     * @property {number} loginAttempts - Number of login attempts
     * @property {Date} [lockedUntil] - Account locked until date
     * @property {boolean} [mfaEnabled] - MFA enabled status
     */
    security;

    /**
     * Creates a new authentication user
     * 
     * @constructor
     * @param {Object} user - User data
     * @param {string} user.id - User identifier
     * @param {string} user.email - User email
     * @param {string} [user.username] - Username
     * @param {string[]} [user.roles] - User roles
     * @param {string[]} [user.permissions] - User permissions
     * @param {Object} [user.profile] - User profile
     * @param {Object} [user.security] - User security information
     * @description Creates a new authentication user instance
     */
    constructor({ id, email, username, roles = [], permissions = [], profile, security }) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles;
        this.permissions = permissions;
        this.profile = profile;
        this.security = security;
    }
}

/**
 * Authentication session interface
 * 
 * @interface AuthSession
 * @description Represents an authenticated user session
 */
export class AuthSession {
    /**
     * Session user
     * 
     * @type {AuthUser}
     */
    user;

    /**
     * Session token
     * 
     * @type {AuthToken}
     */
    token;

    /**
     * Authentication provider
     * 
     * @type {string}
     */
    provider;

    /**
     * Session creation date
     * 
     * @type {Date}
     */
    createdAt;

    /**
     * Session expiration date
     * 
     * @type {Date}
     */
    expiresAt;

    /**
     * Session active status
     * 
     * @type {boolean}
     */
    isActive;

    /**
     * Session metadata
     * 
     * @type {Object|undefined}
     * @property {string} ipAddress - Client IP address
     * @property {string} userAgent - Client user agent
     * @property {string} [deviceId] - Device identifier
     * @property {Object} [location] - Location information
     * @property {string} [location.country] - Country
     * @property {string} [location.city] - City
     */
    metadata;

    /**
     * Creates a new authentication session
     * 
     * @constructor
     * @param {Object} session - Session data
     * @param {AuthUser} session.user - Session user
     * @param {AuthToken} session.token - Session token
     * @param {string} session.provider - Authentication provider
     * @param {Date} session.createdAt - Session creation date
     * @param {Date} session.expiresAt - Session expiration date
     * @param {boolean} session.isActive - Session active status
     * @param {Object} [session.metadata] - Session metadata
     * @description Creates a new authentication session instance
     */
    constructor({ user, token, provider, createdAt, expiresAt, isActive, metadata }) {
        this.user = user;
        this.token = token;
        this.provider = provider;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
        this.metadata = metadata;
    }
}

/**
 * Authentication configuration interface
 * 
 * @interface AuthConfig
 * @description Represents authentication system configuration
 */
export class AuthConfig {
    /**
     * Authentication provider
     * 
     * @type {string}
     */
    provider;

    /**
     * Token refresh interval in milliseconds
     * 
     * @type {number}
     */
    tokenRefreshInterval;

    /**
     * Session timeout in milliseconds
     * 
     * @type {number}
     */
    sessionTimeout;

    /**
     * Maximum login attempts
     * 
     * @type {number}
     */
    maxLoginAttempts;

    /**
     * Lockout duration in milliseconds
     * 
     * @type {number}
     */
    lockoutDuration;

    /**
     * MFA required flag
     * 
     * @type {boolean}
     */
    mfaRequired;

    /**
     * Encryption enabled flag
     * 
     * @type {boolean}
     */
    encryptionEnabled;

    /**
     * Audit enabled flag
     * 
     * @type {boolean}
     */
    auditEnabled;

    /**
     * Rate limiting configuration
     * 
     * @type {Object}
     * @property {boolean} enabled - Rate limiting enabled
     * @property {number} maxAttempts - Maximum attempts
     * @property {number} windowMs - Time window in milliseconds
     */
    rateLimiting;

    /**
     * Creates new authentication configuration
     * 
     * @constructor
     * @param {Object} config - Configuration data
     * @param {string} config.provider - Authentication provider
     * @param {number} config.tokenRefreshInterval - Token refresh interval
     * @param {number} config.sessionTimeout - Session timeout
     * @param {number} config.maxLoginAttempts - Maximum login attempts
     * @param {number} config.lockoutDuration - Lockout duration
     * @param {boolean} config.mfaRequired - MFA required
     * @param {boolean} config.encryptionEnabled - Encryption enabled
     * @param {boolean} config.auditEnabled - Audit enabled
     * @param {Object} config.rateLimiting - Rate limiting configuration
     * @description Creates new authentication configuration instance
     */
    constructor({ provider, tokenRefreshInterval, sessionTimeout, maxLoginAttempts, lockoutDuration, mfaRequired, encryptionEnabled, auditEnabled, rateLimiting }) {
        this.provider = provider;
        this.tokenRefreshInterval = tokenRefreshInterval;
        this.sessionTimeout = sessionTimeout;
        this.maxLoginAttempts = maxLoginAttempts;
        this.lockoutDuration = lockoutDuration;
        this.mfaRequired = mfaRequired;
        this.encryptionEnabled = encryptionEnabled;
        this.auditEnabled = auditEnabled;
        this.rateLimiting = rateLimiting;
    }
}

/**
 * Generates a unique request ID
 * 
 * @function generateRequestId
 * @returns {string} Unique request identifier
 * @description Generates a unique request ID for tracking
 */
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates if a value is a valid AuthProviderType
 * 
 * @function isValidAuthProviderType
 * @param {string} type - Type to validate
 * @returns {boolean} Whether type is valid
 * @description Validates if a value is a valid AuthProviderType
 */
export function isValidAuthProviderType(type) {
    const normalizedType = type.toLowerCase();
    return /** @type {string[]} */ (Object.values(AuthProviderType)).includes(normalizedType);
}

/**
 * Validates if a value is a valid AuthEventType
 * 
 * @function isValidAuthEventType
 * @param {string} type - Type to validate
 * @returns {boolean} Whether type is valid
 * @description Validates if a value is a valid AuthEventType
 */
export function isValidAuthEventType(type) {
    const normalizedType = type.toLowerCase();
    return /** @type {string[]} */ (Object.values(AuthEventType)).includes(normalizedType);
}

/**
 * Validates if a value is a valid AuthErrorType
 * 
 * @function isValidAuthErrorType
 * @param {string} type - Type to validate
 * @returns {boolean} Whether type is valid
 * @description Validates if a value is a valid AuthErrorType
 */
export function isValidAuthErrorType(type) {
    const normalizedType = type.toLowerCase();
    return /** @type {string[]} */ (Object.values(AuthErrorType)).includes(normalizedType);
}

/**
 * Creates a successful authentication result
 * 
 * @function createSuccessResult
 * @param {any} data - Result data
 * @param {Object} [metadata] - Result metadata
 * @returns {AuthResult} Successful authentication result
 * @description Creates a successful authentication result
 */
export function createSuccessResult(data, metadata = undefined) {
    return createAuthResult(true, data, undefined, metadata);
}

/**
 * Creates a failed authentication result
 * 
 * @function createErrorResult
 * @param {string} errorType - Error type
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {Record<string, any>} [details] - Error details
 * @param {Object} [metadata] - Result metadata
 * @returns {AuthResult} Failed authentication result
 * @description Creates a failed authentication result
 */
export function createErrorResult(errorType, message, code = undefined, details = undefined, metadata = undefined) {
    const error = {
        type: errorType,
        message,
        code,
        details
    };
    return createAuthResult(false, null, error, metadata);
}
