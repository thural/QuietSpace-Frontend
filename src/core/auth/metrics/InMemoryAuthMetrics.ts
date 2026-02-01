/**
 * In-memory authentication metrics collector
 * 
 * Implements performance monitoring for authentication operations
 * with in-memory storage and comprehensive metrics.
 */

import { IAuthMetrics } from '../interfaces/authInterfaces';

/**
 * In-memory authentication metrics implementation
 */
export class InMemoryAuthMetrics implements IAuthMetrics {
    readonly name = 'InMemoryAuthMetrics';

    private metrics = {
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        averageDuration: 0,
        errorsByType: {} as Record<string, number>,
        attemptsByType: {} as Record<string, number>,
        lastAttempt: null as Date | null,
        lastSuccess: null as Date | null
    };

    /**
     * Records authentication attempt
     */
    recordAttempt(type: string, duration: number): void {
        this.metrics.totalAttempts++;
        this.metrics.attemptsByType[type] = (this.metrics.attemptsByType[type] || 0) + 1;
        this.metrics.lastAttempt = new Date();
        this.metrics.averageDuration = this.calculateAverageDuration(duration);
    }

    /**
     * Records successful authentication
     */
    recordSuccess(type: string, duration: number): void {
        this.metrics.successfulAttempts++;
        this.metrics.attemptsByType[type] = (this.metrics.attemptsByType[type] || 0) + 1;
        this.metrics.averageDuration = this.calculateAverageDuration(duration);
        this.metrics.lastSuccess = new Date();
    }

    /**
     * Records authentication failure
     */
    recordFailure(type: string, error: string, duration: number): void {
        this.metrics.failedAttempts++;
        this.metrics.errorsByType[error] = (this.metrics.errorsByType[error] || 0) + 1;
        this.metrics.attemptsByType[type] = (this.metrics.attemptsByType[type] || 0) + 1;
        this.metrics.averageDuration = this.calculateAverageDuration(duration);
    }

    /**
     * Gets performance metrics
     */
    getMetrics(timeRange?: { start: Date; end: Date }): {
        totalAttempts: number;
        successRate: number;
        failureRate: number;
        averageDuration: number;
        errorsByType: Record<string, number>;
        attemptsByType: Record<string, number>;
    } {
        // For in-memory implementation, we currently don't store timestamps
        // so timeRange filtering is not applicable. Return all metrics.
        // Future enhancement: store timestamps with each metric for proper filtering
        if (timeRange) {
            console.warn('Time range filtering not supported in InMemoryAuthMetrics - returning all metrics');
        }

        return {
            totalAttempts: this.metrics.totalAttempts,
            successRate: this.calculateSuccessRate(),
            failureRate: this.calculateFailureRate(),
            averageDuration: this.metrics.averageDuration,
            errorsByType: { ...this.metrics.errorsByType },
            attemptsByType: { ...this.metrics.attemptsByType }
        };
    }

    /**
     * Resets all metrics
     */
    reset(): void {
        this.metrics = {
            totalAttempts: 0,
            successfulAttempts: 0,
            failedAttempts: 0,
            averageDuration: 0,
            errorsByType: {} as Record<string, number>,
            attemptsByType: {} as Record<string, number>,
            lastAttempt: null,
            lastSuccess: null
        };
    }

    /**
     * Calculates success rate
     */
    private calculateSuccessRate(): number {
        return this.metrics.totalAttempts > 0
            ? (this.metrics.successfulAttempts / this.metrics.totalAttempts) * 100
            : 0;
    }

    /**
     * Calculates failure rate
     */
    private calculateFailureRate(): number {
        return this.metrics.totalAttempts > 0
            ? (this.metrics.failedAttempts / this.metrics.totalAttempts) * 100
            : 0;
    }

    /**
     * Calculates average duration
     */
    private calculateAverageDuration(newDuration: number): number {
        const totalDuration = this.metrics.averageDuration * (this.metrics.totalAttempts - 1) + newDuration;
        return totalDuration / this.metrics.totalAttempts;
    }
}
