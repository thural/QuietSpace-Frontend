/**
 * Theme System Dependency Injection Container.
 *
 * Manages dependencies and provides inversion of control for theme system.
 * Enables loose coupling and easier testing.
 */

import { ThemeComposer } from '../internal/composition/ThemeComposer';
import { ThemeEnhancer } from '../internal/enhancement/ThemeEnhancer';
import { ThemeFactory } from '../internal/factories/ThemeFactory';

/**
 * Theme dependency identifiers
 */
export enum THEME_TOKENS {
    THEME_FACTORY = 'ThemeFactory',
    THEME_COMPOSER = 'ThemeComposer',
    THEME_ENHANCER = 'ThemeEnhancer',
    THEME_SYSTEM = 'ThemeSystem'
}

/**
 * Theme dependency injection container
 */
export class ThemeContainer {
    private static instance: ThemeContainer;
    private readonly services = new Map<THEME_TOKENS, any>();
    private readonly factories = new Map<THEME_TOKENS, () => any>();

    private constructor() {
        this.registerDefaultServices();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ThemeContainer {
        if (!ThemeContainer.instance) {
            ThemeContainer.instance = new ThemeContainer();
        }
        return ThemeContainer.instance;
    }

    /**
     * Register a service factory
     */
    public register<T>(token: THEME_TOKENS, factory: () => T): void {
        this.factories.set(token, factory);
    }

    /**
     * Register a service instance
     */
    public registerInstance<T>(token: THEME_TOKENS, instance: T): void {
        this.services.set(token, instance);
    }

    /**
     * Resolve a service
     */
    public resolve<T>(token: THEME_TOKENS): T {
        // Check if instance exists
        if (this.services.has(token)) {
            return this.services.get(token);
        }

        // Check if factory exists
        if (this.factories.has(token)) {
            const factory = this.factories.get(token)!;
            const instance = factory();
            this.services.set(token, instance);
            return instance;
        }

        throw new Error(`Service not registered for token: ${token}`);
    }

    /**
     * Check if service is registered
     */
    public isRegistered(token: THEME_TOKENS): boolean {
        return this.services.has(token) || this.factories.has(token);
    }

    /**
     * Clear all services (useful for testing)
     */
    public clear(): void {
        this.services.clear();
        this.factories.clear();
        this.registerDefaultServices();
    }

    /**
     * Register default services
     */
    private registerDefaultServices(): void {
        // Register factories
        this.register(THEME_TOKENS.THEME_FACTORY, () => new ThemeFactory());
        this.register(THEME_TOKENS.THEME_COMPOSER, () => new ThemeComposer());
        this.register(THEME_TOKENS.THEME_ENHANCER, () => new ThemeEnhancer());
    }
}

/**
 * Global theme container instance
 */
export const themeContainer = ThemeContainer.getInstance();
