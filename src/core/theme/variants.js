/**
 * Theme Variants System.
 * 
 * Pre-defined theme variants for common use cases.
 * Supports light, dark, and custom themes with composition.
 */

import { themeComposer } from './composer.js';
import { colors } from './appColors.js';
import { typography } from './appTypography.js';
import {
  baseShadows,
  baseSpacing,
  baseBreakpoints,
  baseRadius,
  baseAnimation
} from './baseTokens.js';

/**
 * Light theme variant
 */
themeComposer.registerTheme({
  name: 'light',
  version: '1.0.0',
  tokens: {
    colors: colors,
    typography: typography,
    spacing: baseSpacing,
    shadows: baseShadows,
    breakpoints: baseBreakpoints,
    radius: baseRadius,
    animation: baseAnimation,
  },
});

/**
 * Dark theme variant
 */
themeComposer.registerTheme({
  name: 'dark',
  version: '1.0.0',
  tokens: {
    colors: {
      ...colors,
      brand: {
        50: '#0c4a6e',
        100: '#075985',
        200: '#0369a1',
        300: '#0284c7',
        400: '#0ea5e9',
        500: '#38bdf8',
        600: '#7dd3fc',
        700: '#bae6fd',
        800: '#e0f2fe',
        900: '#f0f9ff',
        950: '#f0f9ff',
      },
      neutral: {
        50: '#030712',
        100: '#111827',
        200: '#1f2937',
        300: '#374151',
        400: '#4b5563',
        500: '#6b7280',
        600: '#9ca3af',
        700: '#d1d5db',
        800: '#e5e7eb',
        900: '#f3f4f6',
        950: '#f9fafb',
      },
      background: {
        primary: '#111827',
        secondary: '#1f2937',
        tertiary: '#374151',
        overlay: 'rgba(0, 0, 0, 0.85)',
        transparent: 'transparent',
      },
      text: {
        primary: '#f9fafb',
        secondary: '#d1d5db',
        tertiary: '#9ca3af',
        inverse: '#111827',
      },
      border: {
        light: '#374151',
        medium: '#4b5563',
        dark: '#6b7280',
      },
    },
    typography: typography,
    spacing: baseSpacing,
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    },
    breakpoints: baseBreakpoints,
    radius: baseRadius,
    animation: baseAnimation,
  },
});

/**
 * High contrast theme variant
 */
themeComposer.registerTheme({
  name: 'high-contrast',
  version: '1.0.0',
  extends: ['light'],
  tokens: {
    colors: {
      ...colors,
      brand: {
        50: '#000000',
        100: '#000000',
        200: '#000000',
        300: '#000000',
        400: '#000000',
        500: '#000000',
        600: '#000000',
        700: '#000000',
        800: '#000000',
        900: '#000000',
        950: '#000000',
      },
      semantic: {
        success: '#000000',
        warning: '#000000',
        error: '#000000',
        info: '#000000',
      },
      neutral: {
        50: '#ffffff',
        100: '#ffffff',
        200: '#ffffff',
        300: '#ffffff',
        400: '#ffffff',
        500: '#ffffff',
        600: '#ffffff',
        700: '#ffffff',
        800: '#ffffff',
        900: '#ffffff',
        950: '#ffffff',
      },
      background: {
        primary: '#ffffff',
        secondary: '#ffffff',
        tertiary: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.9)',
        transparent: 'transparent',
      },
      text: {
        primary: '#000000',
        secondary: '#000000',
        tertiary: '#000000',
        inverse: '#ffffff',
      },
      border: {
        light: '#000000',
        medium: '#000000',
        dark: '#000000',
      },
    },
    typography: typography,
    spacing: baseSpacing,
    shadows: baseShadows,
    breakpoints: baseBreakpoints,
    radius: baseRadius,
    animation: baseAnimation,
  },
});

/**
 * Mobile-first theme variant
 */
themeComposer.registerTheme({
  name: 'mobile-first',
  version: '1.0.0',
  extends: ['light'],
  tokens: {
    colors: colors,
    typography: {
      ...typography,
      fontSize: {
        xs: '0.625rem',
        sm: '0.75rem',
        base: '0.875rem',
        lg: '1rem',
        xl: '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '1.875rem',
        '5xl': '2.25rem',
        '6xl': '3rem',
      },
    },
    spacing: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
      xxl: '32px',
      '3xl': '48px',
      '4xl': '64px',
      '5xl': '96px',
      '6xl': '128px',
    },
    shadows: baseShadows,
    breakpoints: baseBreakpoints,
    radius: baseRadius,
    animation: baseAnimation,
  },
});

/**
 * Accessibility theme variant
 */
themeComposer.registerTheme({
  name: 'accessibility',
  version: '1.0.0',
  extends: ['light'],
  tokens: {
    colors: colors,
    typography: {
      ...typography,
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '3rem',
        '5xl': '3.75rem',
        '6xl': '4.5rem',
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '500',
        medium: '600',
        semibold: '700',
        bold: '800',
        extrabold: '900',
        black: '900',
      },
    },
    spacing: {
      xs: '6px',
      sm: '12px',
      md: '24px',
      lg: '36px',
      xl: '48px',
      xxl: '72px',
      '3xl': '96px',
      '4xl': '144px',
      '5xl': '192px',
      '6xl': '288px',
    },
    shadows: baseShadows,
    breakpoints: baseBreakpoints,
    radius: baseRadius,
    animation: baseAnimation,
  },
});

/**
 * Brand theme variant
 */
themeComposer.registerTheme({
  name: 'brand',
  version: '1.0.0',
  extends: ['light'],
  tokens: {
    colors: colors,
    typography: typography,
    spacing: baseSpacing,
    shadows: baseShadows,
    breakpoints: baseBreakpoints,
    radius: baseRadius,
    animation: baseAnimation,
  },
});

/**
 * Get composed theme by name
 * @param {string} name - Theme name
 * @param {Object} overrides - Optional token overrides
 * @returns {Object} Composed theme
 */
export const getTheme = (name, overrides) => {
  return themeComposer.composeTheme(name, overrides);
};

/**
 * Get available theme variants
 * @returns {Array.<string>} Array of theme names
 */
export const getThemeVariants = () => {
  return themeComposer.getRegisteredThemes();
};

/**
 * Default theme
 * @type {Object} Default light theme
 */
export const defaultTheme = getTheme('light');
