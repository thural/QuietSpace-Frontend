# Authentication Module Migration Guide

## Overview

This guide helps you migrate from the legacy authentication system to the enhanced authentication module. The migration is designed to be backward compatible and can be done incrementally.

## Migration Path

### Phase 1: Preparation (Recommended)
- Review current authentication implementation
- Identify dependencies on legacy interfaces
- Plan migration strategy
- Set up testing environment

### Phase 2: Interface Migration
- Replace `IAuthProvider` with `IAuthenticator`
- Update provider registration with `IProviderManager`
- Implement enhanced validation with `IAuthValidator`

### Phase 3: Feature Enhancement
- Add health monitoring and performance metrics
- Implement provider failover and priority management
- Enable advanced validation features

### Phase 4: Cleanup
- Remove deprecated interfaces usage
- Update documentation
- Optimize performance

---

## Legacy vs Enhanced Interfaces

### IAuthProvider → IAuthenticator

#### Before (Legacy)
```typescript
interface IAuthProvider {
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    validateSession(): Promise<AuthResult<AuthSession>>;
    refreshToken(): Promise<AuthResult<AuthSession>>;
    configure(config: Record<string, any>): Promise<void>;
    getCapabilities(): string[];
}

// Usage
const provider: IAuthProvider = new OAuthProvider();
const result = await provider.authenticate(credentials);
```

#### After (Enhanced)
```typescript
interface IAuthenticator {
    // All legacy methods preserved
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    validateSession(): Promise<AuthResult<AuthSession>>;
    refreshToken(): Promise<AuthResult<AuthSession>>;
    configure(config: Record<string, any>): Promise<void>;
    getCapabilities(): string[];
    
    // New enhanced methods
    initialize?(): Promise<void>;
    healthCheck(): Promise<HealthCheckResult>;
    getPerformanceMetrics(): PerformanceMetrics;
    resetPerformanceMetrics(): void;
    isHealthy(): boolean;
    isInitialized(): boolean;
    getUptime(): number;
    shutdown?(timeout?: number): Promise<void>;
    
    // Properties
    readonly name: string;
    readonly type: AuthProviderType;
    readonly config: Record<string, any>;
}

// Usage
const authenticator: IAuthenticator = new OAuthAuthenticator();
await authenticator.initialize?.(); // Optional initialization
const result = await authenticator.authenticate(credentials);

// New capabilities
const health = await authenticator.healthCheck();
const metrics = authenticator.getPerformanceMetrics();
```

### Direct Provider Usage → Provider Manager

#### Before (Legacy)
```typescript
// Direct provider instantiation and management
const oauthProvider = new OAuthProvider();
const samlProvider = new SAMLProvider();
const ldapProvider = new LDAPProvider();

// Manual provider selection
let provider: IAuthProvider;
if (userType === 'employee') {
    provider = samlProvider;
} else if (userType === 'customer') {
    provider = oauthProvider;
} else {
    provider = ldapProvider;
}

const result = await provider.authenticate(credentials);
```

#### After (Enhanced)
```typescript
// Provider manager with automatic failover
const providerManager = new ProviderManager(logger);

// Register providers with priority and health monitoring
providerManager.registerProvider(new OAuthAuthenticator(), {
    priority: ProviderPriority.HIGH,
    autoEnable: true,
    healthCheckInterval: 30000,
    failoverEnabled: true,
    maxRetries: 3
});

providerManager.registerProvider(new SAMLAuthenticator(), {
    priority: ProviderPriority.NORMAL,
    autoEnable: true,
    healthCheckInterval: 60000,
    failoverEnabled: true
});

providerManager.registerProvider(new LDAPAuthenticator(), {
    priority: ProviderPriority.BACKUP,
    autoEnable: true,
    healthCheckInterval: 120000,
    failoverEnabled: true
});

// Automatic provider selection with failover
const provider = providerManager.getBestProvider();
const result = await provider.authenticate(credentials);

// Health monitoring and statistics
const stats = providerManager.getManagerStatistics();
const health = await providerManager.performHealthChecks();
```

### Basic Validation → Enhanced Validation

#### Before (Legacy)
```typescript
// Simple validation functions
function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password: string): boolean {
    return password.length >= 8;
}

// Usage
if (!validateEmail(email)) {
    throw new Error('Invalid email');
}
if (!validatePassword(password)) {
    throw new Error('Password too short');
}
```

