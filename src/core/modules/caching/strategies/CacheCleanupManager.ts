/**
 * Cache Cleanup Manager Component
 * 
 * Handles cleanup operations for expired cache entries.
 * Follows Single Responsibility Principle by focusing only on cleanup management.
 */

/**
 * Interface for cache cleanup management.
 * Provides timer-based cleanup of expired cache entries.
 */
export interface ICleanupManager {
    /**
     * Starts periodic cleanup of expired cache entries.
     * @param interval - Cleanup interval in milliseconds
     * @param cleanupFn - Function to execute for cleanup
     */
    startCleanup(interval: number, cleanupFn: () => Promise<void>): void;

    /**
     * Stops the periodic cleanup timer.
     */
    stopCleanup(): void;

    /**
     * Manually triggers cleanup of expired entries.
     */
    cleanupExpired(): Promise<void>;
}

/**
 * Cache cleanup manager implementation.
 * Manages timer-based cleanup of expired cache entries.
 */
export class CacheCleanupManager implements ICleanupManager {
    private cleanupTimer?: ReturnType<typeof setInterval>;
    private cleanupFn?: () => Promise<void>;

    /**
     * Starts periodic cleanup of expired cache entries.
     * @param interval - Cleanup interval in milliseconds
     * @param cleanupFn - Function to execute for cleanup
     */
    startCleanup(interval: number, cleanupFn: () => Promise<void>): void {
        this.cleanupFn = cleanupFn;

        if (interval > 0) {
            this.cleanupTimer = setInterval(async () => {
                await this.cleanupExpired();
            }, interval);
        }
    }

    /**
     * Stops the periodic cleanup timer.
     */
    stopCleanup(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = undefined as any;
        }
    }

    /**
     * Manually triggers cleanup of expired entries.
     */
    async cleanupExpired(): Promise<void> {
        if (this.cleanupFn) {
            await this.cleanupFn();
        }
    }

    /**
     * Checks if cleanup timer is currently active.
     * @returns True if cleanup timer is running
     */
    isCleanupActive(): boolean {
        return this.cleanupTimer !== undefined;
    }
}
