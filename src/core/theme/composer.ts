/**
 * Theme Composition System.
 *
 * Composable theme system with inheritance, merging, and validation.
 * Supports theme variants, overrides, and composition patterns.
 */

import { colors } from './appColors';
import { typography } from './appTypography';
import {
  baseSpacing,
  baseShadows,
  baseBreakpoints,
  baseRadius,
  baseAnimation
} from './baseTokens';

import type { ThemeTokens } from './tokens';

export interface ThemeConfig {
  name: string;
  version: string;
  tokens: Partial<ThemeTokens>;
  extends?: string[];
  overrides?: Partial<ThemeTokens>;
}

export interface ComposedTheme {
  name: string;
  version: string;
  tokens: ThemeTokens;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    extends: string[];
  };
}

/**
 * Theme Composer for creating composable themes
 */
export class ThemeComposer {
  private readonly themes = new Map<string, ThemeConfig>();
  private readonly composedThemes = new Map<string, ComposedTheme>();

  /**
   * Register a theme configuration
   */
  registerTheme(config: ThemeConfig): void {
    this.themes.set(config.name, config);
  }

  /**
   * Compose a theme with inheritance and overrides
   */
  composeTheme(name: string, overrides?: Partial<ThemeTokens>): ComposedTheme {
    const config = this.themes.get(name);
    if (!config) {
      throw new Error(`Theme "${name}" not found`);
    }

    // Check if already composed
    const cacheKey = `${name}-${JSON.stringify(overrides)}`;
    if (this.composedThemes.has(cacheKey)) {
      return this.composedThemes.get(cacheKey)!;
    }

    // Compose theme with inheritance
    const tokens = this.composeTokens(config, overrides);

    const composedTheme: ComposedTheme = {
      name: config.name,
      version: config.version,
      tokens,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        extends: config.extends || []
      }
    };

    this.composedThemes.set(cacheKey, composedTheme);
    return composedTheme;
  }

  /**
   * Compose tokens with inheritance and overrides
   */
  private composeTokens(config: ThemeConfig, overrides?: Partial<ThemeTokens>): ThemeTokens {
    let tokens = { ...config.tokens };

    // Apply inheritance
    if (config.extends) {
      for (const parentName of config.extends) {
        const parentConfig = this.themes.get(parentName);
        if (parentConfig) {
          tokens = this.mergeTokens(tokens, parentConfig.tokens);
        }
      }
    }

    // Apply overrides
    if (overrides) {
      tokens = this.mergeTokens(tokens, overrides);
    }

    // Apply config overrides
    if (config.overrides) {
      tokens = this.mergeTokens(tokens, config.overrides);
    }

    return this.validateTokens(tokens);
  }

  /**
   * Deep merge tokens with proper inheritance
   */
  private mergeTokens(base: Partial<ThemeTokens>, override: Partial<ThemeTokens>): ThemeTokens {
    return {
      colors: { ...this.getDefaultTokens().colors, ...base.colors, ...override.colors },
      typography: { ...this.getDefaultTokens().typography, ...base.typography, ...override.typography },
      spacing: { ...this.getDefaultTokens().spacing, ...base.spacing, ...override.spacing },
      shadows: { ...this.getDefaultTokens().shadows, ...base.shadows, ...override.shadows },
      breakpoints: { ...this.getDefaultTokens().breakpoints, ...base.breakpoints, ...override.breakpoints },
      radius: { ...this.getDefaultTokens().radius, ...base.radius, ...override.radius },
      animation: { ...this.getDefaultTokens().animation, ...base.animation, ...override.animation }
    };
  }

  /**
   * Validate tokens for completeness
   */
  private validateTokens(tokens: Partial<ThemeTokens>): ThemeTokens {
    const defaults = this.getDefaultTokens();

    // Ensure all required tokens are present
    return {
      colors: { ...defaults.colors, ...tokens.colors },
      typography: { ...defaults.typography, ...tokens.typography },
      spacing: { ...defaults.spacing, ...tokens.spacing },
      shadows: { ...defaults.shadows, ...tokens.shadows },
      breakpoints: { ...defaults.breakpoints, ...tokens.breakpoints },
      radius: { ...defaults.radius, ...tokens.radius },
      animation: { ...defaults.animation, ...tokens.animation }
    };
  }

  /**
   * Get default tokens
   */
  private getDefaultTokens(): ThemeTokens {
    return {
      colors: colors,
      typography: typography,
      spacing: baseSpacing,
      shadows: baseShadows,
      breakpoints: baseBreakpoints,
      radius: baseRadius,
      animation: baseAnimation
    };
  }

  /**
   * Get all registered themes
   */
  getRegisteredThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Get theme configuration
   */
  getThemeConfig(name: string): ThemeConfig | undefined {
    return this.themes.get(name);
  }
}

// Global theme composer instance
export const themeComposer = new ThemeComposer();
