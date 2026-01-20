# QuietSpace Authentication System Documentation

## 🏗️ Architecture Overview

This document provides a comprehensive overview of the enterprise-grade authentication system implemented in QuietSpace-Frontend.

## 📁 Directory Structure

```
src/
├── services/store/zustand.ts              # Centralized auth state management
├── shared/auth/                           # Security features & utilities
│   ├── ProtectedRoute.tsx                # Route-level protection
│   ├── withAuth.tsx                      # Component-level guards
│   ├── permissions.ts                      # RBAC system
│   ├── useSessionTimeout.ts               # Session timeout management
│   ├── SessionTimeoutWarning.tsx           # User timeout dialogs
│   ├── useMultiTabSync.ts                # Cross-tab synchronization
│   ├── auditLogger.ts                     # Security audit logging
│   ├── anomalyDetector.ts                 # Threat pattern detection
│   └── AdvancedSecurityProvider.tsx       # Integration provider
├── core/network/apiClient.ts               # Secure API client
├── api/requests/
│   ├── secureApiUtils.ts                  # Secure API utilities
│   └── MIGRATION_GUIDE.md              # API migration guide
├── pages/auth/
│   ├── AuthPage.tsx                      # Authentication pages
│   └── UnauthorizedPage.tsx              # Access denied page
└── components/auth/                        # Auth components
    ├── AuthContainer.tsx                  # Main auth container
    ├── LoginForm.tsx                      # Login form
    ├── SignupForm.tsx                     # Registration form
    └── ActivationForm.tsx                 # Account activation
```

---

## 🔐 Security Layers Implementation

### 1. State Management Layer
**File:** `src/services/store/zustand.ts`

**Purpose:** Centralized authentication state management using Zustand

**Features:**
- User session data (user, token, permissions)
- Form state management (currentPage, formData)
- Authentication actions (login, logout, setAuthData)
- Persistent storage with localStorage
- Type-safe interfaces

**Usage:**
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### 2. Route Protection Layer
**File:** `src/shared/auth/ProtectedRoute.tsx`

**Purpose:** Route-level authentication and authorization

**Features:**
- Automatic authentication check
- Permission-based access control
- Redirect to signin for unauthenticated users
- Redirect to unauthorized for insufficient permissions
- Loading state handling

**Usage:**
```typescript
<ProtectedRoute>
  <ProtectedContent />
</ProtectedRoute>

<ProtectedRoute requiredPermissions={['admin:panel']}>
  <AdminContent />
</ProtectedRoute>
```

### 3. Component Guard Layer
**File:** `src/shared/auth/withAuth.tsx`

**Purpose:** Component-level authentication and authorization

**Features:**
- HOC for protecting components
- Permission checking
- Fallback component support
- Error handling options

**Usage:**
```typescript
const ProtectedComponent = withAuth(MyComponent, {
  requiredPermissions: ['read:posts'],
  showError: true
});
```

### 4. Permission System
**File:** `src/shared/auth/permissions.ts`

**Purpose:** Role-based access control (RBAC)

**Features:**
- 5 user roles (Guest, User, Moderator, Admin, Super Admin)
- 20+ granular permissions
- Role-permission mappings
- Permission checking utilities

**Usage:**
```typescript
import { PERMISSIONS, ROLES, hasPermission } from '@/shared/auth/permissions';

// Check user permission
const canEdit = hasPermission(user.role, PERMISSIONS.EDIT_POSTS);

// Get user permissions
const userPerms = getRolePermissions(user.role);
```

### 5. API Security Layer
**Files:** `src/core/network/apiClient.ts`, `src/api/requests/secureApiUtils.ts`

**Purpose:** Secure HTTP communication with automatic token management

**Features:**
- Automatic token injection
- Token refresh on 401 errors
- Request retry logic
- Error categorization and logging
- Performance monitoring

**Usage:**
```typescript
// Automatic security (recommended)
import { secureApi } from '@/api/requests/secureApiUtils';
const { data } = await secureApi.get('/user/profile');

// Drop-in replacement
import { getWrappedSecureApiResponse } from '@/api/requests/secureApiUtils';
const response = await getWrappedSecureApiResponse('/api/user', 'GET', null, null);
```

---

## 🛡️ Advanced Security Features

### 1. Session Timeout Management
**Files:** `src/shared/auth/useSessionTimeout.ts`, `src/shared/auth/SessionTimeoutWarning.tsx`

**Purpose:** Automatic session management with user-friendly warnings

**Features:**
- Configurable timeout (default: 30 minutes)
- Warning before timeout (default: 5 minutes)
- User activity tracking
- Session extension options
- Automatic logout on inactivity

**Configuration:**
```typescript
const { resetTimer, isWarning } = useSessionTimeout({
  timeoutMs: 30 * 60 * 1000,    // 30 minutes
  warningMs: 5 * 60 * 1000,     // 5 minutes
  onWarning: (timeRemaining) => console.log(`Session expires in ${timeRemaining}ms`),
  onTimeout: () => console.log('Session timed out')
});
```

