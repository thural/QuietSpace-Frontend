/**
 * Provider-Specific Type Definitions.
 *
 * Types specifically for theme provider and context functionality.
 * Separated from core theme tokens for better modularity.
 */

import type { ThemeTokens } from '../tokens';

/**
 * Enhanced theme interface with computed values
 */
export interface EnhancedTheme extends ThemeTokens {
    // Computed helper methods
    getSpacing: (key: keyof ThemeTokens['spacing']) => string;
    getColor: (path: string) => string;
    getTypography: (key: keyof ThemeTokens['typography']) => any;
    getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => string;

    // Backward compatibility: flat color structure
    primary: ThemeTokens['colors']['brand'];
    secondary: ThemeTokens['colors']['neutral'];
    success: string;
    warning: string;
    error: string;
    info: string;
}

/**
 * Theme provider props interface
 */
export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultVariant?: string;
    overrides?: Partial<ThemeTokens>;
}

/**
 * Theme switcher interface
 */
export interface ThemeSwitcher {
    currentVariant: string;
    availableVariants: string[];
    switchTheme: (variant: string) => void;
    isDark: boolean;
    isLight: boolean;
}

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
    theme: EnhancedTheme;
    currentVariant: string;
    setVariant: (variant: string) => void;
    availableVariants: string[];
}
