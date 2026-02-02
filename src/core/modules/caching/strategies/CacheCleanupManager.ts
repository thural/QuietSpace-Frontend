/**
 * Cache Cleanup Manager Component
 * 
 * Handles cleanup operations for expired cache entries.
 * Follows Single Responsibility Principle by focusing only on cleanup management.
 */

export interface ICleanupManager {
    startCleanup(interval: number, cleanupFn: () => Promise<void>): void;
    stopCleanup(): void;
    cleanupExpired(): Promise<void>;
}

export class CacheCleanupManager implements ICleanupManager {
    private cleanupTimer?: ReturnType<typeof setInterval>;
    private cleanupFn?: () => Promise<void>;

    startCleanup(interval: number, cleanupFn: () => Promise<void>): void {
        this.cleanupFn = cleanupFn;

        if (interval > 0) {
            this.cleanupTimer = setInterval(async () => {
                await this.cleanupExpired();
            }, interval);
        }
    }

    stopCleanup(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = undefined as any;
        }
    }

    async cleanupExpired(): Promise<void> {
        if (this.cleanupFn) {
            await this.cleanupFn();
        }
    }

    /**
     * Check if cleanup timer is active
     */
    isCleanupActive(): boolean {
        return this.cleanupTimer !== undefined;
    }
}
