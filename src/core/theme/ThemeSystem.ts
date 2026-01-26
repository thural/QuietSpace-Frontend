/**
 * Theme System Facade.
 * 
 * Single entry point for all theme system functionality.
 * Provides clean API while maintaining internal modularity.
 */

import { ThemeTokens } from './internal/tokens';
import { EnhancedTheme } from './internal/types';
import { ThemeFactory } from './internal/factories/ThemeFactory';
import { ThemeComposer } from './internal/composition/ThemeComposer';
import { ThemeEnhancer } from './internal/enhancement/ThemeEnhancer';

/**
 * Theme System Facade
 * 
 * Provides a unified interface for all theme operations while
 * keeping internal modules properly separated and modular.
 */
export class ThemeSystem {
    private static instance: ThemeSystem;
    private themeFactory: ThemeFactory;
    private themeComposer: ThemeComposer;
    private themeEnhancer: ThemeEnhancer;

    private constructor() {
        this.themeFactory = new ThemeFactory();
        this.themeComposer = new ThemeComposer();
        this.themeEnhancer = new ThemeEnhancer();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ThemeSystem {
        if (!ThemeSystem.instance) {
            ThemeSystem.instance = new ThemeSystem();
        }
        return ThemeSystem.instance;
    }

    /**
     * Create a theme with optional overrides
     */
    public createTheme(variant: string, overrides?: Partial<ThemeTokens>): EnhancedTheme {
        const baseTheme = this.themeComposer.compose(variant, overrides);
        return this.themeEnhancer.enhance(baseTheme);
    }

    /**
     * Register a new theme variant
     */
    public registerTheme(name: string, config: Partial<ThemeTokens>): void {
        this.themeComposer.register(name, config);
    }

    /**
     * Get available theme variants
     */
    public getAvailableVariants(): string[] {
        return this.themeComposer.getRegisteredVariants();
    }

    /**
     * Get theme factory for advanced usage
     */
    public getFactory(): ThemeFactory {
        return this.themeFactory;
    }

    /**
     * Get theme composer for advanced usage
     */
    public getComposer(): ThemeComposer {
        return this.themeComposer;
    }

    /**
     * Get theme enhancer for advanced usage
     */
    public getEnhancer(): ThemeEnhancer {
        return this.themeEnhancer;
    }
}

/**
 * Export singleton instance for convenience
 */
export const themeSystem = ThemeSystem.getInstance();
