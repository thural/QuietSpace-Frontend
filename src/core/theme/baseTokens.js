/**
 * Base Theme Tokens.
 * 
 * Centralized base tokens for spacing, shadows, breakpoints, radius, and animations.
 * Provides single source of truth for non-color, non-typography theme values.
 */

/**
 * Base spacing tokens
 * @type {Readonly<Object.<string, string>>}
 */
export const baseSpacing = Object.freeze({
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
    '6xl': '192px',
});

/**
 * Base shadow tokens
 * @type {Readonly<Object.<string, string>>}
 */
export const baseShadows = Object.freeze({
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
});

/**
 * Base breakpoint tokens
 * @type {Readonly<Object.<string, string>>}
 */
export const baseBreakpoints = Object.freeze({
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
});

/**
 * Base border radius tokens
 * @type {Readonly<Object.<string, string>>}
 */
export const baseRadius = Object.freeze({
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
});

/**
 * Base animation tokens
 * @type {Readonly<Object.<string, Object>>}
 */
export const baseAnimation = Object.freeze({
    duration: Object.freeze({
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
    }),
    easing: Object.freeze({
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }),
});
