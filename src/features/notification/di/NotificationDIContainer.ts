/**
 * Notification DI Container.
 * 
 * Dependency injection container for Notification feature.
 * Manages repository and service dependencies.
 */

import type { INotificationRepository } from "../domain/entities/INotificationRepository";
import { NotificationRepository } from "../data/repositories/NotificationRepository";
import { MockNotificationRepository } from "../data/repositories/MockNotificationRepository";
import { TYPES } from '@/core/modules/dependency-injection/types';
import type { Container } from '@core/di/container';

/**
 * DI Container configuration options.
 */
export interface DIContainerConfig {
    useMockRepositories?: boolean;
    enableLogging?: boolean;
    // useReactQuery removed - migrated to enterprise hooks
}

/**
 * Notification DI Container.
 * 
 * Manages dependency registration and resolution for Notification feature.
 */
export class NotificationDIContainer {
    private repositories: Map<string, INotificationRepository> = new Map();
    private services: Map<string, any> = new Map();
    private config: DIContainerConfig;
    private mainContainer: Container;

    constructor(mainContainer: Container, config: DIContainerConfig = {}) {
        this.mainContainer = mainContainer;
        this.config = {
            useMockRepositories: false,
            enableLogging: true,
            // useReactQuery removed - migrated to enterprise hooks
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
            console.log('NotificationDIContainer: Dependencies initialized with config:', this.config);
        }
    }

    /**
     * Register repositories.
     */
    private registerRepositories(): void {
        const token = this.getAuthToken();

        // Register notification repository
        if (this.config.useMockRepositories) {
            this.repositories.set('notification', new MockNotificationRepository(token));
        } else {
            this.repositories.set('notification', new NotificationRepository(token));
        }
    }

    /**
     * Register services.
     */
    private registerServices(): void {
        // Services can be registered here when needed
        // For now, we're focusing on the repository pattern
    }

    /**
     * Get notification repository.
     */
    getNotificationRepository(): INotificationRepository {
        const repository = this.repositories.get('notification');
        if (!repository) {
            throw new Error('Notification repository not found');
        }
        return repository;
    }

    /**
     * Get service by name.
     */
    getService<T>(name: string): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }
        return service as T;
    }

    /**
     * Get current configuration.
     */
    getConfig(): DIContainerConfig {
        return { ...this.config };
    }

    /**
     * Update configuration.
     */
    updateConfig(newConfig: Partial<DIContainerConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.repositories.clear();
        this.services.clear();
        this.initializeDependencies();
    }

    /**
     * Get authentication token from DI container.
     */
    private getAuthToken(): string {
        try {
            const authService = this.mainContainer.getByToken(TYPES.AUTH_SERVICE);
            const session = authService.getCurrentSession?.();
            return session?.token.accessToken || '';
        } catch (error) {
            console.error('NotificationDIContainer: Error getting auth token', error);
            return '';
        }
    }

    /**
     * Get authentication data for hooks.
     */
    public getAuthData() {
        const token = this.getAuthToken();
        return {
            accessToken: token,
            isAuthenticated: !!token,
            userId: token ? 'current-user' : null // TODO: Extract from token properly
        };
    }

    /**
     * Check if using mock repositories.
     */
    isUsingMockRepositories(): boolean {
        return this.config.useMockRepositories || false;
    }

    /**
     * Check if React Query is enabled.
     * REMOVED - Migrated to enterprise hooks
     */
    isReactQueryEnabled(): boolean {
        return false; // Always false - migrated to enterprise hooks
    }

    /**
     * Check if logging is enabled.
     */
    isLoggingEnabled(): boolean {
        return this.config.enableLogging || false;
    }
}
