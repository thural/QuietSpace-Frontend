# Import Standardization Guide

## Overview

This document outlines the standardized import patterns implemented across the QuietSpace Frontend codebase to ensure consistency, maintainability, and improved developer experience.

## Path Alias Standards

### Feature-Specific Path Aliases

All features now use consistent `@feature/` path aliases for internal imports:

```typescript
// Analytics Feature
import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { AnalyticsRepository } from '@analytics/data';

// Auth Feature  
import { useLoginForm } from '@auth/application/hooks/useLoginForm';
import styles from '@auth/presentation/styles/authStyles';

// Feed Feature
import { PostDataService } from '@feed/data/services/PostDataService';
import { useFeedService } from '@feed/application/hooks/useFeedService';

// Search Feature
import { SearchService } from '@search/application/services/SearchService';
import { useSearchDI } from '@search/application/hooks/useSearchDI';

// Chat Feature
import { ChatDataService } from '@chat/data/services/ChatDataService';
import { useUnifiedChat } from '@chat/application/hooks/useUnifiedChat';
```

### Cross-Feature Imports

When importing from other features, use the target feature's path alias:

```typescript
// Importing profile data in feed feature
import { UserResponse } from '@profile/data/models/user';

// Importing notification data in chat feature
import { NotificationService } from '@notification/application/services/NotificationService';
```

### Core and Shared Imports

Core and shared modules use absolute paths:

```typescript
// Core imports
import { Injectable } from '@core/di';
import { CacheProvider } from '@core/cache';
import { useAuthStore } from '@core/store/zustand';

// Shared imports
import { Theme } from '@shared/types/theme';
import { ResId } from '@shared/api/models/common';
import BoxStyled from '@shared/BoxStyled';
```

## Import Organization

### Import Order

Imports should be organized in the following order:

1. **React and third-party libraries**
2. **Core imports** (`@core/*`)
3. **Shared imports** (`@shared/*`)
4. **Feature imports** (`@feature/*`)
5. **Relative imports** (only for styles, assets, or same-level files)

### Example

```typescript
import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';

// Core imports
import { Injectable } from '@core/di';
import { useAuthStore } from '@core/store/zustand';

// Shared imports
import { Theme } from '@shared/types/theme';
import { ResId } from '@shared/api/models/common';
import BoxStyled from '@shared/BoxStyled';

// Feature imports
import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { UserResponse } from '@profile/data/models/user';

// Relative imports (styles, assets)
import styles from './Component.styles.ts';
import componentIcon from './icon.svg';
```

## Migration Benefits

### Before Standardization
```typescript
// Inconsistent relative imports
import { useAnalyticsDI } from '../../application/services/AnalyticsServiceDI';
import { AnalyticsRepository } from '../data';
import styles from '../styles/authStyles';
```

### After Standardization
```typescript
// Consistent path aliases
import { useAnalyticsDI } from '@analytics/application/services/AnalyticsServiceDI';
import { AnalyticsRepository } from '@analytics/data';
import styles from '@analytics/presentation/styles/authStyles';
```

### Key Improvements

1. **Consistency**: All features follow the same import pattern
2. **Readability**: Clear indication of which feature/module provides the import
3. **Maintainability**: Easier refactoring and file movement
4. **Developer Experience**: Predictable import structure across the codebase
5. **IDE Support**: Better autocomplete and navigation with path aliases

## Features Standardized

The following features have been fully standardized:

| Feature | Status | Files Updated |
|---------|--------|---------------|
| **Analytics** | ✅ Complete | 23+ files |
| **Auth** | ✅ Complete | 9+ files |
| **Feed** | ✅ Complete | 3+ files |
| **Search** | ✅ Complete | 20+ files |
| **Chat** | ✅ Complete | 112+ files |

## Best Practices

### Do's
- ✅ Use `@feature/` aliases for feature-specific imports
- ✅ Use absolute paths for core and shared imports
- ✅ Organize imports in the recommended order
- ✅ Keep relative imports only for styles and assets

### Don'ts
- ❌ Use deep relative imports (`../../../`)
- ❌ Mix import patterns inconsistently
- ❌ Use relative imports for cross-feature dependencies
- ❌ Hard-code full paths in imports

## Future Features

When creating new features, follow this established pattern:

```typescript
// New feature structure
src/features/newfeature/
├── application/
│   ├── hooks/
│   └── services/
├── data/
│   ├── repositories/
│   └── services/
├── domain/
├── presentation/
│   ├── components/
│   └── styles/
└── index.ts

// Import pattern
import { NewFeatureService } from '@newfeature/application/services/NewFeatureService';
import { NewFeatureRepository } from '@newfeature/data/repositories/NewFeatureRepository';
```

## Conclusion

This import standardization creates a more maintainable, scalable, and developer-friendly codebase. The consistent patterns make it easier to understand dependencies, refactor code, and onboard new developers.

---

**Last Updated**: January 24, 2026
**Scope**: Analytics, Auth, Feed, Search, and Chat features
**Status**: ✅ Complete
