/**
 * Color Token Types.
 * 
 * Type definitions for color-related theme tokens.
 * Provides clean separation of color type definitions.
 */

export interface ColorTokens {
    // Brand Colors
    brand: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        950: string;
    };

    // Semantic Colors
    semantic: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };

    // Neutral Colors
    neutral: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        950: string;
    };

    // Background Colors
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
        overlay: string;
        transparent: string;
    };

    // Text Colors
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
    };

    // Border Colors
    border: {
        light: string;
        medium: string;
        dark: string;
    };
}
