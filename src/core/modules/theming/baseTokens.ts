/**
 * Base Theme Tokens.
 *
 * Centralized base tokens for spacing, shadows, breakpoints, radius, and animations.
 * Provides single source of truth for non-color, non-typography theme values.
 */

export const baseSpacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
    '6xl': '192px'
};

export const baseShadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
};

export const baseBreakpoints = {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
};

export const baseRadius = {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '50px',
    round: '50px'
};

export const baseBorder = {
    none: '0',
    hairline: '1px',
    xs: '1px',
    sm: '2px',
    md: '2px',
    lg: '2px',
    xl: '3px',
    '2xl': '4px'
};

export const baseSize = {
    skeleton: {
        minWidth: '172px',
        height: '256px'
    },
    avatar: {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px'
    },
    messageCard: {
        maxWidth: '200px'
    },
    modal: {
        small: { maxWidth: '400px', width: '90%' },
        medium: { maxWidth: '600px', width: '90%' },
        large: { maxWidth: '800px', width: '90%' },
        fullscreen: { maxWidth: '100%', width: '100%', height: '100%' }
    }
};

export const baseAnimation = {
    duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
    },
    easing: {
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};
