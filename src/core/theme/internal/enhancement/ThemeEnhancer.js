/**
 * Internal Theme Enhancer.
 * 
 * Handles theme enhancement and computed value logic.
 * Separated from composition and factory concerns.
 */

/**
 * Theme Enhancer interface
 * @interface IThemeEnhancer
 * @description Defines the interface for theme enhancer
 */
export class IThemeEnhancer {
  /**
   * @param {Function} enhance - Function to enhance theme
   * @param {Function} addUtilities - Function to add utilities
   */
  constructor(enhance, addUtilities) {
    this.enhance = enhance;
    this.addUtilities = addUtilities;
  }

  /** @type {Function} Function to enhance theme */
  enhance;

  /** @type {Function} Function to add utilities */
  addUtilities;
}

/**
 * Theme Enhancer implementation
 * @class ThemeEnhancer
 * @description Theme enhancer implementation
 */
export class ThemeEnhancer {
  /**
   * Enhance a composed theme with computed values and utilities
   * @param {Object} theme - Composed theme
   * @returns {Object} Enhanced theme
   * @description Enhance a composed theme with computed values and utilities
   */
  enhance(theme) {
    let enhancedTheme = {
      ...theme.tokens,
      getSpacing: (key) => theme.tokens.spacing[key],
      getColor: (path) => this.getNestedValue(theme.tokens.colors, path),
      getTypography: (key) => theme.tokens.typography[key],
      getBreakpoint: (key) => theme.tokens.breakpoints[key],

      // Backward compatibility
      primary: theme.tokens.colors.brand,
      secondary: theme.tokens.colors.neutral,
      success: theme.tokens.colors.semantic?.success || '#10b981',
      warning: theme.tokens.colors.semantic?.warning || '#f59e0b',
      error: theme.tokens.colors.semantic?.error || '#ef4444',
      info: theme.tokens.colors.semantic?.info || '#3b82f6',
    };

    // Add additional utilities
    enhancedTheme = this.addUtilities(enhancedTheme);

    return enhancedTheme;
  }

  /**
   * Add utility methods to theme
   * @param {Object} theme - Theme object
   * @returns {Object} Enhanced theme with utilities
   * @description Add utility methods to theme
   */
  addUtilities(theme) {
    return {
      ...theme,
      // Additional utility methods can be added here
      getContrastColor: (backgroundColor) => this.getContrastColor(backgroundColor),
      getLightColor: (color, amount) => this.lightenColor(color, amount),
      getDarkColor: (color, amount) => this.darkenColor(color, amount),
    };
  }

  /**
   * Get nested value from object path
   * @param {Object} obj - Object to traverse
   * @param {string} path - Path to value
   * @returns {string} Value at path
   * @description Get nested value from object path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj) || '';
  }

  /**
   * Get contrast color (black or white) for background
   * @param {string} backgroundColor - Background color
   * @returns {string} Contrast color
   * @description Get contrast color (black or white) for background
   */
  getContrastColor(backgroundColor) {
    // Simple luminance calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Lighten a color by amount
   * @param {string} color - Color to lighten
   * @param {number} amount - Amount to lighten
   * @returns {string} Lightened color
   * @description Lighten a color by amount
   */
  lightenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Darken a color by amount
   * @param {string} color - Color to darken
   * @param {number} amount - Amount to darken
   * @returns {string} Darkened color
   * @description Darken a color by amount
   */
  darkenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
