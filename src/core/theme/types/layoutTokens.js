/**
 * Layout Token Types.
 * 
 * Type definitions for layout-related theme tokens.
 * Provides clean separation of layout type definitions.
 */

/**
 * Spacing tokens interface
 * @interface SpacingTokens
 * @description Defines the structure for spacing theme tokens
 */
export class SpacingTokens {
  /**
   * @param {string} xs - Extra small spacing
   * @param {string} sm - Small spacing
   * @param {string} md - Medium spacing
   * @param {string} lg - Large spacing
   * @param {string} xl - Extra large spacing
   * @param {string} xxl - 2x large spacing
   * @param {string} threeXl - 3x large spacing
   * @param {string} fourXl - 4x large spacing
   * @param {string} fiveXl - 5x large spacing
   * @param {string} sixXl - 6x large spacing
   */
  constructor(xs, sm, md, lg, xl, xxl, threeXl, fourXl, fiveXl, sixXl) {
    this.xs = xs;
    this.sm = sm;
    this.md = md;
    this.lg = lg;
    this.xl = xl;
    this.xxl = xxl;
    this['3xl'] = threeXl;
    this['4xl'] = fourXl;
    this['5xl'] = fiveXl;
    this['6xl'] = sixXl;
  }

  /** @type {string} Extra small spacing */
  xs;

  /** @type {string} Small spacing */
  sm;

  /** @type {string} Medium spacing */
  md;

  /** @type {string} Large spacing */
  lg;

  /** @type {string} Extra large spacing */
  xl;

  /** @type {string} 2x large spacing */
  xxl;

  /** @type {string} 3x large spacing */
  '3xl';

  /** @type {string} 4x large spacing */
  '4xl';

  /** @type {string} 5x large spacing */
  '5xl';

  /** @type {string} 6x large spacing */
  '6xl';
}

/**
 * Shadow tokens interface
 * @interface ShadowTokens
 * @description Defines the structure for shadow theme tokens
 */
export class ShadowTokens {
  /**
   * @param {string} sm - Small shadow
   * @param {string} md - Medium shadow
   * @param {string} lg - Large shadow
   * @param {string} xl - Extra large shadow
   * @param {string} twoXl - 2x large shadow
   * @param {string} inner - Inner shadow
   */
  constructor(sm, md, lg, xl, twoXl, inner) {
    this.sm = sm;
    this.md = md;
    this.lg = lg;
    this.xl = xl;
    this['2xl'] = twoXl;
    this.inner = inner;
  }

  /** @type {string} Small shadow */
  sm;

  /** @type {string} Medium shadow */
  md;

  /** @type {string} Large shadow */
  lg;

  /** @type {string} Extra large shadow */
  xl;

  /** @type {string} 2x large shadow */
  '2xl';

  /** @type {string} Inner shadow */
  inner;
}

/**
 * Breakpoint tokens interface
 * @interface BreakpointTokens
 * @description Defines the structure for breakpoint theme tokens
 */
export class BreakpointTokens {
  /**
   * @param {string} xs - Extra small breakpoint
   * @param {string} sm - Small breakpoint
   * @param {string} md - Medium breakpoint
   * @param {string} lg - Large breakpoint
   * @param {string} xl - Extra large breakpoint
   * @param {string} twoXl - 2x large breakpoint
   */
  constructor(xs, sm, md, lg, xl, twoXl) {
    this.xs = xs;
    this.sm = sm;
    this.md = md;
    this.lg = lg;
    this.xl = xl;
    this['2xl'] = twoXl;
  }

  /** @type {string} Extra small breakpoint */
  xs;

  /** @type {string} Small breakpoint */
  sm;

  /** @type {string} Medium breakpoint */
  md;

  /** @type {string} Large breakpoint */
  lg;

  /** @type {string} Extra large breakpoint */
  xl;

  /** @type {string} 2x large breakpoint */
  '2xl';
}

/**
 * Radius tokens interface
 * @interface RadiusTokens
 * @description Defines the structure for border radius theme tokens
 */
export class RadiusTokens {
  /**
   * @param {string} none - No border radius
   * @param {string} sm - Small border radius
   * @param {string} md - Medium border radius
   * @param {string} lg - Large border radius
   * @param {string} xl - Extra large border radius
   * @param {string} full - Full border radius (circular)
   */
  constructor(none, sm, md, lg, xl, full) {
    this.none = none;
    this.sm = sm;
    this.md = md;
    this.lg = lg;
    this.xl = xl;
    this.full = full;
  }

  /** @type {string} No border radius */
  none;

  /** @type {string} Small border radius */
  sm;

  /** @type {string} Medium border radius */
  md;

  /** @type {string} Large border radius */
  lg;

  /** @type {string} Extra large border radius */
  xl;

  /** @type {string} Full border radius (circular) */
  full;
}
