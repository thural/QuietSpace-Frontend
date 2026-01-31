/**
 * Theme service interface for managing application theme state
 * 
 * @interface IThemeService
 * @description Provides methods to control theme selection, variants, and dark mode state
 */
export class IThemeService {
    /**
     * Gets the current theme name
     * 
     * @returns {string} The current theme name (e.g., 'light', 'dark')
     * @description Gets the current theme name
     */
    getCurrentTheme() {
        throw new Error('Method getCurrentTheme() must be implemented');
    }

    /**
     * Sets the current theme
     * 
     * @param {string} themeName - The name of the theme to set
     * @returns {void}
     * @description Sets the current theme
     */
    setTheme(themeName) {
        throw new Error('Method setTheme() must be implemented');
    }

    /**
     * Gets the current theme variant
     * 
     * @returns {string} The current theme variant (e.g., 'default', 'compact')
     * @description Gets the current theme variant
     */
    getThemeVariant() {
        throw new Error('Method getThemeVariant() must be implemented');
    }

    /**
     * Checks if dark mode is currently active
     * 
     * @returns {boolean} True if dark mode is active, false otherwise
     * @description Checks if dark mode is active
     */
    isDarkMode() {
        throw new Error('Method isDarkMode() must be implemented');
    }
}

/**
 * Theme service implementation for managing application theme state
 * 
 * @class ThemeService
 * @extends {IThemeService}
 * @description Handles theme persistence, switching, and dark mode detection
 */
export class ThemeService extends IThemeService {
    /**
     * Current theme
     * 
     * @type {string}
     */
    currentTheme;

    /**
     * Current variant
     * 
     * @type {string}
     */
    currentVariant;

    /**
     * Storage key for theme
     * 
     * @type {string}
     */
    static STORAGE_KEY = 'app-theme';

    /**
     * Storage key for variant
     * 
     * @type {string}
     */
    static VARIANT_KEY = 'app-theme-variant';

    /**
     * Create theme service
     * 
     * @param {Object} [options] - Configuration options
     * @param {string} [options.defaultTheme] - Default theme name
     * @param {string} [options.defaultVariant] - Default variant name
     * @param {boolean} [options.persistToStorage] - Whether to persist to localStorage
     * @description Creates a new theme service instance
     */
    constructor(options = {}) {
        super();
        this.currentTheme = options.defaultTheme || 'light';
        this.currentVariant = options.defaultVariant || 'default';
        
        if (options.persistToStorage !== false) {
            this.loadFromStorage();
        }
    }

    /**
     * Gets the current theme name
     * 
     * @returns {string} The current theme name (e.g., 'light', 'dark')
     * @description Gets the current theme name
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Sets the current theme
     * 
     * @param {string} themeName - The name of the theme to set
     * @returns {void}
     * @description Sets the current theme
     */
    setTheme(themeName) {
        if (typeof themeName !== 'string') {
            throw new Error('Theme name must be a string');
        }

        const oldTheme = this.currentTheme;
        this.currentTheme = themeName;
        
        this.saveToStorage();
        this.notifyThemeChange(oldTheme, themeName);
    }

    /**
     * Gets the current theme variant
     * 
     * @returns {string} The current theme variant (e.g., 'default', 'compact')
     * @description Gets the current theme variant
     */
    getThemeVariant() {
        return this.currentVariant;
    }

    /**
     * Sets the current theme variant
     * 
     * @param {string} variant - The variant to set
     * @returns {void}
     * @description Sets the current theme variant
     */
    setThemeVariant(variant) {
        if (typeof variant !== 'string') {
            throw new Error('Theme variant must be a string');
        }

        const oldVariant = this.currentVariant;
        this.currentVariant = variant;
        
        this.saveToStorage();
        this.notifyVariantChange(oldVariant, variant);
    }

    /**
     * Checks if dark mode is currently active
     * 
     * @returns {boolean} True if dark mode is active, false otherwise
     * @description Checks if dark mode is active
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    /**
     * Toggles between light and dark themes
     * 
     * @returns {void}
     * @description Toggles between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.isDarkMode() ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /**
     * Gets available themes
     * 
     * @returns {string[]} Array of available theme names
     * @description Gets list of available themes
     */
    getAvailableThemes() {
        return ['light', 'dark', 'auto'];
    }

    /**
     * Gets available variants
     * 
     * @returns {string[]} Array of available variant names
     * @description Gets list of available variants
     */
    getAvailableVariants() {
        return ['default', 'compact', 'large'];
    }

