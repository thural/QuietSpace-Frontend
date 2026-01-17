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

const ThemeContext = createContext<{
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
    
    return {
      ...composedTheme.tokens,
      // Add computed theme values
      getSpacing: (key: keyof ThemeTokens['spacing']) => composedTheme.tokens.spacing[key],
      getColor: (path: string) => {
        const keys = path.split('.');
        return keys.reduce((obj: any, key) => obj?.[key], composedTheme.tokens.colors);
      },
      getTypography: (key: keyof ThemeTokens['typography']) => composedTheme.tokens.typography[key],
      getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => composedTheme.tokens.breakpoints[key],
      // Backward compatibility: map ColorTokens to flat structure
      primary: composedTheme.tokens.colors.brand,
      secondary: composedTheme.tokens.colors.neutral,
      success: composedTheme.tokens.colors.semantic.success,
      warning: composedTheme.tokens.colors.semantic.warning,
      error: composedTheme.tokens.colors.semantic.error,
      info: composedTheme.tokens.colors.semantic.info,
    } as EnhancedTheme;
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

/**
 * Hook for using enhanced theme context
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
 */
export const useThemeTokens = (): EnhancedTheme => {
  const { theme } = useEnhancedTheme();
  return theme;
};

/**
 * Backward compatibility hook
 */
export const useTheme = useThemeTokens;
