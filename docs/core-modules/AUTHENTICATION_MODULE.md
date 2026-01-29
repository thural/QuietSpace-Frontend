# Authentication Module Documentation

## Overview

The Authentication module provides an enterprise-grade authentication system with multiple providers, advanced security features, and perfect BlackBox architecture compliance. It supports OAuth 2.0, SAML, LDAP, Session-based, and JWT authentication with comprehensive security monitoring.

## Architecture

### Facade Pattern Implementation

The Authentication module follows the **Facade pattern** with:
- **Clean Public API**: Only interfaces, factory functions, and utilities exported
- **Hidden Implementation**: Internal providers and services completely encapsulated
- **Factory Pattern**: Clean service creation with dependency injection support
- **Type Safety**: Full TypeScript support throughout

### Module Structure

```
src/core/auth/
├── AuthModule.ts              # Main authentication module
├── factory/                   # Factory functions
├── providers/                 # Authentication providers
│   ├── OAuthProvider.ts       # OAuth 2.0 implementation
│   ├── SAMLProvider.ts        # SAML 2.0 implementation
│   ├── LDAPProvider.ts        # LDAP implementation
│   └── SessionProvider.ts     # Session-based implementation
├── enterprise/                # Enterprise authentication service
├── config/                    # Configuration management
├── security/                  # Security features
├── types/                     # Type definitions
├── utils/                     # Utility functions
└── index.ts                   # Clean public API exports
```

## Core Interfaces

### IAuthProvider

The main authentication provider interface:

```typescript
interface IAuthProvider {
    // Core authentication
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    refresh(token: string): Promise<AuthResult<string>>;
    logout(sessionId: string): Promise<AuthResult<void>>;
    
    // Validation
    validateToken(token: string): Promise<AuthResult<AuthUser>>;
    isSessionValid(sessionId: string): Promise<boolean>;
    
    // Provider information
    getProviderType(): AuthProviderType;
    getProviderConfig(): IAuthConfig;
    
    // Lifecycle
    initialize(): Promise<void>;
    dispose(): Promise<void>;
}
```

### IAuthService

Enterprise authentication service interface:

```typescript
interface IAuthService {
    // Authentication operations
    authenticate(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    authenticateWithProvider(provider: AuthProviderType, credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
    
    // Token management
    refreshToken(refreshToken: string): Promise<AuthResult<string>>;
    validateToken(token: string): Promise<AuthResult<AuthUser>>;
    revokeToken(token: string): Promise<AuthResult<void>>;
    
    // Session management
    createSession(user: AuthUser): Promise<AuthResult<AuthSession>>;
    validateSession(sessionId: string): Promise<AuthResult<AuthSession>>;
    invalidateSession(sessionId: string): Promise<AuthResult<void>>;
    
    // User management
    getCurrentUser(): Promise<AuthResult<AuthUser>>;
    updateUser(userId: string, updates: Partial<AuthUser>): Promise<AuthResult<AuthUser>>;
    
    // Security
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<AuthResult<void>>;
    enableMFA(userId: string): Promise<AuthResult<void>>;
    disableMFA(userId: string): Promise<AuthResult<void>>;
}
```

### Data Types

```typescript
interface AuthResult<T> {
    success: boolean;
    data?: T;
    error?: AuthError;
}

interface AuthCredentials {
    username?: string;
    email?: string;
    password?: string;
    token?: string;
    provider?: AuthProviderType;
    [key: string]: any;
}

interface AuthUser {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
    permissions: string[];
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthSession {
    id: string;
    userId: string;
    token: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    isActive: boolean;
    deviceInfo?: DeviceInfo;
}

interface AuthToken {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    scope?: string;
}

enum AuthProviderType {
    JWT = 'jwt',
    OAUTH = 'oauth',
    SAML = 'saml',
    LDAP = 'ldap',
    SESSION = 'session'
}

enum AuthErrorType {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    ACCESS_DENIED = 'ACCESS_DENIED',
    PROVIDER_ERROR = 'PROVIDER_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR'
}
```

## Factory Functions

### Basic Authentication Service Creation

