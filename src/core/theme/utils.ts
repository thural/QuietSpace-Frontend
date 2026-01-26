/**
 * Theme System Utilities
 * 
 * Utility functions for theme operations following Black Box pattern.
 * Provides clean utility functions for validation, initialization, and management.
 */

import type {
    IThemeService,
    ThemeConfig,
    ThemeTokens,
    EnhancedTheme
} from '../shared';

import {
    CORE_CONSTANTS,
    CORE_VALIDATION_RULES,
    CORE_ERROR_CODES,
    CORE_ERROR_MESSAGES
} from '../shared';

/**
 * Validates theme configuration
 * 
 * @param config - Configuration to validate
 * @returns Array of validation errors
 */
export function validateThemeConfig(config: any): string[] {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object');
        return errors;
    }

    // Validate name
    if (!config.name || typeof config.name !== 'string') {
        errors.push('Theme name is required and must be a string');
    } else if (config.name.length === 0 || config.name.length > 100) {
        errors.push('Theme name must be between 1 and 100 characters');
    }

    // Validate colors
    if (config.colors && typeof config.colors !== 'object') {
        errors.push('Theme colors must be an object');
    }

    // Validate typography
    if (config.typography && typeof config.typography !== 'object') {
        errors.push('Theme typography must be an object');
    }

    // Validate spacing
    if (config.spacing && typeof config.spacing !== 'object') {
        errors.push('Theme spacing must be an object');
    }

    // Validate shadows
    if (config.shadows && typeof config.shadows !== 'object') {
        errors.push('Theme shadows must be an object');
    }

    return errors;
}

/**
 * Creates a default theme configuration
 * 
 * @param overrides - Optional configuration overrides
 * @returns Default theme configuration
 */
export function createDefaultThemeConfig(overrides?: Partial<ThemeConfig>): ThemeConfig {
    return {
        name: CORE_CONSTANTS.DEFAULT_THEME_NAME,
        colors: createDefaultColors(),
        typography: createDefaultTypography(),
        spacing: createDefaultSpacing(),
        shadows: createDefaultShadows(),
        ...overrides
    };
}

/**
 * Creates default color palette
 * 
 * @returns Default color palette
 */
export function createDefaultColors(): Record<string, string> {
    return {
        // Primary colors
        primary: '#007bff',
        primaryLight: '#66b3ff',
        primaryDark: '#0056b3',

        // Secondary colors
        secondary: '#6c757d',
        secondaryLight: '#a8aeb3',
        secondaryDark: '#545b62',

        // Success colors
        success: '#28a745',
        successLight: '#71dd8a',
        successDark: '#1e7e34',

        // Warning colors
        warning: '#ffc107',
        warningLight: '#ffcd39',
        warningDark: '#d39e00',

        // Error colors
        error: '#dc3545',
        errorLight: '#f1b0b7',
        errorDark: '#bd2130',

        // Info colors
        info: '#17a2b8',
        infoLight: '#7cc7d0',
        infoDark: '#117a8b',

        // Neutral colors
        white: '#ffffff',
        black: '#000000',
        gray50: '#f8f9fa',
        gray100: '#e9ecef',
        gray200: '#dee2e6',
        gray300: '#ced4da',
        gray400: '#adb5bd',
        gray500: '#6c757d',
        gray600: '#495057',
        gray700: '#343a40',
        gray800: '#212529',
        gray900: '#000000',

        // Text colors
        textPrimary: '#212529',
        textSecondary: '#6c757d',
        textMuted: '#adb5bd',
        textLight: '#f8f9fa',

        // Background colors
        background: '#ffffff',
        backgroundSecondary: '#f8f9fa',
        backgroundMuted: '#e9ecef',

        // Border colors
        border: '#dee2e6',
        borderLight: '#f8f9fa',
        borderDark: '#adb5bd'
    };
}

/**
 * Creates default typography scale
 * 
 * @returns Default typography scale
 */
