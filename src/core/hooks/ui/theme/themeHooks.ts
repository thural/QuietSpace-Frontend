/**
 * Theme System Hooks.
 *
 * Custom hooks for theme management, switching, and token access.
 * Provides clean separation of theme-related hook functionality.
 */

import { useContext } from 'react';
import { createContext } from 'react';

import type { EnhancedTheme } from '@/core/modules/theming/types/ProviderTypes';

// Define ThemeContextValue interface locally since we can't import it
export interface ThemeContextValue {
    theme: EnhancedTheme;
    currentVariant: string;
    setVariant: (variant: string) => void;
    availableVariants: string[];
}

// Create ThemeContext for export
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Hook for using enhanced theme context
 */
export const useEnhancedTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useEnhancedTheme must be used within EnhancedThemeProvider');
    }
    return context;
};

/**
 * Hook for theme switching
 */
export const useThemeSwitch = () => {
    const { currentVariant, setVariant, availableVariants } = useEnhancedTheme();

    return {
        currentVariant,
        availableVariants,
        switchTheme: setVariant,
        isDark: currentVariant === 'dark',
        isLight: currentVariant === 'light'
    };
};

/**
 * Hook for accessing theme tokens
 */
export const useThemeTokens = (): EnhancedTheme => {
    const { theme } = useEnhancedTheme();
    return theme;
};

/**
 * Backward compatibility hook
 */
export const useTheme = useThemeTokens;
