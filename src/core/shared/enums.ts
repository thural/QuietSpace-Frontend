/**
 * Core System Shared Enums
 * 
 * Centralized enum definitions for all core system interfaces.
 * Provides clean enum exports following Black Box pattern.
 */

// WebSocket State Enum
export enum WebSocketState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting',
    ERROR = 'error'
}

// Log Level Enum
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

// Cache Strategy Enum
export enum CacheStrategy {
    LRU = 'lru',
    FIFO = 'fifo',
    LFU = 'lfu'
}

// Authentication Provider Enum
export enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    GITHUB = 'github',
    MICROSOFT = 'microsoft'
}

// Theme Variant Enum
export enum ThemeVariant {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

// Service Status Enum
export enum ServiceStatus {
    INITIALIZING = 'initializing',
    READY = 'ready',
    ERROR = 'error',
    STOPPING = 'stopping',
    STOPPED = 'stopped'
}

// Network Status Enum
export enum NetworkStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
    CONNECTING = 'connecting',
    ERROR = 'error'
}

// Core System Status Enum
export enum CoreSystemStatus {
    INITIALIZING = 'initializing',
    READY = 'ready',
    ERROR = 'error',
    SHUTTING_DOWN = 'shutting_down',
    SHUTDOWN = 'shutdown'
}