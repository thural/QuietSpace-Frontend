# IProviderManager API Documentation

## Overview

The `IProviderManager` interface manages the lifecycle of authentication providers, user managers, and token managers. It provides comprehensive provider management including health monitoring, priority management, and failover capabilities.

## Interface Definition

```typescript
interface IProviderManager {
    // Provider Registration
    registerProvider(provider: IAuthenticator, options?: ProviderRegistrationOptions): void;
    registerUserManager(userManager: IUserManager, options?: ProviderRegistrationOptions): void;
    registerTokenManager(tokenManager: ITokenManager, options?: ProviderRegistrationOptions): void;

    // Provider Retrieval
    getProvider(name: string, enabledOnly?: boolean): IAuthenticator | undefined;
    getUserManager(name: string, enabledOnly?: boolean): IUserManager | undefined;
    getTokenManager(name: string, enabledOnly?: boolean): ITokenManager | undefined;

    // Provider Listing
    listProviders(enabledOnly?: boolean, sortByPriority?: boolean): string[];
    listUserManagers(enabledOnly?: boolean): string[];
    listTokenManagers(enabledOnly?: boolean): string[];

    // Provider Management
    hasProvider(name: string): boolean;
    hasUserManager(name: string): boolean;
    hasTokenManager(name: string): boolean;
    removeProvider(name: string): boolean;
    removeUserManager(name: string): boolean;
    removeTokenManager(name: string): boolean;
    clear(): void;

    // Provider Counting
    getProviderCount(enabledOnly?: boolean): number;
    getUserManagerCount(enabledOnly?: boolean): number;
    getTokenManagerCount(enabledOnly?: boolean): number;

    // Health Monitoring
    getProviderHealth(name: string): ProviderHealthStatus | undefined;
    getAllProvidersHealth(enabledOnly?: boolean): ProviderHealthStatus[];
    performHealthChecks(): Promise<void>;

    // Provider Control
    setProviderEnabled(name: string, enabled: boolean): boolean;
    isProviderEnabled(name: string): boolean;
    setProviderPriority(name: string, priority: ProviderPriority): boolean;
    getProviderPriority(name: string): ProviderPriority | undefined;
    getProvidersByPriority(priority: ProviderPriority, enabledOnly?: boolean): IAuthenticator[];
    getBestProvider(type?: string): IAuthenticator | undefined;

    // Statistics and Monitoring
    getManagerStatistics(): ManagerStatistics;
    startHealthMonitoring(interval?: number): void;
    stopHealthMonitoring(): void;

    // Lifecycle Management
    initializeAllProviders(timeout?: number): Promise<void>;
    shutdownAllProviders(timeout?: number): Promise<void>;
}
```

## Provider Registration

### `registerProvider(provider, options?)`

Registers an authentication provider with optional configuration options.

**Parameters:**
- `provider: IAuthenticator` - The authenticator instance to register
- `options?: ProviderRegistrationOptions` - Registration options including priority and health settings

**Example:**
```typescript
const oauthProvider = new OAuthAuthenticator();
const options = {
    priority: ProviderPriority.HIGH,
    autoEnable: true,
    healthCheckInterval: 30000,
    failoverEnabled: true,
    maxRetries: 3
};

providerManager.registerProvider(oauthProvider, options);
```

### `registerUserManager(userManager, options?)`

Registers a user manager with optional configuration options.

**Parameters:**
- `userManager: IUserManager` - The user manager instance to register
- `options?: ProviderRegistrationOptions` - Registration options

**Example:**
```typescript
const userManager = new DatabaseUserManager();
providerManager.registerUserManager(userManager, {
    priority: ProviderPriority.NORMAL,
    autoEnable: true
});
```

### `registerTokenManager(tokenManager, options?)`

Registers a token manager with optional configuration options.

**Parameters:**
- `tokenManager: ITokenManager` - The token manager instance to register
- `options?: ProviderRegistrationOptions` - Registration options

**Example:**
```typescript
const tokenManager = new JWTTokenManager();
providerManager.registerTokenManager(tokenManager, {
    priority: ProviderPriority.HIGH,
    autoEnable: true
});
```

## Provider Retrieval

### `getProvider(name, enabledOnly?)`

