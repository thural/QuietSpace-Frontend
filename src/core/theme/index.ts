/**
 * Modern Theme System Index.
 * 
 * Enterprise-grade theme system with complete isolation of concerns.
 * Provides clean, modular access to all theme functionality.
 */

// Public API - Clean interface for consumers
export * from './public';

// Core theme tokens and composition
export * from './tokens';
export * from './composer';
export * from './variants';

// Application theme assets
export { colors } from './appColors';
export { typography } from './appTypography';
export * from './baseTokens';

// Theme enhancers
export * from './enhancers/themeEnhancers';

// Performance utilities and styled components
export {
  createStyledComponent,
  media,
  animations,
  Container,
  FlexContainer,
  GridContainer,
  useResponsiveStyles,
  StyledButton,
} from './styledUtils';

// Segregated interfaces for better modularity
export * from './interfaces';

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
  ThemeConfig,
  ComposedTheme
} from './composer';
