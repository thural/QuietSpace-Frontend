/**
 * Pure Theme Provider.
 *
 * Clean React provider implementation separated from theme enhancement logic.
 * Focuses solely on React context and provider responsibilities.
 */

import { memo, useState } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import { useThemeEnhancement } from '@/core/hooks/ui/theme';

import { ThemeContext } from '@/core/hooks/ui/theme/themeHooks';

import type { ThemeProviderProps } from '@/core/modules/theming/types/ProviderTypes';



/**
 * Pure Theme Provider component
 */
export const ThemeProvider = memo<ThemeProviderProps>(({
    children,
    defaultVariant = 'light',
    overrides
}) => {
    const [currentVariant, setVariant] = useState(defaultVariant);

    // Use theme enhancement hook for theme creation
    const { createEnhancedTheme } = useThemeEnhancement();
    const theme = createEnhancedTheme(currentVariant, overrides);

    const contextValue = {
        theme,
        currentVariant,
        setVariant,
        availableVariants: ['light', 'dark', 'high-contrast', 'mobile-first', 'accessibility', 'brand']
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <EmotionThemeProvider theme={theme}>
                {children}
            </EmotionThemeProvider>
        </ThemeContext.Provider>
    );
});

ThemeProvider.displayName = 'ThemeProvider';
