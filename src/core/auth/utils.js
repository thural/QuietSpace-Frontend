/**
 * Authentication System Utilities
 * 
 * Utility functions for the authentication system.
 */

import { AuthErrorType } from './types/auth.domain.types.js';

/**
 * Authentication result interface
 * @typedef {Object} AuthResult
 * @property {boolean} success - Success flag
 * @property {*} [data] - Result data
 * @property {Object} [error] - Error information
 * @property {string} [error.type] - Error type
 * @property {string} [error.message] - Error message
 * @property {string} [error.code] - Error code
 */

/**
 * Authentication user interface
 * @typedef {Object} AuthUser
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} [username] - Username
 * @property {string[]} [roles] - User roles
 * @property {string[]} [permissions] - User permissions
 * @property {*} [profile] - User profile
 * @property {*} [metadata] - User metadata
 */

/**
 * Authentication token interface
 * @typedef {Object} AuthToken
 * @property {string} accessToken - Access token
 * @property {string} refreshToken - Refresh token
 * @property {Date} expiresAt - Expiration date
 * @property {string} [tokenType] - Token type
 * @property {*} [metadata] - Token metadata
 */

/**
 * Authentication session interface
 * @typedef {Object} AuthSession
 * @property {AuthUser} user - User information
 * @property {AuthToken} token - Token information
 * @property {string} provider - Provider type
 * @property {Date} createdAt - Creation date
 * @property {Date} [expiresAt] - Expiration date
 * @property {boolean} isActive - Active status
 * @property {*} [metadata] - Session metadata
 */

/**
 * Validates authentication configuration
 * 
 * @param {Object} config - Configuration to validate
 * @returns {string[]} Array of validation errors
 */
export function validateAuthConfig(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate required fields
    if (!config.provider) {
        errors.push('Provider is required');
    }

    if (typeof config.tokenRefreshInterval !== 'number' || config.tokenRefreshInterval <= 0) {
        errors.push('Token refresh interval must be a positive number');
    }

    if (typeof config.sessionTimeout !== 'number' || config.sessionTimeout <= 0) {
        errors.push('Session timeout must be a positive number');
    }

    return errors;
}

/**
 * Sanitizes authentication data
 * 
 * @param {*} data - Data to sanitize
 * @returns {*} Sanitized data
 */
export function sanitizeAuthData(data) {
    if (!data || typeof data !== 'object') {
        return {};
    }

    const sanitized = {};

    // Only allow known safe fields
    const allowedFields = ['email', 'username', 'password', 'firstName', 'lastName', 'phone'];

    for (const field of allowedFields) {
        if (data[field] && typeof data[field] === 'string') {
            sanitized[field] = data[field].trim();
        }
    }

    return sanitized;
}

/**
 * Extracts error information from authentication result
 * 
 * @param {AuthResult} result - Authentication result
 * @returns {{type: string, message: string, code?: string}|null} Error information or null
 */
export function extractAuthError(result) {
    if (!result.error) {
        return null;
    }

    return {
        type: result.error.type || AuthErrorType.UNKNOWN_ERROR,
        message: result.error.message || 'Unknown error occurred',
        code: result.error.code
    };
}

/**
 * Formats authentication result for display
 * 
 * @param {AuthResult} result - Authentication result
 * @returns {{success: boolean, message: string, data?: *}} Formatted result
 */
export function formatAuthResult(result) {
    if (result.success) {
        return {
            success: true,
            message: 'Operation successful',
            data: result.data
        };
    }

    const error = extractAuthError(result);
    return {
        success: false,
        message: error?.message || 'Unknown error occurred',
        data: undefined
    };
}

/**
 * Type guard for authentication result
 * 
 * @param {*} result - Result to check
 * @returns {boolean} True if result is a valid AuthResult
 */
export function isAuthResult(result) {
    return result && typeof result === 'object' && typeof result.success === 'boolean';
}

/**
 * Type guard for authentication error
 * 
 * @param {*} error - Error to check
 * @returns {boolean} True if error is a valid AuthError
 */
