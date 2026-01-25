/**
 * Application Color Palette.
 * 
 * Defines the brand color scheme for the entire application.
 * Follows design system guidelines for consistency and enterprise standards.
 */

export const colors = {
    // Primary Brand Colors
    primary: {
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
    },

    // Secondary Brand Colors
    secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b', // Main secondary color
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },

    // Semantic Colors
    semantic: {
        success: '#10b981',
        successLight: '#34d399',
        successDark: '#059669',
        warning: '#f59e0b',
        warningLight: '#fbbf24',
        warningDark: '#d97706',
        error: '#ef4444',
        errorLight: '#f87171',
        errorDark: '#dc2626',
        info: '#3b82f6',
        infoLight: '#60a5fa',
        infoDark: '#2563eb',
    },

    // Neutral Colors
    neutral: {
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
    },

    // Background Colors
    background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        overlay: 'rgba(0, 0, 0, 0.5)',
        inverse: '#0f172a',
    },

    // Text Colors
    text: {
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#64748b',
        inverse: '#ffffff',
        disabled: '#94a3b8',
    },

    // Border Colors
    border: {
        light: '#e2e8f0',
        medium: '#cbd5e1',
        dark: '#94a3b8',
        focus: '#3b82f6',
        error: '#ef4444',
        success: '#10b981',
    },

    // Interactive Colors
    interactive: {
        hover: 'rgba(0, 0, 0, 0.05)',
        active: 'rgba(0, 0, 0, 0.1)',
        disabled: 'rgba(0, 0, 0, 0.3)',
        selected: '#dbeafe',
    },
};

export default colors;
