/**
 * Application Color Palette.
 * 
 * Defines the brand color scheme for the entire application.
 * Follows design system guidelines for consistency and enterprise standards.
 */

/**
 * Application color tokens
 * @type {Readonly<Object.<string, any>>}
 */
export const colors = Object.freeze({
    // Brand Colors
    brand: Object.freeze({
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Main primary color
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
    }),

    // Semantic Colors
    semantic: Object.freeze({
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    }),

    // Neutral Colors
    neutral: Object.freeze({
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
    }),

    // Background Colors
    background: Object.freeze({
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        overlay: 'rgba(0, 0, 0, 0.5)',
        transparent: 'transparent',
    }),

    // Text Colors
    text: Object.freeze({
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#64748b',
        inverse: '#ffffff',
    }),

    // Border Colors
    border: Object.freeze({
        light: '#e2e8f0',
        medium: '#cbd5e1',
        dark: '#94a3b8',
    }),
});

export default colors;
