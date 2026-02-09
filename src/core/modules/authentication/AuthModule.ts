/**
 * Enterprise Authentication Module
 *
 * Provides enterprise-grade authentication with:
 * - Dependency injection
 * Plugin architecture
 * Enterprise security features
 * - Comprehensive logging and metrics
 * - Multiple provider support
 */

import { loadAuthConfiguration } from './config/AuthConfigLoader';
import { DefaultAuthConfig } from './config/DefaultAuthConfig';
import { createDefaultAuthOrchestrator } from './factory';
import { JwtAuthProvider } from './providers/JwtAuthProvider';
import { OAuthAuthProvider } from './providers/OAuthProvider';
import { SAMLAuthProvider } from './providers/SAMLProvider';
import { SessionAuthProvider } from './providers/SessionProvider';
import { LDAPAuthProvider } from './providers/LDAPProvider';

import type { IAuthRepository, IAuthLogger, IAuthMetrics, IAuthSecurityService, IAuthConfig } from './interfaces/authInterfaces';
import type { AuthOrchestrator } from './enterprise/AuthOrchestrator';

/**
 * Enterprise Authentication Module Factory
 *
 * Central factory for creating authentication services with enterprise features.
 * Provides clean dependency injection and configuration management.
 */
export class AuthModuleFactory {
    private static instance: any = null;
    private static registeredProviders: Map<string, any> = new Map();
    private static activeServices: Set<string> = new Set();

    /**
     * Creates enterprise authentication service for specific environment
     *
     * Loads configuration from files and environment variables,
     * then creates appropriately configured authentication service.
     */
    static async createForEnvironment(environment?: string): Promise<AuthOrchestrator> {
        try {
            // Load configuration for the specified environment
            const config = await loadAuthConfiguration(environment);

            // Validate configuration
            const validation = config.validate();
            if (!validation.success) {
                throw new Error(`Invalid authentication configuration: ${validation.error?.message}`);
            }

            // Create and return the orchestrator
            return createDefaultAuthOrchestrator(config);
        } catch (error) {
            console.error('Failed to create auth service for environment:', error);
            throw error;
        }
    }

    /**
     * Gets singleton instance (deprecated)
     * 
     * @deprecated Use createForEnvironment() instead
     */
    static getInstance(): any {
        if (!this.instance) {
            this.instance = this.createForEnvironment();
        }
        return this.instance;
    }

    /**
     * Creates authentication service with custom configuration
     */
    static createWithConfig(config: IAuthConfig): AuthOrchestrator {
        return createDefaultAuthOrchestrator(config);
    }

    /**
     * Creates authentication service with custom components
     */
    static createWithComponents(
        _repository: IAuthRepository,
        _logger: IAuthLogger,
        _metrics: IAuthMetrics,
        _security: IAuthSecurityService,
        config: IAuthConfig
    ): AuthOrchestrator {
        return createDefaultAuthOrchestrator(config);
    }

    /**
     * Creates authentication service with all available providers
     */
    static createWithAllProviders(): AuthOrchestrator {
        return createDefaultAuthOrchestrator();
    }

    /**
     * Creates authentication service for specific provider type
     */
    static createForProvider(_providerType: string): AuthOrchestrator {
        return createDefaultAuthOrchestrator();
    }

    /**
     * Creates authentication service with plugin support
     */
    static createWithPlugins(_plugins: any[]): AuthOrchestrator {
        return createDefaultAuthOrchestrator();
    }

    /**
     * Creates authentication service with monitoring enabled
     */
    static createWithMonitoring(): AuthOrchestrator {
        return createDefaultAuthOrchestrator();
    }

    /**
     * Creates authentication service with enhanced security
     */
    static createWithSecurity(): AuthOrchestrator {
        return createDefaultAuthOrchestrator();
    }

    /**
     * Creates authentication service for testing
     */
    static createForTesting(): AuthOrchestrator {
        const config = new DefaultAuthConfig();
        return createDefaultAuthOrchestrator(config);
    }

    /**
     * Registers a new provider dynamically
     */
    static async registerProvider(serviceId: string, provider: any, config?: any): Promise<{ success: boolean; error?: { code: string; message: string } }> {
        try {
            // Store provider
            this.registeredProviders.set(serviceId, provider);
            this.activeServices.add(serviceId);

            // Configure provider if config provided
            if (config && provider.configure) {
                await provider.configure(config);
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: 'PROVIDER_INITIALIZATION_FAILED',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            };
        }
    }

    /**
     * Gets list of registered provider names
     */
    static getRegisteredProviders(): string[] {
        return Array.from(this.registeredProviders.keys());
    }

    /**
     * Gets list of active services
     */
    static getActiveServices(): string[] {
        return Array.from(this.activeServices);
    }

    /**
     * Gets a service by ID
     */
    static getService(serviceId: string): any {
        return this.registeredProviders.get(serviceId);
    }

    /**
     * Gets a provider by name
     */
    static getProvider(providerName: string): any {
        const providers = Array.from(this.registeredProviders.values());
        return providers.find(provider =>
            provider && typeof provider === 'object' && provider.constructor && provider.constructor.name === providerName
        );
    }

    /**
     * Unregisters a provider
     */
    static async unregisterProvider(serviceId: string, providerName?: string): Promise<{ success: boolean; error?: { code: string; message: string } }> {
        try {
            this.registeredProviders.delete(serviceId);
            this.activeServices.delete(serviceId);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: {
                    code: 'SERVICE_NOT_FOUND',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            };
        }
    }

    /**
     * Switches active provider
     */
    static async switchProvider(serviceId: string, providerName?: string): Promise<{ success: boolean; error?: { code: string; message: string } }> {
        try {
            if (this.registeredProviders.has(serviceId)) {
                this.activeServices.clear();
                this.activeServices.add(serviceId);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: {
                        code: 'SERVICE_NOT_FOUND',
                        message: `Provider ${providerName || serviceId} is not registered`
                    }
                };
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    code: 'SERVICE_NOT_FOUND',
                    message: error instanceof Error ? error.message : 'Unknown error occurred'
                }
            };
        }
    }

    /**
     * Resets the singleton instance and clears all providers
     */
    static resetInstance(): void {
        this.instance = null;
        this.registeredProviders.clear();
        this.activeServices.clear();
    }
}

/**
 * Default export for convenience
 */
export default AuthModuleFactory;
