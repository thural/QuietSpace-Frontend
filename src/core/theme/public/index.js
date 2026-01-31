/**
 * Public Theme System API.
 * 
 * Clean public interface for theme system consumers.
 * Internal implementation details are hidden.
 */

// Core theme system
export { themeSystem, ThemeSystem } from '../ThemeSystem.js';

// Provider components
export {
    ThemeProvider,
    EnhancedThemeProvider
} from '../providers/index.js';

// Hooks for React integration
export {
    useEnhancedTheme,
    useThemeSwitch,
    useThemeTokens,
    useTheme
} from '../hooks/themeHooks.js';

// Utility exports
export {
    createStyledComponent,
    media,
    animations
} from '../styledUtils.js';
