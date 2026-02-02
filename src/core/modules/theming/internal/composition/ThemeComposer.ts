/**
 * Internal Theme Composer.
 *
 * Handles theme composition and inheritance logic.
 * Separated from factory and enhancement concerns.
 */

import type { ThemeTokens } from '../tokens';
import type { ThemeConfig, ComposedTheme } from '../types';

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
 * Theme Composer interface
 */
export interface IThemeComposer {
    register(name: string, config: Partial<ThemeTokens>): void;
    compose(variant: string, overrides?: Partial<ThemeTokens>): ComposedTheme;
    getRegisteredVariants(): string[];
}

/**
 * Theme Composer implementation
 */
export class ThemeComposer implements IThemeComposer {
    private readonly themes = new Map<string, ThemeConfig>();
    private readonly composedThemes = new Map<string, ComposedTheme>();

    /**
     * Register a theme configuration
     */
    public register(name: string, config: Partial<ThemeTokens>): void {
        const themeConfig: ThemeConfig = {
            name,
            version: '1.0.0',
            tokens: config
        };
        this.themes.set(name, themeConfig);
    }

    /**
     * Compose a theme with inheritance and overrides
     */
    public compose(variant: string, overrides?: Partial<ThemeTokens>): ComposedTheme {
        const config = this.themes.get(variant);
        if (!config) {
            throw new Error(`Theme "${variant}" not found`);
        }

        // Check cache
        const cacheKey = `${variant}-${JSON.stringify(overrides)}`;
        if (this.composedThemes.has(cacheKey)) {
            return this.composedThemes.get(cacheKey)!;
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

        this.composedThemes.set(cacheKey, composedTheme);
        return composedTheme;
    }

    /**
     * Get registered theme variants
     */
    public getRegisteredVariants(): string[] {
        return Array.from(this.themes.keys());
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
     * Deep merge tokens
     */
    private mergeTokens(base: Partial<ThemeTokens>, override: Partial<ThemeTokens>): ThemeTokens {
        const defaults = this.getDefaultTokens();

        return {
            colors: { ...defaults.colors, ...base.colors, ...override.colors },
            typography: { ...defaults.typography, ...base.typography, ...override.typography },
            spacing: { ...defaults.spacing, ...base.spacing, ...override.spacing },
            shadows: { ...defaults.shadows, ...base.shadows, ...override.shadows },
            breakpoints: { ...defaults.breakpoints, ...base.breakpoints, ...override.breakpoints },
            radius: { ...defaults.radius, ...base.radius, ...override.radius },
            animation: { ...defaults.animation, ...base.animation, ...override.animation }
        };
    }

    /**
     * Validate tokens for completeness
     */
    private validateTokens(tokens: Partial<ThemeTokens>): ThemeTokens {
        const defaults = this.getDefaultTokens();

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
}
