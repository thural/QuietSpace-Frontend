/**
 * Enterprise Placeholder Count Service
 * 
 * A class-based service that replaces the usePlaceholderCount hook
 * with enterprise patterns for viewport-based placeholder calculations.
 */

// Service interface for type safety
export interface IPlaceholderCountService {
    getPlaceholderCount(): number;
    setPlaceholderHeight(height: number): void;
    subscribe(callback: (count: number) => void): () => void;
    unsubscribe(callback: (count: number) => void): void;
    destroy(): void;
}

// Placeholder subscription entry
interface PlaceholderSubscription {
    callback: (count: number) => void;
    id: string;
}

/**
 * PlaceholderCountService - Enterprise service for managing placeholder count calculations
 * 
 * Provides centralized placeholder count management with viewport monitoring,
 * subscription notifications, and proper cleanup.
 */
class PlaceholderCountService implements IPlaceholderCountService {
    private placeholderHeight: number = 50; // Default height
    private currentCount: number = 0;
    private subscriptions: Map<string, PlaceholderSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;
    private resizeObserver: ResizeObserver | null = null;

    constructor(placeholderHeight?: number) {
        if (placeholderHeight) {
            this.placeholderHeight = placeholderHeight;
        }
        this.initializeMonitoring();
        this.calculatePlaceholders();
    }

    /**
     * Initialize viewport monitoring
     */
    private initializeMonitoring = (): void => {
        // Use ResizeObserver on the document body if available
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(this.handleViewportChange.bind(this));
            this.resizeObserver.observe(document.body);
        } else {
            // Fallback to window resize events
            window.addEventListener('resize', this.handleViewportChange);
        }
    };

    /**
     * Handle viewport changes
     */
    private handleViewportChange = (): void => {
        if (this.isDestroyed) return;
        this.calculatePlaceholders();
    };

    /**
     * Calculate the number of placeholders that fit in viewport
     */
    private calculatePlaceholders = (): void => {
        const windowHeight = window.innerHeight;
        const numPlaceholders = Math.ceil(windowHeight / this.placeholderHeight);
        
        if (numPlaceholders !== this.currentCount) {
            this.currentCount = numPlaceholders;
            this.notifySubscribers();
        }
    };

    /**
     * Get current placeholder count
     */
    public getPlaceholderCount = (): number => {
        return this.currentCount;
    };

    /**
     * Set placeholder height and recalculate
     */
    public setPlaceholderHeight = (height: number): void => {
        if (this.isDestroyed || height <= 0) return;

        if (height !== this.placeholderHeight) {
            this.placeholderHeight = height;
            this.calculatePlaceholders();
        }
    };

    /**
     * Subscribe to placeholder count changes
     */
    public subscribe = (callback: (count: number) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => {};
        }

        const id = `placeholder_subscription_${++this.subscriptionIdCounter}`;
        const subscription: PlaceholderSubscription = {
            callback,
            id
        };

        this.subscriptions.set(id, subscription);

        // Immediately call with current count
        callback(this.currentCount);

        // Return unsubscribe function
        return () => {
            this.unsubscribeById(id);
        };
    };

    /**
     * Unsubscribe by ID
     */
    private unsubscribeById = (id: string): void => {
        this.subscriptions.delete(id);
    };

    /**
     * Unsubscribe by callback
     */
    public unsubscribe = (callback: (count: number) => void): void => {
        const idsToDelete: string[] = [];
        
        this.subscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Notify all subscribers of count changes
     */
    private notifySubscribers = (): void => {
        if (this.isDestroyed) return;

        this.subscriptions.forEach(subscription => {
            try {
                subscription.callback(this.currentCount);
            } catch (error) {
                console.error('Error in placeholder subscription callback:', error);
            }
        });
    };

    /**
     * Get current placeholder height
     */
    public getPlaceholderHeight = (): number => {
        return this.placeholderHeight;
    };

    /**
     * Get viewport information
     */
    public getViewportInfo = (): {
        width: number;
        height: number;
        placeholderCount: number;
        placeholderHeight: number;
        availableSpace: number;
    } => {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const availableSpace = windowHeight % this.placeholderHeight;

        return {
            width: windowWidth,
            height: windowHeight,
            placeholderCount: this.currentCount,
            placeholderHeight: this.placeholderHeight,
            availableSpace
        };
    };

    /**
     * Get subscription count
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

    /**
     * Force recalculation of placeholders
     */
    public recalculate = (): void => {
        if (!this.isDestroyed) {
            this.calculatePlaceholders();
        }
    };

    /**
     * Destroy the service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;

        // Clean up subscriptions
        this.subscriptions.clear();

        // Clean up ResizeObserver
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        } else {
            // Clean up window resize listener
            window.removeEventListener('resize', this.handleViewportChange);
        }

        // Reset state
        this.currentCount = 0;
    };
}

// Singleton instance for application-wide use
let placeholderCountServiceInstance: PlaceholderCountService | null = null;

/**
 * Factory function to get or create the PlaceholderCountService singleton
 */
export const getPlaceholderCountService = (placeholderHeight?: number): PlaceholderCountService => {
    if (!placeholderCountServiceInstance) {
        placeholderCountServiceInstance = new PlaceholderCountService(placeholderHeight);
    }
    return placeholderCountServiceInstance;
};

/**
 * Factory function to create a new PlaceholderCountService instance
 */
export const createPlaceholderCountService = (placeholderHeight?: number): PlaceholderCountService => {
    return new PlaceholderCountService(placeholderHeight);
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @param placeholderHeight - The height of a single placeholder element
 * @returns placeholder count
 */
export const usePlaceholderCountService = (placeholderHeight: number) => {
    const service = createPlaceholderCountService(placeholderHeight);
    
    return {
        getPlaceholderCount: service.getPlaceholderCount,
        setPlaceholderHeight: service.setPlaceholderHeight,
        subscribe: service.subscribe,
        unsubscribe: service.unsubscribe,
        getViewportInfo: service.getViewportInfo,
        recalculate: service.recalculate
    };
};

export default PlaceholderCountService;