```typescript
import { 
    createDefaultAuthService,
    createCustomAuthService,
    createAuthService 
} from '@/core/auth';

// Create with default configuration
const authService = createDefaultAuthService();

// Create with custom configuration
const customAuth = createCustomAuthService({
    defaultProvider: AuthProviderType.JWT,
    enableMFA: true,
    sessionTimeout: 1800000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 900000 // 15 minutes
});

// Create with full configuration
const authService = createAuthService({
    providers: [
        { type: AuthProviderType.JWT, config: jwtConfig },
        { type: AuthProviderType.OAUTH, config: oauthConfig }
    ],
    security: {
        enableMFA: true,
        encryptionEnabled: true,
        auditEnabled: true
    },
    session: {
        timeout: 1800000,
        renewalThreshold: 300000
    }
});
```

### Feature-Specific Authentication

```typescript
import { 
    createFeatureAuthService,
    createFeatureAuthServiceFromDI,
    createSingletonFeatureAuthService 
} from '@/core/auth';

// Create feature-specific auth service
const featureAuth = createFeatureAuthService('chat', {
    defaultProvider: AuthProviderType.JWT,
    requiredPermissions: ['chat.read', 'chat.write']
});

// Create using DI container
const container = new Container();
const diFeatureAuth = createFeatureAuthServiceFromDI(container, 'analytics', {
    requiredPermissions: ['analytics.read']
});

// Create singleton feature auth
const singletonAuth = createSingletonFeatureAuthService('admin', {
    requiredPermissions: ['admin.*'],
    enableMFA: true
});
```

### Environment-Based Configuration

```typescript
import { 
    AuthModuleFactory,
    EnvironmentAuthConfig,
    createEnvironmentAuthConfig 
} from '@/core/auth';

// Create auth service for specific environment
const prodAuth = AuthModuleFactory.createForEnvironment('production');
const devAuth = AuthModuleFactory.createForEnvironment('development');

// Create with environment configuration
const envConfig = createEnvironmentAuthConfig({
    AUTH_DEFAULT_PROVIDER: 'oauth',
    AUTH_MFA_REQUIRED: 'true',
    AUTH_SESSION_TIMEOUT: '1800000'
});

const envAuth = AuthModuleFactory.createFromEnvironment(envConfig);
```

## Usage Patterns

### Basic Authentication

```typescript
import { createDefaultAuthService } from '@/core/auth';

const authService = createDefaultAuthService();

// Login
async function login(email: string, password: string) {
    const result = await authService.authenticate({
        email,
        password,
        provider: AuthProviderType.JWT
    });
    
    if (result.success && result.data) {
        const session = result.data;
        localStorage.setItem('authToken', session.token);
        localStorage.setItem('refreshToken', session.refreshToken);
        return session;
    } else {
        throw new Error(result.error?.message || 'Login failed');
    }
}

// Get current user
async function getCurrentUser() {
    const result = await authService.getCurrentUser();
    return result.success ? result.data : null;
}

// Logout
async function logout() {
    const token = localStorage.getItem('authToken');
    if (token) {
        await authService.logout(token);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    }
}
```

### Provider-Specific Authentication

```typescript
// OAuth Authentication
async function loginWithOAuth(provider: 'google' | 'github' | 'microsoft') {
    const result = await authService.authenticateWithProvider(
        AuthProviderType.OAUTH,
        { provider }
    );
    
    if (result.success) {
        // Handle OAuth redirect or token
        return result.data;
    }
}

// LDAP Authentication
async function loginWithLDAP(username: string, password: string) {
    const result = await authService.authenticateWithProvider(
        AuthProviderType.LDAP,
        { username, password }
    );
    
    return result.success ? result.data : null;
}

// SAML Authentication
async function loginWithSAML(samlResponse: string) {
    const result = await authService.authenticateWithProvider(
        AuthProviderType.SAML,
        { samlResponse }
    );
    
    return result.success ? result.data : null;
}
```

### Token Management

```typescript
// Refresh token
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }
    
    const result = await authService.refreshToken(refreshToken);
    if (result.success && result.data) {
        localStorage.setItem('authToken', result.data);
        return result.data;
    } else {
        // Force login
        await logout();
        throw new Error('Token refresh failed');
    }
}

// Validate token
async function validateToken(token: string) {
    const result = await authService.validateToken(token);
    return result.success ? result.data : null;
}
```

### Session Management

