/**
 * Base Authentication Provider
 *
 * Provides common functionality for all authentication providers
 * following DRY principles and Single Responsibility.
 * Extracts shared patterns like metrics, health checks, and error handling.
 */

import type { IAuthenticator, HealthCheckResult, PerformanceMetrics } from '../interfaces/IAuthenticator';
import type { AuthCredentials, AuthResult, AuthSession } from '../types/auth.domain.types';

/**
 * Base Authentication Provider Abstract Class
 * 
 * Provides common implementation for authentication providers
 * while allowing specific implementations to override core logic.
 */
export abstract class BaseAuthenticator implements IAuthenticator {
    protected abstract _name: string;
    protected abstract _type: any;
    protected _config: Record<string, any> = {};

    protected metrics: PerformanceMetrics = {
        totalAttempts: 0,
        successfulAuthentications: 0,
        failedAuthentications: 0,
        averageResponseTime: 0,
        errorsByType: {},
        statistics: {
            successRate: 100,
            failureRate: 0,
            throughput: 0
        }
    };

    protected initializedAt: Date = new Date();
    protected _isInitialized: boolean = false;

    /**
     * Gets provider name
     */
    get name(): string {
        return this._name;
    }

    /**
     * Gets provider type
     */
    get type(): any {
        return this._type;
    }

    /**
     * Gets provider configuration
     */
    get config(): Record<string, any> {
        return { ...this._config };
    }

    /**
     * Configures provider with settings
     */
    configure(config: Record<string, unknown>): void {
        Object.assign(this._config, config);
    }

    /**
     * Gets provider capabilities
     */
    getCapabilities(): string[] {
        return ['authentication', 'session_validation', 'token_refresh'];
    }

    /**
     * Initializes provider
     */
    async initialize(): Promise<void> {
        this._isInitialized = true;
        this.initializedAt = new Date();
    }

    /**
     * Checks if provider is initialized
     */
    isInitialized(): boolean {
        return this._isInitialized;
    }

    /**
     * Gets provider uptime
     */
    getUptime(): number {
        return Date.now() - this.initializedAt.getTime();
    }

    /**
     * Gets performance metrics
     */
    getPerformanceMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    /**
     * Resets performance metrics
     */
    resetPerformanceMetrics(): void {
        this.metrics = {
            totalAttempts: 0,
            successfulAuthentications: 0,
            failedAuthentications: 0,
            averageResponseTime: 0,
            errorsByType: {},
            statistics: {
                successRate: 100,
                failureRate: 0,
                throughput: 0
            }
        };
    }

