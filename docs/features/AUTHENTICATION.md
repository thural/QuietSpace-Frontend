# Authentication Feature

## 🎯 Overview

The Authentication feature provides multi-provider authentication with comprehensive security features, runtime configuration switching, and health monitoring. It supports JWT, OAuth 2.0, SAML 2.0, LDAP, and session-based authentication with advanced security measures.

## ✅ Implementation Status: COMPLETE

### Key Features
- **Multi-Factor Authentication**: TOTP, SMS, biometric support
- **Device Trust Management**: Trusted device recognition and management
- **Session Monitoring**: Real-time validation and automatic refresh
- **Threat Detection**: Advanced security event monitoring
- **Multi-Provider Support**: JWT, OAuth, SAML, LDAP, Session
- **Security-Conscious Caching**: Intelligent TTL strategies

## 🏗️ Architecture

### Architecture Overview

```
React Components (UI Layer)
    ↓
Custom Hooks (UI Logic Layer)
    ↓
DI Container (Dependency Resolution)
    ↓
Service Layer (Business Logic)
    ↓
Cache Layer (Data Orchestration)
    ↓
Repository Layer (Data Access)
```

### Layer Separation Principles

**Component Layer** - Pure UI rendering and local state only
- React components with UI logic only
- Event handlers and user interactions
- No business logic or direct service access
- Access services only through hooks

**Hook Layer** - UI logic and state transformation
- Custom hooks with UI-specific logic
- State management and transformation
- Service access through DI container only
- No direct service imports

**Service Layer** - Business logic and orchestration
- Business validation and transformation
- Orchestration of multiple operations
- Cache layer dependency only (no direct repository access)
- No direct database or API calls

**Cache Layer** - Data orchestration and optimization
- Data caching with TTL management
- Cache invalidation strategies
- Repository layer coordination only
- No business logic

**Repository Layer** - Raw data access
- Database operations and external API calls
- Data persistence and retrieval
- No business logic or caching logic

### Directory Structure
```
src/features/auth/
├── domain/
│   ├── entities/           # User, Session, Device entities
│   ├── repositories/       # Repository interfaces
│   ├── services/         # Domain services
│   └── types/            # Auth types
├── data/
│   ├── repositories/      # Repository implementations
│   ├── models/           # Data models
│   └── migrations/       # Database migrations
├── application/
│   ├── services/         # Application services
│   ├── hooks/            # React hooks
│   ├── stores/           # State management
│   └── dto/              # Data transfer objects
├── presentation/
│   ├── components/       # UI components
│   ├── hooks/            # Presentation hooks
│   └── styles/           # Feature-specific styles
├── di/
│   ├── container.ts      # DI container
│   ├── types.ts          # DI types
│   └── index.ts          # Exports
└── __tests__/            # Tests
```

## 🔧 Core Components

### 1. Enterprise Auth Hooks

#### useEnterpriseAuth
```typescript
export const useEnterpriseAuth = () => {
  // ✅ CORRECT: Service access through DI container
  const services = useAuthServices();
  
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    mfaRequired: false,
    deviceTrusted: false
  });
  
  const actions = {
    login: async (credentials: LoginCredentials) => {
      // UI logic: loading states
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Business logic delegation to service
        const result = await services.authService.login(credentials);
        setState(prev => ({ ...prev, ...result, isLoading: false }));
        return result;
      } catch (error) {
        setState(prev => ({ ...prev, error, isLoading: false }));
        throw error;
      }
    },
    logout: async () => {
      await services.authService.logout();
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false
      }));
    }
  };
  
  return { ...state, ...actions };
};
```

#### useAuthMigration
```typescript
export const useAuthMigration = (config: AuthMigrationConfig) => {
  const enterpriseHook = useEnterpriseAuth();
  const legacyHook = useLegacyAuth();
  
  const shouldUseEnterprise = config.useEnterpriseHooks && !config.forceLegacy;
  
  const migration = {
    isUsingEnterprise: shouldUseEnterprise,
    errors: [],
    performance: {},
    config
  };
  
  // Automatic migration based on configuration
  const hookData = shouldUseEnterprise ? enterpriseHook : legacyHook;
  
  // Error handling with fallback
  useEffect(() => {
    if (shouldUseEnterprise && config.enableFallback) {
      const errorBoundary = new ErrorBoundary({
        fallback: () => legacyHook,
        onError: (error) => {
          migration.errors.push(error);
          console.warn('Enterprise auth hook failed, falling back to legacy:', error);
        }
      });
      
      errorBoundary.wrap(enterpriseHook);
    }
  }, [shouldUseEnterprise, config.enableFallback]);
  
  return {
    ...hookData,
    migration
  };
};
```