Retrieves an authentication provider by name.

**Parameters:**
- `name: string` - The provider name
- `enabledOnly?: boolean` - Whether to return only enabled providers (default: false)

**Returns:**
- `IAuthenticator | undefined` - The provider instance or undefined if not found

**Example:**
```typescript
const provider = providerManager.getProvider('oauth-provider');
if (provider) {
    const result = await provider.authenticate(credentials);
}

// Get only enabled providers
const enabledProvider = providerManager.getProvider('oauth-provider', true);
```

### `getUserManager(name, enabledOnly?)`

Retrieves a user manager by name.

**Parameters:**
- `name: string` - The user manager name
- `enabledOnly?: boolean` - Whether to return only enabled managers

**Returns:**
- `IUserManager | undefined` - The user manager instance or undefined

**Example:**
```typescript
const userManager = providerManager.getUserManager('db-user-manager');
if (userManager) {
    const user = await userManager.getUser(userId);
}
```

### `getTokenManager(name, enabledOnly?)`

Retrieves a token manager by name.

**Parameters:**
- `name: string` - The token manager name
- `enabledOnly?: boolean` - Whether to return only enabled managers

**Returns:**
- `ITokenManager | undefined` - The token manager instance or undefined

**Example:**
```typescript
const tokenManager = providerManager.getTokenManager('jwt-token-manager');
if (tokenManager) {
    const token = await tokenManager.generateToken(user);
}
```

## Provider Listing

### `listProviders(enabledOnly?, sortByPriority?)`

Lists all registered provider names.

**Parameters:**
- `enabledOnly?: boolean` - Whether to list only enabled providers (default: false)
- `sortByPriority?: boolean` - Whether to sort by priority (default: true)

**Returns:**
- `string[]` - Array of provider names

**Example:**
```typescript
// List all providers
const allProviders = providerManager.listProviders();

// List only enabled providers
const enabledProviders = providerManager.listProviders(true);

// List all providers without priority sorting
const unsortedProviders = providerManager.listProviders(false, false);
```

### `listUserManagers(enabledOnly?)`

Lists all registered user manager names.

**Parameters:**
- `enabledOnly?: boolean` - Whether to list only enabled managers

**Returns:**
- `string[]` - Array of user manager names

**Example:**
```typescript
const userManagers = providerManager.listUserManagers(true);
console.log('Enabled user managers:', userManagers);
```

### `listTokenManagers(enabledOnly?)`

Lists all registered token manager names.

**Parameters:**
- `enabledOnly?: boolean` - Whether to list only enabled managers

**Returns:**
- `string[]` - Array of token manager names

**Example:**
```typescript
const tokenManagers = providerManager.listTokenManagers();
console.log('All token managers:', tokenManagers);
```

## Provider Management

### `hasProvider(name)`

Checks if a provider is registered.

**Parameters:**
- `name: string` - The provider name to check

**Returns:**
- `boolean` - True if provider is registered

**Example:**
```typescript
if (providerManager.hasProvider('oauth-provider')) {
    console.log('OAuth provider is available');
}
```

### `removeProvider(name)`

Removes a provider from the manager.

**Parameters:**
- `name: string` - The provider name to remove

**Returns:**
- `boolean` - True if provider was removed successfully

**Example:**
```typescript
const removed = providerManager.removeProvider('oauth-provider');
if (removed) {
    console.log('OAuth provider removed successfully');
}
```

### `clear()`

Removes all registered providers, user managers, and token managers.

**Example:**
```typescript
providerManager.clear();
console.log('All providers cleared');
```

## Provider Counting

### `getProviderCount(enabledOnly?)`

Gets the count of registered providers.

**Parameters:**
- `enabledOnly?: boolean` - Whether to count only enabled providers

**Returns:**
- `number` - Number of registered providers

**Example:**
```typescript
const totalProviders = providerManager.getProviderCount();
const enabledProviders = providerManager.getProviderCount(true);

console.log(`Total: ${totalProviders}, Enabled: ${enabledProviders}`);
```

## Health Monitoring

### `getProviderHealth(name)`

Gets the health status of a specific provider.

**Parameters:**
- `name: string` - The provider name

**Returns:**
- `ProviderHealthStatus | undefined` - Health status or undefined

