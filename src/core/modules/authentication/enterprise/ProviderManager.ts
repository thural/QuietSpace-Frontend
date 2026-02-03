/**
 * Provider Manager Implementation
 *
 * Implements provider lifecycle management with registration,
 * discovery, and capability management following Single Responsibility Principle.
 */

import type { IProviderManager } from '../interfaces/IProviderManager';
import type { IAuthenticator } from '../interfaces/IAuthenticator';
import type { IUserManager } from '../interfaces/IUserManager';
import type { ITokenManager } from '../interfaces/ITokenManager';
import type { IAuthLogger } from '../interfaces/authInterfaces';

/**
 * Provider manager implementation
 * 
 * Manages authentication providers, user managers, and token managers
 * with clean separation of concerns and comprehensive logging.
 */
export class ProviderManager implements IProviderManager {
    readonly name = 'ProviderManager';

    private readonly providers = new Map<string, IAuthenticator>();
    private readonly userManagers = new Map<string, IUserManager>();
    private readonly tokenManagers = new Map<string, ITokenManager>();

    constructor(private readonly logger?: IAuthLogger) {}

    /**
     * Registers authentication provider
     */
    registerProvider(provider: IAuthenticator): void {
        if (this.providers.has(provider.name)) {
            this.logger?.log({
                type: 'warning' as any,
                timestamp: new Date(),
                details: { 
                    message: `Provider '${provider.name}' already exists, overwriting`,
                    providerName: provider.name,
                    providerType: provider.type
                }
            });
        }

        this.providers.set(provider.name, provider);
        
        this.logger?.log({
            type: 'provider_registered' as any,
            timestamp: new Date(),
            details: { 
                providerName: provider.name,
                providerType: provider.type,
                capabilities: provider.getCapabilities()
            }
        });
    }

    /**
     * Registers user manager
     */
    registerUserManager(userManager: IUserManager): void {
        if (this.userManagers.has(userManager.name)) {
            this.logger?.log({
                type: 'warning' as any,
                timestamp: new Date(),
                details: { 
                    message: `User manager '${userManager.name}' already exists, overwriting`,
                    userManagerName: userManager.name
                }
            });
        }

        this.userManagers.set(userManager.name, userManager);
        
        this.logger?.log({
            type: 'user_manager_registered' as any,
            timestamp: new Date(),
            details: { 
                userManagerName: userManager.name,
                capabilities: userManager.getCapabilities()
            }
        });
    }

    /**
     * Registers token manager
     */
    registerTokenManager(tokenManager: ITokenManager): void {
        if (this.tokenManagers.has(tokenManager.name)) {
            this.logger?.log({
                type: 'warning' as any,
                timestamp: new Date(),
                details: { 
                    message: `Token manager '${tokenManager.name}' already exists, overwriting`,
                    tokenManagerName: tokenManager.name
                }
            });
        }

        this.tokenManagers.set(tokenManager.name, tokenManager);
        
        this.logger?.log({
            type: 'token_manager_registered' as any,
            timestamp: new Date(),
            details: { 
                tokenManagerName: tokenManager.name,
                capabilities: tokenManager.getCapabilities()
            }
        });
    }

    /**
     * Gets authentication provider by name
     */
    getProvider(name: string): IAuthenticator | undefined {
        return this.providers.get(name);
    }

    /**
     * Gets user manager by name
     */
    getUserManager(name: string): IUserManager | undefined {
        return this.userManagers.get(name);
    }

    /**
     * Gets token manager by name
     */
    getTokenManager(name: string): ITokenManager | undefined {
        return this.tokenManagers.get(name);
    }

    /**
     * Lists all registered provider names
     */
    listProviders(): string[] {
        return Array.from(this.providers.keys());
    }

    /**
     * Lists all registered user manager names
     */
    listUserManagers(): string[] {
        return Array.from(this.userManagers.keys());
    }

    /**
     * Lists all registered token manager names
     */
    listTokenManagers(): string[] {
        return Array.from(this.tokenManagers.keys());
    }

    /**
     * Checks if provider is registered
     */
    hasProvider(name: string): boolean {
        return this.providers.has(name);
    }

    /**
     * Checks if user manager is registered
     */
    hasUserManager(name: string): boolean {
        return this.userManagers.has(name);
    }

    /**
     * Checks if token manager is registered
     */
    hasTokenManager(name: string): boolean {
        return this.tokenManagers.has(name);
    }

    /**
     * Removes provider by name
     */
    removeProvider(name: string): boolean {
        const removed = this.providers.delete(name);
        
        if (removed) {
            this.logger?.log({
                type: 'provider_removed' as any,
                timestamp: new Date(),
                details: { providerName: name }
            });
        }
        
        return removed;
    }

    /**
     * Removes user manager by name
     */
    removeUserManager(name: string): boolean {
        const removed = this.userManagers.delete(name);
        
        if (removed) {
            this.logger?.log({
                type: 'user_manager_removed' as any,
                timestamp: new Date(),
                details: { userManagerName: name }
            });
        }
        
        return removed;
    }

    /**
     * Removes token manager by name
     */
    removeTokenManager(name: string): boolean {
        const removed = this.tokenManagers.delete(name);
        
        if (removed) {
            this.logger?.log({
                type: 'token_manager_removed' as any,
                timestamp: new Date(),
                details: { tokenManagerName: name }
            });
        }
        
        return removed;
    }

    /**
     * Clears all registered providers
     */
    clear(): void {
        const providerCount = this.providers.size;
        const userManagerCount = this.userManagers.size;
        const tokenManagerCount = this.tokenManagers.size;

        this.providers.clear();
        this.userManagers.clear();
        this.tokenManagers.clear();

        this.logger?.log({
            type: 'providers_cleared' as any,
            timestamp: new Date(),
            details: { 
                providersRemoved: providerCount,
                userManagersRemoved: userManagerCount,
                tokenManagersRemoved: tokenManagerCount
            }
        });
    }

    /**
     * Gets provider count
     */
    getProviderCount(): number {
        return this.providers.size;
    }

    /**
     * Gets user manager count
     */
    getUserManagerCount(): number {
        return this.userManagers.size;
    }

    /**
     * Gets token manager count
     */
    getTokenManagerCount(): number {
        return this.tokenManagers.size;
    }

    /**
     * Gets comprehensive manager statistics
     */
    getStatistics(): {
        totalProviders: number;
        totalUserManagers: number;
        totalTokenManagers: number;
        providerTypes: Record<string, number>;
        capabilities: Record<string, number>;
    } {
        const providerTypes: Record<string, number> = {};
        const capabilities: Record<string, number> = {};

        // Count provider types
        for (const provider of this.providers.values()) {
            providerTypes[provider.type] = (providerTypes[provider.type] || 0) + 1;
            
            // Count capabilities
            for (const capability of provider.getCapabilities()) {
                capabilities[capability] = (capabilities[capability] || 0) + 1;
            }
        }

        return {
            totalProviders: this.providers.size,
            totalUserManagers: this.userManagers.size,
            totalTokenManagers: this.tokenManagers.size,
            providerTypes,
            capabilities
        };
    }
}
