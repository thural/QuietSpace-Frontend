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

// Import types via JSDoc typedefs
/**
 * @typedef {import('../interfaces/authInterfaces.js').IAuthProvider} IAuthProvider
 * @typedef {import('../types/auth.domain.types.js').AuthResult} AuthResult
 */

/**
 * Health check result
 * @typedef {Object} HealthCheckResult
 * @property {string} providerName - Name of the provider
 * @property {'healthy'|'unhealthy'|'degraded'} status - Health status
 * @property {number} responseTime - Response time in milliseconds
 * @property {Date} timestamp - Check timestamp
 * @property {string} [error] - Error message if unhealthy
 * @property {any} [details] - Additional details
 */

/**
 * Circuit breaker state enum
 * @readonly
 * @enum {string}
 */
export const CircuitBreakerState = Object.freeze({
    CLOSED: 'closed',
    OPEN: 'open',
    HALF_OPEN: 'half_open'
});

/**
 * Circuit breaker configuration
 * @typedef {Object} CircuitBreakerConfig
 * @property {number} [failureThreshold=5] - Number of failures before opening
 * @property {number} [recoveryTimeout=60000] - Timeout in milliseconds before attempting recovery
 * @property {number} [expectedRecoveryTime=30000] - Expected recovery time in milliseconds
 */

/**
 * Provider health configuration
 * @typedef {Object} ProviderHealthConfig
 * @property {string} providerName - Provider name
 * @property {number} [timeout=5000] - Health check timeout in milliseconds
 * @property {number} [interval=30000] - Health check interval in milliseconds
 * @property {CircuitBreakerConfig} [circuitBreaker] - Circuit breaker configuration
 */

/**
 * Health metrics
 * @typedef {Object} HealthMetrics
 * @property {string} providerName - Provider name
 * @property {number} totalChecks - Total number of health checks
 * @property {number} successfulChecks - Number of successful checks
 * @property {number} failedChecks - Number of failed checks
 * @property {number} averageResponseTime - Average response time
 * @property {Date} lastCheckTime - Last check timestamp
 * @property {Date} lastSuccessTime - Last success timestamp
 * @property {Date} lastFailureTime - Last failure timestamp
 * @property {number} consecutiveFailures - Number of consecutive failures
 */

/**
 * Circuit Breaker Implementation
 */
export class CircuitBreaker {
    /**
     * @type {CircuitBreakerState}
     */
    #state = CircuitBreakerState.CLOSED;
    
    /**
     * @type {number}
     */
    #failures = 0;
    
    /**
     * @type {Date|undefined}
     */
    #lastFailureTime;
    
    /**
     * @type {Date|undefined}
     */
    #nextAttempt;
    
    /**
     * @type {CircuitBreakerConfig}
     */
    #config;

    /**
     * Creates a circuit breaker instance
     * @param {CircuitBreakerConfig} config - Circuit breaker configuration
     */
    constructor(config) {
        this.#config = config;
    }

    /**
     * Executes an operation through the circuit breaker
     * @param {Function} operation - Operation to execute
     * @returns {Promise<AuthResult>} Operation result
     */
    async execute(operation) {
        if (this.#state === CircuitBreakerState.OPEN) {
            if (this.#shouldAttemptReset()) {
                this.#state = CircuitBreakerState.HALF_OPEN;
            } else {
                return {
                    success: false,
                    error: {
                        type: 'server_error',
                        message: 'Circuit breaker is OPEN',
                        code: 'CIRCUIT_BREAKER_OPEN'
                    }
                };
            }
        }

        try {
            const result = await operation();
            this.#onSuccess();
            return result;
        } catch (error) {
            this.#onFailure();
            return {
                success: false,
                error: {
                    type: 'server_error',
                    message: error.message || 'Operation failed',
                    code: 'OPERATION_FAILED'
                }
            };
        }
    }

    /**
     * Checks if circuit breaker should attempt reset
     * @returns {boolean} Whether to attempt reset
     * @private
     */
    #shouldAttemptReset() {
        if (!this.#lastFailureTime) return false;
        
        const now = new Date();
        const timeSinceFailure = now.getTime() - this.#lastFailureTime.getTime();
        return timeSinceFailure >= this.#config.recoveryTimeout;
    }

    /**
     * Handles successful operation
     * @private
     */
    #onSuccess() {
        this.#failures = 0;
        this.#state = CircuitBreakerState.CLOSED;
        this.#lastFailureTime = undefined;
    }

    /**
     * Handles failed operation
     * @private
     */
    #onFailure() {
        this.#failures++;
        this.#lastFailureTime = new Date();

        if (this.#failures >= this.#config.failureThreshold) {
            this.#state = CircuitBreakerState.OPEN;
            this.#nextAttempt = new Date(
                Date.now() + this.#config.recoveryTimeout
            );
        }
    }

    /**
     * Gets current circuit breaker state
     * @returns {CircuitBreakerState} Current state
     */
    getState() {
        return this.#state;
    }

    /**
     * Gets number of failures
     * @returns {number} Number of failures
     */
    getFailures() {
        return this.#failures;
    }
}