#### After (Enhanced)
```typescript
// Comprehensive validation system
const validator = createAuthValidator();

// Add validation rules
validator.addRule('email-format', {
    name: 'email-format',
    description: 'Validates email format',
    validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    errorMessage: 'Invalid email format',
    priority: 1,
    enabled: true
});

validator.addRule('password-strength', {
    name: 'password-strength',
    description: 'Validates password strength',
    validator: (password: string) => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password);
    },
    errorMessage: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    priority: 2,
    enabled: true
});

// Create rule groups
validator.createRuleGroup('user-registration', [
    'email-format',
    'password-strength',
    'username-unique'
]);

// Enhanced validation with context
const context = {
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date(),
    metadata: { source: 'web' }
};

const result = await validator.validateCredentialsAsync(credentials, context);

if (!result.isValid) {
    console.error('Validation errors:', result.errors);
    console.log('Suggestions:', result.suggestions);
    
    // Detailed error information
    result.errors?.forEach(error => {
        console.log(`Rule: ${error.rule}, Severity: ${error.severity}`);
    });
}
```

---

## Step-by-Step Migration

### Step 1: Update Dependencies

```typescript
// Old imports
import { IAuthProvider, EnterpriseAuthService } from './legacy-auth';

// New imports
import { IAuthenticator, IProviderManager, IAuthValidator } from './authentication';
import { ProviderManager } from './authentication/enterprise/ProviderManager';
```

### Step 2: Replace Provider Interface

```typescript
// Before
class MyOAuthProvider implements IAuthProvider {
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        // Implementation
    }
    
    async validateSession(): Promise<AuthResult<AuthSession>> {
        // Implementation
    }
    
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        // Implementation
    }
    
    async configure(config: Record<string, any>): Promise<void> {
        // Implementation
    }
    
    getCapabilities(): string[] {
        return ['oauth_auth', 'token_refresh'];
    }
}

// After
class MyOAuthProvider implements IAuthenticator {
    readonly name = 'oauth-provider';
    readonly type = 'oauth' as AuthProviderType;
    readonly config: Record<string, any> = {};
    
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        // Implementation (unchanged)
    }
    
    async validateSession(): Promise<AuthResult<AuthSession>> {
        // Implementation (unchanged)
    }
    
    async refreshToken(): Promise<AuthResult<AuthSession>> {
        // Implementation (unchanged)
    }
    
    async configure(config: Record<string, any>): Promise<void> {
        this.config = { ...this.config, ...config };
        // Implementation (unchanged)
    }
    
    getCapabilities(): string[] {
        return ['oauth_auth', 'oauth_mfa', 'token_refresh', 'health_check'];
    }
    
    // New enhanced methods
    async initialize(): Promise<void> {
        // Initialize provider resources
    }
    
    async healthCheck(): Promise<HealthCheckResult> {
        // Check provider health
        return {
            healthy: true,
            timestamp: new Date(),
            responseTime: 50,
            message: 'Provider is healthy'
        };
    }
    
    getPerformanceMetrics(): PerformanceMetrics {
        // Return performance metrics
        return {
            totalAttempts: 1000,
            successfulAuthentications: 950,
            failedAuthentications: 50,
            averageResponseTime: 75.5,
            lastAuthentication: new Date(),
            errorsByType: {},
            statistics: {
                successRate: 0.95,
                failureRate: 0.05,
                throughput: 60
            }
        };
    }
    
    resetPerformanceMetrics(): void {
        // Reset metrics
    }
    
    isHealthy(): boolean {
        return true;
    }
    
    isInitialized(): boolean {
        return true;
    }
    
    getUptime(): number {
        return Date.now() - this.startTime;
    }
    
    async shutdown(timeout?: number): Promise<void> {
        // Graceful shutdown
    }
    
    private startTime = Date.now();
}
```

### Step 3: Implement Provider Manager

