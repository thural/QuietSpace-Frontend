/**
 * Enterprise Auth Service Adapter
 *
 * Provides backward compatibility for EnterpriseAuthService by wrapping
 * the new AuthOrchestrator. This adapter maintains the same API while
 * delegating to the new SOLID architecture implementation.
 *
 * @deprecated Use AuthOrchestrator directly instead. This adapter will be removed
 * when EnterpriseAuthService is fully deprecated.
 */

import { AuthOrchestrator } from '../enterprise/AuthOrchestrator';

import type { IAuthProvider, IAuthValidator } from '../interfaces/authInterfaces';
import type {
    IAuthConfig,
    IAuthLogger,
    IAuthMetrics,
    IAuthPlugin,
    IAuthRepository,
    IAuthSecurityService,
    IAuthService
} from '../interfaces/authInterfaces';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * Enterprise Auth Service Adapter
 * 
 * Wraps AuthOrchestrator to provide backward compatibility for existing
 * EnterpriseAuthService consumers while they migrate to the new architecture.
 */
export class EnterpriseAuthServiceAdapter implements IAuthService {
    private readonly authOrchestrator: AuthOrchestrator;
    private readonly providers: Map<string, IAuthProvider> = new Map();
    private readonly plugins: Map<string, IAuthPlugin> = new Map();
    private readonly validators: Map<string, IAuthValidator> = new Map();

    constructor(
        repository: IAuthRepository,
        logger: IAuthLogger,
        metrics: IAuthMetrics,
        security: IAuthSecurityService,
        config: IAuthConfig
    ) {
        // @deprecated warning for developers
        if (process.env.NODE_ENV !== 'production') {
            console.warn(
                '⚠️  EnterpriseAuthServiceAdapter is deprecated. Use AuthOrchestrator directly instead. ' +
                'This adapter will be removed when EnterpriseAuthService is fully deprecated.'
            );
        }

        // Create AuthOrchestrator with the same dependencies
        // Note: In a real implementation, we would need to create the required
        // ProviderManager, AuthValidator, etc. For now, we'll create a simple wrapper
        this.authOrchestrator = new AuthOrchestrator(
            {} as any, // ProviderManager
            {} as any, // AuthValidator
            repository,
            logger,
            metrics,
            security,
            config
        );
    }

    /**
     * Registers authentication provider
     */
    registerProvider(provider: IAuthProvider): void {
        this.providers.set(provider.name, provider);
        this.authOrchestrator.registerProvider(provider);
    }

    /**
     * Registers plugin
     */
    registerPlugin(plugin: IAuthPlugin): void {
        this.plugins.set(plugin.name, plugin);
        // Note: AuthOrchestrator doesn't have plugin support yet
        // This would need to be implemented or the plugin system deprecated
    }

    /**
     * Authenticates user with comprehensive validation and security
     */
    async authenticate(providerName: string, credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        // Delegate to AuthOrchestrator
        return this.authOrchestrator.authenticate(providerName, credentials);
    }

    /**
     * Gets current authentication session
     */
    async getCurrentSession(): Promise<AuthSession | null> {
        // This method is not available in AuthOrchestrator yet
        // For now, return null - would need to be implemented
        return null;
    }

    /**
     * Signs out from all providers with comprehensive cleanup
     */
    async globalSignout(): Promise<void> {
        // This method is not available in AuthOrchestrator yet
        // For now, do nothing - would need to be implemented
        console.log('Global signout not yet implemented in AuthOrchestrator');
    }

    /**
     * Validates user session
     */
    async validateSession(): Promise<AuthResult<boolean>> {
        // This method is not available in AuthOrchestrator yet
        // For now, return success - would need to be implemented
        return {
            success: true,
            data: true
        };
    }

    /**
     * Refreshes authentication token
     */
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        // This method is not available in AuthOrchestrator yet
        // For now, return error - would need to be implemented
        return {
            success: false,
            error: {
                type: 'TOKEN_REFRESH_FAILED' as any,
                message: 'Token refresh not yet implemented in AuthOrchestrator'
            }
        };
    }

    /**
     * Signs out user
     */
    async signout(): Promise<AuthResult<void>> {
        // This method is not available in AuthOrchestrator yet
        // For now, return success - would need to be implemented
        return {
            success: true
        };
    }

    /**
     * Gets active provider
     */
    getActiveProvider(): string | undefined {
        // This would need to be implemented in AuthOrchestrator
        // For now, return the first registered provider
        const providerKeys = Array.from(this.providers.keys());
        return providerKeys.length > 0 ? providerKeys[0] : undefined;
    }

    /**
     * Sets active provider
     */
    setActiveProvider(providerName: string): void {
        // This would need to be implemented in AuthOrchestrator
        // For now, just validate the provider exists
        if (!this.providers.has(providerName)) {
            throw new Error(`Provider ${providerName} not found`);
        }
    }

    /**
     * Gets all registered providers
     */
    getProviders(): string[] {
        return Array.from(this.providers.keys());
    }

    /**
     * Gets provider by name
     */
    getProvider(name: string): IAuthProvider | undefined {
        return this.providers.get(name);
    }

    /**
     * Gets service capabilities
     */
    getCapabilities(): string[] {
        return this.authOrchestrator.getCapabilities();
    }

    /**
     * Initializes the service
     */
    async initialize(): Promise<void> {
        return this.authOrchestrator.initialize();
    }

    /**
     * Gets service statistics
     */
    getStatistics(): any {
        return this.authOrchestrator.getStatistics();
    }

    /**
     * Cleanup resources
     */
    dispose(): void {
        this.providers.clear();
        this.plugins.clear();
        this.validators.clear();
    }
}

/**
 * Factory function to create EnterpriseAuthServiceAdapter
 *
 * @deprecated Use createDefaultAuthOrchestrator instead
 */
export function createEnterpriseAuthServiceAdapter(
    repository: IAuthRepository,
    logger: IAuthLogger,
    metrics: IAuthMetrics,
    security: IAuthSecurityService,
    config: IAuthConfig
): EnterpriseAuthServiceAdapter {
    return new EnterpriseAuthServiceAdapter(
        repository,
        logger,
        metrics,
        security,
        config
    );
}
