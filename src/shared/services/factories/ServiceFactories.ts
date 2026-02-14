/**
 * Service Factories
 * 
 * Provides factory functions for creating and managing shared services
 * with proper DI integration and enterprise patterns.
 */

import { getThemeHookService } from '../../hooks/ThemeHookService';
import { createFileUploadHookService } from '../../hooks/FileUploadHookService';
import { createComponentHeightHookService } from '../../hooks/ComponentHeightHookService';
import { createNavigationHookService } from '../../hooks/NavigationHookService';
import { createFormInputHookService } from '../../hooks/FormInputHookService';
import { createHoverStateHookService } from '../../hooks/HoverStateHookService';

/**
 * Theme Service Factory
 * 
 * Creates theme service instances with proper configuration
 */
export class ThemeServiceFactory {
    static create() {
        return getThemeHookService();
    }

    static createWithConfig(config: { persistTheme?: boolean; validateTheme?: boolean }) {
        const service = getThemeHookService();
        
        // Apply configuration
        if (config.persistTheme) {
            // Enable theme persistence
            const state = service.getState();
            const savedTheme = localStorage.getItem('app-theme');
            if (savedTheme && savedTheme !== state.theme) {
                service.setThemeMode(savedTheme === 'dark');
            }
        }

        return service;
    }

    static getInstance() {
        return getThemeHookService();
    }
}

/**
 * File Upload Service Factory
 * 
 * Creates file upload service instances with proper configuration
 */
export class FileUploadServiceFactory {
    static create(fetchCallback: (formData: FormData) => Promise<any>) {
        return createFileUploadHookService({ fetchCallback });
    }

    static createWithConfig(config: {
        fetchCallback: (formData: FormData) => Promise<any>;
        maxSize?: number;
        accept?: string;
        multiple?: boolean;
    }) {
        return createFileUploadHookService({ 
            fetchCallback: config.fetchCallback,
            maxSize: config.maxSize,
            accept: config.accept,
            multiple: config.multiple
        });
    }

    static createDefault() {
        return createFileUploadHookService({ 
            fetchCallback: async () => ({ success: true })
        });
    }
}

/**
 * Component Height Service Factory
 * 
 * Creates component height service instances with proper configuration
 */
export class ComponentHeightServiceFactory {
    static create(ref: React.RefObject<HTMLElement>) {
        return createComponentHeightHookService({ ref });
    }

    static createWithConfig(config: {
        ref: React.RefObject<HTMLElement>;
        debounceMs?: number;
        threshold?: number;
    }) {
        return createComponentHeightHookService({ 
            ref: config.ref,
            debounceMs: config.debounceMs || 100,
            threshold: config.threshold || 0
        });
    }
}

/**
 * Navigation Service Factory
 * 
 * Creates navigation service instances with proper configuration
 */
export class NavigationServiceFactory {
    static create() {
        return createNavigationHookService();
    }

    static createWithConfig(config: {
        basePath?: string;
        enableHistory?: boolean;
        maxHistoryLength?: number;
    }) {
        const service = createNavigationHookService();
        
        // Apply configuration
        if (config.basePath) {
            // Set base path for navigation
            service.setBasePath?.(config.basePath);
        }

        return service;
    }

    static createRouter() {
        return createNavigationHookService();
    }
}

/**
 * Form Input Service Factory
 * 
 * Creates form input service instances with proper configuration
 */
export class FormInputServiceFactory {
    static create<T = string>(initialValue: T, options?: { preventDefault?: boolean }) {
        return createFormInputHookService({ initialValue, options });
    }

    static createWithValidation<T = string>(
        initialValue: T,
        options: {
            preventDefault?: boolean;
            validator?: (value: T) => string | null;
            sanitize?: (value: T) => T;
        }
    ) {
        const service = createFormInputHookService({ initialValue, options });
        
        // Add validation if provided
        if (options.validator) {
            service.setValidator?.(options.validator);
        }

        // Add sanitization if provided
        if (options.sanitize) {
            service.setSanitizer?.(options.sanitize);
        }

        return service;
    }

    static createDefault<T = string>() {
        return createFormInputHookService({ 
            initialValue: '' as T, 
            options: { preventDefault: true } 
        });
    }
}

/**
 * Hover State Service Factory
 * 
 * Creates hover state service instances with proper configuration
 */
export class HoverStateServiceFactory {
    static create() {
        return createHoverStateHookService();
    }

    static createWithConfig(config: {
        debounceMs?: number;
        enableTouch?: boolean;
    }) {
        const service = createHoverStateHookService();
        
        // Apply configuration
        if (config.debounceMs) {
            service.setDebounceMs?.(config.debounceMs);
        }

        if (config.enableTouch) {
            service.setEnableTouch?.(true);
        }

        return service;
    }

    static createTouchEnabled() {
        return createHoverStateHookService();
    }
}

/**
 * Service Factory Registry
 * 
 * Central registry for all service factories
 */
export class ServiceFactoryRegistry {
    private static factories = new Map<string, any>();

    static register<T>(name: string, factory: () => T): void {
        this.factories.set(name, factory);
    }

    static create<T>(name: string): T {
        const factory = this.factories.get(name);
        if (!factory) {
            throw new Error(`Service factory '${name}' not found`);
        }
        return factory();
    }

    static has(name: string): boolean {
        return this.factories.has(name);
    }

    static getRegistered(): string[] {
        return Array.from(this.factories.keys());
    }
}

// Register default factories
ServiceFactoryRegistry.register('theme', () => ThemeServiceFactory.create());
ServiceFactoryRegistry.register('fileUpload', () => FileUploadServiceFactory.createDefault());
ServiceFactoryRegistry.register('componentHeight', () => ComponentHeightServiceFactory.create({ ref: { current: null } }));
ServiceFactoryRegistry.register('navigation', () => NavigationServiceFactory.create());
ServiceFactoryRegistry.register('formInput', () => FormInputServiceFactory.createDefault());
ServiceFactoryRegistry.register('hoverState', () => HoverStateServiceFactory.create());

export default ServiceFactoryRegistry;
