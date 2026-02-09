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
import {
    ProviderPriority,
    type ProviderRegistrationOptions,
    type ProviderHealthStatus,
    type ManagerStatistics
} from '../interfaces/IProviderManager';

/**
 * Provider registration data with enhanced options
 */
interface ProviderRegistrationData {
    provider: IAuthenticator | IUserManager | ITokenManager;
    options: ProviderRegistrationOptions;
    registrationTime: Date;
    enabled: boolean;
    lastHealthCheck?: Date;
    consecutiveFailures: number;
    uptime: number;
    priority: ProviderPriority;
}

/**
 * Provider manager implementation
 * 
 * Manages authentication providers, user managers, and token managers
 * with clean separation of concerns and comprehensive logging.
 */
export class ProviderManager implements IProviderManager {
    readonly name = 'ProviderManager';

    private readonly providers = new Map<string, ProviderRegistrationData>();
    private readonly userManagers = new Map<string, ProviderRegistrationData>();
    private readonly tokenManagers = new Map<string, ProviderRegistrationData>();
    private healthMonitoringInterval?: ReturnType<typeof setInterval> | undefined;
    private isHealthMonitoringActive = false;

    constructor(private readonly logger?: IAuthLogger) { }

    /**
     * Registers authentication provider with options
     */
    registerProvider(provider: IAuthenticator, options: ProviderRegistrationOptions = {}): void {
        const registrationData: ProviderRegistrationData = {
            provider,
            options: {
                priority: options.priority ?? ProviderPriority.NORMAL,
                autoEnable: options.autoEnable ?? true,
                healthCheckInterval: options.healthCheckInterval ?? 30000,
                failoverEnabled: options.failoverEnabled ?? true,
                maxRetries: options.maxRetries ?? 3,
                metadata: options.metadata ?? {}
            },
            registrationTime: new Date(),
            enabled: options.autoEnable ?? true,
            consecutiveFailures: 0,
            uptime: 0,
            priority: options.priority ?? ProviderPriority.NORMAL
        };

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

        this.providers.set(provider.name, registrationData);

        this.logger?.log({
            type: 'provider_registered' as any,
            timestamp: new Date(),
            details: {
                providerName: provider.name,
                providerType: provider.type,
                priority: registrationData.options.priority,
                capabilities: provider.getCapabilities()
            }
        });
    }

