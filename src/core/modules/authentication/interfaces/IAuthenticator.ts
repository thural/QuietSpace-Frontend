/**
 * Authentication Provider Interface
 *
 * Defines contract for core authentication operations only.
 * This interface focuses solely on authentication-related responsibilities
 * following the Interface Segregation Principle.
 */

import type { AuthCredentials, AuthResult, AuthSession, AuthProviderType } from '../types/auth.domain.types';

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
     * @returns Promise when initialization is complete
     */
    initialize?(): Promise<void>;
}
