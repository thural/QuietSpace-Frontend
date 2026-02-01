/**
 * Internal Theme Enhancer.
 *
 * Handles theme enhancement and computed value logic.
 * Separated from composition and factory concerns.
 */

import type { ThemeTokens } from '../tokens';
import type { EnhancedTheme, ComposedTheme } from '../types';

/**
 * Theme Enhancer interface
 */
export interface IThemeEnhancer {
    enhance(theme: ComposedTheme): EnhancedTheme;
    addUtilities(theme: EnhancedTheme): EnhancedTheme;
}

/**
 * Theme Enhancer implementation
 */
export class ThemeEnhancer implements IThemeEnhancer {
    /**
     * Enhance a composed theme with computed values and utilities
     */
    public enhance(theme: ComposedTheme): EnhancedTheme {
        let enhancedTheme: EnhancedTheme = {
            ...theme.tokens,
            getSpacing: (key: keyof ThemeTokens['spacing']) => theme.tokens.spacing[key],
            getColor: (path: string) => this.getNestedValue(theme.tokens.colors, path),
            getTypography: (key: keyof ThemeTokens['typography']) => theme.tokens.typography[key],
            getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => theme.tokens.breakpoints[key],

            // Backward compatibility
            primary: theme.tokens.colors.brand,
            secondary: theme.tokens.colors.neutral,
            success: theme.tokens.colors.semantic?.success || '#10b981',
            warning: theme.tokens.colors.semantic?.warning || '#f59e0b',
            error: theme.tokens.colors.semantic?.error || '#ef4444',
            info: theme.tokens.colors.semantic?.info || '#3b82f6'
        };

        // Add additional utilities
        enhancedTheme = this.addUtilities(enhancedTheme);

        return enhancedTheme;
    }

    /**
     * Add utility methods to theme
     */
    public addUtilities(theme: EnhancedTheme): EnhancedTheme {
        return {
            ...theme,
            // Additional utility methods can be added here
            getContrastColor: (backgroundColor: string) => this.getContrastColor(backgroundColor),
            getLightColor: (color: string, amount: number) => this.lightenColor(color, amount),
            getDarkColor: (color: string, amount: number) => this.darkenColor(color, amount)
        } as EnhancedTheme;
    }

    /**
     * Get nested value from object path
     */
    private getNestedValue(obj: any, path: string): string {
        return path.split('.').reduce((current, key) => current?.[key], obj) || '';
    }

    /**
     * Get contrast color (black or white) for background
     */
    private getContrastColor(backgroundColor: string): string {
        // Simple luminance calculation
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    /**
     * Lighten a color by amount
     */
    private lightenColor(color: string, amount: number): string {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Darken a color by amount
     */
    private darkenColor(color: string, amount: number): string {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}
