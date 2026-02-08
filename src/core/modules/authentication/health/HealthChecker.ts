/**
 * Health Check System
 *
 * Provides provider health monitoring, automatic fallback, and circuit breaker patterns
 *
 * Features:
 * - Provider health monitoring
 * - Circuit breaker pattern
 * - Automatic fallback to backup providers
 * - Health check scheduling
 * - Health metrics and reporting
 * - Provider recovery detection
 */

import type { IAuthenticator } from '../interfaces/IAuthenticator';
import type { AuthResult } from '../types/auth.domain.types';

/**
 * Health check result
 */
export interface HealthCheckResult {
    providerName: string;
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime: number;
    timestamp: Date;
    error?: string;
    details?: unknown;
}

/**
 * Circuit breaker state
 */
export enum CircuitBreakerState {
    CLOSED = 'closed',      // Normal operation
    OPEN = 'open',          // Failing, reject calls
    HALF_OPEN = 'half-open'  // Testing recovery
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
    failureThreshold: number;    // Failures before opening
    recoveryTimeout: number;     // Time before attempting recovery
    monitoringPeriod: number;    // Time window for failure counting
    expectedRecoveryTime: number; // Expected time for recovery
}

/**
 * Provider health configuration
 */
export interface ProviderHealthConfig {
    checkInterval: number;        // Health check interval in ms
    timeout: number;              // Health check timeout in ms
    retries: number;              // Number of retries before marking unhealthy
    circuitBreaker: CircuitBreakerConfig;
    fallbackProviders: string[];  // Backup providers
    minResponseTime?: number;     // Minimum response time for tests (optional)
}

/**
 * Health metrics
 */
export interface HealthMetrics {
    totalChecks: number;
    successfulChecks: number;
    failedChecks: number;
    averageResponseTime: number;
    lastCheckTime: Date;
    uptime: number;               // Percentage
    lastFailureTime?: Date;
    consecutiveFailures: number;
}

/**
 * Circuit Breaker Implementation
 */
export class CircuitBreaker {
    private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
    private failures = 0;
    private lastFailureTime?: Date;
    private nextAttempt?: Date;
    private readonly config: CircuitBreakerConfig;

    constructor(config: CircuitBreakerConfig) {
        this.config = config;
    }

    /**
     * Executes an operation through the circuit breaker
     */
    async execute<T>(operation: () => Promise<AuthResult<T>>): Promise<AuthResult<T>> {
        if (this.state === CircuitBreakerState.OPEN) {
            if (this.shouldAttemptReset()) {
                this.state = CircuitBreakerState.HALF_OPEN;
            } else {
                return {
                    success: false,
                    error: {
                        type: 'server_error' as const,
                        message: 'Circuit breaker is OPEN',
                        code: 'CIRCUIT_BREAKER_OPEN'
                    }
                };
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            return {
                success: false,
                error: {
                    type: 'server_error' as const,
                    message: `Operation failed: ${error.message}`,
                    code: 'OPERATION_FAILED'
                }
            };
        }
    }

    /**
     * Gets current circuit breaker state
     */
    getState(): CircuitBreakerState {
        return this.state;
    }

    /**
     * Gets circuit breaker metrics
     */
    getMetrics() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailureTime: this.lastFailureTime,
            nextAttempt: this.nextAttempt
        };
    }

    /**
     * Resets the circuit breaker
     */
    reset(): void {
        this.state = CircuitBreakerState.CLOSED;
        this.failures = 0;
        this.lastFailureTime = undefined;
        this.nextAttempt = undefined;
    }

    /**
     * Handles successful operation
     */
    private onSuccess(): void {
        this.failures = 0;
        this.state = CircuitBreakerState.CLOSED;
        this.lastFailureTime = undefined;
        this.nextAttempt = undefined;
    }

    /**
     * Handles failed operation
     */
    public onFailure(): void {
        this.failures++;
        this.lastFailureTime = new Date();

        if (this.failures >= this.config.failureThreshold) {
            this.state = CircuitBreakerState.OPEN;
            this.nextAttempt = new Date(
                Date.now() + this.config.recoveryTimeout
            );
        }
    }

    /**
     * Checks if circuit breaker should attempt reset
     */
    private shouldAttemptReset(): boolean {
        return this.nextAttempt ? Date.now() >= this.nextAttempt.getTime() : false;
    }
}

/**
 * Provider Health Monitor
 */
export class ProviderHealthMonitor {
    private readonly config: ProviderHealthConfig;
    private readonly circuitBreaker: CircuitBreaker;
    private metrics: HealthMetrics;
    private healthHistory: HealthCheckResult[] = [];
    private checkTimer?: NodeJS.Timeout;

