/**
 * Authentication System Factory Functions
 * 
 * Factory functions for creating authentication services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

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

import { AuthProviderType } from './types/auth.domain.types.js';

/**
 * Creates a default authentication service
 * 
 * @param {Partial<IAuthConfig>} [config] - Optional authentication configuration
 * @returns {EnterpriseAuthService} Configured authentication service
 */
export function createDefaultAuthService(config) {
    // Create configuration instance
    const finalConfig = new DefaultAuthConfig();

    // Apply any overrides if provided (this would need to be implemented in DefaultAuthConfig)
    if (config) {
        // For now, we'll use the default config as is
        // TODO: Implement config merging in DefaultAuthConfig
    }

    // Create default services
    const repository = new LocalAuthRepository();
    const logger = new ConsoleAuthLogger();
    const metrics = new InMemoryAuthMetrics();
    const security = new EnterpriseSecurityService();

    // Create and configure the service with proper constructor
    const authService = new EnterpriseAuthService(
        repository,
        logger,
        metrics,
        security,
        finalConfig
    );

    return authService;
}

/**
 * Creates a custom authentication service with specific configuration
 * 
 * @param {IAuthConfig} config - Authentication configuration
 * @returns {EnterpriseAuthService} Configured authentication service
 */
export function createCustomAuthService(config) {
    // Create default services
    const repository = new LocalAuthRepository();
    const logger = new ConsoleAuthLogger();
    const metrics = new InMemoryAuthMetrics();
    const security = new EnterpriseSecurityService();

    // Create and configure the service with proper constructor
    const authService = new EnterpriseAuthService(
        repository,
        logger,
        metrics,
        security,
        config
    );

    // Add default providers (simplified for now)
    authService.registerProvider(new JwtAuthProvider());
    authService.registerProvider(new OAuthAuthProvider());
    authService.registerProvider(new SAMLAuthProvider());
    authService.registerProvider(new SessionAuthProvider());
    authService.registerProvider(new LDAPAuthProvider());

    return authService;
}

/**
 * Creates an authentication service with all providers
 * 
 * @param {Partial<IAuthConfig>} [config] - Optional authentication configuration
 * @returns {EnterpriseAuthService} Authentication service with all providers
 */
export function createAuthService(config) {
    // Create configuration instance
    const finalConfig = new DefaultAuthConfig();

    // Create default services
    const repository = new LocalAuthRepository();
    const logger = new ConsoleAuthLogger();
    const metrics = new InMemoryAuthMetrics();
    const security = new EnterpriseSecurityService();

    // Create and configure the service with proper constructor
    const authService = new EnterpriseAuthService(
        repository,
        logger,
        metrics,
        security,
        finalConfig
    );

    // Add all available providers
    authService.registerProvider(new JwtAuthProvider());
    authService.registerProvider(new OAuthAuthProvider());
    authService.registerProvider(new SAMLAuthProvider());
    authService.registerProvider(new SessionAuthProvider());
    authService.registerProvider(new LDAPAuthProvider());

    return authService;
}

/**
 * Creates a JWT authentication provider
 * 
 * @param {AuthProviderType} type - Provider type
 * @param {Partial<IAuthConfig>} [config] - Provider configuration
 * @returns {IAuthProvider} JWT authentication provider
 */
export function createAuthProvider(type, config) {
    const finalConfig = { ...DefaultAuthConfig, ...config };

    switch (type) {
        case AuthProviderType.JWT:
            return new JwtAuthProvider();
        case AuthProviderType.OAUTH:
            return new OAuthAuthProvider();
        case AuthProviderType.SAML:
            return new SAMLAuthProvider();
        case AuthProviderType.SESSION:
            return new SessionAuthProvider();
        case AuthProviderType.LDAP:
            return new LDAPAuthProvider();
        default:
            throw new Error(`Unsupported auth provider type: ${type}`);
    }
}

/**
 * Creates an authentication repository
 * 
 * @param {'local'|'remote'} [type='local'] - Repository type
 * @param {*} [config] - Repository configuration
 * @returns {IAuthRepository} Authentication repository
 */
export function createAuthRepository(type = 'local', config) {
    switch (type) {
        case 'local':
            return new LocalAuthRepository();
        case 'remote':
            // In a real implementation, this would create a remote repository
            throw new Error('Remote repository not implemented yet');
        default:
            return new LocalAuthRepository();
    }
}

