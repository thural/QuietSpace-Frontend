/**
 * Settings DI Container.
 * 
 * Dependency injection container for Settings feature.
 * Manages repository and service dependencies.
 */

import type { ISettingsRepository } from "../domain/entities/SettingsRepository";
import { SettingsRepository } from "../data/repositories/SettingsRepository";
import { MockSettingsRepository } from "../data/repositories/MockSettingsRepository";
import { SettingsService, type ISettingsService } from "../application/services/SettingsService";
import { useAuthStore } from '@services/store/zustand';

/**
 * DI Container configuration options.
 */
export interface DIContainerConfig {
    useMockRepositories?: boolean;
    enableLogging?: boolean;
    useReactQuery?: boolean; // New option to enable/disable React Query
}

/**
 * Settings DI Container.
 * 
 * Manages dependency registration and resolution for Settings feature.
 */
export class SettingsDIContainer {
    private repositories: Map<string, ISettingsRepository> = new Map();
    private services: Map<string, any> = new Map();
    private config: DIContainerConfig;

    constructor(config: DIContainerConfig = {}) {
        this.config = {
            useMockRepositories: false,
            enableLogging: true,
            useReactQuery: false,
            ...config
        };
        
        this.initializeDependencies();
    }

    /**
     * Initialize all dependencies.
     */
    private initializeDependencies(): void {
        this.registerRepositories();
        this.registerServices();
        
        if (this.config.enableLogging) {
            console.log('SettingsDIContainer: Dependencies initialized', {
                useMockRepositories: this.config.useMockRepositories,
                enableLogging: this.config.enableLogging,
                useReactQuery: this.config.useReactQuery
            });
        }
    }

    /**
     * Register repositories.
     */
    private registerRepositories(): void {
        const token = this.getAuthToken();
        
        if (this.config.useMockRepositories) {
            this.repositories.set('settings', new MockSettingsRepository(token));
            
            if (this.config.enableLogging) {
                console.log('SettingsDIContainer: Registered MockSettingsRepository');
            }
        } else {
            this.repositories.set('settings', new SettingsRepository(token));
            
            if (this.config.enableLogging) {
                console.log('SettingsDIContainer: Registered SettingsRepository');
            }
        }
    }

    /**
     * Register services.
     */
    private registerServices(): void {
        const settingsRepository = this.repositories.get('settings');
        
        if (!settingsRepository) {
            throw new Error('Settings repository not found. Make sure repositories are registered first.');
        }

        this.services.set('settingsService', new SettingsService(settingsRepository));
        
        if (this.config.enableLogging) {
            console.log('SettingsDIContainer: Registered SettingsService');
        }
    }

    /**
     * Get repository by name.
     */
    getRepository<T>(name: string): T {
        const repository = this.repositories.get(name);
        if (!repository) {
            throw new Error(`Repository '${name}' not found in DI container`);
        }
        return repository as T;
    }

    /**
     * Get service by name.
     */
    getService<T>(name: string): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service '${name}' not found in DI container`);
        }
        return service as T;
    }

    /**
     * Get settings repository.
     */
    getSettingsRepository(): ISettingsRepository {
        return this.getRepository<ISettingsRepository>('settings');
    }

    /**
     * Get settings service.
     */
    getSettingsService(): ISettingsService {
        return this.getService<ISettingsService>('settingsService');
    }

    /**
     * Get container configuration.
     */
    getConfig(): DIContainerConfig {
        return this.config;
    }

    /**
     * Update configuration.
     */
    updateConfig(newConfig: Partial<DIContainerConfig>): void {
        this.config = { ...this.config, ...newConfig };
        
        if (this.config.enableLogging) {
            console.log('SettingsDIContainer: Configuration updated', this.config);
        }
    }

    /**
     * Get authentication token from store.
     */
    private getAuthToken(): string | null {
        try {
            const authStore = useAuthStore.getState();
            return authStore.data.accessToken || null;
        } catch (error) {
            if (this.config.enableLogging) {
                console.error('SettingsDIContainer: Error getting auth token', error);
            }
            return null;
        }
    }

    /**
     * Clear all dependencies.
     */
    clear(): void {
        this.repositories.clear();
        this.services.clear();
        
        if (this.config.enableLogging) {
            console.log('SettingsDIContainer: All dependencies cleared');
        }
    }

    /**
     * Reinitialize dependencies with new configuration.
     */
    reinitialize(newConfig?: Partial<DIContainerConfig>): void {
        this.clear();
        
        if (newConfig) {
            this.config = { ...this.config, ...newConfig };
        }
        
        this.initializeDependencies();
    }
}
