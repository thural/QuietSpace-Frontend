/**
 * Utility Hooks.
 * 
 * Custom hooks for theme utilities and responsive styles.
 * Provides clean separation of utility hook logic.
 */

import { useMemo } from 'react';
import { useTheme } from './themeHooks.js';

/**
 * Hook for creating responsive styles
 * @returns {Object} Responsive style utilities
 * @description Returns utilities for responsive styling
 */
export const useResponsiveStyles = () => {
    const theme = useTheme();

    return useMemo(() => ({
        getSpacing: (key) => theme.spacing[key],
        getColor: (colorPath) => {
            const keys = colorPath.split('.');
            return keys.reduce((obj, key) => obj?.[key], theme.colors);
        },
        getTypography: (key) => theme.typography[key],
        getBreakpoint: (key) => theme.breakpoints[key],
    }), [theme]);
};
