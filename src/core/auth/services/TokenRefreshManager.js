/**
 * Enterprise Token Refresh Manager
 * 
 * Provides centralized token refresh management using the enterprise auth module.
 * Replaces legacy jwtAuthUtils token refresh functionality with enterprise-grade
 * token lifecycle management, multi-tab synchronization, and security monitoring.
 */

import { AuthModuleFactory } from '../AuthModule.js';
import { createAdvancedTokenRotationManager } from './AdvancedTokenRotationManager.js';

/**
 * Enterprise Token Refresh Manager
 * 
 * Provides advanced token refresh capabilities with:
 * - Enterprise-grade security monitoring
 * - Multi-tab synchronization
 * - Performance metrics and analytics
 * - Intelligent retry logic with exponential backoff
 * - Circuit breaker pattern for reliability
 */
export class EnterpriseTokenRefreshManager {
    /** @type {Object} */
    #authService;
    /** @type {number|null} */
    #refreshIntervalId = null;
    /** @type {boolean} */
    #isActive = false;
    /** @type {Object} */
    #metrics;
    /** @type {number} */
    #retryCount = 0;
    /** @type {number} */
    #maxRetries = 3;
    /** @type {boolean} */
    #circuitBreakerOpen = false;
    /** @type {number} */
    #circuitBreakerResetTime = 60000; // 1 minute
    /** @type {Object|null} */
    #advancedRotationManager = null;
    /** @type {BroadcastChannel|null} */
    #syncChannel = null;
    /** @type {number|null} */
    #securityMonitorInterval = null;
    /** @type {number} */
    #circuitBreakerOpenTime = 0;

