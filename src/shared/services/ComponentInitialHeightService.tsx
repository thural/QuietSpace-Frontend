/**
 * Enterprise Component Initial Height Service
 * 
 * A standalone service that extends ComponentHeightService to provide
 * initial height calculation for components before they are mounted.
 */

import { ReactElement } from 'react';
import ReactDOM from 'react-dom/client';
import { getComponentHeightService } from './ComponentHeightService';

// Initial height service interface
export interface IComponentInitialHeightService {
    calculateInitialHeight(component: ReactElement): Promise<number>;
    calculateInitialHeightSync(component: ReactElement): number;
    subscribe(callback: (height: number) => void): () => void;
    unsubscribe(callback: (height: number) => void): void;
    destroy(): void;
}

// Height calculation subscription entry
interface HeightCalculationSubscription {
    callback: (height: number) => void;
    id: string;
}

/**
 * ComponentInitialHeightService - Enterprise service for calculating initial component heights
 * 
 * Extends ComponentHeightService functionality to provide initial height calculations
 * for components before they are mounted to the DOM.
 */
class ComponentInitialHeightService implements IComponentInitialHeightService {
    private heightSubscriptions: Map<string, HeightCalculationSubscription> = new Map();
    private subscriptionIdCounter: number = 0;
    private heightService = getComponentHeightService();
    private isDestroyed: boolean = false;
    private lastCalculatedHeight: number = 0;

    constructor() {
        // No initialization needed for standalone service
    }

    /**
     * Calculate initial height of a component asynchronously
     * 
     * Creates a temporary DOM container, renders the component,
     * measures its height, and cleans up the container.
     * 
     * @param component - The React element to measure
     * @returns Promise<number> - The calculated height
     */
    public calculateInitialHeight = async (component: ReactElement): Promise<number> => {
        return new Promise((resolve) => {
            // Create temporary container
            const container = document.createElement('div');
            container.style.visibility = 'hidden';
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const root = ReactDOM.createRoot(container);
            const containerRef = { current: null as HTMLDivElement | null };

            // Create wrapper element for measurement
            const wrapperElement = React.createElement('div', {
                ref: containerRef
            }, component);

            root.render(wrapperElement);

            // Measure height after render
            const measureHeight = () => {
                if (containerRef.current) {
                    const height = containerRef.current.clientHeight;
                    
                    // Update state
                    this.lastCalculatedHeight = height;
                    this.notifySubscribers(height);

                    // Clean up
                    if (container.parentNode === document.body) {
                        document.body.removeChild(container);
                    }
                    
                    resolve(height);
                }
            };

            // Wait for the next animation frame to ensure DOM is ready
            requestAnimationFrame(measureHeight);
        });
    };

    /**
     * Calculate initial height synchronously (best effort)
     * 
     * @param component - The React element to measure
     * @returns number - The calculated height (0 if measurement fails)
     */
    public calculateInitialHeightSync = (component: ReactElement): number => {
        try {
            // Create temporary container
            const container = document.createElement('div');
            container.style.visibility = 'hidden';
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const root = ReactDOM.createRoot(container);
            const containerRef = { current: null as HTMLDivElement | null };

            // Create wrapper element for measurement
            const wrapperElement = React.createElement('div', {
                ref: containerRef
            }, component);

            root.render(wrapperElement);

            // Try to measure immediately (may not be accurate)
            let height = 0;
            if (containerRef.current) {
                height = containerRef.current.clientHeight;
                this.lastCalculatedHeight = height;
                this.notifySubscribers(height);
            }

            // Clean up
            if (container.parentNode === document.body) {
                document.body.removeChild(container);
            }

            return height;
        } catch (error) {
            console.warn('Failed to calculate initial height synchronously:', error);
            return 0;
        }
    };

    /**
     * Subscribe to height calculation events
     * 
     * @param callback - Callback function for height updates
     * @returns unsubscribe function
     */
    public subscribe = (callback: (height: number) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => {};
        }

        const id = `height_calc_subscription_${++this.subscriptionIdCounter}`;
        const subscription: HeightCalculationSubscription = {
            callback,
            id
        };

        this.heightSubscriptions.set(id, subscription);

        // Immediately call with last calculated height
        callback(this.lastCalculatedHeight);

        // Return unsubscribe function
        return () => {
            this.unsubscribeById(id);
        };
    };

    /**
     * Unsubscribe by ID
     */
    private unsubscribeById = (id: string): void => {
        this.heightSubscriptions.delete(id);
    };

    /**
     * Unsubscribe by callback
     */
    public unsubscribe = (callback: (height: number) => void): void => {
        const idsToDelete: string[] = [];

        this.heightSubscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Notify all subscribers of height calculations
     */
    private notifySubscribers = (height: number): void => {
        if (this.isDestroyed) return;

        this.heightSubscriptions.forEach(subscription => {
            try {
                subscription.callback(height);
            } catch (error) {
                console.error('Error in height calculation subscription callback:', error);
            }
        });
    };

    /**
     * Get last calculated height
     */
    public getLastCalculatedHeight = (): number => {
        return this.lastCalculatedHeight;
    };

    /**
     * Get subscription count
     */
    public getSubscriptionCount = (): number => {
        return this.heightSubscriptions.size;
    };

    /**
     * Check if service is active
     */
    public isActive = (): boolean => {
        return !this.isDestroyed;
    };

    /**
     * Get height service instance for additional functionality
     */
    public getHeightService = () => {
        return this.heightService;
    };

    /**
     * Batch calculate heights for multiple components
     */
    public calculateMultipleHeights = async (components: ReactElement[]): Promise<number[]> => {
        const promises = components.map(component => this.calculateInitialHeight(component));
        return Promise.all(promises);
    };

    /**
     * Destroy service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.heightSubscriptions.clear();
        
        // Clean up height service if needed
        if (this.heightService) {
            // Note: We don't destroy the singleton height service
            // as it might be used by other components
        }
    };
}

// Singleton instance for application-wide use
let componentInitialHeightServiceInstance: ComponentInitialHeightService | null = null;

/**
 * Factory function to get or create ComponentInitialHeightService singleton
 */
export const getComponentInitialHeightService = (): ComponentInitialHeightService => {
    if (!componentInitialHeightServiceInstance) {
        componentInitialHeightServiceInstance = new ComponentInitialHeightService();
    }
    return componentInitialHeightServiceInstance;
};

/**
 * Factory function to create a new ComponentInitialHeightService instance
 */
export const createComponentInitialHeightService = (): ComponentInitialHeightService => {
    return new ComponentInitialHeightService();
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @param component - The component to render and measure
 * @returns initial height of component
 */
export const useComponentInitialHeightService = (component: ReactElement): number => {
    const service = getComponentInitialHeightService();
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        const unsubscribe = service.subscribe((newHeight) => {
            setHeight(newHeight);
        });

        // Calculate initial height
        service.calculateInitialHeight(component).then(calculatedHeight => {
            setHeight(calculatedHeight);
        });

        return unsubscribe;
    }, [component]);

    return height;
};

export default ComponentInitialHeightService;
