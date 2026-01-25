/**
 * Modern Theme System Index.
 * 
 * Enterprise-grade theme system with composable architecture.
 * Provides centralized access to tokens, variants, composer, and utilities.
 */

// Core theme system
export * from './tokens';
export * from './composer';
export * from './variants';
export * from './EnhancedThemeProvider';

// Application theme assets
export { colors } from './appColors';
export { typography } from './appTypography';

// Enhanced theme provider and hooks
export {
  EnhancedThemeProvider,
  useEnhancedTheme,
  useThemeSwitch,
  useThemeTokens,
  useTheme
} from './EnhancedThemeProvider';

// Performance utilities and styled components
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

// Type exports
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
