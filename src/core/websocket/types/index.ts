/**
 * WebSocket System Types
 *
 * Centralized type definitions for the WebSocket system.
 * Provides clean type exports following Black Box pattern.
 */

// Core WebSocket interfaces
export interface IWebSocketService {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: WebSocketMessage): Promise<void>;
    subscribe(event: string, handler: (message: WebSocketMessage) => void): () => void;
    unsubscribe(event: string, handler: (message: WebSocketMessage) => void): void;
    isConnected(): boolean;
    getState(): WebSocketState;
    getConnectionInfo(): WebSocketConnectionInfo;
    ping(): Promise<number>;
}

export interface IWebSocketManager extends IWebSocketService {
    createConnection(config: WebSocketConfig): IWebSocketService;
    getConnection(id: string): IWebSocketService | null;
    removeConnection(id: string): void;
    getAllConnections(): IWebSocketService[];
    broadcast(message: WebSocketMessage): Promise<void>;
    getConnectionCount(): number;
    closeAllConnections(): Promise<void>;
}

// WebSocket configuration interfaces
export interface WebSocketConfig {
    url: string;
    protocols?: string[];
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    timeout?: number;
    enableCompression?: boolean;
    enableMetrics?: boolean;
    heartbeatInterval?: number;
    messageQueueSize?: number;
    bufferSize?: number;
    headers?: Record<string, string>;
}

export interface WebSocketManagerConfig extends WebSocketConfig {
    maxConnections?: number;
    defaultTimeout?: number;
    enableAutoReconnect?: boolean;
    enableConnectionPooling?: boolean;
    enableMetrics?: boolean;
    enableHealthCheck?: boolean;
    healthCheckInterval?: number;
}

// WebSocket message interfaces
export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: number;
    id?: string;
    correlationId?: string;
    source?: string;
    target?: string;
    metadata?: Record<string, any>;
}

export interface WebSocketRequest extends WebSocketMessage {
    requestId: string;
    method?: string;
    params?: Record<string, any>;
}

export interface WebSocketResponse extends WebSocketMessage {
    requestId: string;
    success: boolean;
    data?: any;
    error?: WebSocketError;
}

export interface WebSocketError {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
}

// WebSocket state and status interfaces
export enum WebSocketState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting',
    ERROR = 'error',
    CLOSING = 'closing'
}

export enum WebSocketStatus {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}

export interface WebSocketConnectionInfo {
    url: string;
    state: WebSocketState;
    status: WebSocketStatus;
    connectedAt?: number;
    lastActivity?: number;
    reconnectCount?: number;
    error?: Error | null;
}

export interface WebSocketConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    error: Error | null;
    lastConnected?: Date;
    reconnectAttempts: number;
}

// WebSocket event interfaces
export interface WebSocketEvent {
    type: WebSocketEventType;
    connectionId?: string;
    timestamp: number;
    data?: any;
    metadata?: Record<string, any>;
}

export type WebSocketEventHandler = (event: WebSocketEvent) => void;

// WebSocket metrics interfaces
export interface WebSocketMetrics {
    totalConnections: number;
    activeConnections: number;
    totalMessages: number;
    totalBytesReceived: number;
    totalBytesSent: number;
    averageLatency: number;
    errorCount: number;
    reconnectCount: number;
    uptime: number;
    lastReset: number;
}

export interface WebSocketConnectionMetrics {
    connectionId: string;
    messagesReceived: number;
    messagesSent: number;
    bytesReceived: number;
    bytesSent: number;
    averageLatency: number;
    errorCount: number;
    reconnectCount: number;
    connectedAt: number;
    lastActivity: number;
}

// WebSocket authentication interfaces
export interface IWebSocketAuthenticator {
    authenticate(config: WebSocketAuthConfig): Promise<WebSocketAuthToken>;
    refreshToken(token: WebSocketAuthToken): Promise<WebSocketAuthToken>;
    validateToken(token: WebSocketAuthToken): Promise<boolean>;
    logout(token: WebSocketAuthToken): Promise<void>;
}

export interface WebSocketAuthConfig {
    type: 'jwt' | 'token' | 'basic' | 'oauth';
    credentials?: WebSocketCredentials;
    tokenEndpoint?: string;
    refreshEndpoint?: string;
    validateEndpoint?: string;
}

export interface WebSocketCredentials {
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
    secret?: string;
}

