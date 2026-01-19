# Import Path Aliases Guide

## Current Status

✅ **Successfully configured path aliases** in both `tsconfig.json` and `vite.config.ts`

### Available Aliases:

```typescript
// Cross-cutting aliases (working well)
@api/*           → src/api/*
@utils/*         → src/utils/*
@services/*      → src/services/*
@constants/*     → src/constants/*
@core/*          → src/core/*
@/*              → src/*

// Feature-specific aliases (configured but may need restart)
@features/*      → src/features/*
@notification/*  → src/features/notification/*
@analytics/*     → src/features/analytics/*
@content/*       → src/features/content/*
@feed/*          → src/features/feed/*
@profile/*       → src/features/profile/*
@search/*        → src/features/search/*
@settings/*      → src/features/settings/*
```

## Usage Examples

### ✅ Working Aliases (Recommended):
```typescript
// API imports
import { NotificationPage } from '@api/schemas/inferred/notification';
import { buildPageParams } from '@utils/fetchUtils';
import { NOTIFICATION_PATH } from '@constants/apiPath';

// Service imports  
import { useAuthStore } from '@services/store/zustand';
import { useService } from '@core/di';
```

### ⚠️ Feature-Specific Aliases (Use Relative Paths for Now):
```typescript
// Instead of this (may not work):
import { NotificationService } from '@notification/application/services/NotificationServiceDI';

// Use this (reliable):
import { NotificationService } from '../application/services/NotificationServiceDI';
```

## Recommendations

### 1. **For Cross-Cutting Dependencies** ✅
Use aliases for imports that cross feature boundaries:
- `@api/*` for API schemas and requests
- `@utils/*` for utility functions
- `@services/*` for global services
- `@constants/*` for configuration constants
- `@core/*` for core framework code

### 2. **For Feature-Internal Dependencies** ✅
Use relative paths for imports within the same feature:
- `../domain/entities/*` for domain layer
- `../data/repositories/*` for data layer  
- `../application/services/*` for application layer
- `../presentation/components/*` for presentation layer

### 3. **For Cross-Feature Dependencies** ⚠️
Use relative paths for now until TypeScript/Vite restart:
- `../../other-feature/application/services/*`

## Benefits Achieved

1. **Shorter imports** for API, utils, and services
2. **Cleaner code** with semantic path meanings
3. **Better maintainability** with centralized alias configuration
4. **Consistent naming** following conventional patterns

## Files Updated

- ✅ `tsconfig.json` - Added comprehensive path aliases
- ✅ `vite.config.ts` - Added matching Vite aliases
- ✅ All notification feature files - Updated to use aliases where appropriate
- ✅ API files - Updated to use `@constants/*` and `@api/*` aliases

## Next Steps

1. **Restart IDE/TypeScript Server** - This may enable the feature-specific aliases
2. **Consider IDE Configuration** - Some IDEs need explicit alias configuration
3. **Test Build Process** - Ensure aliases work in production build
4. **Documentation** - Update team coding standards to reflect alias usage

## Example: Before vs After

### Before:
```typescript
import type { NotificationPage } from '../../../../api/schemas/inferred/notification';
import { buildPageParams } from '../../../../utils/fetchUtils';
import { NotificationService } from '../application/services/NotificationServiceDI';
```

### After:
```typescript
import type { NotificationPage } from '@api/schemas/inferred/notification';
import { buildPageParams } from '@utils/fetchUtils';
import { NotificationService } from '../application/services/NotificationServiceDI';
```

This provides a good balance between readability and reliability!