export function createDefaultTypography(): Record<string, any> {
    return {
        // Font families
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'Times New Roman', 'serif'],
            mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace']
        },

        // Font sizes
        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem',    // 48px
            '6xl': '3.75rem', // 60px
        },

        // Font weights
        fontWeight: {
            thin: 100,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900
        },

        // Line heights
        lineHeight: {
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2
        },

        // Letter spacing
        letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0em',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em'
        }
    };
}

/**
 * Creates default spacing scale
 * 
 * @returns Default spacing scale
 */
export function createDefaultSpacing(): Record<string, string> {
    return {
        0: '0px',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
        32: '8rem',     // 128px
        40: '10rem',    // 160px
        48: '12rem',    // 192px
        56: '14rem',    // 224px
        64: '16rem'     // 256px
    };
}

/**
 * Creates default shadow definitions
 * 
 * @returns Default shadow definitions
 */
export function createDefaultShadows(): Record<string, string> {
    return {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none'
    };
}

/**
 * Creates default border radius scale
 * 
 * @returns Default border radius scale
 */
export function createDefaultRadius(): Record<string, string> {
    return {
        none: '0px',
        sm: '0.125rem',   // 2px
        base: '0.25rem',  // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
        full: '9999px'
    };
}

/**
 * Creates default breakpoints
 * 
 * @returns Default breakpoints
 */
export function createDefaultBreakpoints(): Record<string, string> {
    return {
        xs: '0px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px'
    };
}

/**
 * Creates a theme error with proper error code
 * 
 * @param message - Error message
 * @param code - Error code
 * @param details - Additional error details
 * @returns Theme error object
 */
export function createThemeError(
    message: string,
    code: string = CORE_ERROR_CODES.THEME_ERROR,
    details?: any
): Error {
    const error = new Error(message) as any;
    error.code = code;
    error.details = details;
    error.timestamp = Date.now();
    return error;
}

/**
 * Gets a color value from theme tokens
 * 
 * @param tokens - Theme tokens
 * @param path - Color path (e.g., 'primary' or 'text.primary')
 * @returns Color value or fallback
 */
export function getColor(tokens: ThemeTokens, path: string): string {
    const keys = path.split('.');
    let value: any = tokens.colors;

    for (const key of keys) {
        value = value?.[key];
    }

    return value || tokens.colors.textPrimary;
}

/**
 * Gets a spacing value from theme tokens
 * 
 * @param tokens - Theme tokens
 * @param key - Spacing key
 * @returns Spacing value or fallback
 */
export function getSpacing(tokens: ThemeTokens, key: string): string {
    return tokens.spacing[key] || tokens.spacing[4];
}

/**
 * Gets a typography value from theme tokens
 * 
 * @param tokens - Theme tokens
 * @param path - Typography path (e.g., 'fontSize.base' or 'fontWeight.bold')
 * @returns Typography value or fallback
 */
export function getTypography(tokens: ThemeTokens, path: string): any {
    const keys = path.split('.');
    let value: any = tokens.typography;

    for (const key of keys) {
        value = value?.[key];
    }

    return value || tokens.typography.fontSize.base;
}

/**
 * Merges theme tokens with overrides
 * 
 * @param baseTokens - Base theme tokens
 * @param overrides - Override tokens
 * @returns Merged theme tokens
 */
export function mergeThemeTokens(
    baseTokens: ThemeTokens,
    overrides: Partial<ThemeTokens>
): ThemeTokens {
    return {
        colors: { ...baseTokens.colors, ...overrides.colors },
        typography: { ...baseTokens.typography, ...overrides.typography },
        spacing: { ...baseTokens.spacing, ...overrides.spacing },
        shadows: { ...baseTokens.shadows, ...overrides.shadows },
        breakpoints: { ...baseTokens.breakpoints, ...overrides.breakpoints },
        radius: { ...baseTokens.radius, ...overrides.radius }
    };
}

