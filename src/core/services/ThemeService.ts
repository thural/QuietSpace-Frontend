/**
 * Theme service interface for managing application theme state
 * 
 * @interface IThemeService
 * @description Provides methods to control theme selection, variants, and dark mode state
 */

interface IThemeService {
  /**
   * Gets the current theme name
   * 
   * @returns {string} The current theme name (e.g., 'light', 'dark')
   */
  getCurrentTheme(): string;

  /**
   * Sets the current theme
   * 
   * @param {string} themeName - The name of the theme to set
   * @returns {void}
   */
  setTheme(themeName: string): void;

  /**
   * Gets the current theme variant
   * 
   * @returns {string} The current theme variant (e.g., 'default', 'compact')
   */
  getThemeVariant(): string;

  /**
   * Checks if dark mode is currently active
   * 
   * @returns {boolean} True if dark mode is active, false otherwise
   */
  isDarkMode(): boolean;
}

/**
 * Theme service implementation for managing application theme state
 * 
 * @class ThemeService
 * @implements {IThemeService}
 * @description Handles theme persistence, switching, and dark mode detection
 */
export class ThemeService implements IThemeService {
  private currentTheme = 'light';
  private currentVariant = 'default';

  /**
   * Creates a new ThemeService instance
   * 
   * @constructor
   * @description Initializes the theme service with system preferences and loads saved theme from storage
   */
  constructor() {
    // Initialize with system preferences
    this.loadThemeFromStorage();
  }

  /**
   * Gets the current theme name
   * 
   * @returns {string} The current theme name (e.g., 'light', 'dark')
   */
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  /**
   * Sets the current theme and persists it to storage
   * 
   * @param {string} themeName - The name of the theme to set
   * @returns {void}
   */
  setTheme(themeName: string): void {
    this.currentTheme = themeName;
    this.saveThemeToStorage();
    console.log(`Theme changed to: ${themeName}`);
  }

  /**
   * Gets the current theme variant
   * 
   * @returns {string} The current theme variant (e.g., 'default', 'compact')
   */
  getThemeVariant(): string {
    return this.currentVariant;
  }

  /**
   * Sets the current theme variant and persists it to storage
   * 
   * @param {string} variant - The theme variant to set
   * @returns {void}
   */
  setThemeVariant(variant: string): void {
    this.currentVariant = variant;
    this.saveThemeToStorage();
  }

  /**
   * Checks if dark mode is currently active
   * 
   * @returns {boolean} True if dark mode is active, false otherwise
   */
  isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  /**
   * Loads theme settings from localStorage
   * 
   * @private
   * @returns {void}
   * @description Retrieves saved theme and variant from localStorage, falls back to defaults
   */
  private loadThemeFromStorage(): void {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        const { theme, variant } = JSON.parse(stored);
        this.currentTheme = theme || 'light';
        this.currentVariant = variant || 'default';
      }
    } catch {
      // Use defaults if storage fails
      this.currentTheme = 'light';
      this.currentVariant = 'default';
    }
  }

  /**
   * Saves theme settings to localStorage
   * 
   * @private
   * @returns {void}
   * @description Persists current theme and variant to localStorage
   */
  private saveThemeToStorage(): void {
    try {
      localStorage.setItem('theme', JSON.stringify({
        theme: this.currentTheme,
        variant: this.currentVariant
      }));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
}

/**
 * Creates a new theme service instance
 * 
 * @function createThemeService
 * @returns {IThemeService} A new ThemeService instance
 * @description Factory function for creating theme service instances
 */
export function createThemeService(): IThemeService {
  return new ThemeService();
}
