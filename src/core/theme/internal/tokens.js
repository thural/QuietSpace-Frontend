/**
 * Internal Token System.
 * 
 * Re-exports existing token system for internal use.
 * Maintains separation between public and internal APIs.
 */

// Re-export from existing token system
export {
  ThemeTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  ShadowTokens,
  BreakpointTokens,
  RadiusTokens,
  AnimationTokens
} from '../tokens.js';
