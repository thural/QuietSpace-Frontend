/**
 * Enterprise Authentication Module
 *
 * Provides a complete, modular authentication system with:
 * - Dependency injection
 * - Plugin architecture
 * - Enterprise security features
 * - Comprehensive logging and metrics
 * - Multiple provider support
 */

import { createAuthConfigLoader, loadAuthConfiguration } from './config/AuthConfigLoader';
import { DefaultAuthConfig } from './config/DefaultAuthConfig';
import { EnvironmentAuthConfig, createEnvironmentAuthConfig } from './config/EnvironmentAuthConfig';
import { EnterpriseAuthService } from './enterprise/AuthService';
import { ConsoleAuthLogger } from './loggers/ConsoleAuthLogger';
import { InMemoryAuthMetrics } from './metrics/InMemoryAuthMetrics';
import { AnalyticsPlugin } from './plugins/AnalyticsPlugin';
import { SecurityPlugin } from './plugins/SecurityPlugin';
import { JwtAuthProvider } from './providers/JwtAuthProvider';
import { LDAPAuthProvider } from './providers/LDAPProvider';
import { OAuthAuthProvider } from './providers/OAuthProvider';
import { SAMLAuthProvider } from './providers/SAMLProvider';
import { SessionAuthProvider } from './providers/SessionProvider';
import { LocalAuthRepository } from './repositories/LocalAuthRepository';
import { EnterpriseSecurityService } from './security/EnterpriseSecurityService';

