/**
 * In-memory authentication metrics collector
 * 
 * Implements performance monitoring for authentication operations
 * with in-memory storage and comprehensive metrics.
 */

// Import types via JSDoc typedefs
/**
 * @typedef {import('../interfaces/authInterfaces.js').IAuthMetrics} IAuthMetrics
 */

/**
 * In-memory authentication metrics implementation
 * 
 * @class InMemoryAuthMetrics
 * @description In-memory metrics collector for authentication operations
 */
export class InMemoryAuthMetrics {
    /**
     * Metrics collector name
     * 
     * @type {string}
     */
    name = 'InMemoryAuthMetrics';

    /**
     * Internal metrics storage
     * 
     * @type {Object}
     * @private
     */
    #metrics = {
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        averageDuration: 0,
        errorsByType: {},
        attemptsByType: {},
        lastAttempt: null,
        lastSuccess: null
    };

    /**
     * Records authentication attempt
     * 
     * @param {string} type 
     * @param {number} duration 
     * @returns {void}
     */
    recordAttempt(type, duration) {
        this.#metrics.totalAttempts++;
        this.#metrics.attemptsByType[type] = (this.#metrics.attemptsByType[type] || 0) + 1;
        this.#metrics.lastAttempt = new Date();
        this.#metrics.averageDuration = this.#calculateAverageDuration(duration);
    }

    /**
     * Records successful authentication
     * 
     * @param {string} type 
     * @param {number} duration 
     * @returns {void}
     */
    recordSuccess(type, duration) {
        this.#metrics.successfulAttempts++;
        this.#metrics.attemptsByType[type] = (this.#metrics.attemptsByType[type] || 0) + 1;
        this.#metrics.averageDuration = this.#calculateAverageDuration(duration);
        this.#metrics.lastSuccess = new Date();
    }

    /**
     * Records authentication failure
     * 
     * @param {string} type 
     * @param {string} error 
     * @param {number} duration 
     * @returns {void}
     */
    recordFailure(type, error, duration) {
        this.#metrics.failedAttempts++;
        this.#metrics.errorsByType[error] = (this.#metrics.errorsByType[error] || 0) + 1;
        this.#metrics.attemptsByType[type] = (this.#metrics.attemptsByType[type] || 0) + 1;
        this.#metrics.averageDuration = this.#calculateAverageDuration(duration);
    }

    /**
     * Gets current metrics
     * 
     * @returns {Object} Current metrics data
     */
    getMetrics() {
        return {
            ...this.#metrics,
            successRate: this.#calculateSuccessRate(),
            failureRate: this.#calculateFailureRate()
        };
    }

    /**
     * Resets all metrics
     * 
     * @returns {void}
     */
    reset() {
        this.#metrics = {
            totalAttempts: 0,
            successfulAttempts: 0,
            failedAttempts: 0,
            averageDuration: 0,
            errorsByType: {},
            attemptsByType: {},
            lastAttempt: null,
            lastSuccess: null
        };
    }

    /**
     * Calculates success rate
     * 
     * @returns {number} Success rate as percentage
     * @private
     */
    #calculateSuccessRate() {
        if (this.#metrics.totalAttempts === 0) return 0;
        return (this.#metrics.successfulAttempts / this.#metrics.totalAttempts) * 100;
    }

    /**
     * Calculates failure rate
     * 
     * @returns {number} Failure rate as percentage
     * @private
     */
    #calculateFailureRate() {
        if (this.#metrics.totalAttempts === 0) return 0;
        return (this.#metrics.failedAttempts / this.#metrics.totalAttempts) * 100;
    }

    /**
     * Calculates average duration
     * 
     * @param {number} newDuration 
     * @returns {number} Updated average duration
     * @private
     */
    #calculateAverageDuration(newDuration) {
        if (this.#metrics.totalAttempts === 0) return newDuration;
        
        const totalDuration = this.#metrics.averageDuration * (this.#metrics.totalAttempts - 1) + newDuration;
        return totalDuration / this.#metrics.totalAttempts;
    }
}
