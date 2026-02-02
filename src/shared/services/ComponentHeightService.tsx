/**
 * Enterprise Component Height Service
 * 
 * A class-based service that replaces the useComponentHeight hook
 * with enterprise patterns for height calculation and resize monitoring.
 */

import { RefObject } from 'react';

// Service interface for type safety
export interface IComponentHeightService {
    getHeight(ref: RefObject<HTMLElement>): number;
    subscribe(ref: RefObject<HTMLElement>, callback: (height: number) => void): () => void;
    unsubscribe(ref: RefObject<HTMLElement>): void;
    destroy(): void;
}

// Height subscription entry
interface HeightSubscription {
    ref: RefObject<HTMLElement>;
    callback: (height: number) => void;
    lastHeight: number;
}

/**
 * ComponentHeightService - Enterprise service for managing component height calculations
 * 
 * Provides centralized height monitoring with resize event handling,
 * subscription management, and proper cleanup.
 */
class ComponentHeightService implements IComponentHeightService {
    private subscriptions: Map<string, HeightSubscription> = new Map();
    private resizeObserver: ResizeObserver | null = null;
    private isDestroyed: boolean = false;

    constructor() {
        this.initializeResizeObserver();
    }

    /**
     * Initialize ResizeObserver for efficient height monitoring
     */
    private initializeResizeObserver = (): void => {
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        }
    };

    /**
     * Handle resize events from ResizeObserver
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        if (this.isDestroyed) return;

        entries.forEach(entry => {
            const subscription = this.findSubscriptionByElement(entry.target as HTMLElement);
            if (subscription) {
                const newHeight = entry.contentRect.height;
                if (newHeight !== subscription.lastHeight) {
                    subscription.lastHeight = newHeight;
                    subscription.callback(newHeight);
                }
            }
        });
    };

    /**
     * Find subscription by DOM element
     */
    private findSubscriptionByElement = (element: HTMLElement): HeightSubscription | undefined => {
        for (const subscription of this.subscriptions.values()) {
            if (subscription.ref.current === element) {
                return subscription;
            }
        }
        return undefined;
    };

    /**
     * Generate unique key for subscription
     */
    private generateSubscriptionKey = (ref: RefObject<HTMLElement>): string => {
        return `height_${ref.current?.clientHeight || 0}_${Date.now()}_${Math.random()}`;
    };

    /**
     * Get current height of a component
     */
    public getHeight = (ref: RefObject<HTMLElement>): number => {
        return ref.current?.clientHeight || 0;
    };

    /**
     * Subscribe to height changes for a component
     */
    public subscribe = (ref: RefObject<HTMLElement>, callback: (height: number) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const key = this.generateSubscriptionKey(ref);
        const initialHeight = this.getHeight(ref);

        const subscription: HeightSubscription = {
            ref,
            callback,
            lastHeight: initialHeight
        };

        this.subscriptions.set(key, subscription);

        // Set up monitoring
        this.setupMonitoring(ref);

        // Return unsubscribe function
        return () => {
            this.unsubscribeByKey(key);
        };
    };

    /**
     * Set up monitoring for a component
     */
    private setupMonitoring = (ref: RefObject<HTMLElement>): void => {
        if (!ref.current) return;

        // Use ResizeObserver if available
        if (this.resizeObserver) {
            this.resizeObserver.observe(ref.current);
        } else {
            // Fallback to window resize events
            this.setupFallbackMonitoring(ref);
        }
    };

    /**
     * Fallback monitoring using window resize events
     */
    private setupFallbackMonitoring = (ref: RefObject<HTMLElement>): void => {
        const handleResize = () => {
            const subscription = this.findSubscriptionByElement(ref.current!);
            if (subscription) {
                const newHeight = this.getHeight(ref);
                if (newHeight !== subscription.lastHeight) {
                    subscription.lastHeight = newHeight;
                    subscription.callback(newHeight);
                }
            }
        };

        window.addEventListener('resize', handleResize);

        // Store cleanup function
        const subscription = this.findSubscriptionByElement(ref.current!);
        if (subscription) {
            (subscription as any).fallbackCleanup = () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    };

    /**
     * Unsubscribe by key
     */
    private unsubscribeByKey = (key: string): void => {
        const subscription = this.subscriptions.get(key);
        if (subscription) {
            // Clean up ResizeObserver
            if (this.resizeObserver && subscription.ref.current) {
                this.resizeObserver.unobserve(subscription.ref.current);
            }

            // Clean up fallback monitoring
            if ((subscription as any).fallbackCleanup) {
                (subscription as any).fallbackCleanup();
            }

            this.subscriptions.delete(key);
        }
    };

    /**
     * Unsubscribe all subscriptions for a ref
     */
    public unsubscribe = (ref: RefObject<HTMLElement>): void => {
        const keysToDelete: string[] = [];

        this.subscriptions.forEach((subscription, key) => {
            if (subscription.ref === ref) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.unsubscribeByKey(key));
    };

    /**
     * Destroy the service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;

        // Clean up all subscriptions
        this.subscriptions.forEach((_, key) => {
            this.unsubscribeByKey(key);
        });

        // Clean up ResizeObserver
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.subscriptions.clear();
    };

    /**
     * Get current subscription count
     */
    public getSubscriptionCount = (): number => {
        return this.subscriptions.size;
    };

    /**
     * Check if service is active
     */
    public isActive = (): boolean => {
        return !this.isDestroyed;
    };
}

// Singleton instance for application-wide use
let componentHeightServiceInstance: ComponentHeightService | null = null;

/**
 * Factory function to get or create the ComponentHeightService singleton
 */
export const getComponentHeightService = (): ComponentHeightService => {
    if (!componentHeightServiceInstance) {
        componentHeightServiceInstance = new ComponentHeightService();
    }
    return componentHeightServiceInstance;
};

/**
 * Factory function to create a new ComponentHeightService instance
 */
export const createComponentHeightService = (): ComponentHeightService => {
    return new ComponentHeightService();
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @param ref - The ref of the component whose height needs to be calculated
 * @returns unsubscribe function - Call to unsubscribe from height changes
 */
export const useComponentHeightService = (ref: RefObject<HTMLElement>, callback: (height: number) => void): (() => void) => {
    const service = getComponentHeightService();
    return service.subscribe(ref, callback);
};

export default ComponentHeightService;