/**
 * Creates an authentication validator
 * 
 * @param {*} [config] - Validator configuration
 * @returns {IAuthValidator} Authentication validator
 */
// TODO: Fix interface mismatches in auth factory
// The following functions have interface issues and need to be refactored:
// - createAuthValidator
// - createAuthLogger  
// - createAuthMetrics
// - createAuthSecurity
// - createMockAuthService
// - createMockUser
// - createMockToken
// These will be fixed in a separate PR to focus on core functionality first

/**
 * Creates an authentication logger
 * 
 * @param {'console'|'file'|'remote'} [type='console'] - Logger type
 * @param {*} [config] - Logger configuration
 * @returns {IAuthLogger} Authentication logger
 */
export function createAuthLogger(type = 'console', config) {
    switch (type) {
        case 'console':
            return new ConsoleAuthLogger();
        case 'file':
            // In a real implementation, this would create a file logger
            throw new Error('File logger not implemented yet');
        case 'remote':
            // In a real implementation, this would create a remote logger
            throw new Error('Remote logger not implemented yet');
        default:
            return new ConsoleAuthLogger();
    }
}

/**
 * Creates authentication metrics
 * 
 * @param {'memory'|'database'|'remote'} [type='memory'] - Metrics type
 * @param {*} [config] - Metrics configuration
 * @returns {IAuthMetrics} Authentication metrics
 */
export function createAuthMetrics(type = 'memory', config) {
    switch (type) {
        case 'memory':
            return new InMemoryAuthMetrics();
        case 'database':
            // In a real implementation, this would create database metrics
            throw new Error('Database metrics not implemented yet');
        case 'remote':
            // In a real implementation, this would create remote metrics
            throw new Error('Remote metrics not implemented yet');
        default:
            return new InMemoryAuthMetrics();
    }
}

/**
 * Creates an authentication security service
 * 
 * @param {*} [config] - Security configuration
 * @returns {IAuthSecurityService} Authentication security service
 */
export function createAuthSecurityService(config) {
    return new EnterpriseSecurityService();
}

// TODO: Fix mock service interface mismatches
// The following functions have complex interface issues and need to be refactored:
// - createMockAuthService (returns plain object instead of EnterpriseAuthService)
// - createMockUser (properties don't match AuthUser interface)
// - createMockToken (properties don't match AuthToken interface)
// These will be fixed in a separate PR to focus on core functionality first

// Mock functions commented out due to interface mismatches
/*
export function createMockAuthService() {
    // This function has interface mismatches and needs to be refactored
}
*/

/**
 * Creates an authentication plugin
 * 
 * @param {string} name - Plugin name
 * @param {*} plugin - Plugin implementation
 * @returns {*} Authentication plugin
 */
export function createAuthPlugin(name, plugin) {
    return {
        name,
        ...plugin
    };
}

/**
 * Registers an authentication plugin
 * 
 * @param {*} plugin - Plugin to register
 */
export function registerAuthPlugin(plugin) {
    // In a real implementation, this would register the plugin
    console.log(`Registered auth plugin: ${plugin.name}`);
}

/**
 * Gets an authentication plugin by name
 * 
 * @param {string} name - Plugin name
 * @returns {*|undefined} Authentication plugin or undefined
 */
export function getAuthPlugin(name) {
    // In a real implementation, this would return the registered plugin
    console.log(`Getting auth plugin: ${name}`);
    return undefined;
}

/**
 * Authentication factory registry for extensible creation
 */
export const authFactoryRegistry = {
    /**
     * Register a custom auth factory
     * @param {string} name 
     * @param {function(Partial<IAuthConfig>): EnterpriseAuthService} factory 
     */
    register(name, factory) {
        // In a real implementation, this would store the factory
        console.log(`Registered auth factory: ${name}`);
    },

    /**
     * Get a registered auth factory
     * @param {string} name 
     * @returns {function(Partial<IAuthConfig>): EnterpriseAuthService|undefined}
     */
    get(name) {
        // In a real implementation, this would return the registered factory
        console.log(`Getting auth factory: ${name}`);
        return undefined;
    },

    /**
     * List all registered factories
     * @returns {string[]}
     */
    list() {
        // In a real implementation, this would return all registered names
        return [];
    }
};
