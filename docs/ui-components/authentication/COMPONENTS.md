# Reusable Authentication UI Components

This directory contains reusable authentication-related UI components that have been decoupled from the EnterpriseAuthExample for better maintainability and reusability across the application.

## 📁 Component Structure

```
src/shared/ui/components/
├── feedback/
│   ├── LoadingSpinner.tsx      # Flexible loading spinner
│   └── ErrorMessage.tsx         # Error display with retry/clear actions
├── forms/
│   └── TwoFactorAuth.tsx        # 2FA verification component
├── user/
│   ├── AuthStatus.tsx           # Authentication status display
│   ├── SecurityStatus.tsx      # Security information display
│   └── AuthenticatedActions.tsx # Post-authentication actions
└── utility/
    └── MigrationInfo.tsx        # Migration status and performance info
```

## 🎯 Components Overview

### 📊 Feedback Components

#### LoadingSpinner
A flexible loading spinner with customizable size and color options.

**Features:**
- Multiple sizes (sm, md, lg)
- Multiple colors (primary, secondary, success, error, warning)
- Show/hide methods
- Enterprise BaseClassComponent pattern

**Usage:**
```tsx
import { LoadingSpinner } from '@shared/ui/components';

<LoadingSpinner
  size="md"
  color="primary"
  className="my-spinner"
/>
```

#### ErrorMessage
A comprehensive error display component with retry and clear actions.

**Features:**
- Multiple variants (default, compact, detailed)
- Configurable retry/clear buttons
- Detailed error information
- Auto-hide functionality

**Usage:**
```tsx
import { ErrorMessage } from '@shared/ui/components';

<ErrorMessage
  error="Something went wrong"
  onRetry={() => retryOperation()}
  onClear={() => clearError()}
  showRetry={true}
  showClear={true}
  variant="default"
/>
```

### 🔐 Form Components

#### TwoFactorAuth
A complete two-factor authentication verification component.

**Features:**
- Code input with validation
- Rate limiting and attempt tracking
- Paste support for codes
- Real-time validation feedback
- Accessibility support

**Usage:**
```tsx
import { TwoFactorAuth } from '@shared/ui/components';

<TwoFactorAuth
  onVerify={async (code) => await verifyCode(code)}
  isLoading={false}
  maxLength={6}
  placeholder="Enter 6-digit code"
  variant="default"
/>
```

### 👤 User Components

#### AuthStatus
Displays current authentication status and user information.

**Features:**
- User avatar with fallback
- Multiple display variants
- Expandable detailed view
- User information display

**Usage:**
```tsx
import { AuthStatus } from '@shared/ui/components';

<AuthStatus
  isAuthenticated={true}
  user={{
    userId: '123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
  }}
  showUserId={true}
  showRole={true}
  showAvatar={true}
  variant="default"
/>
```

#### SecurityStatus
Shows security-related information including 2FA status and device trust.

**Features:**
- Real-time session expiry countdown
- Device trust management
- 2FA status display
- Expiry warnings

**Usage:**
```tsx
import { SecurityStatus } from '@shared/ui/components';

<SecurityStatus
  requiresTwoFactor={true}
  deviceTrusted={false}
  sessionExpiry={new Date(Date.now() + 3600000)}
  onTrustDevice={() => trustDevice()}
  showSessionExpiry={true}
  variant="default"
/>
```

#### AuthenticatedActions
Provides common actions for authenticated users.

**Features:**
- Token refresh functionality
- Session checking
- Profile and settings access
- Logout functionality
- Multiple layout variants

**Usage:**
```tsx
import { AuthenticatedActions } from '@shared/ui/components';

<AuthenticatedActions
  onRefreshToken={() => refreshToken()}
  onCheckSession={() => checkSession()}
  onLogout={() => logout()}
  onProfile={() => navigateToProfile()}
  variant="default"
  showLabels={true}
/>
```

### 🔧 Utility Components

#### MigrationInfo
Displays migration status and performance information.

**Features:**
- Migration status display
- Performance metrics
- Error tracking
- Auto-refresh capability
- Detailed information views

**Usage:**
```tsx
import { MigrationInfo } from '@shared/ui/components';

<MigrationInfo
  migration={{
    isUsingEnterprise: true,
    config: { securityLevel: 'enhanced' },
    errors: [],
    performance: {
      enterpriseHookTime: 15.2,
      legacyHookTime: 45.8,
      migrationTime: 2.1
    }
  }}
  showDetails={true}
  showPerformance={true}
  showErrors={true}
  variant="default"
/>
```

## 🏗️ Architecture Benefits

### ✅ Enterprise Patterns
- **BaseClassComponent Inheritance**: All components extend the enterprise BaseClassComponent
- **Type Safety**: Full TypeScript support with proper interfaces
- **Lifecycle Management**: Proper onMount, onUpdate, onUnmount handling
- **Error Boundaries**: Built-in error handling and recovery

