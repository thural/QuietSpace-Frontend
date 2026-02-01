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

// Composer functions - Clean API
export {
  ThemeComposer,
  themeComposer
} from './composer';

// Variant functions - Clean API
export {
  getTheme,
  getThemeVariants,
  defaultTheme
} from './variants';

// Enhancer functions - Clean API
export {
  enhanceTheme
} from './enhancers/themeEnhancers';

// Configuration types - Clean API
export type {
  ThemeConfig,
  ComposedTheme
} from './composer';

// Legacy exports for backward compatibility (with underscore prefix)
// Note: UI components moved to legacy exports as they should be in separate UI module
export {
  Container as _Container,
  FlexContainer as _FlexContainer,
  GridContainer as _GridContainer,
  StyledButton as _StyledButton
} from './styledUtils';

// Module information
export const THEME_MODULE_VERSION = '1.0.0';
export const THEME_MODULE_INFO = {
  name: 'Enterprise Theme Module',
  version: THEME_MODULE_VERSION,
  description: 'Centralized theme management with enterprise patterns',
  deprecatedExports: [
    '_Container',
    '_FlexContainer',
    '_GridContainer',
    '_StyledButton'
  ],
  migrationGuide: 'Use UI library components instead of theme module UI components'
};
