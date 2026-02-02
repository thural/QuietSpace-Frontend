/**
 * Internal Theme Factory.
 *
 * Factory for creating theme instances with proper encapsulation.
 * Handles theme creation logic separated from composition.
 */

import type { ThemeTokens } from '../tokens';
import type { EnhancedTheme, ThemeConfig } from '../types';

import { colors } from '../../appColors';
import { typography } from '../../appTypography';
import {
    baseSpacing,
    baseShadows,
    baseBreakpoints,
    baseRadius,
    baseAnimation
} from '../../baseTokens';

/**
 * Theme Factory interface
 */
export interface IThemeFactory {
    createTheme(config: ThemeConfig): EnhancedTheme;
    createVariant(name: string, base: ThemeTokens, overrides?: Partial<ThemeTokens>): EnhancedTheme;
}

/**
 * Theme Factory implementation
 */
export class ThemeFactory implements IThemeFactory {
    /**
     * Create a theme from configuration
     */
    public createTheme(config: ThemeConfig): EnhancedTheme {
        const baseTokens = this.getDefaultTokens();
        const mergedTokens = this.mergeTokens(baseTokens, config.tokens);

        return this.createEnhancedTheme(mergedTokens);
    }

    /**
     * Create a theme variant
     */
    public createVariant(name: string, base: ThemeTokens, overrides?: Partial<ThemeTokens>): EnhancedTheme {
        const mergedTokens = this.mergeTokens(base, overrides);
        return this.createEnhancedTheme(mergedTokens);
    }

    /**
     * Get default theme tokens
     */
    private getDefaultTokens(): ThemeTokens {
        // Import from existing token system

        return {
            colors,
            typography,
            spacing: baseSpacing,
            shadows: baseShadows,
            breakpoints: baseBreakpoints,
            radius: baseRadius,
            animation: baseAnimation
        };
    }

    /**
     * Merge tokens with proper inheritance
     */
    private mergeTokens(base: ThemeTokens, override?: Partial<ThemeTokens>): ThemeTokens {
        if (!override) return base;

        return {
            colors: { ...base.colors, ...override.colors },
            typography: { ...base.typography, ...override.typography },
            spacing: { ...base.spacing, ...override.spacing },
            shadows: { ...base.shadows, ...override.shadows },
            breakpoints: { ...base.breakpoints, ...override.breakpoints },
            radius: { ...base.radius, ...override.radius },
            animation: { ...base.animation, ...override.animation }
        };
    }

    /**
     * Create enhanced theme with computed methods
     */
    private createEnhancedTheme(tokens: ThemeTokens): EnhancedTheme {
        return {
            ...tokens,
            getSpacing: (key: keyof ThemeTokens['spacing']) => tokens.spacing[key],
            getColor: (path: string) => this.getNestedValue(tokens.colors, path),
            getTypography: (key: keyof ThemeTokens['typography']) => tokens.typography[key],
            getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => tokens.breakpoints[key],

            // Backward compatibility
            primary: tokens.colors.brand,
            secondary: tokens.colors.neutral,
            success: tokens.colors.semantic?.success || '#10b981',
            warning: tokens.colors.semantic?.warning || '#f59e0b',
            error: tokens.colors.semantic?.error || '#ef4444',
            info: tokens.colors.semantic?.info || '#3b82f6'
        };
    }

    /**
     * Get nested value from object path
     */
    private getNestedValue(obj: unknown, path: string): string {
        return path.split('.').reduce((current: unknown, key: string) => {
            if (current && typeof current === 'object' && key in current) {
                return (current as Record<string, unknown>)[key];
            }
            return undefined;
        }, obj) as string || '';
    }
}
