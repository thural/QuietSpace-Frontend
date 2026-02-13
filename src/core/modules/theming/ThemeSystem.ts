/**
 * Theme System Facade.
 *
 * Single entry point for all theme system functionality.
 * Provides clean API while maintaining internal modularity.
 * Enhanced with plugin architecture support.
 */

import { ThemeComposer } from './internal/composition/ThemeComposer';
import { ThemeEnhancer } from './internal/enhancement/ThemeEnhancer';
import { ThemeFactory } from './internal/factories/ThemeFactory';
import {
    ThemePluginManager,
    PluginFactory,
    type IThemePlugin,
    type IPluginManager,
    type PluginManagerConfig
} from './plugins/ThemePluginArchitecture';

import type { ThemeTokens } from './internal/tokens';
import type { EnhancedTheme } from './internal/types';

/**
 * Theme System Facade
 *
 * Provides a unified interface for all theme operations while
 * keeping internal modules properly separated and modular.
 */
export class ThemeSystem {
    private static instance: ThemeSystem;
    private readonly themeFactory: ThemeFactory;
    private readonly themeComposer: ThemeComposer;
    private readonly themeEnhancer: ThemeEnhancer;
    private readonly pluginManager: IPluginManager;

    private constructor() {
        this.themeFactory = new ThemeFactory();
        this.themeComposer = new ThemeComposer();
        this.themeEnhancer = new ThemeEnhancer();

        // Initialize plugin manager
        const pluginConfig: PluginManagerConfig = {
            enableSandboxing: true,
            maxPluginMemoryUsage: 50 * 1024 * 1024, // 50MB
            pluginTimeout: 5000, // 5 seconds
            allowExternalResources: false,
            autoLoadPlugins: false
        };

        this.pluginManager = new ThemePluginManager(pluginConfig, this);
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
        const enhancedTheme = this.themeEnhancer.enhance(baseTheme);

        // Apply plugins if any are enabled
        return this.pluginManager.applyPlugins(enhancedTheme);
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
     * Get plugin manager for plugin operations
     */
    public getPluginManager(): IPluginManager {
        return this.pluginManager;
    }

    /**
     * Register a theme plugin
     */
    public async registerPlugin(plugin: IThemePlugin): Promise<void> {
        await this.pluginManager.register(plugin);
    }

    /**
     * Unregister a theme plugin
     */
    public async unregisterPlugin(pluginId: string): Promise<void> {
        await this.pluginManager.unregister(pluginId);
    }

    /**
     * Enable a theme plugin
     */
    public async enablePlugin(pluginId: string): Promise<void> {
        await this.pluginManager.enable(pluginId);
    }

    /**
     * Disable a theme plugin
     */
    public async disablePlugin(pluginId: string): Promise<void> {
        await this.pluginManager.disable(pluginId);
    }

    /**
     * Get all registered plugins
     */
    public getPlugins(): IThemePlugin[] {
        return this.pluginManager.getAllPlugins();
    }

    /**
     * Get plugin factory for creating common plugins
     */
    public getPluginFactory(): typeof PluginFactory {
        return PluginFactory;
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