    /**
     * Performs health check
     */
    async healthCheck(): Promise<HealthCheckResult> {
        const startTime = Date.now();

        try {
            const isHealthy = await this.performHealthCheck();
            const responseTime = Date.now() - startTime;

            return {
                healthy: isHealthy,
                timestamp: new Date(),
                responseTime,
                message: isHealthy ? `${this._name} is healthy` : `${this._name} is unhealthy`,
                metadata: {
                    uptime: this.getUptime(),
                    initialized: this._isInitialized,
                    metrics: this.metrics.statistics
                }
            };
        } catch (error) {
            return {
                healthy: false,
                timestamp: new Date(),
                responseTime: Date.now() - startTime,
                message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                metadata: {
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            };
        }
    }

    /**
     * Checks if provider is healthy
     */
    async isHealthy(): Promise<boolean> {
        const health = await this.healthCheck();
        return health.healthy;
    }

    /**
     * Gracefully shuts down provider
     */
    async shutdown(): Promise<void> {
        this._isInitialized = false;
    }

    /**
     * Main authentication method with common logic
     */
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        const startTime = Date.now();
        this.metrics.totalAttempts++;

        try {
            const result = await this.authenticateImpl(credentials);

            if (result.success) {
                this.metrics.successfulAuthentications++;
                this.recordSuccess('authenticate', Date.now() - startTime);
                return result;
            } else {
                this.metrics.failedAuthentications++;
                this.recordFailure('authenticate', result.error?.type || 'unknown_error', Date.now() - startTime);
                return result;
            }
        } catch (error) {
            this.metrics.failedAuthentications++;
            this.recordFailure('authenticate', 'server_error', Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: error instanceof Error ? error.message : 'Authentication failed',
                    code: 'AUTH_SERVER_ERROR'
                }
            };
        }
    }

    /**
     * Main session validation method with common logic
     */
    async validateSession(): Promise<AuthResult<boolean>> {
        const startTime = Date.now();

        try {
            const result = await this.validateSessionImpl();

            if (result.success) {
                this.recordSuccess('validate_session', Date.now() - startTime);
                return result;
            } else {
                this.recordFailure('validate_session', result.error?.type || 'validation_failed', Date.now() - startTime);
                return result;
            }
        } catch (error) {
            this.recordFailure('validate_session', 'server_error', Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: error instanceof Error ? error.message : 'Session validation failed'
                }
            };
        }
    }

    /**
     * Main token refresh method with common logic
     */
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        const startTime = Date.now();

        try {
            const result = await this.refreshTokenImpl();

            if (result.success) {
                this.recordSuccess('refresh_token', Date.now() - startTime);
                return result;
            } else {
                this.recordFailure('refresh_token', result.error?.type || 'refresh_failed', Date.now() - startTime);
                return result;
            }
        } catch (error) {
            this.recordFailure('refresh_token', 'server_error', Date.now() - startTime);

            return {
                success: false,
                error: {
                    type: 'server_error' as any,
                    message: error instanceof Error ? error.message : 'Token refresh failed'
                }
            };
        }
    }

    /**
     * Abstract method for provider-specific authentication implementation
     */
    protected abstract authenticateImpl(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;

    /**
     * Abstract method for provider-specific session validation
     */
    protected abstract validateSessionImpl(): Promise<AuthResult<boolean>>;

    /**
     * Abstract method for provider-specific token refresh
     */
    protected abstract refreshTokenImpl(): Promise<AuthResult<AuthSession>>;

    /**
     * Abstract method for provider-specific health check
     */
    protected abstract performHealthCheck(): Promise<boolean>;

    /**
     * Records successful operation
     */
    private recordSuccess(_operation: string, duration: number): void {
        this.updateAverageResponseTime(duration);
        this.updateStatistics();
    }

    /**
     * Records failed operation
     */
    private recordFailure(_operation: string, errorType: any, duration: number): void {
        this.updateAverageResponseTime(duration);
        this.updateErrorCount(errorType);
        this.updateStatistics();
    }

    /**
     * Updates average response time
     */
    private updateAverageResponseTime(responseTime: number): void {
        const total = this.metrics.totalAttempts;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (total - 1) + responseTime) / total;
    }

    /**
     * Updates error count by type
     */
    private updateErrorCount(errorType: any): void {
        const errorKey = String(errorType);
        this.metrics.errorsByType[errorKey] = (this.metrics.errorsByType[errorKey] || 0) + 1;
    }

    /**
     * Updates statistics
     */
    private updateStatistics(): void {
        const total = this.metrics.totalAttempts;
        const successful = this.metrics.successfulAuthentications;
        const failed = this.metrics.failedAuthentications;

        this.metrics.statistics.successRate = total > 0 ? (successful / total) * 100 : 100;
        this.metrics.statistics.failureRate = total > 0 ? (failed / total) * 100 : 0;
        this.metrics.statistics.throughput = this.calculateThroughput();
    }

    /**
     * Calculates throughput (operations per minute)
     */
    private calculateThroughput(): number {
        const uptimeMinutes = this.getUptime() / (1000 * 60);
        return uptimeMinutes > 0 ? this.metrics.totalAttempts / uptimeMinutes : 0;
    }
}
