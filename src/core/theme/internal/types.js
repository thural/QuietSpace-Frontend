/**
 * Internal Type Definitions.
 * 
 * Internal types for theme system modules.
 * Separated from public API types for better modularity.
 */

/**
 * Internal enhanced theme interface
 * @interface EnhancedTheme
 * @description Internal enhanced theme interface
 */
export class EnhancedTheme {
  /**
   * @param {Object} colors - Theme colors
   * @param {Object} typography - Theme typography
   * @param {Object} spacing - Theme spacing
   * @param {Object} shadows - Theme shadows
   * @param {Object} breakpoints - Theme breakpoints
   * @param {Object} radius - Theme border radius
   * @param {Object} animation - Theme animations
   * @param {Function} getSpacing - Get spacing by key
   * @param {Function} getColor - Get color by path
   * @param {Function} getTypography - Get typography by key
   * @param {Function} getBreakpoint - Get breakpoint by key
   * @param {Object} primary - Primary color (backward compatibility)
   * @param {Object} secondary - Secondary color (backward compatibility)
   * @param {string} success - Success color
   * @param {string} warning - Warning color
   * @param {string} error - Error color
   * @param {string} info - Info color
   */
  constructor(colors, typography, spacing, shadows, breakpoints, radius, animation, getSpacing, getColor, getTypography, getBreakpoint, primary, secondary, success, warning, error, info) {
    this.colors = colors;
    this.typography = typography;
    this.spacing = spacing;
    this.shadows = shadows;
    this.breakpoints = breakpoints;
    this.radius = radius;
    this.animation = animation;
    this.getSpacing = getSpacing;
    this.getColor = getColor;
    this.getTypography = getTypography;
    this.getBreakpoint = getBreakpoint;
    this.primary = primary;
    this.secondary = secondary;
    this.success = success;
    this.warning = warning;
    this.error = error;
    this.info = info;
  }

  /** @type {Object} Theme colors */
  colors;

  /** @type {Object} Theme typography */
  typography;

  /** @type {Object} Theme spacing */
  spacing;

  /** @type {Object} Theme shadows */
  shadows;

  /** @type {Object} Theme breakpoints */
  breakpoints;

  /** @type {Object} Theme border radius */
  radius;

  /** @type {Object} Theme animations */
  animation;

  /** @type {Function} Get spacing by key */
  getSpacing;

  /** @type {Function} Get color by path */
  getColor;

  /** @type {Function} Get typography by key */
  getTypography;

  /** @type {Function} Get breakpoint by key */
  getBreakpoint;

  /** @type {Object} Primary color (backward compatibility) */
  primary;

  /** @type {Object} Secondary color (backward compatibility) */
  secondary;

  /** @type {string} Success color */
  success;

  /** @type {string} Warning color */
  warning;

  /** @type {string} Error color */
  error;

  /** @type {string} Info color */
  info;
}

/**
 * Theme configuration interface
 * @interface ThemeConfig
 * @description Theme configuration interface
 */
export class ThemeConfig {
  /**
   * @param {string} name - Theme name
   * @param {string} version - Theme version
   * @param {Object} tokens - Theme tokens
   * @param {Array.<string>} parentThemes - Parent themes
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

  /** @type {Array.<string>} Parent themes */
  extends;

  /** @type {Object} Token overrides */
  overrides;
}

/**
 * Composed theme interface
 * @interface ComposedTheme
 * @description Composed theme interface
 */
export class ComposedTheme {
  /**
   * @param {string} name - Theme name
   * @param {string} version - Theme version
   * @param {Object} tokens - Theme tokens
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

  /** @type {Object} Theme tokens */
  tokens;

  /** @type {Object} Theme metadata */
  metadata;
}
