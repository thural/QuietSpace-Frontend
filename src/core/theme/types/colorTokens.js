/**
 * Color Token Types.
 * 
 * Type definitions for color-related theme tokens.
 * Provides clean separation of color type definitions.
 */

/**
 * Color tokens interface
 * @interface ColorTokens
 * @description Defines the structure for color theme tokens
 */
export class ColorTokens {
  /**
   * @param {Object} brand - Brand color palette
   * @param {Object} semantic - Semantic colors (success, warning, error, info)
   * @param {Object} neutral - Neutral color palette
   * @param {Object} background - Background color variants
   * @param {Object} text - Text color variants
   * @param {Object} border - Border color variants
   */
  constructor(brand, semantic, neutral, background, text, border) {
    this.brand = brand;
    this.semantic = semantic;
    this.neutral = neutral;
    this.background = background;
    this.text = text;
    this.border = border;
  }

  /**
   * @type {Object}
   * @description Brand color palette with 50-950 scale
   * @property {string} 50 - Lightest brand color
   * @property {string} 100 - Very light brand color
   * @property {string} 200 - Light brand color
   * @property {string} 300 - Medium-light brand color
   * @property {string} 400 - Medium brand color
   * @property {string} 500 - Main brand color
   * @property {string} 600 - Medium-dark brand color
   * @property {string} 700 - Dark brand color
   * @property {string} 800 - Very dark brand color
   * @property {string} 900 - Darkest brand color
   * @property {string} 950 - Ultra dark brand color
   */
  brand;

  /**
   * @type {Object}
   * @description Semantic colors for UI states
   * @property {string} success - Success state color
   * @property {string} warning - Warning state color
   * @property {string} error - Error state color
   * @property {string} info - Information state color
   */
  semantic;

  /**
   * @type {Object}
   * @description Neutral color palette with 50-950 scale
   * @property {string} 50 - Lightest neutral color
   * @property {string} 100 - Very light neutral color
   * @property {string} 200 - Light neutral color
   * @property {string} 300 - Medium-light neutral color
   * @property {string} 400 - Medium neutral color
   * @property {string} 500 - Main neutral color
   * @property {string} 600 - Medium-dark neutral color
   * @property {string} 700 - Dark neutral color
   * @property {string} 800 - Very dark neutral color
   * @property {string} 900 - Darkest neutral color
   * @property {string} 950 - Ultra dark neutral color
   */
  neutral;

  /**
   * @type {Object}
   * @description Background color variants
   * @property {string} primary - Primary background color
   * @property {string} secondary - Secondary background color
   * @property {string} tertiary - Tertiary background color
   * @property {string} overlay - Overlay background color
   * @property {string} transparent - Transparent background
   */
  background;

  /**
   * @type {Object}
   * @description Text color variants
   * @property {string} primary - Primary text color
   * @property {string} secondary - Secondary text color
   * @property {string} tertiary - Tertiary text color
   * @property {string} inverse - Inverse text color
   */
  text;

  /**
   * @type {Object}
   * @description Border color variants
   * @property {string} light - Light border color
   * @property {string} medium - Medium border color
   * @property {string} dark - Dark border color
   */
  border;
}
