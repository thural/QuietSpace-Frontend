/**
 * Enterprise authentication service
 * 
 * Implements modular authentication with dependency injection
 * using the existing Inversify container for consistency.
 */

import {
    AuthCredentials,
    AuthResult,
    AuthSession,
    AuthEvent,
    AuthErrorType,
    AuthProviderType,
    AuthUser,
    AuthToken
} from '../types/authTypes';

import type {
    IAuthService,
    IAuthRepository,
    IAuthLogger,
    IAuthMetrics,
    IAuthSecurityService,
    IAuthConfig,
    IAuthPlugin
} from '../interfaces/authInterfaces';

import { IAuthProvider, IAuthValidator } from '../interfaces/authInterfaces';

import { Container, injectable, inject } from 'inversify';

/**
 * Enterprise authentication service implementation
 * 
 * Provides comprehensive authentication with:
 * - Inversify dependency injection
 * - Enterprise security features
 * - Comprehensive logging and metrics
 * - Multiple provider support
 */
@injectable()
export class EnterpriseAuthService implements IAuthService {
    private readonly repository: IAuthRepository;
    private readonly logger: IAuthLogger;
    private readonly metrics: IAuthMetrics;
    private readonly security: IAuthSecurityService;
    private readonly config: IAuthConfig;
    private readonly providers: Map<string, IAuthProvider> = new Map();
    private readonly plugins: Map<string, any> = new Map();
    private readonly validators: Map<string, IAuthValidator> = new Map();

    constructor(
        repository: IAuthRepository,
        logger: IAuthLogger,
        metrics: IAuthMetrics,
        security: IAuthSecurityService,
        config: IAuthConfig
    ) {
        this.repository = repository;
        this.logger = logger;
        this.metrics = metrics;
        this.security = security;
        this.config = config;
    }

    /**
     * Registers authentication provider
     */
    registerProvider(provider: IAuthProvider): void {
        this.providers.set(provider.name, provider);
        this.logger.log({
            type: 'register_provider' as any,
            timestamp: new Date(),
            providerType: provider.type,
            details: { providerName: provider.name }
        });
    }

    /**
     * Registers plugin
     */
    registerPlugin(plugin: IAuthPlugin): void {
        this.plugins.set(plugin.name, plugin);
        this.logger.log({
            type: 'register_plugin' as any,
            timestamp: new Date(),
            details: { pluginName: plugin.name, version: plugin.version }
        });
    }

