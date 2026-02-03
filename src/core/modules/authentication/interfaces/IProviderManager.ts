/**
 * Provider Manager Interface
 *
 * Defines contract for authentication provider lifecycle management.
 * This interface focuses solely on provider registration, discovery,
 * and management following the Single Responsibility Principle.
 */

import type { IAuthenticator } from './IAuthenticator';
import type { IUserManager } from './IUserManager';
import type { ITokenManager } from './ITokenManager';

/**
 * Provider manager interface
 * 
 * Manages the lifecycle of authentication providers including
 * registration, discovery, and capability management.
 */
export interface IProviderManager {
    /**
     * Registers authentication provider
     * 
     * @param provider - Authentication provider to register
     */
    registerProvider(provider: IAuthenticator): void;

    /**
     * Registers user manager
     * 
     * @param userManager - User manager to register
     */
    registerUserManager(userManager: IUserManager): void;

    /**
     * Registers token manager
     * 
     * @param tokenManager - Token manager to register
     */
    registerTokenManager(tokenManager: ITokenManager): void;

    /**
     * Gets authentication provider by name
     * 
     * @param name - Provider name
     * @returns Authentication provider or undefined
     */
    getProvider(name: string): IAuthenticator | undefined;

    /**
     * Gets user manager by name
     * 
     * @param name - User manager name
     * @returns User manager or undefined
     */
    getUserManager(name: string): IUserManager | undefined;

    /**
     * Gets token manager by name
     * 
     * @param name - Token manager name
     * @returns Token manager or undefined
     */
    getTokenManager(name: string): ITokenManager | undefined;

    /**
     * Lists all registered provider names
     * 
     * @returns Array of provider names
     */
    listProviders(): string[];

    /**
     * Lists all registered user manager names
     * 
     * @returns Array of user manager names
     */
    listUserManagers(): string[];

    /**
     * Lists all registered token manager names
     * 
     * @returns Array of token manager names
     */
    listTokenManagers(): string[];

    /**
     * Checks if provider is registered
     * 
     * @param name - Provider name
     * @returns True if provider is registered
     */
    hasProvider(name: string): boolean;

    /**
     * Checks if user manager is registered
     * 
     * @param name - User manager name
     * @returns True if user manager is registered
     */
    hasUserManager(name: string): boolean;

    /**
     * Checks if token manager is registered
     * 
     * @param name - Token manager name
     * @returns True if token manager is registered
     */
    hasTokenManager(name: string): boolean;

    /**
     * Removes provider by name
     * 
     * @param name - Provider name
     * @returns True if provider was removed
     */
    removeProvider(name: string): boolean;

    /**
     * Removes user manager by name
     * 
     * @param name - User manager name
     * @returns True if user manager was removed
     */
    removeUserManager(name: string): boolean;

    /**
     * Removes token manager by name
     * 
     * @param name - Token manager name
     * @returns True if token manager was removed
     */
    removeTokenManager(name: string): boolean;

    /**
     * Clears all registered providers
     */
    clear(): void;

    /**
     * Gets provider count
     * 
     * @returns Number of registered providers
     */
    getProviderCount(): number;

    /**
     * Gets user manager count
     * 
     * @returns Number of registered user managers
     */
    getUserManagerCount(): number;

    /**
     * Gets token manager count
     * 
     * @returns Number of registered token managers
     */
    getTokenManagerCount(): number;
}
