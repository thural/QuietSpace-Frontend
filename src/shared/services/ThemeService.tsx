/**
 * Enterprise Theme Service
 * 
 * A class-based service that replaces the useTheme hook
 * with enterprise patterns for theme management and persistence.
 */

import { createThemeWithVariant } from "../../core/modules/theming";
import { getLocalThemeMode, setLocalThemeMode } from "../utils/localStorageUtils";

// Theme interface for type safety
export interface IThemeService {
    getCurrentTheme(): any;
    getIsDarkMode(): boolean;
    setThemeMode(isDarkMode: boolean): void;
    subscribe(callback: (theme: any, isDarkMode: boolean) => void): () => void;
    unsubscribe(callback: (theme: any, isDarkMode: boolean) => void): void;
    destroy(): void;
}

// Theme subscription entry
interface ThemeSubscription {
    callback: (theme: any, isDarkMode: boolean) => void;
    id: string;
}

/**
 * ThemeService - Enterprise service for managing application theme
 * 
 * Provides centralized theme management with persistence, subscription
 * notifications, and proper cleanup.
 */
class ThemeService implements IThemeService {
    private isDarkMode: boolean = false;
    private subscriptions: Map<string, ThemeSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;

    constructor() {
        this.initializeTheme();
    }

    /**
     * Initialize theme from local storage
     */
    private initializeTheme = (): void => {
        try {
            const storedThemeMode = getLocalThemeMode();
            this.isDarkMode = storedThemeMode;
        } catch (error) {
            console.warn('Failed to load theme from local storage:', error);
            this.isDarkMode = false;
        }
    };

    /**
     * Get current theme object
     */
    public getCurrentTheme = (): any => {
        return this.isDarkMode ? createThemeWithVariant('dark') : createThemeWithVariant('light');
    };

    /**
     * Check if dark mode is currently active
     */
    public getIsDarkMode = (): boolean => {
        return this.isDarkMode;
    };

    /**
     * Set theme mode and persist to local storage
     */
    public setThemeMode = (isDarkMode: boolean): void => {
        if (this.isDestroyed) return;

        const previousDarkMode = this.isDarkMode;
        this.isDarkMode = isDarkMode;

        try {
            // Persist to local storage
            setLocalThemeMode(isDarkMode);

            // Update Zustand store if available
            this.updateZustandStore(isDarkMode);

            // Notify subscribers
            this.notifySubscribers();

        } catch (error) {
            console.error('Failed to set theme mode:', error);
            // Revert both theme mode and notify subscribers with previous theme
            this.isDarkMode = previousDarkMode;
            this.notifySubscribers();
        }
    };

    /**
     * Update Zustand store if available
     */
    private updateZustandStore = (isDarkMode: boolean): void => {
        try {
            // Dynamic import to avoid circular dependencies
            import("../../core/modules/state-management/zustand").then(({ useThemeStore }) => {
                const { setThemeStore } = useThemeStore.getState();
                setThemeStore(isDarkMode);
            }).catch(error => {
                console.warn('Failed to update Zustand store:', error);
            });
        } catch (error) {
            console.warn('Failed to update Zustand store:', error);
        }
    };

    /**
     * Subscribe to theme changes
     */
    public subscribe = (callback: (theme: any, isDarkMode: boolean) => void): (() => void) => {
        if (this.isDestroyed) {
            return () => { };
        }

        const id = `theme_subscription_${++this.subscriptionIdCounter}`;
        const subscription: ThemeSubscription = {
            callback,
            id
        };

        this.subscriptions.set(id, subscription);

        // Immediately call with current theme
        callback(this.getCurrentTheme(), this.isDarkMode);

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
    public unsubscribe = (callback: (theme: any, isDarkMode: boolean) => void): void => {
        const idsToDelete: string[] = [];

        this.subscriptions.forEach((subscription, id) => {
            if (subscription.callback === callback) {
                idsToDelete.push(id);
            }
        });

        idsToDelete.forEach(id => this.unsubscribeById(id));
    };

    /**
     * Notify all subscribers of theme change
     */
    private notifySubscribers = (): void => {
        if (this.isDestroyed) return;

        const currentTheme = this.getCurrentTheme();
        this.subscriptions.forEach(subscription => {
            try {
                subscription.callback(currentTheme, this.isDarkMode);
            } catch (error) {
                console.error('Error in theme subscription callback:', error);
            }
        });
    };

    /**
     * Toggle theme between light and dark
     */
    public toggleTheme = (): void => {
        this.setThemeMode(!this.isDarkMode);
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
     * Get theme configuration
     */
    public getThemeConfig = (): {
        currentTheme: any;
        isDarkMode: boolean;
        availableThemes: { light: any; dark: any };
    } => {
        return {
            currentTheme: this.getCurrentTheme(),
            isDarkMode: this.isDarkMode,
            availableThemes: {
                light: createThemeWithVariant('light'),
                dark: createThemeWithVariant('dark')
            }
        };
    };

    /**
     * Destroy the service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.subscriptions.clear();
    };
}

// Singleton instance for application-wide use
let themeServiceInstance: ThemeService | null = null;

/**
 * Factory function to get or create the ThemeService singleton
 */
export const getThemeService = (): ThemeService => {
    if (!themeServiceInstance) {
        themeServiceInstance = new ThemeService();
    }
    return themeServiceInstance;
};

/**
 * Factory function to create a new ThemeService instance
 */
export const createThemeService = (): ThemeService => {
    return new ThemeService();
};

/**
 * Hook-style wrapper for backward compatibility
 * 
 * @returns theme management utilities
 */
export const useThemeService = () => {
    const service = getThemeService();

    return {
        theme: service.getCurrentTheme(),
        setThemeMode: service.setThemeMode,
        isDarkMode: service.getIsDarkMode(),
        setLocalThemeMode: setLocalThemeMode,
        toggleTheme: service.toggleTheme,
        subscribe: service.subscribe,
        unsubscribe: service.unsubscribe,
        getThemeConfig: service.getThemeConfig
    };
};

export default ThemeService;