### 2. Multi-Tab Synchronization
**File:** `src/shared/auth/useMultiTabSync.ts`

**Purpose:** Synchronize authentication state across browser tabs

**Features:**
- BroadcastChannel API for real-time sync
- localStorage fallback for compatibility
- Login/logout event broadcasting
- Token refresh coordination
- Session timeout synchronization

**Usage:**
```typescript
const { syncLogin, syncLogout, syncTokenRefresh } = useMultiTabSync({
  channelName: 'auth-sync',
  enabled: true
});

// Sync login across tabs
syncLogin(userData, token);
```

### 3. Security Audit Logging
**File:** `src/shared/auth/auditLogger.ts`

**Purpose:** Comprehensive security event tracking

**Features:**
- 20+ audit event types
- 4 severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- Multiple logging destinations
- Export capabilities for compliance
- User activity tracking

**Event Types:**
```typescript
// Authentication events
LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, TOKEN_REFRESH

// Authorization events
ACCESS_GRANTED, ACCESS_DENIED, PERMISSION_CHECK

// Security events
SUSPICIOUS_ACTIVITY, RATE_LIMIT_EXCEEDED, BRUTE_FORCE_ATTEMPT

// Usage
auditLogger.logLoginSuccess(userId, username, details);
auditLogger.logSuspiciousActivity(details, AuditSeverity.HIGH);
```

### 4. Anomaly Detection
**File:** `src/shared/auth/anomalyDetector.ts`

**Purpose:** Proactive threat pattern recognition

**Features:**
- Multiple failed login attempts detection
- Rapid request pattern monitoring
- Concurrent session tracking
- Permission escalation alerts
- Risk scoring system
- Location-based anomaly detection

**Detection Types:**
```typescript
// Track suspicious patterns
anomalyDetector.trackFailedLogin(email, details);
anomalyDetector.trackRequest(userId);
anomalyDetector.trackUserSession(userId, sessionId);

// Get risk assessment
const riskScore = anomalyDetector.getUserRiskScore(userId);
const isHighRisk = anomalyDetector.isHighRiskUser(userId);
```

---

## 🚀 Integration Guide

### App-Level Security Setup

#### 1. Basic Integration
```typescript
// src/App.tsx
import React from 'react';
import { AdvancedSecurityProvider } from '@/shared/auth/AdvancedSecurityProvider';
import RoutesConfig from './RoutesConfig';

const App: React.FC = () => {
  return (
    <AdvancedSecurityProvider>
      <RoutesConfig />
    </AdvancedSecurityProvider>
  );
};

export default App;
```

#### 2. Full Security Integration
```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdvancedSecurityProvider } from '@/shared/auth/AdvancedSecurityProvider';
import RoutesConfig from './RoutesConfig';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdvancedSecurityProvider>
        <RoutesConfig />
      </AdvancedSecurityProvider>
    </BrowserRouter>
  );
};
```

### Component-Level Security

#### Protected Routes
```typescript
// All authenticated routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />

// Permission-based routes
<Route path="/admin" element={
  <ProtectedRoute requiredPermissions={[PERMISSIONS.SYSTEM_ADMIN]}>
    <AdminPanel />
  </ProtectedRoute>
} />
```

#### Protected Components
```typescript
// HOC protection
const ProtectedComponent = withAuth(SensitiveComponent, {
  requiredPermissions: ['read: sensitive'],
  showError: true
});

// Hook protection
const { isAuthorized } = useAuth(['edit: posts']);
```

### API Security Integration

#### Secure API Calls
```typescript
// New implementation (recommended)
import { secureApi } from '@/api/requests/secureApiUtils';

export const fetchUserProfile = async (userId: string) => {
  const { data } = await secureApi.get(`/users/${userId}`);
  return data;
};

// Migration from existing fetch
import { getWrappedSecureApiResponse } from '@/api/requests/secureApiUtils';

export const fetchLogin = async (credentials: LoginCredentials) => {
  const response = await getWrappedSecureApiResponse('/auth/login', 'POST', credentials, null);
  return response.json();
};
```

---

## 📊 Security Monitoring

### Audit Trail Access
```typescript
import { useAuditLogger } from '@/shared/auth/auditLogger';

const auditLog = useAuditLogger();

// Get recent security events
const recentLogs = auditLog.getRecentLogs(50);

// Get logs by type
const loginAttempts = auditLog.getLogsByEventType(AuditEventType.LOGIN_FAILED);

// Export logs for compliance
const auditExport = auditLog.exportLogs();
```

### Anomaly Monitoring
```typescript
import { useAnomalyDetector } from '@/shared/auth/anomalyDetector';

const anomalyDetector = useAnomalyDetector();

// Get user risk assessment
const riskScore = anomalyDetector.getUserRiskScore(userId);

// Get recent anomalies
const recentAnomalies = anomalyDetector.getRecentAnomalies(10);

// Check for high-risk users
const isHighRisk = anomalyDetector.isHighRiskUser(userId);
```

