/**
 * Theme Tokens System.
 *
 * Atomic design tokens for maximum composability and maintainability.
 * Provides a foundation for theme composition and inheritance.
 *
 * Type definitions have been separated into domain-specific files for better organization.
 */

// Import separated token types
export type { ColorTokens } from './types/colorTokens';
export type { TypographyTokens } from './types/typographyTokens';
export type {
  SpacingTokens,
  ShadowTokens,
  BreakpointTokens,
  RadiusTokens,
  BorderTokens,
  SizeTokens
} from './types/layoutTokens';
export type { AnimationTokens } from './types/animationTokens';

// Import types for use in interface
import type { AnimationTokens } from './types/animationTokens';
import type { ColorTokens } from './types/colorTokens';
import type {
  SpacingTokens,
  ShadowTokens,
  BreakpointTokens,
  RadiusTokens,
  BorderTokens,
  SizeTokens
} from './types/layoutTokens';
import type { TypographyTokens } from './types/typographyTokens';

// Combined theme tokens interface
export interface ThemeTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
  breakpoints: BreakpointTokens;
  radius: RadiusTokens;
  border: BorderTokens;
  size: SizeTokens;
  animation: AnimationTokens;
}