export interface WebSocketAuthToken {
    token: string;
    refreshToken?: string;
    expiresAt: number;
    type: string;
    permissions?: string[];
}

// WebSocket security interfaces
export interface IWebSocketSecurity {
    validateMessage(message: WebSocketMessage): boolean;
    sanitizeMessage(message: WebSocketMessage): WebSocketMessage;
    encryptMessage(message: WebSocketMessage): Promise<WebSocketMessage>;
    decryptMessage(message: WebSocketMessage): Promise<WebSocketMessage>;
    isOriginAllowed(origin: string): boolean;
    isRateLimited(connectionId: string): boolean;
}

export interface WebSocketSecurityConfig {
    enableMessageValidation?: boolean;
    enableMessageSanitization?: boolean;
    enableEncryption?: boolean;
    allowedOrigins?: string[];
    rateLimitConfig?: RateLimitConfig;
    maxMessageSize?: number;
    maxConnectionsPerOrigin?: number;
}

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    blockDurationMs: number;
}

// WebSocket middleware interfaces
export interface IWebSocketMiddleware {
    name: string;
    priority: number;
    execute(context: WebSocketContext, next: () => Promise<any>): Promise<any>;
}

export interface WebSocketContext {
    connection: IWebSocketService;
    message: WebSocketMessage;
    config: WebSocketConfig;
    metadata?: Record<string, any>;
}

// WebSocket factory interfaces
export interface IWebSocketFactory {
    createService(config?: WebSocketConfig): IWebSocketService;
    createManager(config?: WebSocketManagerConfig): IWebSocketManager;
    createAuthenticator(config: WebSocketAuthConfig): IWebSocketAuthenticator;
    createSecurity(config: WebSocketSecurityConfig): IWebSocketSecurity;
}

// WebSocket plugin interfaces
export interface IWebSocketPlugin {
    name: string;
    version: string;
    install(service: IWebSocketService): void;
    uninstall(service: IWebSocketService): void;
    isCompatible(version: string): boolean;
}

// WebSocket pool interfaces
export interface IWebSocketPool {
    acquire(config?: WebSocketConfig): Promise<IWebSocketService>;
    release(connection: IWebSocketService): void;
    getAvailableCount(): number;
    getActiveCount(): number;
    getMaxSize(): number;
    setMaxSize(size: number): void;
    clear(): void;
    close(): Promise<void>;
}

// WebSocket subscription interfaces
export interface IWebSocketSubscription {
    id: string;
    event: string;
    handler: WebSocketEventHandler;
    active: boolean;
    createdAt: number;
    lastTriggered?: number;
    triggerCount: number;
}

export interface IWebSocketSubscriptionManager {
    subscribe(event: string, handler: WebSocketEventHandler): string;
    unsubscribe(subscriptionId: string): void;
    unsubscribeEvent(event: string): void;
    unsubscribeAll(): void;
    getSubscription(id: string): IWebSocketSubscription | null;
    getSubscriptions(event?: string): IWebSocketSubscription[];
    getActiveSubscriptionCount(): number;
}

// WebSocket health check interfaces
export interface IWebSocketHealthChecker {
    checkHealth(): Promise<WebSocketHealthStatus>;
    startHealthCheck(interval: number): void;
    stopHealthCheck(): void;
    isHealthy(): boolean;
}

export interface WebSocketHealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded' | 'unknown';
    connectionCount: number;
    averageLatency: number;
    errorRate: number;
    uptime: number;
    lastCheck: number;
    issues: string[];
    recommendations: string[];
}

// WebSocket configuration presets
export const DEFAULT_WEBSOCKET_CONFIG: WebSocketConfig = {
    url: '',
    protocols: ['websocket'],
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    timeout: 10000,
    enableCompression: false,
    enableMetrics: true,
    heartbeatInterval: 30000,
    messageQueueSize: 1000,
    bufferSize: 64 * 1024 // 64KB
};

export const DEVELOPMENT_WEBSOCKET_CONFIG: WebSocketConfig = {
    ...DEFAULT_WEBSOCKET_CONFIG,
    reconnectInterval: 1000,
    maxReconnectAttempts: 10,
    timeout: 5000,
    enableMetrics: true,
    heartbeatInterval: 10000
};

