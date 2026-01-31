/**
 * Layout-related interfaces.
 * 
 * Focused interfaces for layout system functionality.
 * Segregated from larger theme interfaces for better modularity.
 */

/**
 * Spacing interface
 * @interface Spacing
 * @description Defines spacing scale
 */
export class Spacing {
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
 * Shadow interface
 * @interface Shadow
 * @description Defines shadow variations
 */
export class Shadow {
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
 * Breakpoint interface
 * @interface Breakpoint
 * @description Defines responsive breakpoints
 */
export class Breakpoint {
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
 * Radius interface
 * @interface Radius
 * @description Defines border radius variations
 */
export class Radius {
  /**
   * @param {string} none - No border radius
   * @param {string} sm - Small border radius
   * @param {string} md - Medium border radius
   * @param {string} lg - Large border radius
   * @param {string} xl - Extra large border radius
   * @param {string} twoXl - 2x large border radius
   * @param {string} threeXl - 3x large border radius
   * @param {string} full - Full border radius (circular)
   */
  constructor(none, sm, md, lg, xl, twoXl, threeXl, full) {
    this.none = none;
    this.sm = sm;
    this.md = md;
    this.lg = lg;
    this.xl = xl;
    this['2xl'] = twoXl;
    this['3xl'] = threeXl;
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

  /** @type {string} 2x large border radius */
  '2xl';

  /** @type {string} 3x large border radius */
  '3xl';

  /** @type {string} Full border radius (circular) */
  full;
}

/**
 * Layout system interface
 * @interface LayoutSystem
 * @description Defines complete layout system
 */
export class LayoutSystem {
  /**
   * @param {Spacing} spacing - Spacing scale
   * @param {Shadow} shadows - Shadow variations
   * @param {Breakpoint} breakpoints - Responsive breakpoints
   * @param {Radius} radius - Border radius variations
   */
  constructor(spacing, shadows, breakpoints, radius) {
    this.spacing = spacing;
    this.shadows = shadows;
    this.breakpoints = breakpoints;
    this.radius = radius;
  }

  /** @type {Spacing} Spacing scale */
  spacing;

  /** @type {Shadow} Shadow variations */
  shadows;

  /** @type {Breakpoint} Responsive breakpoints */
  breakpoints;

  /** @type {Radius} Border radius variations */
  radius;
}

/**
 * Layout utilities interface
 * @interface LayoutUtilities
 * @description Defines layout utility functions
 */
export class LayoutUtilities {
  /**
   * @param {Function} getSpacing - Get spacing by key
   * @param {Function} getBreakpoint - Get breakpoint by key
   * @param {Function} getShadow - Get shadow by key
   * @param {Function} getRadius - Get radius by key
   */
  constructor(getSpacing, getBreakpoint, getShadow, getRadius) {
    this.getSpacing = getSpacing;
    this.getBreakpoint = getBreakpoint;
    this.getShadow = getShadow;
    this.getRadius = getRadius;
  }

  /**
   * @type {Function}
   * @description Get spacing by key
   * @param {string} key - Spacing key
   * @returns {string} Spacing value
   */
  getSpacing;

  /**
   * @type {Function}
   * @description Get breakpoint by key
   * @param {string} key - Breakpoint key
   * @returns {string} Breakpoint value
   */
  getBreakpoint;

  /**
   * @type {Function}
   * @description Get shadow by key
   * @param {string} key - Shadow key
   * @returns {string} Shadow value
   */
  getShadow;

  /**
   * @type {Function}
   * @description Get radius by key
   * @param {string} key - Radius key
   * @returns {string} Radius value
   */
  getRadius;
}
