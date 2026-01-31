/**
 * Theme Context Definitions.
 * 
 * Pure context definitions separated from provider logic.
 * Provides clean interface segregation for theme context.
 */

import { createContext } from 'react';

/**
 * Theme context interface
 * @interface ThemeContextValue
 * @description Defines the structure for theme context value
 */
export class ThemeContextValue {
  /**
   * @param {Object} theme - Enhanced theme object
   * @param {string} currentVariant - Current theme variant
   * @param {Function} setVariant - Function to set theme variant
   * @param {Array.<string>} availableVariants - Available theme variants
   */
  constructor(theme, currentVariant, setVariant, availableVariants) {
    this.theme = theme;
    this.currentVariant = currentVariant;
    this.setVariant = setVariant;
    this.availableVariants = availableVariants;
  }

  /** @type {Object} Enhanced theme object */
  theme;

  /** @type {string} Current theme variant */
  currentVariant;

  /** @type {Function} Function to set theme variant */
  setVariant;

  /** @type {Array.<string>} Available theme variants */
  availableVariants;
}

/**
 * React context for theme
 * @type {React.Context<ThemeContextValue|null>}
 * @description React context for theme management
 */
export const ThemeContext = createContext(null);

/**
 * Context display name for debugging
 * @type {string}
 * @description Display name for debugging purposes
 */
ThemeContext.displayName = 'ThemeContext';