/**
 * Creates a dark theme variant from a light theme
 * 
 * @param lightTheme - Light theme tokens
 * @returns Dark theme tokens
 */
export function createDarkTheme(lightTheme: ThemeTokens): ThemeTokens {
    return {
        ...lightTheme,
        colors: {
            ...lightTheme.colors,
            // Invert text colors
            textPrimary: lightTheme.colors.textLight,
            textSecondary: lightTheme.colors.textMuted,
            textLight: lightTheme.colors.textPrimary,
            textMuted: lightTheme.colors.textSecondary,

            // Invert background colors
            background: lightTheme.colors.gray900,
            backgroundSecondary: lightTheme.colors.gray800,
            backgroundMuted: lightTheme.colors.gray700,

            // Adjust other colors for dark mode
            border: lightTheme.colors.gray700,
            borderLight: lightTheme.colors.gray800,
            borderDark: lightTheme.colors.gray600
        }
    };
}

/**
 * Validates theme tokens
 * 
 * @param tokens - Theme tokens to validate
 * @returns Array of validation errors
 */
export function validateThemeTokens(tokens: ThemeTokens): string[] {
    const errors: string[] = [];

    if (!tokens.colors || typeof tokens.colors !== 'object') {
        errors.push('Theme colors must be an object');
    }

    if (!tokens.typography || typeof tokens.typography !== 'object') {
        errors.push('Theme typography must be an object');
    }

    if (!tokens.spacing || typeof tokens.spacing !== 'object') {
        errors.push('Theme spacing must be an object');
    }

    if (!tokens.shadows || typeof tokens.shadows !== 'object') {
        errors.push('Theme shadows must be an object');
    }

    return errors;
}

/**
 * Formats theme tokens for debugging
 * 
 * @param tokens - Theme tokens to format
 * @returns Formatted theme tokens string
 */
export function formatThemeTokens(tokens: ThemeTokens): string {
    return `Theme Tokens:
  Colors: ${Object.keys(tokens.colors).length} colors defined
  Typography: ${Object.keys(tokens.typography).length} properties defined
  Spacing: ${Object.keys(tokens.spacing).length} spacing values defined
  Shadows: ${Object.keys(tokens.shadows).length} shadows defined
  Breakpoints: ${Object.keys(tokens.breakpoints).length} breakpoints defined`;
}

/**
 * Generates a CSS custom property name
 * 
 * @param category - Property category (color, spacing, etc.)
 * @param name - Property name
 * @returns CSS custom property name
 */
export function generateCSSVariable(category: string, name: string): string {
    return `--theme-${category}-${name}`;
}

/**
 * Creates CSS custom properties from theme tokens
 * 
 * @param tokens - Theme tokens
 * @returns CSS custom properties object
 */
export function createCSSVariables(tokens: ThemeTokens): Record<string, string> {
    const variables: Record<string, string> = {};

    // Color variables
    Object.entries(tokens.colors).forEach(([key, value]) => {
        variables[`--theme-color-${key}`] = value;
    });

    // Spacing variables
    Object.entries(tokens.spacing).forEach(([key, value]) => {
        variables[`--theme-spacing-${key}`] = value;
    });

    // Typography variables
    Object.entries(tokens.typography).forEach(([key, value]) => {
        if (typeof value === 'string') {
            variables[`--theme-typography-${key}`] = value;
        }
    });

    // Shadow variables
    Object.entries(tokens.shadows).forEach(([key, value]) => {
        variables[`--theme-shadow-${key}`] = value;
    });

    return variables;
}

/**
 * Applies theme tokens to an element
 * 
 * @param element - DOM element
 * @param tokens - Theme tokens
 * @returns CSS string with applied theme
 */
export function applyThemeToElement(element: HTMLElement, tokens: ThemeTokens): string {
    const variables = createCSSVariables(tokens);
    const cssString = Object.entries(variables)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n');

    element.style.cssText += cssString;
    return cssString;
}