```typescript
// Create session
async function createSession(user: AuthUser) {
    const result = await authService.createSession(user);
    return result.success ? result.data : null;
}

// Validate session
async function validateSession(sessionId: string) {
    const result = await authService.validateSession(sessionId);
    return result.success ? result.data : null;
}

// Invalidate session
async function invalidateSession(sessionId: string) {
    const result = await authService.invalidateSession(sessionId);
    return result.success;
}
```

## Advanced Features

### Multi-Factor Authentication (MFA)

```typescript
// Enable MFA for user
async function enableMFA(userId: string) {
    const result = await authService.enableMFA(userId);
    if (result.success) {
        console.log('MFA enabled for user:', userId);
    }
}

// Disable MFA for user
async function disableMFA(userId: string) {
    const result = await authService.disableMFA(userId);
    if (result.success) {
        console.log('MFA disabled for user:', userId);
    }
}

// Change password with MFA verification
async function changePassword(userId: string, oldPassword: string, newPassword: string) {
    const result = await authService.changePassword(userId, oldPassword, newPassword);
    if (result.success) {
        console.log('Password changed successfully');
    } else {
        throw new Error(result.error?.message || 'Password change failed');
    }
}
```

### Security Monitoring

```typescript
import { useSecurityMonitor } from '@/core/auth/hooks';

function SecurityDashboard() {
    const { 
        securityEvents, 
        anomalyDetection, 
        auditLogs, 
        isMonitoring 
    } = useSecurityMonitor();
    
    return (
        <div>
            <h2>Security Dashboard</h2>
            <div>Monitoring Status: {isMonitoring ? 'Active' : 'Inactive'}</div>
            
            <h3>Recent Security Events</h3>
            {securityEvents.map(event => (
                <div key={event.id}>
                    {event.type}: {event.description}
                </div>
            ))}
            
            <h3>Anomaly Detection</h3>
            {anomalyDetection.map(anomaly => (
                <div key={anomaly.id}>
                    Alert: {anomaly.description}
                </div>
            ))}
        </div>
    );
}
```

### Enterprise Features

```typescript
import { EnterpriseAuthService } from '@/core/auth/enterprise';

const enterpriseAuth = new EnterpriseAuthService({
    providers: ['oauth', 'saml', 'ldap'],
    security: {
        enableMFA: true,
        enableAudit: true,
        enableAnomalyDetection: true,
        sessionTimeout: 1800000
    },
    compliance: {
        gdpr: true,
        sox: true,
        hipaa: false
    }
});

// Enterprise login with compliance tracking
async function enterpriseLogin(credentials: AuthCredentials) {
    const result = await enterpriseAuth.authenticateWithCompliance(
        credentials,
        { 
            ipAddress: getClientIP(),
            userAgent: navigator.userAgent,
            location: getUserLocation()
        }
    );
    
    if (result.success) {
        // Log compliance event
        await enterpriseAuth.logComplianceEvent({
            type: 'LOGIN',
            userId: result.data?.user.id,
            timestamp: new Date(),
            metadata: result.data?.complianceMetadata
        });
    }
    
    return result;
}
```

## React Integration

### Authentication Hooks

```typescript
import { 
    useFeatureAuth,
    useReactiveFeatureAuth 
} from '@/core/auth/hooks';

function ChatComponent() {
    const { 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        error 
    } = useFeatureAuth('chat', {
        requiredPermissions: ['chat.read', 'chat.write']
    });
    
    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <div>Please login</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <div>
            <h1>Welcome, {user?.firstName}!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

// Reactive authentication with real-time updates
function AdminDashboard() {
    const { 
        user, 
        permissions, 
        securityEvents,
        updatePermissions 
    } = useReactiveFeatureAuth('admin', {
        requiredPermissions: ['admin.*'],
        enableRealTimeUpdates: true
    });
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>Current Permissions: {permissions.join(', ')}</div>
            
            <h2>Recent Security Events</h2>
            {securityEvents.slice(0, 5).map(event => (
                <div key={event.id}>
                    {event.type}: {event.description}
                </div>
            ))}
        </div>
    );
}
```

### Authentication Provider

```typescript
import { AuthProvider } from '@/core/auth';

function App() {
    return (
        <AuthProvider 
            config={{
                defaultProvider: AuthProviderType.JWT,
                enableMFA: true,
                sessionTimeout: 1800000
            }}
        >
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
```