    /**
     * Registers user manager with options
     */
    registerUserManager(userManager: IUserManager, options: ProviderRegistrationOptions = {}): void {
        const registrationData: ProviderRegistrationData = {
            provider: userManager,
            options: {
                priority: options.priority ?? ProviderPriority.NORMAL,
                autoEnable: options.autoEnable ?? true,
                healthCheckInterval: options.healthCheckInterval ?? 30000,
                failoverEnabled: options.failoverEnabled ?? true,
                maxRetries: options.maxRetries ?? 3,
                metadata: options.metadata ?? {}
            },
            registrationTime: new Date(),
            enabled: options.autoEnable ?? true,
            consecutiveFailures: 0,
            uptime: 0,
            priority: options.priority ?? ProviderPriority.NORMAL
        };

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

        this.userManagers.set(userManager.name, registrationData);

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
     * Registers token manager with options
     */
    registerTokenManager(tokenManager: ITokenManager, options: ProviderRegistrationOptions = {}): void {
        const registrationData: ProviderRegistrationData = {
            provider: tokenManager,
            options: {
                priority: options.priority ?? ProviderPriority.NORMAL,
                autoEnable: options.autoEnable ?? true,
                healthCheckInterval: options.healthCheckInterval ?? 30000,
                failoverEnabled: options.failoverEnabled ?? true,
                maxRetries: options.maxRetries ?? 3,
                metadata: options.metadata ?? {}
            },
            registrationTime: new Date(),
            enabled: options.autoEnable ?? true,
            consecutiveFailures: 0,
            uptime: 0,
            priority: options.priority ?? ProviderPriority.NORMAL
        };

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

        this.tokenManagers.set(tokenManager.name, registrationData);

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
     * Gets authentication provider by name with priority consideration
     */
    getProvider(name: string, enabledOnly: boolean = false): IAuthenticator | undefined {
        const registration = this.providers.get(name);
        if (!registration) return undefined;
        if (enabledOnly && !registration.enabled) return undefined;
        return registration.provider as IAuthenticator;
    }

    /**
     * Gets user manager by name
     */
    getUserManager(name: string, enabledOnly: boolean = false): IUserManager | undefined {
        const registration = this.userManagers.get(name);
        if (!registration) return undefined;
        if (enabledOnly && !registration.enabled) return undefined;
        return registration.provider as IUserManager;
    }

    /**
     * Gets token manager by name
     */
    getTokenManager(name: string, enabledOnly: boolean = false): ITokenManager | undefined {
        const registration = this.tokenManagers.get(name);
        if (!registration) return undefined;
        if (enabledOnly && !registration.enabled) return undefined;
        return registration.provider as ITokenManager;
    }

    /**
     * Lists all registered provider names with priority sorting
     */
    listProviders(enabledOnly: boolean = false, sortByPriority: boolean = true): string[] {
        let providers = Array.from(this.providers.entries());

        if (enabledOnly) {
            providers = providers.filter(([_, data]) => data.enabled);
        }

        if (sortByPriority) {
            providers.sort(([_, a], [__, b]) => a.options.priority! - b.options.priority!);
        }

        return providers.map(([name]) => name);
    }

    /**
     * Lists all registered user manager names
     */
    listUserManagers(enabledOnly: boolean = false): string[] {
        let managers = Array.from(this.userManagers.entries());

        if (enabledOnly) {
            managers = managers.filter(([_, data]) => data.enabled);
        }

        return managers.map(([name]) => name);
    }

    /**
     * Lists all registered token manager names
     */
    listTokenManagers(enabledOnly: boolean = false): string[] {
        let managers = Array.from(this.tokenManagers.entries());

        if (enabledOnly) {
            managers = managers.filter(([_, data]) => data.enabled);
        }

        return managers.map(([name]) => name);
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
     * Gets provider count with filtering options
     */
    getProviderCount(enabledOnly: boolean = false): number {
        if (enabledOnly) {
            return Array.from(this.providers.values()).filter(data => data.enabled).length;
        }
        return this.providers.size;
    }

    /**
     * Gets user manager count with filtering options
     */
    getUserManagerCount(enabledOnly: boolean = false): number {
        if (enabledOnly) {
            return Array.from(this.userManagers.values()).filter(data => data.enabled).length;
        }
        return this.userManagers.size;
    }

    /**
     * Gets token manager count with filtering options
     */
    getTokenManagerCount(enabledOnly: boolean = false): number {
        if (enabledOnly) {
            return Array.from(this.tokenManagers.values()).filter(data => data.enabled).length;
        }
        return this.tokenManagers.size;
    }

    /**
     * Gets provider health status
     */
    getProviderHealth(name: string): ProviderHealthStatus | undefined {
        const registration = this.providers.get(name);
        if (!registration) return undefined;

        const provider = registration.provider as IAuthenticator;
        const now = new Date();

        return {
            name: provider.name,
            health: {
                healthy: true, // Would be populated by actual health check
                timestamp: now,
                responseTime: 0,
                message: 'Health check not implemented'
            },
            priority: registration.options.priority!,
            enabled: registration.enabled,
            lastHealthCheck: registration.lastHealthCheck || now,
            consecutiveFailures: registration.consecutiveFailures,
            uptime: registration.uptime
        };
    }

    /**
     * Gets health status for all providers
     */
    getAllProvidersHealth(enabledOnly: boolean = false): ProviderHealthStatus[] {
        const healthStatuses: ProviderHealthStatus[] = [];

        for (const [name, registration] of Array.from(this.providers.entries())) {
            if (enabledOnly && !registration.enabled) continue;

            const health = this.getProviderHealth(name);
            if (health) {
                healthStatuses.push(health);
            }
        }

        return healthStatuses;
    }

    /**
                        registration.consecutiveFailures++;
                    } else {
                        registration.consecutiveFailures = 0;
                    }
                }).catch(() => {
                    registration.consecutiveFailures++;
                    registration.lastHealthCheck = new Date();
                })
            );
        }
    }

    await Promise.allSettled(healthCheckPromises);
                bestProvider = registration.provider as IAuthenticator;
            }
        }

        return bestProvider;
    }

    /**
     * Gets comprehensive manager statistics
     */
    getManagerStatistics(): ManagerStatistics {
        const providerTypes: Record<string, number> = {};
        const capabilities: Record<string, number> = {};
        const providersByPriority: Record<ProviderPriority, number> = {
            [ProviderPriority.CRITICAL]: 0,
            [ProviderPriority.HIGH]: 0,
            [ProviderPriority.NORMAL]: 0,
            [ProviderPriority.LOW]: 0,
            [ProviderPriority.BACKUP]: 0
        };

        let healthyProviders = 0;
        let enabledProviders = 0;

        // Count provider types and capabilities
        for (const registration of Array.from(this.providers.values())) {
            const provider = registration.provider as IAuthenticator;

            if (registration.enabled) {
                enabledProviders++;
                if (registration.consecutiveFailures === 0) {
                    healthyProviders++;
                }
            }

            providerTypes[provider.type] = (providerTypes[provider.type] || 0) + 1;
            providersByPriority[registration.options.priority!]++;

            // Count capabilities
            for (const capability of provider.getCapabilities()) {
                capabilities[capability] = (capabilities[capability] || 0) + 1;
            }
        }

        const healthScore = this.providers.size > 0 ? (healthyProviders / this.providers.size) * 100 : 0;

        return {
            totalProviders: this.providers.size,
            totalUserManagers: this.userManagers.size,
            totalTokenManagers: this.tokenManagers.size,
            healthyProviders,
            enabledProviders,
            providersByPriority,
            providerTypes,
            capabilities,
            healthScore,
            lastHealthCheck: new Date()
        };
    }

    /**
     * Starts automatic health monitoring for all providers
     */
    startHealthMonitoring(interval: number = 30000): void {
        if (this.isHealthMonitoringActive) return;

        this.isHealthMonitoringActive = true;
        this.healthMonitoringInterval = setInterval(() => {
            this.performHealthChecks().catch(error => {
                this.logger?.log({
                    type: 'health_monitoring_error' as any,
                    timestamp: new Date(),
                    details: { error: error.message }
                });
            });
        }, interval);

        this.logger?.log({
            type: 'health_monitoring_started' as any,
            timestamp: new Date(),
            details: { interval }
        });
    }

    /**
     * Stops automatic health monitoring
     */
    stopHealthMonitoring(): void {
        if (this.healthMonitoringInterval) {
            clearInterval(this.healthMonitoringInterval);
            this.healthMonitoringInterval = undefined;
        }

        this.isHealthMonitoringActive = false;

        this.logger?.log({
            type: 'health_monitoring_stopped' as any,
            timestamp: new Date(),
            details: {}
        });
    }

    /**
     * Initializes all registered providers
     */
    async initializeAllProviders(timeout: number = 30000): Promise<void> {
        const initializationPromises: Promise<void>[] = [];

        for (const registration of Array.from(this.providers.values())) {
            const provider = registration.provider as IAuthenticator;
            if ('initialize' in provider && typeof provider.initialize === 'function') {
                initializationPromises.push(
                    Promise.race([
                        provider.initialize(),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('Initialization timeout')), timeout)
                        )
                    ])
                );
            }
        }

        await Promise.allSettled(initializationPromises);
    }

