/**
 * Theme Enhancement Hook.
 *
 * Pure theme enhancement logic separated from provider concerns.
 * Handles theme composition, enhancement, and computed values.
 */

import { useMemo } from 'react';

import { getTheme } from '../../../modules/theming/variants';
import { enhanceTheme } from '../../../modules/theming/enhancers/themeEnhancers';

import type { ThemeTokens } from '../../../modules/theming/tokens';
import type { EnhancedTheme } from '../../../modules/theming/types/ProviderTypes';

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