    /**
     * Checks if a theme is valid
     * 
     * @param {string} themeName - Theme name to validate
     * @returns {boolean} Whether theme is valid
     * @description Validates if a theme name is supported
     */
    isValidTheme(themeName) {
        return this.getAvailableThemes().includes(themeName);
    }

    /**
     * Checks if a variant is valid
     * 
     * @param {string} variant - Variant name to validate
     * @returns {boolean} Whether variant is valid
     * @description Validates if a variant name is supported
     */
    isValidVariant(variant) {
        return this.getAvailableVariants().includes(variant);
    }

    /**
     * Resets theme to default
     * 
     * @returns {void}
     * @description Resets theme to default values
     */
    resetToDefault() {
        this.setTheme('light');
        this.setThemeVariant('default');
    }

    /**
     * Gets theme configuration object
     * 
     * @returns {Object} Theme configuration
     * @description Gets current theme configuration
     */
    getThemeConfig() {
        return {
            theme: this.currentTheme,
            variant: this.currentVariant,
            isDarkMode: this.isDarkMode(),
            availableThemes: this.getAvailableThemes(),
            availableVariants: this.getAvailableVariants()
        };
    }

    /**
     * Loads theme from localStorage
     * 
     * @returns {void}
     * @description Loads saved theme from localStorage
     */
    loadFromStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                const savedTheme = localStorage.getItem(ThemeService.STORAGE_KEY);
                const savedVariant = localStorage.getItem(ThemeService.VARIANT_KEY);
                
                if (savedTheme && this.isValidTheme(savedTheme)) {
                    this.currentTheme = savedTheme;
                }
                
                if (savedVariant && this.isValidVariant(savedVariant)) {
                    this.currentVariant = savedVariant;
                }
            }
        } catch (error) {
            console.warn('Failed to load theme from storage:', error);
        }
    }

    /**
     * Saves theme to localStorage
     * 
     * @returns {void}
     * @description Saves current theme to localStorage
     */
    saveToStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(ThemeService.STORAGE_KEY, this.currentTheme);
                localStorage.setItem(ThemeService.VARIANT_KEY, this.currentVariant);
            }
        } catch (error) {
            console.warn('Failed to save theme to storage:', error);
        }
    }

    /**
     * Notifies theme change listeners
     * 
     * @param {string} oldTheme - Previous theme
     * @param {string} newTheme - New theme
     * @returns {void}
     * @description Notifies listeners about theme change
     */
    notifyThemeChange(oldTheme, newTheme) {
        // Dispatch custom event for theme change
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent('themechange', {
                detail: { oldTheme, newTheme }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Notifies variant change listeners
     * 
     * @param {string} oldVariant - Previous variant
     * @param {string} newVariant - New variant
     * @returns {void}
     * @description Notifies listeners about variant change
     */
    notifyVariantChange(oldVariant, newVariant) {
        // Dispatch custom event for variant change
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent('themevariantchange', {
                detail: { oldVariant, newVariant }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Applies theme to document
     * 
     * @returns {void}
     * @description Applies current theme to document body
     */
    applyToDocument() {
        try {
            if (typeof document !== 'undefined' && document.body) {
                document.body.setAttribute('data-theme', this.currentTheme);
                document.body.setAttribute('data-theme-variant', this.currentVariant);
                
                // Update CSS classes
                document.body.classList.remove('theme-light', 'theme-dark');
                document.body.classList.add(`theme-${this.currentTheme}`);
                
                document.body.classList.remove('variant-default', 'variant-compact', 'variant-large');
                document.body.classList.add(`variant-${this.currentVariant}`);
            }
        } catch (error) {
            console.warn('Failed to apply theme to document:', error);
        }
    }

    /**
     * Detects system dark mode preference
     * 
     * @returns {boolean} Whether system prefers dark mode
     * @description Detects if system prefers dark mode
     */
    static detectSystemDarkMode() {
        try {
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        } catch (error) {
            console.warn('Failed to detect system dark mode:', error);
        }
        return false;
    }

    /**
     * Creates theme service with auto-detection
     * 
     * @returns {ThemeService} Theme service instance
     * @description Creates theme service that auto-detects system preference
     */
    static createWithAutoDetection() {
        const systemDarkMode = ThemeService.detectSystemDarkMode();
        const defaultTheme = systemDarkMode ? 'dark' : 'light';
        
        return new ThemeService({
            defaultTheme,
            persistToStorage: true
        });
    }
}
