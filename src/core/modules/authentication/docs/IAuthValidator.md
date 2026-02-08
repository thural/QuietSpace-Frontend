# IAuthValidator API Documentation

## Overview

The `IAuthValidator` interface provides comprehensive validation capabilities for authentication-related data including credentials, tokens, users, and security contexts. It supports both synchronous and asynchronous validation with advanced rule composition and batch processing capabilities.

## Interface Definition

```typescript
interface IAuthValidator {
    // Properties
    readonly name: string;
    readonly version: string;
    readonly rules: Record<string, ValidationRule>;

    // Enhanced Async Validation Methods
    validateCredentialsAsync(credentials: AuthCredentials, context?: SecurityContext): Promise<ValidationResult>;
    validateTokenAsync(token: AuthToken, context?: SecurityContext): Promise<ValidationResult>;
    validateUserAsync(user: AuthUser, context?: SecurityContext): Promise<ValidationResult>;
    validateBatch(items: ValidationItem[], context?: SecurityContext): Promise<ValidationResult[]>;
    validateWithRuleGroup(data: any, groupName: string, context?: SecurityContext): Promise<ValidationResult>;
    validateWithRule(data: any, ruleName: string, context?: SecurityContext): Promise<ValidationResult>;

    // Rule Management
    addValidationRule(rule: ValidationRule): void;
    addRule(name: string, rule: ValidationRule): void;
    removeRule(name: string): boolean;
    getRule(name: string): ValidationRule | undefined;
    listRules(): string[];
    createRuleGroup(name: string, ruleNames: string[]): void;
    removeRuleGroup(name: string): boolean;
    getRuleGroup(name: string): ValidationRule[] | undefined;
    listRuleGroups(): string[];

    // Rule Control
    setRuleEnabled(name: string, enabled: boolean): boolean;
    isRuleEnabled(name: string): boolean;
    setRulePriority(name: string, priority: number): boolean;
    getRulePriority(name: string): number | undefined;

    // Legacy Sync Methods (for backward compatibility)
    validateCredentials(credentials: AuthCredentials): ValidationResult;
    validateToken(token: AuthToken): ValidationResult;
    validateUser(user: AuthUser): ValidationResult;
    validateAuthEvent(event: AuthEvent): ValidationResult;
    validateSecurityContext(context: SecurityContext): ValidationResult;

    // Statistics
    getStatistics(): ValidatorStatistics;
    resetStatistics(): void;

    // Enhanced Async Methods
    validateSecurityContextAsync(context: SecurityContext): Promise<ValidationResult>;
    validateAuthEventAsync(event: AuthEvent, context?: SecurityContext): Promise<ValidationResult>;
}
```

## Enhanced Async Validation Methods

### `validateCredentialsAsync(credentials, context?)`

Asynchronously validates authentication credentials with optional security context.

**Parameters:**
- `credentials: AuthCredentials` - The credentials to validate
- `context?: SecurityContext` - Optional security context for enhanced validation

**Returns:**
- `Promise<ValidationResult>` - Validation result with detailed information

**Example:**
```typescript
const credentials = { username: 'user@example.com', password: 'securePassword' };
const context = {
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date(),
    metadata: { source: 'web' }
};

const result = await validator.validateCredentialsAsync(credentials, context);

if (result.isValid) {
    console.log('Credentials are valid');
} else {
    console.error('Validation failed:', result.errors);
    console.warn('Warnings:', result.warnings);
}
```

### `validateTokenAsync(token, context?)`

Asynchronously validates an authentication token.

**Parameters:**
- `token: AuthToken` - The token to validate
- `context?: SecurityContext` - Optional security context

**Returns:**
- `Promise<ValidationResult>` - Token validation result

**Example:**
```typescript
const token = {
    accessToken: 'eyJhbGciOiJIUzI1NiIs...',
    refreshToken: 'refresh-token',
    expiresAt: new Date(Date.now() + 3600000)
};

const result = await validator.validateTokenAsync(token);

if (result.isValid) {
    console.log('Token is valid and not expired');
} else {
    console.error('Token validation failed:', result.errors);
}
```

### `validateUserAsync(user, context?)`

Asynchronously validates user data.

**Parameters:**
- `user: AuthUser` - The user data to validate
- `context?: SecurityContext` - Optional security context

