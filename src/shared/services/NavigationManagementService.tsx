/**
 * Navigation Management Service
 * 
 * Enterprise class-based service for navigation management.
 * Replaces hook-based services with proper enterprise patterns.
 */

// Navigation state interface
export interface INavigationState {
    currentPath: string;
    previousPath: string | null;
    navigationHistory: string[];
    isNavigating: boolean;
    error: string | null;
}

// Navigation subscription interface
interface NavigationSubscription {
    callback: (state: INavigationState) => void;
    id: string;
}

// Navigation management interface
export interface INavigationManagementService {
    getCurrentState(): INavigationState;
    navigateTo(path: string): void;
    goBack(): void;
    goForward(): void;
    canGoBack(): boolean;
    canGoForward(): boolean;
    subscribe(callback: (state: INavigationState) => void): () => void;
    unsubscribe(callback: (state: INavigationState) => void): void;
    destroy(): void;
}

/**
 * NavigationManagementService - Enterprise navigation service
 * 
 * Provides centralized navigation management with subscription support
 * and enterprise-grade error handling.
 */
export class NavigationManagementService implements INavigationManagementService {
    private navigationState: INavigationState;
    private subscriptions: Map<string, NavigationSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;
    private maxHistorySize: number = 50;

    constructor(initialPath: string = '/') {
        this.navigationState = {
            currentPath: initialPath,
            previousPath: null,
            navigationHistory: [initialPath],
            isNavigating: false,
            error: null
        };
        this.initializeNavigation();
    }

    /**
     * Initialize navigation system
     */
    private initializeNavigation = (): void => {
        try {
            // Listen to browser navigation events
            if (typeof window !== 'undefined') {
                window.addEventListener('popstate', this.handleBrowserNavigation);
                
                // Update initial state from URL
                this.updateFromBrowserURL();
            }
        } catch (error) {
            console.warn('Failed to initialize navigation:', error);
        }
    };

    /**
     * Get current navigation state
     */
    public getCurrentState = (): INavigationState => {
        return { ...this.navigationState };
    };

    /**
     * Navigate to a specific path
     */
    public navigateTo = (path: string): void => {
        if (this.isDestroyed) return;

        try {
            // Update state to navigating
            this.navigationState = {
                ...this.navigationState,
                isNavigating: true,
                error: null
            };
            this.notifySubscribers();

            // Update browser history
            if (typeof window !== 'undefined' && window.history) {
                window.history.pushState({ path }, '', path);
                
                // Update state after navigation
                this.updateNavigationState(path);
            }

        } catch (error) {
            console.error('Navigation failed:', error);
            this.setError('Failed to navigate to ' + path);
        }
    };

    /**
     * Go back in navigation history
     */
    public goBack = (): void => {
        if (this.isDestroyed || !this.canGoBack()) return;

        try {
            if (typeof window !== 'undefined' && window.history) {
                window.history.back();
            }
        } catch (error) {
            console.error('Go back failed:', error);
            this.setError('Failed to go back');
        }
    };

    /**
     * Go forward in navigation history
     */
    public goForward = (): void => {
        if (this.isDestroyed || !this.canGoForward()) return;

        try {
            if (typeof window !== 'undefined' && window.history) {
                window.history.forward();
            }
        } catch (error) {
            console.error('Go forward failed:', error);
            this.setError('Failed to go forward');
        }
    };

    /**
     * Check if can go back
     */
    public canGoBack = (): boolean => {
        const currentIndex = this.navigationState.navigationHistory.indexOf(this.navigationState.currentPath);
        return currentIndex > 0;
    };

    /**
     * Check if can go forward
     */
    public canGoForward = (): boolean => {
        const currentIndex = this.navigationState.navigationHistory.indexOf(this.navigationState.currentPath);
        return currentIndex < this.navigationState.navigationHistory.length - 1;
    };

    /**
     * Subscribe to navigation state changes
     */
    public subscribe = (callback: (state: INavigationState) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const id = `navigation_subscription_${++this.subscriptionIdCounter}`;
        const subscription: NavigationSubscription = {
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
    public unsubscribe = (callback: (state: INavigationState) => void): void => {
        const idsToDelete: string[] = [];

        this.subscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Handle browser navigation events
     */
    private handleBrowserNavigation = (): void => {
        this.updateFromBrowserURL();
    };

    /**
     * Update navigation state from browser URL
     */
    private updateFromBrowserURL = (): void => {
        try {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                this.updateNavigationState(currentPath);
            }
        } catch (error) {
            console.warn('Failed to update from browser URL:', error);
        }
    };

    /**
     * Update navigation state
     */
    private updateNavigationState = (newPath: string): void => {
        const previousPath = this.navigationState.currentPath;
        
        // Update navigation history
        const navigationHistory = [...this.navigationState.navigationHistory];
        const currentIndex = navigationHistory.indexOf(newPath);
        
        if (currentIndex === -1) {
            // New path - add to history
            navigationHistory.push(newPath);
            
            // Limit history size
            if (navigationHistory.length > this.maxHistorySize) {
                navigationHistory.shift();
            }
        } else {
            // Existing path - truncate history to current position
            navigationHistory.splice(currentIndex + 1);
        }

        this.navigationState = {
            currentPath: newPath,
            previousPath,
            navigationHistory,
            isNavigating: false,
            error: null
        };

        this.notifySubscribers();
    };

    /**
     * Set error state
     */
    private setError = (error: string): void => {
        this.navigationState = {
            ...this.navigationState,
            isNavigating: false,
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
                console.error('Error in navigation subscription callback:', error);
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

        // Remove browser event listener
        if (typeof window !== 'undefined') {
            window.removeEventListener('popstate', this.handleBrowserNavigation);
        }
    };
}

/**
 * Factory function to create a new NavigationManagementService instance
 */
export const createNavigationManagementService = (initialPath?: string): NavigationManagementService => {
    return new NavigationManagementService(initialPath);
};

export default NavigationManagementService;
