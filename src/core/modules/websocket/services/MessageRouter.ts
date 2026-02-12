/**
 * WebSocket Message Router Service.
 *
 * Handles feature-based message routing, validation, and transformation
 * for enterprise WebSocket communications.
 */

import { ICacheServiceManager } from '../../caching';
import { _LoggerService } from '../../../services';

import { WebSocketMessage } from './EnterpriseWebSocketService';

export interface MessageRoute {
  feature: string;
  messageType: string;
  handler: MessageHandler;
  validator?: MessageValidator;
  transformer?: MessageTransformer;
  priority: number;
  enabled: boolean;
}

export type MessageHandler = (message: WebSocketMessage) => Promise<void> | void;

export type MessageValidator = (message: WebSocketMessage) => boolean | Promise<boolean>;

export type MessageTransformer = (message: WebSocketMessage) => WebSocketMessage | Promise<WebSocketMessage>;

export interface RoutingMetrics {
  totalMessages: number;
  messagesRouted: number;
  messagesDropped: number;
  validationErrors: number;
  transformationErrors: number;
  averageProcessingTime: number;
  featureStats: Map<string, FeatureMessageStats>;
}

export interface FeatureMessageStats {
  messageCount: number;
  averageLatency: number;
  errorCount: number;
  lastMessageAt: Date | null;
}

export interface MessageRouterConfig {
  enableMetrics: boolean;
  enableValidation: boolean;
  enableTransformation: boolean;
  maxProcessingTime: number;
  deadLetterQueue: boolean;
  retryAttempts: number;
}

/**
 * Message Router Interface
 */
export interface IMessageRouter {
  registerRoute(route: MessageRoute): void;
  unregisterRoute(feature: string, messageType: string): void;
  routeMessage(message: WebSocketMessage): Promise<void>;
  getRoutes(): MessageRoute[];
  getMetrics(): RoutingMetrics;
  clearMetrics(): void;
  enableRoute(feature: string, messageType: string, enabled: boolean): void;
}

/**
 * Message Router Implementation
 */
export class MessageRouter implements IMessageRouter {
  private readonly routes: Map<string, MessageRoute[]> = new Map();
  private metrics: RoutingMetrics;
  private readonly config: MessageRouterConfig;
  private deadLetterQueue: WebSocketMessage[] = [];

  constructor(
    private readonly cache: ICacheServiceManager,
    private readonly logger: _LoggerService
  ) {
    this.config = this.getDefaultConfig();
    this.metrics = this.getDefaultMetrics();
    this.initializeDefaultRoutes();
  }

  registerRoute(route: MessageRoute): void {
    const key = this.getRouteKey(route.feature, route.messageType);

    if (!this.routes.has(key)) {
      this.routes.set(key, []);
    }

    const routeList = this.routes.get(key)!;
    routeList.push(route);

    // Sort by priority (higher priority first)
    routeList.sort((a, b) => b.priority - a.priority);

    this.logger.info(`[MessageRouter] Registered route: ${key}, priority: ${route.priority}`);
  }

  unregisterRoute(feature: string, messageType: string): void {
    const key = this.getRouteKey(feature, messageType);
    this.routes.delete(key);

    this.logger.info(`[MessageRouter] Unregistered route: ${key}`);
  }

  async routeMessage(message: WebSocketMessage): Promise<void> {
    const startTime = Date.now();

    try {
      this.metrics.totalMessages++;

      // Add processing timestamp
      message.metadata = {
        ...message.metadata,
        routedAt: new Date().toISOString(),
        processingStartTime: startTime
      };

      const key = this.getRouteKey(message.feature, message.type);
      const routes = this.routes.get(key);

      if (!routes || routes.length === 0) {
        await this.handleUnroutableMessage(message);
        return;
      }

      // Find first enabled route
      const enabledRoute = routes.find(route => route.enabled);
      if (!enabledRoute) {
        this.logger.warn(`[MessageRouter] No enabled routes for: ${key}`);
        await this.handleUnroutableMessage(message);
        return;
      }

      // Process message through the route
      await this.processMessage(message, enabledRoute);

      // Update metrics
      this.updateMetrics(message.feature, Date.now() - startTime, true);
      this.metrics.messagesRouted++;

      this.logger.debug(`[MessageRouter] Routed message: ${key}`);

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('[MessageRouter] Failed to route message:', errorObj);

      // Update error metrics
      this.updateMetrics(message.feature, Date.now() - startTime, false);

      // Add to dead letter queue if enabled
      if (this.config.deadLetterQueue) {
        this.deadLetterQueue.push(message);
      }

      throw errorObj;
    }
  }

