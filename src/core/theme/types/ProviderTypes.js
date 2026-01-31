/**
 * Provider-Specific Type Definitions.
 * 
 * Types specifically for theme provider and context functionality.
 * Separated from core theme tokens for better modularity.
 */

/**
 * Enhanced theme interface with computed values
 * @interface EnhancedTheme
 * @description Enhanced theme with helper methods and computed values
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
 * Theme provider props interface
 * @interface ThemeProviderProps
 * @description Props for theme provider component
 */
export class ThemeProviderProps {
  /**
   * @param {React.ReactNode} children - Child components
   * @param {string} defaultVariant - Default theme variant
   * @param {Object} overrides - Theme token overrides
   */
  constructor(children, defaultVariant, overrides) {
    this.children = children;
    this.defaultVariant = defaultVariant;
    this.overrides = overrides;
  }

  /** @type {React.ReactNode} Child components */
  children;

  /** @type {string} Default theme variant */
  defaultVariant;

  /** @type {Object} Theme token overrides */
  overrides;
}

/**
 * Theme switcher interface
 * @interface ThemeSwitcher
 * @description Interface for theme switching functionality
 */
export class ThemeSwitcher {
  /**
   * @param {string} currentVariant - Current theme variant
   * @param {Array.<string>} availableVariants - Available theme variants
   * @param {Function} switchTheme - Function to switch theme
   * @param {boolean} isDark - Whether current theme is dark
   * @param {boolean} isLight - Whether current theme is light
   */
  constructor(currentVariant, availableVariants, switchTheme, isDark, isLight) {
    this.currentVariant = currentVariant;
    this.availableVariants = availableVariants;
    this.switchTheme = switchTheme;
    this.isDark = isDark;
    this.isLight = isLight;
  }

  /** @type {string} Current theme variant */
  currentVariant;

  /** @type {Array.<string>} Available theme variants */
  availableVariants;

  /** @type {Function} Function to switch theme */
  switchTheme;

  /** @type {boolean} Whether current theme is dark */
  isDark;

  /** @type {boolean} Whether current theme is light */
  isLight;
}

/**
 * Theme context value interface
 * @interface ThemeContextValue
 * @description Interface for theme context value
 */
export class ThemeContextValue {
  /**
   * @param {EnhancedTheme} theme - Enhanced theme object
   * @param {string} currentVariant - Current theme variant
   * @param {Function} setVariant - Function to set theme variant
   * @param {Array.<string>} availableVariants - Available theme variants
   */
  constructor(theme, currentVariant, setVariant, availableVariants) {
    this.theme = theme;
    this.currentVariant = currentVariant;
    this.setVariant = setVariant;
    this.availableVariants = availableVariants;
  }

  /** @type {EnhancedTheme} Enhanced theme object */
  theme;

  /** @type {string} Current theme variant */
  currentVariant;

  /** @type {Function} Function to set theme variant */
  setVariant;

  /** @type {Array.<string>} Available theme variants */
  availableVariants;
}
