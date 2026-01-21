/**
 * Theme Migration Utilities.
 * 
 * Utilities to help migrate from legacy JSS theme to composable theme system.
 * Provides backward compatibility and migration helpers.
 */

import React from 'react';
import { useThemeTokens } from './EnhancedThemeProvider';
import { Colors, Typography, BaseTheme } from '../../shared/types/themeTypes';

/**
 * Legacy theme adapter for backward compatibility
 */
export const useLegacyThemeAdapter = (): BaseTheme => {
  const theme = useThemeTokens();

  return {
    // Map new theme structure to legacy interface
    colors: {
      background: theme.getColor('background.primary'),
      backgroundSecondary: theme.getColor('background.secondary'),
      backgroundTransparent: theme.getColor('background.overlay'),
      backgroundTransparentMax: 'rgba(255, 255, 255, 0)',
      backgroundMax: theme.getColor('background.primary'),
      text: theme.getColor('text.primary'),
      textSecondary: theme.getColor('text.secondary'),
      textMax: theme.getColor('text.inverse'),
      primary: theme.getColor('brand.500'),
      secondary: theme.getColor('neutral.500'),
      inputField: theme.getColor('background.secondary'),
      checkBox: theme.getColor('brand.500'),
      border: theme.getColor('border.light'),
      borderSecondary: theme.getColor('border.medium'),
      borderExtra: theme.getColor('border.dark'),
      danger: theme.getColor('semantic.error'),
      warning: theme.getColor('semantic.warning'),
      info: theme.getColor('semantic.info'),
      hrDivider: theme.getColor('border.light'),
      buttonBorder: theme.getColor('border.medium'),
      success: theme.getColor('semantic.success'),
      gradient: `linear-gradient(45deg, ${theme.getColor('brand.500')}, ${theme.getColor('brand.600')})`,
    },

    // Legacy spacing function
    spacing: (factor: number) => `${factor}rem`,

    // Map spacing tokens
    spacingFactor: {
      xs: 0.25,
      sm: 0.5,
      ms: 0.75,
      md: 1,
      lg: 1.25,
      xl: 1.5,
    },

    // Map breakpoints
    breakpoints: {
      xs: theme.breakpoints.xs,
      sm: theme.breakpoints.sm,
      ms: theme.breakpoints.md, // Map md to ms for legacy compatibility
      md: theme.breakpoints.md,
      lg: theme.breakpoints.lg,
      xl: theme.breakpoints.xl,
    },

    // Map radius tokens
    radius: {
      xs: theme.radius.sm,
      sm: theme.radius.md,
      ms: theme.radius.lg,
      md: theme.radius.lg,
      lg: theme.radius.xl,
      xl: theme.radius.xl,
      square: theme.radius.none,
      round: theme.radius.full,
    },

    // Map z-index
    zIndex: {
      modal: 1000,
      tooltip: 2000,
    },

    // Map transitions
    transitions: {
      default: `all ${theme.animation.duration.normal} ${theme.animation.easing.ease}`,
      fast: `all ${theme.animation.duration.fast} ${theme.animation.easing.ease}`,
    },

    // Map animations
    animations: {
      fadeIn: 'fade-in 0.5s ease-in-out',
      slideUp: 'slide-up 0.3s ease',
    },

    // Map keyframes
    keyframes: {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideUp: {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' },
      },
    },

    // Map shadows
    shadows: {
      light: theme.shadows.sm,
      medium: theme.shadows.md,
      dark: theme.shadows.lg,
      inset: theme.shadows.inner,
      paper: theme.shadows.md,
      extra: theme.shadows.xl,
      wide: theme.shadows['2xl'],
    },

    // Map typography
    typography: {
      fontFamily: theme.typography.fontFamily.sans.join(', '),
      fontSize: {
        primary: theme.typography.fontSize.base,
        secondary: theme.typography.fontSize.lg,
        small: theme.typography.fontSize.sm,
        large: theme.typography.fontSize.xl,
        xLarge: theme.typography.fontSize['2xl'],
      },
      fontWeightThin: parseInt(theme.typography.fontWeight.thin),
      fontWeightRegular: parseInt(theme.typography.fontWeight.normal),
      fontWeightBold: parseInt(theme.typography.fontWeight.bold),
      lineHeight: theme.typography.lineHeight.normal,
      h1: {
        fontSize: theme.typography.fontSize['3xl'],
        fontWeight: parseInt(theme.typography.fontWeight.bold)
      },
      h2: {
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: parseInt(theme.typography.fontWeight.semibold)
      },
      body1: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: parseInt(theme.typography.fontWeight.normal)
      },
      body2: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: parseInt(theme.typography.fontWeight.normal)
      },
    },
  };
};

