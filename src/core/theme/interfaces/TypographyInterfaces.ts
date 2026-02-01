/**
 * Typography-related interfaces.
 * 
 * Focused interfaces for typography system functionality.
 * Segregated from larger theme interfaces for better modularity.
 */

/**
 * Font size interface
 */
export interface FontSize {
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
}

/**
 * Font weight interface
 */
export interface FontWeight {
    thin: string;
    extralight: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
    black: string;
}

/**
 * Line height interface
 */
export interface LineHeight {
    tight: string;
    normal: string;
    relaxed: string;
}

/**
 * Font family interface
 */
export interface FontFamily {
    sans: string;
    serif: string;
    mono: string;
}

/**
 * Typography system interface
 */
export interface TypographySystem {
    fontSize: FontSize;
    fontWeight: FontWeight;
    lineHeight: LineHeight;
    fontFamily: FontFamily;
}

/**
 * Typography utilities interface
 */
export interface TypographyUtilities {
    getTypography: (key: keyof TypographySystem) => any;
    getFontSize: (size: keyof FontSize) => string;
    getFontWeight: (weight: keyof FontWeight) => string;
}
