/**
 * Enhanced Theme Provider.
 * 
 * Backward compatibility provider that combines pure provider with additional features.
 * Maintains existing API while using new modular architecture internally.
 */

import { ThemeProvider } from './ThemeProvider.js';

/**
 * Enhanced Theme Provider with backward compatibility
 * @type {React.ComponentType}
 * @description Enhanced theme provider component
 */
export const EnhancedThemeProvider = ThemeProvider;

// Re-export for backward compatibility
export { ThemeContext } from './ThemeContext.js';
