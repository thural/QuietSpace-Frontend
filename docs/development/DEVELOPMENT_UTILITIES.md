# Development Files

This directory contains development utilities, examples, and test data used during development and testing.

## 📁 Directory Structure

```
development/
├── examples/
│   └── example-javascript-interface.js  # JavaScript interface examples using JSDoc
├── test-data/
│   └── db.json                          # Development/test database file
└── utilities/
    └── test-path.ts                      # Path testing utility
```

## 📂 Contents

### Examples
- **example-javascript-interface.js**: Demonstrates JavaScript interface patterns using JSDoc annotations for type safety without TypeScript dependencies.

### Test Data
- **db.json**: Sample database file used for development and testing purposes.

### Utilities
- **test-path.ts**: Simple utility for testing import paths and module resolution.

## 🔧 Usage

### Running Examples

```bash
# Run JavaScript interface example
node development/examples/example-javascript-interface.js

# Test path utilities
ts-node development/utilities/test-path.ts
```

### Using Test Data

The `db.json` file can be used as mock data for development:
```javascript
import testData from '../development/test-data/db.json';
```

## 📝 Notes

- These files are for development purposes only
- Test data should not be used in production
- Examples demonstrate best practices and patterns
- Utilities are helper functions for common development tasks

## 🚀 Maintenance

- Add new examples to the `examples/` subdirectory
- Keep test data separate from production data
- Update utilities as needed for new development workflows
- Document new additions in this README
