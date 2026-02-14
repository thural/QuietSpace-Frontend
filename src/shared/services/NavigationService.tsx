/**
 * Enterprise Navigation Service
 * 
 * A standalone service that replaces useNavigation hook
 * with enterprise patterns for navigation management.
 */

// Navigation interface for type safety
export interface INavigationService {
    navigatePath(path: string): void;
    getCurrentPath(): string;
    goBack(): void;
    goForward(): void;
    refresh(): void;
    subscribe(callback: (path: string) => void): () => void;
    unsubscribe(callback: (path: string) => void): void;
    destroy(): void;
}

// Navigation subscription entry
interface NavigationSubscription {
    callback: (path: string) => void;
    id: string;
}

/**
 * NavigationService - Enterprise service for managing application navigation
 * 
 * Provides centralized navigation management with subscription notifications,
 * proper cleanup, and browser history integration.
 */
class NavigationService implements INavigationService {
    private navigationSubscriptions: Map<string, NavigationSubscription> = new Map();
    private subscriptionIdCounter: number = 0;
    private navigateFunction: ((path: string) => void) | null = null;
    private isDestroyed: boolean = false;
    private currentPath: string = '';

    constructor() {
        this.initializeNavigation();
    }

    /**
     * Initialize navigation function and browser history
     */
    private initializeNavigation = (): void => {
        try {
            // For now, we'll use window.location as fallback
            this.navigateFunction = (path: string) => {
                window.history.pushState({}, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
                this.updateCurrentPath();
            };
        } catch (error) {
            console.warn('Failed to initialize navigation, using fallback:', error);
            this.navigateFunction = (path: string) => {
                window.location.href = path;
            };
        }

        // Listen to browser history changes
        window.addEventListener('popstate', this.handlePopState);
        
        // Set initial path
        this.currentPath = window.location.pathname;
    };

    /**
     * Handle browser history changes
     */
    private handlePopState = (): void => {
        this.updateCurrentPath();
    };

    /**
     * Update current path and notify subscribers
     */
    private updateCurrentPath = (): void => {
        const newPath = window.location.pathname;
        if (newPath !== this.currentPath) {
            this.currentPath = newPath;
            this.notifySubscribers(newPath);
        }
    };

    /**
     * Navigate to a specific path
     */
    public navigatePath = (path: string): void => {
        if (this.navigateFunction) {
            try {
                this.navigateFunction(path);
                this.updateCurrentPath();
            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback to window.location
                window.location.href = path;
            }
        } else {
            // Fallback navigation
            window.location.href = path;
        }
    };

    /**
     * Get current path
     */
    public getCurrentPath = (): string => {
        return this.currentPath || window.location.pathname;
    };

    /**
     * Go back in browser history
     */
    public goBack = (): void => {
        window.history.back();
        this.updateCurrentPath();
    };

    /**
     * Go forward in browser history
     */
    public goForward = (): void => {
        window.history.forward();
        this.updateCurrentPath();
    };

    /**
     * Refresh current page
     */
    public refresh = (): void => {
        window.location.reload();
    };

    /**
     * Subscribe to navigation changes
     */
    public subscribe = (callback: (path: string) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => {};
        }

        const id = `nav_subscription_${++this.subscriptionIdCounter}`;
        const subscription: NavigationSubscription = {
            callback,
            id
        };

        this.navigationSubscriptions.set(id, subscription);

        // Immediately call with current path
        callback(this.getCurrentPath());

        // Return unsubscribe function
        return () => {
            this.unsubscribeById(id);
        };
    };

    /**
     * Unsubscribe by ID
     */
    private unsubscribeById = (id: string): void => {
        this.navigationSubscriptions.delete(id);
    };

    /**
     * Unsubscribe by callback
     */
    public unsubscribe = (callback: (path: string) => void): void => {
        const idsToDelete: string[] = [];

        this.navigationSubscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Notify all subscribers of navigation changes
     */
    private notifySubscribers = (path: string): void => {
        if (this.isDestroyed) return;

        this.navigationSubscriptions.forEach(subscription => {
            try {
                subscription.callback(path);
            } catch (error) {
                console.error('Error in navigation subscription callback:', error);
            }
        });
    };

    /**
     * Get subscription count
     */
    public getSubscriptionCount = (): number => {
        return this.navigationSubscriptions.size;
    };

    /**
     * Check if service is active
     */
    public isActive = (): boolean => {
        return !this.isDestroyed;
    };

    /**
     * Get navigation history
     */
    public getNavigationHistory = (): string[] => {
        // Return current session history (simplified version)
        return [this.getCurrentPath()];
    };

    /**
     * Check if can go back
     */
    public canGoBack = (): boolean => {
        return window.history.length > 1;
    };

    /**
     * Check if can go forward
     */
    public canGoForward = (): boolean => {
        return window.history.length > 1;
    };

    /**
     * Destroy service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.navigationSubscriptions.clear();
        this.navigateFunction = null;
        window.removeEventListener('popstate', this.handlePopState);
    };
}

// Singleton instance for application-wide use
let navigationServiceInstance: NavigationService | null = null;

/**
 * Factory function to get or create NavigationService singleton
 */
export const getNavigationService = (): NavigationService => {
    if (!navigationServiceInstance) {
        navigationServiceInstance = new NavigationService();
    }
    return navigationServiceInstance;
};

/**
 * Factory function to create a new NavigationService instance
 */
export const createNavigationService = (): NavigationService => {
    return new NavigationService();
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @returns navigation utilities
 */
export const useNavigationService = () => {
    const service = getNavigationService();

    return {
        navigatePath: service.navigatePath,
        getCurrentPath: service.getCurrentPath,
        goBack: service.goBack,
        goForward: service.goForward,
        refresh: service.refresh,
        subscribe: service.subscribe,
        unsubscribe: service.unsubscribe,
        getNavigationHistory: service.getNavigationHistory,
        canGoBack: service.canGoBack,
        canGoForward: service.canGoForward
    };
};

export default NavigationService;