export function isAuthError(error) {
    return error && typeof error === 'object' && typeof error.type === 'string' && typeof error.message === 'string';
}

/**
 * Type guard for authentication token
 * 
 * @param {*} token - Token to check
 * @returns {boolean} True if token is a valid AuthToken
 */
export function isAuthToken(token) {
    return token &&
        typeof token === 'object' &&
        typeof token.accessToken === 'string' &&
        typeof token.refreshToken === 'string' &&
        token.expiresAt instanceof Date;
}

/**
 * Type guard for authentication session
 * 
 * @param {*} session - Session to check
 * @returns {boolean} True if session is a valid AuthSession
 */
export function isAuthSession(session) {
    return session &&
        typeof session === 'object' &&
        isAuthUser(session.user) &&
        isAuthToken(session.token) &&
        session.isActive === true;
}

/**
 * Type guard for authentication user
 * 
 * @param {*} user - User to check
 * @returns {boolean} True if user is a valid AuthUser
 */
export function isAuthUser(user) {
    return user &&
        typeof user === 'object' &&
        typeof user.id === 'string' &&
        typeof user.email === 'string';
}

/**
 * Checks if a token is expired
 * 
 * @param {AuthToken} token - Token to check
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(token) {
    return new Date() > token.expiresAt;
}

/**
 * Checks if a session is expired
 * 
 * @param {AuthSession} session - Session to check
 * @returns {boolean} True if session is expired
 */
export function isSessionExpired(session) {
    return session.expiresAt ? new Date() > session.expiresAt : false;
}

/**
 * Gets time until token expiry
 * 
 * @param {AuthToken} token - Token to check
 * @returns {number} Time until expiry in milliseconds
 */
export function getTokenTimeToExpiry(token) {
    return token.expiresAt.getTime() - Date.now();
}

/**
 * Gets time until session expiry
 * 
 * @param {AuthSession} session - Session to check
 * @returns {number} Time until expiry in milliseconds
 */
export function getSessionTimeToExpiry(session) {
    return session.expiresAt ? session.expiresAt.getTime() - Date.now() : 0;
}

/**
 * Formats token for display
 * 
 * @param {AuthToken} token - Token to format
 * @returns {string} Formatted token string
 */
export function formatToken(token) {
    return `${token.accessToken.substring(0, 10)}...${token.accessToken.substring(token.accessToken.length - 10)}`;
}

/**
 * Creates a mock authentication result
 * 
 * @param {boolean} success - Whether the result should be successful
 * @param {*} [data] - Optional data to include
 * @param {Object} [error] - Optional error to include
 * @returns {AuthResult} Mock authentication result
 */
export function createMockAuthResult(success, data, error) {
    if (success) {
        return { success: true, data };
    } else {
        return {
            success: false,
            error: error || { type: AuthErrorType.UNKNOWN_ERROR, message: 'Mock error' }
        };
    }
}

/**
 * Creates a mock authentication user
 * 
 * @param {Partial<AuthUser>} [overrides] - Optional user overrides
 * @returns {AuthUser} Mock authentication user
 */
export function createMockAuthUser(overrides) {
    return {
        id: 'mock-user-id',
        email: 'mock@example.com',
        username: 'mockuser',
        roles: ['user'],
        permissions: ['read'],
        ...overrides
    };
}

/**
 * Creates a mock authentication token
 * 
 * @param {Partial<AuthToken>} [overrides] - Optional token overrides
 * @returns {AuthToken} Mock authentication token
 */
export function createMockAuthToken(overrides) {
    return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
        tokenType: 'Bearer',
        ...overrides
    };
}

/**
 * Creates a mock authentication session
 * 
 * @param {Partial<AuthSession>} [overrides] - Optional session overrides
 * @returns {AuthSession} Mock authentication session
 */
export function createMockAuthSession(overrides) {
    return {
        user: createMockAuthUser(),
        token: createMockAuthToken(),
        provider: 'jwt',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        isActive: true,
        ...overrides
    };
}