    /**
     * Authenticates user with comprehensive validation and security
     */
    async authenticate(providerName: string, credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        const startTime = Date.now();

        try {
            // Log authentication attempt
            this.logger.log({
                type: 'login_attempt' as any,
                timestamp: new Date(),
                providerType: providerName as any,
                details: {
                    userId: credentials.email || credentials.username,
                    ipAddress: await this.security.getClientIP()
                }
            });

            // Validate credentials
            const validationResult = await this.validateCredentials(credentials);
            if (!validationResult.success) {
                this.metrics.recordFailure('login_attempt', validationResult.error?.type || 'validation_error' as any, Date.now() - startTime);
                return {
                    success: false,
                    error: validationResult.error,
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId: this.generateRequestId()
                    }
                };
            }

            // Check rate limiting
            const userId = credentials.email || credentials.username;
            if (this.security.checkRateLimit(userId, 1)) {
                this.metrics.recordFailure('login_attempt', 'rate_limited' as any, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'rate_limited' as any,
                        message: 'Too many authentication attempts. Please try again later.',
                        code: 'AUTH_RATE_LIMITED'
                    },
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId: this.generateRequestId()
                    }
                };
            }

            // Get provider
            const provider = this.providers.get(providerName);
            if (!provider) {
                throw new Error(`Authentication provider '${providerName}' not found`);
            }

            // Authenticate with provider
            const authResult = await provider.authenticate(credentials);

            if (authResult.success) {
                // Store session
                await this.repository.storeSession(authResult.data!);

                // Log success
                this.logger.log({
                    type: 'login_success' as any,
                    timestamp: new Date(),
                    providerType: providerName as any,
                    details: {
                        userId: authResult.data?.user.id,
                        sessionId: authResult.data?.token.accessToken.substring(0, 10) + '...'
                    }
                });

                // Record metrics
                this.metrics.recordSuccess('login_attempt', Date.now() - startTime);

                return {
                    success: true,
                    data: authResult.data,
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId: this.generateRequestId()
                    }
                };
            } else {
                // Log failure
                this.logger.log({
                    type: 'login_failure' as any,
                    timestamp: new Date(),
                    providerType: providerName as any,
                    error: authResult.error?.type,
                    details: authResult.error?.details
                });

                // Record metrics
                this.metrics.recordFailure('login_attempt', authResult.error?.type || 'unknown_error' as any, Date.now() - startTime);

                return {
                    success: false,
                    error: authResult.error,
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId: this.generateRequestId()
                    }
                };
            }
        } catch (error) {
            // Log unexpected error
            this.logger.logError(error as Error, {
                provider: providerName,
                operation: 'authenticate'
            });

            // Record metrics
            this.metrics.recordFailure('login_attempt', 'unknown_error' as any, Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'unknown_error' as any,
                    message: 'An unexpected error occurred during authentication',
                    details: { originalError: error.message }
                },
                metadata: {
                    timestamp: new Date(),
                    duration: Date.now() - startTime,
                    requestId: this.generateRequestId()
                }
            };
        }
    }

    /**
     * Validates credentials with all registered validators
     */
    private async validateCredentials(credentials: AuthCredentials): Promise<AuthResult<boolean>> {
        for (const [name, validator] of this.validators) {
            const result = validator.validateCredentials(credentials);
            if (!result.success) {
                return result;
            }
        }
        return { success: true, data: true };
    }

    /**
     * Gets current authentication session
     */
    async getCurrentSession(): Promise<AuthSession | null> {
        try {
            const session = await this.repository.getSession();

            if (session) {
                // Validate session expiration
                if (new Date() > session.expiresAt) {
                    await this.repository.removeSession();
                    return null;
                }
            }

            return session;
        } catch (error) {
            this.logger.logError(error as Error, { operation: 'getCurrentSession' });
            return null;
        }
    }

    /**
     * Signs out from all providers with comprehensive cleanup
     */
    async globalSignout(): Promise<void> {
        const startTime = Date.now();

        try {
            // Get current session
            const currentSession = await this.getCurrentSession();

            if (currentSession) {
                // Log logout
                this.logger.log({
                    type: 'logout_attempt' as any,
                    timestamp: new Date(),
                    details: {
                        userId: currentSession.user.id,
                        sessionId: currentSession.token.accessToken.substring(0, 10) + '...'
                    }
                });
            }

            // Clear repository
            await this.repository.clear();

            // Log success
            this.logger.log({
                type: 'logout_success' as any,
                timestamp: new Date(),
                details: currentSession ? {
                    userId: currentSession.user.id
                } : undefined
            });

            // Record metrics
            this.metrics.recordSuccess('logout_attempt', Date.now() - startTime);

        } catch (error) {
            this.logger.logError(error as Error, { operation: 'globalSignout' });
            this.metrics.recordFailure('logout_attempt', 'unknown_error' as any, Date.now() - startTime);
        }
    }

    /**
     * Gets service capabilities
     */
    getCapabilities(): string[] {
        const capabilities = ['authentication', 'validation', 'logging', 'metrics', 'security'];

        // Add provider-specific capabilities
        for (const provider of this.providers.values()) {
            capabilities.push(...provider.getCapabilities());
        }

        return [...new Set(capabilities)];
    }

    /**
     * Initializes all providers and plugins
     */
    async initialize(): Promise<void> {
        const initializationPromises = [];

        // Initialize providers
        for (const provider of this.providers.values()) {
            if (typeof provider.initialize === 'function') {
                initializationPromises.push(provider.initialize());
            }
        }

        // Initialize plugins
        for (const [name, plugin] of this.plugins) {
            try {
                await plugin.initialize(this);
                this.logger.log({
                    type: 'plugin_init' as any,
                    timestamp: new Date(),
                    details: { pluginName: name }
                });
            } catch (error) {
                this.logger.logError(error as Error, {
                    operation: 'plugin_initialize',
                    pluginName: name
                });
            }
        }

        await Promise.all(initializationPromises);

        this.logger.log({
            type: 'service_init' as any,
            timestamp: new Date(),
            details: {
                providersCount: this.providers.size,
                pluginsCount: this.plugins.size,
                capabilities: this.getCapabilities()
            }
        });
    }

    /**
     * Generates unique request ID for tracking
     */
    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}

export default EnterpriseAuthService;
