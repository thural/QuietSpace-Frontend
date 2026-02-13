/**
 * Theme Token Helpers for Class-Based Components
 * 
 * Provides standardized helper methods for accessing theme tokens
 * in class-based components with proper fallbacks and type safety.
 */

import type { EnhancedTheme } from '../../../core/modules/theming/internal/types';
import type { ThemeTokens } from '../../../core/modules/theming/tokens';

/**
 * Base theme token helper class for class-based components
 * Provides consistent theme token access patterns with fallbacks
 */
export abstract class ThemeTokenHelper {
    protected theme: EnhancedTheme | undefined;

    constructor(theme?: EnhancedTheme) {
        this.theme = theme;
    }

    /**
     * Safely access theme tokens with fallbacks
     * @param tokenPath - Dot notation path to token (e.g., 'colors.brand.500')
     * @param fallback - Fallback value if token is not found
     * @returns Token value or fallback
     */
    protected getThemeToken(tokenPath: string, fallback?: any): any {
        if (!this.theme) return fallback;

        try {
            const keys = tokenPath.split('.');
            let value: any = this.theme;

            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return fallback;
                }
            }

            return value;
        } catch {
            return fallback;
        }
    }

    /**
     * Get color token with fallback
     * @param colorPath - Color token path (e.g., 'brand.500', 'semantic.success')
     * @param fallback - Fallback color value
     * @returns Color token value or fallback
     */
    protected getColor(colorPath: string, fallback: string = '#000000'): string {
        return this.getThemeToken(`colors.${colorPath}`, fallback);
    }

    /**
     * Get spacing token with fallback
     * @param size - Spacing size key
     * @param fallback - Fallback spacing value
     * @returns Spacing token value or fallback
     */
    protected getSpacing(size: keyof ThemeTokens['spacing'], fallback: string = '1rem'): string {
        return this.getThemeToken(`spacing.${size}`, fallback);
    }

    /**
     * Get typography token with fallback
     * @param property - Typography property path
     * @param fallback - Fallback typography value
     * @returns Typography token value or fallback
     */
    protected getTypography(property: string, fallback: string = '1rem'): string {
        return this.getThemeToken(`typography.${property}`, fallback);
    }

    /**
     * Get border radius token with fallback
     * @param size - Radius size key
     * @param fallback - Fallback radius value
     * @returns Radius token value or fallback
     */
    protected getRadius(size: keyof ThemeTokens['radius'], fallback: string = '4px'): string {
        return this.getThemeToken(`radius.${size}`, fallback);
    }

    /**
     * Get shadow token with fallback
     * @param size - Shadow size key
     * @param fallback - Fallback shadow value
     * @returns Shadow token value or fallback
     */
    protected getShadow(size: keyof ThemeTokens['shadows'], fallback: string = 'none'): string {
        return this.getThemeToken(`shadows.${size}`, fallback);
    }

    /**
     * Get breakpoint token with fallback
     * @param size - Breakpoint size key
     * @param fallback - Fallback breakpoint value
     * @returns Breakpoint token value or fallback
     */
    protected getBreakpoint(size: keyof ThemeTokens['breakpoints'], fallback: string = '768px'): string {
        return this.getThemeToken(`breakpoints.${size}`, fallback);
    }

    /**
     * Get animation token with fallback
     * @param property - Animation property path
     * @param fallback - Fallback animation value
     * @returns Animation token value or fallback
     */
    protected getAnimation(property: string, fallback: string = '0.2s'): string {
        return this.getThemeToken(`animation.${property}`, fallback);
    }

    /**
     * Get font size token with fallback
     * @param variant - Font size variant
     * @param fallback - Fallback font size
     * @returns Font size token value or fallback
     */
    protected getFontSize(variant: string, fallback: string = '1rem'): string {
        return this.getThemeToken(`typography.fontSize.${variant}`, fallback);
    }

    /**
     * Get font weight token with fallback
     * @param weight - Font weight variant
     * @param fallback - Fallback font weight
     * @returns Font weight token value or fallback
     */
    protected getFontWeight(weight: string, fallback: string = '400'): string {
        return this.getThemeToken(`typography.fontWeight.${weight}`, fallback);
    }

    /**
     * Get line height token with fallback
     * @param variant - Line height variant
     * @param fallback - Fallback line height
     * @returns Line height token value or fallback
     */
    protected getLineHeight(variant: string, fallback: string = '1.5'): string {
        return this.getThemeToken(`typography.lineHeight.${variant}`, fallback);
    }

    /**
     * Get font family token with fallback
     * @param variant - Font family variant
     * @param fallback - Fallback font family
     * @returns Font family token value or fallback
     */
    protected getFontFamily(variant: string = 'sans', fallback: string = 'system-ui, sans-serif'): string {
        const fontFamily = this.getThemeToken(`typography.fontFamily.${variant}`);
        return Array.isArray(fontFamily) ? fontFamily.join(', ') : (fontFamily || fallback);
    }
}

