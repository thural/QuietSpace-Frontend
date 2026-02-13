/**
 * Theme System Facade
 *
 * Single entry point for all theme system functionality.
 * Provides clean API while maintaining internal modularity.
 * Enhanced with plugin architecture support.
 */

import { IThemeComposer, themeComposer } from './internal/composition/ThemeComposer';
import { IThemeEnhancer, themeEnhancer } from './internal/enhancement/ThemeEnhancer';
import { IThemeFactory, themeFactory } from './internal/factories/ThemeFactory';
import {
    ThemePluginManager,
    PluginFactory,
    type IThemePlugin,
    type IPluginManager,
    type PluginManagerConfig
} from './plugins/ThemePluginArchitecture';

import type { ThemeTokens } from './internal/tokens';
import type { EnhancedTheme } from './internal/types';

import { IThemeErrorFactory, themeErrorFactory } from './shared/errors/ThemeErrors';
import { ISmartCache, themeCache } from './shared/caching/SmartCache';

/**
 * Theme System Facade Interface
 */
export interface IThemeSystem {
    createTheme(variant: string, overrides?: Partial<ThemeTokens>): EnhancedTheme;
    registerTheme(name: string, config: Partial<ThemeTokens>): void;
    getAvailableVariants(): string[];
    getFactory(): IThemeFactory;
    getPluginManager(): IPluginManager;
    registerPlugin(plugin: IThemePlugin): Promise<void>;
    unregisterPlugin(pluginId: string): Promise<void>;
    enablePlugin(pluginId: string): Promise<void>;
    disablePlugin(pluginId: string): Promise<void>;
    getPlugins(): IThemePlugin[];
    getPluginFactory(): typeof PluginFactory;
    getComposer(): IThemeComposer;
    getEnhancer(): IThemeEnhancer;
    getCacheMetrics(): any;
    clearCache(): void;
    validateTheme(theme: Partial<ThemeTokens>): Promise<boolean>;
}

/**
 * Theme System Facade Implementation
 * 
 * Provides unified interface for all theme operations while maintaining internal modularity.
 * Enhanced with plugin architecture support and dependency injection.
 */
export class ThemeSystem implements IThemeSystem {
    private static instance: ThemeSystem;
    private readonly themeComposer: IThemeComposer;
    private readonly themeEnhancer: IThemeEnhancer;
    private readonly themeFactory: IThemeFactory;
    private readonly pluginManager: IPluginManager;
    private readonly errorFactory: IThemeErrorFactory;
    private readonly cache: ISmartCache<any>;