**Returns:**
- `Promise<ValidationResult>` - User validation result

**Example:**
```typescript
const user = {
    id: 'user-123',
    email: 'user@example.com',
    roles: ['user', 'admin'],
    permissions: ['read', 'write']
};

const result = await validator.validateUserAsync(user);

if (result.isValid) {
    console.log('User data is valid');
} else {
    console.error('User validation failed:', result.errors);
}
```

### `validateBatch(items, context?)`

Validates multiple items in batch for improved performance.

**Parameters:**
- `items: ValidationItem[]` - Array of items to validate
- `context?: SecurityContext` - Optional security context

**Returns:**
- `Promise<ValidationResult[]>` - Array of validation results

**Example:**
```typescript
const items = [
    { type: 'credentials', data: credentials },
    { type: 'token', data: token },
    { type: 'user', data: user }
];

const results = await validator.validateBatch(items);

results.forEach((result, index) => {
    console.log(`Item ${index}: ${result.isValid ? 'Valid' : 'Invalid'}`);
    if (!result.isValid) {
        console.error('Errors:', result.errors);
    }
});
```

### `validateWithRuleGroup(data, groupName, context?)`

Validates data using a specific rule group.

**Parameters:**
- `data: any` - The data to validate
- `groupName: string` - The name of the rule group to use
- `context?: SecurityContext` - Optional security context

**Returns:**
- `Promise<ValidationResult>` - Validation result

**Example:**
```typescript
// Create a rule group first
validator.createRuleGroup('user-registration', ['email-format', 'password-strength', 'username-unique']);

// Validate using the rule group
const userData = {
    email: 'newuser@example.com',
    password: 'SecurePass123!',
    username: 'newuser'
};

const result = await validator.validateWithRuleGroup(userData, 'user-registration');

if (result.isValid) {
    console.log('User registration data is valid');
} else {
    console.error('Registration validation failed:', result.errors);
}
```

### `validateWithRule(data, ruleName, context?)`

Validates data using a specific rule.

**Parameters:**
- `data: any` - The data to validate
- `ruleName: string` - The name of the rule to use
- `context?: SecurityContext` - Optional security context

**Returns:**
- `Promise<ValidationResult>` - Validation result

**Example:**
```typescript
const password = 'SecurePass123!';
const result = await validator.validateWithRule(password, 'password-strength');

if (result.isValid) {
    console.log('Password meets strength requirements');
} else {
    console.error('Password validation failed:', result.errors);
}
```

## Rule Management

### `addValidationRule(rule)`

Adds a validation rule to the validator.

**Parameters:**
- `rule: ValidationRule` - The validation rule to add

**Example:**
```typescript
const emailRule: ValidationRule = {
    name: 'email-format',
    description: 'Validates email format',
    validator: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    errorMessage: 'Invalid email format',
    priority: 1,
    enabled: true
};

validator.addValidationRule(emailRule);
```

### `addRule(name, rule)`

Adds a named validation rule.

**Parameters:**
- `name: string` - The rule name
- `rule: ValidationRule` - The validation rule

**Example:**
```typescript
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
```

### `removeRule(name)`

Removes a validation rule.

**Parameters:**
- `name: string` - The rule name to remove

**Returns:**
- `boolean` - True if rule was removed successfully

**Example:**
```typescript
const removed = validator.removeRule('old-rule');
if (removed) {
    console.log('Rule removed successfully');
}
```

### `getRule(name)`

Gets a validation rule by name.

**Parameters:**
- `name: string` - The rule name

**Returns:**
- `ValidationRule | undefined` - The rule or undefined if not found

**Example:**
```typescript
const rule = validator.getRule('email-format');
if (rule) {
    console.log('Rule description:', rule.description);
    console.log('Rule priority:', rule.priority);
}
```

### `listRules()`

Lists all registered rule names.

**Returns:**
- `string[]` - Array of rule names

**Example:**
```typescript
const rules = validator.listRules();
console.log('Available rules:', rules);
// Output: ['email-format', 'password-strength', 'username-unique', ...]
```

## Rule Group Management

### `createRuleGroup(name, ruleNames)`

Creates a rule group containing multiple rules.

**Parameters:**
- `name: string` - The group name
- `ruleNames: string[]` - Array of rule names to include in the group

