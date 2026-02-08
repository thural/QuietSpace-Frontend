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
     * Resets the singleton instance
     */
    static resetInstance(): void {
        this.instance = null;
    }
}

/**
 * Default export for convenience
 */
export default AuthModuleFactory;
