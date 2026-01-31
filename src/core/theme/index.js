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
} from './public.js';

// Provider components - Clean API
export {
  ThemeProvider,
  EnhancedThemeProvider
} from './public.js';

// Hooks for React integration - Clean API
export {
  useEnhancedTheme,
  useThemeSwitch,
  useThemeTokens,
  useTheme
} from './public.js';

// Essential utilities - Clean API
export {
  createStyledComponent,
  media,
  animations
} from './public.js';

// Core theme tokens - Clean API
export {
  ThemeTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  ShadowTokens,
  BreakpointTokens,
  RadiusTokens,
  AnimationTokens
} from './tokens.js';

// Theme system interfaces - Clean API
export {
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
} from './interfaces/index.js';

// Factory functions - Clean service creation
export {
  createTheme,
  createThemeWithVariant,
  createDefaultTheme,
  createCustomTheme
} from './factory.js';

// Composer functions - Clean API
export {
  ThemeComposer,
  themeComposer
} from './composer.js';

// Variant functions - Clean API
export {
  getTheme,
  getThemeVariants,
  defaultTheme
} from './variants.js';

// Enhancer functions - Clean API
export {
  enhanceTheme
} from './enhancers/themeEnhancers.js';

// Legacy exports for backward compatibility (with underscore prefix)
// Note: UI components moved to legacy exports as they should be in separate UI module
export {
  Container as _Container,
  FlexContainer as _FlexContainer,
  GridContainer as _GridContainer,
  StyledButton as _StyledButton
} from './styledUtils.js';

// Module information
export const THEME_MODULE_VERSION = '1.0.0';
export const THEME_MODULE_INFO = Object.freeze({
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
});
