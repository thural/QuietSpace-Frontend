/**
 * Chat DI Container.
 * 
 * Dependency injection container for Chat feature.
 * Manages repository and service dependencies.
 */

import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
import { ChatRepository } from "@chat/data/repositories/ChatRepository";
import { MockChatRepository } from "@chat/data/repositories/MockChatRepository";
import { useAuthStore } from "@services/store/zustand";

/**
 * DI Container configuration options.
 */
export interface DIContainerConfig {
    useMockRepositories?: boolean;
    enableLogging?: boolean;
    useReactQuery?: boolean; // New option to enable/disable React Query
}

/**
 * Chat DI Container.
 * 
 * Manages dependency registration and resolution for Chat feature.
 */
export class ChatDIContainer {
    private repositories: Map<string, IChatRepository> = new Map();
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
            console.log('ChatDIContainer: Dependencies initialized', {
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
            this.repositories.set('chat', new MockChatRepository(token));
            
            if (this.config.enableLogging) {
                console.log('ChatDIContainer: Registered MockChatRepository');
            }
        } else {
            this.repositories.set('chat', new ChatRepository(token));
            
            if (this.config.enableLogging) {
                console.log('ChatDIContainer: Registered ChatRepository');
            }
        }
    }

    /**
     * Register services.
     */
    private registerServices(): void {
        // Chat services can be registered here
        // For now, we'll register the repository as a service
        const chatRepository = this.repositories.get('chat');
        
        if (chatRepository) {
            this.services.set('chatService', chatRepository);
            
            if (this.config.enableLogging) {
                console.log('ChatDIContainer: Registered ChatService');
            }
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
     * Get chat repository.
     */
    getChatRepository(): IChatRepository {
        return this.getRepository<IChatRepository>('chat');
    }

    /**
     * Get chat service.
     */
    getChatService(): any {
        return this.getService<any>('chatService');
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
            console.log('ChatDIContainer: Configuration updated', this.config);
        }
    }

    /**
     * Clear all dependencies.
     */
    clear(): void {
        this.repositories.clear();
        this.services.clear();
        
        if (this.config.enableLogging) {
            console.log('ChatDIContainer: All dependencies cleared');
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

    /**
     * Get authentication token from store.
     */
    private getAuthToken(): string | null {
        try {
            const authStore = useAuthStore.getState();
            return authStore.data.accessToken || null;
        } catch (error) {
            if (this.config.enableLogging) {
                console.error('ChatDIContainer: Error getting auth token', error);
            }
            return null;
        }
    }
}
