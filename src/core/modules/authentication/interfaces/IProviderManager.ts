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
import type { HealthCheckResult } from './IAuthenticator';

/**
 * Provider priority levels for load balancing and failover
 */
export enum ProviderPriority {
    CRITICAL = 0,    // Highest priority, always tried first
    HIGH = 1,        // High priority, preferred provider
    NORMAL = 2,      // Normal priority, standard provider
    LOW = 3,         // Low priority, fallback provider
    BACKUP = 4       // Backup priority, last resort
}

/**
 * Provider registration options with priority and health settings
 */
export interface ProviderRegistrationOptions {
    /** Provider priority for load balancing */
    priority?: ProviderPriority;

    /** Whether provider should be auto-enabled */
    autoEnable?: boolean;

    /** Health check interval in milliseconds */
    healthCheckInterval?: number;

    /** Whether provider participates in failover */
    failoverEnabled?: boolean;

    /** Maximum retry attempts for this provider */
    maxRetries?: number;

    /** Additional registration metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Provider health status information
 */
export interface ProviderHealthStatus {
    /** Provider name */
    name: string;

    /** Current health status */
    health: HealthCheckResult;

    /** Provider priority */
    priority: ProviderPriority;

    /** Whether provider is enabled */
    enabled: boolean;

    /** Last health check timestamp */
    lastHealthCheck: Date;

    /** Consecutive health check failures */
    consecutiveFailures: number;

    /** Provider uptime in milliseconds */
    uptime: number;
}

/**
 * Manager statistics and health information
 */
export interface ManagerStatistics {
    /** Total registered providers */
    totalProviders: number;

    /** Total registered user managers */
    totalUserManagers: number;

    /** Total registered token managers */
    totalTokenManagers: number;

    /** Healthy providers count */
    healthyProviders: number;

    /** Enabled providers count */
    enabledProviders: number;

    /** Provider distribution by priority */
    providersByPriority: Record<ProviderPriority, number>;

    /** Provider types distribution */
    providerTypes: Record<string, number>;

    /** Capabilities distribution */
    capabilities: Record<string, number>;

    /** Overall manager health score (0-100) */
    healthScore: number;

    /** Last health check timestamp */
    lastHealthCheck: Date;
}

/**
 * Provider manager interface
 * 
 * Manages the lifecycle of authentication providers including
 * registration, discovery, and capability management.
 */
export interface IProviderManager {
    /**
     * Registers authentication provider with options
     * 
     * @param provider - Authentication provider to register
     * @param options - Registration options including priority and health settings
     */
    registerProvider(provider: IAuthenticator, options?: ProviderRegistrationOptions): void;

    /**
     * Registers user manager with options
     * 
     * @param userManager - User manager to register
     * @param options - Registration options
     */
    registerUserManager(userManager: IUserManager, options?: ProviderRegistrationOptions): void;

    /**
     * Registers token manager with options
     * 
     * @param tokenManager - Token manager to register
     * @param options - Registration options
     */
    registerTokenManager(tokenManager: ITokenManager, options?: ProviderRegistrationOptions): void;

    /**
     * Gets authentication provider by name with priority consideration
     * 
     * @param name - Provider name
     * @param enabledOnly - Whether to return only enabled providers
     * @returns Authentication provider or undefined
     */
    getProvider(name: string, enabledOnly?: boolean): IAuthenticator | undefined;

    /**
     * Gets user manager by name
     * 
     * @param name - User manager name
     * @param enabledOnly - Whether to return only enabled managers
     * @returns User manager or undefined
     */
    getUserManager(name: string, enabledOnly?: boolean): IUserManager | undefined;

    /**
     * Gets token manager by name
     * 
     * @param name - Token manager name
     * @param enabledOnly - Whether to return only enabled managers
     * @returns Token manager or undefined
     */
    getTokenManager(name: string, enabledOnly?: boolean): ITokenManager | undefined;

    /**
     * Lists all registered provider names with priority sorting
     * 
     * @param enabledOnly - Whether to list only enabled providers
     * @param sortByPriority - Whether to sort by priority (default: true)
     * @returns Array of provider names
     */
    listProviders(enabledOnly?: boolean, sortByPriority?: boolean): string[];

