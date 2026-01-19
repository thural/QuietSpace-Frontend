# API Security Migration Guide

## Overview
This guide shows how to migrate existing fetch-based API calls to use the secure axios client with automatic token management and refresh.

## Migration Options

### Option 1: Drop-in Replacement (Recommended)
Replace `getWrappedApiResponse` with `getWrappedSecureApiResponse`:

```typescript
// Before
import { getWrappedApiResponse } from "./fetchApiUtils";

export const fetchLogin = async (body: AuthRequest): Promise<AuthResponse> => (
    await getWrappedApiResponse(LOGIN_URL, 'POST', body, null)
).json();

// After
import { getWrappedSecureApiResponse } from "./secureApiUtils";

export const fetchLogin = async (body: AuthRequest): Promise<AuthResponse> => (
    await getWrappedSecureApiResponse(LOGIN_URL, 'POST', body, null)
).json();
```

### Option 2: Direct Axios Usage (For New APIs)
Use the secure axios client directly:

```typescript
import { secureApi } from "./secureApiUtils";

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
    const { data } = await secureApi.get(`/users/${userId}`);
    return data;
};

export const updateProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await secureApi.put(`/users/${userId}`, profileData);
    return data;
};
```

## Benefits of Migration

### ✅ Automatic Token Management
- No need to manually pass tokens
- Automatic token injection in all requests
- Token refresh handled automatically

### ✅ Enhanced Error Handling
- Automatic retry on 401 errors
- Graceful logout on refresh failure
- Better error logging and debugging

### ✅ Performance Monitoring
- Request/response timing
- Request logging for debugging
- Performance metrics

### ✅ Type Safety
- Full TypeScript support
- Better error types
- Improved IDE support

## Security Features

### 🛡️ Automatic Token Refresh
- Tokens are automatically refreshed when expired
- Original requests are retried with new tokens
- Seamless user experience

### 🔐 Request Interception
- All requests are automatically authenticated
- Tokens are injected from global store
- Consistent security across all API calls

### 🚨 Error Handling
- 401 errors trigger automatic token refresh
- 403 errors log access violations
- 500 errors log server issues

## Implementation Steps

1. **Import the secure API utilities**
   ```typescript
   import { getWrappedSecureApiResponse, secureApi } from "./secureApiUtils";
   ```

2. **Replace existing API calls**
   - Find all uses of `getWrappedApiResponse`
   - Replace with `getWrappedSecureApiResponse`
   - Test functionality

3. **Update new API endpoints**
   - Use `secureApi` methods for new endpoints
   - Leverage automatic token management
   - Add proper error handling

4. **Remove manual token handling**
   - Remove manual token passing
   - Remove manual refresh logic
   - Simplify API code

## Example Migration

### Before (Manual Token Management)
```typescript
export const fetchUserData = async (token: string): Promise<UserData> => {
    try {
        const response = await getWrappedApiResponse('/api/user', 'GET', null, token);
        return response.json();
    } catch (error) {
        if (error.status === 401) {
            // Handle token refresh manually
            await refreshToken();
            return fetchUserData(newToken);
        }
        throw error;
    }
};
```

### After (Automatic Security)
```typescript
export const fetchUserData = async (): Promise<UserData> => {
    const response = await secureApi.get('/api/user');
    return response.data;
};
```

## Testing

After migration, test:
1. Authentication flows work correctly
2. Token refresh happens automatically
3. Error handling is improved
4. Performance is maintained

## Notes

- The secure API client maintains compatibility with existing fetch-based code
- No breaking changes to existing API interfaces
- Gradual migration is possible
- All security features work automatically
