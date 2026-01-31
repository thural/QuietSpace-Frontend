/**
 * Enterprise WebSocket Service.
 * 
 * Centralized WebSocket management following enterprise architecture patterns.
 * Replaces scattered WebSocket implementations across features.
 */

import { TYPES } from '../../di/types';
import { ICacheServiceManager, type FeatureCacheService } from '../../cache';
import { LoggerService } from '../../services/LoggerService';

/**
 * WebSocket message interface for enterprise communication
 * 
 * @interface WebSocketMessage
 * @description Standardized message format for WebSocket communications
 */
export interface WebSocketMessage {
  /**
   * Unique message identifier
   * 
   * @type {string}
   */
  id: string;

  /**
   * Message type for routing and handling
   * 
   * @type {string}
   */
  type: string;

  /**
   * Feature identifier for message categorization
   * 
   * @type {string}
   */
  feature: string;

  /**
   * Message payload data
   * 
   * @type {any}
   */
  payload: any;

  /**
   * Message creation timestamp
   * 
   * @type {Date}
   */
  timestamp: Date;

  /**
   * Additional metadata for message processing
   * 
   * @type {Record<string, any>}
   */
  metadata?: Record<string, any>;
}

/**
 * WebSocket configuration interface
 * 
 * @interface WebSocketConfig
 * @description Configuration options for WebSocket connections
 */
export interface WebSocketConfig {
  /**
   * WebSocket server URL
   * 
   * @type {string}
   */
  url: string;

  /**
   * Number of reconnection attempts
   * 
   * @type {number}
   */
  reconnectAttempts: number;

  /**
   * Delay between reconnection attempts in milliseconds
   * 
   * @type {number}
   */
  reconnectDelay: number;

  /**
   * Heartbeat interval in milliseconds
   * 
   * @type {number}
   */
  heartbeatInterval: number;

  /**
   * Whether to enable metrics collection
   * 
   * @type {boolean}
   */
  enableMetrics: boolean;

  /**
   * Connection timeout in milliseconds
   * 
   * @type {number}
   */
  connectionTimeout: number;
}

/**
 * Connection metrics interface for WebSocket performance monitoring
 * 
 * @interface ConnectionMetrics
 * @description Performance and usage statistics for WebSocket connections
 */
export interface ConnectionMetrics {
  /**
   * Timestamp when connection was established
   * 
   * @type {Date | null}
   */
  connectedAt: Date | null;

  /**
   * Timestamp of last received message
   * 
   * @type {Date | null}
   */
  lastMessageAt: Date | null;

  /**
   * Total number of messages received
   * 
   * @type {number}
   */
  messagesReceived: number;

  /**
   * Total number of messages sent
   * 
   * @type {number}
   */
  messagesSent: number;

  /**
   * Number of reconnection attempts made
   * 
   * @type {number}
   */
  reconnectAttempts: number;

  /**
   * Average message latency in milliseconds
   * 
   * @type {number}
   */
  averageLatency: number;

  /**
   * Connection uptime in milliseconds
   * 
   * @type {number}
   */
  connectionUptime: number;
}

/**
 * WebSocket event listener interface
 * 
 * @interface WebSocketEventListener
 * @description Event handlers for WebSocket connection lifecycle events
 */
export interface WebSocketEventListener {
  /**
   * Called when WebSocket connection is established
   * 
   * @returns {void}
   */
  onConnect?: () => void;

  /**
   * Called when WebSocket connection is closed
   * 
   * @param {CloseEvent} event - The close event details
   * @returns {void}
   */
  onDisconnect?: (event: CloseEvent) => void;

  /**
   * Called when a message is received
   * 
   * @param {WebSocketMessage} message - The received message
   * @returns {void}
   */
  onMessage?: (message: WebSocketMessage) => void;

  /**
   * Called when an error occurs
   * 
   * @param {Event} error - The error event
   * @returns {void}
   */
  onError?: (error: Event) => void;

  /**
   * Called when reconnection attempt is made
   * 
   * @param {number} attempt - The current attempt number
   * @returns {void}
   */
  onReconnect?: (attempt: number) => void;
}

/**
 * Enterprise WebSocket Service Interface
 * 
 * @interface IEnterpriseWebSocketService
 * @description Main interface for enterprise WebSocket service operations
 */
