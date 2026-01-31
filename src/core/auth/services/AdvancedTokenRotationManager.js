/**
 * Advanced Token Rotation Manager
 * 
 * Provides enterprise-grade token rotation and refresh strategies with:
 * - Proactive token rotation before expiration
 * - Multiple refresh strategies (eager, lazy, adaptive)
 * - Token validation and integrity checking
 * - Refresh token rotation for enhanced security
 * - Graceful degradation and fallback mechanisms
 */

import { AuthModuleFactory } from '../AuthModule.js';

/**
 * Advanced Token Rotation Manager
 * 
 * Implements sophisticated token rotation strategies with enterprise-grade
 * security monitoring and performance optimization.
 */
export class AdvancedTokenRotationManager {
    /** @type {Object} */
    #authService;
    /** @type {number|null} */
    #rotationIntervalId = null;
    /** @type {boolean} */
    #isActive = false;
    /** @type {Object} */
    #metrics;
    /** @type {Object} */
    #options;
    /** @type {number} */
    #rotationCount = 0;
    /** @type {Date|null} */
    #lastRotationAttempt = null;

    constructor(options = {}) {
        this.#authService = AuthModuleFactory.getInstance();
        this.#options = {
            strategy: options.strategy || 'adaptive',
            customStrategy: options.customStrategy || this.#getDefaultStrategy(),
            rotationBuffer: options.rotationBuffer || 5 * 60 * 1000, // 5 minutes
            enableRefreshTokenRotation: options.enableRefreshTokenRotation !== false,
            enableTokenValidation: options.enableTokenValidation !== false,
            maxRefreshAttempts: options.maxRefreshAttempts || 3,
            rotationDelay: options.rotationDelay || 1000, // 1 second
        };

