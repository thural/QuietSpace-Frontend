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

export interface EnhancedTheme extends ThemeTokens {
  // Add any computed theme values here
  getSpacing: (key: keyof ThemeTokens['spacing']) => string;
  getColor: (path: string) => string;
  getTypography: (key: keyof ThemeTokens['typography']) => any;
  getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => string;
  // Backward compatibility: flat color structure
  primary: ThemeTokens['colors']['brand'];
  secondary: ThemeTokens['colors']['neutral'];
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const ThemeContext = createContext<{
  theme: EnhancedTheme;
  currentVariant: string;
  setVariant: (variant: string) => void;
  availableVariants: string[];
} | null>(null);

interface EnhancedThemeProviderProps {
  children: React.ReactNode;
  defaultVariant?: string;
  overrides?: Partial<ThemeTokens>;
}

/**
 * Enhanced Theme Provider with composable theme support
 */
export const EnhancedThemeProvider = memo<EnhancedThemeProviderProps>(({
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
