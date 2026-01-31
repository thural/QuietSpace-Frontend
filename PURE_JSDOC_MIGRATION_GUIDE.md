# Pure JSDoc Migration Guide - 2026

## 🎯 **Overview**

**Strategy**: Pure JSDoc + No TypeScript Dependency  
**Updated**: January 31, 2026  
**Approach**: Classic JSDoc + eslint-plugin-jsdoc enforcement  
**Benefits**: Zero TypeScript dependency, maximum editor compatibility, minimal runtime impact

This guide provides a complete migration strategy from TypeScript to pure JavaScript using JSDoc annotations, focusing on simplicity, maintainability, and broad editor compatibility.

---

## 🚀 **WHY PURE JSDOC?**

### **Key Benefits**
- ✅ **Zero TypeScript dependency** - No typescript packages needed
- ✅ **Maximum editor compatibility** - Works in VS Code, WebStorm, IntelliJ, etc.
- ✅ **Minimal runtime impact** - JSDoc comments are stripped by bundlers
- ✅ **Simple tooling** - Only ESLint + eslint-plugin-jsdoc required
- ✅ **Fast development** - No compilation step needed
- ✅ **Easy onboarding** - Gentle learning curve

### **When to Choose Pure JSDoc**
- Team size ≤ 10 developers
- Project complexity is simple to moderate
- Timeline is tight
- Basic type safety is sufficient
- Minimal tooling preferred

---

## 📋 **CORE JSDOC STYLE**

### **Essential Tags Only**
Stick to the most widely supported JSDoc tags:

```javascript
@param {type} name [description]    // Function parameters
@returns {type} [description]       // Return values
@type {type}                        // Variables/expressions
@typedef {Object} TypeName          // Type definitions
@property {type} name [description] // Object properties
```

### **Preferred Style - Minimal & Readable**

```javascript
/**
 * Adds two numbers.
 *
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}

/** @type {string} */
let username = "alice";

/**
 * User shape
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} name - User name
 * @property {number} [age] - Optional age
 */

/**
 * Creates a greeting for a user
 * @param {User} user - User object
 * @returns {string} Greeting message
 */
function greet(user) {
  return `Hello ${user.name}`;
}
```

---

## 🔧 **SETUP & CONFIGURATION**

### **Step 1: Install Dependencies**
```bash
npm install --save-dev eslint eslint-plugin-jsdoc
```

### **Step 2: Create ESLint Configuration**
Create `eslint.config.mjs`:

```javascript
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  {
    files: ["**/*.{js,jsx}"],
    plugins: { jsdoc },
    rules: {
      // Enforce JSDoc on public API
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            "PropertyDefinition",     // class fields
            "ExportNamedDeclaration", // exported functions
            "VariableDeclarator > Identifier[name=/^[A-Z]/]", // PascalCase variables
          ],
        },
      ],

      // Require types everywhere possible
      "jsdoc/require-param-type": "error",
      "jsdoc/require-returns-type": "error",
      "jsdoc/require-property-type": "error",

      // Basic validity & hygiene
      "jsdoc/check-types": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-property-names": "error",
      "jsdoc/no-undefined-types": "warn",

      // Encourage good descriptions
      "jsdoc/require-description": "error",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-returns-description": "warn",
      "jsdoc/require-property-description": "warn",

      // Formatting
      "jsdoc/check-alignment": "error",
      "jsdoc/check-line-alignment": "warn",
    },
  },
];
```

### **Step 3: Add Package.json Scripts**
```json
{
  "scripts": {
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "lint:jsdoc": "eslint . --ext .js --rule 'jsdoc/*'"
  }
}
```

---

## 🔄 **MIGRATION PATTERNS**

### **1. TypeScript Interfaces → JSDoc Typedefs**

**Before (TypeScript):**
```typescript
interface User {
  id: string;
  name: string;
  age?: number;
  createdAt: Date;
}
```

**After (JSDoc):**
```javascript
/**
 * User account information
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} name - User name
 * @property {number} [age] - Optional age
 * @property {Date} createdAt - Account creation date
 */
```

### **2. TypeScript Enums → Frozen Objects**

**Before (TypeScript):**
```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

**After (JSDoc):**
```javascript
/**
 * User role types
 * @readonly
 * @enum {string}
 */
export const UserRole = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
});
```

### **3. TypeScript Classes → JavaScript Classes with JSDoc**

**Before (TypeScript):**
```typescript
class AuthService {
  private users: User[] = [];
  