    /**
     * Lists all registered user manager names
     * 
     * @param enabledOnly - Whether to list only enabled managers
     * @returns Array of user manager names
     */
    listUserManagers(enabledOnly?: boolean): string[];

    /**
     * Lists all registered token manager names
     * 
     * @param enabledOnly - Whether to list only enabled managers
     * @returns Array of token manager names
     */
    listTokenManagers(enabledOnly?: boolean): string[];

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
     * Gets provider count with filtering options
     * 
     * @param enabledOnly - Whether to count only enabled providers
     * @returns Number of registered providers
     */
    getProviderCount(enabledOnly?: boolean): number;

    /**
     * Gets user manager count with filtering options
     * 
     * @param enabledOnly - Whether to count only enabled managers
     * @returns Number of registered user managers
     */
    getUserManagerCount(enabledOnly?: boolean): number;

    /**
     * Gets token manager count with filtering options
     * 
     * @param enabledOnly - Whether to count only enabled managers
     * @returns Number of registered token managers
     */
    getTokenManagerCount(enabledOnly?: boolean): number;

    /**
     * Gets provider health status
     * 
     * @param name - Provider name
     * @returns Provider health status or undefined
     */
    getProviderHealth(name: string): ProviderHealthStatus | undefined;

    /**
     * Gets health status for all providers
     * 
     * @param enabledOnly - Whether to include only enabled providers
     * @returns Array of provider health statuses
     */
    getAllProvidersHealth(enabledOnly?: boolean): ProviderHealthStatus[];

    /**
     * Performs health check on all providers
     * 
     * @returns Promise when all health checks are complete
     */
    performHealthChecks(): Promise<void>;

    /**
     * Enables or disables a provider
     * 
     * @param name - Provider name
     * @param enabled - Whether to enable the provider
     * @returns True if operation was successful
     */
    setProviderEnabled(name: string, enabled: boolean): boolean;

    /**
     * Checks if provider is enabled
     * 
     * @param name - Provider name
     * @returns True if provider is enabled
     */
    isProviderEnabled(name: string): boolean;

    /**
     * Sets provider priority
     * 
     * @param name - Provider name
     * @param priority - New priority level
     * @returns True if operation was successful
     */
    setProviderPriority(name: string, priority: ProviderPriority): boolean;

    /**
     * Gets provider priority
     * 
     * @param name - Provider name
     * @returns Provider priority or undefined
     */
    getProviderPriority(name: string): ProviderPriority | undefined;

    /**
     * Gets providers by priority level
     * 
     * @param priority - Priority level
     * @param enabledOnly - Whether to return only enabled providers
     * @returns Array of providers at the specified priority
     */
    getProvidersByPriority(priority: ProviderPriority, enabledOnly?: boolean): IAuthenticator[];

    /**
     * Gets best available provider based on health and priority
     * 
     * @param type - Optional provider type filter
     * @returns Best available provider or undefined
     */
    getBestProvider(type?: string): IAuthenticator | undefined;

    /**
     * Gets comprehensive manager statistics
     * 
     * @returns Manager statistics and health information
     */
    getManagerStatistics(): ManagerStatistics;

    /**
     * Starts automatic health monitoring for all providers
     * 
     * @param interval - Health check interval in milliseconds
     */
    startHealthMonitoring(interval?: number): void;

    /**
     * Stops automatic health monitoring
     */
    stopHealthMonitoring(): void;

    /**
     * Initializes all registered providers
     * 
     * @param timeout - Optional timeout for initialization
     * @returns Promise when all providers are initialized
     */
    initializeAllProviders(timeout?: number): Promise<void>;

    /**
     * Gracefully shuts down all providers
     * 
     * @param timeout - Optional timeout for shutdown
     * @returns Promise when all providers are shut down
     */
    shutdownAllProviders(timeout?: number): Promise<void>;

    /**
     * Gets management capabilities for provider operations
     * 
     * @returns Array of management capability identifiers
     */
    getManagementCapabilities(): string[];

    /**
     * Performs comprehensive provider management with multiple operations
     * 
     * @param operations - Array of provider management operations
     * @returns Management result with operation outcomes
     */
    manageProviders(operations: any[]): Promise<any>;
}