  getRoutes(): MessageRoute[] {
    const allRoutes: MessageRoute[] = [];

    this.routes.forEach(routeList => {
      allRoutes.push(...routeList);
    });

    return allRoutes;
  }

  getMetrics(): RoutingMetrics {
    return {
      ...this.metrics,
      featureStats: new Map(this.metrics.featureStats)
    };
  }

  clearMetrics(): void {
    this.metrics = this.getDefaultMetrics();
    this.deadLetterQueue = [];
    this.logger.info('[MessageRouter] Metrics cleared');
  }

  enableRoute(feature: string, messageType: string, enabled: boolean): void {
    const key = this.getRouteKey(feature, messageType);
    const routes = this.routes.get(key);

    if (routes) {
      routes.forEach(route => {
        route.enabled = enabled;
      });

      this.logger.info(`[MessageRouter] ${enabled ? 'Enabled' : 'Disabled'} routes for: ${key}`);
    }
  }

  private async processMessage(message: WebSocketMessage, route: MessageRoute): Promise<void> {
    let processedMessage = message;

    // Validation
    if (this.config.enableValidation && route.validator) {
      const isValid = await route.validator(processedMessage);
      if (!isValid) {
        this.metrics.validationErrors++;
        throw new Error(`Message validation failed for: ${route.feature}:${route.messageType}`);
      }
    }

    // Transformation
    if (this.config.enableTransformation && route.transformer) {
      try {
        processedMessage = await route.transformer(processedMessage);
      } catch (error) {
        this.metrics.transformationErrors++;
        throw new Error(`Message transformation failed for: ${route.feature}:${route.messageType}`);
      }
    }

    // Execute handler with timeout
    await this.executeWithTimeout(
      () => route.handler(processedMessage),
      this.config.maxProcessingTime
    );

    // Cache processed message for debugging/audit
    if (this.config.enableMetrics) {
      const defaultCache = this.cache.getCache('websocket');
      await defaultCache.set(`msg:processed:${processedMessage.id}`, {
        original: message,
        processed: processedMessage,
        route: `${route.feature}:${route.messageType}`,
        processedAt: new Date()
      }, 300000); // 5 minutes
    }
  }

  private async executeWithTimeout<T>(
    operation: () => T | Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      Promise.resolve(operation()),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  }

  private async handleUnroutableMessage(message: WebSocketMessage): Promise<void> {
    this.logger.warn(`[MessageRouter] Unroutable message: ${message.feature}:${message.type}`);
    this.metrics.messagesDropped++;

    // Add to dead letter queue if enabled
    if (this.config.deadLetterQueue) {
      this.deadLetterQueue.push(message);
    }

    // Cache unroutable message for analysis
    const messageCache = this.cache.getCache('message-router');
    await messageCache.set(`msg:unroutable:${message.id}`, {
      message,
      receivedAt: new Date()
    }, 3600000); // 1 hour
  }

  private updateMetrics(feature: string, processingTime: number, success: boolean): void {
    if (!this.config.enableMetrics) {
      return;
    }

    // Update feature stats
    if (!this.metrics.featureStats.has(feature)) {
      this.metrics.featureStats.set(feature, {
        messageCount: 0,
        averageLatency: 0,
        errorCount: 0,
        lastMessageAt: null
      });
    }

    const stats = this.metrics.featureStats.get(feature)!;
    stats.messageCount++;
    stats.lastMessageAt = new Date();

    // Update average latency
    stats.averageLatency = (stats.averageLatency * (stats.messageCount - 1) + processingTime) / stats.messageCount;

    if (!success) {
      stats.errorCount++;
    }

    // Update overall average processing time
    this.metrics.averageProcessingTime =
      (this.metrics.averageProcessingTime * (this.metrics.totalMessages - 1) + processingTime) / this.metrics.totalMessages;
  }

  private getRouteKey(feature: string, messageType: string): string {
    return `${feature}:${messageType}`;
  }

