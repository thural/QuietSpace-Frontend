/**
 * Theme Context Definitions.
 *
 * Pure context definitions separated from provider logic.
 * Provides clean interface segregation for theme context.
 */

import { createContext } from 'react';

import type { EnhancedTheme } from '../types/ProviderTypes';

/**
 * Theme context interface
 */
export interface ThemeContextValue {
    theme: EnhancedTheme;
    currentVariant: string;
    setVariant: (variant: string) => void;
    availableVariants: string[];
}

/**
 * React context for theme
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Context display name for debugging
 */
ThemeContext.displayName = 'ThemeContext';
