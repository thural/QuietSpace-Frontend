/**
 * Enterprise Theme Service
 * 
 * A class-based service that provides enterprise theme management
 * by leveraging core theming functionality without duplication.
 */

import {
    createThemeWithVariant,
    EnhancedTheme
} from "../../core/modules/theming";
import { getLocalThemeMode, setLocalThemeMode } from "../utils/localStorageUtils";

// Theme interface for type safety
export interface IEnterpriseThemeService {
    getCurrentTheme(): EnhancedTheme;
    getIsDarkMode(): boolean;
    setThemeMode(isDarkMode: boolean): void;
    subscribe(callback: (theme: EnhancedTheme, isDarkMode: boolean) => void): () => void;
    unsubscribe(callback: (theme: EnhancedTheme, isDarkMode: boolean) => void): void;
    destroy(): void;
}

// Theme subscription entry
interface ThemeSubscription {
    callback: (theme: EnhancedTheme, isDarkMode: boolean) => void;
    id: string;
}

/**
 * EnterpriseThemeService - Service that provides theme management
 * 
 * Provides enterprise theme management by creating themes using the core
 * theming module without duplicating functionality.
 */
export class EnterpriseThemeService implements IEnterpriseThemeService {
    private currentTheme: EnhancedTheme;
    private currentVariant: string;
    private subscriptions: Map<string, ThemeSubscription> = new Map();
    private isDestroyed: boolean = false;
    private subscriptionIdCounter: number = 0;

    constructor() {
        this.currentVariant = 'light';
        this.currentTheme = createThemeWithVariant('light') as EnhancedTheme;
        this.initializeTheme();
    }

    /**
     * Initialize theme from local storage
     */
    private initializeTheme = (): void => {
        try {
            const storedThemeMode = getLocalThemeMode();
            if (storedThemeMode !== undefined) {
                this.setThemeMode(storedThemeMode);
            }
        } catch (error) {
            console.warn('Failed to load theme from local storage:', error);
        }
    };

    /**
     * Get current theme object
     */
    public getCurrentTheme = (): EnhancedTheme => {
        return this.currentTheme;
    };

    /**
     * Check if dark mode is currently active
     */
    public getIsDarkMode = (): boolean => {
        return this.currentVariant === 'dark';
    };

    /**
     * Set theme mode using core theming
     */
    public setThemeMode = (isDarkMode: boolean): void => {
        if (this.isDestroyed) return;

        try {
            const newVariant = isDarkMode ? 'dark' : 'light';

            // Create new theme using core theming
            this.currentTheme = createThemeWithVariant(newVariant) as EnhancedTheme;
            this.currentVariant = newVariant;

            // Persist to local storage
            setLocalThemeMode(isDarkMode);

            // Notify subscribers
            this.notifySubscribers();

        } catch (error) {
            console.error('Failed to set theme mode:', error);
        }
    };

    /**
     * Get current theme variant
     */
    public getCurrentVariant = (): string => {
        return this.currentVariant;
    };

    /**
     * Subscribe to theme changes
     */
    public subscribe = (callback: (theme: EnhancedTheme, isDarkMode: boolean) => void): (() => void) => {
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
        callback(this.getCurrentTheme(), this.getIsDarkMode());

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
    public unsubscribe = (callback: (theme: EnhancedTheme, isDarkMode: boolean) => void): void => {
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
        const isDarkMode = this.getIsDarkMode();

        this.subscriptions.forEach(subscription => {
            try {
                subscription.callback(currentTheme, isDarkMode);
            } catch (error) {
                console.error('Error in theme subscription callback:', error);
            }
        });
    };

    /**
     * Toggle theme between light and dark
     */
    public toggleTheme = (): void => {
        this.setThemeMode(!this.getIsDarkMode());
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
     * Get theme configuration from core system
     */
    public getThemeConfig = (): {
        currentTheme: EnhancedTheme;
        isDarkMode: boolean;
        availableThemes: { light: EnhancedTheme; dark: EnhancedTheme };
    } => {
        return {
            currentTheme: this.getCurrentTheme(),
            isDarkMode: this.getIsDarkMode(),
            availableThemes: {
                light: createThemeWithVariant('light') as EnhancedTheme,
                dark: createThemeWithVariant('dark') as EnhancedTheme
            }
        };
    };

    /**
     * Destroy service and clean up all resources
     */
    public destroy = (): void => {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.subscriptions.clear();
    };
}

// Singleton instance for application-wide use
let enterpriseThemeServiceInstance: EnterpriseThemeService | null = null;

/**
 * Factory function to get or create EnterpriseThemeService singleton
 */
export const getEnterpriseThemeService = (): EnterpriseThemeService => {
    if (!enterpriseThemeServiceInstance) {
        enterpriseThemeServiceInstance = new EnterpriseThemeService();
    }
    return enterpriseThemeServiceInstance;
};

/**
 * Factory function to create a new EnterpriseThemeService instance
 */
export const createEnterpriseThemeService = (): EnterpriseThemeService => {
    return new EnterpriseThemeService();
};

export default EnterpriseThemeService;
