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
} from './interfaces/authInterfaces';

import { EnterpriseAuthService } from './enterprise/AuthService';
import { JwtAuthProvider } from './providers/JwtAuthProvider';
import { LocalAuthRepository } from './repositories/LocalAuthRepository';
import { ConsoleAuthLogger } from './loggers/ConsoleAuthLogger';
import { InMemoryAuthMetrics } from './metrics/InMemoryAuthMetrics';
import { EnterpriseSecurityService } from './security/EnterpriseSecurityService';
import { DefaultAuthConfig } from './config/DefaultAuthConfig';

/**
 * Factory for creating authentication services
 * 
 * Implements factory pattern for creating configured
 * authentication services with proper dependency injection.
 */
export class AuthModuleFactory {
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
     * Resets singleton instance
     */
    static resetInstance(): void {
        this.instance = null;
    }
}

/**
 * Main authentication module exports
 */
export {
    EnterpriseAuthService
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
