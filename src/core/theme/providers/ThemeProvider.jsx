/**
 * Pure Theme Provider.
 * 
 * Clean React provider implementation separated from theme enhancement logic.
 * Focuses solely on React context and provider responsibilities.
 */

import React, { memo, useState } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { ThemeContext } from './ThemeContext.js';

// Import types via JSDoc typedefs
/**
 * @typedef {Object} ThemeProviderProps
 * @property {React.ReactNode} children - Child components
 * @property {string} [defaultVariant='light'] - Default theme variant
 * @property {Object} [overrides] - Theme overrides
 */

/**
 * @typedef {Object} EnhancedTheme
 * @property {string} variant - Current theme variant
 * @property {Object} colors - Theme colors
 * @property {string} colors.primary - Primary color
 * @property {string} colors.secondary - Secondary color
 * @property {string} colors.background - Background color
 * @property {string} colors.text - Text color
 * @property {Object} spacing - Theme spacing
 * @property {string} spacing.xs - Extra small spacing
 * @property {string} spacing.sm - Small spacing
 * @property {string} spacing.md - Medium spacing
 * @property {string} spacing.lg - Large spacing
 * @property {string} spacing.xl - Extra large spacing
 * @property {Object} breakpoints - Theme breakpoints
 * @property {string} breakpoints.mobile - Mobile breakpoint
 * @property {string} breakpoints.tablet - Tablet breakpoint
 * @property {string} breakpoints.desktop - Desktop breakpoint
 */

/**
 * Pure Theme Provider component
 * 
 * @param {ThemeProviderProps} props - Provider props
 * @returns {React.ReactElement} Theme provider component
 * @description Provides theme context to child components
 */
export const ThemeProvider = memo(({
  children,
  defaultVariant = 'light',
  overrides
}) => {
  const [currentVariant, setVariant] = useState(defaultVariant);

  // Create enhanced theme (simplified version for migration)
  const theme = {
    variant: currentVariant,
    colors: {
      primary: currentVariant === 'light' ? '#007bff' : '#0056b3',
      secondary: currentVariant === 'light' ? '#6c757d' : '#adb5bd',
      background: currentVariant === 'light' ? '#ffffff' : '#212529',
      text: currentVariant === 'light' ? '#212529' : '#ffffff'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px'
    },
    ...overrides
  };

  const contextValue = {
    theme,
    currentVariant,
    setVariant,
    availableVariants: ['light', 'dark']
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <SCThemeProvider theme={theme}>
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = 'ThemeProvider';

export default ThemeProvider;
