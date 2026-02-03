/**
 * User Management Interface
 *
 * Defines contract for user lifecycle management operations.
 * This interface focuses solely on user-related responsibilities
 * following the Interface Segregation Principle.
 */

import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * User management provider interface
 *
 * Provides user lifecycle operations including registration,
 * activation, and account management without authentication concerns.
 */
export interface IUserManager {
    /** Provider name for identification */
    readonly name: string;
    
    /** Provider type for categorization */
    readonly type: string;
    
    /** Provider configuration settings */
    readonly config: Record<string, unknown>;

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
     * Resends activation code to user email
     * 
     * @param email - User email address
     * @returns Resend result or error
     */
    resendActivationCode(email: string): Promise<AuthResult<void>>;

    /**
     * Configures user manager with settings
     * 
     * @param config - Configuration settings
     */
    configure(config: Record<string, unknown>): void;

    /**
     * Gets user management capabilities
     * 
     * @returns Array of capability identifiers
     */
    getCapabilities(): string[];

    /**
     * Initializes user manager (optional)
     * 
     * @returns Promise when initialization is complete
     */
    initialize?(): Promise<void>;
}
