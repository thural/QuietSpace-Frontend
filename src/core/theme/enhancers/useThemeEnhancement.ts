/**
 * Theme Enhancement Hook.
 * 
 * Pure theme enhancement logic separated from provider concerns.
 * Handles theme composition, enhancement, and computed values.
 */

import { useMemo } from 'react';
import { ThemeTokens } from '../tokens';
import { getTheme } from '../variants';
import { enhanceTheme } from './themeEnhancers';
import { EnhancedTheme } from '../types/ProviderTypes';

/**
 * Theme enhancement hook interface
 */
export interface ThemeEnhancer {
    createEnhancedTheme: (variant: string, overrides?: Partial<ThemeTokens>) => EnhancedTheme;
}

/**
 * Hook for theme enhancement functionality
 */
export const useThemeEnhancement = (): ThemeEnhancer => {
    const createEnhancedTheme = useMemo(() => {
        return (variant: string, overrides?: Partial<ThemeTokens>): EnhancedTheme => {
            const composedTheme = getTheme(variant, overrides);
            return enhanceTheme(composedTheme);
        };
    }, []);

    return {
        createEnhancedTheme
    };
};
