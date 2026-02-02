/**
 * Authentication System Utilities
 *
 * Utility functions for the authentication system.
 */

import { AuthErrorType } from './types/auth.domain.types';

import type { AuthResult, AuthUser, AuthCredentials, AuthToken, AuthSession } from './types/auth.domain.types';

/**
 * Validates authentication configuration
 *
 * @param config - Configuration to validate
 * @returns Array of validation errors
 */
export function validateAuthConfig(config: unknown): string[] {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate required fields
    const typedConfig = config as Record<string, unknown>;
    if (!typedConfig.provider) {
        errors.push('Provider is required');
    }

    if (typeof typedConfig.tokenRefreshInterval !== 'number' || typedConfig.tokenRefreshInterval <= 0) {
        errors.push('Token refresh interval must be a positive number');
    }

    if (typeof typedConfig.sessionTimeout !== 'number' || typedConfig.sessionTimeout <= 0) {
        errors.push('Session timeout must be a positive number');
    }

    return errors;
}

/**
 * Sanitizes authentication data
 *
 * @param data - Data to sanitize
 * @returns Sanitized data
 */
export function sanitizeAuthData(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
        return {};
    }

    const sanitized: Record<string, unknown> = {};

    // Only allow known safe fields
    const allowedFields = ['email', 'username', 'password', 'firstName', 'lastName', 'phone'];

    const typedData = data as Record<string, unknown>;
    for (const field of allowedFields) {
        if (typedData[field] && typeof typedData[field] === 'string') {
            sanitized[field] = (typedData[field] as string).trim();
        }
    }

    return sanitized;
}

/**
 * Extracts error information from authentication result
 *
 * @param result - Authentication result
 * @returns Error information or null
 */
export function extractAuthError(result: AuthResult<unknown>): { type: AuthErrorType; message: string; code?: string } | null {
    if (!result.error) {
        return null;
    }

    return {
        type: result.error.type || AuthErrorType.UNKNOWN_ERROR,
        message: result.error.message || 'Unknown error occurred',
        code: result.error.code || undefined
    };
}

/**
 * Formats authentication result for display
 *
 * @param result - Authentication result
 * @returns Formatted result
 */
export function formatAuthResult(result: AuthResult<unknown>): { success: boolean; message: string; data?: unknown } {
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
 * @param result - Result to check
 * @returns True if result is a valid AuthResult
 */
export function isAuthResult(result: unknown): result is AuthResult<unknown> {
    return Boolean(result && typeof result === 'object' && (result as { success?: unknown }).success === true);
}

/**
 * Type guard for authentication error
 *
 * @param error - Error to check
 * @returns True if error is a valid AuthError
 */
export function isAuthError(error: unknown): error is { type: AuthErrorType; message: string; code?: string } {
    return Boolean(
        error && typeof error === 'object' &&
        typeof (error as { type?: unknown }).type === 'string' &&
        typeof (error as { message?: unknown }).message === 'string'
    );
}

/**
 * Type guard for authentication token
 *
 * @param token - Token to check
 * @returns True if token is a valid AuthToken
 */
export function isAuthToken(token: unknown): token is AuthToken {
    return Boolean(
        token && typeof token === 'object' &&
        typeof (token as { accessToken?: unknown }).accessToken === 'string' &&
        typeof (token as { refreshToken?: unknown }).refreshToken === 'string' &&
        (token as { expiresAt?: unknown }).expiresAt instanceof Date
    );
}

/**
 * Type guard for authentication session
 *
 * @param session - Session to check
 * @returns True if session is a valid AuthSession
 */
export function isAuthSession(session: unknown): session is AuthSession {
    return Boolean(
        session && typeof session === 'object' &&
        isAuthUser((session as { user?: unknown }).user) &&
        isAuthToken((session as { token?: unknown }).token) &&
        (session as { isActive?: unknown }).isActive === true
    );
}

/**
 * Type guard for authentication user
 *
 * @param user - User to check
 * @returns True if user is a valid AuthUser
 */
export function isAuthUser(user: unknown): user is AuthUser {
    return Boolean(
        user && typeof user === 'object' &&
        typeof (user as { id?: unknown }).id === 'string' &&
        typeof (user as { email?: unknown }).email === 'string'
    );
}

/**
 * Checks if a token is expired
 *
 * @param token - Token to check
 * @returns True if token is expired
 */
export function isTokenExpired(token: AuthToken): boolean {
    return new Date() > token.expiresAt;
}

/**
 * Checks if a session is expired
 *
 * @param session - Session to check
 * @returns True if session is expired
 */
export function isSessionExpired(session: AuthSession): boolean {
    return session.expiresAt ? new Date() > session.expiresAt : false;
}

/**
 * Gets time until token expiry
 *
 * @param token - Token to check
 * @returns Time until expiry in milliseconds
 */
export function getTokenTimeToExpiry(token: AuthToken): number {
    return token.expiresAt.getTime() - Date.now();
}

/**
 * Gets time until session expiry
 *
 * @param session - Session to check
 * @returns Time until expiry in milliseconds
 */
export function getSessionTimeToExpiry(session: AuthSession): number {
    return session.expiresAt ? session.expiresAt.getTime() - Date.now() : 0;
}

/**
 * Formats token for display
 *
 * @param token - Token to format
 * @returns Formatted token string
 */
export function formatToken(token: AuthToken): string {
    return `${token.accessToken.substring(0, 10)}...${token.accessToken.substring(token.accessToken.length - 10)}`;
}

/**
 * Creates a mock authentication result
 *
 * @param success - Whether the result should be successful
 * @param data - Optional data to include
 * @param error - Optional error to include
 * @returns Mock authentication result
 */
export function createMockAuthResult<T>(
    success: boolean,
    data?: T,
    error?: { type: AuthErrorType; message: string; code?: string }
): AuthResult<T> {
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
 * @param overrides - Optional user overrides
 * @returns Mock authentication user
 */
export function createMockAuthUser(overrides?: Partial<AuthUser>): AuthUser {
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
 * @param overrides - Optional token overrides
 * @returns Mock authentication token
 */
export function createMockAuthToken(overrides?: Partial<AuthToken>): AuthToken {
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
 * @param overrides - Optional session overrides
 * @returns Mock authentication session
 */
export function createMockAuthSession(overrides?: Partial<AuthSession>): AuthSession {
    return {
        user: createMockAuthUser(),
        token: createMockAuthToken(),
        provider: 'jwt' as const,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        isActive: true,
        ...overrides
    };
}