    /**
     * Gracefully shuts down all providers
     */
    async shutdownAllProviders(timeout: number = 30000): Promise<void> {
        this.stopHealthMonitoring();

        const shutdownPromises: Promise<void>[] = [];

        for (const registration of Array.from(this.providers.values())) {
            const provider = registration.provider as IAuthenticator;
            if ('shutdown' in provider && typeof provider.shutdown === 'function') {
                shutdownPromises.push(
                    Promise.race([
                        provider.shutdown(timeout),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('Shutdown timeout')), timeout)
                        )
                    ])
                );
            }
        }

        await Promise.allSettled(shutdownPromises);
    }

    /**
     * Performs health check on all providers
     */
    async performHealthChecks(): Promise<void> {
        const healthCheckPromises: Promise<void>[] = [];

        for (const [name, registration] of Array.from(this.providers.entries())) {
            if (registration.enabled) {
                healthCheckPromises.push(
                    Promise.resolve()
                        .then(async () => {
                            const result = await this.getProviderHealth(name);
                            if (!result?.health?.healthy) {
                                // Log health check failure but don't throw
                                console.warn(`Health check failed for provider ${name}:`, result?.health?.message || 'No health information available');
                            }
                        })
                        .catch((error: any) => {
                            // Log health check failure but don't throw
                            console.warn(`Health check failed for provider ${name}:`, error);
                        })
                );
            }
        }

        await Promise.allSettled(healthCheckPromises);
    }

    /**
     * Enables or disables a provider
     */
    setProviderEnabled(name: string, enabled: boolean): boolean {
        const registration = this.providers.get(name);
        if (!registration) {
            return false;
        }

        registration.enabled = enabled;
        registration.lastHealthCheck = new Date();

        return true;
    }

    /**
     * Checks if provider is enabled
     */
    isProviderEnabled(name: string): boolean {
        const registration = this.providers.get(name);
        return registration?.enabled ?? false;
    }

    /**
     * Sets provider priority
     */
    setProviderPriority(name: string, priority: ProviderPriority): boolean {
        const registration = this.providers.get(name);
        if (!registration) {
            return false;
        }

        registration.priority = priority;
        return true;
    }

    /**
     * Gets provider priority
     */
    getProviderPriority(name: string): ProviderPriority | undefined {
        const registration = this.providers.get(name);
        return registration?.priority;
    }

    /**
     * Gets providers by priority level
     */
    getProvidersByPriority(priority: ProviderPriority, enabledOnly: boolean = false): IAuthenticator[] {
        const providers: IAuthenticator[] = [];

        for (const [name, registration] of Array.from(this.providers.entries())) {
            if (enabledOnly && !registration.enabled) continue;

            if (registration.priority === priority) {
                providers.push(registration.provider as IAuthenticator);
            }
        }

        return providers;
    }

    /**
     * Gets best available provider based on health and priority
     */
    getBestProvider(type?: string): IAuthenticator | undefined {
        let bestProvider: IAuthenticator | undefined;
        let bestScore = -1;

        for (const [name, registration] of Array.from(this.providers.entries())) {
            if (!registration.enabled) continue;

            // Filter by type if specified
            if (type && (registration.provider as IAuthenticator).type !== type) continue;

            // Calculate score based on priority and health
            const priority = registration.priority;
            const healthScore = registration.consecutiveFailures === 0 ? 1 : 0;
            const score = (ProviderPriority.BACKUP - priority) * 10 + healthScore * 5;

            if (score > bestScore) {
                bestScore = score;
                bestProvider = registration.provider as IAuthenticator;
            }
        }

        return bestProvider;
    }
}
