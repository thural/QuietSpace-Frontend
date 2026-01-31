/**
 * Color-related interfaces.
 * 
 * Focused interfaces for color system functionality.
 * Segregated from larger theme interfaces for better modularity.
 */

/**
 * Color palette interface
 * @interface ColorPalette
 * @description Defines a color palette with 50-950 scale
 */
export class ColorPalette {
  /**
   * @param {string} fifty - Lightest color
   * @param {string} oneHundred - Very light color
   * @param {string} twoHundred - Light color
   * @param {string} threeHundred - Medium-light color
   * @param {string} fourHundred - Medium color
   * @param {string} fiveHundred - Main color
   * @param {string} sixHundred - Medium-dark color
   * @param {string} sevenHundred - Dark color
   * @param {string} eightHundred - Very dark color
   * @param {string} nineHundred - Darkest color
   * @param {string} nineHundredFifty - Ultra dark color
   */
  constructor(fifty, oneHundred, twoHundred, threeHundred, fourHundred, fiveHundred, sixHundred, sevenHundred, eightHundred, nineHundred, nineHundredFifty) {
    this['50'] = fifty;
    this['100'] = oneHundred;
    this['200'] = twoHundred;
    this['300'] = threeHundred;
    this['400'] = fourHundred;
    this['500'] = fiveHundred;
    this['600'] = sixHundred;
    this['700'] = sevenHundred;
    this['800'] = eightHundred;
    this['900'] = nineHundred;
    this['950'] = nineHundredFifty;
  }

  /** @type {string} Lightest color */
  '50';

  /** @type {string} Very light color */
  '100';

  /** @type {string} Light color */
  '200';

  /** @type {string} Medium-light color */
  '300';

  /** @type {string} Medium color */
  '400';

  /** @type {string} Main color */
  '500';

  /** @type {string} Medium-dark color */
  '600';

  /** @type {string} Dark color */
  '700';

  /** @type {string} Very dark color */
  '800';

  /** @type {string} Darkest color */
  '900';

  /** @type {string} Ultra dark color */
  '950';
}

/**
 * Semantic colors interface
 * @interface SemanticColors
 * @description Defines semantic color meanings
 */
export class SemanticColors {
  /**
   * @param {string} success - Success state color
   * @param {string} warning - Warning state color
   * @param {string} error - Error state color
   * @param {string} info - Information state color
   */
  constructor(success, warning, error, info) {
    this.success = success;
    this.warning = warning;
    this.error = error;
    this.info = info;
  }

  /** @type {string} Success state color */
  success;

  /** @type {string} Warning state color */
  warning;

  /** @type {string} Error state color */
  error;

  /** @type {string} Information state color */
  info;
}

/**
 * Background colors interface
 * @interface BackgroundColors
 * @description Defines background color variants
 */
export class BackgroundColors {
  /**
   * @param {string} primary - Primary background color
   * @param {string} secondary - Secondary background color
   * @param {string} tertiary - Tertiary background color
   * @param {string} overlay - Overlay background color
   * @param {string} transparent - Transparent background
   */
  constructor(primary, secondary, tertiary, overlay, transparent) {
    this.primary = primary;
    this.secondary = secondary;
    this.tertiary = tertiary;
    this.overlay = overlay;
    this.transparent = transparent;
  }

  /** @type {string} Primary background color */
  primary;

  /** @type {string} Secondary background color */
  secondary;

  /** @type {string} Tertiary background color */
  tertiary;

  /** @type {string} Overlay background color */
  overlay;

  /** @type {string} Transparent background */
  transparent;
}

/**
 * Text colors interface
 * @interface TextColors
 * @description Defines text color variants
 */
export class TextColors {
  /**
   * @param {string} primary - Primary text color
   * @param {string} secondary - Secondary text color
   * @param {string} tertiary - Tertiary text color
   * @param {string} inverse - Inverse text color
   * @param {string} max - Maximum contrast text color
   * @param {string} min - Minimum contrast text color
   */
  constructor(primary, secondary, tertiary, inverse, max, min) {
    this.primary = primary;
    this.secondary = secondary;
    this.tertiary = tertiary;
    this.inverse = inverse;
    this.max = max;
    this.min = min;
  }

  /** @type {string} Primary text color */
  primary;

  /** @type {string} Secondary text color */
  secondary;

  /** @type {string} Tertiary text color */
  tertiary;

  /** @type {string} Inverse text color */
  inverse;

  /** @type {string} Maximum contrast text color */
  max;

  /** @type {string} Minimum contrast text color */
  min;
}

/**
 * Border colors interface
 * @interface BorderColors
 * @description Defines border color variants
 */
export class BorderColors {
  /**
   * @param {string} light - Light border color
   * @param {string} medium - Medium border color
   * @param {string} dark - Dark border color
   */
  constructor(light, medium, dark) {
    this.light = light;
    this.medium = medium;
    this.dark = dark;
  }

  /** @type {string} Light border color */
  light;

  /** @type {string} Medium border color */
  medium;

  /** @type {string} Dark border color */
  dark;
}

/**
 * Complete color system interface
 * @interface ColorSystem
 * @description Defines the complete color system
 */
export class ColorSystem {
  /**
   * @param {ColorPalette} brand - Brand color palette
   * @param {ColorPalette} neutral - Neutral color palette
   * @param {SemanticColors} semantic - Semantic colors
   * @param {BackgroundColors} background - Background colors
   * @param {TextColors} text - Text colors
   * @param {BorderColors} border - Border colors
   */
  constructor(brand, neutral, semantic, background, text, border) {
    this.brand = brand;
    this.neutral = neutral;
    this.semantic = semantic;
    this.background = background;
    this.text = text;
    this.border = border;
  }

  /** @type {ColorPalette} Brand color palette */
  brand;

  /** @type {ColorPalette} Neutral color palette */
  neutral;

  /** @type {SemanticColors} Semantic colors */
  semantic;

  /** @type {BackgroundColors} Background colors */
  background;

  /** @type {TextColors} Text colors */
  text;

  /** @type {BorderColors} Border colors */
  border;
}

/**
 * Color utilities interface
 * @interface ColorUtilities
 * @description Defines color utility functions
 */
export class ColorUtilities {
  /**
   * @param {Function} getColor - Get color by path
   * @param {Function} getContrastColor - Get contrast color
   * @param {Function} getLightColor - Get lighter color
   * @param {Function} getDarkColor - Get darker color
   */
  constructor(getColor, getContrastColor, getLightColor, getDarkColor) {
    this.getColor = getColor;
    this.getContrastColor = getContrastColor;
    this.getLightColor = getLightColor;
    this.getDarkColor = getDarkColor;
  }

  /**
   * @type {Function}
   * @description Get color by path
   * @param {string} path - Color path
   * @returns {string} Color value
   */
  getColor;

  /**
   * @type {Function}
   * @description Get contrast color for background
   * @param {string} backgroundColor - Background color
   * @returns {string} Contrast color
   */
  getContrastColor;

  /**
   * @type {Function}
   * @description Get lighter version of color
   * @param {string} color - Base color
   * @param {number} amount - Lighten amount
   * @returns {string} Lighter color
   */
  getLightColor;

  /**
   * @type {Function}
   * @description Get darker version of color
   * @param {string} color - Base color
   * @param {number} amount - Darken amount
   * @returns {string} Darker color
   */
  getDarkColor;
}
