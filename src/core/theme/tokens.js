/**
 * Theme Tokens System.
 * 
 * Atomic design tokens for maximum composability and maintainability.
 * Provides a foundation for theme composition and inheritance.
 * 
 * Type definitions have been separated into domain-specific files for better organization.
 */

// Import separated token types
export { ColorTokens } from './types/colorTokens.js';
export { TypographyTokens } from './types/typographyTokens.js';
export {
  SpacingTokens,
  ShadowTokens,
  BreakpointTokens,
  RadiusTokens
} from './types/layoutTokens.js';
export { AnimationTokens } from './types/animationTokens.js';

// Import types for use in interface
import { ColorTokens } from './types/colorTokens.js';
import { TypographyTokens } from './types/typographyTokens.js';
import {
  SpacingTokens,
  ShadowTokens,
  BreakpointTokens,
  RadiusTokens
} from './types/layoutTokens.js';
import { AnimationTokens } from './types/animationTokens.js';

/**
 * Combined theme tokens interface
 * @interface ThemeTokens
 * @description Defines the complete set of theme tokens
 */
export class ThemeTokens {
  /**
   * @param {ColorTokens} colors - Color tokens
   * @param {TypographyTokens} typography - Typography tokens
   * @param {SpacingTokens} spacing - Spacing tokens
   * @param {ShadowTokens} shadows - Shadow tokens
   * @param {BreakpointTokens} breakpoints - Breakpoint tokens
   * @param {RadiusTokens} radius - Border radius tokens
   * @param {AnimationTokens} animation - Animation tokens
   */
  constructor(colors, typography, spacing, shadows, breakpoints, radius, animation) {
    this.colors = colors;
    this.typography = typography;
    this.spacing = spacing;
    this.shadows = shadows;
    this.breakpoints = breakpoints;
    this.radius = radius;
    this.animation = animation;
  }

  /**
   * @type {ColorTokens}
   * @description Color tokens for the theme
   */
  colors;

  /**
   * @type {TypographyTokens}
   * @description Typography tokens for the theme
   */
  typography;

  /**
   * @type {SpacingTokens}
   * @description Spacing tokens for the theme
   */
  spacing;

  /**
   * @type {ShadowTokens}
   * @description Shadow tokens for the theme
   */
  shadows;

  /**
   * @type {BreakpointTokens}
   * @description Breakpoint tokens for the theme
   */
  breakpoints;

  /**
   * @type {RadiusTokens}
   * @description Border radius tokens for the theme
   */
  radius;

  /**
   * @type {AnimationTokens}
   * @description Animation tokens for the theme
   */
  animation;
}
