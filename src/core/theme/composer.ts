/**
 * Theme Composition System.
 * 
 * Composable theme system with inheritance, merging, and validation.
 * Supports theme variants, overrides, and composition patterns.
 */

import { ThemeTokens } from './tokens';

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
  private themes = new Map<string, ThemeConfig>();
  private composedThemes = new Map<string, ComposedTheme>();

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
      animation: { ...this.getDefaultTokens().animation, ...base.animation, ...override.animation },
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
      animation: { ...defaults.animation, ...tokens.animation },
    };
  }

  /**
   * Get default tokens
   */
  private getDefaultTokens(): ThemeTokens {
    return {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#155e75',
        },
        semantic: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          overlay: 'rgba(0, 0, 0, 0.75)',
        },
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          tertiary: '#9ca3af',
          inverse: '#ffffff',
        },
        border: {
          light: '#e5e7eb',
          medium: '#d1d5db',
          dark: '#4b5563',
        },
      },
      typography: {
        fontFamily: {
          sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
          mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Liberation Mono', 'Courier New', 'monospace'],
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          '6xl': '3.75rem',
        },
        fontWeight: {
          thin: '100',
          extralight: '200',
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800',
          black: '900',
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75',
          loose: '2',
        },
        letterSpacing: {
          tighter: '-0.05em',
          tight: '-0.025em',
          normal: '0',
          wide: '0.025em',
          wider: '0.05em',
          widest: '0.1em',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        '3xl': '64px',
        '4xl': '96px',
        '5xl': '128px',
        '6xl': '192px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      radius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      animation: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        easing: {
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
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