/**
 * Color migration helper
 */
export const migrateColor = (legacyColor: keyof Colors, theme: ReturnType<typeof useThemeTokens>): string => {
  const colorMap: Record<keyof Colors, string> = {
    background: theme.getColor('background.primary'),
    backgroundSecondary: theme.getColor('background.secondary'),
    backgroundTransparent: theme.getColor('background.overlay'),
    backgroundTransparentMax: 'rgba(255, 255, 255, 0)',
    backgroundMax: theme.getColor('background.primary'),
    text: theme.getColor('text.primary'),
    textSecondary: theme.getColor('text.secondary'),
    textMax: theme.getColor('text.inverse'),
    primary: theme.getColor('brand.500'),
    secondary: theme.getColor('neutral.500'),
    inputField: theme.getColor('background.secondary'),
    checkBox: theme.getColor('brand.500'),
    border: theme.getColor('border.light'),
    borderSecondary: theme.getColor('border.medium'),
    borderExtra: theme.getColor('border.dark'),
    danger: theme.getColor('semantic.error'),
    warning: theme.getColor('semantic.warning'),
    info: theme.getColor('semantic.info'),
    hrDivider: theme.getColor('border.light'),
    buttonBorder: theme.getColor('border.medium'),
    success: theme.getColor('semantic.success'),
    gradient: `linear-gradient(45deg, ${theme.getColor('brand.500')}, ${theme.getColor('brand.600')})`,
  };

  return colorMap[legacyColor];
};

/**
 * Typography migration helper
 */
export const migrateTypography = (legacyTypography: keyof Typography, theme: ReturnType<typeof useThemeTokens>): any => {
  const typographyMap: Record<keyof Typography, any> = {
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    fontSize: theme.typography.fontSize,
    fontWeightThin: parseInt(theme.typography.fontWeight.thin),
    fontWeightRegular: parseInt(theme.typography.fontWeight.normal),
    fontWeightBold: parseInt(theme.typography.fontWeight.bold),
    lineHeight: theme.typography.lineHeight.normal,
    h1: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: parseInt(theme.typography.fontWeight.bold)
    },
    h2: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: parseInt(theme.typography.fontWeight.semibold)
    },
    body1: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: parseInt(theme.typography.fontWeight.normal)
    },
    body2: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: parseInt(theme.typography.fontWeight.normal)
    },
  };

  return typographyMap[legacyTypography];
};

/**
 * Spacing migration helper
 */
export const migrateSpacing = (legacySpacing: number | string, theme: ReturnType<typeof useThemeTokens>): string => {
  if (typeof legacySpacing === 'number') {
    return `${legacySpacing}rem`;
  }

  // Map legacy spacing keys to new theme
  const spacingMap: Record<string, string> = {
    xs: theme.spacing.xs,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
    xl: theme.spacing.xl,
  };

  return spacingMap[legacySpacing] || legacySpacing;
};

/**
 * Component migration helper
 */
export const createMigratedComponent = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  migrationFn: (props: T, theme: ReturnType<typeof useThemeTokens>) => T
) => {
  return (props: T) => {
    const theme = useThemeTokens();
    const migratedProps = migrationFn(props, theme);
    return React.createElement(Component, migratedProps);
  };
};
