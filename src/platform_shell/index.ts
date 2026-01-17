/**
 * Platform Shell Module Index.
 * 
 * Barrel exports for all platform-specific components and utilities.
 * Provides centralized access to mobile, wide, and responsive systems.
 */

// Legacy Responsive (for backward compatibility)
export { useResponsive } from './responsive/useResponsive';
export { ResponsiveProvider, useResponsiveContext } from './responsive/useResponsive';
export { breakpoints } from './responsive/breakpoints';

// Enhanced Theme-Integrated Platform Shell
export { EnhancedAppShell, usePlatformContext, usePlatformStyling, useAdaptiveProps } from './EnhancedAppShell';
export { useEnhancedResponsive, useThemeResponsive, createThemeMedia } from './responsive/enhancedResponsive';
export { ThemeContainer, ThemeFlexContainer, ThemeGridContainer, ThemeText, ThemeButton } from './components/ThemeComponents';
