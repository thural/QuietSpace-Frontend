/**
 * Authentication Orchestrator Implementation
 *
 * Implements high-level authentication orchestration with clean
 * separation of concerns following Single Responsibility Principle.
 */

import type { IAuthService } from '../interfaces/authInterfaces';
import type { IProviderManager } from '../interfaces/IProviderManager';
import type { IAuthValidator } from '../interfaces/IAuthValidator';
import type { IAuthRepository } from '../interfaces/authInterfaces';
import type { IAuthLogger } from '../interfaces/authInterfaces';
import type { IAuthMetrics } from '../interfaces/authInterfaces';
import type { IAuthSecurityService } from '../interfaces/authInterfaces';
import type { IAuthConfig } from '../interfaces/authInterfaces';
import type { IAuthenticator } from '../interfaces/IAuthenticator';
import type { IUserManager } from '../interfaces/IUserManager';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';
import { AuthErrorType } from '../types/auth.domain.types';

/**
 * Authentication orchestrator implementation
 * 
 * Coordinates authentication operations by delegating to specialized
 * services while maintaining clean separation of concerns.
 */
export class AuthOrchestrator implements IAuthService {
    readonly name = 'AuthOrchestrator';

    constructor(
        private readonly providerManager: IProviderManager,
        private readonly authValidator: IAuthValidator,
        private readonly repository: IAuthRepository,
        private readonly logger: IAuthLogger,
        private readonly metrics: IAuthMetrics,
        private readonly security: IAuthSecurityService,
        private readonly config: IAuthConfig
    ) { }

    /**
     * Registers authentication provider
     */
    registerProvider(provider: IAuthenticator): void {
        this.providerManager.registerProvider(provider);
    }

    /**
     * Registers plugin (delegates to provider manager for now)
     */
    registerPlugin(plugin: any): void {
        this.logger.log({
            type: 'plugin_registration' as any,
            timestamp: new Date(),
            details: {
                pluginName: plugin.name,
                version: plugin.version,
                message: 'Plugin registration delegated to provider manager'
            }
        });
    }

    /**
     * Authenticates user with comprehensive validation and security
     */
    async authenticate(providerName: string, credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        const startTime = Date.now();
        const requestId = this.generateRequestId();

        try {
            this.logger.log({
                type: 'login_attempt' as any,
                timestamp: new Date(),
                providerType: providerName as any,
                details: {
                    userId: credentials.email || credentials.username,
                    requestId
                }
            });

            // Validate credentials using validator
            const validationResult = this.authValidator.validateCredentials(credentials, {
                timestamp: new Date(),
                requestId
            });

            if (!validationResult.isValid) {
                const errorType = (validationResult.errors?.[0]?.type as AuthErrorType) || AuthErrorType.VALIDATION_ERROR;
                this.metrics.recordFailure('login_attempt', errorType, Date.now() - startTime);

                return {
                    success: false,
                    error: {
                        type: errorType,
                        message: validationResult.errors?.[0]?.message || 'Validation failed',
                        code: validationResult.errors?.[0]?.code || 'VALIDATION_FAILED'
                    },
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId
                    }
                };
            }

            // Get provider from manager
            const provider = this.providerManager.getProvider(providerName);
            if (!provider) {
                this.metrics.recordFailure('login_attempt', 'provider_not_found' as any, Date.now() - startTime);

                return {
                    success: false,
                    error: {
                        type: 'provider_not_found' as any,
                        message: `Authentication provider '${providerName}' not found`,
                        code: 'AUTH_PROVIDER_NOT_FOUND'
                    },
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId
                    }
                };
            }

            // Authenticate with provider
            const authResult = await provider.authenticate(credentials);

