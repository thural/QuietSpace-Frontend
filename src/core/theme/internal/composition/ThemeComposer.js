/**
 * Internal Theme Composer.
 * 
 * Handles theme composition and inheritance logic.
 * Separated from factory and enhancement concerns.
 */

import { colors } from '@core/theme/appColors.js';
import { typography } from '@core/theme/appTypography.js';
import {
  baseSpacing,
  baseShadows,
  baseBreakpoints,
  baseRadius,
  baseAnimation
} from '@core/theme/baseTokens.js';

/**
 * Theme Composer interface
 * @interface IThemeComposer
 * @description Defines the interface for theme composer
 */
export class IThemeComposer {
  /**
   * @param {Function} register - Function to register theme
   * @param {Function} compose - Function to compose theme
   * @param {Function} getRegisteredVariants - Function to get registered variants
   */
  constructor(register, compose, getRegisteredVariants) {
    this.register = register;
    this.compose = compose;
    this.getRegisteredVariants = getRegisteredVariants;
  }

  /** @type {Function} Function to register theme */
  register;

  /** @type {Function} Function to compose theme */
  compose;

  /** @type {Function} Function to get registered variants */
  getRegisteredVariants;
}

/**
 * Theme Composer implementation
 * @class ThemeComposer
 * @description Theme composer implementation
 */
export class ThemeComposer {
  constructor() {
    this.themes = new Map();
    this.composedThemes = new Map();
  }

  /**
   * Register a theme configuration
   * @param {string} name - Theme name
   * @param {Object} config - Theme configuration
   * @returns {void}
   * @description Register a theme configuration
   */
  register(name, config) {
    const themeConfig = {
      name,
      version: '1.0.0',
      tokens: config,
    };
    this.themes.set(name, themeConfig);
  }

  /**
   * Compose a theme with inheritance and overrides
   * @param {string} variant - Theme variant
   * @param {Object} overrides - Theme overrides
   * @returns {Object} Composed theme
   * @description Compose a theme with inheritance and overrides
   */
  compose(variant, overrides) {
    const config = this.themes.get(variant);
    if (!config) {
      throw new Error(`Theme "${variant}" not found`);
    }

    // Check cache
    const cacheKey = `${variant}-${JSON.stringify(overrides)}`;
    if (this.composedThemes.has(cacheKey)) {
      return this.composedThemes.get(cacheKey);
    }

    // Compose tokens
    const tokens = this.composeTokens(config, overrides);

    const composedTheme = {
      name: config.name,
      version: config.version,
      tokens,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        extends: config.extends || [],
      }
    };

    this.composedThemes.set(cacheKey, composedTheme);
    return composedTheme;
  }

  /**
   * Get registered theme variants
   * @returns {Array.<string>} Registered variants
   * @description Get registered theme variants
   */
  getRegisteredVariants() {
    return Array.from(this.themes.keys());
  }

  /**
   * Compose tokens with inheritance and overrides
   * @param {Object} config - Theme configuration
   * @param {Object} overrides - Theme overrides
   * @returns {Object} Composed tokens
   * @description Compose tokens with inheritance and overrides
   */
  composeTokens(config, overrides) {
    let tokens = { ...config.tokens };

    // Apply inheritance
    if (config.extends) {
      for (const parentName of config.extends) {
        const parentConfig = this.themes.get(parentName);
        if (parentConfig) {
          tokens = this.mergeTokens(tokens, parentConfig.tokens);
        }
      }
    }

    // Apply overrides
    if (overrides) {
      tokens = this.mergeTokens(tokens, overrides);
    }

    // Apply config overrides
    if (config.overrides) {
      tokens = this.mergeTokens(tokens, config.overrides);
    }

    return this.validateTokens(tokens);
  }

  /**
   * Deep merge tokens
   * @param {Object} base - Base tokens
   * @param {Object} override - Override tokens
   * @returns {Object} Merged tokens
   * @description Deep merge tokens
   */
  mergeTokens(base, override) {
    const defaults = this.getDefaultTokens();

    return {
      colors: { ...defaults.colors, ...base.colors, ...override.colors },
      typography: { ...defaults.typography, ...base.typography, ...override.typography },
      spacing: { ...defaults.spacing, ...base.spacing, ...override.spacing },
      shadows: { ...defaults.shadows, ...base.shadows, ...override.shadows },
      breakpoints: { ...defaults.breakpoints, ...base.breakpoints, ...override.breakpoints },
      radius: { ...defaults.radius, ...base.radius, ...override.radius },
      animation: { ...defaults.animation, ...base.animation, ...override.animation },
    };
  }

  /**
   * Validate tokens for completeness
   * @param {Object} tokens - Tokens to validate
   * @returns {Object} Validated tokens
   * @description Validate tokens for completeness
   */
  validateTokens(tokens) {
    const defaults = this.getDefaultTokens();

    return {
      colors: { ...defaults.colors, ...tokens.colors },
      typography: { ...defaults.typography, ...tokens.typography },
      spacing: { ...defaults.spacing, ...tokens.spacing },
      shadows: { ...defaults.shadows, ...tokens.shadows },
      breakpoints: { ...defaults.breakpoints, ...tokens.breakpoints },
      radius: { ...defaults.radius, ...tokens.radius },
      animation: { ...defaults.animation, ...tokens.animation },
    };
  }

  /**
   * Get default tokens
   * @returns {Object} Default tokens
   * @description Get default tokens
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
}