```typescript
// Before
class AuthService {
    private oauthProvider = new OAuthProvider();
    private samlProvider = new SAMLProvider();
    
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        // Manual provider selection
        let provider: IAuthProvider;
        
        if (credentials.type === 'oauth') {
            provider = this.oauthProvider;
        } else if (credentials.type === 'saml') {
            provider = this.samlProvider;
        } else {
            throw new Error('Unsupported authentication type');
        }
        
        return await provider.authenticate(credentials);
    }
}

// After
class AuthService {
    private providerManager: IProviderManager;
    private validator: IAuthValidator;
    
    constructor(logger: IAuthLogger) {
        this.providerManager = new ProviderManager(logger);
        this.validator = createAuthValidator();
        this.initializeProviders();
    }
    
    private initializeProviders(): void {
        // Register OAuth provider
        this.providerManager.registerProvider(new OAuthAuthenticator(), {
            priority: ProviderPriority.HIGH,
            autoEnable: true,
            healthCheckInterval: 30000,
            failoverEnabled: true,
            maxRetries: 3
        });
        
        // Register SAML provider
        this.providerManager.registerProvider(new SAMLAuthenticator(), {
            priority: ProviderPriority.NORMAL,
            autoEnable: true,
            healthCheckInterval: 60000,
            failoverEnabled: true,
            maxRetries: 2
        });
        
        // Start health monitoring
        this.providerManager.startHealthMonitoring(60000);
    }
    
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        // Validate credentials first
        const validationResult = await this.validator.validateCredentialsAsync(credentials);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: {
                    type: 'validation_error',
                    message: 'Invalid credentials'
                }
            };
        }
        
        // Get best available provider
        const provider = this.providerManager.getBestProvider();
        if (!provider) {
            return {
                success: false,
                error: {
                    type: 'no_provider_available',
                    message: 'No authentication providers available'
                }
            };
        }
        
        // Authenticate with automatic failover
        return await this.authenticateWithFailover(provider, credentials);
    }
    
    private async authenticateWithFailover(
        provider: IAuthenticator, 
        credentials: AuthCredentials,
        attempt = 0
    ): Promise<AuthResult<AuthSession>> {
        try {
            const result = await provider.authenticate(credentials);
            
            if (result.success) {
                return result;
            }
            
            // Try next provider if available
            const nextProvider = this.providerManager.getBestProvider();
            if (nextProvider && nextProvider !== provider && attempt < 3) {
                return await this.authenticateWithFailover(nextProvider, credentials, attempt + 1);
            }
            
            return result;
        } catch (error) {
            // Mark provider as unhealthy
            this.providerManager.setProviderEnabled(provider.name, false);
            
            // Try next provider
            const nextProvider = this.providerManager.getBestProvider();
            if (nextProvider && attempt < 3) {
                return await this.authenticateWithFailover(nextProvider, credentials, attempt + 1);
            }
            
            throw error;
        }
    }
    
    async getHealthStatus(): Promise<any> {
        return this.providerManager.getManagerStatistics();
    }
    
    async shutdown(): Promise<void> {
        this.providerManager.stopHealthMonitoring();
        await this.providerManager.shutdownAllProviders(30000);
    }
}
```

### Step 4: Enhanced Validation Implementation

```typescript
// Before
class ValidationService {
    validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    validatePassword(password: string): boolean {
        return password.length >= 8;
    }
    
    validateUser(user: any): boolean {
        return user.email && user.username;
    }
}

// After
class ValidationService {
    private validator: IAuthValidator;
    
    constructor() {
        this.validator = createAuthValidator();
        this.setupValidationRules();
    }
    
    private setupValidationRules(): void {
        // Email validation
        this.validator.addRule('email-format', {
            name: 'email-format',
            description: 'Validates email format',
            validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            errorMessage: 'Invalid email format',
            priority: 1,
            enabled: true
        });
        
        // Password strength validation
        this.validator.addRule('password-strength', {
            name: 'password-strength',
            description: 'Validates password strength',
            validator: (password: string) => {
                return password.length >= 8 && 
                       /[A-Z]/.test(password) && 
                       /[a-z]/.test(password) && 
                       /\d/.test(password) &&
                       /[!@#$%^&*]/.test(password);
            },
            errorMessage: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters',
            priority: 2,
            enabled: true
        });
        
        // Username validation
        this.validator.addRule('username-format', {
            name: 'username-format',
            description: 'Validates username format',
            validator: (username: string) => /^[a-zA-Z0-9_]{3,20}$/.test(username),
            errorMessage: 'Username must be 3-20 characters, letters, numbers, and underscores only',
            priority: 3,
            enabled: true
        });
        
        // Create rule groups
        this.validator.createRuleGroup('user-registration', [
            'email-format',
            'password-strength',
            'username-format'
        ]);
        
        this.validator.createRuleGroup('user-login', [
            'email-format',
            'password-strength'
        ]);
    }
    
    async validateRegistration(data: RegistrationData): Promise<ValidationResult> {
        const context = {
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            timestamp: new Date(),
            metadata: { source: 'web' }
        };
        
        return await this.validator.validateWithRuleGroup(data, 'user-registration', context);
    }
    
    async validateLogin(credentials: AuthCredentials): Promise<ValidationResult> {
        const context = {
            ipAddress: credentials.ipAddress,
            userAgent: credentials.userAgent,
            timestamp: new Date(),
            metadata: { source: 'login' }
        };
        
        return await this.validator.validateCredentialsAsync(credentials, context);
    }
    
    getValidationStatistics(): ValidatorStatistics {
        return this.validator.getStatistics();
    }
}
```