**Example:**
```typescript
const health = providerManager.getProviderHealth('oauth-provider');
if (health) {
    console.log('Provider is healthy:', health.health.healthy);
    console.log('Response time:', health.health.responseTime);
}
```

### `getAllProvidersHealth(enabledOnly?)`

Gets health status for all providers.

**Parameters:**
- `enabledOnly?: boolean` - Whether to include only enabled providers

**Returns:**
- `ProviderHealthStatus[]` - Array of provider health statuses

**Example:**
```typescript
const allHealth = providerManager.getAllProvidersHealth(true);
allHealth.forEach(status => {
    console.log(`${status.providerName}: ${status.health.healthy ? 'Healthy' : 'Unhealthy'}`);
});
```

### `performHealthChecks()`

Performs health checks on all enabled providers.

**Returns:**
- `Promise<void>` - Completion of all health checks

**Example:**
```typescript
await providerManager.performHealthChecks();
console.log('Health checks completed');
```

## Provider Control

### `setProviderEnabled(name, enabled)`

Enables or disables a provider.

**Parameters:**
- `name: string` - The provider name
- `enabled: boolean` - Whether to enable the provider

**Returns:**
- `boolean` - True if operation was successful

**Example:**
```typescript
const success = providerManager.setProviderEnabled('oauth-provider', false);
if (success) {
    console.log('OAuth provider disabled');
}
```

### `isProviderEnabled(name)`

Checks if a provider is enabled.

**Parameters:**
- `name: string` - The provider name

**Returns:**
- `boolean` - True if provider is enabled

**Example:**
```typescript
if (providerManager.isProviderEnabled('oauth-provider')) {
    console.log('OAuth provider is enabled');
}
```

### `setProviderPriority(name, priority)`

Sets the priority of a provider.

**Parameters:**
- `name: string` - The provider name
- `priority: ProviderPriority` - The priority level

**Returns:**
- `boolean` - True if operation was successful

**Example:**
```typescript
const success = providerManager.setProviderPriority('oauth-provider', ProviderPriority.CRITICAL);
if (success) {
    console.log('OAuth provider priority set to CRITICAL');
}
```

### `getBestProvider(type?)`

Gets the best available provider based on health and priority.

**Parameters:**
- `type?: string` - Optional provider type filter

**Returns:**
- `IAuthenticator | undefined` - Best available provider

**Example:**
```typescript
// Get best provider regardless of type
const bestProvider = providerManager.getBestProvider();

// Get best OAuth provider
const bestOAuthProvider = providerManager.getBestProvider('oauth');

if (bestProvider) {
    console.log('Using provider:', bestProvider.name);
}
```

## Statistics and Monitoring

### `getManagerStatistics()`

Gets comprehensive manager statistics.

**Returns:**
- `ManagerStatistics` - Detailed statistics and health information

**Example:**
```typescript
const stats = providerManager.getManagerStatistics();
console.log('Total providers:', stats.totalProviders);
console.log('Healthy providers:', stats.healthyProviders);
console.log('Health score:', stats.healthScore);
console.log('Last health check:', stats.lastHealthCheck);
```

### `startHealthMonitoring(interval?)`

Starts automatic health monitoring for all providers.

**Parameters:**
- `interval?: number` - Health check interval in milliseconds (default: 30000)

**Example:**
```typescript
// Start health monitoring every 30 seconds
providerManager.startHealthMonitoring(30000);

// Start with default interval
providerManager.startHealthMonitoring();
```

### `stopHealthMonitoring()`

Stops automatic health monitoring.

**Example:**
```typescript
providerManager.stopHealthMonitoring();
console.log('Health monitoring stopped');
```

## Lifecycle Management

### `initializeAllProviders(timeout?)`

Initializes all registered providers.

**Parameters:**
- `timeout?: number` - Optional timeout for initialization (default: 30000)

**Returns:**
- `Promise<void>` - Completion of all provider initialization

**Example:**
```typescript
try {
    await providerManager.initializeAllProviders(10000);
    console.log('All providers initialized successfully');
} catch (error) {
    console.error('Provider initialization failed:', error);
}
```

### `shutdownAllProviders(timeout?)`

Gracefully shuts down all providers.

