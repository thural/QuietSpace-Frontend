/**
 * WebSocket Utilities.
 *
 * Utility functions and helpers for WebSocket operations.
 */

import type { WebSocketMessage } from '../services/EnterpriseWebSocketService';

export interface MessageBuilderOptions {
  feature: string;
  type: string;
  payload: unknown;
  metadata?: Record<string, unknown>;
  priority?: number;
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
}

export interface ConnectionMonitorConfig {
  heartbeatInterval: number;
  timeoutThreshold: number;
  maxMissedHeartbeats: number;
  enableReconnect: boolean;
}

/**
 * WebSocket Message Builder
 *
 * Utility class for building WebSocket messages with validation.
 */
export class WebSocketMessageBuilder {
  private readonly message: Partial<WebSocketMessage> = {};

  constructor(options: MessageBuilderOptions) {
    this.message = {
      id: this.generateId(),
      type: options.type,
      feature: options.feature,
      payload: options.payload,
      timestamp: new Date(),
      metadata: {
        ...options.metadata,
        createdAt: new Date().toISOString()
      }
    };
  }

  static create(options: MessageBuilderOptions): WebSocketMessageBuilder {
    return new WebSocketMessageBuilder(options);
  }

  withMetadata(metadata: Record<string, unknown>): WebSocketMessageBuilder {
    this.message.metadata = {
      ...this.message.metadata,
      ...metadata
    };
    return this;
  }

  withPriority(priority: number): WebSocketMessageBuilder {
    this.message.metadata = {
      ...this.message.metadata,
      priority
    };
    return this;
  }

  withSource(source: string): WebSocketMessageBuilder {
    this.message.metadata = {
      ...this.message.metadata,
      source
    };
    return this;
  }

  withCorrelationId(correlationId: string): WebSocketMessageBuilder {
    this.message.metadata = {
      ...this.message.metadata,
      correlationId
    };
    return this;
  }

  build(): WebSocketMessage {
    if (!this.message.id) {
      this.message.id = this.generateId();
    }

    if (!this.message.timestamp) {
      this.message.timestamp = new Date();
    }

    return this.message as WebSocketMessage;
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * WebSocket Message Validator
 *
 * Utility class for validating WebSocket messages.
 */
export class WebSocketMessageValidator {
  private readonly rules: Map<string, ValidationRule[]> = new Map();

  addRule(feature: string, messageType: string, rules: ValidationRule[]): void {
    const key = `${feature}:${messageType}`;
    this.rules.set(key, rules);
  }

  validate(message: WebSocketMessage): { isValid: boolean; errors: string[] } {
    const key = `${message.feature}:${message.type}`;
    const rules = this.rules.get(key) || [];

    const errors: string[] = [];

    for (const rule of rules) {
      const value = this.getNestedValue(message.payload, rule.field);
      const fieldErrors = this.validateField(rule.field, value, rule);
      errors.push(...fieldErrors);
    }

    // Basic message validation
    if (!message.id) errors.push('Message ID is required');
    if (!message.type) errors.push('Message type is required');
    if (!message.feature) errors.push('Message feature is required');
    if (!message.timestamp) errors.push('Message timestamp is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateField(field: string, value: unknown, rule: ValidationRule): string[] {
    const errors: string[] = [];

    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      return errors;
    }

    // Skip further validation if value is not provided and not required
    if (value === undefined || value === null || value === '') {
      return errors;
    }

    // Type validation
    if (rule.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}, got ${actualType}`);
      }
    }

    // String length validation
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters long`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} must be no more than ${rule.maxLength} characters long`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} does not match required pattern`);
      }
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(`${field} failed custom validation`);
    }

    return errors;
  }

  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && current !== null) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  // Predefined validation rules
  static getCommonRules(): Record<string, ValidationRule[]> {
    return {
      'chat:message': [
        { field: 'chatId', required: true, type: 'string' },
        { field: 'content', required: true, type: 'string', minLength: 1, maxLength: 4000 },
        { field: 'senderId', required: true, type: 'string' }
      ],
      'notification:push': [
        { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 100 },
        { field: 'body', required: true, type: 'string', minLength: 1, maxLength: 500 },
        { field: 'recipientId', required: true, type: 'string' }
      ],
      'feed:update': [
        { field: 'type', required: true, type: 'string' },
        { field: 'postId', required: true, type: 'string' },
        { field: 'userId', required: true, type: 'string' }
      ]
    };
  }
}

/**
 * WebSocket Connection Monitor
 *
 * Utility class for monitoring WebSocket connection health.
 */
export class WebSocketConnectionMonitor {
  private readonly config: ConnectionMonitorConfig;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private missedHeartbeats = 0;
  private lastHeartbeatTime = 0;
  private onConnectionLost?: () => void;
  private onConnectionRestored?: () => void;

  constructor(config: Partial<ConnectionMonitorConfig> = {}) {
    this.config = {
      heartbeatInterval: 30000, // 30 seconds
      timeoutThreshold: 60000, // 1 minute
      maxMissedHeartbeats: 3,
      enableReconnect: true,
      ...config
    };
  }

