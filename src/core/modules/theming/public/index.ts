/**
 * Public Theme System API.
 *
 * Clean public interface for theme system consumers.
 * Internal implementation details are hidden.
 * 
 * NOTE: Provider components have been moved to @/shared/ui/components/providers
 */

// Core theme system
export { themeSystem, ThemeSystem } from '../ThemeSystem';

// Hooks for React integration
export {
    useEnhancedTheme,
    useThemeSwitch,
    useThemeTokens,
    useTheme
} from '../../../hooks/ui/theme';

// Type exports for public API
export type {
    EnhancedTheme,
    ThemeProviderProps,
    ThemeSwitcher,
    ThemeContextValue
} from '../types/ProviderTypes';

// Utility exports - Now re-exported from shared UI
export {
    createStyledComponent,
    media,
    animations
} from '../../../../shared/ui/utils';
