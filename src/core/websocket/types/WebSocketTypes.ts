/**
 * WebSocket Types.
 *
 * TypeScript type definitions for WebSocket operations.
 */

import { CacheInvalidationConfig } from '../cache/WebSocketCacheManager';
import { ConnectionPoolConfig } from '../managers/ConnectionManager';
import { WebSocketConfig } from '../services/EnterpriseWebSocketService';
import { RoutingMetrics, MessageRouterConfig } from '../services/MessageRouter';

import type { CacheInvalidationStrategy } from '../cache/WebSocketCacheManager';
import type { ConnectionPool, ConnectionHealth } from '../managers/ConnectionManager';
import type { WebSocketMessage, ConnectionMetrics } from '../services/EnterpriseWebSocketService';
import type { MessageRoute } from '../services/MessageRouter';




// Feature Configuration Types
export interface WebSocketFeatureConfig {
  name: string;
  enabled: boolean;
  priority: number;
  maxConnections: number;
  heartbeatInterval: number;
  reconnectAttempts: number;
  messageValidation: boolean;
  cacheInvalidation: boolean;
  customRoutes?: MessageRoute[];
}

export interface WebSocketServiceConfig {
  url: string;
  features: WebSocketFeatureConfig[];
  globalSettings: {
    enableMetrics: boolean;
    enableHealthChecks: boolean;
    enableCacheIntegration: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
  };
}

export interface WebSocketConnectionConfig {
  token: string;
  autoConnect: boolean;
  autoReconnect: boolean;
  connectionTimeout: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  enableMetrics: boolean;
}

export interface WebSocketMessageConfig {
  enableValidation: boolean;
  enableTransformation: boolean;
  maxMessageSize: number;
  messageTimeout: number;
  retryAttempts: number;
  deadLetterQueue: boolean;
}

export interface WebSocketCacheConfig {
  enableAutoInvalidation: boolean;
  enableMessagePersistence: boolean;
  defaultTTL: number;
  maxCacheSize: number;
  invalidationStrategies: CacheInvalidationStrategy[];
}

// Event Types
export interface WebSocketEvent<T = unknown> {
  type: string;
  timestamp: Date;
  data: T;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface WebSocketConnectionEvent extends WebSocketEvent {
  type: 'connection:opened' | 'connection:closed' | 'connection:error' | 'connection:reconnecting';
  data: {
    connectionId: string;
    feature?: string;
    error?: Error;
  };
}

export interface WebSocketMessageEvent extends WebSocketEvent {
  type: 'message:sent' | 'message:received' | 'message:failed';
  data: {
    message: WebSocketMessage;
    error?: Error;
  };
}

export interface WebSocketFeatureEvent extends WebSocketEvent {
  type: 'feature:subscribed' | 'feature:unsubscribed' | 'feature:error';
  data: {
    feature: string;
    connectionId?: string;
    error?: Error;
  };
}

export interface WebSocketHealthEvent extends WebSocketEvent {
  type: 'health:passed' | 'health:failed' | 'health:degraded';
  data: {
    connectionId: string;
    health: ConnectionHealth;
  };
}

// State Types
export interface WebSocketState {
  connections: Map<string, ConnectionPool>;
  activeFeatures: Set<string>;
  metrics: WebSocketMetrics;
  config: WebSocketServiceConfig;
}

export interface WebSocketMetrics {
  connections: {
    total: number;
    active: number;
    healthy: number;
    unhealthy: number;
  };
  messages: {
    sent: number;
    received: number;
    failed: number;
    queued: number;
  };
  performance: {
    averageLatency: number;
    messageProcessingTime: number;
    connectionUptime: number;
  };
  features: Map<string, FeatureMetrics>;
}

export interface FeatureMetrics {
  name: string;
  messages: {
    sent: number;
    received: number;
    failed: number;
  };
  connections: {
    active: number;
    total: number;
  };
  cache: {
    invalidations: number;
    hits: number;
    misses: number;
  };
}

// Hook Types
export interface UseEnterpriseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
  enableMetrics?: boolean;
  connectionTimeout?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface UseFeatureWebSocketOptions extends UseEnterpriseWebSocketOptions {
  feature: string;
  priority?: number;
  maxMessages?: number;
  enablePersistence?: boolean;
}

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  lastError: Date | null;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';
}

// Error Types
export interface WebSocketError extends Error {
  code: string;
  feature?: string;
  connectionId?: string;
  timestamp: Date;
  retryable: boolean;
}

export interface WebSocketConnectionError extends WebSocketError {
  code: 'CONNECTION_FAILED' | 'CONNECTION_TIMEOUT' | 'CONNECTION_REFUSED' | 'CONNECTION_LOST';
}

export interface WebSocketMessageError extends WebSocketError {
  code: 'MESSAGE_TOO_LARGE' | 'MESSAGE_INVALID' | 'MESSAGE_NOT_DELIVERED';
  messageId?: string;
}

