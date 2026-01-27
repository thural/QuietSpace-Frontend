# Mocks Directory

This directory contains Jest mock implementations for external dependencies used in testing.

## 📁 Files Overview

### **✅ Active Mocks**

#### `jest.d.ts`
- **Purpose**: TypeScript declarations for Jest
- **Usage**: Provides proper type support for Jest mocks and mock functions
- **Status**: ✅ **ACTIVE** - Essential for TypeScript testing

#### `sockjs-client.ts`
- **Purpose**: Mock for SockJS WebSocket library
- **Usage**: Used by WebSocket functionality and real-time features
- **Status**: ✅ **ACTIVE** - Required for WebSocket tests

#### `stompjs.ts`
- **Purpose**: Mock for STOMP messaging protocol library
- **Usage**: Used by chat and real-time messaging features
- **Status**: ✅ **ACTIVE** - Required for STOMP communication tests

## 🎯 Usage Guidelines

### **WebSocket Testing**
These mocks are essential for testing WebSocket-related functionality:
- Chat features
- Real-time notifications
- Live feed updates
- Enterprise WebSocket services

### **Import Pattern**
```typescript
// Mocks are automatically picked up by Jest
// No manual imports required for these mocks

// Example usage in tests
import { Client } from 'stompjs'; // Uses mock implementation
import SockJS from 'sockjs-client'; // Uses mock implementation
```

## 🚫 What NOT to Do

- **Don't remove** these files - they're actively used
- **Don't modify** without updating dependent tests
- **Don't add** new mocks here unless they're for external dependencies

## 📋 Maintenance

### **When to Update**
- When upgrading SockJS or STOMPJS versions
- When changing WebSocket implementation
- When Jest types need updates

### **Related Files**
- WebSocket tests in `test/core/websocket/`
- Feature WebSocket tests in `test/features/*/`
- Jest setup in `test/jest.setup.cjs`

---

**Status**: ✅ **MAINTAINED**  
**Last Updated**: January 27, 2026  
**Dependencies**: Jest, WebSocket features
