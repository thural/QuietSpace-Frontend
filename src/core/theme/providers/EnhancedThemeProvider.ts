/**
 * Enhanced Theme Provider.
 * 
 * Backward compatibility provider that combines pure provider with additional features.
 * Maintains existing API while using new modular architecture internally.
 */

import { ThemeProvider } from './ThemeProvider';

/**
 * Enhanced Theme Provider with backward compatibility
 */
export const EnhancedThemeProvider = ThemeProvider;

// Re-export types for backward compatibility
export type { EnhancedTheme, ThemeProviderProps as EnhancedThemeProviderProps } from '../types/ProviderTypes';
export { ThemeContext } from './ThemeContext';

