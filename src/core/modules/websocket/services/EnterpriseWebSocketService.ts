/**
 * Enterprise WebSocket Service.
 *
 * Centralized WebSocket management following enterprise architecture patterns.
 * Replaces scattered WebSocket implementations across features.
 */

import { type ICacheServiceManager } from '../../caching';

// Import centralized logging
import { getLogger } from '../../logging';

// Import centralized error handling
import { createSystemError, createNetworkError } from '../../error';

// WebSocket Message Types
export interface WebSocketMessage {
  id: string;
  type: string;
  feature: string;
  payload: unknown;
  timestamp: Date;
  metadata?: Record<string, unknown>;
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
export class EnterpriseWebSocketService implements IEnterpriseWebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error' = 'disconnected';
  private readonly metrics: ConnectionMetrics;
  private readonly listeners: Map<string, WebSocketEventListener[]> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private latencyTimer: NodeJS.Timeout | null = null;
  private connectionStartTime: number = 0;
  private token: string | null = null;
  private readonly logger = getLogger('app.websocket');

  constructor(
    private readonly cache: ICacheServiceManager
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
        setTimeout(() => reject(createNetworkError('Connection timeout', undefined, undefined)), this.config.connectionTimeout);
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
      this.logger.error('[WebSocket] Connection failed:', error instanceof Error ? error : new Error(String(error)));
      throw createSystemError('Connection failed', 'EnterpriseWebSocketService', 'connect');
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
      throw createNetworkError('WebSocket not connected', undefined, undefined);
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
      const websocketCache = this.cache.getCache('websocket');
      websocketCache.set(`ws:sent:${fullMessage.id}`, fullMessage, 60000); // 1 minute

      this.logger.debug('[WebSocket] Message sent:', fullMessage);
    } catch (error) {
      this.logger.error('[WebSocket] Failed to send message:', error instanceof Error ? error : new Error(String(error)));
      throw createSystemError('Failed to send message', 'EnterpriseWebSocketService', 'sendMessage');
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
        reject(createSystemError('WebSocket not initialized', 'EnterpriseWebSocketService', 'setupWebSocketHandlers'));
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
            const sentAt = message.metadata.sentAt;
            // Ensure sentAt is a valid Date constructor argument
            if (typeof sentAt === 'string' || typeof sentAt === 'number' || sentAt instanceof Date) {
              const latency = Date.now() - new Date(sentAt).getTime();
              this.updateLatency(latency);
            }
          }

          // Cache received message
          const websocketCache = this.cache.getCache('websocket');
          websocketCache.set(`ws:received:${message.id}`, message, 300000); // 5 minutes

          this.logger.debug('[WebSocket] Message received:', message);
          this.notifyFeatureListeners(message);
          this.notifyListeners('onMessage', message);

        } catch (error) {
          this.logger.error('[WebSocket] Message parsing error:', error instanceof Error ? error : new Error(String(error)));
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
        this.logger.error('[WebSocket] Connection error:', error instanceof Error ? error : new Error(String(error)));
        this.notifyListeners('onError', error);
        reject(createSystemError('Connection error', 'EnterpriseWebSocketService', 'setupWebSocketHandlers'));
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
        this.logger.error('[WebSocket] Reconnection failed:', error instanceof Error ? error : new Error(String(error)));
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
          this.logger.error('[WebSocket] Heartbeat failed:', error instanceof Error ? error : new Error(String(error)));
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

  private notifyListeners(event: keyof WebSocketEventListener, data?: CloseEvent | WebSocketMessage | Event | number): void {
    this.listeners.forEach(listeners => {
      listeners.forEach(listener => {
        try {
          switch (event) {
            case 'onConnect':
              if (listener.onConnect) listener.onConnect();
              break;
            case 'onDisconnect':
              if (listener.onDisconnect && data instanceof CloseEvent) listener.onDisconnect(data);
              break;
            case 'onMessage':
              if (listener.onMessage && data && typeof data === 'object' && 'id' in data) listener.onMessage(data as WebSocketMessage);
              break;
            case 'onError':
              if (listener.onError && data instanceof Event) listener.onError(data);
              break;
            case 'onReconnect':
              if (listener.onReconnect && typeof data === 'number') listener.onReconnect(data);
              break;
          }
        } catch (error) {
          this.logger.error(`[WebSocket] Error in ${event} handler:`, error instanceof Error ? error : new Error(String(error)));
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