  startMonitoring(
    sendMessage: (message: unknown) => Promise<void>,
    onConnectionLost?: () => void,
    onConnectionRestored?: () => void
  ): void {
    this.onConnectionLost = onConnectionLost || (() => { });
    this.onConnectionRestored = onConnectionRestored || (() => { });

    this.heartbeatTimer = setInterval(async () => {
      try {
        const now = Date.now();

        // Check if we've received a heartbeat within the threshold
        if (this.lastHeartbeatTime && (now - this.lastHeartbeatTime) > this.config.timeoutThreshold) {
          this.missedHeartbeats++;

          if (this.missedHeartbeats >= this.config.maxMissedHeartbeats) {
            this.handleConnectionLost();
          }
        }

        // Send ping
        await sendMessage({
          type: 'ping',
          feature: 'monitor',
          payload: { timestamp: now }
        });

      } catch (error) {
        console.error('[WebSocketMonitor] Heartbeat failed:', error);
        this.missedHeartbeats++;

        if (this.missedHeartbeats >= this.config.maxMissedHeartbeats) {
          this.handleConnectionLost();
        }
      }
    }, this.config.heartbeatInterval);
  }

  stopMonitoring(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  onHeartbeatReceived(): void {
    this.lastHeartbeatTime = Date.now();

    // Reset missed heartbeats if we were having issues
    if (this.missedHeartbeats > 0) {
      this.missedHeartbeats = 0;
      this.handleConnectionRestored();
    }
  }

  private handleConnectionLost(): void {
    console.warn('[WebSocketMonitor] Connection lost - too many missed heartbeats');
    this.onConnectionLost?.();
  }

  private handleConnectionRestored(): void {
    console.log('[WebSocketMonitor] Connection restored');
    this.onConnectionRestored?.();
  }

  getStatus(): {
    isMonitoring: boolean;
    missedHeartbeats: number;
    lastHeartbeatTime: number;
    connectionHealthy: boolean;
  } {
    const now = Date.now();
    const timeSinceLastHeartbeat = this.lastHeartbeatTime ? now - this.lastHeartbeatTime : Infinity;

    return {
      isMonitoring: this.heartbeatTimer !== null,
      missedHeartbeats: this.missedHeartbeats,
      lastHeartbeatTime: this.lastHeartbeatTime,
      connectionHealthy: timeSinceLastHeartbeat < this.config.timeoutThreshold
    };
  }
}

/**
 * Utility Functions
 */

/**
 * Create a standardized WebSocket message
 */
export function createWebSocketMessage(
  feature: string,
  type: string,
  payload: unknown,
  metadata?: Record<string, unknown>
): WebSocketMessage {
  return WebSocketMessageBuilder.create({
    feature,
    type,
    payload,
    ...(metadata && { metadata })
  }).build();
}

/**
 * Validate WebSocket message format
 */
export function isValidWebSocketMessage(message: unknown): message is WebSocketMessage {
  return Boolean(
    message &&
    typeof message === 'object' &&
    message !== null &&
    'id' in message &&
    'type' in message &&
    'feature' in message &&
    'payload' in message &&
    'timestamp' in message &&
    typeof (message as WebSocketMessage).id === 'string' &&
    typeof (message as WebSocketMessage).type === 'string' &&
    typeof (message as WebSocketMessage).feature === 'string' &&
    (message as WebSocketMessage).payload !== undefined &&
    (message as WebSocketMessage).timestamp instanceof Date
  );
}

/**
 * Extract feature from WebSocket message
 */
export function extractFeature(message: WebSocketMessage): string {
  return message.feature;
}

/**
 * Extract message type from WebSocket message
 */
export function extractMessageType(message: WebSocketMessage): string {
  return message.type;
}

/**
 * Check if message is from a specific feature
 */
export function isFromFeature(message: WebSocketMessage, feature: string): boolean {
  return message.feature === feature;
}

/**
 * Check if message is of a specific type
 */
export function isMessageType(message: WebSocketMessage, type: string): boolean {
  return message.type === type;
}

/**
 * Filter messages by feature and type
 */
export function filterMessages(
  messages: WebSocketMessage[],
  feature?: string,
  type?: string
): WebSocketMessage[] {
  return messages.filter(message => {
    if (feature && message.feature !== feature) return false;
    if (type && message.type !== type) return false;
    return true;
  });
}

/**
 * Sort messages by timestamp (newest first)
 */
export function sortMessagesByTimestamp(messages: WebSocketMessage[]): WebSocketMessage[] {
  return [...messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Group messages by feature
 */
export function groupMessagesByFeature(messages: WebSocketMessage[]): Record<string, WebSocketMessage[]> {
  return messages.reduce((groups, message) => {
    const feature = message.feature;
    if (!groups[feature]) {
      groups[feature] = [];
    }
    groups[feature].push(message);
    return groups;
  }, {} as Record<string, WebSocketMessage[]>);
}

/**
 * Calculate message statistics
 */
export function calculateMessageStats(messages: WebSocketMessage[]): {
  total: number;
  byFeature: Record<string, number>;
  byType: Record<string, number>;
  oldestMessage: Date | null;
  newestMessage: Date | null;
} {
  const stats = {
    total: messages.length,
    byFeature: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    oldestMessage: null as Date | null,
    newestMessage: null as Date | null
  };

  messages.forEach(message => {
    // Count by feature
    stats.byFeature[message.feature] = (stats.byFeature[message.feature] || 0) + 1;

    // Count by type
    stats.byType[message.type] = (stats.byType[message.type] || 0) + 1;

    // Track oldest/newest
    if (!stats.oldestMessage || message.timestamp < stats.oldestMessage) {
      stats.oldestMessage = message.timestamp;
    }
    if (!stats.newestMessage || message.timestamp > stats.newestMessage) {
      stats.newestMessage = message.timestamp;
    }
  });

  return stats;
}
