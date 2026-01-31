/**
 * Theme System Dependency Injection Container.
 * 
 * Manages dependencies and provides inversion of control for theme system.
 * Enables loose coupling and easier testing.
 */

import { ThemeFactory } from '../internal/factories/ThemeFactory.js';
import { ThemeComposer } from '../internal/composition/ThemeComposer.js';
import { ThemeEnhancer } from '../internal/enhancement/ThemeEnhancer.js';

/**
 * Theme dependency identifiers
 * @type {Readonly<Object.<string, string>>}
 */
export const THEME_TOKENS = Object.freeze({
    THEME_FACTORY: 'ThemeFactory',
    THEME_COMPOSER: 'ThemeComposer',
    THEME_ENHANCER: 'ThemeEnhancer',
    THEME_SYSTEM: 'ThemeSystem'
});

/**
 * Theme dependency injection container
 * @class ThemeContainer
 * @description Dependency injection container for theme system
 */
export class ThemeContainer {
    /** @type {ThemeContainer|null} */
    static _instance = null;

    constructor() {
        this.services = new Map();
        this.factories = new Map();
        this.registerDefaultServices();
    }

    /**
     * Get singleton instance
     * @returns {ThemeContainer} Singleton instance
     * @description Get singleton instance
     */
    static getInstance() {
        if (!ThemeContainer._instance) {
            ThemeContainer._instance = new ThemeContainer();
        }
        return ThemeContainer._instance;
    }

    /**
     * Register a service factory
     * @param {string} token - Service token
     * @param {Function} factory - Service factory function
     * @returns {void}
     * @description Register a service factory
     */
    register(token, factory) {
        this.factories.set(token, factory);
    }

    /**
     * Register a service instance
     * @param {string} token - Service token
     * @param {any} instance - Service instance
     * @returns {void}
     * @description Register a service instance
     */
    registerInstance(token, instance) {
        this.services.set(token, instance);
    }

    /**
     * Resolve a service
     * @param {string} token - Service token
     * @returns {any} Service instance
     * @description Resolve a service
     */
    resolve(token) {
        // Check if instance exists
        if (this.services.has(token)) {
            return this.services.get(token);
        }

        // Check if factory exists
        if (this.factories.has(token)) {
            const factory = this.factories.get(token);
            const instance = factory();
            this.services.set(token, instance);
            return instance;
        }

        throw new Error(`Service not registered for token: ${token}`);
    }

    /**
     * Check if service is registered
     * @param {string} token - Service token
     * @returns {boolean} True if registered
     * @description Check if service is registered
     */
    isRegistered(token) {
        return this.services.has(token) || this.factories.has(token);
    }

    /**
     * Clear all services (useful for testing)
     * @returns {void}
     * @description Clear all services
     */
    clear() {
        this.services.clear();
        this.factories.clear();
        this.registerDefaultServices();
    }

    /**
     * Register default services
     * @returns {void}
     * @description Register default services
     */
    registerDefaultServices() {
        // Register factories
        this.register(THEME_TOKENS.THEME_FACTORY, () => new ThemeFactory());
        this.register(THEME_TOKENS.THEME_COMPOSER, () => new ThemeComposer());
        this.register(THEME_TOKENS.THEME_ENHANCER, () => new ThemeEnhancer());
    }
}

/**
 * Global theme container instance
 * @type {ThemeContainer}
 * @description Global theme container instance
 */
export const themeContainer = ThemeContainer.getInstance();