export const PRODUCTION_WEBSOCKET_CONFIG: WebSocketConfig = {
    ...DEFAULT_WEBSOCKET_CONFIG,
    reconnectInterval: 5000,
    maxReconnectAttempts: 3,
    timeout: 15000,
    enableCompression: true,
    enableMetrics: true,
    heartbeatInterval: 60000
};

export const TEST_WEBSOCKET_CONFIG: WebSocketConfig = {
    ...DEFAULT_WEBSOCKET_CONFIG,
    reconnectInterval: 500,
    maxReconnectAttempts: 2,
    timeout: 2000,
    enableMetrics: false,
    heartbeatInterval: 5000
};

// WebSocket error types
export enum WebSocketErrorType {
    CONNECTION_FAILED = 'CONNECTION_FAILED',
    CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
    CONNECTION_LOST = 'CONNECTION_LOST',
    MESSAGE_TOO_LARGE = 'MESSAGE_TOO_LARGE',
    INVALID_MESSAGE = 'INVALID_MESSAGE',
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
    AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
    RATE_LIMITED = 'RATE_LIMITED',
    ORIGIN_NOT_ALLOWED = 'ORIGIN_NOT_ALLOWED',
    PROTOCOL_ERROR = 'PROTOCOL_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface WebSocketError extends Error {
    type: WebSocketErrorType;
    code?: number;
    connectionId?: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

// WebSocket validation rules
export const WEBSOCKET_VALIDATION_RULES = {
    url: {
        required: true,
        pattern: /^(ws|wss):\/\/.+/,
        maxLength: 2048
    },
    protocols: {
        required: false,
        maxItems: 10,
        maxLength: 64
    },
    reconnectInterval: {
        min: 100,
        max: 60000
    },
    maxReconnectAttempts: {
        min: 0,
        max: 100
    },
    timeout: {
        min: 1000,
        max: 300000
    },
    messageSize: {
        min: 1,
        max: 1024 * 1024 // 1MB
    }
};

// WebSocket utility types
export type WebSocketEventType =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error'
    | 'message'
    | 'reconnecting'
    | 'close'
    | 'ping'
    | 'pong'
    | 'timeout'
    | 'rate_limited'
    | 'auth_failed'
    | 'origin_blocked';

export type WebSocketProtocol = 'ws' | 'wss';
export type WebSocketCloseCode = 1000 | 1001 | 1002 | 1003 | 1004 | 1005 | 1006 | 1007 | 1008 | 1009 | 1010 | 1011 | 1015 | 3000 | 4000 | 4001 | 4002 | 4003 | 4004 | 4005 | 4006 | 4007 | 4010 | 4011 | 4012 | 4013 | 4014 | 4015 | 4016 | 4017 | 4018 | 4019 | 4020 | 4021 | 4022 | 4023 | 4024 | 4025 | 4026 | 4027 | 4028 | 4029 | 4030 | 4031 | 4032 | 4033 | 4034 | 4035 | 4036 | 4037 | 4038 | 4039 | 4040 | 4041 | 4042 | 4043 | 4044 | 4045 | 4046 | 4047 | 4048 | 4049 | 4050 | 4051 | 4052 | 4053 | 4054 | 4055 | 4056 | 4057 | 4058 | 4059 | 4060 | 4061 | 4062 | 4063 | 4064 | 4065 | 4066 | 4067 | 4068 | 4069 | 4070 | 4071 | 4072 | 4073 | 4074 | 4075 | 4076 | 4077 | 4078 | 4079 | 4080 | 4081 | 4082 | 4083 | 4084 | 4085 | 4086 | 4087 | 4088 | 4089 | 4090 | 4091 | 4092 | 4093 | 4094 | 4095 | 4096 | 4097 | 4098 | 4099 | 4100 | 4101 | 4102 | 4103 | 4104 | 4105 | 4106 | 4107 | 4108 | 4109 | 4110 | 4111 | 4112 | 4113 | 4114 | 4115 | 4116 | 4117 | 4118 | 4119 | 4120 | 4121 | 4122 | 4123 | 4124 | 4125 | 4126 | 4127 | 4128 | 4129 | 4130 | 4131 | 4132 | 4133 | 4134 | 4135 | 4136 | 4137 | 4138 | 4139 | 4140 | 4141 | 4142 | 4143 | 4144 | 4145 | 4146 | 4147 | 4148 | 4149 | 4150 | 4151 | 4152 | 4153 | 4154 | 4155 | 4156 | 4157 | 4158 | 4159 | 4160 | 4161 | 4162 | 4163 | 4164 | 4165 | 4166 | 4167 | 4168 | 4169 | 4170 | 4171 | 4172 | 4173 | 4174 | 4175 | 4176 | 4177 | 4178 | 4179 | 4180 | 4181 | 4182 | 4183 | 4184 | 4185 | 4186 | 4187 | 4188 | 4189 | 4190 | 4191 | 4192 | 4193 | 4194 | 4195 | 4196 | 4197 | 4198 | 4199 | 4200 | 4201 | 4202 | 4203 | 4204 | 4205 | 4206 | 4207 | 4208 | 4209 | 4210 | 4211 | 4212 | 4213 | 4214 | 4215 | 4216 | 4217 | 4218 | 4219 | 4220 | 4221 | 4222 | 4223 | 4224 | 4225 | 4226 | 4227 | 4228 | 4229 | 4230 | 4231 | 4232 | 4233 | 4234 | 4235 | 4236 | 4237 | 4238 | 4239 | 4240 | 4241 | 4242 | 4243 | 4244 | 4245 | 4246 | 4247 | 4248 | 4249 | 4250 | 4251 | 4252 | 4253 | 4254 | 4255 | 4256 | 4257 | 4258 | 4259 | 4260 | 4261 | 4262 | 4263 | 4264 | 4265 | 4266 | 4267 | 4268 | 4269 | 4270 | 4271 | 4272 | 4273 | 4274 | 4275 | 4276 | 4277 | 4278 | 4279 | 4280 | 4281 | 4282 | 4283 | 4284 | 4285 | 4286 | 4287 | 4288 | 4289 | 4290 | 4291 | 4292 | 4293 | 4294 | 4295 | 4296 | 4297 | 4298 | 4299 | 4300 | 4301 | 4302 | 4303 | 4304 | 4305 | 4306 | 4307 | 4308 | 4309 | 4310 | 4311 | 4312 | 4313 | 4314 | 4315 | 4316 | 4317 | 4318 | 4319 | 4320 | 4321 | 4322 | 4323 | 4324 | 4325 | 4326 | 4327 | 4328 | 4329 | 4330 | 4331 | 4332 | 4333 | 4334 | 4335 | 4336 | 4337 | 4338 | 4339 | 4340 | 4341 | 4342 | 4343 | 4344 | 4345 | 4346 | 4347 | 4348 | 4349 | 4350 | 4351 | 4352 | 4353 | 4354 | 4355 | 4356 | 4357 | 4358 | 4359 | 4360 | 4361 | 4362 | 4363 | 4364 | 4365 | 4366 | 4367 | 4368 | 4369 | 4370 | 4371 | 4372 | 4373 | 4374 | 4375 | 4376 | 4377 | 4378 | 4379 | 4380 | 4381 | 4382 | 4383 | 4384 | 4385 | 4386 | 4387 | 4388 | 4389 | 4390 | 4391 | 4392 | 4393 | 4394 | 4395 | 4396 | 4397 | 4398 | 4399 | 4400 | 4401 | 4402 | 4403 | 4404 | 4405 | 4406 | 4407 | 4408 | 4409 | 4410 | 4411 | 4412 | 4413 | 4414 | 4415 | 4416 | 4417 | 4418 | 4419 | 4420 | 4421 | 4422 | 4423 | 4424 | 4425 | 4426 | 4427 | 4428 | 4429 | 4430 | 4431 | 4432 | 4433 | 4434 | 4435 | 4436 | 4437 | 4438 | 4439 | 4440 | 4441 | 4442 | 4443 | 4444 | 4445 | 4446 | 4447 | 4448 | 4449 | 4450 | 4451 | 4452 | 4453 | 4454 | 4455 | 4456 | 4457 | 4458 | 4459 | 4460 | 4461 | 4462 | 4463 | 4464 | 4465 | 4466 | 4467 | 4468 | 4469 | 4470 | 4471 | 4472 | 4473 | 4474 | 4475 | 4476 | 4477 | 4478 | 4479 | 4480 | 4481 | 4482 | 4483 | 4484 | 4485 | 4486 | 4487 | 4488 | 4489 | 4490 | 4491 | 4492 | 4493 | 4494 | 4495 | 4496 | 4497 | 4498 | 4499 | 4500 | 4501 | 4502 | 4503 | 4504 | 4505 | 4506;
