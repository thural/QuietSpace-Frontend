/**
 * Theme Enhancement Utilities.
 * 
 * Functions to enhance composed themes with computed values and backward compatibility.
 * Provides clean separation of theme enhancement logic from provider logic.
 */

/**
 * Enhances a composed theme with computed values and backward compatibility
 * @param {Object} composedTheme - Composed theme object
 * @returns {Object} Enhanced theme with computed values
 * @description Enhances a composed theme with computed values and backward compatibility
 */
export const enhanceTheme = (composedTheme) => {
    return {
        ...composedTheme.tokens,
        // Add computed theme values
        getSpacing: (key) => composedTheme.tokens.spacing[key],
        getColor: (path) => {
            const keys = path.split('.');
            return keys.reduce((obj, key) => obj?.[key], composedTheme.tokens.colors);
        },
        getTypography: (key) => composedTheme.tokens.typography[key],
        getBreakpoint: (key) => composedTheme.tokens.breakpoints[key],
        // Backward compatibility: map ColorTokens to flat structure
        primary: composedTheme.tokens.colors.brand,
        secondary: composedTheme.tokens.colors.neutral,
        success: composedTheme.tokens.colors.semantic.success,
        warning: composedTheme.tokens.colors.semantic.warning,
        error: composedTheme.tokens.colors.semantic.error,
        info: composedTheme.tokens.colors.semantic.info,
    };
};
