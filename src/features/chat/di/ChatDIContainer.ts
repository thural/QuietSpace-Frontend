/**
 * Chat DI Container.
 * 
 * Dependency injection container for Chat feature.
 * Manages repository and service dependencies.
 */

import type { IChatRepository } from "@chat/domain/entities/IChatRepository";
import { ChatRepository } from "@chat/data/repositories/ChatRepository";
import { MockChatRepository } from "@chat/data/repositories/MockChatRepository";
import { WebSocketService } from "@chat/data/services/WebSocketService";
import { ChatDataService } from "@chat/data/services/ChatDataService";
import { ChatFeatureService } from "@chat/application/services/ChatFeatureService";
import { ChatMetricsService } from "@chat/application/services/ChatMetricsService";
import { ChatPresenceService } from "@chat/application/services/ChatPresenceService";
import { ChatAnalyticsService } from "@chat/application/services/ChatAnalyticsService";
import { CacheProvider } from '@/core/cache';
import { useAuthStore } from "@core/store/zustand";

/**
 * DI Container configuration options.
 */
export interface DIContainerConfig {
    useMockRepositories?: boolean;
    enableLogging?: boolean;
}

/**
 * Chat DI Container.
 * 
 * Manages dependency registration and resolution for Chat feature.
 */
export class ChatDIContainer {
    private repositories: Map<string, IChatRepository> = new Map();
    private services: Map<string, any> = new Map();
    private webSocketService: WebSocketService | null = null;
    private cache: CacheProvider;
    private config: DIContainerConfig;

    constructor(config: DIContainerConfig = {}) {
        this.config = {
            useMockRepositories: false,
            enableLogging: true,
            ...config
        };
        
        // Initialize cache first
        this.cache = new CacheProvider();
        
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
                enableLogging: this.config.enableLogging
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
        // Register WebSocket service
        this.webSocketService = new WebSocketService(this.cache);
        this.services.set('webSocketService', this.webSocketService);
        
        // Register Chat data service
        const chatRepository = this.repositories.get('chat');
        if (chatRepository) {
            const chatDataService = new ChatDataService(this.cache, chatRepository, this.webSocketService);
            this.services.set('chatDataService', chatDataService);
            
            // Register Chat feature service
            const chatFeatureService = new ChatFeatureService(chatDataService);
            this.services.set('chatFeatureService', chatFeatureService);
            
            // Register Chat metrics service
            const chatMetricsService = new ChatMetricsService(this.cache);
            this.services.set('chatMetricsService', chatMetricsService);
            
            // Register Chat presence service
            const chatPresenceService = new ChatPresenceService(this.webSocketService, this.cache, chatMetricsService);
            this.services.set('chatPresenceService', chatPresenceService);
            
            // Register Chat analytics service
            const chatAnalyticsService = new ChatAnalyticsService(this.cache, chatMetricsService);
            this.services.set('chatAnalyticsService', chatAnalyticsService);
            
            // Legacy service registration
            this.services.set('chatService', chatRepository);
            
            if (this.config.enableLogging) {
                console.log('ChatDIContainer: Registered ChatService');
                console.log('ChatDIContainer: Registered ChatDataService');
                console.log('ChatDIContainer: Registered ChatFeatureService');
                console.log('ChatDIContainer: Registered ChatMetricsService');
                console.log('ChatDIContainer: Registered ChatPresenceService');
                console.log('ChatDIContainer: Registered ChatAnalyticsService');
                console.log('ChatDIContainer: Registered WebSocketService');
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
     * Get WebSocket service.
     */
    getWebSocketService(): WebSocketService {
        return this.getService<WebSocketService>('webSocketService');
    }

    /**
     * Get Chat analytics service.
     */
    getChatAnalyticsService(): ChatAnalyticsService {
        return this.getService<ChatAnalyticsService>('chatAnalyticsService');
    }

    /**
     * Get Chat presence service.
     */
    getChatPresenceService(): ChatPresenceService {
        return this.getService<ChatPresenceService>('chatPresenceService');
    }

    /**
     * Get Chat metrics service.
     */
    getChatMetricsService(): ChatMetricsService {
        return this.getService<ChatMetricsService>('chatMetricsService');
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