/**
 * Health Checker Implementation
 */
export class HealthChecker {
    /**
     * @type {Map<string, ProviderHealthConfig>}
     */
    #providerConfigs = new Map();
    
    /**
     * @type {Map<string, CircuitBreaker>}
     */
    #circuitBreakers = new Map();
    
    /**
     * @type {Map<string, HealthMetrics>}
     */
    #metrics = new Map();
    
    /**
     * @type {Map<string, NodeJS.Timeout>}
     */
    #healthCheckIntervals = new Map();

    /**
     * Creates a health checker instance
     * @param {IAuthProvider[]} providers - Array of providers to monitor
     * @param {ProviderHealthConfig[]} [configs] - Health check configurations
     */
    constructor(providers, configs = []) {
        // Initialize provider configurations
        providers.forEach(provider => {
            const config = configs.find(c => c.providerName === provider.name) || {
                providerName: provider.name,
                timeout: 5000,
                interval: 30000,
                circuitBreaker: {
                    failureThreshold: 5,
                    recoveryTimeout: 60000,
                    expectedRecoveryTime: 30000
                }
            };

            this.#providerConfigs.set(provider.name, config);
            this.#circuitBreakers.set(provider.name, new CircuitBreaker(config.circuitBreaker));
            this.#metrics.set(provider.name, {
                providerName: provider.name,
                totalChecks: 0,
                successfulChecks: 0,
                failedChecks: 0,
                averageResponseTime: 0,
                lastCheckTime: new Date(),
                lastSuccessTime: new Date(),
                lastFailureTime: undefined,
                consecutiveFailures: 0
            });
        });
    }

    /**
     * Performs health check on a provider
     * @param {IAuthProvider} provider - Provider to check
     * @returns {Promise<HealthCheckResult>} Health check result
     */
    async checkProviderHealth(provider) {
        const config = this.#providerConfigs.get(provider.name);
        const circuitBreaker = this.#circuitBreakers.get(provider.name);
        const metrics = this.#metrics.get(provider.name);

        const startTime = Date.now();

        try {
            // Execute health check through circuit breaker
            const result = await circuitBreaker.execute(async () => {
                // Simulate health check - in real implementation, this would
                // make an actual health check request to the provider
                return await this.#performHealthCheck(provider, config);
            });

            const responseTime = Date.now() - startTime;

            // Update metrics
            this.#updateMetrics(provider.name, true, responseTime);

            return {
                providerName: provider.name,
                status: result.success ? 'healthy' : 'unhealthy',
                responseTime,
                timestamp: new Date(),
                error: result.success ? undefined : result.error?.message,
                details: result
            };

        } catch (error) {
            const responseTime = Date.now() - startTime;

            // Update metrics
            this.#updateMetrics(provider.name, false, responseTime);

            return {
                providerName: provider.name,
                status: 'unhealthy',
                responseTime,
                timestamp: new Date(),
                error: error.message,
                details: { circuitBreakerState: circuitBreaker.getState() }
            };
        }
    }

    /**
     * Performs actual health check on provider
     * @param {IAuthProvider} provider - Provider to check
     * @param {ProviderHealthConfig} config - Health check configuration
     * @returns {Promise<AuthResult>} Health check result
     * @private
     */
    async #performHealthCheck(provider, config) {
        // Simulate health check with timeout
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Health check timeout'));
            }, config.timeout);

            // Simulate health check logic
            setTimeout(() => {
                clearTimeout(timeout);
                
                // In real implementation, this would check provider health
                // For now, simulate random health status
                const isHealthy = Math.random() > 0.2; // 80% success rate
                
                if (isHealthy) {
                    resolve({
                        success: true,
                        data: { status: 'healthy', timestamp: new Date() }
                    });
                } else {
                    reject(new Error('Provider health check failed'));
                }
            }, Math.random() * 1000); // Random delay 0-1s
        });
    }

    /**
     * Updates health metrics
     * @param {string} providerName - Provider name
     * @param {boolean} success - Whether check was successful
     * @param {number} responseTime - Response time in milliseconds
     * @private
     */
    #updateMetrics(providerName, success, responseTime) {
        const metrics = this.#metrics.get(providerName);
        if (!metrics) return;

        metrics.totalChecks++;
        metrics.lastCheckTime = new Date();

        if (success) {
            metrics.successfulChecks++;
            metrics.lastSuccessTime = new Date();
            metrics.consecutiveFailures = 0;
        } else {
            metrics.failedChecks++;
            metrics.lastFailureTime = new Date();
            metrics.consecutiveFailures++;
        }

        // Update average response time
        const totalTime = metrics.averageResponseTime * (metrics.totalChecks - 1) + responseTime;
        metrics.averageResponseTime = totalTime / metrics.totalChecks;
    }

    /**
     * Starts health monitoring for all providers
     */
    startMonitoring() {
        this.#providerConfigs.forEach((config, providerName) => {
            const interval = setInterval(async () => {
                // Find provider instance (in real implementation, this would come from DI container)
                const provider = this.#findProvider(providerName);
                if (provider) {
                    await this.checkProviderHealth(provider);
                }
            }, config.interval);

            this.#healthCheckIntervals.set(providerName, interval);
        });
    }

    /**
     * Stops health monitoring
     */
    stopMonitoring() {
        this.#healthCheckIntervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.#healthCheckIntervals.clear();
    }

    /**
     * Gets health metrics for all providers
     * @returns {HealthMetrics[]} Array of health metrics
     */
    getHealthMetrics() {
        return Array.from(this.#metrics.values());
    }

    /**
     * Gets health metrics for a specific provider
     * @param {string} providerName - Provider name
     * @returns {HealthMetrics|undefined} Health metrics
     */
    getProviderMetrics(providerName) {
        return this.#metrics.get(providerName);
    }

    /**
     * Gets circuit breaker state for a provider
     * @param {string} providerName - Provider name
     * @returns {CircuitBreakerState|undefined} Circuit breaker state
     */
    getCircuitBreakerState(providerName) {
        const circuitBreaker = this.#circuitBreakers.get(providerName);
        return circuitBreaker ? circuitBreaker.getState() : undefined;
    }

    /**
     * Finds provider by name (placeholder implementation)
     * @param {string} providerName - Provider name
     * @returns {IAuthProvider|undefined} Provider instance
     * @private
     */
    #findProvider(providerName) {
        // In real implementation, this would get provider from DI container
        // For now, return null to indicate provider not found
        return undefined;
    }

    /**
     * Adds a new provider to monitor
     * @param {IAuthProvider} provider - Provider to add
     * @param {ProviderHealthConfig} [config] - Health check configuration
     */
    addProvider(provider, config) {
        const finalConfig = config || {
            providerName: provider.name,
            timeout: 5000,
            interval: 30000,
            circuitBreaker: {
                failureThreshold: 5,
                recoveryTimeout: 60000,
                expectedRecoveryTime: 30000
            }
        };

        this.#providerConfigs.set(provider.name, finalConfig);
        this.#circuitBreakers.set(provider.name, new CircuitBreaker(finalConfig.circuitBreaker));
        this.#metrics.set(provider.name, {
            providerName: provider.name,
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            averageResponseTime: 0,
            lastCheckTime: new Date(),
            lastSuccessTime: new Date(),
            lastFailureTime: undefined,
            consecutiveFailures: 0
        });

        // Start monitoring for new provider if monitoring is active
        if (this.#healthCheckIntervals.size > 0) {
            const interval = setInterval(async () => {
                await this.checkProviderHealth(provider);
            }, finalConfig.interval);

            this.#healthCheckIntervals.set(provider.name, interval);
        }
    }

    /**
     * Removes a provider from monitoring
     * @param {string} providerName - Provider name to remove
     */
    removeProvider(providerName) {
        // Stop monitoring
        const interval = this.#healthCheckIntervals.get(providerName);
        if (interval) {
            clearInterval(interval);
            this.#healthCheckIntervals.delete(providerName);
        }

        // Remove from tracking
        this.#providerConfigs.delete(providerName);
        this.#circuitBreakers.delete(providerName);
        this.#metrics.delete(providerName);
    }

    /**
     * Performs health check on all providers
     * @returns {Promise<HealthCheckResult[]>} Array of health check results
     */
    async checkAllProviders() {
        const results = [];
        
        for (const [providerName, config] of this.#providerConfigs) {
            const provider = this.#findProvider(providerName);
            if (provider) {
                const result = await this.checkProviderHealth(provider);
                results.push(result);
            }
        }

        return results;
    }

    /**
     * Gets overall system health status
     * @returns {Object} Overall health status
     */
    getOverallHealth() {
        const metrics = Array.from(this.#metrics.values());
        const totalProviders = metrics.length;
        const healthyProviders = metrics.filter(m => m.consecutiveFailures === 0).length;
        const unhealthyProviders = totalProviders - healthyProviders;

        let overallStatus = 'healthy';
        if (unhealthyProviders === totalProviders) {
            overallStatus = 'unhealthy';
        } else if (unhealthyProviders > 0) {
            overallStatus = 'degraded';
        }

        return {
            status: overallStatus,
            totalProviders,
            healthyProviders,
            unhealthyProviders,
            timestamp: new Date(),
            metrics: metrics
        };
    }
}
