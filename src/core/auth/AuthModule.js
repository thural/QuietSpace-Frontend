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

import {
    IAuthProvider,
    IAuthRepository,
    IAuthValidator,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from './interfaces/authInterfaces.js';

import { AuthResult } from './types/auth.domain.types.js';

import { EnterpriseAuthService } from './enterprise/AuthService.js';
import { JwtAuthProvider } from './providers/JwtAuthProvider.js';
import { OAuthAuthProvider } from './providers/OAuthProvider.js';
import { SAMLAuthProvider } from './providers/SAMLProvider.js';
import { SessionAuthProvider } from './providers/SessionProvider.js';
import { LDAPAuthProvider } from './providers/LDAPProvider.js';
import { LocalAuthRepository } from './repositories/LocalAuthRepository.js';
import { ConsoleAuthLogger } from './loggers/ConsoleAuthLogger.js';
import { InMemoryAuthMetrics } from './metrics/InMemoryAuthMetrics.js';
import { EnterpriseSecurityService } from './security/EnterpriseSecurityService.js';
import { DefaultAuthConfig } from './config/DefaultAuthConfig.js';
import { AnalyticsPlugin } from './plugins/AnalyticsPlugin.js';
import { SecurityPlugin } from './plugins/SecurityPlugin.js';
import { AuthConfigLoader, createAuthConfigLoader, loadAuthConfiguration } from './config/AuthConfigLoader.js';
import { EnvironmentAuthConfig, createEnvironmentAuthConfig } from './config/EnvironmentAuthConfig.js';

/**
 * Factory for creating authentication services
 * 
 * Implements factory pattern for creating configured
 * authentication services with proper dependency injection.
 */
export class AuthModuleFactory {
    /** @type {Map<string, EnterpriseAuthService>} */
    static #activeServices = new Map();
    /** @type {Map<string, IAuthProvider>} */
    static #providerRegistry = new Map();

    /**
     * Registers providers based on configuration
     * @param {EnterpriseAuthService} authService 
     * @param {IAuthConfig} config 
     * @returns {Promise<void>}
     * @private
     */
    static async #registerProvidersFromConfig(authService, config) {
        const allowedProviders = config.get('allowedProviders') || ['jwt'];

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
     * @param {EnterpriseAuthService} authService 
     * @param {IAuthConfig} config 
     * @returns {void}
     * @private
     */
    static #registerProvidersFromConfigSync(authService, config) {
        const allowedProviders = config.get('allowedProviders') || ['jwt'];

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
     * @returns {EnterpriseAuthService}
     */
    static createDefault() {
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
     * @param {string} [environment] 
     * @returns {Promise<EnterpriseAuthService>}
     */
    static async createForEnvironment(environment) {
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
            await this.#registerProvidersFromConfig(authService, config);

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
     * @param {Record<string, string|undefined>} [customEnv] 
     * @returns {EnterpriseAuthService}
     */
    static createFromEnvironment(customEnv) {
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
        this.#registerProvidersFromConfigSync(authService, config);

        return authService;
    }

    /**
     * Creates authentication service with custom configuration loader
     * @param {AuthConfigLoader} loader 
     * @returns {Promise<EnterpriseAuthService>}
     */
    static async createWithConfigLoader(loader) {
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
        await this.#registerProvidersFromConfig(authService, config);

        return authService;
    }

    /**
     * Creates authentication service with custom dependencies
     * @param {Object} dependencies 
     * @param {IAuthRepository} [dependencies.repository] 
     * @param {IAuthLogger} [dependencies.logger] 
     * @param {IAuthMetrics} [dependencies.metrics] 
     * @param {IAuthSecurityService} [dependencies.security] 
     * @param {IAuthConfig} [dependencies.config] 
     * @returns {EnterpriseAuthService}
     */
    static createWithDependencies(dependencies) {
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
     * @param {EnterpriseAuthService} baseService 
     * @param {IAuthProvider[]} additionalProviders 
     * @returns {EnterpriseAuthService}
     */
    static createWithProviders(baseService, additionalProviders) {
        const enhancedService = this.createWithDependencies({
            repository: baseService.repository,
            logger: baseService.logger,
            metrics: baseService.metrics,
            security: baseService.security,
            config: baseService.config
        });

        // Register additional providers
        additionalProviders.forEach(provider => {
            enhancedService.registerProvider(provider);
        });

        return enhancedService;
    }

    /**
     * Creates authentication service with plugins
     * @param {EnterpriseAuthService} baseService 
     * @param {IAuthPlugin[]} plugins 
     * @returns {EnterpriseAuthService}
     */
    static createWithPlugins(baseService, plugins) {
        const enhancedService = this.createWithDependencies({
            repository: baseService.repository,
            logger: baseService.logger,
            metrics: baseService.metrics,
            security: baseService.security,
            config: baseService.config
        });

        // Register plugins
        plugins.forEach(plugin => {
            enhancedService.registerPlugin(plugin);
        });

        return enhancedService;
    }

    /** @type {EnterpriseAuthService|null} */
    static #instance = null;

    /**
     * Gets singleton instance (for backward compatibility)
     * @returns {EnterpriseAuthService}
     */
    static getInstance() {
        if (!this.#instance) {
            this.#instance = this.createDefault();
        }
        return this.#instance;
    }

    /**
     * Gets singleton instance for current environment
     * @param {string} [environment] 
     * @returns {Promise<EnterpriseAuthService>}
     */
    static async getInstanceForEnvironment(environment) {
        if (!this.#instance) {
            this.#instance = await this.createForEnvironment(environment);
        }
        return this.#instance;
    }

    /**
     * Resets singleton instance
     * @returns {void}
     */
    static resetInstance() {
        this.#instance = null;
    }

    // ==================== DYNAMIC PROVIDER REGISTRATION ====================

    /**
     * Registers a new provider dynamically at runtime
     * @param {string} serviceId 
     * @param {IAuthProvider} provider 
     * @param {IAuthConfig} [config] 
     * @returns {Promise<AuthResult<void>>}
     */
    static async registerProvider(serviceId, provider, config) {
        try {
            let authService = this.#activeServices.get(serviceId);

            if (!authService) {
                // Create new service if it doesn't exist
                authService = await this.createDefault();
                this.#activeServices.set(serviceId, authService);
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
            this.#providerRegistry.set(provider.name, provider);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to register provider: ${error.message}`,
                    code: 'PROVIDER_REGISTRATION_FAILED'
                }
            };
        }
    }

    /**
     * Gets list of registered providers
     * @returns {string[]}
     */
    static getRegisteredProviders() {
        return Array.from(this.#providerRegistry.keys());
    }

    /**
     * Gets list of active services
     * @returns {string[]}
     */
    static getActiveServices() {
        return Array.from(this.#activeServices.keys());
    }

    /**
     * Unregisters a provider dynamically at runtime
     * @param {string} serviceId 
     * @param {string} providerName 
     * @param {boolean} [migrateSessions=true] 
     * @returns {Promise<AuthResult<void>>}
     */
    static async unregisterProvider(serviceId, providerName, migrateSessions = true) {
        try {
            const authService = this.#activeServices.get(serviceId);

            if (!authService) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: `Service ${serviceId} not found`,
                        code: 'SERVICE_NOT_FOUND'
                    }
                };
            }

            const provider = this.#providerRegistry.get(providerName);

            if (!provider) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: `Provider ${providerName} not found`,
                        code: 'PROVIDER_NOT_FOUND'
                    }
                };
            }

            // Unregister provider
            authService.unregisterProvider(provider);

            // Remove from registry
            this.#providerRegistry.delete(providerName);

            return {
                success: true,
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: `Failed to unregister provider: ${error.message}`,
                    code: 'PROVIDER_UNREGISTRATION_FAILED'
                }
            };
        }
    }

    /**
     * Switches active provider for a service
     * @param {string} serviceId 
     * @param {string} newProviderName 
     * @param {boolean} [migrateSessions=true] 
     * @returns {Promise<AuthResult<void>>}
     */
    static async switchProvider(serviceId, newProviderName, migrateSessions = true) {
        try {
            const authService = this.#activeServices.get(serviceId);

            if (!authService) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
                        message: `Service ${serviceId} not found`,
                        code: 'SERVICE_NOT_FOUND'
                    }
                };
            }

            const newProvider = this.#providerRegistry.get(newProviderName);

            if (!newProvider) {
                return {
                    success: false,
                    error: {
                        type: 'validation_error',
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
                    type: 'server_error',
                    message: `Failed to switch provider: ${error.message}`,
                    code: 'PROVIDER_SWITCH_FAILED'
                }
            };
        }
    }

    /**
     * Gets provider by name
     * @param {string} providerName 
     * @returns {IAuthProvider|undefined}
     */
    static getProvider(providerName) {
        return this.#providerRegistry.get(providerName);
    }

    /**
     * Gets service by ID
     * @param {string} serviceId 
     * @returns {EnterpriseAuthService|undefined}
     */
    static getService(serviceId) {
        return this.#activeServices.get(serviceId);
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

// Note: Type exports are handled through JSDoc in individual interface files
