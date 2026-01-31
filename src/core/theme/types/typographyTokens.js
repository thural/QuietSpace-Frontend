/**
 * Typography Token Types.
 * 
 * Type definitions for typography-related theme tokens.
 * Provides clean separation of typography type definitions.
 */

/**
 * Typography tokens interface
 * @interface TypographyTokens
 * @description Defines the structure for typography theme tokens
 */
export class TypographyTokens {
  /**
   * @param {Object} fontFamily - Font family definitions
   * @param {Object} fontSize - Font size scale
   * @param {Object} fontWeight - Font weight definitions
   * @param {Object} lineHeight - Line height definitions
   * @param {Object} letterSpacing - Letter spacing definitions
   */
  constructor(fontFamily, fontSize, fontWeight, lineHeight, letterSpacing) {
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.lineHeight = lineHeight;
    this.letterSpacing = letterSpacing;
  }

  /**
   * @type {Object}
   * @description Font family definitions for different text styles
   * @property {string[]} sans - Sans-serif font stack
   * @property {string[]} serif - Serif font stack
   * @property {string[]} mono - Monospace font stack
   */
  fontFamily;

  /**
   * @type {Object}
   * @description Font size scale from xs to 6xl
   * @property {string} xs - Extra small font size (0.75rem)
   * @property {string} sm - Small font size (0.875rem)
   * @property {string} base - Base font size (1rem)
   * @property {string} lg - Large font size (1.125rem)
   * @property {string} xl - Extra large font size (1.25rem)
   * @property {string} '2xl' - 2x large font size (1.5rem)
   * @property {string} '3xl' - 3x large font size (1.875rem)
   * @property {string} '4xl' - 4x large font size (2.25rem)
   * @property {string} '5xl' - 5x large font size (3rem)
   * @property {string} '6xl' - 6x large font size (3.75rem)
   */
  fontSize;

  /**
   * @type {Object}
   * @description Font weight definitions from thin to black
   * @property {string} thin - Thin font weight (100)
   * @property {string} extralight - Extra light font weight (200)
   * @property {string} light - Light font weight (300)
   * @property {string} normal - Normal font weight (400)
   * @property {string} medium - Medium font weight (500)
   * @property {string} semibold - Semibold font weight (600)
   * @property {string} bold - Bold font weight (700)
   * @property {string} extrabold - Extra bold font weight (800)
   * @property {string} black - Black font weight (900)
   */
  fontWeight;

  /**
   * @type {Object}
   * @description Line height definitions for text spacing
   * @property {string} tight - Tight line height (1.25)
   * @property {string} snug - Snug line height (1.375)
   * @property {string} normal - Normal line height (1.5)
   * @property {string} relaxed - Relaxed line height (1.625)
   * @property {string} loose - Loose line height (2)
   */
  lineHeight;

  /**
   * @type {Object}
   * @description Letter spacing definitions for text character spacing
   * @property {string} tighter - Tighter letter spacing (-0.05em)
   * @property {string} tight - Tight letter spacing (-0.025em)
   * @property {string} normal - Normal letter spacing (0em)
   * @property {string} wide - Wide letter spacing (0.025em)
   * @property {string} wider - Wider letter spacing (0.05em)
   * @property {string} widest - Widest letter spacing (0.1em)
   */
  letterSpacing;
}
