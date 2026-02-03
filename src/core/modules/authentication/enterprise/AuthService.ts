/**
 * Enterprise authentication service
 *
 * @deprecated Use AuthOrchestrator instead. This service duplicates functionality
 * already provided by AuthOrchestrator and will be removed in a future version.
 * 
 * Implements modular authentication with dependency injection
 * using the existing Inversify container for consistency.
 */

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
 * Enterprise authentication service implementation
 *
 * Provides comprehensive authentication with:
 * - Enterprise security features
 * - Comprehensive logging and metrics
 * - Multiple provider support
 */
export class EnterpriseAuthService implements IAuthService {
    private readonly repository: IAuthRepository;
    private readonly logger: IAuthLogger;
    private readonly metrics: IAuthMetrics;
    private readonly security: IAuthSecurityService;
    private readonly config: IAuthConfig;
    private readonly providers: Map<string, IAuthProvider> = new Map();
    private readonly plugins: Map<string, IAuthPlugin> = new Map();
    private readonly validators: Map<string, IAuthValidator> = new Map();
    private activeProvider?: string;

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
                '⚠️  EnterpriseAuthService is deprecated. Use AuthOrchestrator instead. ' +
                'This service will be removed in a future version.'
            );
        }

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
            type: 'register_provider' as const,
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
            type: 'register_plugin' as const,
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
                type: 'login_attempt' as const,
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
                this.metrics.recordFailure('login_attempt', validationResult.error?.type || 'validation_error' as const, Date.now() - startTime);
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
                this.metrics.recordFailure('login_attempt', 'rate_limited' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'rate_limited' as const,
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
                this.metrics.recordFailure('login_attempt', 'provider_not_found' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'provider_not_found' as const,
                        message: `Authentication provider '${providerName}' not found`,
                        code: 'AUTH_PROVIDER_NOT_FOUND'
                    },
                    metadata: {
                        timestamp: new Date(),
                        duration: Date.now() - startTime,
                        requestId: this.generateRequestId()
                    }
                };
            }

            // Authenticate with provider
            const authResult = await provider.authenticate(credentials);

            if (authResult.success) {
                // Store session
                await this.repository.storeSession(authResult.data!);

                // Log success
                this.logger.log({
                    type: 'login_success' as const,
                    timestamp: new Date(),
                    providerType: providerName as string,
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
                    type: 'login_failure' as const,
                    timestamp: new Date(),
                    providerType: providerName as string,
                    error: authResult.error?.type,
                    details: authResult.error?.details
                });

                // Record metrics
                this.metrics.recordFailure('login_attempt', authResult.error?.type || 'unknown_error' as const, Date.now() - startTime);

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
            this.metrics.recordFailure('login_attempt', 'unknown_error' as const, Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'unknown_error' as const,
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
        for (const validator of Array.from(this.validators.values())) {
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
        for (const provider of Array.from(this.providers.values())) {
            capabilities.push(...provider.getCapabilities());
        }

        return Array.from(new Set(capabilities));
    }

    /**
     * Gets authentication metrics
     */
    getMetrics(timeRange?: { start: Date; end: Date }) {
        return this.metrics.getMetrics(timeRange);
    }

    /**
     * Initializes all providers and plugins
     */
    async initialize(): Promise<void> {
        const initializationPromises = [];

        // Initialize providers
        for (const provider of Array.from(this.providers.values())) {
            if (typeof provider.initialize === 'function') {
                initializationPromises.push(provider.initialize());
            }
        }

        // Initialize plugins
        for (const [name, plugin] of Array.from(this.plugins.entries())) {
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

    // ==================== DYNAMIC PROVIDER MANAGEMENT ====================

    /**
     * Unregisters a provider
     */
    unregisterProvider(provider: IAuthProvider): void {
        this.providers.delete(provider.name);
        this.logger.log({
            type: 'provider_unregistered' as any,
            timestamp: new Date(),
            details: {
                providerName: provider.name,
                providerType: provider.type
            }
        });
    }

    /**
     * Sets the active provider
     */
    setActiveProvider(provider: IAuthProvider): void {
        this.activeProvider = provider.name;
        this.logger.log({
            type: 'active_provider_changed' as any,
            timestamp: new Date(),
            details: {
                providerName: provider.name,
                providerType: provider.type
            }
        });
    }

    /**
     * Gets the active provider
     */
    getActiveProvider(): IAuthProvider | undefined {
        return this.activeProvider ? this.providers.get(this.activeProvider) : undefined;
    }

    /**
     * Gets the repository instance
     */
    getRepository(): IAuthRepository {
        return this.repository;
    }

    /**
     * Gets the logger instance
     */
    getLogger(): IAuthLogger {
        return this.logger;
    }

    /**
     * Gets the metrics instance
     */
    getMetricsInstance(): IAuthMetrics {
        return this.metrics;
    }

    /**
     * Gets the security service instance
     */
    getSecurityService(): IAuthSecurityService {
        return this.security;
    }

    /**
     * Gets the config instance
     */
    getConfig(): IAuthConfig {
        return this.config;
    }

    /**
     * Gets active sessions (mock implementation)
     */
    async getActiveSessions(): Promise<AuthSession[]> {
        // This would typically query the repository for active sessions
        // For now, return empty array as mock
        return [];
    }

    /**
     * Stores a session (mock implementation)
     */
    async storeSession(session: AuthSession): Promise<void> {
        // This would typically store the session in the repository
        // For now, just log the action
        this.logger.log({
            type: 'session_stored' as any,
            timestamp: new Date(),
            details: {
                userId: session.user.id,
                provider: session.provider
            }
        });
    }

    /**
     * Registers new user
     */
    async register(userData: AuthCredentials): Promise<AuthResult<unknown>> {
        const startTime = Date.now();

        try {
            // Log registration attempt
            this.logger.log({
                type: 'register_attempt' as const,
                timestamp: new Date(),
                providerType: 'jwt' as any,
                details: {
                    email: userData.email,
                    requestId: this.generateRequestId()
                }
            });

            // Validate credentials
            const validationResult = await this.validateCredentials(userData);
            if (!validationResult.success) {
                this.metrics.recordFailure('register_attempt', validationResult.error?.type || 'validation_error' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: validationResult.error
                };
            }

            // Check rate limiting
            const userId = userData.email || userData.username;
            if (this.security.checkRateLimit(userId, 1)) {
                this.metrics.recordFailure('register_attempt', 'rate_limited' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'rate_limited' as const,
                        message: 'Too many registration attempts. Please try again later.',
                        details: { userId }
                    }
                };
            }

            // Get provider
            const provider = this.providers.get('jwt');
            if (!provider) {
                this.metrics.recordFailure('register_attempt', 'provider_not_found' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'provider_not_found' as const,
                        message: 'JWT provider not found'
                    }
                };
            }

            // Register with provider
            const registerResult = await provider.register(userData);

            if (registerResult.success) {
                // Log success
                this.logger.log({
                    type: 'register_success' as const,
                    timestamp: new Date(),
                    providerType: 'jwt' as string,
                    details: {
                        email: userData.email
                    }
                });

                // Record metrics
                this.metrics.recordSuccess('register_attempt', Date.now() - startTime);

                return {
                    success: true,
                    data: registerResult.data
                };
            } else {
                // Log failure
                this.logger.log({
                    type: 'register_failure' as const,
                    timestamp: new Date(),
                    providerType: 'jwt' as string,
                    error: registerResult.error?.type,
                    details: {
                        email: userData.email
                    }
                });

                // Record metrics
                this.metrics.recordFailure('register_attempt', registerResult.error?.type || 'unknown_error' as const, Date.now() - startTime);

                return {
                    success: false,
                    error: registerResult.error
                };
            }
        } catch (error) {
            // Log unexpected error
            this.logger.logError(error as Error, {
                provider: 'jwt',
                operation: 'register'
            });

            // Record metrics
            this.metrics.recordFailure('register_attempt', 'unknown_error' as const, Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'unknown_error' as const,
                    message: 'Registration failed due to an unexpected error',
                    details: error
                }
            };
        }
    }

    /**
     * Activates user account
     */
    async activate(code: string): Promise<AuthResult<AuthSession>> {
        const startTime = Date.now();

        try {
            // Log activation attempt
            this.logger.log({
                type: 'activate_attempt' as const,
                timestamp: new Date(),
                providerType: 'jwt' as any,
                details: {
                    code: code.substring(0, 4) + '***', // Partial code for logging
                    requestId: this.generateRequestId()
                }
            });

            // Get provider
            const provider = this.providers.get('jwt');
            if (!provider) {
                this.metrics.recordFailure('activate_attempt', 'provider_not_found' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'provider_not_found' as const,
                        message: 'JWT provider not found'
                    }
                };
            }

            // Activate with provider
            const activateResult = await provider.activate(code);

            if (activateResult.success && activateResult.data) {
                // Store session
                await this.storeSession(activateResult.data);

                // Log success
                this.logger.log({
                    type: 'activate_success' as const,
                    timestamp: new Date(),
                    providerType: 'jwt' as string,
                    details: {
                        userId: activateResult.data.user.id
                    }
                });

                // Record metrics
                this.metrics.recordSuccess('activate_attempt', Date.now() - startTime);

                return {
                    success: true,
                    data: activateResult.data
                };
            } else {
                // Log failure
                this.logger.log({
                    type: 'activate_failure' as const,
                    timestamp: new Date(),
                    providerType: 'jwt' as string,
                    error: activateResult.error?.type,
                    details: {
                        code: code.substring(0, 4) + '***'
                    }
                });

                // Record metrics
                this.metrics.recordFailure('activate_attempt', activateResult.error?.type || 'unknown_error' as const, Date.now() - startTime);

                return {
                    success: false,
                    error: activateResult.error
                };
            }
        } catch (error) {
            // Log unexpected error
            this.logger.logError(error as Error, {
                provider: 'jwt',
                operation: 'activate'
            });

            // Record metrics
            this.metrics.recordFailure('activate_attempt', 'unknown_error' as const, Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'unknown_error' as const,
                    message: 'Activation failed due to an unexpected error',
                    details: error
                }
            };
        }
    }

    /**
     * Resends activation code
     */
    async resendActivationCode(email: string): Promise<AuthResult<void>> {
        const startTime = Date.now();

        try {
            // Log resend attempt
            this.logger.log({
                type: 'resend_attempt' as const,
                timestamp: new Date(),
                providerType: 'jwt' as any,
                details: {
                    email,
                    requestId: this.generateRequestId()
                }
            });

            // Get provider
            const provider = this.providers.get('jwt');
            if (!provider) {
                this.metrics.recordFailure('resend_attempt', 'provider_not_found' as const, Date.now() - startTime);
                return {
                    success: false,
                    error: {
                        type: 'provider_not_found' as const,
                        message: 'JWT provider not found'
                    }
                };
            }

            // Resend activation code
            const resendResult = await provider.resendActivationCode(email);

            if (resendResult.success) {
                // Log success
                this.logger.log({
                    type: 'resend_success' as const,
                    timestamp: new Date(),
                    providerType: 'jwt' as string,
                    details: {
                        email
                    }
                });

                // Record metrics
                this.metrics.recordSuccess('resend_attempt', Date.now() - startTime);

                return {
                    success: true,
                    data: undefined
                };
            } else {
                // Log failure
                this.logger.log({
                    type: 'resend_failure' as const,
                    timestamp: new Date(),
                    providerType: 'jwt' as string,
                    error: resendResult.error?.type,
                    details: {
                        email
                    }
                });

                // Record metrics
                this.metrics.recordFailure('resend_attempt', resendResult.error?.type || 'unknown_error' as const, Date.now() - startTime);

                return {
                    success: false,
                    error: resendResult.error
                };
            }
        } catch (error) {
            // Log unexpected error
            this.logger.logError(error as Error, {
                provider: 'jwt',
                operation: 'resendActivationCode'
            });

            // Record metrics
            this.metrics.recordFailure('resend_attempt', 'unknown_error' as const, Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'unknown_error' as const,
                    message: 'Failed to resend activation code due to an unexpected error',
                    details: error
                }
            };
        }
    }
}

export default EnterpriseAuthService;
