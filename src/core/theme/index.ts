/**
 * Enhanced Theme System Index.
 * 
 * Barrel exports for all theme-related components with composable architecture.
 * Provides centralized access to tokens, variants, composer, and utilities.
 */

// Legacy exports for backward compatibility (deprecated)
export { colors } from './appColors';
export { typography } from './appTypography';
export { ThemeProvider as LegacyThemeProvider, useTheme as useLegacyTheme } from './ThemeProvider';

// New composable theme system (recommended)
export * from './tokens';
export * from './composer';
export * from './variants';
export * from './EnhancedThemeProvider';

// Enhanced theme provider (recommended)
export { 
  EnhancedThemeProvider,
  useEnhancedTheme,
  useThemeSwitch,
  useThemeTokens,
  useTheme
} from './EnhancedThemeProvider';

// Performance utilities (updated for new system)
export { 
  createStyledComponent, 
  media, 
  animations, 
  Container, 
  FlexContainer, 
  GridContainer, 
  useResponsiveStyles, 
  StyledButton 
} from './styledUtils';

// Re-export commonly used types
export type { 
  ThemeTokens, 
  ColorTokens, 
  TypographyTokens, 
  SpacingTokens, 
  ShadowTokens, 
  BreakpointTokens, 
  RadiusTokens, 
  AnimationTokens 
} from './tokens';

export type { 
  EnhancedTheme
} from './EnhancedThemeProvider';

export type { 
  ThemeConfig,
  ComposedTheme
} from './composer';
