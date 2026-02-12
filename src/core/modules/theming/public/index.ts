/**
 * Public Theme System API.
 *
 * Clean public interface for theme system consumers.
 * Internal implementation details are hidden.
 */

// Core theme system
export { themeSystem, ThemeSystem } from '../ThemeSystem';

// Provider components
export {
    ThemeProvider,
    EnhancedThemeProvider
} from '../providers';

// Hooks for React integration
export {
    useEnhancedTheme,
    useThemeSwitch,
    useThemeTokens,
    useTheme
} from '@/core/hooks/ui/theme';

// Type exports for public API
export type {
    EnhancedTheme,
    ThemeProviderProps,
    ThemeSwitcher,
    ThemeContextValue
} from '../types/ProviderTypes';

// Utility exports
export {
    createStyledComponent,
    media,
    animations
} from '../styledUtils';
