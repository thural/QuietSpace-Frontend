/**
 * Enterprise WebSocket Service.
 * 
 * Centralized WebSocket management following enterprise architecture patterns.
 * Replaces scattered WebSocket implementations across features.
 */

import { Injectable, Inject } from '../../di';
import { TYPES } from '../../di/types';
import { CacheService } from '../../cache';
import { LoggerService } from '../../services/ThemeService';

// WebSocket Message Types
export interface WebSocketMessage {
  id: string;
  type: string;
  feature: string;
  payload: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  enableMetrics: boolean;
  connectionTimeout: number;
}

export interface ConnectionMetrics {
  connectedAt: Date | null;
  lastMessageAt: Date | null;
  messagesReceived: number;
  messagesSent: number;
  reconnectAttempts: number;
  averageLatency: number;
  connectionUptime: number;
}

export interface WebSocketEventListener {
  onConnect?: () => void;
  onDisconnect?: (event: CloseEvent) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onReconnect?: (attempt: number) => void;
}

/**
 * Enterprise WebSocket Service Interface
 */
export interface IEnterpriseWebSocketService {
  connect(token: string, config?: Partial<WebSocketConfig>): Promise<void>;
  disconnect(): void;
  sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): Promise<void>;
  subscribe(feature: string, listener: WebSocketEventListener): () => void;
  unsubscribe(feature: string): void;
  isConnected(): boolean;
  getConnectionMetrics(): ConnectionMetrics;
  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
}

/**
 * Enterprise WebSocket Service Implementation
 */
