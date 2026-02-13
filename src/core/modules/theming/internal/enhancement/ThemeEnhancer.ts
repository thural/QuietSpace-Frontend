/**
 * Internal Theme Enhancer
 *
 * Handles theme enhancement and computed value logic.
 * Separated from composition and factory concerns.
 */

import type { ThemeTokens } from '../tokens';
import type { EnhancedTheme, ComposedTheme } from '../types';

import { IEnhancementService, enhancementService } from '../../shared/services/EnhancementService';
import { IThemeErrorFactory, themeErrorFactory } from '../../shared/errors/ThemeErrors';

/**
 * Theme Enhancer Interface
 */
export interface IThemeEnhancer {
    enhance(theme: ComposedTheme): EnhancedTheme;
    addUtilities(theme: EnhancedTheme): EnhancedTheme;
    addComputedValues(theme: EnhancedTheme): EnhancedTheme;
    addBackwardCompatibility(theme: EnhancedTheme): EnhancedTheme;
    validateEnhancedTheme(theme: EnhancedTheme): Promise<boolean>;
}

/**
 * Theme Enhancer Implementation
 * 
 * Handles theme enhancement and computed values with dependency injection support.
 */
export class ThemeEnhancer implements IThemeEnhancer {
    private readonly enhancementService: IEnhancementService;
    private readonly errorFactory: IThemeErrorFactory;

    constructor(
        enhancementServiceInstance: IEnhancementService = enhancementService,
        errorFactory: IThemeErrorFactory = themeErrorFactory
    ) {
        this.enhancementService = enhancementServiceInstance;
        this.errorFactory = errorFactory;
    }

    /**
     * Enhance a composed theme with computed values and utilities
     */
    public enhance(theme: ComposedTheme): EnhancedTheme {
        const startTime = performance.now();

        try {
            let enhancedTheme = this.enhancementService.enhance(theme);

            // Validate enhanced theme
            this.validateThemeStructure(enhancedTheme);

            // Log performance warning if slow
            const duration = performance.now() - startTime;
            if (duration > 20) { // 20ms threshold
                console.warn(`Slow theme enhancement: ${duration.toFixed(2)}ms for theme: ${theme.name}`);
            }

            return enhancedTheme;

        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createEnhancementError(
                `Failed to enhance theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                theme.name,
                'enhancement'
            );
        }
    }

    /**
     * Add utility methods to theme
     */
    public addUtilities(theme: EnhancedTheme): EnhancedTheme {
        try {
            return this.enhancementService.addUtilities(theme);
        } catch (error) {
            throw this.errorFactory.createEnhancementError(
                `Failed to add utilities: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'unknown',
                'utilities'
            );
        }
    }

    /**
     * Add computed values to theme
     */
    public addComputedValues(theme: EnhancedTheme): EnhancedTheme {
        try {
            return this.enhancementService.addComputedValues(theme);
        } catch (error) {
            throw this.errorFactory.createEnhancementError(
                `Failed to add computed values: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'unknown',
                'computed-values'
            );
        }
    }

    /**
     * Add backward compatibility properties
     */
    public addBackwardCompatibility(theme: EnhancedTheme): EnhancedTheme {
        try {
            return this.enhancementService.addBackwardCompatibility(theme);
        } catch (error) {
            throw this.errorFactory.createEnhancementError(
                `Failed to add backward compatibility: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'unknown',
                'backward-compatibility'
            );
        }
    }

    /**
     * Validate enhanced theme asynchronously
     */
    public async validateEnhancedTheme(theme: EnhancedTheme): Promise<boolean> {
        try {
            // Check required methods
            const requiredMethods = ['getSpacing', 'getColor', 'getTypography', 'getBreakpoint'];
            for (const method of requiredMethods) {
                if (typeof (theme as any)[method] !== 'function') {
                    console.error(`Missing required method: ${method}`);
                    return false;
                }
            }

            // Check required properties
            const requiredProperties = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
            for (const prop of requiredProperties) {
                if (!(prop in theme)) {
                    console.error(`Missing required property: ${prop}`);
                    return false;
                }
            }

            // Test utility methods
            if ((theme as any).getContrastColor) {
                try {
                    (theme as any).getContrastColor('#ffffff');
                } catch (error) {
                    console.error('getContrastColor method failed:', error);
                    return false;
                }
            }

            return true;

        } catch (error) {
            console.error('Theme validation error:', error);
            return false;
        }
    }

    /**
     * Validate theme structure
     */
    private validateThemeStructure(theme: EnhancedTheme): void {
        const errors: string[] = [];

        // Check required methods
        const requiredMethods = ['getSpacing', 'getColor', 'getTypography', 'getBreakpoint'];
        for (const method of requiredMethods) {
            if (typeof (theme as any)[method] !== 'function') {
                errors.push(`Missing required method: ${method}`);
            }
        }

        // Check required properties
        const requiredProperties = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
        for (const prop of requiredProperties) {
            if (!(prop in theme)) {
                errors.push(`Missing required property: ${prop}`);
            }
        }

        if (errors.length > 0) {
            throw this.errorFactory.createValidationError(errors);
        }
    }
}

/**
 * Export singleton instance for backward compatibility
 */
export const themeEnhancer = new ThemeEnhancer();
