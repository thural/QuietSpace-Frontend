/**
 * Theme System Factory with Dependency Injection.
 * 
 * Factory for creating theme services with proper dependency injection.
 * Enables loose coupling and easier testing.
 */

import { themeContainer, THEME_TOKENS } from './ThemeContainer.js';

/**
 * Theme factory interface
 * @interface IThemeFactory
 * @description Defines the interface for theme factory
 */
export class IThemeFactory {
  /**
   * @param {Function} createTheme - Function to create theme
   * @param {Function} createVariant - Function to create variant
   * @param {Function} getAvailableVariants - Function to get available variants
   */
  constructor(createTheme, createVariant, getAvailableVariants) {
    this.createTheme = createTheme;
    this.createVariant = createVariant;
    this.getAvailableVariants = getAvailableVariants;
  }

  /** @type {Function} Function to create theme */
  createTheme;

  /** @type {Function} Function to create variant */
  createVariant;

  /** @type {Function} Function to get available variants */
  getAvailableVariants;
}

/**
 * Theme factory implementation with dependency injection
 * @class ThemeFactory
 * @description Theme factory implementation with dependency injection
 */
export class ThemeFactory {
  /**
   * Create a theme with variant and optional overrides
   * @param {string} variant - Theme variant
   * @param {Object} overrides - Theme overrides
   * @returns {Object} Enhanced theme
   * @description Create a theme with variant and optional overrides
   */
  createTheme(variant, overrides) {
    const composer = themeContainer.resolve(THEME_TOKENS.THEME_COMPOSER);
    const enhancer = themeContainer.resolve(THEME_TOKENS.THEME_ENHANCER);

    const composedTheme = composer.compose(variant, overrides);
    return enhancer.enhance(composedTheme);
  }

  /**
   * Create a theme variant based on existing theme
   * @param {string} name - Variant name
   * @param {Object} base - Base theme
   * @param {Object} overrides - Theme overrides
   * @returns {Object} Enhanced theme
   * @description Create a theme variant based on existing theme
   */
  createVariant(name, base, overrides) {
    const factory = themeContainer.resolve(THEME_TOKENS.THEME_FACTORY);
    return factory.createVariant(name, base, overrides);
  }

  /**
   * Get available theme variants
   * @returns {Array.<string>} Available variants
   * @description Get available theme variants
   */
  getAvailableVariants() {
    const composer = themeContainer.resolve(THEME_TOKENS.THEME_COMPOSER);
    return composer.getRegisteredVariants();
  }
}

/**
 * Theme factory provider
 * @type {Readonly<Object>}
 * @description Theme factory provider
 */
export const themeFactoryProvider = Object.freeze({
  /**
   * Get theme factory instance
   * @returns {ThemeFactory} Theme factory instance
   * @description Get theme factory instance
   */
  getFactory() {
    return new ThemeFactory();
  },

  /**
   * Register custom theme factory
   * @param {Function} factory - Factory function
   * @description Register custom theme factory
   */
  registerFactory(factory) {
    themeContainer.register(THEME_TOKENS.THEME_FACTORY, () => factory());
  }
});
