# Scripts Directory

This directory contains utility scripts for the QuietSpace Frontend project.

## 📋 Available Scripts

### **JSDoc Compliance Checker**

#### **Node.js Script**
- **File**: `check-jsdoc-compliance.js`
- **Usage**: `node scripts/check-jsdoc-compliance.js [options] [files...]`

#### **Shell Script (Recommended)**
- **File**: `check-jsdoc.sh`
- **Usage**: `./scripts/check-jsdoc.sh [options]`

#### **Package.json Scripts**
```bash
npm run check-jsdoc          # Check all files
npm run check-jsdoc:fix      # Check and auto-fix issues
npm run check-jsdoc:core     # Check only core modules
npm run check-jsdoc:summary  # Show summary only

npm run lint:jsdoc          # Node.js version
npm run lint:jsdoc:fix      # Node.js version with fix
```

## 🔧 **JSDoc Compliance Checker**

Validates that migrated JavaScript files comply with the Pure JSDoc strategy.

### **What it Checks:**

#### **✅ JSDoc Patterns**
- Required tags (`@param`, `@returns`, `@type`, `@typedef`, `@property`)
- Proper JSDoc block structure
- Type annotations for functions and classes
- Descriptions for JSDoc blocks

#### **❌ TypeScript Patterns (Forbidden)**
- `ReturnType<typeof` syntax
- TypeScript `interface` declarations
- TypeScript `type` aliases
- TypeScript `enum` declarations
- `@ts-*` comments
- `.d.ts` file references

#### **📦 Export Compliance**
- JSDoc documentation on exported functions
- JSDoc on exported classes
- JSDoc on exported constants

#### **🏗️ Enum Patterns**
- `Object.freeze()` usage for enums
- `@readonly` and `@enum` tags
- Proper enum documentation

#### **📝 Type Definitions**
- `@typedef` structure validation
- `@property` documentation for objects
- Type definition completeness

### **Options:**

| Option | Description |
|--------|-------------|
| `--fix` | Auto-fix ESLint issues where possible |
| `--verbose` | Show detailed output for all files |
| `--strict` | Enable strict validation mode |
| `--summary` | Show summary only (no per-file details) |
| `--core-only` | Check only core modules (`src/core/**`) |
| `--exclude=PAT` | Exclude files matching pattern |
| `--help` | Show help message |

### **Examples:**

```bash
# Check all files
npm run check-jsdoc

# Check only core modules
npm run check-jsdoc:core

# Check and auto-fix issues
npm run check-jsdoc:fix

# Check specific directory
./scripts/check-jsdoc.sh src/core/auth/

# Check with summary only
npm run check-jsdoc:summary

# Exclude test files
./scripts/check-jsdoc.sh --exclude="**/*.test.js"

# Strict mode with verbose output
./scripts/check-jsdoc.sh --strict --verbose
```

### **Exit Codes:**

- `0` - All checks passed
- `1` - Some checks failed or errors occurred

### **Output Example:**

```
🔍 JSDoc Compliance Checker
=============================

📁 Checking 170 files...

✅ src/core/auth/services/SessionTimeoutManager.js
   ⚠️  Line 75: Function JSDoc missing @param tags
   ⚠️  Line 85: Function JSDoc missing @returns tag

❌ src/core/auth/services/TokenRefreshManager.js
   ❌ TypeScript pattern found: ReturnType<typeof - 2 occurrence(s)
   ❌ Line 120: Exported item missing JSDoc documentation

🔧 Running ESLint check...
✅ ESLint check completed (170 files processed)

📊 Compliance Check Summary
==========================
📁 Total files checked: 170
✅ Passed: 168
❌ Failed: 2
⚠️  Total warnings: 5

📈 Compliance Rate: 98.8%
👍 Good compliance
```

## 🚀 **Usage in CI/CD**

### **GitHub Actions Example:**
```yaml
- name: Check JSDoc Compliance
  run: |
    npm run check-jsdoc:core --summary
```

### **Pre-commit Hook:**
```bash
#!/bin/sh
# .git/hooks/pre-commit
npm run check-jsdoc:core
```

### **Package.json (lint-staged):**
```json
{
  "lint-staged": {
    "src/core/**/*.js": [
      "npm run check-jsdoc:core",
      "git add"
    ]
  }
}
```

## 📚 **Related Documentation**

- **[JavaScript Migration Guide](../JAVASCRIPT_MIGRATION_GUIDE.md)** - Comprehensive migration strategy
- **[Pure JSDoc Migration Guide](../PURE_JSDOC_MIGRATION_GUIDE.md)** - Detailed JSDoc implementation
- **[Migration Strategy Summary](../MIGRATION_STRATEGY_SUMMARY.md)** - Quick reference

## 🛠️ **Development**

### **Adding New Checks:**

1. Update validation logic in `check-jsdoc-compliance.js`
2. Add corresponding tests
3. Update documentation

### **Script Structure:**

```
scripts/
├── check-jsdoc-compliance.js  # Main Node.js checker
├── check-jsdoc.sh             # Shell wrapper
└── README.md                  # This documentation
```

---

**Last Updated**: January 31, 2026  
**Purpose**: Ensure JSDoc compliance in migrated JavaScript files
