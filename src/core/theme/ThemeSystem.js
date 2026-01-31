/**
 * Theme System Facade.
 * 
 * Single entry point for all theme system functionality.
 * Provides clean API while maintaining internal modularity.
 */

import { ThemeFactory } from './internal/factories/ThemeFactory.js';
import { ThemeComposer } from './internal/composition/ThemeComposer.js';
import { ThemeEnhancer } from './internal/enhancement/ThemeEnhancer.js';

/**
 * Theme System Facade
 * 
 * Provides a unified interface for all theme operations while
 * keeping internal modules properly separated and modular.
 */
export class ThemeSystem {
    /** @type {ThemeSystem|null} */
    static #instance = null;
    /** @type {ThemeFactory} */
    #themeFactory;
    /** @type {ThemeComposer} */
    #themeComposer;
    /** @type {ThemeEnhancer} */
    #themeEnhancer;

    constructor() {
        this.#themeFactory = new ThemeFactory();
        this.#themeComposer = new ThemeComposer();
        this.#themeEnhancer = new ThemeEnhancer();
    }

    /**
     * Get singleton instance
     * @returns {ThemeSystem}
     */
    static getInstance() {
        if (!ThemeSystem.#instance) {
            ThemeSystem.#instance = new ThemeSystem();
        }
        return ThemeSystem.#instance;
    }

    /**
     * Create a theme with optional overrides
     * @param {string} variant 
     * @param {Object} [overrides] 
     * @returns {Object} Enhanced theme
     */
    createTheme(variant, overrides) {
        const baseTheme = this.#themeComposer.compose(variant, overrides);
        return this.#themeEnhancer.enhance(baseTheme);
    }

    /**
     * Register a new theme variant
     * @param {string} name 
     * @param {Object} config 
     * @returns {void}
     */
    registerTheme(name, config) {
        this.#themeComposer.register(name, config);
    }

    /**
     * Get available theme variants
     * @returns {string[]} Available variants
     */
    getAvailableVariants() {
        return this.#themeComposer.getRegisteredVariants();
    }

    /**
     * Get theme factory for advanced usage
     * @returns {ThemeFactory} Theme factory
     */
    getFactory() {
        return this.#themeFactory;
    }

    /**
     * Get theme composer for advanced usage
     * @returns {ThemeComposer} Theme composer
     */
    getComposer() {
        return this.#themeComposer;
    }

    /**
     * Get theme enhancer for advanced usage
     * @returns {ThemeEnhancer} Theme enhancer
     */
    getEnhancer() {
        return this.#themeEnhancer;
    }

    /**
     * Reset theme system to defaults
     * @returns {void}
     */
    reset() {
        this.#themeComposer.reset();
        this.#themeEnhancer.reset();
    }

    /**
     * Get current theme configuration
     * @returns {Object} Current theme configuration
     */
    getCurrentTheme() {
        return this.#themeComposer.getCurrentTheme();
    }

    /**
     * Set current theme
     * @param {string} variant 
     * @param {Object} [overrides] 
     * @returns {Object} Enhanced theme
     */
    setCurrentTheme(variant, overrides) {
        const theme = this.createTheme(variant, overrides);
        this.#themeComposer.setCurrentTheme(theme);
        return theme;
    }

    /**
     * Get theme metrics
     * @returns {Object} Theme metrics
     */
    getMetrics() {
        return {
            registeredVariants: this.getAvailableVariants().length,
            currentVariant: this.#themeComposer.getCurrentVariant(),
            factoryMetrics: this.#themeFactory.getMetrics(),
            composerMetrics: this.#themeComposer.getMetrics(),
            enhancerMetrics: this.#themeEnhancer.getMetrics()
        };
    }

    /**
     * Validate theme configuration
     * @param {Object} config 
     * @returns {boolean} True if valid
     */
    validateTheme(config) {
        return this.#themeComposer.validate(config);
    }

    /**
     * Get theme by variant name
     * @param {string} variant 
     * @param {Object} [overrides] 
     * @returns {Object} Enhanced theme
     */
    getTheme(variant, overrides) {
        return this.createTheme(variant, overrides);
    }

    /**
     * Check if variant exists
     * @param {string} variant 
     * @returns {boolean} True if exists
     */
    hasVariant(variant) {
        return this.getAvailableVariants().includes(variant);
    }

    /**
     * Remove theme variant
     * @param {string} variant 
     * @returns {boolean} True if removed
     */
    removeVariant(variant) {
        return this.#themeComposer.unregister(variant);
    }

    /**
     * Clone theme system instance
     * @returns {ThemeSystem} New instance
     */
    clone() {
        const newInstance = new ThemeSystem();
        // Copy current state
        const currentTheme = this.getCurrentTheme();
        if (currentTheme) {
            newInstance.setCurrentTheme(currentTheme.variant || 'default', currentTheme);
        }
        return newInstance;
    }

    /**
     * Export theme configuration
     * @param {string} variant 
     * @returns {string} JSON configuration
     */
    exportTheme(variant) {
        const theme = this.getTheme(variant);
        return JSON.stringify(theme, null, 2);
    }

    /**
     * Import theme configuration
     * @param {string} jsonConfig 
     * @returns {boolean} True if imported successfully
     */
    importTheme(jsonConfig) {
        try {
            const config = JSON.parse(jsonConfig);
            this.registerTheme(config.name || 'imported', config);
            return true;
        } catch (error) {
            console.error('Failed to import theme configuration:', error);
            return false;
        }
    }

    /**
     * Get theme system health status
     * @returns {Object} Health status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            instance: !!ThemeSystem.#instance,
            factory: !!this.#themeFactory,
            composer: !!this.#themeComposer,
            enhancer: !!this.#themeEnhancer,
            variants: this.getAvailableVariants().length,
            currentTheme: !!this.getCurrentTheme()
        };
    }
}
