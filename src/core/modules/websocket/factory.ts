/**
 * WebSocket System Factory Functions
 *
 * Factory functions for creating WebSocket services following Black Box pattern.
 * Provides clean service creation with dependency injection support.
 */

import type { Container } from '../di';
import type {
    IWebSocketService,
    WebSocketConfig,
    WebSocketMessage
} from '../types';


// Local WebSocket state enum
enum WebSocketState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting',
    ERROR = 'error'
}

/**
 * Creates a WebSocket service with default configuration
 *
 * @returns WebSocket service instance
 */
export function createDefaultWebSocketService(): IWebSocketService {
    const config: WebSocketConfig = {
        url: '',
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        timeout: 10000
    };

    return createWebSocketService(config);
}

/**
 * Creates a WebSocket service with custom configuration
 *
 * @param config - WebSocket configuration
 * @returns WebSocket service instance
 */
export function createWebSocketService(config: WebSocketConfig): IWebSocketService {
    return new WebSocketServiceImplementation(config);
}

/**
 * Creates a WebSocket service with dependency injection
 *
 * @param container - DI container
 * @param config - WebSocket configuration
 * @returns WebSocket service instance
 */
export function createWebSocketServiceFromDI(container: Container, config?: WebSocketConfig): IWebSocketService {
    const finalConfig = { ...getDefaultWebSocketConfig(), ...config };
    return new WebSocketServiceImplementation(finalConfig);
}

/**
 * Creates a mock WebSocket service for testing
 *
 * @param config - Optional mock configuration
 * @returns Mock WebSocket service instance
 */
export function createMockWebSocketService(config?: Partial<WebSocketConfig>): IWebSocketService {
    return new MockWebSocketService(config);
}

/**
 * Creates a WebSocket service for specific environment
 *
 * @param environment - Environment name
 * @returns WebSocket service instance
 */
export function createWebSocketServiceForEnvironment(environment: 'development' | 'production' | 'test'): IWebSocketService {
    const configs = {
        development: {
            url: 'ws://localhost:8080/ws',
            reconnectInterval: 1000,
            maxReconnectAttempts: 10,
            timeout: 5000
        },
        production: {
            url: 'wss://api.quietspace.com/ws',
            reconnectInterval: 3000,
            maxReconnectAttempts: 5,
            timeout: 10000
        },
        test: {
            url: 'ws://test.quietspace.com/ws',
            reconnectInterval: 500,
            maxReconnectAttempts: 3,
            timeout: 2000
        }
    };

    return createWebSocketService(configs[environment]);
}

/**
 * Creates an authenticated WebSocket service
 *
 * @param token - Authentication token
 * @param config - WebSocket configuration
 * @returns Authenticated WebSocket service instance
 */
export function createAuthenticatedWebSocketService(token: string, config?: WebSocketConfig): IWebSocketService {
    const finalConfig = { ...getDefaultWebSocketConfig(), ...config };
    return new AuthenticatedWebSocketService(token, finalConfig);
}

/**
 * Creates a WebSocket service with custom message handlers
 *
 * @param handlers - Custom message handlers
 * @param config - WebSocket configuration
 * @returns WebSocket service instance
 */
export function createWebSocketServiceWithHandlers(
    handlers: Record<string, (message: WebSocketMessage) => void>,
    config?: WebSocketConfig
): IWebSocketService {
    const service = createWebSocketService(config);

    // Register custom handlers
    Object.entries(handlers).forEach(([event, handler]) => {
        service.subscribe(event, handler);
    });

    return service;
}

/**
 * Gets default WebSocket configuration
 *
 * @returns Default WebSocket configuration
 */
export function getDefaultWebSocketConfig(): WebSocketConfig {
    return {
        url: '',
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        timeout: 10000,
        protocols: ['websocket']
    };
}

// Implementation classes
class WebSocketServiceImplementation implements IWebSocketService {
    private readonly config: WebSocketConfig;
    private ws: WebSocket | null = null;
    private state: WebSocketState = WebSocketState.DISCONNECTED;
    private readonly subscribers: Map<string, Set<(message: WebSocketMessage) => void>> = new Map();
    private reconnectAttempts = 0;
    private reconnectTimer: NodeJS.Timeout | null = null;

    constructor(config: WebSocketConfig) {
        this.config = { ...getDefaultWebSocketConfig(), ...config };
    }