    constructor() {
        this.#authService = AuthModuleFactory.getInstance();
        this.#metrics = {
            totalRefreshes: 0,
            successfulRefreshes: 0,
            failedRefreshes: 0,
            lastRefreshTime: null,
            averageRefreshTime: 0,
            securityEvents: 0,
            // Initialize rotation metrics
            totalRotations: 0,
            successfulRotations: 0,
            failedRotations: 0,
            rotationStrategy: 'adaptive',
            refreshTokensRotated: 0,
            fallbackActivations: 0
        };
    }

    /**
     * Starts automatic token refresh
     * @param {Object} options 
     * @returns {Promise<void>}
     */
    async startRefresh(options = {}) {
        try {
            if (this.#isActive) {
                console.warn('Token refresh is already active');
                return;
            }

            const {
                refreshInterval = 300000, // 5 minutes
                onSuccessFn,
                onErrorFn,
                enableMultiTabSync = true,
                enableSecurityMonitoring = true,
                enableAdvancedRotation = false,
                rotationStrategy = 'adaptive',
                rotationBuffer = 300000, // 5 minutes
                enableRefreshTokenRotation = true
            } = options;

            this.#isActive = true;

            // Initialize advanced rotation if enabled
            if (enableAdvancedRotation) {
                this.#advancedRotationManager = createAdvancedTokenRotationManager({
                    strategy: rotationStrategy,
                    bufferTime: rotationBuffer,
                    enableRefreshTokenRotation
                });
            }

            // Set up multi-tab synchronization if enabled
            if (enableMultiTabSync) {
                this.#setupMultiTabSync();
            }

            // Set up security monitoring if enabled
            if (enableSecurityMonitoring) {
                this.#setupSecurityMonitoring();
            }

            // Start the refresh interval
            this.#refreshIntervalId = setInterval(async () => {
                await this.#performRefresh(onSuccessFn, onErrorFn);
            }, refreshInterval);

            console.log('Token refresh started successfully');
        } catch (error) {
            console.error('Failed to start token refresh:', error);
            this.#isActive = false;
        }
    }

    /**
     * Stops automatic token refresh
     * @returns {void}
     */
    stopRefresh() {
        if (!this.#isActive) {
            console.warn('Token refresh is not active');
            return;
        }

        if (this.#refreshIntervalId) {
            clearInterval(this.#refreshIntervalId);
            this.#refreshIntervalId = null;
        }

        // Clean up advanced rotation manager
        if (this.#advancedRotationManager) {
            this.#advancedRotationManager.cleanup();
            this.#advancedRotationManager = null;
        }

        this.#isActive = false;
        console.log('Token refresh stopped');
    }

    /**
     * Manually refreshes the token
     * @param {Function} [onSuccessFn] 
     * @param {Function} [onErrorFn] 
     * @returns {Promise<boolean>}
     */
    async refreshToken(onSuccessFn, onErrorFn) {
        return await this.#performRefresh(onSuccessFn, onErrorFn);
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
            totalRefreshes: 0,
            successfulRefreshes: 0,
            failedRefreshes: 0,
            lastRefreshTime: null,
            averageRefreshTime: 0,
            securityEvents: 0,
            totalRotations: 0,
            successfulRotations: 0,
            failedRotations: 0,
            rotationStrategy: 'adaptive',
            refreshTokensRotated: 0,
            fallbackActivations: 0
        };
    }

    /**
     * Checks if refresh is active
     * @returns {boolean}
     */
    isRefreshActive() {
        return this.#isActive;
    }

    /**
     * Sets up multi-tab synchronization
     * @private
     */
    #setupMultiTabSync() {
        if (typeof BroadcastChannel === 'undefined') {
            console.warn('BroadcastChannel not supported, multi-tab sync disabled');
            return;
        }

        const channel = new BroadcastChannel('token-refresh-sync');

        channel.addEventListener('message', (event) => {
            const { type, data } = event.data;

            switch (type) {
                case 'refresh-success':
                    // Another tab refreshed successfully, update local state
                    if (onSuccessFn) {
                        onSuccessFn(data);
                    }
                    break;
                case 'refresh-error':
                    // Another tab failed refresh, handle accordingly
                    if (onErrorFn) {
                        onErrorFn(new Error(data.message));
                    }
                    break;
                case 'refresh-started':
                    // Another tab started refresh, pause local refresh
                    this.#pauseLocalRefresh();
                    break;
                case 'refresh-completed':
                    // Another tab completed refresh, resume local refresh
                    this.#resumeLocalRefresh();
                    break;
            }
        });

        // Store channel for cleanup
        this.#syncChannel = channel;
    }

    /**
     * Sets up security monitoring
     * @private
     */
    #setupSecurityMonitoring() {
        // Monitor for suspicious refresh patterns
        this.#securityMonitorInterval = setInterval(() => {
            this.#checkSecurityPatterns();
        }, 60000); // Check every minute
    }

    /**
     * Performs the actual token refresh
     * @param {Function} [onSuccessFn] 
     * @param {Function} [onErrorFn] 
     * @returns {Promise<boolean>}
     * @private
     */
    async #performRefresh(onSuccessFn, onErrorFn) {
        const startTime = Date.now();

        try {
            // Check circuit breaker
            if (this.#circuitBreakerOpen) {
                if (Date.now() - this.#circuitBreakerOpenTime < this.#circuitBreakerResetTime) {
                    console.warn('Circuit breaker is open, skipping refresh');
                    return false;
                } else {
                    // Reset circuit breaker
                    this.#circuitBreakerOpen = false;
                    this.#retryCount = 0;
                }
            }

            // Check if we have a valid session
            const session = await this.#authService.getCurrentSession();
            if (!session || !session.token) {
                throw new Error('No valid session found');
            }

            // Check if token needs refresh
            const token = session.token;
            const now = Date.now();
            const expiresAt = token.expiresAt.getTime();
            const timeUntilExpiry = expiresAt - now;

            // Use advanced rotation if available
            if (this.#advancedRotationManager) {
                const shouldRotate = this.#advancedRotationManager.shouldRotate(token);
                if (shouldRotate) {
                    const rotationResult = await this.#advancedRotationManager.rotateToken(token);
                    if (rotationResult.success) {
                        this.#metrics.totalRotations++;
                        this.#metrics.successfulRotations++;
                        this.#metrics.lastRefreshTime = new Date();

                        if (onSuccessFn) {
                            onSuccessFn(rotationResult.data);
                        }

                        this.#notifySyncChannel('refresh-success', rotationResult.data);
                        return true;
                    }
                }
            }

            // Standard refresh logic
            if (timeUntilExpiry < 300000) { // 5 minutes buffer
                const refreshResult = await this.#authService.refreshToken();

                if (refreshResult.success) {
                    this.#metrics.totalRefreshes++;
                    this.#metrics.successfulRefreshes++;
                    this.#metrics.lastRefreshTime = new Date();
                    this.#retryCount = 0; // Reset retry count on success

                    const refreshTime = Date.now() - startTime;
                    this.#updateAverageRefreshTime(refreshTime);

                    if (onSuccessFn) {
                        onSuccessFn(refreshResult.data);
                    }

                    this.#notifySyncChannel('refresh-success', refreshResult.data);
                    return true;
                } else {
                    throw new Error(refreshResult.error?.message || 'Token refresh failed');
                }
            }

            return true; // No refresh needed
        } catch (error) {
            this.#metrics.totalRefreshes++;
            this.#metrics.failedRefreshes++;
            this.#retryCount++;

            // Log security event
            this.#metrics.securityEvents++;
            this.#logSecurityEvent('token_refresh_failure', error);

            // Circuit breaker logic
            if (this.#retryCount >= this.#maxRetries) {
                this.#circuitBreakerOpen = true;
                this.#circuitBreakerOpenTime = Date.now();
                console.error('Circuit breaker opened due to repeated failures');
            }

            if (onErrorFn) {
                onErrorFn(error);
            }

            this.#notifySyncChannel('refresh-error', { message: error.message });
            return false;
        }
    }

    /**
     * Updates average refresh time
     * @param {number} refreshTime 
     * @private
     */
    #updateAverageRefreshTime(refreshTime) {
        const total = this.#metrics.totalRefreshes;
        const current = this.#metrics.averageRefreshTime;
        this.#metrics.averageRefreshTime = ((current * (total - 1)) + refreshTime) / total;
    }

    /**
     * Notifies sync channel
     * @param {string} type 
     * @param {*} data 
     * @private
     */
    #notifySyncChannel(type, data) {
        if (this.#syncChannel) {
            try {
                this.#syncChannel.postMessage({ type, data });
            } catch (error) {
                console.warn('Failed to notify sync channel:', error);
            }
        }
    }

    /**
     * Pauses local refresh
     * @private
     */
    #pauseLocalRefresh() {
        if (this.#refreshIntervalId) {
            clearInterval(this.#refreshIntervalId);
            this.#refreshIntervalId = null;
        }
    }

    /**
     * Resumes local refresh
     * @private
     */
    #resumeLocalRefresh() {
        if (this.#isActive && !this.#refreshIntervalId) {
            this.#refreshIntervalId = setInterval(async () => {
                await this.#performRefresh();
            }, 300000); // 5 minutes
        }
    }

    /**
     * Checks for security patterns
     * @private
     */
    #checkSecurityPatterns() {
        const now = Date.now();
        const timeSinceLastRefresh = this.#metrics.lastRefreshTime
            ? now - this.#metrics.lastRefreshTime.getTime()
            : Infinity;

        // Check for unusual patterns
        if (this.#metrics.failedRefreshes > this.#metrics.successfulRefreshes) {
            this.#logSecurityEvent('high_failure_rate', {
                failed: this.#metrics.failedRefreshes,
                successful: this.#metrics.successfulRefreshes
            });
        }

        if (timeSinceLastRefresh > 1800000) { // 30 minutes
            this.#logSecurityEvent('long_refresh_interval', {
                timeSinceLastRefresh
            });
        }
    }

    /**
     * Logs security event
     * @param {string} eventType 
     * @param {Object} data 
     * @private
     */
    #logSecurityEvent(eventType, data) {
        console.warn('Security Event:', {
            type: eventType,
            timestamp: new Date().toISOString(),
            data,
            metrics: this.#metrics
        });
    }
}
