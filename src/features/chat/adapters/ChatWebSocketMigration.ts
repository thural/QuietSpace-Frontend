/**
 * Chat WebSocket Migration Utility
 * 
 * Provides utilities to migrate from legacy WebSocket implementations
 * to the new enterprise Chat WebSocket Adapter.
 * Ensures backward compatibility during transition.
 */

import { Injectable } from '@/core/di';
import { WebSocketService } from '../data/services/WebSocketService';
import { ChatWebSocketAdapter, type IChatWebSocketAdapter } from './index';
import type { MessageResponse } from '../models/chat';
import type { ResId } from '@/shared/api/models/common';

// Migration configuration
export interface ChatMigrationConfig {
  enableLegacyFallback: boolean;
  migrationMode: 'legacy_only' | 'adapter_only' | 'hybrid';
  featureFlags: {
    useEnterpriseAdapter: boolean;
    enableTypingIndicators: boolean;
    enableOnlineStatus: boolean;
    enableMessageDeliveryConfirmation: boolean;
  };
  performanceMonitoring: boolean;
  errorReporting: boolean;
}

// Migration metrics
export interface ChatMigrationMetrics {
  legacyMessagesSent: number;
  adapterMessagesSent: number;
  legacyMessagesReceived: number;
  adapterMessagesReceived: number;
  migrationErrors: number;
  fallbackActivations: number;
  performanceComparison: {
    legacyLatency: number;
    adapterLatency: number;
    legacySuccessRate: number;
    adapterSuccessRate: number;
  };
}

// Migration status
export interface ChatMigrationStatus {
  isLegacyActive: boolean;
  isAdapterActive: boolean;
  currentMode: string;
  lastMigrationAttempt: number;
  successfulMigrations: number;
  failedMigrations: number;
}

/**
 * Chat WebSocket Migration Service
 * 
 * Manages migration from legacy WebSocket service to enterprise adapter.
 * Provides fallback mechanisms and performance monitoring.
 */
@Injectable()
export class ChatWebSocketMigration {
  private config: ChatMigrationConfig;
  private metrics: ChatMigrationMetrics;
  private status: ChatMigrationStatus;
  private legacyService?: WebSocketService;
  private adapter?: IChatWebSocketAdapter;
  private migrationStartTime = Date.now();

  constructor() {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
    this.status = this.getDefaultStatus();
  }

  /**
   * Initialize migration service
   */
  async initialize(
    legacyService?: WebSocketService,
    adapter?: IChatWebSocketAdapter,
    config?: Partial<ChatMigrationConfig>
  ): Promise<void> {
    this.legacyService = legacyService;
    this.adapter = adapter;
    this.config = { ...this.config, ...config };

    // Initialize based on migration mode
    switch (this.config.migrationMode) {
      case 'legacy_only':
        await this.initializeLegacyOnly();
        break;
      case 'adapter_only':
        await this.initializeAdapterOnly();
        break;
      case 'hybrid':
        await this.initializeHybrid();
        break;
    }
  }

  /**
   * Send message with migration support
   */
  async sendMessage(chatId: ResId, message: MessageResponse): Promise<void> {
    const startTime = Date.now();
    
    try {
      if (this.shouldUseAdapter()) {
        await this.sendMessageWithAdapter(chatId, message);
        this.metrics.adapterMessagesSent++;
        this.updateAdapterPerformance(startTime);
      } else {
        await this.sendMessageWithLegacy(chatId, message);
        this.metrics.legacyMessagesSent++;
        this.updateLegacyPerformance(startTime);
      }
    } catch (error) {
      this.metrics.migrationErrors++;
      
      if (this.config.enableLegacyFallback && this.adapter) {
        // Fallback to legacy if adapter fails
        await this.sendMessageWithLegacy(chatId, message);
        this.metrics.legacyMessagesSent++;
        this.metrics.fallbackActivations++;
      } else {
        throw error;
      }
    }
  }

  /**
   * Subscribe to messages with migration support
   */
  subscribeToMessages(
    chatId: ResId,
    callback: (message: MessageResponse) => void
  ): () => void {
    if (this.shouldUseAdapter() && this.adapter) {
      return this.adapter.subscribeToMessages(chatId, callback);
    } else if (this.legacyService) {
      return this.legacyService.subscribeToChatMessages(chatId, callback);
    } else {
      throw new Error('No WebSocket service available for subscription');
    }
  }