export interface IEnterpriseWebSocketService {
  /**
   * Establishes WebSocket connection with authentication
   * 
   * @param {string} token - Authentication token
   * @param {Partial<WebSocketConfig>} [config] - Optional configuration overrides
   * @returns {Promise<void>} Promise resolving when connection is established
   */
  connect(token: string, config?: Partial<WebSocketConfig>): Promise<void>;

  /**
   * Closes WebSocket connection
   * 
   * @returns {void}
   */
  disconnect(): void;

  /**
   * Sends a message through the WebSocket
   * 
   * @param {Omit<WebSocketMessage, 'id' | 'timestamp'>} message - Message to send (without auto-generated fields)
   * @returns {Promise<void>} Promise resolving when message is sent
   */
  sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): Promise<void>;

  /**
   * Subscribes to messages for a specific feature
   * 
   * @param {string} feature - Feature identifier
   * @param {WebSocketEventListener} listener - Event listener for the feature
   * @returns {() => void} Unsubscribe function
   */
  subscribe(feature: string, listener: WebSocketEventListener): () => void;

  /**
   * Unsubscribes all listeners for a specific feature
   * 
   * @param {string} feature - Feature identifier
   * @returns {void}
   */
  unsubscribe(feature: string): void;

  /**
   * Checks if WebSocket is currently connected
   * 
   * @returns {boolean} Connection status
   */
  isConnected(): boolean;
  /**
   * Gets current connection metrics
   * 
   * @returns {ConnectionMetrics} Current connection performance metrics
   */
  getConnectionMetrics(): ConnectionMetrics;

  /**
   * Gets current connection state
   * 
   * @returns {'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error'} Current connection state
   */
  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
}

/**
 * Enterprise WebSocket Service Implementation
 * 
 * @class EnterpriseWebSocketService
 * @implements {IEnterpriseWebSocketService}
 * @description Enterprise-grade WebSocket service with reconnection, metrics, and event handling
 */
export class EnterpriseWebSocketService implements IEnterpriseWebSocketService {
  /**
   * WebSocket instance
   * 
   * @private
   * @type {WebSocket | null}
   */
  private ws: WebSocket | null = null;

  /**
   * WebSocket configuration
   * 
   * @private
   * @type {WebSocketConfig}
   */
  private config: WebSocketConfig;

  /**
   * Current connection state
   * 
   * @private
   * @type {'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error'}
   */
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error' = 'disconnected';

  /**
   * Connection performance metrics
   * 
   * @private
   * @type {ConnectionMetrics}
   */
  private metrics: ConnectionMetrics;

  /**
   * Event listeners by feature
   * 
   * @private
   * @type {Map<string, WebSocketEventListener[]>}
   */
  private listeners: Map<string, WebSocketEventListener[]> = new Map();

  /**
   * Reconnection timer
   * 
   * @private
   * @type {NodeJS.Timeout | null}
   */
  private reconnectTimer: NodeJS.Timeout | null = null;

  /**
   * Heartbeat timer for connection monitoring
   * 
   * @private
   * @type {NodeJS.Timeout | null}
   */
  private heartbeatTimer: NodeJS.Timeout | null = null;

  /**
   * Latency measurement timer
   * 
   * @private
   * @type {NodeJS.Timeout | null}
   */
  private latencyTimer: NodeJS.Timeout | null = null;

  /**
   * Connection start timestamp
   * 
   * @private
   * @type {number}
   */
  private connectionStartTime: number = 0;

  /**
   * Authentication token
   * 
   * @private
   * @type {string | null}
   */
  private token: string | null = null;

  /**
   * Creates a new EnterpriseWebSocketService instance
   * 
   * @constructor
   * @param {FeatureCacheService} cache - Cache service for WebSocket data
   * @param {any} authService - Authentication service
   * @param {LoggerService} logger - Logger service for debugging
   * @description Initializes WebSocket service with default configuration and metrics
   */
  constructor(
    private cache: FeatureCacheService,
    private authService: any,
    private logger: LoggerService
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
  }

  /**
   * Establishes WebSocket connection with authentication
   * 
   * @param {string} token - Authentication token
   * @param {Partial<WebSocketConfig>} [config] - Optional configuration overrides
   * @returns {Promise<void>} Promise resolving when connection is established
   * @description Connects to WebSocket server with authentication and optional configuration
   */
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
      const websocketCache = this.cache.getCache('websocket');
      websocketCache.set(`ws:sent:${fullMessage.id}`, fullMessage, 60000); // 1 minute

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
          const websocketCache = this.cache.getCache('websocket');
          websocketCache.set(`ws:received:${message.id}`, message, 300000); // 5 minutes

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
