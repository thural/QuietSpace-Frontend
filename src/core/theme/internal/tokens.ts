/**
 * Internal Token System.
 * 
 * Re-exports existing token system for internal use.
 * Maintains separation between public and internal APIs.
 */

// Re-export from existing token system
export type { ThemeTokens } from '../tokens';
export type {
    ColorTokens,
    TypographyTokens,
    SpacingTokens,
    ShadowTokens,
    BreakpointTokens,
    RadiusTokens,
    AnimationTokens
} from '../tokens';
