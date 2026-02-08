/**
 * Authentication System Factory Functions
 *
 * Factory functions for creating authentication services following Black Box pattern.
 * Provides clean service creation with dependency injection support and SOLID principles.
 */

import { DefaultAuthConfig } from './config/DefaultAuthConfig';
import { AuthOrchestrator } from './enterprise/AuthOrchestrator';
import { ProviderManager } from './enterprise/ProviderManager';
import { AuthValidator } from './enterprise/AuthValidator';
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

import type { IAuthRepository, IAuthLogger, IAuthMetrics, IAuthSecurityService, IAuthConfig } from './interfaces/authInterfaces';
import type { AuthResult, AuthUser, AuthCredentials, AuthToken, AuthSession, AuthEvent } from './types/auth.domain.types';

/**
 * Creates a default authentication orchestrator (SOLID implementation)
 *
 * @param config - Optional authentication configuration
 * @returns Configured authentication orchestrator
 */
export function createDefaultAuthOrchestrator(config?: Partial<IAuthConfig>): AuthOrchestrator {
    // Create configuration instance
    const finalConfig = new DefaultAuthConfig();

    // Apply any overrides if provided
    if (config) {
        // For now, we'll use the default config as is
        // TODO: Implement config merging in DefaultAuthConfig
    }

    // Create default services
    const repository = new LocalAuthRepository();
    const logger = new ConsoleAuthLogger();
    const metrics = new InMemoryAuthMetrics();
    const security = new EnterpriseSecurityService();

    // Create new SOLID services
    const providerManager = new ProviderManager(logger);
    const authValidator = new AuthValidator(security, finalConfig, logger);

    // Create and configure the orchestrator
    const orchestrator = new AuthOrchestrator(
        providerManager,
        authValidator,
        repository,
        logger,
        metrics,
        security,
        finalConfig
    );

    // Register default providers
    registerDefaultProviders(orchestrator, finalConfig);

    return orchestrator;
}

/**
 * Creates a custom authentication orchestrator with specific configuration
 *
 * @param config - Authentication configuration
 * @returns Configured authentication orchestrator
 */
export function createCustomAuthOrchestrator(config: IAuthConfig): AuthOrchestrator {
    // Create default services
    const repository = new LocalAuthRepository();
    const logger = new ConsoleAuthLogger();
    const metrics = new InMemoryAuthMetrics();
    const security = new EnterpriseSecurityService();

    // Create new SOLID services
    const providerManager = new ProviderManager(logger);
    const authValidator = new AuthValidator(security, config, logger);

    // Create and configure the orchestrator
    const orchestrator = new AuthOrchestrator(
        providerManager,
        authValidator,
        repository,
        logger,
        metrics,
        security,
        config
    );

    // Register all providers
    registerAllProviders(orchestrator);

    return orchestrator;
}

/**
 * Creates an authentication orchestrator with all providers
 *
 * @param config - Optional authentication configuration
 * @returns Authentication orchestrator with all providers
 */
export function createAuthOrchestratorWithAllProviders(config?: Partial<IAuthConfig>): AuthOrchestrator {
    // Create configuration instance
    const finalConfig = new DefaultAuthConfig();

    // Apply any overrides if provided
    if (config) {
        // For now, we'll use the default config as is
        // TODO: Implement config merging in DefaultAuthConfig
    }

    // Create default services
    const repository = new LocalAuthRepository();
    const logger = new ConsoleAuthLogger();
    const metrics = new InMemoryAuthMetrics();
    const security = new EnterpriseSecurityService();

    // Create new SOLID services
    const providerManager = new ProviderManager(logger);
    const authValidator = new AuthValidator(security, finalConfig, logger);

    // Create and configure the orchestrator
    const orchestrator = new AuthOrchestrator(
        providerManager,
        authValidator,
        repository,
        logger,
        metrics,
        security,
        finalConfig
    );

    // Register all providers
    registerAllProviders(orchestrator);

    return orchestrator;
}

/**
 * Registers default providers based on configuration
 */
function registerDefaultProviders(orchestrator: AuthOrchestrator, config: IAuthConfig): void {
    const allowedProviders = (config.get<string[]>('allowedProviders')) || ['jwt'];

    // Always register JWT provider as fallback
    if (allowedProviders.includes('jwt')) {
        const jwtProvider = new JwtAuthProvider();
        orchestrator.registerProvider(jwtProvider);
    }

    // Register other providers when they become available
    if (allowedProviders.includes('oauth')) {
        const oauthProvider = new OAuthAuthProvider();
        orchestrator.registerProvider(oauthProvider);
    }

    if (allowedProviders.includes('saml')) {
        const samlProvider = new SAMLAuthProvider();
        orchestrator.registerProvider(samlProvider);
    }

    if (allowedProviders.includes('ldap')) {
        const ldapProvider = new LDAPAuthProvider();
        orchestrator.registerProvider(ldapProvider);
    }

    if (allowedProviders.includes('session')) {
        const sessionProvider = new SessionAuthProvider();
        orchestrator.registerProvider(sessionProvider);
    }
}

/**
 * Registers all available providers
 */
function registerAllProviders(orchestrator: AuthOrchestrator): void {
    orchestrator.registerProvider(new JwtAuthProvider());
    orchestrator.registerProvider(new OAuthAuthProvider());
    orchestrator.registerProvider(new SAMLAuthProvider());
    orchestrator.registerProvider(new SessionAuthProvider());
    orchestrator.registerProvider(new LDAPAuthProvider());
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
        plugin
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
    register(name: string, factory: (config?: Partial<IAuthConfig>) => AuthOrchestrator): void {
        // In a real implementation, this would store the factory
        console.log(`Registered auth factory: ${name}`);
    },

    /**
     * Get a registered auth factory
     */
    get(name: string): ((config?: Partial<IAuthConfig>) => AuthOrchestrator) | undefined {
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
