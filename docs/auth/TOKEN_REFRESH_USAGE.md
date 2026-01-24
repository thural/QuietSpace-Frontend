# Token Refresh Manager Usage Guide

This document explains the two different token refresh approaches available in the QuietSpace frontend and when to use each one.

## Two Approaches

### 1. Static TokenRefreshManager (Current Production)
**Location**: `src/core/auth/tokenRefreshManager.ts`

**Usage**:
```typescript
import TokenRefreshManager from '@core/auth/tokenRefreshManager';

// Start refresh
await TokenRefreshManager.startRefresh({
  interval: 490000,
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

// Stop refresh
TokenRefreshManager.stopRefresh();
```

**When to use**:
- Main application authentication
- Global token management
- When you need a singleton pattern
- Production code

### 2. Factory-based createTokenRefreshManager (Alternative)
**Location**: `src/shared/utils/jwtAuthUtils.ts`

**Usage**:
```typescript
import { createTokenRefreshManager } from '@/shared/utils/jwtAuthUtils';
import { useTokenRefresh } from '@/shared/hooks/useTokenRefresh';

// Using the hook (recommended)
const { startTokenRefresh, stopTokenRefresh, isActive } = useTokenRefresh({
  autoStart: true,
  refreshInterval: 540000,
  onSuccess: (data) => { /* handle success */ },
  onError: (error) => { /* handle error */ }
});

// Using directly
const manager = createTokenRefreshManager();
await manager.startTokenAutoRefresh({
  refreshInterval: 540000,
  onSuccessFn: (data) => { /* handle success */ },
  onErrorFn: (error) => { /* handle error */ }
});
manager.stopTokenAutoRefresh();
```

**When to use**:
- Multiple independent token refresh instances
- Component-level token management
- Testing scenarios (easy to mock/create instances)
- When you need more granular control
- Development/experimental features

## Key Differences

| Feature | Static TokenRefreshManager | Factory createTokenRefreshManager |
|---------|---------------------------|-----------------------------------|
| Pattern | Singleton | Factory (creates instances) |
| State | Global shared state | Instance-specific state |
| Testing | Harder to mock/test | Easy to create test instances |
| Use Cases | Global app auth | Component-level auth |
| Memory | Single instance | Multiple instances possible |

## Implementation Examples

### Component with Token Refresh
```typescript
import { useTokenRefresh } from '@/shared/hooks/useTokenRefresh';

const MySecureComponent = () => {
  const { isActive } = useTokenRefresh({
    autoStart: true,
    onSuccess: (data) => updateAuthToken(data),
    onError: (error) => handleAuthError(error)
  });

  return <div>Auth Status: {isActive ? 'Refreshing' : 'Inactive'}</div>;
};
```

### Provider Pattern
```typescript
import { TokenRefreshProvider } from '@/shared/components/TokenRefreshProvider';

const App = () => {
  return (
    <TokenRefreshProvider
      enabled={true}
      refreshInterval={540000}
      onTokenRefresh={handleTokenRefresh}
      onRefreshError={handleRefreshError}
    >
      <YourAppComponents />
    </TokenRefreshProvider>
  );
};
```

## Migration Considerations

If you're currently using the static TokenRefreshManager and want to switch to the factory-based approach:

1. **Identify usage patterns** - Check if you need global or instance-level management
2. **Update imports** - Replace static imports with factory imports
3. **Handle state management** - Factory approach requires manual state tracking
4. **Testing** - Factory approach is easier to test with mock instances

## Best Practices

1. **Use static TokenRefreshManager** for main app authentication
2. **Use factory createTokenRefreshManager** for:
   - Feature-specific token management
   - Testing environments
   - When you need multiple independent refresh cycles
3. **Always clean up** token refresh on component unmount
4. **Handle errors appropriately** to prevent infinite refresh loops
5. **Use appropriate intervals** (recommended: 9 minutes or less)

## Files Created

- `src/shared/hooks/useTokenRefresh.ts` - React hook for factory-based token refresh
- `src/shared/components/TokenRefreshProvider.tsx` - Provider component for token refresh
- `src/shared/components/TokenRefreshExample.tsx` - Example usage component