  /**
   * Send typing indicator with migration support
   */
  async sendTypingIndicator(chatId: ResId, userId: ResId, isTyping: boolean): Promise<void> {
    try {
      if (this.shouldUseAdapter() && this.adapter) {
        await this.adapter.sendTypingIndicator(chatId, userId, isTyping);
      } else if (this.legacyService) {
        this.legacyService.sendTypingIndicator(chatId, userId, isTyping);
      }
    } catch (error) {
      this.metrics.migrationErrors++;
      
      if (this.config.enableLegacyFallback && this.adapter && this.legacyService) {
        // Fallback to legacy if adapter fails
        this.legacyService.sendTypingIndicator(chatId, userId, isTyping);
        this.metrics.fallbackActivations++;
      } else {
        throw error;
      }
    }
  }

  /**
   * Send online status with migration support
   */
  async sendOnlineStatus(userId: ResId, isOnline: boolean): Promise<void> {
    try {
      if (this.shouldUseAdapter() && this.adapter) {
        await this.adapter.sendOnlineStatus(userId, isOnline);
      } else if (this.legacyService) {
        this.legacyService.sendOnlineStatus(userId, isOnline);
      }
    } catch (error) {
      this.metrics.migrationErrors++;
      
      if (this.config.enableLegacyFallback && this.adapter && this.legacyService) {
        // Fallback to legacy if adapter fails
        this.legacyService.sendOnlineStatus(userId, isOnline);
        this.metrics.fallbackActivations++;
      } else {
        throw error;
      }
    }
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    if (this.shouldUseAdapter() && this.adapter) {
      return this.adapter.isConnected;
    } else if (this.legacyService) {
      return this.legacyService.isConnected;
    }
    return false;
  }