### 2. Authentication Services

#### AuthFeatureService
```typescript
@Injectable()
export class AuthFeatureService {
  constructor(
    // ✅ CORRECT: Cache layer dependency only
    @Inject(TYPES.CACHE_SERVICE) private cache: ICacheService
  ) {}
  
  async loginWithSecurity(credentials: LoginCredentials): Promise<AuthResult> {
    // Business logic: input validation
    const validatedCredentials = this.validateCredentials(credentials);
    
    // Business logic: device trust check
    const deviceInfo = await this.getDeviceInfo();
    const isTrustedDevice = await this.cache.isDeviceTrusted(deviceInfo);
    
    // Business logic: authentication orchestration
    const authResult = await this.cache.authenticate(validatedCredentials);
    
    // Business logic: MFA verification
    if (authResult.mfaRequired && !isTrustedDevice) {
      const mfaResult = await this.cache.verifyMFA(authResult.user);
      authResult.mfaVerified = mfaResult.verified;
    }
    
    // Business logic: session creation
    await this.createSecureSession(authResult.user, deviceInfo);
    
    // Data access through cache layer only
    await this.cache.setUserData(authResult.user.id, authResult.user);
    
    return authResult;
  }
  
  private validateCredentials(credentials: LoginCredentials): ValidatedCredentials {
    // Business validation logic
    if (!credentials.email?.includes('@')) {
      throw new ValidationError('Invalid email format');
    }
    if (credentials.password?.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
    return {
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password
    };
  }
}
```

### 3. Multi-Provider Authentication

#### Provider Configuration
```typescript
export interface AuthProviderConfig {
  provider: 'jwt' | 'oauth' | 'saml' | 'ldap' | 'session';
  config: {
    // JWT Configuration
    secret?: string;
    expiresIn?: string;
    issuer?: string;
    
    // OAuth Configuration
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    scopes?: string[];
    
    // SAML Configuration
    entryPoint?: string;
    issuer?: string;
    cert?: string;
    
    // LDAP Configuration
    url?: string;
    bindDN?: string;
    bindCredentials?: string;
    searchBase?: string;
    
    // Session Configuration
    secret?: string;
    resave?: boolean;
    saveUninitialized?: boolean;
  };
}
```

#### Provider Factory
```typescript
export class AuthProviderFactory {
  static create(config: AuthProviderConfig): IAuthProvider {
    switch (config.provider) {
      case 'jwt':
        return new JWTProvider(config.config);
      case 'oauth':
        return new OAuthProvider(config.config);
      case 'saml':
        return new SAMLProvider(config.config);
      case 'ldap':
        return new LDAPProvider(config.config);
      case 'session':
        return new SessionProvider(config.config);
      default:
        throw new Error(`Unsupported auth provider: ${config.provider}`);
    }
  }
}
```

## 🔐 Security Features

### Multi-Factor Authentication (MFA)

#### TOTP Support
```typescript
export class TOTPService {
  async generateSecret(userId: string): Promise<TOTPSetup> {
    const secret = speakeasy.generateSecret({
      name: `QuietSpace (${userId})`,
      issuer: 'QuietSpace'
    });
    
    const qrCode = await qrcode.toDataURL(secret.otpauth_url!);
    
    return {
      secret: secret.base32,
      qrCode,
      backupCodes: this.generateBackupCodes()
    };
  }
  
  async verifyToken(userId: string, token: string): Promise<boolean> {
    const userSecret = await this.getUserSecret(userId);
    
    return speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token,
      window: 2 // Allow 2-step time window
    });
  }
}
```

