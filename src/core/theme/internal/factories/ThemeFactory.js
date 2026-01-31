/**
 * Internal Theme Factory.
 * 
 * Factory for creating theme instances with proper encapsulation.
 * Handles theme creation logic separated from composition.
 */

import { colors } from '../../../appColors.js';
import { typography } from '../../../appTypography.js';
import {
  baseSpacing,
  baseShadows,
  baseBreakpoints,
  baseRadius,
  baseAnimation
} from '../../../baseTokens.js';

/**
 * Theme Factory interface
 * @interface IThemeFactory
 * @description Defines the interface for theme factory
 */
export class IThemeFactory {
  /**
   * @param {Function} createTheme - Function to create theme
   * @param {Function} createVariant - Function to create variant
   */
  constructor(createTheme, createVariant) {
    this.createTheme = createTheme;
    this.createVariant = createVariant;
  }

  /** @type {Function} Function to create theme */
  createTheme;

  /** @type {Function} Function to create variant */
  createVariant;
}

/**
 * Theme Factory implementation
 * @class ThemeFactory
 * @description Theme factory implementation
 */
export class ThemeFactory {
  /**
   * Create a theme from configuration
   * @param {Object} config - Theme configuration
   * @returns {Object} Enhanced theme
   * @description Create a theme from configuration
   */
  createTheme(config) {
    const baseTokens = this.getDefaultTokens();
    const mergedTokens = this.mergeTokens(baseTokens, config.tokens);

    return this.createEnhancedTheme(mergedTokens);
  }

  /**
   * Create a theme variant
   * @param {string} name - Variant name
   * @param {Object} base - Base theme
   * @param {Object} overrides - Theme overrides
   * @returns {Object} Enhanced theme
   * @description Create a theme variant
   */
  createVariant(name, base, overrides) {
    const mergedTokens = this.mergeTokens(base, overrides);
    return this.createEnhancedTheme(mergedTokens);
  }

  /**
   * Get default theme tokens
   * @returns {Object} Default tokens
   * @description Get default theme tokens
   */
  getDefaultTokens() {
    return {
      colors,
      typography,
      spacing: baseSpacing,
      shadows: baseShadows,
      breakpoints: baseBreakpoints,
      radius: baseRadius,
      animation: baseAnimation,
    };
  }

  /**
   * Merge tokens with proper inheritance
   * @param {Object} base - Base tokens
   * @param {Object} override - Override tokens
   * @returns {Object} Merged tokens
   * @description Merge tokens with proper inheritance
   */
  mergeTokens(base, override) {
    if (!override) return base;

    return {
      colors: { ...base.colors, ...override.colors },
      typography: { ...base.typography, ...override.typography },
      spacing: { ...base.spacing, ...override.spacing },
      shadows: { ...base.shadows, ...override.shadows },
      breakpoints: { ...base.breakpoints, ...override.breakpoints },
      radius: { ...base.radius, ...override.radius },
      animation: { ...base.animation, ...override.animation },
    };
  }

  /**
   * Create enhanced theme with computed methods
   * @param {Object} tokens - Theme tokens
   * @returns {Object} Enhanced theme
   * @description Create enhanced theme with computed methods
   */
  createEnhancedTheme(tokens) {
    return {
      ...tokens,
      getSpacing: (key) => tokens.spacing[key],
      getColor: (path) => this.getNestedValue(tokens.colors, path),
      getTypography: (key) => tokens.typography[key],
      getBreakpoint: (key) => tokens.breakpoints[key],

      // Backward compatibility
      primary: tokens.colors.brand,
      secondary: tokens.colors.neutral,
      success: tokens.colors.semantic?.success || '#10b981',
      warning: tokens.colors.semantic?.warning || '#f59e0b',
      error: tokens.colors.semantic?.error || '#ef4444',
      info: tokens.colors.semantic?.info || '#3b82f6',
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
}