**Example:**
```typescript
validator.createRuleGroup('user-registration', [
    'email-format',
    'password-strength',
    'username-unique',
    'terms-accepted'
]);
```

### `removeRuleGroup(name)`

Removes a rule group.

**Parameters:**
- `name: string` - The group name to remove

**Returns:**
- `boolean` - True if group was removed successfully

**Example:**
```typescript
const removed = validator.removeRuleGroup('user-registration');
if (removed) {
    console.log('Rule group removed');
}
```

### `getRuleGroup(name)`

Gets a rule group by name.

**Parameters:**
- `name: string` - The group name

**Returns:**
- `ValidationRule[] | undefined` - Array of rules in the group

**Example:**
```typescript
const rules = validator.getRuleGroup('user-registration');
if (rules) {
    console.log(`Group contains ${rules.length} rules`);
}
```

### `listRuleGroups()`

Lists all rule group names.

**Returns:**
- `string[]` - Array of rule group names

**Example:**
```typescript
const groups = validator.listRuleGroups();
console.log('Available rule groups:', groups);
```

## Rule Control

### `setRuleEnabled(name, enabled)`

Enables or disables a rule.

**Parameters:**
- `name: string` - The rule name
- `enabled: boolean` - Whether to enable the rule

**Returns:**
- `boolean` - True if operation was successful

**Example:**
```typescript
// Temporarily disable a rule
validator.setRuleEnabled('strict-validation', false);

// Re-enable it later
validator.setRuleEnabled('strict-validation', true);
```

### `isRuleEnabled(name)`

Checks if a rule is enabled.

**Parameters:**
- `name: string` - The rule name

**Returns:**
- `boolean` - True if rule is enabled

**Example:**
```typescript
if (validator.isRuleEnabled('password-strength')) {
    console.log('Password strength validation is active');
}
```

### `setRulePriority(name, priority)`

Sets the priority of a rule.

**Parameters:**
- `name: string` - The rule name
- `priority: number` - The priority level (lower numbers = higher priority)

**Returns:**
- `boolean` - True if operation was successful

**Example:**
```typescript
validator.setRulePriority('critical-security-rule', 1);
validator.setRulePriority('nice-to-have-rule', 10);
```

### `getRulePriority(name)`

Gets the priority of a rule.

**Parameters:**
- `name: string` - The rule name

**Returns:**
- `number | undefined` - The priority level

**Example:**
```typescript
const priority = validator.getRulePriority('email-format');
console.log('Rule priority:', priority);
```

## Legacy Synchronous Methods

### `validateCredentials(credentials)`

Synchronous credential validation (legacy method).

**Parameters:**
- `credentials: AuthCredentials` - The credentials to validate

**Returns:**
- `ValidationResult` - Validation result

**Example:**
```typescript
const result = validator.validateCredentials(credentials);
if (result.isValid) {
    console.log('Credentials are valid');
}
```

## Statistics

### `getStatistics()`

Gets validation statistics.

**Returns:**
- `ValidatorStatistics` - Comprehensive validation statistics

**Example:**
```typescript
const stats = validator.getStatistics();
console.log('Total validations:', stats.totalValidations);
console.log('Success rate:', stats.successRate);
console.log('Average validation time:', stats.averageValidationTime);
console.log('Most used rule:', stats.mostUsedRule);
```

### `resetStatistics()`

Resets all validation statistics.

**Example:**
```typescript
validator.resetStatistics();
console.log('Statistics reset');
```

## Properties

### `name` (readonly)
The name of the validator instance.

**Type:** `string`

### `version` (readonly)
The version of the validator.

**Type:** `string`

### `rules` (readonly)
All registered validation rules.

**Type:** `Record<string, ValidationRule>`

## Usage Patterns

### Basic Validation Flow
```typescript
// 1. Add custom rules
validator.addRule('custom-rule', {
    name: 'custom-rule',
    description: 'Custom business logic validation',
    validator: (data: any) => {
        // Custom validation logic
        return data.someProperty === 'expected-value';
    },
    errorMessage: 'Custom validation failed',
    priority: 5,
    enabled: true
});

// 2. Validate data
const result = await validator.validateCredentialsAsync(credentials, context);

// 3. Handle results
if (result.isValid) {
    console.log('Validation passed');
} else {
    console.error('Validation failed:', result.errors);
    
    // Provide suggestions to user
    if (result.suggestions.length > 0) {
        console.log('Suggestions:', result.suggestions);
    }
}
```