#### Device Trust Management
```typescript
export class DeviceTrustService {
  async calculateSecurityScore(deviceInfo: DeviceInfo): Promise<number> {
    let score = 0;
    
    // User agent analysis
    if (this.isSecureBrowser(deviceInfo.userAgent)) {
      score += 30;
    }
    
    // IP reputation
    const ipReputation = await this.checkIPReputation(deviceInfo.ipAddress);
    score += ipReputation * 25;
    
    // Geolocation consistency
    if (await this.isKnownLocation(deviceInfo)) {
      score += 20;
    }
    
    // Device fingerprint consistency
    if (await this.isKnownDevice(deviceInfo)) {
      score += 25;
    }
    
    return Math.min(score, 100);
  }
  
  async createTrustRecord(
    userId: string,
    deviceInfo: DeviceInfo,
    securityScore: number
  ): Promise<TrustRecord> {
    return {
      id: generateSecureId(),
      userId,
      deviceFingerprint: deviceInfo.fingerprint,
      securityScore,
      trustedAt: new Date(),
      expiresAt: new Date(Date.now() + TRUST_DURATION),
      isActive: true
    };
  }
}
```

### Session Management

#### Secure Session Service
```typescript
export class SessionService {
  async createSession(user: User, deviceInfo: DeviceInfo): Promise<Session> {
    const session = {
      id: this.generateSecureSessionId(),
      userId: user.id,
      deviceId: deviceInfo.id,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + SESSION_TIMEOUT),
      isActive: true,
      securityContext: {
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        location: deviceInfo.location
      }
    };
    
    await this.sessionRepository.create(session);
    
    return session;
  }
  
  async validateSession(sessionId: string): Promise<SessionValidation> {
    const session = await this.sessionRepository.findById(sessionId);
    
    if (!session || !session.isActive) {
      return { valid: false, reason: 'Session not found or inactive' };
    }
    
    if (new Date() > session.expiresAt) {
      await this.invalidateSession(sessionId);
      return { valid: false, reason: 'Session expired' };
    }
    
    // Check for suspicious activity
    const securityIssues = await this.checkSecurityContext(session);
    if (securityIssues.length > 0) {
      await this.handleSecurityIssues(session, securityIssues);
      return { valid: false, reason: 'Security concerns detected' };
    }
    
    // Update last activity
    await this.updateLastActivity(sessionId);
    
    return { valid: true, session };
  }
}
```

## 📊 Performance & Caching

### Cache Strategy
```typescript
export const AUTH_CACHE_KEYS = {
  // User data
  USER: (id: string) => `auth:user:${id}`,
  USER_PERMISSIONS: (id: string) => `auth:permissions:${id}`,
  USER_PREFERENCES: (id: string) => `auth:preferences:${id}`,
  
  // Device trust
  DEVICE_TRUST: (deviceId: string) => `auth:device:trust:${deviceId}`,
  DEVICE_FINGERPRINT: (fingerprint: string) => `auth:device:fingerprint:${fingerprint}`,
  
  // Session data
  SESSION: (sessionId: string) => `auth:session:${sessionId}`,
  ACTIVE_SESSIONS: (userId: string) => `auth:sessions:active:${userId}`,
  
  // Security
  MFA_SECRET: (userId: string) => `auth:mfa:secret:${userId}`,
  SECURITY_EVENTS: (userId: string) => `auth:security:events:${userId}`,
  LOGIN_ATTEMPTS: (identifier: string) => `auth:login:attempts:${identifier}`
};

export const AUTH_CACHE_TTL = {
  // User data (shorter for security)
  USER: 15 * 60 * 1000, // 15 minutes
  USER_PERMISSIONS: 30 * 60 * 1000, // 30 minutes
  USER_PREFERENCES: 60 * 60 * 1000, // 1 hour
  
  // Device trust (longer for convenience)
  DEVICE_TRUST: 24 * 60 * 60 * 1000, // 24 hours
  DEVICE_FINGERPRINT: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Session data (very short for security)
  SESSION: 5 * 60 * 1000, // 5 minutes
  ACTIVE_SESSIONS: 10 * 60 * 1000, // 10 minutes
  
  // Security (shortest for security)
  MFA_SECRET: 60 * 60 * 1000, // 1 hour
  SECURITY_EVENTS: 24 * 60 * 60 * 1000, // 24 hours
  LOGIN_ATTEMPTS: 15 * 60 * 1000 // 15 minutes
};
```

