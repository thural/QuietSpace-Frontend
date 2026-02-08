# IAuthenticator API Documentation

## Overview

The `IAuthenticator` interface defines the contract for core authentication operations in the enhanced authentication module. It provides comprehensive authentication capabilities including health checking, performance monitoring, and lifecycle management.

## Interface Definition

```typescript
interface IAuthenticator {
    // Core Properties
    readonly name: string;
    readonly type: AuthProviderType;
    readonly config: Record<string, any>;

    // Core Authentication Methods
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    validateSession(): Promise<AuthResult<AuthSession>>;
    refreshToken(): Promise<AuthResult<AuthSession>>;
    configure(config: Record<string, any>): Promise<void>;
    getCapabilities(): string[];

    // Enhanced Methods
    initialize?(): Promise<void>;
    healthCheck(): Promise<HealthCheckResult>;
    getPerformanceMetrics(): PerformanceMetrics;
    resetPerformanceMetrics(): void;
    isHealthy(): boolean;
    isInitialized(): boolean;
    getUptime(): number;
    shutdown?(timeout?: number): Promise<void>;
}
```

## Core Methods

### `authenticate(credentials)`

Authenticates a user with the provided credentials.

**Parameters:**
- `credentials: AuthCredentials` - Authentication credentials (username/password, tokens, etc.)

**Returns:**
- `Promise<AuthResult<AuthSession>>` - Authentication result containing session data or error

**Example:**
```typescript
const credentials = { username: 'user@example.com', password: 'securePassword' };
const result = await authenticator.authenticate(credentials);

if (result.success) {
    console.log('Authentication successful:', result.data);
} else {
    console.error('Authentication failed:', result.error);
}
```

### `validateSession()`

Validates the current authentication session.

**Returns:**
- `Promise<AuthResult<AuthSession>>` - Session validation result

**Example:**
```typescript
const sessionResult = await authenticator.validateSession();
if (sessionResult.success) {
    console.log('Session is valid:', sessionResult.data);
} else {
    console.log('Session expired or invalid');
}
```

### `refreshToken()`

Refreshes the authentication token.

**Returns:**
- `Promise<AuthResult<AuthSession>>` - New session data with refreshed token

**Example:**
```typescript
const refreshResult = await authenticator.refreshToken();
if (refreshResult.success) {
    console.log('Token refreshed successfully');
} else {
    console.error('Token refresh failed:', refreshResult.error);
}
```

### `configure(config)`

Configures the authenticator with new settings.

**Parameters:**
- `config: Record<string, any>` - Configuration object

**Returns:**
- `Promise<void>` - Configuration completion

**Example:**
```typescript
await authenticator.configure({
    timeout: 30000,
    retryAttempts: 3,
    endpoint: 'https://auth.example.com'
});
```

### `getCapabilities()`

Returns the list of capabilities supported by this authenticator.

**Returns:**
- `string[]` - Array of capability strings

**Example:**
```typescript
const capabilities = authenticator.getCapabilities();
console.log('Supported capabilities:', capabilities);
// Output: ['oauth_auth', 'oauth_mfa', 'token_refresh', 'session_validation']
```

## Enhanced Methods

### `initialize()`

Initializes the authenticator (optional method).

**Returns:**
- `Promise<void>` - Initialization completion

**Example:**
```typescript
if (typeof authenticator.initialize === 'function') {
    await authenticator.initialize();
    console.log('Authenticator initialized successfully');
}
```

### `healthCheck()`

Performs a health check on the authenticator.

**Returns:**
- `Promise<HealthCheckResult>` - Health check result with status and metrics

**Example:**
```typescript
const health = await authenticator.healthCheck();
console.log('Health status:', health.healthy);
console.log('Response time:', health.responseTime);
console.log('Last check:', health.timestamp);
```

### `getPerformanceMetrics()`

Returns performance metrics for the authenticator.

**Returns:**
- `PerformanceMetrics` - Performance statistics

**Example:**
```typescript
const metrics = authenticator.getPerformanceMetrics();
console.log('Total attempts:', metrics.totalAttempts);
console.log('Success rate:', metrics.statistics.successRate);
console.log('Average response time:', metrics.averageResponseTime);
```

### `resetPerformanceMetrics()`

Resets all performance metrics to initial values.

**Example:**
```typescript
authenticator.resetPerformanceMetrics();
console.log('Performance metrics reset');
```

### `isHealthy()`

Returns the current health status of the authenticator.

**Returns:**
- `boolean` - True if healthy, false otherwise