**Parameters:**
- `timeout?: number` - Optional timeout for shutdown (default: 30000)

**Returns:**
- `Promise<void>` - Completion of all provider shutdown

**Example:**
```typescript
// Graceful shutdown with 30-second timeout
await providerManager.shutdownAllProviders(30000);
console.log('All providers shut down gracefully');
```

## Usage Patterns

### Basic Provider Management
```typescript
// 1. Register providers with options
providerManager.registerProvider(oauthProvider, {
    priority: ProviderPriority.HIGH,
    autoEnable: true,
    healthCheckInterval: 30000
});

providerManager.registerProvider(samlProvider, {
    priority: ProviderPriority.NORMAL,
    autoEnable: true
});

// 2. Start health monitoring
providerManager.startHealthMonitoring(60000);

// 3. Get best provider for authentication
const provider = providerManager.getBestProvider();
if (provider) {
    const result = await provider.authenticate(credentials);
}
```

### Health Monitoring and Failover
```typescript
// Monitor provider health
setInterval(() => {
    const stats = providerManager.getManagerStatistics();
    
    if (stats.healthScore < 80) {
        console.warn('Provider health score below 80%');
    }
    
    const unhealthyCount = stats.totalProviders - stats.healthyProviders;
    if (unhealthyCount > 0) {
        console.warn(`${unhealthyCount} providers are unhealthy`);
    }
}, 30000);

// Automatic failover
const authenticateWithFailover = async (credentials: AuthCredentials) => {
    let provider = providerManager.getBestProvider();
    
    while (provider) {
        try {
            const result = await provider.authenticate(credentials);
            if (result.success) {
                return result;
            }
        } catch (error) {
            console.error(`Provider ${provider.name} failed:`, error);
            // Mark provider as unhealthy
            providerManager.setProviderEnabled(provider.name, false);
        }
        
        // Try next best provider
        provider = providerManager.getBestProvider();
    }
    
    throw new Error('All authentication providers failed');
};
```

### Provider Lifecycle Management
```typescript
// Application startup
const initializeAuthSystem = async () => {
    // Register all providers
    registerAllProviders();
    
    // Initialize all providers
    await providerManager.initializeAllProviders(10000);
    
    // Start health monitoring
    providerManager.startHealthMonitoring(30000);
    
    console.log('Authentication system initialized');
};

// Application shutdown
const shutdownAuthSystem = async () => {
    // Stop health monitoring
    providerManager.stopHealthMonitoring();
    
    // Shutdown all providers
    await providerManager.shutdownAllProviders(30000);
    
    console.log('Authentication system shut down');
};
```

## Best Practices

1. **Always use priority levels** to establish clear provider hierarchy
2. **Enable health monitoring** for production deployments
3. **Implement proper failover** logic using `getBestProvider()`
4. **Monitor statistics** regularly for system health
5. **Use graceful shutdown** procedures for clean termination
6. **Set appropriate timeouts** for initialization and shutdown
7. **Handle provider failures** gracefully with fallback mechanisms

## Error Handling

```typescript
// Safe provider retrieval
const provider = providerManager.getProvider('oauth-provider');
if (!provider) {
    throw new Error('OAuth provider not found');
}

// Safe health check
try {
    await providerManager.performHealthChecks();
} catch (error) {
    console.error('Health check failed:', error);
    // Continue with degraded functionality
}

// Safe provider operations
const success = providerManager.setProviderEnabled('oauth-provider', false);
if (!success) {
    console.warn('Failed to disable OAuth provider');
}
```

## Migration from Legacy Systems

If you're migrating from a legacy authentication system:

```typescript
// Old way - direct provider usage
const authProvider = new OAuthProvider();
const result = await authProvider.authenticate(credentials);

// New way - managed provider usage
providerManager.registerProvider(new OAuthProvider(), {
    priority: ProviderPriority.HIGH,
    autoEnable: true
});

const provider = providerManager.getBestProvider();
const result = await provider.authenticate(credentials);

// Additional benefits: health monitoring, failover, statistics
const health = await provider.healthCheck();
const stats = providerManager.getManagerStatistics();
```

The new provider management system offers enterprise-grade features including health monitoring, automatic failover, priority management, and comprehensive statistics tracking.