    async connect(): Promise<void> {
        if (this.state === WebSocketState.CONNECTED || this.state === WebSocketState.CONNECTING) {
            return;
        }

        this.state = WebSocketState.CONNECTING;

        try {
            this.ws = new WebSocket(this.config.url, this.config.protocols);

            this.ws.onopen = () => {
                this.state = WebSocketState.CONNECTED;
                this.reconnectAttempts = 0;
                this.emit({ type: 'connected', data: {}, timestamp: Date.now() });
            };

            this.ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    this.emit(message);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                this.state = WebSocketState.DISCONNECTED;
                this.emit({ type: 'disconnected', data: {}, timestamp: Date.now() });
                this.handleReconnect();
            };

            this.ws.onerror = () => {
                this.state = WebSocketState.ERROR;
                this.emit({ type: 'error', data: {}, timestamp: Date.now() });
            };

            // Set timeout
            if (this.config.timeout) {
                setTimeout(() => {
                    if (this.state === WebSocketState.CONNECTING) {
                        this.ws?.close();
                        this.state = WebSocketState.ERROR;
                        this.emit({ type: 'timeout', data: {}, timestamp: Date.now() });
                    }
                }, this.config.timeout);
            }
        } catch (error) {
            this.state = WebSocketState.ERROR;
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.state = WebSocketState.DISCONNECTED;
    }

    async send(message: WebSocketMessage): Promise<void> {
        if (this.state !== WebSocketState.CONNECTED || !this.ws) {
            throw new Error('WebSocket is not connected');
        }

        this.ws.send(JSON.stringify(message));
    }

    subscribe(event: string, handler: (message: WebSocketMessage) => void): () => void {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }

        this.subscribers.get(event)!.add(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.subscribers.get(event);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.subscribers.delete(event);
                }
            }
        };
    }

    isConnected(): boolean {
        return this.state === WebSocketState.CONNECTED;
    }

    getState(): WebSocketState {
        return this.state;
    }

    private emit(message: WebSocketMessage): void {
        const handlers = this.subscribers.get(message.type);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(message);
                } catch (error) {
                    console.error('Error in WebSocket message handler:', error);
                }
            });
        }
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
            this.state = WebSocketState.ERROR;
            this.emit({ type: 'reconnect_failed', data: {}, timestamp: Date.now() });
            return;
        }

        this.reconnectAttempts++;
        this.state = WebSocketState.RECONNECTING;

        this.reconnectTimer = setTimeout(() => {
            this.connect();
        }, this.config.reconnectInterval);
    }
}

class MockWebSocketService implements IWebSocketService {
    private readonly config: Partial<WebSocketConfig>;
    private state: WebSocketState = WebSocketState.DISCONNECTED;
    private readonly subscribers: Map<string, Set<(message: WebSocketMessage) => void>> = new Map();
    private connected = false;

    constructor(config?: Partial<WebSocketConfig>) {
        this.config = config || {};
    }

    async connect(): Promise<void> {
        this.state = WebSocketState.CONNECTING;

        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 100));

        this.connected = true;
        this.state = WebSocketState.CONNECTED;
        this.emit({ type: 'connected', data: {}, timestamp: Date.now() });
    }

    async disconnect(): Promise<void> {
        this.connected = false;
        this.state = WebSocketState.DISCONNECTED;
        this.emit({ type: 'disconnected', data: {}, timestamp: Date.now() });
    }

    async send(message: WebSocketMessage): Promise<void> {
        if (!this.connected) {
            throw new Error('Mock WebSocket is not connected');
        }

        // Simulate message sending
        console.log('Mock WebSocket sending:', message);
    }

    subscribe(event: string, handler: (message: WebSocketMessage) => void): () => void {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }

        this.subscribers.get(event)!.add(handler);

        return () => {
            const handlers = this.subscribers.get(event);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.subscribers.delete(event);
                }
            }
        };
    }

    isConnected(): boolean {
        return this.connected;
    }

    getState(): WebSocketState {
        return this.state;
    }

    private emit(message: WebSocketMessage): void {
        const handlers = this.subscribers.get(message.type);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(message);
                } catch (error) {
                    console.error('Error in Mock WebSocket message handler:', error);
                }
            });
        }
    }
}

class AuthenticatedWebSocketService extends WebSocketServiceImplementation {
    private readonly token: string;
    private readonly authConfig: WebSocketConfig;

    constructor(token: string, config: WebSocketConfig) {
        super(config);
        this.token = token;
        this.authConfig = { ...config };
    }

    async connect(): Promise<void> {
        // Add authentication to URL or headers
        const finalConfig = {
            ...this.authConfig,
            url: `${this.authConfig.url}?token=${this.token}`
        };

        // Would implement actual authentication logic here
        await super.connect();
    }

    async send(message: WebSocketMessage): Promise<void> {
        // Add authentication token to message
        const authenticatedMessage = {
            ...message,
            token: this.token
        };

        await super.send(authenticatedMessage);
    }
}
