/**
 * Utility Hooks.
 *
 * Custom hooks for theme utilities and responsive styles.
 * Provides clean separation of utility hook logic.
 */

import { useMemo } from 'react';

import { useTheme } from './themeHooks';

/**
 * Hook for creating responsive styles
 */
export const useResponsiveStyles = () => {
    const theme = useTheme();

    return useMemo(() => ({
        getSpacing: (key: keyof typeof theme.spacing) => theme.spacing[key],
        getColor: (colorPath: string) => {
            const keys = colorPath.split('.');
            return keys.reduce((obj: unknown, key) => (obj as Record<string, unknown>)?.[key], theme.colors);
        },
        getTypography: (key: keyof typeof theme.typography) => theme.typography[key],
        getBreakpoint: (key: keyof typeof theme.breakpoints) => theme.breakpoints[key]
    }), [theme]);
};
