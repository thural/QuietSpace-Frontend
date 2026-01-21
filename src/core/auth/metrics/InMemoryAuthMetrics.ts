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
        lastAttempt: null as Date | null,
        lastSuccess: null as Date | null
    };

    /**
     * Records authentication attempt
     */
    recordAttempt(type: string, duration: number): void {
        this.metrics.totalAttempts++;
        this.metrics.lastAttempt = new Date();
    }

    /**
     * Records successful authentication
     */
    recordSuccess(type: string, duration: number): void {
        this.metrics.successfulAttempts++;
        this.metrics.averageDuration = this.calculateAverageDuration(duration);
        this.metrics.lastSuccess = new Date();
    }

    /**
     * Records authentication failure
     */
    recordFailure(type: string, error: string, duration: number): void {
        this.metrics.failedAttempts++;
        this.metrics.errorsByType[error] = (this.metrics.errorsByType[error] || 0) + 1;
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
    } {
        return {
            totalAttempts: this.metrics.totalAttempts,
            successRate: this.calculateSuccessRate(),
            failureRate: this.calculateFailureRate(),
            averageDuration: this.metrics.averageDuration,
            errorsByType: { ...this.metrics.errorsByType }
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
