/**
 * Enhanced App Shell with Composable Theme Integration.
 * 
 * Platform shell that fully utilizes the composable theme system.
 * Provides adaptive styling, responsive design, and theme-aware components.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { EnhancedThemeProvider, useEnhancedTheme, useThemeSwitch } from '../core/theme';
import { DisplayType } from './responsive/useResponsive';

export interface PlatformContextType {
  display: DisplayType;
  isMobile: boolean;
  isWide: boolean;
  theme: ReturnType<typeof useEnhancedTheme>;
  themeSwitch: ReturnType<typeof useThemeSwitch>;
  platform: 'mobile' | 'wide' | 'auto';
}

const PlatformContext = createContext<PlatformContextType | null>(null);

interface EnhancedAppShellProps {
  children: React.ReactNode;
  defaultThemeVariant?: string;
  platform?: 'mobile' | 'wide' | 'auto';
  themeOverrides?: any;
}

/**
 * Enhanced App Shell with full theme integration
 */
export const EnhancedAppShell: React.FC<EnhancedAppShellProps> = ({
  children,
  defaultThemeVariant = 'light',
  platform = 'auto',
  themeOverrides
}) => {
  const themeData = useEnhancedTheme();
  const themeSwitch = useThemeSwitch();
  
  // Enhanced responsive detection using theme breakpoints
  const display = useMemo((): DisplayType => {
    if (platform === 'mobile') return 'mobile';
    if (platform === 'wide') return 'wide';
    
    // Auto-detect using theme breakpoints
    const mobileBreakpoint = parseInt(themeData.theme.getBreakpoint('md'));
    return typeof window !== 'undefined' && window.innerWidth <= mobileBreakpoint ? 'mobile' : 'wide';
  }, [platform, themeData]);

  const contextValue = useMemo(() => ({
    display,
    isMobile: display === 'mobile',
    isWide: display === 'wide',
    theme: themeData,
    themeSwitch,
    platform,
  }), [display, themeData, themeSwitch, platform]);

  return (
    <PlatformContext.Provider value={contextValue}>
      <EnhancedThemeProvider defaultVariant={defaultThemeVariant} overrides={themeOverrides}>
        {children}
      </EnhancedThemeProvider>
    </PlatformContext.Provider>
  );
};

/**
 * Hook for accessing platform context
 */
export const usePlatformContext = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatformContext must be used within EnhancedAppShell');
  }
  return context;
};

/**
 * Hook for platform-aware styling
 */
export const usePlatformStyling = () => {
  const { display, theme } = usePlatformContext();
  
  return useMemo(() => ({
    // Platform-specific spacing
    getSpacing: (key: keyof typeof theme.theme.spacing) => {
      const baseSpacing = theme.theme.spacing[key];
      // Adjust spacing for mobile
      if (display === 'mobile') {
        const spacingMap: Record<string, string> = {
          'xs': '2px',
          'sm': '4px',
          'md': '8px',
          'lg': '12px',
          'xl': '16px',
          'xxl': '24px',
          '3xl': '32px',
          '4xl': '48px',
          '5xl': '64px',
          '6xl': '96px',
        };
        return spacingMap[key] || baseSpacing;
      }
      return baseSpacing;
    },
    
    // Platform-specific typography
    getTypography: (key: keyof typeof theme.theme.typography) => {
      const baseTypography = theme.theme.typography[key];
      if (display === 'mobile' && key === 'fontSize') {
        // Adjust font sizes for mobile
        const mobileFontSizes = {
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
        };
        return mobileFontSizes as any;
      }
      return baseTypography;
    },
    
    // Platform-specific breakpoints
    getBreakpoint: (key: keyof typeof theme.theme.breakpoints) => {
      return theme.theme.breakpoints[key];
    },
    
    // Responsive utilities
    isMobile: display === 'mobile',
    isWide: display === 'wide',
    
    // Theme-aware utilities
    getColor: (path: string) => theme.theme.getColor(path),
    getShadow: (key: keyof typeof theme.theme.shadows) => theme.theme.shadows[key],
    getRadius: (key: keyof typeof theme.theme.radius) => theme.theme.radius[key],
  }), [display, theme]);
};

/**
 * Hook for adaptive component props
 */
export const useAdaptiveProps = <T extends Record<string, any>>(
  mobileProps: Partial<T>,
  wideProps: Partial<T>,
  baseProps: T
) => {
  const { isMobile } = usePlatformContext();
  
  return useMemo(() => {
    if (isMobile) {
      return { ...baseProps, ...mobileProps };
    }
    return { ...baseProps, ...wideProps };
  }, [isMobile, mobileProps, wideProps, baseProps]);
};