/**
 * Component size variants mapping
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Component variant types
 */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';

/**
 * Standard component variant configuration
 */
export interface ComponentVariantConfig {
    backgroundColor: string;
    borderColor?: string;
    color: string;
    hoverBackgroundColor?: string;
    hoverBorderColor?: string;
    focusColor?: string;
    disabledBackgroundColor?: string;
    disabledColor?: string;
}

/**
 * Mixin for class-based components to add theme token helper capabilities
 */
export abstract class ThemedComponent extends ThemeTokenHelper {
    /**
     * Get standard variant styles using theme tokens
     * @param variant - Component variant
     * @returns Variant configuration object
     */
    protected getVariantStyles(variant: ComponentVariant): ComponentVariantConfig {
        const variants: Record<ComponentVariant, ComponentVariantConfig> = {
            primary: {
                backgroundColor: this.getColor('brand.500', '#007bff'),
                borderColor: this.getColor('brand.500', '#007bff'),
                color: this.getColor('text.inverse', '#ffffff'),
                hoverBackgroundColor: this.getColor('brand.600', '#0056b3'),
                hoverBorderColor: this.getColor('brand.600', '#0056b3'),
                focusColor: this.getColor('brand.300', '#80bdff'),
                disabledBackgroundColor: this.getColor('border.medium', '#6c757d'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            secondary: {
                backgroundColor: this.getColor('background.secondary', '#f8f9fa'),
                borderColor: this.getColor('border.medium', '#6c757d'),
                color: this.getColor('text.primary', '#212529'),
                hoverBackgroundColor: this.getColor('background.tertiary', '#e9ecef'),
                hoverBorderColor: this.getColor('border.dark', '#495057'),
                focusColor: this.getColor('brand.300', '#80bdff'),
                disabledBackgroundColor: this.getColor('background.tertiary', '#e9ecef'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            success: {
                backgroundColor: this.getColor('semantic.success', '#28a745'),
                borderColor: this.getColor('semantic.success', '#28a745'),
                color: this.getColor('text.inverse', '#ffffff'),
                hoverBackgroundColor: this.getColor('semantic.success', '#218838'),
                hoverBorderColor: this.getColor('semantic.success', '#218838'),
                focusColor: this.getColor('semantic.success', '#7dd87d'),
                disabledBackgroundColor: this.getColor('border.medium', '#6c757d'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            warning: {
                backgroundColor: this.getColor('semantic.warning', '#ffc107'),
                borderColor: this.getColor('semantic.warning', '#ffc107'),
                color: this.getColor('text.primary', '#212529'),
                hoverBackgroundColor: this.getColor('semantic.warning', '#e0a800'),
                hoverBorderColor: this.getColor('semantic.warning', '#e0a800'),
                focusColor: this.getColor('semantic.warning', '#ffda6a'),
                disabledBackgroundColor: this.getColor('border.medium', '#6c757d'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            danger: {
                backgroundColor: this.getColor('semantic.error', '#dc3545'),
                borderColor: this.getColor('semantic.error', '#dc3545'),
                color: this.getColor('text.inverse', '#ffffff'),
                hoverBackgroundColor: this.getColor('semantic.error', '#c82333'),
                hoverBorderColor: this.getColor('semantic.error', '#c82333'),
                focusColor: this.getColor('semantic.error', '#f1b0b7'),
                disabledBackgroundColor: this.getColor('border.medium', '#6c757d'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            info: {
                backgroundColor: this.getColor('semantic.info', '#17a2b8'),
                borderColor: this.getColor('semantic.info', '#17a2b8'),
                color: this.getColor('text.inverse', '#ffffff'),
                hoverBackgroundColor: this.getColor('semantic.info', '#138496'),
                hoverBorderColor: this.getColor('semantic.info', '#138496'),
                focusColor: this.getColor('semantic.info', '#7dd3d3'),
                disabledBackgroundColor: this.getColor('border.medium', '#6c757d'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            light: {
                backgroundColor: this.getColor('background.secondary', '#f8f9fa'),
                borderColor: this.getColor('border.light', '#dee2e6'),
                color: this.getColor('text.primary', '#212529'),
                hoverBackgroundColor: this.getColor('background.tertiary', '#e9ecef'),
                hoverBorderColor: this.getColor('border.medium', '#6c757d'),
                focusColor: this.getColor('brand.300', '#80bdff'),
                disabledBackgroundColor: this.getColor('background.tertiary', '#e9ecef'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            },
            dark: {
                backgroundColor: this.getColor('neutral.800', '#343a40'),
                borderColor: this.getColor('neutral.800', '#343a40'),
                color: this.getColor('text.inverse', '#ffffff'),
                hoverBackgroundColor: this.getColor('neutral.900', '#212529'),
                hoverBorderColor: this.getColor('neutral.900', '#212529'),
                focusColor: this.getColor('brand.300', '#80bdff'),
                disabledBackgroundColor: this.getColor('border.medium', '#6c757d'),
                disabledColor: this.getColor('text.tertiary', '#6c757d')
            }
        };

        return variants[variant] || variants.primary;
    }

    /**
     * Get size-specific padding using theme tokens
     * @param size - Component size
     * @returns Padding string
     */
    protected getSizePadding(size: ComponentSize): string {
        const paddingMap: Record<ComponentSize, string> = {
            xs: `${this.getSpacing('xs', '4px')} ${this.getSpacing('sm', '8px')}`,
            sm: `${this.getSpacing('sm', '8px')} ${this.getSpacing('md', '16px')}`,
            md: `${this.getSpacing('md', '16px')} ${this.getSpacing('lg', '24px')}`,
            lg: `${this.getSpacing('lg', '24px')} ${this.getSpacing('xl', '32px')}`,
            xl: `${this.getSpacing('xl', '32px')} ${this.getSpacing('xl', '32px')}`
        };

        return paddingMap[size] || paddingMap.md;
    }

    /**
     * Get size-specific font size using theme tokens
     * @param size - Component size
     * @returns Font size string
     */
    protected getSizeFontSize(size: ComponentSize): string {
        const fontSizeMap: Record<ComponentSize, string> = {
            xs: this.getFontSize('xs', '12px'),
            sm: this.getFontSize('sm', '14px'),
            md: this.getFontSize('md', '16px'),
            lg: this.getFontSize('lg', '18px'),
            xl: this.getFontSize('xl', '20px')
        };

        return fontSizeMap[size] || fontSizeMap.md;
    }

    /**
     * Get size-specific border radius using theme tokens
     * @param size - Component size
     * @returns Border radius string
     */
    protected getSizeRadius(size: ComponentSize): string {
        const radiusMap: Record<ComponentSize, string> = {
            xs: this.getRadius('sm', '2px'),
            sm: this.getRadius('sm', '4px'),
            md: this.getRadius('md', '6px'),
            lg: this.getRadius('lg', '8px'),
            xl: this.getRadius('xl', '12px')
        };

        return radiusMap[size] || radiusMap.md;
    }
}

/**
 * Mixin class for adding theme helper capabilities to any class component
 * Usage: class MyComponent extends BaseClass with ThemeTokenMixin { ... }
 */
export class ThemeTokenMixin {
    protected themeTokenHelper: ThemeTokenHelper;

    constructor(theme?: EnhancedTheme) {
        this.themeTokenHelper = new (class extends ThemeTokenHelper { })(theme);
    }

    protected getThemeToken(tokenPath: string, fallback?: any): any {
        return this.themeTokenHelper['getThemeToken'](tokenPath, fallback);
    }

    protected getColor(colorPath: string, fallback: string = '#000000'): string {
        return this.themeTokenHelper['getColor'](colorPath, fallback);
    }

    protected getSpacing(size: keyof ThemeTokens['spacing'], fallback: string = '1rem'): string {
        return this.themeTokenHelper['getSpacing'](size, fallback);
    }

    protected getTypography(property: string, fallback: string = '1rem'): string {
        return this.themeTokenHelper['getTypography'](property, fallback);
    }

    protected getRadius(size: keyof ThemeTokens['radius'], fallback: string = '4px'): string {
        return this.themeTokenHelper['getRadius'](size, fallback);
    }

    protected getShadow(size: keyof ThemeTokens['shadows'], fallback: string = 'none'): string {
        return this.themeTokenHelper['getShadow'](size, fallback);
    }

    protected getBreakpoint(size: keyof ThemeTokens['breakpoints'], fallback: string = '768px'): string {
        return this.themeTokenHelper['getBreakpoint'](size, fallback);
    }

    protected getAnimation(property: string, fallback: string = '0.2s'): string {
        return this.themeTokenHelper['getAnimation'](property, fallback);
    }

    protected getFontSize(variant: string, fallback: string = '1rem'): string {
        return this.themeTokenHelper['getFontSize'](variant, fallback);
    }

    protected getFontWeight(weight: string, fallback: string = '400'): string {
        return this.themeTokenHelper['getFontWeight'](weight, fallback);
    }

    protected getLineHeight(variant: string, fallback: string = '1.5'): string {
        return this.themeTokenHelper['getLineHeight'](variant, fallback);
    }

    protected getFontFamily(variant: string = 'sans', fallback: string = 'system-ui, sans-serif'): string {
        return this.themeTokenHelper['getFontFamily'](variant, fallback);
    }
}
