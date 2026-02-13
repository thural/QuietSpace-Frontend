/**
 * Theme Enhancement Service
 *
 * Provides theme enhancement and computed value logic with dependency injection support.
 */

import type { ThemeTokens } from '../../tokens';
import type { EnhancedTheme, ComposedTheme } from '../../internal/types';
import { IColorUtils, colorUtils } from './ColorUtils';

/**
 * Theme Enhancement Service Interface
 */
export interface IEnhancementService {
    enhance(theme: ComposedTheme): EnhancedTheme;
    addUtilities(theme: EnhancedTheme): EnhancedTheme;
    addComputedValues(theme: EnhancedTheme): EnhancedTheme;
    addBackwardCompatibility(theme: EnhancedTheme): EnhancedTheme;
}

/**
 * Theme Enhancement Service Implementation
 * 
 * Handles theme enhancement with computed values and utility methods.
 * Uses dependency injection for better testability and flexibility.
 */
export class EnhancementService implements IEnhancementService {
    private readonly colorUtils: IColorUtils;

    constructor(colorUtilsInstance: IColorUtils = colorUtils) {
        this.colorUtils = colorUtilsInstance;
    }

    /**
     * Enhance a composed theme with computed values and utilities
     */
    public enhance(theme: ComposedTheme): EnhancedTheme {
        // Start with theme tokens and required methods
        let enhancedTheme: any = {
            ...theme.tokens,
            // Basic getter methods
            getSpacing: (key: keyof ThemeTokens['spacing']) => theme.tokens.spacing[key],
            getColor: (path: string) => this.getNestedValue(theme.tokens.colors, path),
            getTypography: (key: keyof ThemeTokens['typography']) => theme.tokens.typography[key],
            getBreakpoint: (key: keyof ThemeTokens['breakpoints']) => theme.tokens.breakpoints[key]
        };

        // Add computed values
        enhancedTheme = this.addComputedValues(enhancedTheme);

        // Add utility methods
        enhancedTheme = this.addUtilities(enhancedTheme);

        // Add backward compatibility
        enhancedTheme = this.addBackwardCompatibility(enhancedTheme);

        return enhancedTheme as EnhancedTheme;
    }

    /**
     * Add utility methods to theme
     */
    public addUtilities(theme: EnhancedTheme): EnhancedTheme {
        return {
            ...theme,
            // Color utilities
            getContrastColor: (backgroundColor: string) =>
                this.colorUtils.getContrastColor(backgroundColor),
            getLightColor: (color: string, amount: number) =>
                this.colorUtils.lightenColor(color, amount),
            getDarkColor: (color: string, amount: number) =>
                this.colorUtils.darkenColor(color, amount),

            // Validation utilities
            validateColor: (color: string) =>
                this.colorUtils.validateColor(color),

            // Contrast utilities
            getContrastRatio: (color1: string, color2: string) =>
                this.colorUtils.getContrastRatio(color1, color2),

            // Spacing utilities
            getSpacingValue: (key: keyof ThemeTokens['spacing']) =>
                this.parseSpacingValue(theme.spacing[key]),

            // Typography utilities
            getFontSize: (key: keyof ThemeTokens['typography']['fontSize']) =>
                theme.typography.fontSize[key],

            // Breakpoint utilities
            getBreakpointValue: (key: keyof ThemeTokens['breakpoints']) =>
                this.parseBreakpointValue(theme.breakpoints[key])
        } as EnhancedTheme;
    }

    /**
     * Add computed values to theme
     */
    public addComputedValues(theme: EnhancedTheme): EnhancedTheme {
        return {
            ...theme,
            // Computed spacing values
            spacingScale: this.computeSpacingScale(theme.spacing),

            // Computed typography scale
            typographyScale: this.computeTypographyScale(theme.typography),

            // Computed color variations
            colorVariations: this.computeColorVariations(theme.colors),

            // Computed shadow variations
            shadowVariations: this.computeShadowVariations(theme.shadows),

            // Computed animation durations
            animationDurations: this.computeAnimationDurations(theme.animation)
        } as EnhancedTheme;
    }

