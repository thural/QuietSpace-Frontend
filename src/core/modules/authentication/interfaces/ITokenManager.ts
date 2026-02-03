/**
 * Token Management Interface
 *
 * Defines contract for token-specific operations.
 * This interface focuses solely on token-related responsibilities
 * following the Interface Segregation Principle.
 */

import type { AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * Token information structure
 */
export interface TokenInfo {
    /** Token subject (user ID) */
    subject: string;
    
    /** Token issuer */
    issuer: string;
    
    /** Token audience */
    audience: string[];
    
    /** Token expiration time */
    expiration: Date;
    
    /** Token issued at time */
    issuedAt: Date;
    
    /** Token scopes/permissions */
    scopes: string[];
    
    /** Additional token claims */
    claims: Record<string, unknown>;
}

/**
 * Token management provider interface
 *
 * Provides token-specific operations including validation,
 * refresh, and information extraction without authentication concerns.
 */
export interface ITokenManager {
    /** Provider name for identification */
    readonly name: string;
    
    /** Provider type for categorization */
    readonly type: string;
    
    /** Provider configuration settings */
    readonly config: Record<string, unknown>;

    /**
     * Validates token format and signature
     * 
     * @param token - JWT or other token format
     * @returns Validation result with token validity
     */
    validateToken(token: string): AuthResult<boolean>;

    /**
     * Refreshes authentication token
     * 
     * @param refreshToken - Refresh token
     * @returns New session with refreshed tokens
     */
    refreshToken(refreshToken?: string): Promise<AuthResult<AuthSession>>;

    /**
     * Extracts token information without validation
     * 
     * @param token - JWT or other token format
     * @returns Token information or error
     */
    getTokenInfo(token: string): AuthResult<TokenInfo>;

    /**
     * Checks if token is expired
     * 
     * @param token - JWT or other token format
     * @returns True if token is expired
     */
    isTokenExpired(token: string): boolean;

    /**
     * Gets token remaining time in seconds
     * 
     * @param token - JWT or other token format
     * @returns Remaining time in seconds or -1 if invalid
     */
    getTokenTimeToExpiry(token: string): number;

    /**
     * Configures token manager with settings
     * 
     * @param config - Configuration settings
     */
    configure(config: Record<string, unknown>): void;

    /**
     * Gets token management capabilities
     * 
     * @returns Array of capability identifiers
     */
    getCapabilities(): string[];

    /**
     * Initializes token manager (optional)
     * 
     * @returns Promise when initialization is complete
     */
    initialize?(): Promise<void>;
}
