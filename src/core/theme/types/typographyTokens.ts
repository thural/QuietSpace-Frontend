/**
 * Typography Token Types.
 *
 * Type definitions for typography-related theme tokens.
 * Provides clean separation of typography type definitions.
 */

export interface TypographyTokens {
    // Font Families
    fontFamily: {
        sans: string[];
        serif: string[];
        mono: string[];
    };

    // Font Sizes
    fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };

    // Font Weights
    fontWeight: {
        thin: string;
        extralight: string;
        light: string;
        normal: string;
        medium: string;
        semibold: string;
        bold: string;
        extrabold: string;
        black: string;
    };

    // Line Heights
    lineHeight: {
        tight: string;
        snug: string;
        normal: string;
        relaxed: string;
        loose: string;
    };

    // Letter Spacing
    letterSpacing: {
        tighter: string;
        tight: string;
        normal: string;
        wide: string;
        wider: string;
        widest: string;
    };
}