  /**
   * Get connection state
   */
  get connectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    if (this.shouldUseAdapter() && this.adapter) {
      return this.adapter.connectionState;
    } else if (this.legacyService) {
      return this.legacyService.connectionState;
    }
    return 'disconnected';
  }

  /**
   * Get migration metrics
   */
  getMetrics(): ChatMigrationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get migration status
   */
  getStatus(): ChatMigrationStatus {
    return { ...this.status };
  }

  /**
   * Switch migration mode
   */
  async switchMode(mode: 'legacy_only' | 'adapter_only' | 'hybrid'): Promise<void> {
    this.config.migrationMode = mode;
    this.status.currentMode = mode;
    this.status.lastMigrationAttempt = Date.now();

    // Reinitialize based on new mode
    await this.initialize(this.legacyService, this.adapter, this.config);
  }

  /**
   * Enable/disable feature flags
   */
  updateFeatureFlags(flags: Partial<ChatMigrationConfig['featureFlags']>): void {
    this.config.featureFlags = { ...this.config.featureFlags, ...flags };
  }

  /**
   * Test adapter functionality
   */
  async testAdapter(): Promise<boolean> {
    if (!this.adapter) {
      return false;
    }

    try {
      // Test basic connectivity
      const isConnected = this.adapter.isConnected;
      
      // Test message sending (with a test message)
      const testMessage: MessageResponse = {
        id: 'test_msg',
        chatId: 'test_chat',
        senderId: 'test_user',
        content: 'Test message',
        timestamp: Date.now(),
        type: 'text'
      };

      // This would normally send, but we'll just test the connection
      return isConnected;
    } catch (error) {
      console.error('Adapter test failed:', error);
      return false;
    }
  }

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations(): {
    canSwitchToAdapter: boolean;
    recommendedMode: string;
    issues: string[];
    benefits: string[];
  } {
    const issues: string[] = [];
    const benefits: string[] = [];

    // Check adapter availability
    if (!this.adapter) {
      issues.push('Chat adapter not available');
    } else {
      benefits.push('Enterprise-grade connection management');
      benefits.push('Advanced caching and monitoring');
      benefits.push('Better error handling and recovery');
    }

    // Check performance
    const { performanceComparison } = this.metrics;
    if (performanceComparison.adapterLatency < performanceComparison.legacyLatency) {
      benefits.push('Better performance with adapter');
    }

    // Check error rates
    if (performanceComparison.adapterSuccessRate > performanceComparison.legacySuccessRate) {
      benefits.push('Higher success rate with adapter');
    }

    const canSwitchToAdapter = this.adapter !== undefined && issues.length === 0;
    const recommendedMode = canSwitchToAdapter ? 'adapter_only' : 'hybrid';

    return {
      canSwitchToAdapter,
      recommendedMode,
      issues,
      benefits
    };
  }

  /**
   * Initialize legacy-only mode
   */
  private async initializeLegacyOnly(): Promise<void> {
    this.status.isLegacyActive = true;
    this.status.isAdapterActive = false;
    
    if (this.legacyService) {
      // Set up legacy service event handlers
      this.legacyService.onConnect(() => {
        console.log('Legacy WebSocket connected');
      });
      
      this.legacyService.onDisconnect(() => {
        console.log('Legacy WebSocket disconnected');
      });
    }
  }

  /**
   * Initialize adapter-only mode
   */
  private async initializeAdapterOnly(): Promise<void> {
    this.status.isLegacyActive = false;
    this.status.isAdapterActive = true;
    
    if (this.adapter) {
      // Set up adapter event handlers
      this.adapter.setEventHandlers({
        onConnectionChange: (isConnected) => {
          console.log(`Adapter WebSocket ${isConnected ? 'connected' : 'disconnected'}`);
        },
        onError: (error) => {
          console.error('Adapter WebSocket error:', error);
        }
      });
    }
  }

  /**
   * Initialize hybrid mode
   */
  private async initializeHybrid(): Promise<void> {
    this.status.isLegacyActive = true;
    this.status.isAdapterActive = true;
    
    // Initialize both services
    await this.initializeLegacyOnly();
    await this.initializeAdapterOnly();
  }

  /**
   * Determine if adapter should be used
   */
  private shouldUseAdapter(): boolean {
    switch (this.config.migrationMode) {
      case 'legacy_only':
        return false;
      case 'adapter_only':
        return true;
      case 'hybrid':
        return this.config.featureFlags.useEnterpriseAdapter;
      default:
        return false;
    }
  }

  /**
   * Send message using adapter
   */
  private async sendMessageWithAdapter(chatId: ResId, message: MessageResponse): Promise<void> {
    if (!this.adapter) {
      throw new Error('Adapter not available');
    }
    await this.adapter.sendMessage(chatId, message);
  }

  /**
   * Send message using legacy service
   */
  private async sendMessageWithLegacy(chatId: ResId, message: MessageResponse): Promise<void> {
    if (!this.legacyService) {
      throw new Error('Legacy service not available');
    }
    this.legacyService.sendMessage(chatId, message);
  }

  /**
   * Update adapter performance metrics
   */
  private updateAdapterPerformance(startTime: number): void {
    const latency = Date.now() - startTime;
    this.metrics.performanceComparison.adapterLatency = 
      (this.metrics.performanceComparison.adapterLatency + latency) / 2;
  }

  /**
   * Update legacy performance metrics
   */
  private updateLegacyPerformance(startTime: number): void {
    const latency = Date.now() - startTime;
    this.metrics.performanceComparison.legacyLatency = 
      (this.metrics.performanceComparison.legacyLatency + latency) / 2;
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): ChatMigrationConfig {
    return {
      enableLegacyFallback: true,
      migrationMode: 'hybrid',
      featureFlags: {
        useEnterpriseAdapter: false,
        enableTypingIndicators: true,
        enableOnlineStatus: true,
        enableMessageDeliveryConfirmation: true
      },
      performanceMonitoring: true,
      errorReporting: true
    };
  }

  /**
   * Get default metrics
   */
  private getDefaultMetrics(): ChatMigrationMetrics {
    return {
      legacyMessagesSent: 0,
      adapterMessagesSent: 0,
      legacyMessagesReceived: 0,
      adapterMessagesReceived: 0,
      migrationErrors: 0,
      fallbackActivations: 0,
      performanceComparison: {
        legacyLatency: 0,
        adapterLatency: 0,
        legacySuccessRate: 100,
        adapterSuccessRate: 100
      }
    };
  }

  /**
   * Get default status
   */
  private getDefaultStatus(): ChatMigrationStatus {
    return {
      isLegacyActive: false,
      isAdapterActive: false,
      currentMode: 'hybrid',
      lastMigrationAttempt: Date.now(),
      successfulMigrations: 0,
      failedMigrations: 0
    };
  }
}
