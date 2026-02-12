/**
 * UI Hooks - Theme Integration
 *
 * Provides theme-related React hooks for UI components:
 * - Theme switching and management
 * - Theme token access
 * - Responsive styling utilities
 * - Theme enhancement functionality
 */

export {
  useEnhancedTheme,
  useThemeSwitch,
  useThemeTokens,
  useTheme
} from './themeHooks';

export { useResponsiveStyles } from './utilityHooks';

export { useThemeEnhancement } from './useThemeEnhancement';

export type {
  ThemeContextValue,
  EnhancedTheme,
  ThemeTokens
} from './themeHooks';

export type { ThemeEnhancer } from './useThemeEnhancement';