    private constructor(
        themeComposerInstance: IThemeComposer = themeComposer,
        themeEnhancerInstance: IThemeEnhancer = themeEnhancer,
        themeFactoryInstance: IThemeFactory = themeFactory,
        errorFactoryInstance: IThemeErrorFactory = themeErrorFactory,
        cacheInstance: ISmartCache<any> = themeCache
    ) {
        this.themeComposer = themeComposerInstance;
        this.themeEnhancer = themeEnhancerInstance;
        this.themeFactory = themeFactoryInstance;
        this.errorFactory = errorFactoryInstance;
        this.cache = cacheInstance;

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
        const startTime = performance.now();

        try {
            // Compose theme
            const composedTheme = this.themeComposer.compose(variant, overrides);

            // Enhance theme
            const enhancedTheme = this.themeEnhancer.enhance(composedTheme);

            // Apply plugins if any are enabled
            const finalTheme = this.pluginManager.applyPlugins(enhancedTheme) as unknown as EnhancedTheme;

            // Log performance warning if slow
            const duration = performance.now() - startTime;
            if (duration > 100) { // 100ms threshold
                console.warn(`Slow theme creation: ${duration.toFixed(2)}ms for variant: ${variant}`);
            }

            return finalTheme;

        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createCompositionError(
                `Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant,
                'createTheme'
            );
        }
    }

    /**
     * Register a new theme variant
     */
    public registerTheme(name: string, config: Partial<ThemeTokens>): void {
        try {
            this.themeComposer.register(name, config);
        } catch (error) {
            if (error instanceof Error && error.name.startsWith('Theme')) {
                throw error;
            }

            throw this.errorFactory.createConfigurationError(
                `Failed to register theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'registerTheme.name',
                name
            );
        }
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
    public getFactory(): IThemeFactory {
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
        try {
            await this.pluginManager.register(plugin);
        } catch (error) {
            throw this.errorFactory.createDependencyError(
                `Failed to register plugin: ${error instanceof Error ? error.message : 'Unknown error'}`,
                plugin.id,
                'ThemeSystem'
            );
        }
    }

    /**
     * Unregister a theme plugin
     */
    public async unregisterPlugin(pluginId: string): Promise<void> {
        try {
            await this.pluginManager.unregister(pluginId);
        } catch (error) {
            throw this.errorFactory.createDependencyError(
                `Failed to unregister plugin: ${error instanceof Error ? error.message : 'Unknown error'}`,
                pluginId,
                'ThemeSystem'
            );
        }
    }

    /**
     * Enable a theme plugin
     */
    public async enablePlugin(pluginId: string): Promise<void> {
        try {
            await this.pluginManager.enable(pluginId);
        } catch (error) {
            throw this.errorFactory.createDependencyError(
                `Failed to enable plugin: ${error instanceof Error ? error.message : 'Unknown error'}`,
                pluginId,
                'ThemeSystem'
            );
        }
    }

    /**
     * Disable a theme plugin
     */
    public async disablePlugin(pluginId: string): Promise<void> {
        try {
            await this.pluginManager.disable(pluginId);
        } catch (error) {
            throw this.errorFactory.createDependencyError(
                `Failed to disable plugin: ${error instanceof Error ? error.message : 'Unknown error'}`,
                pluginId,
                'ThemeSystem'
            );
        }
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
    public getComposer(): IThemeComposer {
        return this.themeComposer;
    }

    /**
     * Get theme enhancer for advanced usage
     */
    public getEnhancer(): IThemeEnhancer {
        return this.themeEnhancer;
    }

    /**
     * Get cache metrics
     */
    public getCacheMetrics(): any {
        return this.cache.getMetrics();
    }

    /**
     * Clear cache
     */
    public clearCache(): void {
        this.cache.clear();
        this.themeComposer.clearCache();
    }

    /**
     * Validate theme asynchronously
     */
    public async validateTheme(theme: Partial<ThemeTokens>): Promise<boolean> {
        try {
            return await this.themeComposer.validateTheme(theme);
        } catch (error) {
            console.error('Theme validation error:', error);
            return false;
        }
    }

    /**
     * Get system health status
     */
    public async getSystemHealth(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        issues: string[];
        metrics: any;
    }> {
        const issues: string[] = [];
        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

        try {
            // Check cache health
            const cacheMetrics = this.cache.getMetrics();
            if (cacheMetrics.hitRate < 0.5) {
                issues.push('Low cache hit rate');
                status = 'degraded';
            }

            // Check theme availability
            const variants = this.getAvailableVariants();
            if (variants.length === 0) {
                issues.push('No theme variants available');
                status = 'unhealthy';
            }

            // Check plugin health
            const plugins = this.getPlugins();
            const failedPlugins = plugins.filter(p => (p as any).status === 'failed');
            if (failedPlugins.length > 0) {
                issues.push(`${failedPlugins.length} plugins failed`);
                if (failedPlugins.length === plugins.length) {
                    status = 'unhealthy';
                } else {
                    status = 'degraded';
                }
            }

            return {
                status,
                issues,
                metrics: {
                    cache: cacheMetrics,
                    variants: variants.length,
                    plugins: {
                        total: plugins.length,
                        failed: failedPlugins.length
                    }
                }
            };

        } catch (error) {
            issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return {
                status: 'unhealthy',
                issues,
                metrics: null
            };
        }
    }
}

/**
 * Export singleton instance for convenience
 */
export const themeSystem = ThemeSystem.getInstance();