### Batch Validation for Performance
```typescript
const validateMultipleUsers = async (users: AuthUser[]) => {
    const items = users.map(user => ({
        type: 'user' as const,
        data: user
    }));
    
    const results = await validator.validateBatch(items);
    
    const validUsers = [];
    const invalidUsers = [];
    
    results.forEach((result, index) => {
        if (result.isValid) {
            validUsers.push(users[index]);
        } else {
            invalidUsers.push({
                user: users[index],
                errors: result.errors
            });
        }
    });
    
    return { validUsers, invalidUsers };
};
```

### Rule Group for Complex Validation
```typescript
// Setup validation rule groups for different scenarios
validator.createRuleGroup('user-login', [
    'email-format',
    'account-active',
    'no-security-flags'
]);

validator.createRuleGroup('user-registration', [
    'email-format',
    'password-strength',
    'username-unique',
    'terms-accepted'
]);

validator.createRuleGroup('admin-actions', [
    'admin-permissions',
    'session-valid',
    'ip-whitelisted'
]);

// Use appropriate rule group
const validateLogin = async (credentials: AuthCredentials) => {
    return await validator.validateWithRuleGroup(credentials, 'user-login');
};
```

## Error Handling

### ValidationResult Structure
```typescript
interface ValidationResult {
    isValid: boolean;
    errors?: ValidationError[];
    warnings?: ValidationWarning[];
    suggestions?: string[];
    metadata: {
        duration: number;
        rulesApplied: string[];
        timestamp: Date;
        async: boolean;
        parallel: boolean;
        retryCount: number;
    };
}
```

### Error Handling Pattern
```typescript
const result = await validator.validateCredentialsAsync(credentials);

if (!result.isValid) {
    // Handle validation errors
    result.errors?.forEach(error => {
        switch (error.type) {
            case 'validation_error':
                console.error('Validation error:', error.message);
                break;
            case 'security_error':
                console.error('Security issue detected:', error.message);
                // Trigger security alert
                break;
            case 'business_rule_error':
                console.error('Business rule violation:', error.message);
                break;
        }
        
        // Log error details
        console.log('Rule:', error.rule);
        console.log('Severity:', error.severity);
        console.log('Timestamp:', error.timestamp);
    });
    
    // Provide user feedback
    if (result.suggestions) {
        console.log('Suggestions to fix:', result.suggestions);
    }
}
```

## Best Practices

1. **Use async methods** for better performance with complex validations
2. **Create rule groups** for common validation scenarios
3. **Set appropriate priorities** for rules to control execution order
4. **Monitor statistics** to identify performance bottlenecks
5. **Handle errors gracefully** with user-friendly messages
6. **Use batch validation** for multiple items to improve performance
7. **Provide suggestions** to help users fix validation issues
8. **Log security-related validation failures** for monitoring

## Performance Considerations

### Async vs Sync
```typescript
// Use async for complex validations
const asyncResult = await validator.validateCredentialsAsync(credentials, context);

// Use sync for simple validations (legacy support)
const syncResult = validator.validateCredentials(credentials);
```

### Batch Processing
```typescript
// Batch validation is more efficient for multiple items
const batchResults = await validator.validateBatch(items);

// Individual validation for single items
const individualResult = await validator.validateCredentialsAsync(credentials);
```

### Rule Priority
```typescript
// Set lower numbers for higher priority rules
validator.setRulePriority('critical-security', 1);
validator.setRulePriority('business-logic', 5);
validator.setRulePriority('nice-to-have', 10);
```

## Migration from Legacy Validation

If you're migrating from legacy validation systems:

```typescript
// Old way - simple validation
const isValid = validateEmail(email);

// New way - comprehensive validation
const result = await validator.validateWithRule(email, 'email-format');
if (!result.isValid) {
    console.error('Validation failed:', result.errors);
    console.log('Suggestions:', result.suggestions);
}

// Additional benefits: rule management, statistics, batch processing
const stats = validator.getStatistics();
const batchResults = await validator.validateBatch(items);
```

The enhanced validation system provides enterprise-grade features including rule composition, batch processing, detailed error reporting, and comprehensive statistics tracking.
