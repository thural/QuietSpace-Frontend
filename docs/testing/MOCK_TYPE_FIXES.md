# TypeScript Mock Type Fixes for Authentication Tests

## Problem
All mock assertions in the test file use `jest.Mock` which loses type information, causing "Argument of type 'X' is not assignable to parameter of type 'never'" errors.

## Solution Patterns

### 1. Auth Validator Mocks
```typescript
// BEFORE (❌ Causes errors)
(authValidator.validateCredentialsAsync as jest.Mock).mockResolvedValue(validationResult);

// AFTER (✅ Properly typed)
(authValidator.validateCredentialsAsync as jest.MockedFunction<(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>>).mockResolvedValue(validationResult);
```

### 2. Provider Mocks
```typescript
// BEFORE (❌ Causes errors)
(oauthProvider.authenticate as jest.Mock).mockResolvedValue(authResult);

// AFTER (✅ Properly typed)
(oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockResolvedValue(authResult);
```

### 3. Health Check Mocks
```typescript
// BEFORE (❌ Causes errors)
(oauthProvider.healthCheck as jest.Mock).mockResolvedValue({
    healthy: false,
    timestamp: new Date(),
    responseTime: 100,
    message: 'OAuth provider down'
});

// AFTER (✅ Properly typed)
(oauthProvider.healthCheck as jest.MockedFunction<() => Promise<ProviderHealthStatus>>).mockResolvedValue({
    healthy: false,
    timestamp: new Date(),
    responseTime: 100,
    message: 'OAuth provider down'
});
```

### 4. Error Mocks
```typescript
// BEFORE (❌ Causes errors)
(oauthProvider.authenticate as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

// AFTER (✅ Properly typed)
(oauthProvider.authenticate as jest.MockedFunction<(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>>).mockRejectedValue(new Error('Invalid credentials'));
```

## Required Changes

All mock assertions need to be updated with proper type signatures. The specific types are:

1. **validateCredentialsAsync**: `(credentials: AuthCredentials, context?: SecurityContext, options?: AsyncValidationOptions) => Promise<ValidationResult>`
2. **authenticate**: `(credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>`
3. **validateSession**: `() => Promise<AuthResult<AuthSession>>`
4. **refreshToken**: `() => Promise<AuthResult<AuthSession>>`
5. **healthCheck**: `() => Promise<ProviderHealthStatus>`
6. **shutdown**: `() => Promise<void>`

## Implementation

Replace every instance of `as jest.Mock` with the appropriate `jest.MockedFunction<Signature>` based on the method being mocked.

This will resolve all TypeScript compilation errors and provide proper type safety for your test mocks.