@Injectable()
export class EnterpriseWebSocketService implements IEnterpriseWebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error' = 'disconnected';
  private metrics: ConnectionMetrics;
  private listeners: Map<string, WebSocketEventListener[]> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private latencyTimer: NodeJS.Timeout | null = null;
  private connectionStartTime: number = 0;
  private token: string | null = null;

  constructor(
    @Inject(TYPES.CACHE_SERVICE) private cache: CacheService,
    @Inject(TYPES.AUTH_SERVICE) private authService: any,
    private logger: LoggerService
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
  }

  async connect(token: string, config?: Partial<WebSocketConfig>): Promise<void> {
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
      this.logger.warn('[WebSocket] Already connecting or connected');
      return;
    }

    this.token = token;
    this.config = { ...this.config, ...config };
    this.connectionState = 'connecting';
    this.connectionStartTime = Date.now();

    try {
      const wsUrl = `${this.config.url}?token=${token}`;
      this.ws = new WebSocket(wsUrl);

      await this.setupWebSocketHandlers();
      
      // Set connection timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), this.config.connectionTimeout);
      });

      await Promise.race([
        new Promise<void>((resolve) => {
          const checkConnection = () => {
            if (this.connectionState === 'connected') resolve();
            else setTimeout(checkConnection, 100);
          };
          checkConnection();
        }),
        timeoutPromise
      ]);

      this.logger.info('[WebSocket] Connected successfully');
      this.startHeartbeat();
      
    } catch (error) {
      this.connectionState = 'error';
      this.logger.error('[WebSocket] Connection failed:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.clearTimers();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.connectionState = 'disconnected';
    this.token = null;
    this.listeners.clear();
    
    this.logger.info('[WebSocket] Disconnected');
  }

  async sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('WebSocket not connected');
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date()
    };

    try {
      this.ws!.send(JSON.stringify(fullMessage));
      this.metrics.messagesSent++;
      this.metrics.lastMessageAt = new Date();

      // Cache sent message for potential recovery
      await this.cache.set(`ws:sent:${fullMessage.id}`, fullMessage, {
        ttl: 60000 // 1 minute
      });

      this.logger.debug('[WebSocket] Message sent:', fullMessage);
    } catch (error) {
      this.logger.error('[WebSocket] Failed to send message:', error);
      throw error;
    }
  }

  subscribe(feature: string, listener: WebSocketEventListener): () => void {
    if (!this.listeners.has(feature)) {
      this.listeners.set(feature, []);
    }

    const featureListeners = this.listeners.get(feature)!;
    featureListeners.push(listener);

    this.logger.debug(`[WebSocket] Subscribed to feature: ${feature}`);

    // Return unsubscribe function
    return () => {
      const index = featureListeners.indexOf(listener);
      if (index > -1) {
        featureListeners.splice(index, 1);
      }
      if (featureListeners.length === 0) {
        this.listeners.delete(feature);
      }
    };
  }

  unsubscribe(feature: string): void {
    this.listeners.delete(feature);
    this.logger.debug(`[WebSocket] Unsubscribed from feature: ${feature}`);
  }

  isConnected(): boolean {
    return this.connectionState === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionMetrics(): ConnectionMetrics {
    return {
      ...this.metrics,
      connectionUptime: this.metrics.connectedAt ? Date.now() - this.metrics.connectedAt.getTime() : 0
    };
  }

  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error' {
    return this.connectionState;
  }

  private async setupWebSocketHandlers(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('WebSocket not initialized'));
        return;
      }

      this.ws.onopen = () => {
        this.connectionState = 'connected';
        this.metrics.connectedAt = new Date();
        this.metrics.reconnectAttempts = 0;
        
        this.logger.info('[WebSocket] Connection opened');
        this.notifyListeners('onConnect');
        resolve();
      };

      this.ws.onmessage = async (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.metrics.messagesReceived++;
          this.metrics.lastMessageAt = new Date();

          // Calculate latency if message contains timestamp
          if (message.metadata?.sentAt) {
            const latency = Date.now() - new Date(message.metadata.sentAt).getTime();
            this.updateLatency(latency);
          }

          // Cache received message
          await this.cache.set(`ws:received:${message.id}`, message, {
            ttl: 300000 // 5 minutes
          });

          this.logger.debug('[WebSocket] Message received:', message);
          this.notifyFeatureListeners(message);
          this.notifyListeners('onMessage', message);

        } catch (error) {
          this.logger.error('[WebSocket] Message parsing error:', error);
        }
      };

      this.ws.onclose = (event) => {
        this.connectionState = 'disconnected';
        this.clearTimers();
        
        this.logger.info('[WebSocket] Connection closed:', event);
        this.notifyListeners('onDisconnect', event);

        // Attempt reconnection if not manual disconnect
        if (event.code !== 1000 && this.metrics.reconnectAttempts < this.config.reconnectAttempts) {
          this.handleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        this.connectionState = 'error';
        this.logger.error('[WebSocket] Connection error:', error);
        this.notifyListeners('onError', error);
        reject(error);
      };
    });
  }

  private handleReconnect(): void {
    if (this.connectionState === 'reconnecting') {
      return;
    }

    this.connectionState = 'reconnecting';
    this.metrics.reconnectAttempts++;

    this.logger.info(`[WebSocket] Reconnect attempt ${this.metrics.reconnectAttempts}/${this.config.reconnectAttempts}`);
    this.notifyListeners('onReconnect', this.metrics.reconnectAttempts);

    const delay = this.config.reconnectDelay * Math.pow(2, this.metrics.reconnectAttempts - 1);

    this.reconnectTimer = setTimeout(async () => {
      try {
        if (this.token) {
          await this.connect(this.token);
        }
      } catch (error) {
        this.logger.error('[WebSocket] Reconnection failed:', error);
        if (this.metrics.reconnectAttempts < this.config.reconnectAttempts) {
          this.handleReconnect();
        } else {
          this.connectionState = 'error';
          this.logger.error('[WebSocket] Max reconnect attempts reached');
        }
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({
          type: 'heartbeat',
          feature: 'system',
          payload: { timestamp: Date.now() }
        }).catch(error => {
          this.logger.error('[WebSocket] Heartbeat failed:', error);
        });
      }
    }, this.config.heartbeatInterval);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.latencyTimer) {
      clearTimeout(this.latencyTimer);
      this.latencyTimer = null;
    }
  }

  private notifyFeatureListeners(message: WebSocketMessage): void {
    const featureListeners = this.listeners.get(message.feature);
    if (featureListeners) {
      featureListeners.forEach(listener => {
        if (listener.onMessage) {
          listener.onMessage(message);
        }
      });
    }
  }

  private notifyListeners(event: keyof WebSocketEventListener, data?: any): void {
    this.listeners.forEach(listeners => {
      listeners.forEach(listener => {
        const handler = listener[event];
        if (handler) {
          try {
            handler(data);
          } catch (error) {
            this.logger.error(`[WebSocket] Error in ${event} handler:`, error);
          }
        }
      });
    });
  }

  private updateLatency(latency: number): void {
    // Simple moving average for latency
    this.metrics.averageLatency = (this.metrics.averageLatency * 0.9) + (latency * 0.1);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultConfig(): WebSocketConfig {
    return {
      url: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
      reconnectAttempts: 5,
      reconnectDelay: 1000,
      heartbeatInterval: 30000,
      enableMetrics: true,
      connectionTimeout: 10000
    };
  }

  private getDefaultMetrics(): ConnectionMetrics {
    return {
      connectedAt: null,
      lastMessageAt: null,
      messagesReceived: 0,
      messagesSent: 0,
      reconnectAttempts: 0,
      averageLatency: 0,
      connectionUptime: 0
    };
  }
}