    constructor(config: ProviderHealthConfig) {
        this.config = config;
        this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
        this.metrics = {
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            averageResponseTime: 0,
            lastCheckTime: new Date(),
            uptime: 100,
            consecutiveFailures: 0
        };
    }

    /**
     * Starts health monitoring
     */
    startMonitoring(provider: IAuthenticator): void {
        this.stopMonitoring();

        this.checkTimer = setInterval(async () => {
            await this.performHealthCheck(provider);
        }, this.config.checkInterval);
    }

    /**
     * Stops health monitoring
     */
    stopMonitoring(): void {
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = undefined;
        }
    }

    /**
     * Performs a health check on the provider
     */
    async performHealthCheck(provider: IAuthenticator): Promise<HealthCheckResult> {
        const startTime = Date.now();

        // Add small delay to ensure response time > 0 (configurable for tests)
        if (this.config.minResponseTime > 0) {
            await new Promise(resolve => setTimeout(resolve, this.config.minResponseTime));
        }

        try {
            // Execute health check through circuit breaker
            const result = await this.circuitBreaker.execute(async () => {
                return await this.executeHealthCheck(provider);
            });

            const responseTime = Date.now() - startTime;
            const healthResult: HealthCheckResult = {
                providerName: provider.name,
                status: result.success ? 'healthy' : 'unhealthy',
                responseTime,
                timestamp: new Date(),
                error: result.success ? undefined : result.error?.message,
                details: result
            };

            this.updateMetrics(healthResult);
            this.healthHistory.push(healthResult);

            // Keep only last 100 results
            if (this.healthHistory.length > 100) {
                this.healthHistory = this.healthHistory.slice(-100);
            }

            return healthResult;
        } catch (error) {
            const responseTime = Date.now() - startTime;
            const healthResult: HealthCheckResult = {
                providerName: provider.name,
                status: 'unhealthy',
                responseTime,
                timestamp: new Date(),
                error: error.message
            };

            this.updateMetrics(healthResult);
            this.healthHistory.push(healthResult);

            return healthResult;
        }
    }

    /**
     * Gets current health status
     */
    getHealthStatus(): {
        status: 'healthy' | 'unhealthy' | 'degraded';
        metrics: HealthMetrics;
        circuitBreaker: unknown;
        lastCheck: HealthCheckResult | null;
    } {
        const lastCheck = this.healthHistory.length > 0
            ? this.healthHistory[this.healthHistory.length - 1]
            : null;

        let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

        if (lastCheck) {
            status = lastCheck.status;
        } else if (this.metrics.consecutiveFailures > 0) {
            status = 'degraded';
        }

        return {
            status,
            metrics: this.metrics,
            circuitBreaker: this.circuitBreaker.getMetrics(),
            lastCheck
        };
    }

    /**
     * Gets health history
     */
    getHealthHistory(limit?: number): HealthCheckResult[] {
        return limit ? this.healthHistory.slice(-limit) : [...this.healthHistory];
    }

    /**
     * Resets health metrics
     */
    resetMetrics(): void {
        this.metrics = {
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            averageResponseTime: 0,
            lastCheckTime: new Date(),
            uptime: 100,
            consecutiveFailures: 0
        };
        this.healthHistory = [];
        this.circuitBreaker.reset();
    }

    /**
     * Executes the actual health check
     */
    private async executeHealthCheck(provider: IAuthenticator): Promise<AuthResult<unknown>> {
        // Try to validate current session first
        try {
            const validationResult = await provider.validateSession();
            if (validationResult.success) {
                return { success: true, data: 'Session validation successful' };
            }
        } catch (error) {
            // Session validation failed, continue with other checks
        }

        // Try to get provider capabilities
        try {
            const capabilities = provider.getCapabilities();
            if (capabilities && capabilities.length > 0) {
                return { success: true, data: 'Provider responsive' };
            }
        } catch (error) {
            // Capabilities check failed
        }

        // If all checks fail, return failure
        return {
            success: false,
            error: {
                type: 'server_error' as const,
                message: 'Provider health check failed',
                code: 'HEALTH_CHECK_FAILED'
            }
        };
    }

    /**
     * Updates health metrics
     */
    private updateMetrics(result: HealthCheckResult): void {
        this.metrics.totalChecks++;
        this.metrics.lastCheckTime = result.timestamp;

        if (result.status === 'healthy') {
            this.metrics.successfulChecks++;
            this.metrics.consecutiveFailures = 0;
        } else {
            this.metrics.failedChecks++;
            this.metrics.consecutiveFailures++;
            this.metrics.lastFailureTime = result.timestamp;
        }

        // Update average response time
        const totalTime = this.metrics.averageResponseTime * (this.metrics.totalChecks - 1) + result.responseTime;
        this.metrics.averageResponseTime = totalTime / this.metrics.totalChecks;

        // Update uptime
        this.metrics.uptime = (this.metrics.successfulChecks / this.metrics.totalChecks) * 100;
    }
}

