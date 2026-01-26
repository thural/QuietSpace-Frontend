/**
 * Theme System Black Box Index
 * 
 * Provides clean public API for the theme system following Black Box pattern.
 * Only interfaces, factory functions, and essential utilities are exported.
 * Implementation details and internal modules are properly hidden.
 */

// Public API - Clean interface for consumers
export {
  themeSystem,
  ThemeSystem
} from './public';

// Provider components - Clean API
export {
  ThemeProvider,
  EnhancedThemeProvider
} from './public';

// Hooks for React integration - Clean API
export {
  useEnhancedTheme,
  useThemeSwitch,
  useThemeTokens,
  useTheme
} from './public';

// Type exports for public API
export type {
  EnhancedTheme,
  ThemeProviderProps,
  ThemeSwitcher,
  ThemeContextValue
} from './public';

// Essential utilities - Clean API
export {
  createStyledComponent,
  media,
  animations
} from './public';

// Core theme tokens - Clean API
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

// Theme system interfaces - Clean API
export type {
  ColorPalette,
  SemanticColors,
  BackgroundColors,
  TextColors,
  BorderColors,
  ColorSystem,
  ColorUtilities,
  FontSize,
  FontWeight,
  LineHeight,
  FontFamily,
  TypographySystem,
  TypographyUtilities,
  Spacing,
  Shadow,
  Breakpoint,
  Radius,
  LayoutSystem,
  LayoutUtilities
} from './interfaces';

// Factory functions - Clean service creation
export {
  createTheme,
  createThemeWithVariant,
  createDefaultTheme,
  createCustomTheme
} from './factory';

// Legacy exports for backward compatibility (with underscore prefix)
export {
  Container as _Container,
  FlexContainer as _FlexContainer,
  GridContainer as _GridContainer,
  StyledButton as _StyledButton
} from './styledUtils';

// Legacy wildcard exports (deprecated - will be removed in next major version)
export * from './tokens';
export * from './composer';
export * from './variants';
export * from './enhancers/themeEnhancers';
export * from './styledUtils';
export * from './interfaces';

export type {
  ThemeConfig,
  ComposedTheme
} from './composer';