---

## 🔧 Configuration Options

### Environment Variables
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SESSION_TIMEOUT=1800000  # 30 minutes in ms
REACT_APP_ENABLE_ANOMALY_DETECTION=true
REACT_APP_ENABLE_AUDIT_LOGGING=true
```

### Feature Flags
```typescript
// Disable specific features if needed
const sessionTimeout = useSessionTimeout({ enabled: false });
const multiTabSync = useMultiTabSync({ enabled: false });
const anomalyDetection = useAnomalyDetector({ 
  enabled: false,
  maxFailedLogins: 3 
});
```

---

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// Mock auth store
jest.mock('@/services/store/zustand', () => ({
  useAuthStore: () => ({
    user: mockUser,
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  })
}));

// Test security components
test('ProtectedRoute redirects unauthenticated users', () => {
  render(<ProtectedRoute><ProtectedContent /></ProtectedRoute>);
  expect(screen.getByText('Please sign in')).toBeInTheDocument();
});
```

### Integration Testing
```typescript
// Test authentication flows
test('complete login flow', async () => {
  render(<App />);
  
  // Fill login form
  fireEvent.change(screen.getByLabelText('Email'), 'test@example.com');
  fireEvent.change(screen.getByLabelText('Password'), 'password');
  fireEvent.click(screen.getByText('Login'));
  
  // Verify redirect to dashboard
  await waitFor(() => {
    expect(window.location.pathname).toBe('/dashboard');
  });
});
```

### Security Testing
```typescript
// Test unauthorized access
test('protected routes require authentication', () => {
  // Clear auth state
  useAuthStore.getState().logout();
  
  // Try to access protected route
  render(<ProtectedRoute><ProtectedContent /></ProtectedRoute>);
  
  // Should redirect to signin
  expect(screen.getByText('Please sign in')).toBeInTheDocument();
});
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Not Working
**Symptoms:** Users stay logged out, routes redirect to signin
**Solutions:**
- Check `useAuthStore` integration
- Verify token storage in localStorage
- Ensure `AdvancedSecurityProvider` wraps app

#### 2. Permissions Not Working
**Symptoms:** Users can't access features they should have
**Solutions:**
- Verify user role assignment
- Check permission constants
- Test permission checking functions

#### 3. Session Timeout Issues
**Symptoms:** Users logged out too quickly/slowly
**Solutions:**
- Adjust timeout configuration
- Check activity event listeners
- Verify timer reset logic

#### 4. Multi-Tab Sync Issues
**Symptoms:** State not synchronized between tabs
**Solutions:**
- Check BroadcastChannel support
- Verify localStorage fallback
- Test event handling

### Debug Mode
```typescript
// Enable debug logging
const auditLog = useAuditLogger({ consoleLog: true });
const anomalyDetector = useAnomalyDetector({ enabled: true });

// Check auth state
console.log('Auth state:', useAuthStore.getState());
```

---

## 📈 Performance Considerations

### Optimization Tips
1. **Lazy Loading:** Use React.lazy for auth components
2. **Memoization:** Memoize permission checks
3. **Debouncing:** Debounce activity tracking
4. **Storage Optimization:** Limit localStorage size
5. **Network Optimization:** Batch API requests

### Monitoring Metrics
- Authentication success/failure rates
- Session timeout frequency
- Anomaly detection accuracy
- API response times
- Permission check performance

---

## 🔐 Security Best Practices

### Implementation Guidelines
1. **Always validate permissions** on both client and server
2. **Use HTTPS** for all authentication requests
3. **Implement rate limiting** for sensitive operations
4. **Log security events** for audit trails
5. **Regular security reviews** of authentication logic
6. **Keep dependencies updated** for security patches
7. **Test edge cases** like token expiration
8. **Implement proper error handling** without exposing sensitive data

### Compliance Considerations
- **GDPR:** User data protection and consent
- **SOC 2:** Security controls and monitoring
- **ISO 27001:** Information security management
- **PCI DSS:** Payment card security (if applicable)

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
1. **Review audit logs** for security incidents
2. **Update permission mappings** as features evolve
3. **Monitor anomaly detection** accuracy
4. **Test authentication flows** after updates
5. **Update dependencies** for security patches

### Contact Information
- **Security Team:** security@quietspace.com
- **Development Team:** dev@quietspace.com
- **Documentation:** https://docs.quietspace.com/auth

---

## 🎯 Conclusion

This authentication system provides enterprise-grade security with:

- ✅ **Defense in Depth** - Multiple security layers
- ✅ **Zero Trust** - Verify every request
- ✅ **Centralized Management** - Single auth source
- ✅ **Automatic Recovery** - Token refresh, retry logic
- ✅ **Security Monitoring** - Audit trails, anomaly detection

The system is production-ready and follows modern security best practices for enterprise applications.