/**
 * Health Check Manager
 *
 * Manages health checks for multiple providers with automatic fallback
 */
export class HealthCheckManager {
    private readonly monitors: Map<string, ProviderHealthMonitor> = new Map();
    private readonly providers: Map<string, IAuthenticator> = new Map();
    private readonly fallbackChains: Map<string, string[]> = new Map();
    private readonly healthCheckCallbacks: ((result: HealthCheckResult) => void)[] = [];

    /**
     * Registers a provider for health monitoring
     */
    registerProvider(
        provider: IAuthenticator,
        config: ProviderHealthConfig,
        fallbackProviders?: string[]
    ): void {
        this.providers.set(provider.name, provider);

        const monitor = new ProviderHealthMonitor(config);
        this.monitors.set(provider.name, monitor);

        if (fallbackProviders) {
            this.fallbackChains.set(provider.name, fallbackProviders);
        }

        monitor.startMonitoring(provider);
    }

    /**
     * Unregisters a provider from health monitoring
     */
    unregisterProvider(providerName: string): void {
        const monitor = this.monitors.get(providerName);
        if (monitor) {
            monitor.stopMonitoring();
            this.monitors.delete(providerName);
        }

        this.providers.delete(providerName);
        this.fallbackChains.delete(providerName);
    }

    /**
     * Gets health status for all providers
     */
    getAllHealthStatus(): Map<string, unknown> {
        const status = new Map();

        for (const [providerName, monitor] of this.monitors) {
            status.set(providerName, monitor.getHealthStatus());
        }

        return status;
    }

    /**
     * Gets health status for a specific provider
     */
    getProviderHealthStatus(providerName: string): unknown {
        const monitor = this.monitors.get(providerName);
        return monitor ? monitor.getHealthStatus() : null;
    }

    /**
     * Executes an operation with automatic fallback
     */
    async executeWithFallback<T>(
        primaryProvider: string,
        operation: (provider: IAuthenticator) => Promise<T>
    ): Promise<AuthResult<T>> {
        const providersToTry = [primaryProvider, ...this.getFallbackProviders(primaryProvider)];

        for (const providerName of providersToTry) {
            const provider = this.providers.get(providerName);
            const monitor = this.monitors.get(providerName);

            if (!provider) {
                continue;
            }

            // Check if provider is healthy
            if (monitor) {
                const healthStatus = monitor.getHealthStatus();
                if (healthStatus.status === 'unhealthy') {
                    continue;
                }
            }

            try {
                const result = await operation(provider);
                return {
                    success: true,
                    data: result
                };
            } catch (error) {
                console.warn(`Provider ${providerName} failed:`, error);
                // Continue to next provider
            }
        }

        return {
            success: false,
            error: {
                type: 'server_error' as const,
                message: 'All providers failed',
                code: 'ALL_PROVIDERS_FAILED'
            }
        };
    }

    /**
     * Adds health check callback
     */
    addHealthCheckCallback(callback: (result: HealthCheckResult) => void): void {
        this.healthCheckCallbacks.push(callback);
    }

    /**
     * Removes health check callback
     */
    removeHealthCheckCallback(callback: (result: HealthCheckResult) => void): void {
        const index = this.healthCheckCallbacks.indexOf(callback);
        if (index > -1) {
            this.healthCheckCallbacks.splice(index, 1);
        }
    }

    /**
     * Gets fallback providers for a given provider
     */
    private getFallbackProviders(providerName: string): string[] {
        return this.fallbackChains.get(providerName) || [];
    }

    /**
     * Stops all health monitoring
     */
    stopAllMonitoring(): void {
        for (const monitor of this.monitors.values()) {
            monitor.stopMonitoring();
        }
    }

    /**
     * Gets comprehensive health report
     */
    getHealthReport(): {
        timestamp: Date;
        providers: unknown;
        summary: {
            total: number;
            healthy: number;
            unhealthy: number;
            degraded: number;
        };
    } {
        const allStatus = this.getAllHealthStatus();
        let healthy = 0, unhealthy = 0, degraded = 0;

        for (const status of allStatus.values()) {
            switch (status.status) {
                case 'healthy':
                    healthy++;
                    break;
                case 'unhealthy':
                    unhealthy++;
                    break;
                case 'degraded':
                    degraded++;
                    break;
            }
        }

        return {
            timestamp: new Date(),
            providers: Object.fromEntries(allStatus),
            summary: {
                total: allStatus.size,
                healthy,
                unhealthy,
                degraded
            }
        };
    }
}
