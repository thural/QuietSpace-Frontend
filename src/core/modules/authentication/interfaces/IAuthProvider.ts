/**
 * Authentication Provider Interface (Composite)
 *
 * Defines contract for complete authentication provider operations.
 * This composite interface maintains backward compatibility while
 * promoting the use of segregated interfaces for new implementations.
 * 
 * @deprecated Prefer using IAuthenticator, IUserManager, or ITokenManager
 *             for specific operations. This interface is maintained for
 *             backward compatibility only.
 */

import type { AuthCredentials, AuthResult, AuthSession, AuthProviderType } from '../types/auth.domain.types';
import type { TokenInfo } from './ITokenManager';

/**
 * Complete authentication provider interface
 * 
 * Combines authentication, user management, and token operations
 * into a single interface for backward compatibility.
 * New implementations should prefer the segregated interfaces.
 * 
 * @deprecated Use IAuthenticator, IUserManager, or ITokenManager instead
 */
export interface IAuthProvider {
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
     * Registers new user account
     * 
     * @param userData - User registration data
     * @returns Registration result with user data or error
     */
    register(userData: AuthCredentials): Promise<AuthResult<unknown>>;

    /**
     * Activates user account with activation code
     * 
     * @param code - Activation code sent to user
     * @returns Activation result with session or error
     */
    activate(code: string): Promise<AuthResult<AuthSession>>;

    /**
     * Signs out user from current session
     * 
     * @returns Signout result or error
     */
    signout(): Promise<AuthResult<void>>;

    /**
     * Validates current authentication session
     * 
     * @returns Validation result with session validity
     */
    validateSession(): Promise<AuthResult<boolean>>;

    /**
     * Refreshes authentication token
     * 
     * @param refreshToken - Optional refresh token
     * @returns New session with refreshed token
     */
    refreshToken(refreshToken?: string): Promise<AuthResult<AuthSession>>;

    /**
     * Resends activation code to user email
     * 
     * @param email - User email address
     * @returns Resend result or error
     */
    resendActivationCode(email: string): Promise<AuthResult<void>>;

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

    /**
     * Legacy method for backward compatibility
     * 
     * @param token - Token to extract information from
     * @returns Token information or error
     * @deprecated Use ITokenManager.getTokenInfo() instead
     */
    getTokenInfo?(token: string): AuthResult<TokenInfo>;

    /**
     * Legacy method for backward compatibility
     * 
     * @param token - Token to check for expiration
     * @returns True if token is expired
     * @deprecated Use ITokenManager.isTokenExpired() instead
     */
    isTokenExpired?(token: string): boolean;

    /**
     * Legacy method for backward compatibility
     * 
     * @param token - Token to get remaining time for
     * @returns Remaining time in seconds or -1 if invalid
     * @deprecated Use ITokenManager.getTokenTimeToExpiry() instead
     */
    getTokenTimeToExpiry?(token: string): number;
}