**Example:**
```typescript
if (authenticator.isHealthy()) {
    console.log('Authenticator is healthy');
} else {
    console.log('Authenticator needs attention');
}
```

### `isInitialized()`

Returns the initialization status of the authenticator.

**Returns:**
- `boolean` - True if initialized, false otherwise

**Example:**
```typescript
if (authenticator.isInitialized()) {
    console.log('Authenticator is ready for use');
} else {
    console.log('Authenticator needs initialization');
}
```

### `getUptime()`

Returns the uptime of the authenticator in milliseconds.

**Returns:**
- `number` - Uptime in milliseconds

**Example:**
```typescript
const uptime = authenticator.getUptime();
console.log(`Authenticator uptime: ${uptime}ms`);
```

### `shutdown(timeout?)`

Gracefully shuts down the authenticator (optional method).

**Parameters:**
- `timeout?: number` - Optional timeout in milliseconds

**Returns:**
- `Promise<void>` - Shutdown completion

**Example:**
```typescript
if (typeof authenticator.shutdown === 'function') {
    await authenticator.shutdown(5000);
    console.log('Authenticator shut down gracefully');
}
```

## Properties

### `name` (readonly)
The unique name of the authenticator instance.

**Type:** `string`

**Example:**
```typescript
console.log('Authenticator name:', authenticator.name);
// Output: 'oauth-provider'
```

### `type` (readonly)
The type of authentication provider.

**Type:** `AuthProviderType`

**Example:**
```typescript
console.log('Authenticator type:', authenticator.type);
// Output: 'oauth'
```

### `config` (readonly)
The current configuration of the authenticator.

**Type:** `Record<string, any>`

**Example:**
```typescript
console.log('Current config:', authenticator.config);
// Output: { timeout: 30000, retryAttempts: 3, endpoint: '...' }
```

## Usage Patterns

### Basic Authentication Flow
```typescript
// 1. Initialize if needed
if (typeof authenticator.initialize === 'function') {
    await authenticator.initialize();
}

// 2. Check health
const health = await authenticator.healthCheck();
if (!health.healthy) {
    throw new Error('Authenticator is not healthy');
}

// 3. Authenticate
const result = await authenticator.authenticate(credentials);
if (result.success) {
    // 4. Store session
    const session = result.data;
    // Use session for authenticated operations
}
```

### Performance Monitoring
```typescript
// Get current metrics
const metrics = authenticator.getPerformanceMetrics();

// Monitor success rate
if (metrics.statistics.successRate < 0.95) {
    console.warn('Success rate below 95%');
}

// Check response time
if (metrics.averageResponseTime > 1000) {
    console.warn('Average response time above 1 second');
}
```

### Health Monitoring
```typescript
// Periodic health check
setInterval(async () => {
    const health = await authenticator.healthCheck();
    if (!health.healthy) {
        console.error('Authenticator health issue:', health.message);
        // Trigger alert or fallback mechanism
    }
}, 60000); // Check every minute
```

## Error Handling

All methods that return `AuthResult<T>` follow a consistent error handling pattern:

```typescript
const result = await authenticator.authenticate(credentials);

if (result.success) {
    // Success case
    const data = result.data;
    // Process successful result
} else {
    // Error case
    const error = result.error;
    console.error('Authentication failed:', error.type, error.message);
    
    // Handle specific error types
    switch (error.type) {
        case 'credentials_invalid':
            // Handle invalid credentials
            break;
        case 'network_error':
            // Handle network issues
            break;
        case 'server_error':
            // Handle server errors
            break;
        default:
            // Handle unknown errors
            break;
    }
}
```

## Best Practices

1. **Always check initialization status** before using the authenticator
2. **Monitor health status** regularly for production deployments
3. **Handle errors gracefully** with proper error type checking
4. **Use performance metrics** to monitor and optimize performance
5. **Implement proper shutdown** procedures for graceful termination
6. **Validate configuration** before applying it
7. **Use capabilities** to check feature availability before using specific methods

## Migration from IAuthProvider

If you're migrating from the legacy `IAuthProvider` interface:

```typescript
// Old way (IAuthProvider)
const authProvider: IAuthProvider = /* ... */;
const result = await authProvider.authenticate(credentials);

// New way (IAuthenticator)
const authenticator: IAuthenticator = /* ... */;
const result = await authenticator.authenticate(credentials);

// Additional new features available
const health = await authenticator.healthCheck();
const metrics = authenticator.getPerformanceMetrics();
const capabilities = authenticator.getCapabilities();
```

The new interface provides the same core functionality with additional enterprise-grade features for monitoring, health checking, and performance tracking.