import type { AuthConfigLoader } from './config/AuthConfigLoader';
import type {
    IAuthProvider,
    IAuthRepository,
    IAuthValidator,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from './interfaces/authInterfaces';
import type { AuthResult } from './types/auth.domain.types';


/**
 * Factory for creating authentication services
 *
 * Implements factory pattern for creating configured
 * authentication services with proper dependency injection.
 */
export class AuthModuleFactory {
    private static readonly activeServices = new Map<string, EnterpriseAuthService>();
    private static readonly providerRegistry = new Map<string, IAuthProvider>();

    /**
     * Registers providers based on configuration
     */
    private static async registerProvidersFromConfig(authService: EnterpriseAuthService, config: IAuthConfig): Promise<void> {
        const allowedProviders = (config.get('allowedProviders')) || ['jwt'];

        // Always register JWT provider as fallback
        if (allowedProviders.includes('jwt')) {
            const jwtProvider = new JwtAuthProvider();
            authService.registerProvider(jwtProvider);
        }

        // Register other providers when they become available
        // These will be implemented in Phase 2
        if (allowedProviders.includes('oauth')) {
            const oauthProvider = new OAuthAuthProvider();
            authService.registerProvider(oauthProvider);
        }

        if (allowedProviders.includes('saml')) {
            const samlProvider = new SAMLAuthProvider();
            authService.registerProvider(samlProvider);
        }

        if (allowedProviders.includes('ldap')) {
            const ldapProvider = new LDAPAuthProvider();
            authService.registerProvider(ldapProvider);
        }

        if (allowedProviders.includes('session')) {
            const sessionProvider = new SessionAuthProvider();
            authService.registerProvider(sessionProvider);
        }

        if (allowedProviders.includes('api_key')) {
            // TODO: Register API Key provider when implemented
            console.log('API Key provider requested but not yet implemented');
        }
    }

    /**
     * Registers providers based on configuration (synchronous version)
     */
    private static registerProvidersFromConfigSync(authService: EnterpriseAuthService, config: IAuthConfig): void {
        const allowedProviders = (config.get('allowedProviders')) || ['jwt'];

        // Always register JWT provider as fallback
        if (allowedProviders.includes('jwt')) {
            const jwtProvider = new JwtAuthProvider();
            authService.registerProvider(jwtProvider);
        }

        // Register other providers when they become available
        if (allowedProviders.includes('oauth')) {
            const oauthProvider = new OAuthAuthProvider();
            authService.registerProvider(oauthProvider);
        }

        if (allowedProviders.includes('saml')) {
            const samlProvider = new SAMLAuthProvider();
            authService.registerProvider(samlProvider);
        }

        if (allowedProviders.includes('ldap')) {
            const ldapProvider = new LDAPAuthProvider();
            authService.registerProvider(ldapProvider);
        }

        if (allowedProviders.includes('session')) {
            const sessionProvider = new SessionAuthProvider();
            authService.registerProvider(sessionProvider);
        }

        if (allowedProviders.includes('api_key')) {
            console.log('API Key provider requested but not yet implemented');
        }
    }
    /**
     * Creates enterprise authentication service with default components
     */
    static createDefault(): EnterpriseAuthService {
        const repository = new LocalAuthRepository();
        const logger = new ConsoleAuthLogger();
        const metrics = new InMemoryAuthMetrics();
        const security = new EnterpriseSecurityService();
        const config = new DefaultAuthConfig();

        const authService = new EnterpriseAuthService(
            repository,
            logger,
            metrics,
            security,
            config
        );

        // Register JWT provider
        const jwtProvider = new JwtAuthProvider();
        authService.registerProvider(jwtProvider);

        return authService;
    }

    /**
     * Creates enterprise authentication service for specific environment
     *
     * Loads configuration from files and environment variables,
     * then creates appropriately configured authentication service.
     */
    static async createForEnvironment(environment?: string): Promise<EnterpriseAuthService> {
        try {
            // Load configuration for the specified environment
            const config = await loadAuthConfiguration(environment);

            // Validate configuration
            const validation = config.validate();
            if (!validation.success) {
                throw new Error(`Invalid authentication configuration: ${validation.error?.message}`);
            }

            // Create dependencies
            const repository = new LocalAuthRepository();
            const logger = new ConsoleAuthLogger();
            const metrics = new InMemoryAuthMetrics();
            const security = new EnterpriseSecurityService();

            // Create authentication service with loaded configuration
            const authService = new EnterpriseAuthService(
                repository,
                logger,
                metrics,
                security,
                config
            );

            // Register providers based on configuration
            await this.registerProvidersFromConfig(authService, config);

            return authService;
        } catch (error) {
            console.error('Failed to create authentication service for environment:', error);

            // Fallback to default service
            console.warn('Falling back to default authentication service');
            return this.createDefault();
        }
    }

    /**
     * Creates authentication service with environment variables only
     */
    static createFromEnvironment(customEnv?: Record<string, string | undefined>): EnterpriseAuthService {
        const config = createEnvironmentAuthConfig(customEnv);

        // Validate configuration
        const validation = config.validate();
        if (!validation.success) {
            throw new Error(`Invalid environment configuration: ${validation.error?.message}`);
        }

        const repository = new LocalAuthRepository();
        const logger = new ConsoleAuthLogger();
        const metrics = new InMemoryAuthMetrics();
        const security = new EnterpriseSecurityService();

        const authService = new EnterpriseAuthService(
            repository,
            logger,
            metrics,
            security,
            config
        );

        // Register providers based on configuration
        this.registerProvidersFromConfigSync(authService, config);

        return authService;
    }

    /**
     * Creates authentication service with custom configuration loader
     */
    static async createWithConfigLoader(loader: AuthConfigLoader): Promise<EnterpriseAuthService> {
        const config = await loader.loadConfiguration();

        // Validate configuration
        const validation = config.validate();
        if (!validation.success) {
            throw new Error(`Invalid configuration: ${validation.error?.message}`);
        }

        const repository = new LocalAuthRepository();
        const logger = new ConsoleAuthLogger();
        const metrics = new InMemoryAuthMetrics();
        const security = new EnterpriseSecurityService();

        const authService = new EnterpriseAuthService(
            repository,
            logger,
            metrics,
            security,
            config
        );

        // Register providers based on configuration
        await this.registerProvidersFromConfig(authService, config);

        return authService;
    }

    /**
     * Creates authentication service with custom dependencies
     */
    static createWithDependencies(dependencies: {
        repository?: IAuthRepository;
        logger?: IAuthLogger;
        metrics?: IAuthMetrics;
        security?: IAuthSecurityService;
        config?: IAuthConfig;
    }): EnterpriseAuthService {
        const repository = dependencies.repository || new LocalAuthRepository();
        const logger = dependencies.logger || new ConsoleAuthLogger();
        const metrics = dependencies.metrics || new InMemoryAuthMetrics();
        const security = dependencies.security || new EnterpriseSecurityService();
        const config = dependencies.config || new DefaultAuthConfig();

        return new EnterpriseAuthService(
            repository,
            logger,
            metrics,
            security,
            config
        );
    }

    /**
     * Creates authentication service with additional providers
     */
    static createWithProviders(
        baseService: EnterpriseAuthService,
        additionalProviders: IAuthProvider[]
    ): EnterpriseAuthService {
        const enhancedService = this.createWithDependencies({
            repository: (baseService as any).repository,
            logger: (baseService as any).logger,
            metrics: (baseService as any).metrics,
            security: (baseService as any).security,
            config: (baseService as any).config
        });

        // Register additional providers
        additionalProviders.forEach(provider => {
            enhancedService.registerProvider(provider);
        });

        return enhancedService;
    }

    /**
     * Creates authentication service with plugins
     */
    static createWithPlugins(
        baseService: EnterpriseAuthService,
        plugins: IAuthPlugin[]
    ): EnterpriseAuthService {
        const enhancedService = this.createWithDependencies({
            repository: (baseService as any).repository,
            logger: (baseService as any).logger,
            metrics: (baseService as any).metrics,
            security: (baseService as any).security,
            config: (baseService as any).config
        });

        // Register plugins
        plugins.forEach(plugin => {
            enhancedService.registerPlugin(plugin);
        });

        return enhancedService;
    }

    /**
     * Gets singleton instance (for backward compatibility)
     */
    private static instance: EnterpriseAuthService | null = null;

    static getInstance(): EnterpriseAuthService {
        if (!this.instance) {
            this.instance = this.createDefault();
        }
        return this.instance;
    }

    /**
     * Gets singleton instance for current environment
     */
    static async getInstanceForEnvironment(environment?: string): Promise<EnterpriseAuthService> {
        if (!this.instance) {
            this.instance = await this.createForEnvironment(environment);
        }
        return this.instance;
    }

    /**
     * Resets singleton instance
     */
    static resetInstance(): void {
        this.instance = null;
    }

    // ==================== DYNAMIC PROVIDER REGISTRATION ====================

    /**
     * Registers a new provider dynamically at runtime
     */
    static async registerProvider(
        serviceId: string,
        provider: IAuthProvider,
        config?: IAuthConfig
    ): Promise<AuthResult<void>> {
        try {
            let authService = this.activeServices.get(serviceId);

            if (!authService) {
                // Create new service if it doesn't exist
                authService = await this.createDefault();
                this.activeServices.set(serviceId, authService);
            }

            // Initialize provider if needed
            if (provider.initialize) {
                await provider.initialize();
            }

            // Configure provider if config provided
            if (config) {
                provider.configure(config.getAll());
            }

            // Register provider with service
            authService.registerProvider(provider);

            // Store in registry for management
            this.providerRegistry.set(provider.name, provider);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: `Failed to register provider: ${error.message}`,
                    code: 'PROVIDER_REGISTRATION_FAILED'
                }
            };
        }
    }

    /**
     * Gets list of registered providers
     */
    static getRegisteredProviders(): string[] {
        return Array.from(this.providerRegistry.keys());
    }

    /**
     * Gets list of active services
     */
    static getActiveServices(): string[] {
        return Array.from(this.activeServices.keys());
    }

    /**
     * Unregisters a provider dynamically at runtime
     */
    static async unregisterProvider(
        serviceId: string,
        providerName: string,
        migrateSessions: boolean = true
    ): Promise<AuthResult<void>> {
        try {
            const authService = this.activeServices.get(serviceId);

            if (!authService) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error' as any,
                        message: `Service ${serviceId} not found`,
                        code: 'SERVICE_NOT_FOUND'
                    }
                };
            }

            const provider = this.providerRegistry.get(providerName);

            if (!provider) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error' as any,
                        message: `Provider ${providerName} not found`,
                        code: 'PROVIDER_NOT_FOUND'
                    }
                };
            }

            // Unregister provider
            authService.unregisterProvider(provider);

            // Remove from registry
            this.providerRegistry.delete(providerName);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: `Failed to unregister provider: ${error.message}`,
                    code: 'PROVIDER_UNREGISTRATION_FAILED'
                }
            };
        }
    }

    /**
     * Switches active provider for a service
     */
    static async switchProvider(
        serviceId: string,
        newProviderName: string,
        migrateSessions: boolean = true
    ): Promise<AuthResult<void>> {
        try {
            const authService = this.activeServices.get(serviceId);

            if (!authService) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error' as any,
                        message: `Service ${serviceId} not found`,
                        code: 'SERVICE_NOT_FOUND'
                    }
                };
            }

            const newProvider = this.providerRegistry.get(newProviderName);

            if (!newProvider) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error' as any,
                        message: `Provider ${newProviderName} not found`,
                        code: 'PROVIDER_NOT_FOUND'
                    }
                };
            }

            // Switch to new provider
            authService.setActiveProvider(newProvider);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: `Failed to switch provider: ${error.message}`,
                    code: 'PROVIDER_SWITCH_FAILED'
                }
            };
        }
    }

    /**
     * Gets provider by name
     */
    static getProvider(providerName: string): IAuthProvider | undefined {
        return this.providerRegistry.get(providerName);
    }

    /**
     * Gets service by ID
     */
    static getService(serviceId: string): EnterpriseAuthService | undefined {
        return this.activeServices.get(serviceId);
    }
}

/**
 * Main authentication module exports
 */
export {
    EnterpriseAuthService,
    AnalyticsPlugin,
    SecurityPlugin
};

// Type-only exports for interfaces
export type {
    IAuthProvider,
    IAuthRepository,
    IAuthValidator,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
};
