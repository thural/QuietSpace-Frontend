/**
 * Theme Composition System.
 * 
 * Composable theme system with inheritance, merging, and validation.
 * Supports theme variants, overrides, and composition patterns.
 */

import { colors } from './appColors.js';
import { typography } from './appTypography.js';
import {
  baseSpacing,
  baseShadows,
  baseBreakpoints,
  baseRadius,
  baseAnimation
} from './baseTokens.js';

/**
 * Theme configuration interface
 * @interface ThemeConfig
 * @description Defines theme configuration structure
 */
export class ThemeConfig {
  /**
   * @param {string} name - Theme name
   * @param {string} version - Theme version
   * @param {Object} tokens - Theme tokens
   * @param {Array.<string>} parentThemes - Parent themes to inherit from
   * @param {Object} overrides - Token overrides
   */
  constructor(name, version, tokens, parentThemes, overrides) {
    this.name = name;
    this.version = version;
    this.tokens = tokens;
    this.extends = parentThemes;
    this.overrides = overrides;
  }

  /** @type {string} Theme name */
  name;

  /** @type {string} Theme version */
  version;

  /** @type {Object} Theme tokens */
  tokens;

  /** @type {Array.<string>} Parent themes to inherit from */
  extends;

  /** @type {Object} Token overrides */
  overrides;
}

/**
 * Composed theme interface
 * @interface ComposedTheme
 * @description Defines composed theme structure
 */
export class ComposedTheme {
  /**
   * @param {string} name - Theme name
   * @param {string} version - Theme version
   * @param {Object} tokens - Composed theme tokens
   * @param {Object} metadata - Theme metadata
   */
  constructor(name, version, tokens, metadata) {
    this.name = name;
    this.version = version;
    this.tokens = tokens;
    this.metadata = metadata;
  }

  /** @type {string} Theme name */
  name;

  /** @type {string} Theme version */
  version;

  /** @type {Object} Composed theme tokens */
  tokens;

  /** @type {Object} Theme metadata */
  metadata;
}

/**
 * Theme Composer for creating composable themes
 * @class ThemeComposer
 * @description Handles theme registration and composition
 */
export class ThemeComposer {
  constructor() {
    this.themes = new Map();
    this.composedThemes = new Map();
  }

  /**
   * Register a theme configuration
   * @param {ThemeConfig} config - Theme configuration to register
   * @returns {void}
   * @description Registers a theme configuration for later composition
   */
  registerTheme(config) {
    this.themes.set(config.name, config);
  }

  /**
   * Compose a theme with inheritance and overrides
   * @param {string} name - Theme name to compose
   * @param {Object} overrides - Optional token overrides
   * @returns {ComposedTheme} Composed theme
   * @description Composes a theme with inheritance and overrides
   */
  composeTheme(name, overrides) {
    const config = this.themes.get(name);
    if (!config) {
      throw new Error(`Theme "${name}" not found`);
    }

    // Check if already composed
    const cacheKey = `${name}-${JSON.stringify(overrides)}`;
    if (this.composedThemes.has(cacheKey)) {
      return this.composedThemes.get(cacheKey);
    }

    // Compose theme with inheritance
    const tokens = this.composeTokens(config, overrides);

    const composedTheme = new ComposedTheme(name, config.version, tokens, {
      createdAt: new Date(),
      updatedAt: new Date(),
      extends: config.extends || []
    });

    this.composedThemes.set(cacheKey, composedTheme);
    return composedTheme;
  }

  /**
   * Compose tokens with inheritance and overrides
   * @param {ThemeConfig} config - Theme configuration
   * @param {Object} overrides - Token overrides
   * @returns {Object} Composed tokens
   * @description Composes tokens with inheritance and overrides
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
   * Deep merge tokens with proper inheritance
   * @param {Object} base - Base tokens
   * @param {Object} override - Override tokens
   * @returns {Object} Merged tokens
   * @description Deep merges tokens with proper inheritance
   */
  mergeTokens(base, override) {
    return {
      colors: { ...this.getDefaultTokens().colors, ...base.colors, ...override.colors },
      typography: { ...this.getDefaultTokens().typography, ...base.typography, ...override.typography },
      spacing: { ...this.getDefaultTokens().spacing, ...base.spacing, ...override.spacing },
      shadows: { ...this.getDefaultTokens().shadows, ...base.shadows, ...override.shadows },
      breakpoints: { ...this.getDefaultTokens().breakpoints, ...base.breakpoints, ...override.breakpoints },
      radius: { ...this.getDefaultTokens().radius, ...base.radius, ...override.radius },
      animation: { ...this.getDefaultTokens().animation, ...base.animation, ...override.animation },
    };
  }

  /**
   * Validate tokens for completeness
   * @param {Object} tokens - Tokens to validate
   * @returns {Object} Validated tokens
   * @description Validates tokens for completeness
   */
  validateTokens(tokens) {
    const defaults = this.getDefaultTokens();

    // Ensure all required tokens are present
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
   * @returns {Object} Default theme tokens
   * @description Returns default theme tokens
   */
  getDefaultTokens() {
    return {
      colors: colors,
      typography: typography,
      spacing: baseSpacing,
      shadows: baseShadows,
      breakpoints: baseBreakpoints,
      radius: baseRadius,
      animation: baseAnimation,
    };
  }

  /**
   * Get all registered themes
   * @returns {Array.<string>} Array of theme names
   * @description Returns all registered theme names
   */
  getRegisteredThemes() {
    return Array.from(this.themes.keys());
  }

  /**
   * Get theme configuration
   * @param {string} name - Theme name
   * @returns {ThemeConfig|undefined} Theme configuration
   * @description Returns theme configuration by name
   */
  getThemeConfig(name) {
    return this.themes.get(name);
  }
}

// Global theme composer instance
export const themeComposer = new ThemeComposer();