## Configuration

### Environment Variables

```bash
# Authentication Configuration
AUTH_DEFAULT_PROVIDER=oauth
AUTH_ALLOWED_PROVIDERS=jwt,oauth,saml,ldap,session
AUTH_MFA_REQUIRED=true
AUTH_ENCRYPTION_ENABLED=true
AUTH_AUDIT_ENABLED=true

# Token Configuration
AUTH_TOKEN_REFRESH_INTERVAL=2700000
AUTH_TOKEN_EXPIRATION=3600000
AUTH_MAX_RETRIES=3

# Session Configuration
AUTH_SESSION_TIMEOUT=1800000
AUTH_MAX_CONCURRENT_SESSIONS=3

# Security Configuration
AUTH_MAX_LOGIN_ATTEMPTS=5
AUTH_LOCKOUT_DURATION=900000
AUTH_RATE_LIMIT_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW=60000

# Environment
NODE_ENV=production
API_BASE_URL=https://api.example.com
AUTH_DEBUG_MODE=false
```

### Configuration Files

```json
// config/auth/auth.production.json
{
    "defaultProvider": "oauth",
    "allowedProviders": ["oauth", "saml", "jwt"],
    "mfa": {
        "required": true,
        "methods": ["totp", "sms"]
    },
    "security": {
        "encryptionEnabled": true,
        "auditEnabled": true,
        "anomalyDetection": true
    },
    "session": {
        "timeout": 1800000,
        "maxConcurrent": 3,
        "renewalThreshold": 300000
    },
    "oauth": {
        "google": {
            "clientId": "${GOOGLE_CLIENT_ID}",
            "clientSecret": "${GOOGLE_CLIENT_SECRET}",
            "redirectUri": "${OAUTH_REDIRECT_URI}"
        },
        "github": {
            "clientId": "${GITHUB_CLIENT_ID}",
            "clientSecret": "${GITHUB_CLIENT_SECRET}"
        }
    },
    "saml": {
        "entryPoint": "${SAML_ENTRY_POINT}",
        "issuer": "${SAML_ISSUER}",
        "cert": "${SAML_CERT}"
    },
    "ldap": {
        "url": "${LDAP_URL}",
        "bindDN": "${LDAP_BIND_DN}",
        "bindCredentials": "${LDAP_BIND_CREDENTIALS}",
        "searchBase": "${LDAP_SEARCH_BASE}",
        "searchFilter": "(uid={{username}})"
    }
}
```

## Best Practices

### Security Best Practices

```typescript
// Always validate tokens before use
async function validateAndUseToken(token: string) {
    const result = await authService.validateToken(token);
    if (!result.success) {
        // Token is invalid, force logout
        await logout();
        return null;
    }
    
    return result.data;
}

// Implement proper session management
async function checkSessionValidity() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return false;
    
    const result = await authService.isSessionValid(sessionId);
    if (!result) {
        await logout();
        return false;
    }
    
    return true;
}

// Use secure token storage
class SecureTokenStorage {
    private static readonly TOKEN_KEY = 'auth_token';
    
    static setToken(token: string) {
        // Use httpOnly cookies in production
        if (process.env.NODE_ENV === 'production') {
            // Set via server-side HTTP-only cookie
        } else {
            // Development fallback
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }
    
    static getToken(): string | null {
        if (process.env.NODE_ENV === 'production') {
            // Get from server-side cookie
            return null; // Handled by server
        } else {
            return localStorage.getItem(this.TOKEN_KEY);
        }
    }
    
    static clearToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}
```

### Error Handling

```typescript
// Comprehensive error handling
async function handleAuthError(error: AuthError) {
    switch (error.type) {
        case AuthErrorType.INVALID_CREDENTIALS:
            showNotification('Invalid username or password', 'error');
            break;
            
        case AuthErrorType.TOKEN_EXPIRED:
            // Try to refresh token
            try {
                await refreshToken();
            } catch (refreshError) {
                await logout();
                showNotification('Session expired, please login again', 'warning');
            }
            break;
            
        case AuthErrorType.USER_NOT_FOUND:
            showNotification('User account not found', 'error');
            break;
            
        case AuthErrorType.ACCESS_DENIED:
            showNotification('Access denied', 'error');
            break;
            
        case AuthErrorType.PROVIDER_ERROR:
            showNotification('Authentication service unavailable', 'error');
            break;
            
        default:
            showNotification('Authentication error occurred', 'error');
    }
}
```