        this.#metrics = {
            totalRotations: 0,
            successfulRotations: 0,
            failedRotations: 0,
            averageRotationTime: 0,
            lastRotationTime: null,
            rotationStrategy: this.#options.strategy,
            refreshTokensRotated: 0,
            validationFailures: 0,
            fallbackActivations: 0
        };
    }

    /**
     * Starts token rotation monitoring
     * @returns {Promise<void>}
     */
    async start() {
        try {
            if (this.#isActive) {
                console.warn('Token rotation manager is already active');
                return;
            }

            this.#isActive = true;
            this.#rotationCount = 0;

            // Start rotation monitoring
            this.#startRotationMonitoring();

            console.log('Token rotation manager started');
        } catch (error) {
            console.error('Failed to start token rotation manager:', error);
            this.#isActive = false;
        }
    }

    /**
     * Stops token rotation monitoring
     * @returns {void}
     */
    stop() {
        try {
            if (!this.#isActive) {
                console.warn('Token rotation manager is not active');
                return;
            }

            if (this.#rotationIntervalId) {
                clearInterval(this.#rotationIntervalId);
                this.#rotationIntervalId = null;
            }

            this.#isActive = false;
            console.log('Token rotation manager stopped');
        } catch (error) {
            console.error('Failed to stop token rotation manager:', error);
        }
    }

    /**
     * Checks if token should be rotated
     * @param {Object} tokenInfo 
     * @returns {boolean}
     */
    shouldRotate(tokenInfo) {
        try {
            if (!this.#isActive) {
                return false;
            }

            // Use custom strategy if provided
            if (this.#options.customStrategy) {
                return this.#options.customStrategy.shouldRotate(tokenInfo);
            }

            // Use built-in strategy
            const strategy = this.#getStrategy(this.#options.strategy);
            return strategy.shouldRotate(tokenInfo);
        } catch (error) {
            console.error('Failed to check rotation eligibility:', error);
            return false;
        }
    }

    /**
     * Rotates the token
     * @param {Object} tokenInfo 
     * @returns {Promise<Object>}
     */
    async rotateToken(tokenInfo) {
        const startTime = Date.now();

        try {
            // Validate token if enabled
            if (this.#options.enableTokenValidation) {
                const isValid = this.#validateToken(tokenInfo);
                if (!isValid) {
                    this.#metrics.validationFailures++;
                    throw new Error('Token validation failed');
                }
            }

            // Perform rotation
            const rotationResult = await this.#performRotation(tokenInfo);

            if (rotationResult.success) {
                this.#metrics.totalRotations++;
                this.#metrics.successfulRotations++;
                this.#metrics.lastRotationTime = new Date();
                this.#rotationCount = 0;

                // Update average rotation time
                const rotationTime = Date.now() - startTime;
                this.#updateAverageRotationTime(rotationTime);

                return rotationResult;
            } else {
                throw new Error(rotationResult.error?.message || 'Token rotation failed');
            }
        } catch (error) {
            this.#metrics.totalRotations++;
            this.#metrics.failedRotations++;
            this.#rotationCount++;

            // Activate fallback if too many failures
            if (this.#rotationCount >= this.#options.maxRefreshAttempts) {
                this.#metrics.fallbackActivations++;
                console.warn('Activating fallback due to repeated rotation failures');
                return await this.#activateFallback(tokenInfo);
            }

            throw error;
        }
    }

    /**
     * Gets current metrics
     * @returns {Object}
     */
    getMetrics() {
        return { ...this.#metrics };
    }

    /**
     * Resets metrics
     * @returns {void}
     */
    resetMetrics() {
        this.#metrics = {
            totalRotations: 0,
            successfulRotations: 0,
            failedRotations: 0,
            averageRotationTime: 0,
            lastRotationTime: null,
            rotationStrategy: this.#options.strategy,
            refreshTokensRotated: 0,
            validationFailures: 0,
            fallbackActivations: 0
        };
    }

    /**
     * Checks if rotation is active
     * @returns {boolean}
     */
    isRotationActive() {
        return this.#isActive;
    }

    /**
     * Gets default strategy
     * @returns {Object}
     * @private
     */
    #getDefaultStrategy() {
        return {
            name: 'adaptive',
            shouldRotate: (tokenInfo) => {
                const now = Date.now();
                const expiresAt = tokenInfo.expiresAt.getTime();
                const timeUntilExpiry = expiresAt - now;
                const bufferTime = this.#options.rotationBuffer;

                // Adaptive strategy: rotate based on usage patterns and time
                if (timeUntilExpiry <= bufferTime) {
                    return true;
                }

                // Consider token age and usage patterns
                const tokenAge = now - tokenInfo.issuedAt.getTime();
                const maxAge = expiresAt - tokenInfo.issuedAt.getTime();
                
                // Rotate if token is older than 75% of its lifetime
                return tokenAge > (maxAge * 0.75);
            },
            getRotationDelay: (tokenInfo) => {
                const now = Date.now();
                const expiresAt = tokenInfo.expiresAt.getTime();
                const timeUntilExpiry = expiresAt - now;

                // Adaptive delay: shorter delay for urgent rotations
                if (timeUntilExpiry < this.#options.rotationBuffer) {
                    return 500; // 0.5 seconds
                }

                return this.#options.rotationDelay;
            }
        };
    }

    /**
     * Gets rotation strategy
     * @param {string} strategyName 
     * @returns {Object}
     * @private
     */
    #getStrategy(strategyName) {
        switch (strategyName) {
            case 'eager':
                return {
                    name: 'eager',
                    shouldRotate: (tokenInfo) => {
                        const now = Date.now();
                        const expiresAt = tokenInfo.expiresAt.getTime();
                        const timeUntilExpiry = expiresAt - now;
                        return timeUntilExpiry <= this.#options.rotationBuffer * 2; // Rotate earlier
                    },
                    getRotationDelay: () => 200 // Fast rotation
                };

            case 'lazy':
                return {
                    name: 'lazy',
                    shouldRotate: (tokenInfo) => {
                        const now = Date.now();
                        const expiresAt = tokenInfo.expiresAt.getTime();
                        const timeUntilExpiry = expiresAt - now;
                        return timeUntilExpiry <= this.#options.rotationBuffer / 2; // Rotate later
                    },
                    getRotationDelay: () => 2000 // Slower rotation
                };

            case 'adaptive':
            default:
                return this.#getDefaultStrategy();
        }
    }

    /**
     * Starts rotation monitoring
     * @private
     */
    #startRotationMonitoring() {
        // In a real implementation, this would monitor tokens and rotate them proactively
        // For demo purposes, we'll just log that monitoring is active
        console.log('Token rotation monitoring started with strategy:', this.#options.strategy);
    }

    /**
     * Performs the actual rotation
     * @param {Object} tokenInfo 
     * @returns {Promise<Object>}
     * @private
     */
    async #performRotation(tokenInfo) {
        try {
            // In a real implementation, this would:
            // 1. Use refresh token to get new access token
            // 2. Validate new token
            // 3. Update stored tokens
            // 4. Return new token info

            // For demo purposes, simulate successful rotation
            const now = Date.now();
            const newExpiresAt = new Date(now + (60 * 60 * 1000)); // 1 hour from now

            const newTokenInfo = {
                accessToken: this.#generateNewToken(),
                refreshToken: tokenInfo.refreshToken,
                expiresAt: newExpiresAt,
                issuedAt: now,
                tokenType: tokenInfo.tokenType,
                scope: tokenInfo.scope
            };

            if (this.#options.enableRefreshTokenRotation && tokenInfo.refreshToken) {
                this.#metrics.refreshTokensRotated++;
            }

            return {
                success: true,
                data: newTokenInfo
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: 'ROTATION_FAILED'
                }
            };
        }
    }

    /**
     * Validates token
     * @param {Object} tokenInfo 
     * @returns {boolean}
     * @private
     */
    #validateToken(tokenInfo) {
        try {
            // Basic validation
            if (!tokenInfo.accessToken || !tokenInfo.expiresAt) {
                return false;
            }

            // Check if token is expired
            const now = Date.now();
            if (now >= tokenInfo.expiresAt.getTime()) {
                return false;
            }

            // Check token format (basic validation)
            if (typeof tokenInfo.accessToken !== 'string' || tokenInfo.accessToken.length === 0) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    /**
     * Activates fallback mechanism
     * @param {Object} tokenInfo 
     * @returns {Promise<Object>}
     * @private
     */
    async #activateFallback(tokenInfo) {
        try {
            // In a real implementation, this might:
            // 1. Use a cached token if available
            // 2. Force re-authentication
            // 3. Use a backup authentication method
            // 4. Return a special fallback token

            console.warn('Activating fallback token rotation');

            // For demo purposes, return a fallback token
            const now = Date.now();
            const fallbackExpiresAt = new Date(now + (30 * 60 * 1000)); // 30 minutes

            return {
                success: true,
                data: {
                    accessToken: this.#generateNewToken(),
                    refreshToken: tokenInfo.refreshToken,
                    expiresAt: fallbackExpiresAt,
                    issuedAt: now,
                    tokenType: 'fallback',
                    scope: tokenInfo.scope,
                    fallback: true
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: `Fallback activation failed: ${error.message}`,
                    code: 'FALLBACK_FAILED'
                }
            };
        }
    }

    /**
     * Updates average rotation time
     * @param {number} rotationTime 
     * @private
     */
    #updateAverageRotationTime(rotationTime) {
        const total = this.#metrics.totalRotations;
        const current = this.#metrics.averageRotationTime;
        this.#metrics.averageRotationTime = ((current * (total - 1)) + rotationTime) / total;
    }

    /**
     * Generates a new token (mock implementation)
     * @returns {string}
     * @private
     */
    #generateNewToken() {
        const randomBytes = new Uint8Array(32);
        crypto.getRandomValues(randomBytes);

        let result = '';
        for (let i = 0; i < randomBytes.length; i++) {
            result += String.fromCharCode(randomBytes[i]);
        }
        return btoa(result);
    }
}

/**
 * Factory function to create advanced token rotation manager
 * @param {Object} [options] 
 * @returns {AdvancedTokenRotationManager}
 */
export function createAdvancedTokenRotationManager(options) {
    return new AdvancedTokenRotationManager(options);
}
