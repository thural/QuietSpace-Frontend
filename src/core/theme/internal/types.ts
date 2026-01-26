/**
 * Internal Type Definitions.
 * 
 * Internal types for theme system modules.
 * Separated from public API types for better modularity.
 */

import { ThemeTokens } from './tokens';

/**
 * Internal enhanced theme interface
 */
export interface EnhancedTheme extends ThemeTokens {
    // Computed helper methods
    getSpacing: (key: keyof ThemeTokens['spacing']) => string;
    getColor: (path: string) => string;
    getTypography: (key: keyof ThemeTokens['typography']) => any;
    getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => string;

    // Backward compatibility
    primary: ThemeTokens['colors']['brand'];
    secondary: ThemeTokens['colors']['neutral'];
    success: string;
    warning: string;
    error: string;
    info: string;
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
    name: string;
    version: string;
    tokens: Partial<ThemeTokens>;
    extends?: string[];
    overrides?: Partial<ThemeTokens>;
}

/**
 * Composed theme interface
 */
export interface ComposedTheme {
    name: string;
    version: string;
    tokens: ThemeTokens;
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        extends: string[];
    };
}
