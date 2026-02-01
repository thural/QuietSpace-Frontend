/**
 * Theme System Factory with Dependency Injection.
 *
 * Factory for creating theme services with proper dependency injection.
 * Enables loose coupling and easier testing.
 */

import { themeContainer, THEME_TOKENS } from './ThemeContainer';

import type { IThemeComposer } from '../internal/composition/ThemeComposer';
import type { IThemeEnhancer } from '../internal/enhancement/ThemeEnhancer';
import type { ThemeTokens } from '../internal/tokens';
import type { EnhancedTheme } from '../internal/types';



/**
 * Theme factory interface
 */
export interface IThemeFactory {
    createTheme(variant: string, overrides?: Partial<ThemeTokens>): EnhancedTheme;
    createVariant(name: string, base: EnhancedTheme, overrides?: Partial<ThemeTokens>): EnhancedTheme;
    getAvailableVariants(): string[];
}

/**
 * Theme factory implementation with dependency injection
 */
export class ThemeFactory implements IThemeFactory {
    /**
     * Create a theme with variant and optional overrides
     */
    public createTheme(variant: string, overrides?: Partial<ThemeTokens>): EnhancedTheme {
        const composer = themeContainer.resolve<IThemeComposer>(THEME_TOKENS.THEME_COMPOSER);
        const enhancer = themeContainer.resolve<IThemeEnhancer>(THEME_TOKENS.THEME_ENHANCER);

        const composedTheme = composer.compose(variant, overrides);
        return enhancer.enhance(composedTheme);
    }

    /**
     * Create a theme variant based on existing theme
     */
    public createVariant(name: string, base: EnhancedTheme, overrides?: Partial<ThemeTokens>): EnhancedTheme {
        const factory = themeContainer.resolve<IThemeFactory>(THEME_TOKENS.THEME_FACTORY);
        return factory.createVariant(name, base, overrides);
    }

    /**
     * Get available theme variants
     */
    public getAvailableVariants(): string[] {
        const composer = themeContainer.resolve<IThemeComposer>(THEME_TOKENS.THEME_COMPOSER);
        return composer.getRegisteredVariants();
    }
}

/**
 * Theme factory provider
 */
export const themeFactoryProvider = {
    /**
     * Get theme factory instance
     */
    getFactory(): IThemeFactory {
        return new ThemeFactory();
    },

    /**
     * Register custom theme factory
     */
    registerFactory(factory: () => IThemeFactory): void {
        themeContainer.register(THEME_TOKENS.THEME_FACTORY, factory);
    }
};
