/**
 * Theme Enhancement Hook.
 * 
 * Pure theme enhancement logic separated from provider concerns.
 * Handles theme composition, enhancement, and computed values.
 */

import { useMemo } from 'react';
import { getTheme } from '../variants.js';
import { enhanceTheme } from './themeEnhancers.js';

/**
 * Theme enhancement hook interface
 * @interface ThemeEnhancer
 * @description Defines the interface for theme enhancer
 */
export class ThemeEnhancer {
  /**
   * @param {Function} createEnhancedTheme - Function to create enhanced theme
   */
  constructor(createEnhancedTheme) {
    this.createEnhancedTheme = createEnhancedTheme;
  }

  /** @type {Function} Function to create enhanced theme */
  createEnhancedTheme;
}

/**
 * Hook for theme enhancement functionality
 * @returns {ThemeEnhancer} Theme enhancer instance
 * @description Hook for theme enhancement functionality
 */
export const useThemeEnhancement = () => {
    const createEnhancedTheme = useMemo(() => {
        return (variant, overrides) => {
            const composedTheme = getTheme(variant, overrides);
            return enhanceTheme(composedTheme);
        };
    }, []);

    return {
        createEnhancedTheme
    };
};
