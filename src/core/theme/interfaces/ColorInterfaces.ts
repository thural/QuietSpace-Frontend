/**
 * Color-related interfaces.
 * 
 * Focused interfaces for color system functionality.
 * Segregated from larger theme interfaces for better modularity.
 */

/**
 * Color palette interface
 */
export interface ColorPalette {
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
}

/**
 * Semantic colors interface
 */
export interface SemanticColors {
    success: string;
    warning: string;
    error: string;
    info: string;
}

/**
 * Background colors interface
 */
export interface BackgroundColors {
    primary: string;
    secondary: string;
    tertiary: string;
    overlay: string;
    transparent: string;
}

/**
 * Text colors interface
 */
export interface TextColors {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    max: string;
    min: string;
}

/**
 * Border colors interface
 */
export interface BorderColors {
    light: string;
    medium: string;
    dark: string;
}

/**
 * Complete color system interface
 */
export interface ColorSystem {
    brand: ColorPalette;
    neutral: ColorPalette;
    semantic: SemanticColors;
    background: BackgroundColors;
    text: TextColors;
    border: BorderColors;
}

/**
 * Color utilities interface
 */
export interface ColorUtilities {
    getColor: (path: string) => string;
    getContrastColor: (backgroundColor: string) => string;
    getLightColor: (color: string, amount: number) => string;
    getDarkColor: (color: string, amount: number) => string;
}
