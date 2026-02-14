/**
 * Component Height Management Service
 * 
 * Enterprise class-based service for component height management.
 * Replaces hook-based services with proper enterprise patterns.
 */

// Component height state interface
export interface IComponentHeightState {
    height: number;
    isMeasured: boolean;
    error: string | null;
    element: HTMLElement | null;
}

// Height measurement subscription interface
interface HeightSubscription {
    callback: (state: IComponentHeightState) => void;
    id: string;
}

// Component height management interface
export interface IComponentHeightManagementService {
    getCurrentState(): IComponentHeightState;
    setElement(element: HTMLElement | null): void;
    measureHeight(): void;
    subscribe(callback: (state: IComponentHeightState) => void): () => void;
    unsubscribe(callback: (state: IComponentHeightState) => void): void;
    destroy(): void;
}

/**
 * ComponentHeightManagementService - Enterprise component height service
 * 
 * Provides centralized component height management with subscription support
 * and enterprise-grade error handling.
 */
export class ComponentHeightManagementService implements IComponentHeightManagementService {
    private heightState: IComponentHeightState;
    private subscriptions: Map<string, HeightSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;
    private resizeObserver: ResizeObserver | null = null;
    private measurementInterval: number | null = null;

    constructor() {
        this.heightState = {
            height: 0,
            isMeasured: false,
            error: null,
            element: null
        };
        this.initializeMeasurement();
    }

    /**
     * Initialize measurement system
     */
    private initializeMeasurement = (): void => {
        try {
            // Initialize ResizeObserver if available
            if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
                this.resizeObserver = new ResizeObserver(this.handleResize);
            }
        } catch (error) {
            console.warn('Failed to initialize measurement system:', error);
        }
    };

    /**
     * Get current height state
     */
    public getCurrentState = (): IComponentHeightState => {
        return { ...this.heightState };
    };

    /**
     * Set element to measure
     */
    public setElement = (element: HTMLElement | null): void => {
        if (this.isDestroyed) return;

        try {
            // Clean up previous element
            this.cleanupElement();

            // Set new element
            this.heightState = {
                ...this.heightState,
                element,
                isMeasured: false,
                height: 0,
                error: null
            };

            // Setup measurement for new element
            if (element) {
                this.setupElementMeasurement(element);
            }

            this.notifySubscribers();

        } catch (error) {
            console.error('Failed to set element:', error);
            this.setError('Failed to set element');
        }
    };

    /**
     * Measure element height
     */
    public measureHeight = (): void => {
        if (this.isDestroyed || !this.heightState.element) return;

        try {
            const element = this.heightState.element;
            const height = element?.offsetHeight || 0;

            this.heightState = {
                ...this.heightState,
                height,
                isMeasured: true,
                error: null
            };

            this.notifySubscribers();

        } catch (error) {
            console.error('Failed to measure height:', error);
            this.setError('Failed to measure height');
        }
    };

    /**
     * Subscribe to height state changes
     */
    public subscribe = (callback: (state: IComponentHeightState) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const id = `height_subscription_${++this.subscriptionIdCounter}`;
        const subscription: HeightSubscription = {
            callback,
            id
        };

        this.subscriptions.set(id, subscription);

        // Immediately call with current state
        callback(this.getCurrentState());

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
    public unsubscribe = (callback: (state: IComponentHeightState) => void): void => {
        const idsToDelete: string[] = [];

        this.subscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Setup measurement for element
     */
    private setupElementMeasurement = (element: HTMLElement): void => {
        try {
            // Use ResizeObserver if available
            if (this.resizeObserver) {
                this.resizeObserver.observe(element);
            } else {
                // Fallback to interval-based measurement
                this.measurementInterval = window.setInterval(() => {
                    this.measureHeight();
                }, 100); // Measure every 100ms
            }

            // Initial measurement
            this.measureHeight();

        } catch (error) {
            console.warn('Failed to setup element measurement:', error);
        }
    };

    /**
     * Clean up element measurement
     */
    private cleanupElement = (): void => {
        try {
            const element = this.heightState.element;
            
            if (element) {
                // Disconnect ResizeObserver
                if (this.resizeObserver) {
                    this.resizeObserver.unobserve(element);
                }

                // Clear interval
                if (this.measurementInterval) {
                    clearInterval(this.measurementInterval);
                    this.measurementInterval = null;
                }
            }

        } catch (error) {
            console.warn('Failed to cleanup element measurement:', error);
        }
    };

    /**
     * Handle resize events
     */
    private handleResize = (): void => {
        this.measureHeight();
    };

    /**
     * Set error state
     */
    private setError = (error: string): void => {
        this.heightState = {
            ...this.heightState,
            isMeasured: false,
            error
        };
        this.notifySubscribers();
    };

    /**
     * Notify all subscribers of state change
     */
    private notifySubscribers = (): void => {
        if (this.isDestroyed) return;

        const currentState = this.getCurrentState();
        
        this.subscriptions.forEach(subscription => {
            try {
                subscription.callback(currentState);
            } catch (error) {
                console.error('Error in height subscription callback:', error);
            }
        });
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
     * Destroy service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.subscriptions.clear();

        // Clean up element measurement
        this.cleanupElement();

        // Disconnect ResizeObserver
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        // Clear interval
        if (this.measurementInterval) {
            clearInterval(this.measurementInterval);
            this.measurementInterval = null;
        }
    };
}

/**
 * Factory function to create a new ComponentHeightManagementService instance
 */
export const createComponentHeightManagementService = (): ComponentHeightManagementService => {
    return new ComponentHeightManagementService();
};

export default ComponentHeightManagementService;
