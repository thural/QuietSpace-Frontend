/**
 * Layout-related interfaces.
 * 
 * Focused interfaces for layout system functionality.
 * Segregated from larger theme interfaces for better modularity.
 */

/**
 * Spacing interface
 */
export interface Spacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
}

/**
 * Shadow interface
 */
export interface Shadow {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
}

/**
 * Breakpoint interface
 */
export interface Breakpoint {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
}

/**
 * Radius interface
 */
export interface Radius {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
}

/**
 * Layout system interface
 */
export interface LayoutSystem {
    spacing: Spacing;
    shadows: Shadow;
    breakpoints: Breakpoint;
    radius: Radius;
}

/**
 * Layout utilities interface
 */
export interface LayoutUtilities {
    getSpacing: (key: keyof Spacing) => string;
    getBreakpoint: (key: keyof Breakpoint) => string;
    getShadow: (key: keyof Shadow) => string;
    getRadius: (key: keyof Radius) => string;
}
