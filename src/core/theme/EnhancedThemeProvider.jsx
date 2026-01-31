/**
 * Enhanced Theme Provider.
 * 
 * Composable theme provider with variant support and performance optimizations.
 * Supports theme inheritance, composition, and runtime theme switching.
 */

import React, { createContext, useContext, useMemo, memo, useState } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { ThemeTokens } from './tokens';
import { getTheme, getThemeVariants } from './variants';
import { enhanceTheme } from './enhancers/themeEnhancers';

/**
 * Enhanced theme interface
 * @typedef {Object} EnhancedTheme
 * @property {Object} spacing - Theme spacing tokens
 * @property {Object} colors - Theme color tokens
 * @property {Object} typography - Theme typography tokens
 * @property {Object} breakpoints - Theme breakpoint tokens
 * @property {Function} getSpacing - Get spacing value by key
 * @property {Function} getColor - Get color value by path
 * @property {Function} getTypography - Get typography value by key
 * @property {Function} getBreakpoint - Get breakpoint value by key
 * @property {Object} primary - Primary color (backward compatibility)
 * @property {Object} secondary - Secondary color (backward compatibility)
 * @property {string} success - Success color
 * @property {string} warning - Warning color
 * @property {string} error - Error color
 * @property {string} info - Info color
 */

export const ThemeContext = createContext(null);

/**
 * Enhanced Theme Provider with composable theme support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.defaultVariant='light'] - Default theme variant
 * @param {Partial<ThemeTokens>} [props.overrides] - Theme overrides
 * @returns {React.ReactElement} Enhanced theme provider component
 */
export const EnhancedThemeProvider = memo(({
  children,
  defaultVariant = 'light',
  overrides
}) => {
  const [currentVariant, setVariant] = useState(defaultVariant);

  const memoizedTheme = useMemo(() => {
    const composedTheme = getTheme(currentVariant, overrides);
    return enhanceTheme(composedTheme);
  }, [currentVariant, overrides]);

  const contextValue = useMemo(() => ({
    theme: memoizedTheme,
    currentVariant,
    setVariant,
    availableVariants: getThemeVariants(),
  }), [memoizedTheme, currentVariant]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <SCThemeProvider theme={memoizedTheme}>
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  );
});

EnhancedThemeProvider.displayName = 'EnhancedThemeProvider';