---

## Testing Migration

### Unit Test Migration

```typescript
// Before
describe('Legacy Auth Provider', () => {
    it('should authenticate user', async () => {
        const provider = new OAuthProvider();
        const result = await provider.authenticate(credentials);
        expect(result.success).toBe(true);
    });
});

// After
describe('Enhanced Auth Provider', () => {
    it('should authenticate user', async () => {
        const provider = new OAuthAuthenticator();
        await provider.initialize?.();
        
        const result = await provider.authenticate(credentials);
        expect(result.success).toBe(true);
        
        // Test enhanced features
        const health = await provider.healthCheck();
        expect(health.healthy).toBe(true);
        
        const metrics = provider.getPerformanceMetrics();
        expect(metrics.totalAttempts).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle health monitoring', async () => {
        const provider = new OAuthAuthenticator();
        await provider.initialize?.();
        
        const health = await provider.healthCheck();
        expect(health).toHaveProperty('healthy');
        expect(health).toHaveProperty('responseTime');
        expect(health).toHaveProperty('timestamp');
    });
});
```

### Integration Test Migration

```typescript
// Before
describe('Auth Service Integration', () => {
    it('should authenticate with OAuth', async () => {
        const authService = new AuthService();
        const result = await authService.authenticate(oauthCredentials);
        expect(result.success).toBe(true);
    });
});

// After
describe('Enhanced Auth Service Integration', () => {
    let authService: AuthService;
    
    beforeEach(async () => {
        authService = new AuthService(mockLogger);
        await authService.initialize();
    });
    
    afterEach(async () => {
        await authService.shutdown();
    });
    
    it('should authenticate with automatic failover', async () => {
        const result = await authService.authenticate(credentials);
        expect(result.success).toBe(true);
    });
    
    it('should monitor provider health', async () => {
        const health = await authService.getHealthStatus();
        expect(health.totalProviders).toBeGreaterThan(0);
        expect(health.healthyProviders).toBeGreaterThanOrEqual(0);
    });
    
    it('should validate credentials before authentication', async () => {
        const invalidCredentials = { username: '', password: '' };
        const result = await authService.authenticate(invalidCredentials);
        expect(result.success).toBe(false);
        expect(result.error?.type).toBe('validation_error');
    });
});
```

---

## Common Migration Issues and Solutions

### Issue 1: Missing Initialize Method
**Problem**: Provider doesn't implement optional `initialize()` method
**Solution**: Add optional initialization or make it truly optional

```typescript
// Fix
class MyProvider implements IAuthenticator {
    async initialize(): Promise<void> {
        // Optional initialization
        if (this.needsInitialization) {
            await this.setupResources();
        }
    }
    
    private needsInitialization = true;
    private async setupResources(): Promise<void> {
        // Setup code
    }
}
```

### Issue 2: Health Check Implementation
**Problem**: Health check always returns healthy
**Solution**: Implement proper health checking

```typescript
// Fix
async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
        // Check actual health
        await this.checkConnectivity();
        const responseTime = Date.now() - startTime;
        
        return {
            healthy: true,
            timestamp: new Date(),
            responseTime,
            message: 'Provider is healthy'
        };
    } catch (error) {
        return {
            healthy: false,
            timestamp: new Date(),
            responseTime: Date.now() - startTime,
            message: error.message
        };
    }
}
```

