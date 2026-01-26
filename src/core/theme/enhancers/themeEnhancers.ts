/**
 * Theme Enhancement Utilities.
 * 
 * Functions to enhance composed themes with computed values and backward compatibility.
 * Provides clean separation of theme enhancement logic from provider logic.
 */

import { ComposedTheme } from '../composer';
import { EnhancedTheme } from '../EnhancedThemeProvider';

/**
 * Enhances a composed theme with computed values and backward compatibility
 */
export const enhanceTheme = (composedTheme: ComposedTheme): EnhancedTheme => {
    return {
        ...composedTheme.tokens,
        // Add computed theme values
        getSpacing: (key: keyof typeof composedTheme.tokens.spacing) => composedTheme.tokens.spacing[key],
        getColor: (path: string) => {
            const keys = path.split('.');
            return keys.reduce((obj: any, key) => obj?.[key], composedTheme.tokens.colors);
        },
        getTypography: (key: keyof typeof composedTheme.tokens.typography) => composedTheme.tokens.typography[key],
        getBreakpoint: (key: keyof typeof composedTheme.tokens.breakpoints) => composedTheme.tokens.breakpoints[key],
        // Backward compatibility: map ColorTokens to flat structure
        primary: composedTheme.tokens.colors.brand,
        secondary: composedTheme.tokens.colors.neutral,
        success: composedTheme.tokens.colors.semantic.success,
        warning: composedTheme.tokens.colors.semantic.warning,
        error: composedTheme.tokens.colors.semantic.error,
        info: composedTheme.tokens.colors.semantic.info,
    } as EnhancedTheme;
};
