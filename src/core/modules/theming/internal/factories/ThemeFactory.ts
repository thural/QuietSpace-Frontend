/**
 * Internal Theme Factory
 *
 * Factory for creating theme instances with proper encapsulation.
 * Handles theme creation logic separated from composition.
 */

import type { ThemeTokens } from '../tokens';
import type { EnhancedTheme, ThemeConfig } from '../types';

import { ITokenService, tokenService } from '../../shared/services/TokenService';
import { IEnhancementService, enhancementService } from '../../shared/services/EnhancementService';
import { IThemeErrorFactory, themeErrorFactory } from '../../shared/errors/ThemeErrors';

/**
 * Theme Factory Interface
 */
export interface IThemeFactory {
    createTheme(config: ThemeConfig): EnhancedTheme;
    createVariant(name: string, base: ThemeTokens, overrides?: Partial<ThemeTokens>): EnhancedTheme;
    createDefaultTheme(): EnhancedTheme;
    createThemeFromTokens(tokens: ThemeTokens): EnhancedTheme;
    validateFactoryConfig(config: ThemeConfig): Promise<boolean>;
}

/**
 * Theme Factory Implementation
 * 
 * Handles theme creation with dependency injection support for testability.
 */
export class ThemeFactory implements IThemeFactory {
    private readonly tokenService: ITokenService;
    private readonly enhancementService: IEnhancementService;
    private readonly errorFactory: IThemeErrorFactory;

    constructor(
        tokenService: ITokenService = tokenService,
        enhancementService: IEnhancementService = enhancementService,
        errorFactory: IThemeErrorFactory = themeErrorFactory
    ) {
        this.tokenService = tokenService;
        this.enhancementService = enhancementService;
        this.errorFactory = errorFactory;
    }

    /**
     * Create a theme from configuration
     */
    public createTheme(config: ThemeConfig): EnhancedTheme {
        const startTime = performance.now();

        try {
            // Validate configuration
            this.validateConfig(config);

            // Get base tokens
            const baseTokens = this.tokenService.getDefaultTokens();

            // Merge with configuration tokens
            const mergedTokens = this.tokenService.mergeTokens(baseTokens, config.tokens);

            // Create enhanced theme
            const enhancedTheme = this.createEnhancedTheme(mergedTokens);

            // Log performance warning if slow
            const duration = performance.now() - startTime;
            if (duration > 30) { // 30ms threshold
                console.warn(`Slow theme creation: ${duration.toFixed(2)}ms for theme: ${config.name}`);
            }

            return enhancedTheme;

        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createConfigurationError(
                `Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'createTheme',
                config.name
            );
        }
    }

    /**
     * Create a theme variant
     */
    public createVariant(name: string, base: ThemeTokens, overrides?: Partial<ThemeTokens>): EnhancedTheme {
        try {
            // Validate inputs
            if (!name || typeof name !== 'string') {
                throw this.errorFactory.createConfigurationError(
                    'Variant name is required and must be a string',
                    'createVariant.name',
                    name
                );
            }

            if (!base) {
                throw this.errorFactory.createConfigurationError(
                    'Base theme tokens are required',
                    'createVariant.base',
                    base
                );
            }

            // Merge tokens
            const mergedTokens = this.tokenService.mergeTokens(base, overrides);

            // Create enhanced theme
            return this.createEnhancedTheme(mergedTokens);

        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createConfigurationError(
                `Failed to create variant: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'createVariant',
                name
            );
        }
    }

    /**
     * Create default theme
     */
    public createDefaultTheme(): EnhancedTheme {
        try {
            const defaultTokens = this.tokenService.getDefaultTokens();
            return this.createEnhancedTheme(defaultTokens);
        } catch (error) {
            throw this.errorFactory.createConfigurationError(
                `Failed to create default theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'createDefaultTheme'
            );
        }
    }

    /**
     * Create theme directly from tokens
     */
    public createThemeFromTokens(tokens: ThemeTokens): EnhancedTheme {
        try {
            // Validate tokens
            const validation = this.tokenService.validateTokens(tokens);
            if (!validation.isValid) {
                throw this.errorFactory.createValidationError(validation.errors, validation.warnings);
            }

            return this.createEnhancedTheme(tokens);
        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createConfigurationError(
                `Failed to create theme from tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'createThemeFromTokens'
            );
        }
    }

    /**
     * Validate factory configuration asynchronously
     */
    public async validateFactoryConfig(config: ThemeConfig): Promise<boolean> {
        try {
            // Check required fields
            if (!config.name || typeof config.name !== 'string') {
                return false;
            }

            if (!config.tokens || typeof config.tokens !== 'object') {
                return false;
            }

            // Validate tokens
            const validation = this.tokenService.validateTokens(config.tokens);
            if (!validation.isValid) {
                console.warn('Factory config validation warnings:', validation.warnings);
                return false;
            }

            return true;

        } catch (error) {
            console.error('Factory config validation error:', error);
            return false;
        }
    }

    /**
     * Create enhanced theme with computed methods
     */
    private createEnhancedTheme(tokens: ThemeTokens): EnhancedTheme {
        try {
            // Create a mock composed theme for enhancement
            const mockComposedTheme = {
                name: 'factory-created',
                version: '1.0.0',
                tokens,
                metadata: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    extends: []
                }
            };

            return this.enhancementService.enhance(mockComposedTheme);
        } catch (error) {
            throw this.errorFactory.createEnhancementError(
                `Failed to enhance theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'factory-created',
                'enhancement'
            );
        }
    }

    /**
     * Validate configuration
     */
    private validateConfig(config: ThemeConfig): void {
        if (!config.name || typeof config.name !== 'string') {
            throw this.errorFactory.createConfigurationError(
                'Theme name is required and must be a string',
                'config.name',
                config.name
            );
        }

        if (!config.tokens || typeof config.tokens !== 'object') {
            throw this.errorFactory.createConfigurationError(
                'Theme tokens are required and must be an object',
                'config.tokens',
                config.tokens
            );
        }

        // Validate tokens
        const validation = this.tokenService.validateTokens(config.tokens);
        if (!validation.isValid) {
            throw this.errorFactory.createValidationError(validation.errors, validation.warnings);
        }
    }
}

/**
 * Export singleton instance for backward compatibility
 */
export const themeFactory = new ThemeFactory();
