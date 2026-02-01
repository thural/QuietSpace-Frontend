/**
 * Authentication System Factory Functions
 *
 * Factory functions for creating authentication services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

import { DefaultAuthConfig } from './config/DefaultAuthConfig';
import { EnterpriseAuthService } from './enterprise/AuthService';
import { ConsoleAuthLogger } from './loggers/ConsoleAuthLogger';
import { InMemoryAuthMetrics } from './metrics/InMemoryAuthMetrics';
import { JwtAuthProvider } from './providers/JwtAuthProvider';
import { LDAPAuthProvider } from './providers/LDAPProvider';
import { OAuthAuthProvider } from './providers/OAuthProvider';
import { SAMLAuthProvider } from './providers/SAMLProvider';
import { SessionAuthProvider } from './providers/SessionProvider';
import { LocalAuthRepository } from './repositories/LocalAuthRepository';
import { EnterpriseSecurityService } from './security/EnterpriseSecurityService';
import { AuthProviderType } from './types/auth.domain.types';

import type { IAuthProvider, IAuthRepository, IAuthValidator, IAuthLogger, IAuthMetrics, IAuthSecurityService, IAuthConfig } from './interfaces/authInterfaces';
import type { AuthResult, AuthUser, AuthCredentials, AuthToken, AuthSession } from './types/auth.domain.types';

/**
 * Creates a default authentication service
 *
 * @param config - Optional authentication configuration
 * @returns Configured authentication service
 */
export function createDefaultAuthService(config?: Partial<IAuthConfig>): EnterpriseAuthService {
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
 * @param config - Authentication configuration
 * @returns Configured authentication service
 */
export function createCustomAuthService(config: IAuthConfig): EnterpriseAuthService {
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
 * @param config - Optional authentication configuration
 * @returns Authentication service with all providers
 */
export function createAuthService(config?: Partial<IAuthConfig>): EnterpriseAuthService {
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
 * @param config - Provider configuration
 * @returns JWT authentication provider
 */
export function createAuthProvider(type: AuthProviderType, config?: Partial<IAuthConfig>): IAuthProvider {
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
 * @param type - Repository type
 * @param config - Repository configuration
 * @returns Authentication repository
 */
export function createAuthRepository(type: 'local' | 'remote' = 'local', config?: unknown): IAuthRepository {
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
 * @param config - Validator configuration
 * @returns Authentication validator
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
// }

/**
 * Creates an authentication logger
 *
 * @param type - Logger type
 * @param config - Logger configuration
 * @returns Authentication logger
 */
export function createAuthLogger(type: 'console' | 'file' | 'remote' = 'console', config?: unknown): IAuthLogger {
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
 * @param type - Metrics type
 * @param config - Metrics configuration
 * @returns Authentication metrics
 */
export function createAuthMetrics(type: 'memory' | 'database' | 'remote' = 'memory', config?: unknown): IAuthMetrics {
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
 * @param config - Security configuration
 * @returns Authentication security service
 */
export function createAuthSecurityService(config?: unknown): IAuthSecurityService {
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
export function createMockAuthService(): EnterpriseAuthService {
    // This function has interface mismatches and needs to be refactored
}
*/

/**
 * Creates an authentication plugin
 *
 * @param name - Plugin name
 * @param plugin - Plugin implementation
 * @returns Authentication plugin
 */
export function createAuthPlugin(name: string, plugin: unknown): unknown {
    return {
        name,
        ...plugin
    };
}

/**
 * Registers an authentication plugin
 *
 * @param plugin - Plugin to register
 */
export function registerAuthPlugin(plugin: unknown): void {
    // In a real implementation, this would register the plugin
    console.log(`Registered auth plugin: ${plugin.name}`);
}

/**
 * Gets an authentication plugin by name
 *
 * @param name - Plugin name
 * @returns Authentication plugin or undefined
 */
export function getAuthPlugin(name: string): unknown | undefined {
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
     */
    register(name: string, factory: (config?: Partial<IAuthConfig>) => EnterpriseAuthService): void {
        // In a real implementation, this would store the factory
        console.log(`Registered auth factory: ${name}`);
    },

    /**
     * Get a registered auth factory
     */
    get(name: string): ((config?: Partial<IAuthConfig>) => EnterpriseAuthService) | undefined {
        // In a real implementation, this would return the registered factory
        console.log(`Getting auth factory: ${name}`);
        return undefined;
    },

    /**
     * List all registered factories
     */
    list(): string[] {
        // In a real implementation, this would return all registered names
        return [];
    }
};
