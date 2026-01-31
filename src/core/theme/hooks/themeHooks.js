/**
 * Theme System Hooks.
 * 
 * Custom hooks for theme management, switching, and token access.
 * Provides clean separation of theme-related hook functionality.
 */

import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeContext.js';

/**
 * Hook for using enhanced theme context
 * @returns {Object} Theme context value
 * @description Returns the enhanced theme context value
 */
export const useEnhancedTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useEnhancedTheme must be used within EnhancedThemeProvider');
    }
    return context;
};

/**
 * Hook for theme switching
 * @returns {Object} Theme switching utilities
 * @description Returns theme switching utilities and state
 */
export const useThemeSwitch = () => {
    const { currentVariant, setVariant, availableVariants } = useEnhancedTheme();

    return {
        currentVariant,
        availableVariants,
        switchTheme: setVariant,
        isDark: currentVariant === 'dark',
        isLight: currentVariant === 'light',
    };
};

/**
 * Hook for accessing theme tokens
 * @returns {Object} Enhanced theme tokens
 * @description Returns the enhanced theme tokens
 */
export const useThemeTokens = () => {
    const { theme } = useEnhancedTheme();
    return theme;
};

/**
 * Backward compatibility hook
 * @type {Function} useThemeTokens
 * @description Backward compatibility hook for theme tokens
 */
export const useTheme = useThemeTokens;