    /**
     * Add backward compatibility properties
     */
    public addBackwardCompatibility(theme: any): any {
        return {
            ...theme,
            // Legacy color properties
            primary: theme.colors.brand,
            secondary: theme.colors.neutral,
            success: theme.colors.semantic?.success || '#10b981',
            warning: theme.colors.semantic?.warning || '#f59e0b',
            error: theme.colors.semantic?.error || '#ef4444',
            info: theme.colors.semantic?.info || '#3b82f6',

            // Legacy spacing function
            spacing: (factor: number) => this.computeSpacingFromFactor(theme.spacing, factor),

            // Legacy breakpoint function
            breakpoints: {
                xs: this.parseBreakpointValue(theme.breakpoints.xs),
                sm: this.parseBreakpointValue(theme.breakpoints.sm),
                md: this.parseBreakpointValue(theme.breakpoints.md),
                lg: this.parseBreakpointValue(theme.breakpoints.lg),
                xl: this.parseBreakpointValue(theme.breakpoints.xl)
            },

            // Legacy radius values
            radius: {
                none: theme.radius.none,
                sm: theme.radius.sm,
                md: theme.radius.md,
                lg: theme.radius.lg,
                xl: theme.radius.xl,
                full: theme.radius.full
            }
        };
    }

    /**
     * Get nested value from object path
     */
    private getNestedValue(obj: unknown, path: string): string {
        try {
            const result = path.split('.').reduce((current: unknown, key: string) => {
                if (current && typeof current === 'object' && key in current) {
                    return (current as Record<string, unknown>)[key];
                }
                return undefined;
            }, obj);

            return typeof result === 'string' ? result : String(result || '');
        } catch {
            return '';
        }
    }

    /**
     * Parse spacing value to ensure it's a valid CSS value
     */
    private parseSpacingValue(value: string): string {
        if (!value) return '0px';

        // If already has units, return as-is
        if (typeof value === 'string' && (value.includes('px') || value.includes('rem') || value.includes('em'))) {
            return value;
        }

        // Assume pixel value if no units
        return `${value}px`;
    }

    /**
     * Parse breakpoint value to ensure it's a valid media query
     */
    private parseBreakpointValue(value: string): string {
        if (!value) return '0px';

        // If already includes media query syntax, return as-is
        if (value.includes('px') || value.includes('rem') || value.includes('em')) {
            return value;
        }

        // Assume pixel value
        return `${value}px`;
    }

    /**
     * Compute spacing scale
     */
    private computeSpacingScale(spacing: ThemeTokens['spacing']): Record<string, string> {
        const scale: Record<string, string> = {};

        for (const [key, value] of Object.entries(spacing)) {
            scale[key] = this.parseSpacingValue(value);
        }

        return scale;
    }

    /**
     * Compute typography scale
     */
    private computeTypographyScale(typography: ThemeTokens['typography']): Record<string, string> {
        const scale: Record<string, string> = {};

        if (typography.fontSize) {
            for (const [key, value] of Object.entries(typography.fontSize)) {
                scale[key] = value;
            }
        }

        return scale;
    }

    /**
     * Compute color variations
     */
    private computeColorVariations(colors: ThemeTokens['colors']): Record<string, Record<string, string>> {
        const variations: Record<string, Record<string, string>> = {};

        // Generate variations for brand colors
        if (colors.brand) {
            variations.brand = {};
            for (const [key, value] of Object.entries(colors.brand)) {
                variations.brand[key] = value;
                variations.brand[`${key}Light`] = this.colorUtils.lightenColor(value, 10);
                variations.brand[`${key}Dark`] = this.colorUtils.darkenColor(value, 10);
            }
        }

        return variations;
    }

    /**
     * Compute shadow variations
     */
    private computeShadowVariations(shadows: ThemeTokens['shadows']): Record<string, string> {
        const variations: Record<string, string> = {};

        for (const [key, value] of Object.entries(shadows)) {
            variations[key] = value;

            // Create colored variations if brand color is available
            if (key === 'md') {
                variations.brand = value.replace('rgba(0, 0, 0', 'rgba(14, 165, 233'); // brand.500
            }
        }

        return variations;
    }

    /**
     * Compute animation durations
     */
    private computeAnimationDurations(animation: ThemeTokens['animation']): Record<string, string> {
        const durations: Record<string, string> = {};

        if (animation.duration) {
            for (const [key, value] of Object.entries(animation.duration)) {
                durations[key] = value;
            }
        }

        return durations;
    }

    /**
     * Compute spacing from factor (legacy support)
     */
    private computeSpacingFromFactor(spacing: ThemeTokens['spacing'], factor: number): string {
        const baseSpacing = spacing.md || '16px';
        const baseValue = parseInt(baseSpacing.replace('px', ''));
        return `${baseValue * factor}px`;
    }
}

/**
 * Export singleton instance for convenience
 */
export const enhancementService = new EnhancementService();