## 🧪 Testing

### Unit Tests
```typescript
describe('AuthFeatureService', () => {
  let service: AuthFeatureService;
  let mockDataService: jest.Mocked<AuthDataService>;
  let mockCacheService: jest.Mocked<CacheService>;
  
  beforeEach(() => {
    mockDataService = createMockAuthService();
    mockCacheService = createMockCacheService();
    
    service = new AuthFeatureService(
      mockDataService,
      mockCacheService,
      mockMFAService,
      mockDeviceService
    );
  });
  
  describe('loginWithSecurity', () => {
    it('should authenticate user with valid credentials', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      const result = await service.loginWithSecurity(credentials);
      
      expect(result.user).toBeDefined();
      expect(result.isAuthenticated).toBe(true);
      expect(mockDataService.authenticate).toHaveBeenCalledWith(credentials);
    });
    
    it('should require MFA for untrusted devices', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      mockDeviceService.isTrusted.mockResolvedValue(false);
      mockMFAService.authenticate.mockResolvedValue({ verified: true });
      
      const result = await service.loginWithSecurity(credentials);
      
      expect(result.mfaVerified).toBe(true);
      expect(mockMFAService.authenticate).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests
```typescript
describe('Auth Integration', () => {
  it('should complete full authentication flow', async () => {
    const { result } = renderHook(() => useEnterpriseAuth(), {
      wrapper: DIProvider
    });
    
    // Login
    await act(async () => {
      await result.current.login({
        email: 'user@example.com',
        password: 'password123'
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
    
    // Enable MFA
    await act(async () => {
      await result.current.enableMFA('totp');
    });
    
    expect(result.current.mfaRequired).toBe(true);
    
    // Trust device
    await act(async () => {
      await result.current.trustDevice();
    });
    
    expect(result.current.deviceTrusted).toBe(true);
  });
});
```

## 🚀 Usage Examples

### Basic Authentication
```typescript
// ✅ CORRECT: Component with pure UI and hook usage
const LoginComponent = () => {
  const { login, isLoading, error } = useEnterpriseAuth();
  
  const handleSubmit = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Login form */}
    </form>
  );
};

// ❌ INCORRECT: Component with direct service access
const LoginComponentBad = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (credentials: LoginCredentials) => {
    // ❌ INCORRECT: Direct service import and access
    import { AuthService } from '../services/AuthService';
    const authService = new AuthService();
    
    setIsLoading(true);
    try {
      await authService.login(credentials);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Login form */}
    </form>
  );
};
```

### MFA Setup
```typescript
// ✅ CORRECT: Component with proper hook usage
const MFASetupComponent = () => {
  const { enableMFA, user } = useEnterpriseAuth();
  const [qrCode, setQrCode] = useState('');
  
  const handleEnableMFA = async () => {
    try {
      const setup = await enableMFA('totp');
      setQrCode(setup.qrCode);
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      <h2>Set up Multi-Factor Authentication</h2>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <button onClick={handleEnableMFA}>
        Enable MFA
      </button>
    </div>
  );
};

// ❌ INCORRECT: Component with business logic
const MFASetupComponentBad = () => {
  const [qrCode, setQrCode] = useState('');
  
  const handleEnableMFA = async () => {
    // ❌ INCORRECT: Business logic in component
    import { TOTPService } from '../services/TOTPService';
    const totpService = new TOTPService();
    
    const user = getCurrentUser(); // Direct state access ❌
    const secret = totpService.generateSecret(user.id);
    const qrCode = await generateQRCode(secret.otpauth_url);
    setQrCode(qrCode);
  };
  
  return (
    <div>
      <h2>Set up Multi-Factor Authentication</h2>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <button onClick={handleEnableMFA}>
        Enable MFA
      </button>
    </div>
  );
};
```

---

**Status: ✅ READY FOR DEPLOYMENT**

The Authentication feature provides comprehensive security with multi-factor authentication, device trust management, and advanced threat detection capabilities.
