/**
 * Authentication Provider Utilities
 *
 * Provides common utility functions for authentication providers
 * to reduce code duplication and maintain consistency.
 */

import type { AuthResult, AuthSession } from '../types/auth.domain.types';
import { AuthProviderType } from '../types/auth.domain.types';

/**
 * Creates a mock user object for testing purposes
 */
export function createMockUser(overrides: Partial<any> = {}): any {
    return {
        id: 'mock-user-id',
        email: 'user@example.com',
        username: 'user',
        roles: ['user'],
        permissions: ['read'],
        profile: {
            firstName: 'Mock',
            lastName: 'User'
        },
        security: {
            lastLogin: new Date(),
            loginAttempts: 0,
            mfaEnabled: false
        },
        ...overrides
    };
}

/**
 * Creates a mock token object for testing purposes
 */
export function createMockToken(overrides: Partial<any> = {}): any {
    return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000),
        tokenType: 'Bearer',
        ...overrides
    };
}

/**
 * Creates a mock session object for testing purposes
 */
export function createMockSession(provider: AuthProviderType, overrides: Partial<any> = {}): AuthSession {
    return {
        user: createMockUser(),
        token: createMockToken(),
        provider,
        createdAt: new Date(),
        expiresAt: new Date(),
        isActive: true,
        ...overrides
    };
}

/**
 * Creates a successful authentication result
 */
export function createSuccessResult(session: AuthSession): AuthResult<AuthSession> {
    return {
        success: true,
        data: session
    };
}

/**
 * Creates a failed authentication result
 */
export function createFailureResult(errorType: string, message: string, code?: string): AuthResult<AuthSession> {
    return {
        success: false,
        error: {
            type: errorType as any,
            message,
            code: code || 'AUTH_FAILED'
        }
    };
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitizes user input for security
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/['"]/g, ''); // Remove quotes
}

/**
 * Generates a random session ID
 */
export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if a token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
    return new Date() >= expiresAt;
}

/**
 * Gets time until token expiration in milliseconds
 */
export function getTokenTimeToExpiry(expiresAt: Date): number {
    return expiresAt.getTime() - Date.now();
}

/**
 * Formats error message for logging
 */
export function formatErrorForLogging(error: unknown): string {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    return `Unknown error: ${String(error)}`;
}

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
