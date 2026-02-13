/**
 * Token Service
 *
 * Provides centralized token management with validation and merging capabilities.
 * Follows dependency injection pattern for testability.
 */

import { colors } from '../../appColors';
import { typography } from '../../appTypography';
import {
    baseSpacing,
    baseShadows,
    baseBreakpoints,
    baseRadius,
    baseAnimation
} from '../../baseTokens';

import type { ThemeTokens } from '../../tokens';

/**
 * Token Service Interface - Dependency Injection
 */
export interface ITokenService {
    getDefaultTokens(): ThemeTokens;
    validateTokens(tokens: Partial<ThemeTokens>): ValidationResult;
    mergeTokens(base: ThemeTokens, override: Partial<ThemeTokens>): ThemeTokens;
    cloneTokens(tokens: ThemeTokens): ThemeTokens;
}

/**
 * Validation Result Interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Token Service Implementation
 * 
 * Handles token management with validation and merging capabilities.
 * Uses dependency injection for better testability and flexibility.
 */
export class TokenService implements ITokenService {
    private static instance: TokenService;
    private readonly defaultTokens: ThemeTokens;

    private constructor() {
        this.defaultTokens = this.createDefaultTokens();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }

    /**
     * Get default theme tokens
     */
    public getDefaultTokens(): ThemeTokens {
        return this.cloneTokens(this.defaultTokens);
    }

    /**
     * Validate theme tokens
     */
    public validateTokens(tokens: Partial<ThemeTokens>): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate colors
        if (tokens.colors) {
            this.validateColors(tokens.colors, errors, warnings);
        }

        // Validate typography
        if (tokens.typography) {
            this.validateTypography(tokens.typography, errors, warnings);
        }

        // Validate spacing
        if (tokens.spacing) {
            this.validateSpacing(tokens.spacing, errors, warnings);
        }

        // Validate shadows
        if (tokens.shadows) {
            this.validateShadows(tokens.shadows, errors, warnings);
        }

        // Validate breakpoints
        if (tokens.breakpoints) {
            this.validateBreakpoints(tokens.breakpoints, errors, warnings);
        }

        // Validate radius
        if (tokens.radius) {
            this.validateRadius(tokens.radius, errors, warnings);
        }

        // Validate animation
        if (tokens.animation) {
            this.validateAnimation(tokens.animation, errors, warnings);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Merge tokens with proper inheritance
     */
    public mergeTokens(base: ThemeTokens, override: Partial<ThemeTokens>): ThemeTokens {
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
     * Clone tokens for immutability
     */
    public cloneTokens(tokens: ThemeTokens): ThemeTokens {
        return JSON.parse(JSON.stringify(tokens));
    }

    /**
     * Create default tokens
     */
    private createDefaultTokens(): ThemeTokens {
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
     * Validate color tokens
     */
    private validateColors(
        colors: Partial<ThemeTokens['colors']>,
        errors: string[],
        warnings: string[]
    ): void {
        // Check for required color properties
        if (!colors.brand) {
            errors.push('Brand colors are required');
        }

        if (!colors.semantic) {
            warnings.push('Semantic colors are recommended');
        }

        // Validate color formats
        this.validateColorFormat(colors.brand, 'brand', errors);
        this.validateColorFormat(colors.semantic, 'semantic', errors);
    }

    /**
     * Validate typography tokens
     */
    private validateTypography(
        typography: Partial<ThemeTokens['typography']>,
        errors: string[],
        warnings: string[]
    ): void {
        if (!typography.fontFamily) {
            errors.push('Font family is required');
        }

        if (!typography.fontSize) {
            warnings.push('Font sizes are recommended');
        }
    }

    /**
     * Validate spacing tokens
     */
    private validateSpacing(
        spacing: Partial<ThemeTokens['spacing']>,
        errors: string[],
        warnings: string[]
    ): void {
        const requiredSizes = ['xs', 'sm', 'md', 'lg', 'xl'];

        for (const size of requiredSizes) {
            if (!spacing[size as keyof ThemeTokens['spacing']]) {
                warnings.push(`Spacing size '${size}' is recommended`);
            }
        }
    }

    /**
     * Validate shadow tokens
     */
    private validateShadows(
        shadows: Partial<ThemeTokens['shadows']>,
        errors: string[],
        warnings: string[]
    ): void {
        // Check for basic shadow properties
        if (!shadows.sm && !shadows.md) {
            warnings.push('Basic shadow sizes are recommended');
        }
    }

    /**
     * Validate breakpoint tokens
     */
    private validateBreakpoints(
        breakpoints: Partial<ThemeTokens['breakpoints']>,
        errors: string[],
        warnings: string[]
    ): void {
        const requiredBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];

        for (const bp of requiredBreakpoints) {
            if (!breakpoints[bp as keyof ThemeTokens['breakpoints']]) {
                warnings.push(`Breakpoint '${bp}' is recommended`);
            }
        }
    }

    /**
     * Validate radius tokens
     */
    private validateRadius(
        radius: Partial<ThemeTokens['radius']>,
        errors: string[],
        warnings: string[]
    ): void {
        if (!radius.sm && !radius.md) {
            warnings.push('Basic radius sizes are recommended');
        }
    }

    /**
     * Validate animation tokens
     */
    private validateAnimation(
        animation: Partial<ThemeTokens['animation']>,
        errors: string[],
        warnings: string[]
    ): void {
        if (!animation.duration && !animation.easing) {
            warnings.push('Animation duration and easing are recommended');
        }
    }

    /**
     * Validate color format
     */
    private validateColorFormat(
        colorObj: unknown,
        context: string,
        errors: string[]
    ): void {
        if (!colorObj || typeof colorObj !== 'object') {
            errors.push(`${context} colors must be an object`);
            return;
        }

        const colors = colorObj as Record<string, unknown>;
        for (const [key, value] of Object.entries(colors)) {
            if (typeof value !== 'string') {
                errors.push(`${context} color '${key}' must be a string`);
                continue;
            }

            if (!this.isValidColor(value)) {
                errors.push(`${context} color '${key}' has invalid format: ${value}`);
            }
        }
    }

    /**
     * Check if color is valid
     */
    private isValidColor(color: string): boolean {
        // Hex color validation
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            return true;
        }

        // RGB/RGBA validation
        if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
            return true;
        }

        // HSL/HSLA validation
        if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
            return true;
        }

        // Named colors
        if (/^[a-z]+$/i.test(color)) {
            return true;
        }

        return false;
    }
}

/**
 * Export singleton instance for convenience
 */
export const tokenService = TokenService.getInstance();