  private initializeDefaultRoutes(): void {
    // System message routes
    this.registerRoute({
      feature: 'system',
      messageType: 'heartbeat',
      handler: this.handleHeartbeat.bind(this),
      priority: 1,
      enabled: true
    });

    this.registerRoute({
      feature: 'system',
      messageType: 'ping',
      handler: this.handlePing.bind(this),
      priority: 1,
      enabled: true
    });

    this.registerRoute({
      feature: 'system',
      messageType: 'pong',
      handler: this.handlePong.bind(this),
      priority: 1,
      enabled: true
    });

    // Error handling route
    this.registerRoute({
      feature: 'system',
      messageType: 'error',
      handler: this.handleError.bind(this),
      validator: this.validateErrorMessage.bind(this),
      priority: 10,
      enabled: true
    });

    this.logger.info('[MessageRouter] Default routes initialized');
  }

  private async handleHeartbeat(message: WebSocketMessage): Promise<void> {
    this.logger.debug('[MessageRouter] Heartbeat received from:', message.metadata?.source);

    // Update connection health in cache
    const systemCache = this.cache.getCache('system');
    await systemCache.set(`ws:heartbeat:${message.metadata?.source || 'unknown'}`, {
      lastHeartbeat: new Date(),
      payload: message.payload
    }, 60000); // 1 minute
  }

  private async handlePing(message: WebSocketMessage): Promise<void> {
    this.logger.debug('[MessageRouter] Ping received, sending pong');

    // In a real implementation, you would send a pong response
    // For now, just log and cache
    const systemCache = this.cache.getCache('system');
    await systemCache.set(`ws:ping:${message.id}`, {
      receivedAt: new Date(),
      payload: message.payload
    }, 30000); // 30 seconds
  }

  private async handlePong(message: WebSocketMessage): Promise<void> {
    this.logger.debug('[MessageRouter] Pong received');

    // Update latency measurement
    if (message.metadata?.sentAt && typeof message.metadata.sentAt === 'string') {
      const latency = Date.now() - new Date(message.metadata.sentAt).getTime();
      const systemCache = this.cache.getCache('system');
      await systemCache.set(`ws:latency:${message.metadata?.source || 'unknown'}`, {
        latency,
        measuredAt: new Date()
      }, 60000); // 1 minute
    }
  }

  private async handleError(message: WebSocketMessage): Promise<void> {
    this.logger.error('[MessageRouter] Error message received:', message.payload as Error);

    // Cache error for analysis
    const errorCache = this.cache.getCache('errors');
    await errorCache.set(`ws:error:${message.id}`, {
      error: message.payload,
      feature: message.feature,
      timestamp: message.timestamp,
      metadata: message.metadata
    }, 3600000); // 1 hour
  }

  private validateErrorMessage(message: WebSocketMessage): boolean {
    // Basic validation for error messages
    return !!(
      message.payload &&
      typeof message.payload === 'object' &&
      message.payload &&
      ('error' in message.payload || 'message' in message.payload)
    );
  }

  private getDefaultMetrics(): RoutingMetrics {
    return {
      totalMessages: 0,
      messagesRouted: 0,
      messagesDropped: 0,
      validationErrors: 0,
      transformationErrors: 0,
      averageProcessingTime: 0,
      featureStats: new Map()
    };
  }

  private getDefaultConfig(): MessageRouterConfig {
    return {
      enableMetrics: true,
      enableValidation: true,
      enableTransformation: false,
      maxProcessingTime: 5000, // 5 seconds
      deadLetterQueue: true,
      retryAttempts: 3
    };
  }

  /**
   * Get dead letter queue messages
   */
  getDeadLetterQueue(): WebSocketMessage[] {
    return [...this.deadLetterQueue];
  }

  /**
   * Clear dead letter queue
   */
  clearDeadLetterQueue(): void {
    this.deadLetterQueue = [];
    this.logger.info('[MessageRouter] Dead letter queue cleared');
  }

  /**
   * Retry messages from dead letter queue
   */
  async retryDeadLetterMessages(): Promise<void> {
    const messages = [...this.deadLetterQueue];
    this.deadLetterQueue = [];

    for (const message of messages) {
      try {
        await this.routeMessage(message);
        this.logger.debug(`[MessageRouter] Successfully retried message: ${message.id}`);
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        this.logger.error(`[MessageRouter] Failed to retry message: ${message.id}`, errorObj);
        // Put it back in the queue
        this.deadLetterQueue.push(message);
      }
    }
  }
}