### ✅ Reusability
- **Black Box Pattern**: Clean public APIs with hidden implementation
- **Configurable Props**: Flexible configuration options
- **Multiple Variants**: Different display modes for various use cases
- **Consistent Styling**: Unified design system integration

### ✅ Maintainability
- **Single Responsibility**: Each component has a focused purpose
- **Clear Interfaces**: Well-defined TypeScript interfaces
- **Comprehensive Documentation**: JSDoc comments and examples
- **Testable Design**: Easy to mock and test components

## 🔄 Migration from EnterpriseAuthExample

The original `EnterpriseAuthExample.tsx` has been refactored to use these reusable components:

### Before (Monolithic)
```tsx
// All functionality in one large component
const EnterpriseAuthExample = () => {
  // 400+ lines of mixed concerns
  // Inline components
  // Hard to reuse
  // Difficult to maintain
};
```

### After (Composable)
```tsx
// Clean composition of reusable components
import { 
  LoadingSpinner,
  ErrorMessage,
  TwoFactorAuth,
  AuthStatus,
  SecurityStatus,
  AuthenticatedActions,
  MigrationInfo
} from '@shared/ui/components';

const EnterpriseAuthExampleRefactored = () => {
  // Clean separation of concerns
  // Reusable components
  // Easy to maintain
  // Consistent behavior
};
```

## 📦 Usage Examples

### Complete Authentication Flow
```tsx
import React from 'react';
import { 
  AuthStatus,
  SecurityStatus,
  TwoFactorAuth,
  AuthenticatedActions,
  LoadingSpinner,
  ErrorMessage
} from '@shared/ui/components';

const AuthenticationFlow = () => {
  return (
    <div>
      {/* Status Display */}
      <AuthStatus
        isAuthenticated={isAuthenticated}
        user={user}
        variant="default"
      />
      
      {/* Security Information */}
      <SecurityStatus
        requiresTwoFactor={requires2FA}
        deviceTrusted={deviceTrusted}
        sessionExpiry={sessionExpiry}
        onTrustDevice={handleTrustDevice}
      />
      
      {/* 2FA Verification */}
      {requires2FA && (
        <TwoFactorAuth
          onVerify={handle2FAVerify}
          isLoading={isLoading}
        />
      )}
      
      {/* User Actions */}
      {isAuthenticated && (
        <AuthenticatedActions
          onRefreshToken={refreshToken}
          onLogout={logout}
        />
      )}
      
      {/* Loading and Error States */}
      {isLoading && <LoadingSpinner />}
      {error && (
        <ErrorMessage
          error={error}
          onRetry={retry}
          onClear={clearError}
        />
      )}
    </div>
  );
};
```

## 🎨 Customization

### Theme Integration
All components integrate with the enterprise theme system:

```tsx
// Components automatically use theme colors
<LoadingSpinner color="primary" /> // Uses theme.primary.color
<ErrorMessage variant="default" /> // Uses theme.error colors
```

### Styling Overrides
Components accept className props for custom styling:

```tsx
<SecurityStatus 
  className="custom-security-status"
  variant="compact"
/>
```

### Custom Variants
Components support multiple display variants:

```tsx
<AuthStatus variant="compact" />    // Minimal display
<AuthStatus variant="detailed" />   // Full information
<AuthStatus variant="default" />    // Standard display
```

## 🧪 Testing

### Component Testing
Each component is designed for easy testing:

```tsx
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@shared/ui/components';

test('renders loading spinner', () => {
  render(<LoadingSpinner />);
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});
```

### Mock Implementations
Components provide clear interfaces for mocking:

```tsx
const mockAuthStatus = {
  isAuthenticated: true,
  user: mockUser,
  onTrustDevice: jest.fn()
};

render(<SecurityStatus {...mockAuthStatus} />);
```

## 📚 API Reference

### Common Props
All components extend `IBaseComponentProps`:
- `className?: string` - Custom CSS classes
- `testId?: string` - Test identifier
- `children?: ReactNode` - Child elements

### Component-Specific Props
Each component has its own interface documented in the source files with comprehensive JSDoc comments.

## 🚀 Future Enhancements

### Planned Components
- `PasswordStrength` - Password strength indicator
- `SocialLogin` - Social media login buttons
- `BiometricAuth` - Biometric authentication
- `SessionManager` - Advanced session management

### Feature Roadmap
- Enhanced accessibility features
- Internationalization support
- Advanced animations
- Mobile-optimized variants

## 📞 Support

For questions, issues, or contributions:
- Check component JSDoc comments
- Review TypeScript interfaces
- Examine existing usage examples
- Contact the UI team

---

**Last Updated**: February 1, 2026  
**Components**: 6 reusable authentication components  
**Architecture**: Enterprise BaseClassComponent pattern  
**Type Safety**: 100% TypeScript coverage
