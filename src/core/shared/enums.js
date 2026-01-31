/**
 * Core System Shared Enums
 * 
 * Centralized enum definitions for all core system interfaces.
 * Provides clean enum exports following Black Box pattern.
 */

// WebSocket State Enum
export const WebSocketState = Object.freeze({
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
});

// Log Level Enum
export const LogLevel = Object.freeze({
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
});

// Cache Strategy Enum
export const CacheStrategy = Object.freeze({
  LRU: 'lru',
  FIFO: 'fifo',
  LFU: 'lfu'
});

// Authentication Provider Enum
export const AuthProvider = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
  MICROSOFT: 'microsoft'
});

// Theme Variant Enum
export const ThemeVariant = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
});

// Service Status Enum
export const ServiceStatus = Object.freeze({
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
  STOPPING: 'stopping',
  STOPPED: 'stopped'
});

// Network Status Enum
export const NetworkStatus = Object.freeze({
  ONLINE: 'online',
  OFFLINE: 'offline',
  CONNECTING: 'connecting',
  ERROR: 'error'
});

// Core System Status Enum
export const CoreSystemStatus = Object.freeze({
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
  SHUTTING_DOWN: 'shutting_down',
  SHUTDOWN: 'shutdown'
});