### Issue 3: Performance Metrics Not Updated
**Problem**: Performance metrics return default values
**Solution**: Track actual metrics

```typescript
// Fix
class MyProvider implements IAuthenticator {
    private metrics: PerformanceMetrics = {
        totalAttempts: 0,
        successfulAuthentications: 0,
        failedAuthentications: 0,
        averageResponseTime: 0,
        lastAuthentication: new Date(),
        errorsByType: {},
        statistics: {
            successRate: 0,
            failureRate: 0,
            throughput: 0
        }
    };
    
    async authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>> {
        const startTime = Date.now();
        this.metrics.totalAttempts++;
        
        try {
            const result = await this.doAuthenticate(credentials);
            const responseTime = Date.now() - startTime;
            
            if (result.success) {
                this.metrics.successfulAuthentications++;
            } else {
                this.metrics.failedAuthentications++;
                this.metrics.errorsByType[result.error.type] = 
                    (this.metrics.errorsByType[result.error.type] || 0) + 1;
            }
            
            this.updateAverageResponseTime(responseTime);
            this.metrics.lastAuthentication = new Date();
            
            return result;
        } catch (error) {
            this.metrics.failedAuthentications++;
            throw error;
        }
    }
    
    private updateAverageResponseTime(responseTime: number): void {
        const total = this.metrics.totalAttempts;
        this.metrics.averageResponseTime = 
            (this.metrics.averageResponseTime * (total - 1) + responseTime) / total;
    }
    
    getPerformanceMetrics(): PerformanceMetrics {
        this.updateStatistics();
        return { ...this.metrics };
    }
    
    private updateStatistics(): void {
        const total = this.metrics.totalAttempts;
        if (total > 0) {
            this.metrics.statistics.successRate = this.metrics.successfulAuthentications / total;
            this.metrics.statistics.failureRate = this.metrics.failedAuthentications / total;
            this.metrics.statistics.throughput = this.metrics.successfulAuthentications / 
                (Date.now() - this.startTime) * 1000;
        }
    }
    
    private startTime = Date.now();
}
```

---

## Migration Checklist

### Pre-Migration
- [ ] Review current authentication implementation
- [ ] Identify all IAuthProvider usage
- [ ] List custom authentication providers
- [ ] Document current validation logic
- [ ] Set up testing environment
- [ ] Create backup of current implementation

### Migration
- [ ] Update import statements
- [ ] Replace IAuthProvider with IAuthenticator
- [ ] Implement enhanced interface methods
- [ ] Set up ProviderManager
- [ ] Register providers with appropriate options
- [ ] Implement enhanced validation
- [ ] Add health monitoring
- [ ] Update error handling
- [ ] Migrate unit tests
- [ ] Migrate integration tests

### Post-Migration
- [ ] Run all tests
- [ ] Verify authentication flows
- [ ] Test failover scenarios
- [ ] Monitor performance metrics
- [ ] Validate health checking
- [ ] Update documentation
- [ ] Train team on new interfaces
- [ ] Monitor production usage

---

## Rollback Plan

If issues arise during migration:

### Immediate Rollback
1. Revert to legacy interface implementations
2. Restore previous authentication service
3. Disable enhanced features
4. Monitor system stability

### Partial Rollback
1. Keep enhanced interfaces but disable new features
2. Use compatibility mode
3. Gradually re-enable features
4. Monitor for issues

### Monitoring During Migration
1. Set up enhanced logging
2. Monitor authentication success rates
3. Track performance metrics
4. Watch for error spikes
5. Have rollback triggers ready

---

## Support and Resources

### Documentation
- [IAuthenticator API Documentation](./IAuthenticator.md)
- [IProviderManager API Documentation](./IProviderManager.md)
- [IAuthValidator API Documentation](./IAuthValidator.md)

### Code Examples
- See `/examples/authentication/` for complete implementation examples
- Check `/test/migration/` for migration test cases

### Support
- Contact the authentication team for migration assistance
- Review existing migration examples in the codebase
- Use the compatibility adapter during transition period

This migration guide ensures a smooth transition to the enhanced authentication module while maintaining backward compatibility and providing enterprise-grade features.
