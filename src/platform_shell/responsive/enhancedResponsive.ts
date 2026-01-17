/**
 * Enhanced Responsive System with Theme Integration.
 * 
 * Responsive utilities that integrate with the composable theme system.
 * Provides theme-aware breakpoints and responsive styling.
 */

import { useMemo } from 'react';
import { useThemeTokens } from '../../core/theme';

export type DisplayType = 'mobile' | 'wide';

/**
 * Enhanced responsive hook using theme breakpoints
 */
export const useEnhancedResponsive = (): DisplayType => {
  const theme = useThemeTokens();
  
  return useMemo(() => {
    if (typeof window === 'undefined') return 'mobile';
    
    const mobileBreakpoint = parseInt(theme.breakpoints.md);
    return window.innerWidth <= mobileBreakpoint ? 'mobile' : 'wide';
  }, [theme.breakpoints.md]);
};

/**
 * Theme-aware media query utilities
 */
export const createThemeMedia = (theme: ReturnType<typeof useThemeTokens>) => ({
  mobile: (styles: any) => `
    @media (max-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  wide: (styles: any) => `
    @media (min-width: ${parseInt(theme.breakpoints.md) + 1}px) {
      ${styles}
    }
  `,
  custom: (breakpoint: string, styles: any) => `
    @media (max-width: ${breakpoint}) {
      ${styles}
    }
  `,
  range: (min: string, max: string, styles: any) => `
    @media (min-width: ${min}) and (max-width: ${max}) {
      ${styles}
    }
  `,
});

/**
 * Hook for theme-aware responsive utilities
 */
export const useThemeResponsive = () => {
  const theme = useThemeTokens();
  const display = useEnhancedResponsive();
  
  return useMemo(() => ({
    display,
    isMobile: display === 'mobile',
    isWide: display === 'wide',
    
    // Theme-aware media queries
    media: createThemeMedia(theme),
    
    // Responsive spacing
    getResponsiveSpacing: (mobile: keyof typeof theme.spacing, wide: keyof typeof theme.spacing) => {
      return display === 'mobile' ? theme.spacing[mobile] : theme.spacing[wide];
    },
    
    // Responsive typography
    getResponsiveFontSize: (mobile: keyof typeof theme.typography.fontSize, wide: keyof typeof theme.typography.fontSize) => {
      return display === 'mobile' ? theme.typography.fontSize[mobile] : theme.typography.fontSize[wide];
    },
    
    // Responsive breakpoints
    breakpoints: theme.breakpoints,
    
    // Responsive utilities
    getBreakpointValue: (key: keyof typeof theme.breakpoints) => parseInt(theme.breakpoints[key]),
  }), [display, theme]);
};