            if (authResult.success && authResult.data) {
                // Store session
                await this.repository.storeSession(authResult.data);

                // Log success
                this.logger.log({
                    type: 'login_success' as any,
                    timestamp: new Date(),
                    providerType: providerName as string,
                    details: {
                        userId: authResult.data.user.id,
                        sessionId: authResult.data.token.accessToken.substring(0, 10) + '...',
                        requestId
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
                        requestId
                    }
                };
            } else {
                // Log failure
                this.logger.log({
                    type: 'login_failure' as any,
                    timestamp: new Date(),
                    providerType: providerName as string,
                    error: authResult.error?.type,
                    details: authResult.error?.details,
                    requestId
                });

                // Record metrics
                this.metrics.recordFailure('login_attempt', authResult.error?.type || 'unknown_error' as any, Date.now() - startTime);

                return {
                    success: false,
                    error: authResult.error,
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId
                    }
                };
            }

        } catch (error) {
            this.logger.logError(error as Error, {
                operation: 'authenticate',
                providerName,
                requestId
            });

            this.metrics.recordFailure('login_attempt', 'server_error' as any, Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: `Authentication failed: ${(error as Error).message}`,
                    code: 'AUTH_SERVER_ERROR'
                },
                metadata: {
                    timestamp: new Date(),
                    duration: Date.now() - startTime,
                    requestId
                }
            };
        }
    }

    /**
     * Gets current authentication session
     */
    async getCurrentSession(): Promise<AuthSession | null> {
        try {
            const session = await this.repository.getSession();

            if (session) {
                // Validate session is still valid
                const provider = this.providerManager.getProvider(session.provider as any);
                if (provider) {
                    const validationResult = await provider.validateSession();
                    if (!validationResult.success) {
                        // Session is invalid, clear it
                        await this.repository.removeSession();
                        return null;
                    }
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
        try {
            // Get current session
            const session = await this.repository.getSession();

            if (session) {
                // Sign out from specific provider using user manager
                const userManager = this.providerManager.getUserManager(session.provider as any);
                if (userManager) {
                    await userManager.signout();
                }

                // Clear session from repository
                await this.repository.removeSession();

                this.logger.log({
                    type: 'logout_success' as any,
                    timestamp: new Date(),
                    providerType: session.provider as any,
                    details: {
                        userId: session.user.id
                    }
                });
            }

            // Clear all sessions (if multiple providers)
            await this.repository.clear();

        } catch (error) {
            this.logger.logError(error as Error, { operation: 'globalSignout' });
            throw error;
        }
    }

    /**
     * Gets service capabilities
     */
    getCapabilities(): string[] {
        const providerCapabilities = this.providerManager.listProviders().length > 0 ? ['provider_management'] : [];
        const validatorCapabilities = this.authValidator.getCapabilities();

        return [
            'authentication',
            'session_management',
            'validation',
            'security',
            'logging',
            'metrics',
            ...providerCapabilities,
            ...validatorCapabilities
        ];
    }

    /**
     * Initializes all providers and plugins
     */
    async initialize(): Promise<void> {
        try {
            this.logger.log({
                type: 'orchestrator_initialization' as any,
                timestamp: new Date(),
                details: {
                    providerCount: this.providerManager.getProviderCount(),
                    capabilities: this.getCapabilities()
                }
            });

            // Initialize validator if it supports initialization
            if (this.authValidator.initialize) {
                await this.authValidator.initialize();
            }

            // Initialize all providers that support initialization
            for (const providerName of this.providerManager.listProviders()) {
                const provider = this.providerManager.getProvider(providerName);
                if (provider?.initialize) {
                    await provider.initialize();
                }
            }

            this.logger.log({
                type: 'orchestrator_initialized' as any,
                timestamp: new Date(),
                details: {
                    initializedProviders: this.providerManager.listProviders(),
                    status: 'ready'
                }
            });

        } catch (error) {
            this.logger.logError(error as Error, { operation: 'initialize' });
            throw error;
        }
    }

    /**
     * Gets orchestrator statistics
     */
    getStatistics(): {
        providerCount: number;
        validatorStats: any;
        capabilities: string[];
        uptime: number;
    } {
        return {
            providerCount: this.providerManager.getProviderCount(),
            validatorStats: this.authValidator.getStatistics(),
            capabilities: this.getCapabilities(),
            uptime: Date.now() - (this.config.get('startTime') as number || Date.now())
        };
    }

    /**
     * Generates unique request ID
     */
    private generateRequestId(): string {
        return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