  public async authenticate(credentials: Credentials): Promise<AuthResult> {
    // implementation
  }
  
  private validateUser(user: User): boolean {
    // implementation
  }
}
```

**After (JSDoc):**
```javascript
/**
 * Authentication service
 * @class AuthService
 * @description Handles user authentication and authorization
 */
export class AuthService {
  /** @type {User[]} */
  #users = [];
  
  /**
   * Authenticates user with credentials
   * @param {Credentials} credentials - User credentials
   * @returns {Promise<AuthResult>} Authentication result
   */
  async authenticate(credentials) {
    // implementation
  }
  
  /**
   * Validates user data
   * @param {User} user - User to validate
   * @returns {boolean} True if valid
   */
  #validateUser(user) {
    // implementation
  }
}
```

### **4. TypeScript Functions → JavaScript Functions with JSDoc**

**Before (TypeScript):**
```typescript
function calculateTax(price: number, rate: number): number {
  return price * rate;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
```

**After (JSDoc):**
```javascript
/**
 * Calculates tax amount
 * @param {number} price - Base price
 * @param {number} rate - Tax rate (0-1)
 * @returns {number} Tax amount
 */
function calculateTax(price, rate) {
  return price * rate;
}

/**
 * Formats amount as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
```

### **5. Type Imports → JSDoc Typedef Imports**

**Before (TypeScript):**
```typescript
import { User, AuthResult } from './types';
import type { Credentials } from './auth';
```

**After (JSDoc):**
```javascript
import { User, AuthResult } from './types.js';

/**
 * @typedef {import('./auth.js').Credentials} Credentials
 */
```

---

## 🎯 **ADVANCED ESLINT CONFIGURATIONS**

### **Strict Mode (Recommended for Production)**

```javascript
rules: {
  // Disallow loose types
  "jsdoc/check-types": [
    "error",
    {
      preferredTypes: {
        any: false,          // disallow completely
        "*": false,
        Object: "Record<string, unknown>",
        object: "Record<string, unknown>",
        Function: "(...args: any[]) => any",
      },
    },
  ],

  // Ban dangerous patterns
  "jsdoc/no-restricted-syntax": [
    "error",
    {
      message: "Avoid 'any' – use more specific types or unknown",
      selector: "JsdocTypeAny",
    },
    {
      message: "Avoid wildcard '*' – prefer unknown or specific union",
      selector: "JsdocTypeWildcard",
    },
  ],

  // Require examples for complex functions
  "jsdoc/require-example": [
    "warn",
    {
      contexts: [
        "ExportNamedDeclaration > FunctionDeclaration",
        "ExportNamedDeclaration > VariableDeclarator > ArrowFunctionExpression",
      ],
    },
  ],
}
```

### **React-Specific Configuration**

```javascript
rules: {
  "jsdoc/require-jsdoc": [
    "error",
    {
      contexts: [
        "ExportNamedDeclaration",
        "VariableDeclarator > ArrowFunctionExpression", // const MyComponent = () => ...
        "PropertyDefinition[value.type=/FunctionExpression/]", // class methods
      ],
    },
  ],

  // React component specific
  "jsdoc/require-param": "error",
  "jsdoc/require-returns": ["error", { forceForClasses: true }], // for JSX.Element
}
```

---

## 📊 **QUALITY ASSURANCE**

### **Pre-Migration Checklist**
- [ ] Project has ESLint configured
- [ ] eslint-plugin-jsdoc installed
- [ ] Team trained on JSDoc patterns
- [ ] Migration strategy documented
- [ ] Test coverage is adequate

### **During Migration Checklist**
- [ ] All exported functions have JSDoc
- [ ] All parameters have `@param {type}` annotations
- [ ] All returns have `@returns {type}` annotations
- [ ] All class properties have `@type {type}` annotations
- [ ] No TypeScript-specific syntax in JSDoc
- [ ] ESLint passes with zero JSDoc errors

### **Post-Migration Checklist**
- [ ] All JSDoc comments have descriptions
- [ ] Parameter descriptions are meaningful
- [ ] Complex types have `@typedef` definitions
- [ ] Examples provided for complex functions
- [ ] Editor hover shows correct types
- [ ] Autocomplete works for documented properties

---

## 🎯 **BEST PRACTICES**

### **JSDoc Style Guidelines**

```javascript
// ✅ Good - Clear and descriptive
/**
 * Calculates the total price including tax and discounts.
 * 
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - Tax rate as decimal (0.1 = 10%)
 * @param {number} [discount] - Optional discount amount
 * @returns {number} Total price including tax and discounts
 * @example
 * const total = calculateTotal(100, 0.08, 10); // Returns 98
 */
function calculateTotal(basePrice, taxRate, discount = 0) {
  const subtotal = basePrice - discount;
  return subtotal * (1 + taxRate);
}

// ❌ Bad - Vague and incomplete
/**
 * Calculate total
 * @param {number} basePrice
 * @param {number} taxRate
 * @param {number} discount
 * @returns {number}
 */
function calculateTotal(basePrice, taxRate, discount) {
  return (basePrice - discount) * (1 + taxRate);
}
```

### **Type Definition Guidelines**

```javascript
// ✅ Good - Comprehensive and documented
/**
 * User account information
 * @typedef {Object} User
 * @property {string} id - Unique user identifier (UUID)
 * @property {string} email - User email address (validated)
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {number} [age] - User age (optional, 18-120)
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} [lastLogin] - Last successful login
 * @property {UserPreferences} preferences - User settings
 */

/**
 * User preferences and settings
 * @typedef {Object} UserPreferences
 * @property {string} theme - UI theme ('light' | 'dark')
 * @property {string[]} notifications - Enabled notification types
 * @property {boolean} emailNotifications - Email notification flag
 */

// ❌ Bad - Minimal and unclear
/**
 * User
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */
```

### **Error Handling Guidelines**

```javascript
// ✅ Good - Document error cases
/**
 * Fetches user data from API
 * 
 * @param {string} userId - User identifier
 * @returns {Promise<User>} User data
 * @throws {Error} When user is not found
 * @throws {NetworkError} When API request fails
 * @throws {ValidationError} When userId is invalid
 * @example
 * try {
 *   const user = await fetchUser('123-456');
 *   console.log(user.name);
 * } catch (error) {
 *   console.error('Failed to fetch user:', error.message);
 * }
 */
async function fetchUser(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new ValidationError('Invalid user ID');
  }
  
  const response = await api.get(`/users/${userId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`User ${userId} not found`);
    }
    throw new NetworkError(`API request failed: ${response.status}`);
  }
  return response.json();
}
```

---

## 🔄 **MIGRATION TIMELINE**

### **Small Project (≤ 50 files)**
- **Week 1**: Setup Pure JSDoc infrastructure
- **Week 2**: Migrate core types and utilities
- **Week 3**: Migrate main business logic
- **Week 4**: Testing and refinement

### **Medium Project (50-200 files)**
- **Week 1-2**: Setup infrastructure and migrate core types
- **Week 3-4**: Migrate services and utilities
- **Week 5-6**: Migrate UI components and features
- **Week 7-8**: Testing, documentation, and optimization

### **Large Project (200+ files)**
- **Month 1**: Setup infrastructure and pilot migration
- **Month 2-3**: Gradual migration by modules
- **Month 4**: Integration testing and cleanup
- **Month 5**: Documentation and team training

---

## 🚀 **IMPLEMENTATION EXAMPLES**

### **Complete Module Example**

**File: `user.types.js`**
```javascript
/**
 * User-related type definitions
 * @module user.types
 */

/**
 * User account information
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {number} [age] - Optional user age
 * @property {Date} createdAt - Account creation date
 * @property {Date} [lastLogin] - Last login timestamp
 */

/**
 * User creation data
 * @typedef {Object} CreateUserRequest
 * @property {string} email - User email
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} password - Password
 * @property {number} [age] - Optional age
 */

/**
 * User authentication result
 * @typedef {Object} AuthResult
 * @property {boolean} success - Authentication success
 * @property {User} [user] - User data (if successful)
 * @property {string} [token] - Authentication token
 * @property {string} [error] - Error message (if failed)
 */

/**
 * User role enumeration
 * @readonly
 * @enum {string}
 */
export const UserRole = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
});
```

**File: `user.service.js`**
```javascript
/**
 * User service for managing user accounts
 * @class UserService
 * @description Handles user CRUD operations and authentication
 */

/**
 * @typedef {import('./user.types.js').User} User
 * @typedef {import('./user.types.js').CreateUserRequest} CreateUserRequest
 * @typedef {import('./user.types.js').AuthResult} AuthResult
 * @typedef {import('./user.types.js').UserRole} UserRole
 */

export class UserService {
  /** @type {User[]} */
  #users = [];

  /**
   * Creates a new user account
   * @param {CreateUserRequest} userData - User creation data
   * @returns {Promise<User>} Created user
   * @throws {ValidationError} When user data is invalid
   * @example
   * const user = await userService.createUser({
   *   email: 'john@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   password: 'secure123'
   * });
   */
  async createUser(userData) {
    // Validate input
    this.#validateUserData(userData);
    
    // Check if user already exists
    if (this.#users.some(user => user.email === userData.email)) {
      throw new ValidationError('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: this.#generateId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      age: userData.age,
      createdAt: new Date()
    };
    
    this.#users.push(newUser);
    return newUser;
  }

  /**
   * Authenticates a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<AuthResult>} Authentication result
   */
  async authenticate(email, password) {
    const user = this.#users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    // In real implementation, verify password hash
    const isValid = await this.#verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid password' };
    }
    
    return {
      success: true,
      user,
      token: this.#generateToken(user)
    };
  }

  /**
   * Validates user data
   * @param {CreateUserRequest} userData - User data to validate
   * @private
   */
  #validateUserData(userData) {
    if (!userData.email || !userData.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }
    
    if (!userData.firstName || userData.firstName.length < 2) {
      throw new ValidationError('First name must be at least 2 characters');
    }
    
    if (!userData.lastName || userData.lastName.length < 2) {
      throw new ValidationError('Last name must be at least 2 characters');
    }
  }

  /**
   * Generates a unique ID
   * @returns {string} Unique identifier
   * @private
   */
  #generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generates authentication token
   * @param {User} user - User to generate token for
   * @returns {string} Authentication token
   * @private
   */
  #generateToken(user) {
    return Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  }

  /**
   * Verifies password (placeholder implementation)
   * @param {string} password - Plain password
   * @param {string} hash - Password hash
   * @returns {Promise<boolean>} True if password matches
   * @private
   */
  async #verifyPassword(password, hash) {
    // In real implementation, use bcrypt or similar
    return password === hash;
  }
}
```

---

## 🎯 **TROUBLESHOOTING**

### **Common Issues**

#### **1. ESLint JSDoc Errors**
```bash
# Error: Missing JSDoc for exported function
# Solution: Add JSDoc comment
/**
 * @param {string} name - Parameter name
 * @returns {string} Return value
 */
export function myFunction(name) {
  return `Hello ${name}`;
}
```

#### **2. Type Not Found Errors**
```bash
# Error: Unknown type 'CustomType'
# Solution: Import type using @typedef
/**
 * @typedef {import('./types.js').CustomType} CustomType
 */
```

#### **3. Editor Not Showing Types**
```bash
# Solution: Ensure .js extension in imports
import { MyType } from './types.js';  // ✅ Correct
import { MyType } from './types';     // ❌ May not work
```

### **Performance Considerations**

- JSDoc comments are stripped by bundlers → zero runtime impact
- ESLint JSDoc rules add minimal linting overhead
- Editor performance is excellent with JSDoc
- No compilation step needed → faster development

---

## 📊 **COMPARISON: PURE JSDOC VS TYPESCRIPT**

| **Aspect** | **Pure JSDoc** | **TypeScript** |
|------------|----------------|----------------|
| **Dependencies** | eslint, eslint-plugin-jsdoc | typescript, @types/* |
| **Setup Complexity** | Low (single config) | High (tsconfig, paths) |
| **Runtime Impact** | None (comments stripped) | None (compiled away) |
| **Editor Support** | Good (JSDoc understanding) | Excellent (TS language server) |
| **Type Safety** | Moderate (lint-time only) | Strong (static analysis) |
| **Learning Curve** | Gentle | Steep |
| **Build Time** | Faster (no compilation) | Slower (compilation) |
| **Team Onboarding** | Easy | Moderate |
| **Documentation** | Built-in (JSDoc) | Separate (TSDoc) |

---

## 🎉 **CONCLUSION**

Pure JSDoc migration offers an excellent balance between type safety and simplicity. It provides:

- **Zero TypeScript dependency**
- **Maximum editor compatibility**
- **Minimal runtime impact**
- **Simple tooling setup**
- **Fast development iteration**

This approach is ideal for teams that want basic type safety without the complexity of TypeScript, while maintaining excellent developer experience and code documentation.

---

**Implementation Date**: January 31, 2026  
**Strategy**: Pure JSDoc + No TypeScript Dependency  
**Status**: ✅ **PRODUCTION READY**
