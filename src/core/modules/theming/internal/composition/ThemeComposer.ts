/**
 * Internal Theme Composer
 *
 * Handles theme composition and inheritance logic with caching and validation.
 * Provides clean API for theme registration and composition operations.
 */

import type { ThemeTokens } from '../tokens';
import type { ThemeConfig, ComposedTheme } from '../types';

import { ITokenService, tokenService } from '../../shared/services/TokenService';
import { IThemeErrorFactory, themeErrorFactory } from '../../shared/errors/ThemeErrors';
import { ISmartCache, themeCache } from '../../shared/caching/SmartCache';

/**
 * Theme Composer Interface
 */
export interface IThemeComposer {
    register(name: string, config: Partial<ThemeTokens>): void;
    compose(variant: string, overrides?: Partial<ThemeTokens>): ComposedTheme;
    getRegisteredVariants(): string[];
    validateTheme(theme: Partial<ThemeTokens>): Promise<boolean>;
    clearCache(): void;
}

/**
 * Theme Composer Implementation
 * 
 * Handles theme composition and inheritance with caching and validation.
 * Uses dependency injection for testability and flexibility.
 */
export class ThemeComposer implements IThemeComposer {
    private readonly themes = new Map<string, ThemeConfig>();
    private readonly tokenService: ITokenService;
    private readonly errorFactory: IThemeErrorFactory;
    private readonly cache: ISmartCache<ComposedTheme>;

    constructor(
        tokenServiceInstance: ITokenService = tokenService,
        errorFactory: IThemeErrorFactory = themeErrorFactory,
        cache: ISmartCache<ComposedTheme> = themeCache
    ) {
        this.tokenService = tokenServiceInstance;
        this.errorFactory = errorFactory;
        this.cache = cache;
    }

    /**
     * Register a theme configuration
     */
    public register(name: string, config: Partial<ThemeTokens>): void {
        if (!name || typeof name !== 'string') {
            throw this.errorFactory.createConfigurationError(
                'Theme name is required and must be a string',
                'register.name',
                name
            );
        }

        if (this.themes.has(name)) {
            console.warn(`Theme "${name}" is being overwritten`);
        }

        // Validate theme configuration
        const validation = this.tokenService.validateTokens(config);
        if (!validation.isValid) {
            throw this.errorFactory.createValidationError(validation.errors, validation.warnings);
        }

        const themeConfig: ThemeConfig = {
            name,
            version: '1.0.0',
            tokens: config
        };

        this.themes.set(name, themeConfig);

        // Clear cache when new theme is registered
        this.clearCache();
    }

    /**
     * Compose a theme with inheritance and overrides
     */
    public compose(variant: string, overrides?: Partial<ThemeTokens>): ComposedTheme {
        const startTime = performance.now();

        try {
            // Check cache first
            const cacheKey = this.cache.generateKey(variant, overrides);
            const cachedTheme = this.cache.get(cacheKey);
            if (cachedTheme) {
                return cachedTheme;
            }

            // Get theme configuration
            const config = this.themes.get(variant);
            if (!config) {
                const availableVariants = this.getRegisteredVariants();
                throw this.errorFactory.createThemeNotFoundError(variant, availableVariants);
            }

            // Compose tokens
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

            // Cache the result
            this.cache.set(cacheKey, composedTheme);

            // Log performance warning if slow
            const duration = performance.now() - startTime;
            if (duration > 50) { // 50ms threshold
                console.warn(`Slow theme composition: ${duration.toFixed(2)}ms for variant: ${variant}`);
            }

            return composedTheme;

        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createCompositionError(
                `Failed to compose theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant,
                'compose'
            );
        }
    }

    /**
     * Get registered theme variants
     */
    public getRegisteredVariants(): string[] {
        return Array.from(this.themes.keys());
    }

    /**
     * Validate theme asynchronously
     */
    public async validateTheme(theme: Partial<ThemeTokens>): Promise<boolean> {
        try {
            const validation = this.tokenService.validateTokens(theme);

            // Log warnings
            if (validation.warnings.length > 0) {
                console.warn('Theme validation warnings:', validation.warnings);
            }

            return validation.isValid;
        } catch (error) {
            console.error('Theme validation error:', error);
            return false;
        }
    }

    /**
     * Clear cache
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * Get cache metrics
     */
    public getCacheMetrics() {
        return this.cache.getMetrics();
    }

    /**
     * Compose tokens with inheritance and overrides
     */
    private composeTokens(config: ThemeConfig, overrides?: Partial<ThemeTokens>): ThemeTokens {
        try {
            // Start with default tokens
            let tokens = this.tokenService.getDefaultTokens();

            // Apply inheritance
            if (config.extends && config.extends.length > 0) {
                tokens = this.applyInheritance(tokens, config.extends);
            }

            // Apply base theme tokens
            tokens = this.tokenService.mergeTokens(tokens, config.tokens);

            // Apply config overrides
            if (config.overrides) {
                tokens = this.tokenService.mergeTokens(tokens, config.overrides);
            }

            // Apply runtime overrides
            if (overrides) {
                tokens = this.tokenService.mergeTokens(tokens, overrides);
            }

            // Validate final tokens
            const validation = this.tokenService.validateTokens(tokens);
            if (!validation.isValid) {
                throw this.errorFactory.createValidationError(validation.errors, validation.warnings);
            }

            return tokens;

        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createCompositionError(
                `Failed to compose tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
                config.name,
                'composeTokens'
            );
        }
    }

    /**
     * Apply inheritance from parent themes
     */
    private applyInheritance(baseTokens: ThemeTokens, parents: string[]): ThemeTokens {
        let tokens = baseTokens;

        for (const parentName of parents) {
            const parentConfig = this.themes.get(parentName);
            if (!parentConfig) {
                throw this.errorFactory.createCompositionError(
                    `Parent theme "${parentName}" not found`,
                    parentName,
                    'inheritance'
                );
            }

            // Recursively apply parent inheritance
            if (parentConfig.extends && parentConfig.extends.length > 0) {
                tokens = this.applyInheritance(tokens, parentConfig.extends);
            }

            // Apply parent tokens
            tokens = this.tokenService.mergeTokens(tokens, parentConfig.tokens);
        }

        return tokens;
    }
}

/**
 * Export singleton instance for backward compatibility
 */
export const themeComposer = new ThemeComposer();