### Performance Optimization

```typescript
// Implement token caching
class TokenCache {
    private cache = new Map<string, { token: string; expires: number }>();
    
    set(key: string, token: string, ttl: number) {
        this.cache.set(key, {
            token,
            expires: Date.now() + ttl
        });
    }
    
    get(key: string): string | null {
        const cached = this.cache.get(key);
        if (!cached || Date.now() > cached.expires) {
            this.cache.delete(key);
            return null;
        }
        return cached.token;
    }
}

// Use lazy loading for auth providers
class LazyAuthProvider {
    private provider: IAuthProvider | null = null;
    
    async getProvider(): Promise<IAuthProvider> {
        if (!this.provider) {
            // Load provider only when needed
            const { OAuthProvider } = await import('./providers/OAuthProvider');
            this.provider = new OAuthProvider(config);
        }
        return this.provider;
    }
}
```

## Testing

### Mock Authentication

```typescript
import { createMockAuthService } from '@/core/auth/utils';

// In tests
const mockAuth = createMockAuthService();

test('should authenticate user successfully', async () => {
    mockAuth.mockAuthenticate.mockResolvedValue({
        success: true,
        data: {
            id: 'user-123',
            email: 'test@example.com',
            token: 'mock-token'
        }
    });
    
    const result = await mockAuth.authenticate({
        email: 'test@example.com',
        password: 'password'
    });
    
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe('test@example.com');
});
```

### Integration Testing

```typescript
test('should handle authentication flow end-to-end', async () => {
    const authService = createDefaultAuthService();
    
    // Login
    const loginResult = await authService.authenticate({
        email: 'test@example.com',
        password: 'password'
    });
    
    expect(loginResult.success).toBe(true);
    expect(loginResult.data).toBeDefined();
    
    // Get current user
    const userResult = await authService.getCurrentUser();
    expect(userResult.success).toBe(true);
    expect(userResult.data?.email).toBe('test@example.com');
    
    // Logout
    const logoutResult = await authService.logout(loginResult.data!.token);
    expect(logoutResult.success).toBe(true);
});
```

## Migration Guide

### From Legacy Authentication

**Before (deprecated):**
```typescript
import { AuthFeatureService } from '@/features/auth/application/services/AuthFeatureService';
const authService = new AuthFeatureService();
```

**After (recommended):**
```typescript
import { createDefaultAuthService } from '@/core/auth';
const authService = createDefaultAuthService();
```

### From Direct Provider Imports

**Before (deprecated):**
```typescript
import { OAuthProvider } from '@/core/auth/providers/OAuthProvider';
const provider = new OAuthProvider(config);
```

**After (recommended):**
```typescript
import { createAuthService } from '@/core/auth';
const authService = createAuthService({
    providers: [
        { type: AuthProviderType.OAUTH, config: oauthConfig }
    ]
});
```

## Troubleshooting

### Common Issues

1. **Authentication Fails**: Check provider configuration and credentials
2. **Token Expiration**: Implement proper token refresh logic
3. **Session Issues**: Verify session timeout configuration
4. **MFA Problems**: Ensure MFA is properly configured for users
5. **Provider Errors**: Check provider-specific configuration

### Debug Mode

```typescript
// Enable debug logging
const authService = createAuthService({
    debug: true,
    logging: {
        level: 'debug',
        includeStackTrace: true
    }
});
```

## Version Information

- **Current Version**: 1.0.0
- **BlackBox Compliance**: 90%+
- **TypeScript Support**: Full
- **Test Coverage**: Comprehensive
- **Supported Providers**: JWT, OAuth 2.0, SAML 2.0, LDAP, Session

## Dependencies

- `@core/di` - Dependency injection support
- `@core/services` - Logging and monitoring
- `@core/cache` - Session caching
- TypeScript - Type safety

## Related Modules

- **Network Module**: For API authentication
- **Services Module**: For audit logging
- **DI Module**: For dependency injection integration
- **Cache Module**: For session management