export interface WebSocketAuthenticationError extends WebSocketError {
  code: 'AUTHENTICATION_FAILED' | 'AUTHENTICATION_EXPIRED' | 'AUTHORIZATION_FAILED';
}

export interface WebSocketRateLimitError extends WebSocketError {
  code: 'RATE_LIMIT_EXCEEDED' | 'TOO_MANY_CONNECTIONS';
  retryAfter?: number;
}

// Validation Types
export interface MessageValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export interface MessageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Monitoring Types
export interface WebSocketHealthCheck {
  connectionId: string;
  timestamp: Date;
  status: 'healthy' | 'degraded' | 'unhealthy';
  metrics: {
    latency: number;
    uptime: number;
    messageRate: number;
    errorRate: number;
  };
  issues: string[];
}

export interface WebSocketMonitoringConfig {
  enableHealthChecks: boolean;
  healthCheckInterval: number;
  enableMetrics: boolean;
  metricsInterval: number;
  enableAlerts: boolean;
  alertThresholds: {
    latency: number;
    errorRate: number;
    connectionCount: number;
  };
}

// Integration Types
export interface WebSocketIntegrationConfig {
  features: string[];
  services: {
    cache: boolean;
    logging: boolean;
    monitoring: boolean;
    analytics: boolean;
  };
  hooks: {
    beforeConnect?: () => Promise<void>;
    afterConnect?: () => Promise<void>;
    beforeDisconnect?: () => Promise<void>;
    afterDisconnect?: () => Promise<void>;
    beforeMessage?: (message: WebSocketMessage) => Promise<WebSocketMessage>;
    afterMessage?: (message: WebSocketMessage) => Promise<void>;
  };
}

// Utility Types
export type WebSocketEventListener = {
  onConnect?: () => void;
  onDisconnect?: (event: CloseEvent) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onReconnect?: (attempt: number) => void;
};

export type WebSocketEventHandler<T = unknown> = (event: WebSocketEvent<T>) => void;

export type WebSocketFeatureHandler = {
  feature: string;
  handler: (message: WebSocketMessage) => Promise<void> | void;
  validator?: (message: WebSocketMessage) => boolean;
  transformer?: (message: WebSocketMessage) => WebSocketMessage;
};

export type WebSocketConnectionInfo = {
  id: string;
  feature: string;
  state: WebSocketConnectionState;
  metrics: ConnectionMetrics;
  health: ConnectionHealth | null;
  createdAt: Date;
  lastActivity: Date;
};

// Type Guards
export function isWebSocketError(error: unknown): error is WebSocketError {
  return Boolean(error && typeof error === 'object' && 'code' in error && 'timestamp' in error);
}

export function isConnectionError(error: WebSocketError): error is WebSocketConnectionError {
  return [
    'CONNECTION_FAILED',
    'CONNECTION_TIMEOUT',
    'CONNECTION_REFUSED',
    'CONNECTION_LOST'
  ].includes(error.code);
}

export function isMessageError(error: WebSocketError): error is WebSocketMessageError {
  return [
    'MESSAGE_TOO_LARGE',
    'MESSAGE_INVALID',
    'MESSAGE_NOT_DELIVERED'
  ].includes(error.code);
}

export function isAuthenticationError(error: WebSocketError): error is WebSocketAuthenticationError {
  return [
    'AUTHENTICATION_FAILED',
    'AUTHENTICATION_EXPIRED',
    'AUTHORIZATION_FAILED'
  ].includes(error.code);
}

export function isRateLimitError(error: WebSocketError): error is WebSocketRateLimitError {
  return [
    'RATE_LIMIT_EXCEEDED',
    'TOO_MANY_CONNECTIONS'
  ].includes(error.code);
}

// Default Values
export const DEFAULT_WEBSOCKET_CONFIG: WebSocketServiceConfig = {
  url: 'ws://localhost:3001/ws',
  features: [],
  globalSettings: {
    enableMetrics: true,
    enableHealthChecks: true,
    enableCacheIntegration: true,
    logLevel: 'info'
  }
};

export const DEFAULT_CONNECTION_CONFIG: WebSocketConnectionConfig = {
  token: '',
  autoConnect: false,
  autoReconnect: true,
  connectionTimeout: 10000,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000,
  enableMetrics: true
};

export const DEFAULT_MESSAGE_CONFIG: WebSocketMessageConfig = {
  enableValidation: true,
  enableTransformation: false,
  maxMessageSize: 1024 * 1024,
  messageTimeout: 5000,
  retryAttempts: 3,
  deadLetterQueue: true
};

export const DEFAULT_CACHE_CONFIG: WebSocketCacheConfig = {
  enableAutoInvalidation: true,
  enableMessagePersistence: true,
  defaultTTL: 300000,
  maxCacheSize: 1000,
  invalidationStrategies: []
};
