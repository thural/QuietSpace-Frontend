# Profile Feature Documentation

## Overview

The Profile Feature provides enterprise-grade user profile management with advanced caching, real-time updates, and comprehensive settings management. This documentation covers the complete architecture, usage examples, and best practices.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Installation & Setup](#installation--setup)
3. [Core Components](#core-components)
4. [Hooks API](#hooks-api)
5. [Services API](#services-api)
6. [Caching Strategy](#caching-strategy)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)
9. [Testing](#testing)
10. [Migration Guide](#migration-guide)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Clean Architecture Pattern

```
React Components (UI Layer)
    ↓
Custom Query Hooks (useCustomQuery, useCustomMutation)
    ↓
Feature Services (Business Logic & Orchestration)
    ↓
Data Services (Caching & Data Orchestration)
    ↓
Repositories (Raw Data Access)
    ↓
CacheProvider (Enterprise Cache with TTL, LRU, Pattern Invalidation)
    ↓
Global State (Zustand - Loading, Error, Query Tracking)
    ↓
API Services / WebSocket Services
```

### Key Components

- **ProfileDataService**: Handles caching and data orchestration
- **ProfileFeatureService**: Implements business logic and validation
- **Custom Query Hooks**: Provides enterprise-grade query management
- **CacheProvider**: Intelligent caching with TTL and invalidation strategies
- **DI Container**: Type-safe dependency injection

## Installation & Setup

### Prerequisites

Ensure you have the following dependencies installed:

```bash
npm install @tanstack/react-query zustand reflect-metadata
```

### DI Container Setup

```typescript
// src/core/di/AppContainer.ts
import { createProfileContainer } from '@features/profile/di/container';

// Register profile feature services
const profileContainer = createProfileContainer();
```

### Cache Configuration

```typescript
// src/features/profile/data/cache/ProfileCacheKeys.ts
export const PROFILE_CACHE_TTL = {
  USER_PROFILE: 15 * 60 * 1000,        // 15 minutes
  CURRENT_USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  USER_STATS: 10 * 60 * 1000,          // 10 minutes
  USER_FOLLOWERS: 30 * 60 * 1000,      // 30 minutes
  USER_FOLLOWINGS: 30 * 60 * 1000,     // 30 minutes
  USER_SETTINGS: 60 * 60 * 1000,        // 1 hour
  USER_PRIVACY: 60 * 60 * 1000,         // 1 hour
  USER_SEARCH: 2 * 60 * 1000,           // 2 minutes
  USER_SUGGESTIONS: 10 * 60 * 1000,     // 10 minutes
  USER_ONLINE_STATUS: 30 * 1000,        // 30 seconds
  USER_ACTIVITY: 60 * 1000,             // 1 minute
  PROFILE_VIEWS: 10 * 60 * 1000,        // 10 minutes
  USER_MUTUAL_CONNECTIONS: 20 * 60 * 1000, // 20 minutes
  USER_BLOCKED: 30 * 60 * 1000,         // 30 minutes
  USER_MUTED: 30 * 60 * 1000,           // 30 minutes
  PROFILE_COMPLETION: 10 * 60 * 1000,   // 10 minutes
  USER_VERIFICATION: 30 * 60 * 1000,     // 30 minutes
  PROFILE_ANALYTICS: 15 * 60 * 1000,     // 15 minutes
  USER_SOCIAL_LINKS: 30 * 60 * 1000,     // 30 minutes
  USER_INTERESTS: 30 * 60 * 1000,       // 30 minutes
  USER_SKILLS: 30 * 60 * 1000,          // 30 minutes
  USER_EDUCATION: 30 * 60 * 1000,        // 30 minutes
  USER_WORK_EXPERIENCE: 30 * 60 * 1000, // 30 minutes
  USER_PORTFOLIO: 20 * 60 * 1000,        // 20 minutes
  USER_TESTIMONIALS: 20 * 60 * 1000,     // 20 minutes
  USER_RECOMMENDATIONS: 20 * 60 * 1000,  // 20 minutes
} as const;
```

## Core Components

### EnterpriseProfileContainer

The main profile component with enterprise-grade features:

```typescript
import { EnterpriseProfileContainer } from '@features/profile/components';

function ProfilePage() {
  return (
    <EnterpriseProfileContainer />
  );
}
```

**Features:**
- Real-time profile updates
- Intelligent caching
- Error boundaries
- Performance monitoring
- Accessibility compliance

### ProfileSettingsContainer

Advanced settings management with change detection:

```typescript
import { ProfileSettingsContainer } from '@features/profile/components';

function SettingsPage() {
  return (
    <ProfileSettingsContainer />
  );
}
```

**Features:**
- Unsaved changes detection
- Batch updates
- Form validation
- Real-time synchronization

### ProfileSearchContainer

Enterprise-grade user search with advanced filtering:

```typescript
import { ProfileSearchContainer } from '@features/profile/components';

function SearchPage() {
  return (
    <ProfileSearchContainer />
  );
}
```

**Features:**
- Advanced search filters
- Real-time search results
- User suggestions
- Performance optimization

## Hooks API

### useProfile

Main profile management hook:

```typescript
import { useProfile } from '@features/profile/application/hooks';

function ProfileComponent({ userId }: { userId: string }) {
  const {
    profile,
    stats,
    followers,
    followings,
    searchResults,
    suggestions,
    settings,
    privacy,
    isLoading,
    error,
    selectedUserId,
    // Actions
    getProfile,
    getCurrentProfile,
    updateProfile,
    deleteProfile,
    getStats,
    updateStats,
    getFollowers,
    getFollowings,
    followUser,
    unfollowUser,
    searchUsers,
    getUserSuggestions,
    getSettings,
    updateSettings,
    getPrivacy,
    updatePrivacy,
    setSelectedUserId,
    clearError,
    refresh
  } = useProfile({ userId });

  // Usage examples
  const handleUpdateProfile = async (updates: Partial<UserProfileEntity>) => {
    try {
      await updateProfile(userId, updates);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleFollowUser = async (targetUserId: string) => {
    try {
      await followUser(userId, targetUserId);
      console.log('User followed successfully');
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{profile?.username}</h1>
      <p>Followers: {stats?.followersCount}</p>
      <p>Following: {stats?.followingsCount}</p>
      <button onClick={() => handleFollowUser('target-user-id')}>
        Follow User
      </button>
    </div>
  );
}
```

### useProfileConnections

Connection management hook:

```typescript
import { useProfileConnections } from '@features/profile/application/hooks';

function ConnectionsComponent({ userId }: { userId: string }) {
  const {
    followers,
    followings,
    mutualConnections,
    blockedUsers,
    mutedUsers,
    isLoading,
    error,
    selectedUserId,
    isFollowing,
    isBlocked,
    isMuted,
    // Actions
    getFollowers,
    getFollowings,
    getMutualConnections,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    muteUser,
    unmuteUser,
    getBlockedUsers,
    getMutedUsers,
    setSelectedUserId,
    checkConnectionStatus,
    clearError,
    refresh
  } = useProfileConnections({ userId });

  const handleToggleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(selectedUserId!, userId);
    } else {
      await followUser(selectedUserId!, userId);
    }
  };

  return (
    <div>
      <h2>Connections</h2>
      <button onClick={handleToggleFollow}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      <div>
        <h3>Followers ({followers?.length})</h3>
        {followers?.map(follower => (
          <div key={follower.id}>{follower.username}</div>
        ))}
      </div>
    </div>
  );
}
```

### useProfileSettings

Settings management hook:

```typescript
import { useProfileSettings } from '@features/profile/application/hooks';

function SettingsComponent({ userId }: { userId: string }) {
  const {
    settings,
    privacy,
    isLoading,
    error,
    selectedUserId,
    hasUnsavedChanges,
    // Actions
    getSettings,
    updateSettings,
    resetSettings,
    getPrivacy,
    updatePrivacy,
    resetPrivacy,
    updateAllSettings,
    setSelectedUserId,
    clearError,
    refresh,
    checkUnsavedChanges,
    discardChanges
  } = useProfileSettings({ userId });

  const handleUpdateTheme = async (theme: string) => {
    try {
      await updateSettings(userId, { ...settings, theme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleUpdatePrivacy = async (privacySettings: any) => {
    try {
      await updatePrivacy(userId, privacySettings);
    } catch (error) {
      console.error('Failed to update privacy:', error);
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>Theme:</label>
        <select 
          value={settings?.theme || 'light'} 
          onChange={(e) => handleUpdateTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      {hasUnsavedChanges && (
        <div>
          <p>You have unsaved changes</p>
          <button onClick={() => discardChanges()}>Discard</button>
        </div>
      )}
    </div>
  );
}
```

## Services API

### ProfileDataService

Data service for caching and orchestration:

```typescript
import { ProfileDataService } from '@features/profile/data/services';

class CustomProfileService {
  constructor(private profileDataService: ProfileDataService) {}

  async getUserProfileWithCache(userId: string): Promise<UserProfileEntity> {
    return this.profileDataService.getUserProfile(userId, token);
  }

  async updateUserProfileWithCache(
    userId: string, 
    updates: Partial<UserProfileEntity>
  ): Promise<UserProfileEntity> {
    return this.profileDataService.updateUserProfile(userId, updates, token);
  }

  async searchUsersWithCache(
    query: string, 
    options: SearchOptions
  ): Promise<UserProfileEntity[]> {
    return this.profileDataService.searchUsers(query, options, token);
  }
}
```

### ProfileFeatureService

Business logic and validation service:

```typescript
import { ProfileFeatureService } from '@features/profile/application/services';

class CustomProfileFeatureService {
  constructor(private profileFeatureService: ProfileFeatureService) {}

  async createValidatedProfile(
    profileData: Partial<UserProfileEntity>
  ): Promise<UserProfileEntity> {
    // Business validation
    if (!profileData.username || profileData.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (profileData.email && !this.isValidEmail(profileData.email)) {
      throw new Error('Invalid email address');
    }

    return this.profileFeatureService.updateProfile(userId, profileData, token);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

## Caching Strategy

### Cache Keys

```typescript
import { PROFILE_CACHE_KEYS } from '@features/profile/data/cache';

// Generate cache keys
const profileKey = PROFILE_CACHE_KEYS.USER_PROFILE('123');
const followersKey = PROFILE_CACHE_KEYS.USER_FOLLOWERS('123', 0, 50);
const searchKey = PROFILE_CACHE_KEYS.USER_SEARCH('john', 0, 20);
```

### Cache Invalidation

```typescript
import { useCacheInvalidation } from '@/core/hooks/useCacheInvalidation';

function ProfileComponent() {
  const invalidateCache = useCacheInvalidation();

  const handleProfileUpdate = async (userId: string, updates: any) => {
    await updateProfile(userId, updates);
    
    // Invalidate relevant caches
    invalidateCache.invalidateProfile(userId);
    invalidateCache.invalidateConnections(userId);
  };
}
```

### TTL Configuration

```typescript
// Configure cache TTL per data type
const cacheConfig = {
  userProfile: 15 * 60 * 1000,        // 15 minutes
  currentUserProfile: 5 * 60 * 1000,  // 5 minutes
  userStats: 10 * 60 * 1000,          // 10 minutes
  userConnections: 30 * 60 * 1000,    // 30 minutes
  userSettings: 60 * 60 * 1000,        // 1 hour
  searchResults: 2 * 60 * 1000,        // 2 minutes
  onlineStatus: 30 * 1000,             // 30 seconds
};
```

## Error Handling

### Error Boundaries

```typescript
import { withErrorBoundary } from '@shared/hooks/withErrorBoundary';

const ProfileWithErrorBoundary = withErrorBoundary(ProfileComponent, {
  fallback: <ErrorComponent message="Profile failed to load" />,
  onError: (error, errorInfo) => {
    console.error('Profile error:', error, errorInfo);
    // Send error to monitoring service
  }
});
```

### Error Recovery

```typescript
function ProfileComponent() {
  const { error, clearError, refresh } = useProfile();

  const handleRetry = () => {
    clearError();
    refresh();
  };

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return <ProfileContent />;
}
```

### Error Types

```typescript
// Common error types
enum ProfileErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

// Error handling utility
function handleProfileError(error: Error): void {
  if (error.message.includes('401')) {
    // Handle authentication error
    redirectToLogin();
  } else if (error.message.includes('403')) {
    // Handle permission error
    showPermissionError();
  } else if (error.message.includes('404')) {
    // Handle not found error
    showNotFoundError();
  } else {
    // Handle generic error
    showGenericError();
  }
}
```

## Performance Optimization

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const ProfileContainer = lazy(() => import('./ProfileContainer'));

function App() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileContainer />
    </Suspense>
  );
}
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

const ProfileListItem = memo(({ user }: { user: UserProfileEntity }) => {
  const formattedDate = useMemo(() => {
    return new Date(user.createdAt).toLocaleDateString();
  }, [user.createdAt]);

  const handleFollow = useCallback(() => {
    // Handle follow logic
  }, [user.id]);

  return (
    <div>
      <h3>{user.username}</h3>
      <p>Joined: {formattedDate}</p>
      <button onClick={handleFollow}>Follow</button>
    </div>
  );
});
```

### Virtual Scrolling

```typescript
import { FixedSizeList as List } from 'react-window';

function VirtualizedFollowers({ followers }: { followers: UserConnectionEntity[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <ProfileListItem user={followers[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={followers.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### Debouncing

```typescript
import { useCallback, useRef } from 'react';

function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

function SearchComponent() {
  const [query, setQuery] = useState('');
  const { searchUsers } = useProfile();

  const debouncedSearch = useDebounce((searchQuery: string) => {
    searchUsers(searchQuery);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleSearchChange}
      placeholder="Search users..."
    />
  );
}
```

## Testing

### Unit Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile } from '@features/profile/application/hooks';

describe('useProfile', () => {
  it('should load profile data', async () => {
    const { result } = renderHook(() => useProfile({ userId: '123' }));

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    expect(result.current.profile?.id).toBe('123');
  });

  it('should handle profile updates', async () => {
    const { result } = renderHook(() => useProfile({ userId: '123' }));

    const updates = { username: 'new-username' };

    await waitFor(async () => {
      await result.current.updateProfile('123', updates);
    });

    expect(result.current.profile?.username).toBe('new-username');
  });
});
```

### Integration Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnterpriseProfileContainer } from '@features/profile/components';

describe('EnterpriseProfileContainer', () => {
  it('should render profile information', async () => {
    render(<EnterpriseProfileContainer />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });
  });

  it('should handle follow button click', async () => {
    render(<EnterpriseProfileContainer />);

    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(screen.getByText('Following')).toBeInTheDocument();
    });
  });
});
```

### Performance Tests

```typescript
import { measureExecutionTime } from '../utils/performance';

describe('Profile Performance', () => {
  it('should load profile within time limit', async () => {
    const { time } = await measureExecutionTime(async () => {
      // Load profile
      await loadProfile('123');
    });

    expect(time).toBeLessThan(500); // 500ms limit
  });

  it('should handle large search results efficiently', async () => {
    const { time } = await measureExecutionTime(async () => {
      // Search with large result set
      await searchUsers('test', { limit: 1000 });
    });

    expect(time).toBeLessThan(1000); // 1 second limit
  });
});
```

## Migration Guide

### From Legacy Profile System

1. **Replace Legacy Hooks**:
   ```typescript
   // Before
   import { useUserProfile } from '@features/profile/application/hooks/useUserProfile';
   
   // After
   import { useProfile } from '@features/profile/application/hooks/useProfile';
   ```

2. **Update Component Structure**:
   ```typescript
   // Before
   function ProfileContainer() {
     const { user, followers, followings } = useUserProfile(userId);
     return <ProfileContent user={user} followers={followers} followings={followings} />;
   }
   
   // After
   function ProfileContainer() {
     const { profile, followers, followings } = useProfile({ userId });
     return <ProfileContent profile={profile} followers={followers} followings={followings} />;
   }
   ```

3. **Add Error Boundaries**:
   ```typescript
   import { withErrorBoundary } from '@shared/hooks/withErrorBoundary';
   
   export default withErrorBoundary(ProfileContainer, {
     fallback: <ErrorComponent message="Profile failed to load" />
   });
   ```

4. **Configure DI Container**:
   ```typescript
   import { createProfileContainer } from '@features/profile/di/container';
   
   const profileContainer = createProfileContainer();
   ```

### Data Migration

1. **Update Data Structures**:
   ```typescript
   // Legacy format
   interface LegacyUser {
     id: string;
     name: string;
     email: string;
   }
   
   // New format
   interface UserProfileEntity {
     id: string;
     username: string;
     email: string;
     bio?: string;
     followersCount: number;
     followingsCount: number;
     postsCount: number;
     isVerified: boolean;
     isPrivate: boolean;
     createdAt: string;
     updatedAt: string;
   }
   ```

2. **Migrate Cache Keys**:
   ```typescript
   // Legacy cache keys
   const LEGACY_CACHE_KEYS = {
     USER_PROFILE: `user:profile:${userId}`,
     USER_FOLLOWERS: `user:followers:${userId}`
   };
   
   // New cache keys
   const PROFILE_CACHE_KEYS = {
     USER_PROFILE: (userId: string | number) => `profile:user:${userId}`,
     USER_FOLLOWERS: (userId: string | number, page: number, size: number) => 
       `profile:followers:${userId}:${page}:${size}`
   };
   ```

## Best Practices

### Performance Best Practices

1. **Use Appropriate TTL Values**:
   ```typescript
   // Short TTL for frequently changing data
   USER_ONLINE_STATUS: 30 * 1000,        // 30 seconds
   
   // Medium TTL for semi-static data
   USER_PROFILE: 15 * 60 * 1000,        // 15 minutes
   
   // Long TTL for rarely changing data
   USER_SETTINGS: 60 * 60 * 1000,        // 1 hour
   ```

2. **Implement Proper Cache Invalidation**:
   ```typescript
   const handleProfileUpdate = async (userId: string, updates: any) => {
     await updateProfile(userId, updates);
     
     // Invalidate specific caches
     invalidateCache.invalidateProfile(userId);
     invalidateCache.invalidateConnections(userId);
   };
   ```

3. **Use Lazy Loading for Large Components**:
   ```typescript
   const ProfileContainer = lazy(() => import('./ProfileContainer'));
   ```

### Security Best Practices

1. **Validate Input Data**:
   ```typescript
   const validateProfileUpdate = (updates: Partial<UserProfileEntity>) => {
     if (updates.username && updates.username.length < 3) {
       throw new Error('Username must be at least 3 characters long');
     }
     
     if (updates.email && !isValidEmail(updates.email)) {
       throw new Error('Invalid email address');
     }
   };
   ```

2. **Handle Sensitive Data Carefully**:
   ```typescript
   // Don't cache sensitive information
   const sensitiveFields = ['password', 'token', 'secret'];
   
   const sanitizeProfileData = (profile: UserProfileEntity) => {
     return Object.fromEntries(
       Object.entries(profile).filter(([key]) => !sensitiveFields.includes(key))
     );
   };
   ```

### Code Organization Best Practices

1. **Follow Clean Architecture**:
   - Keep components focused on UI logic
   - Move business logic to feature services
   - Handle data operations in data services
   - Use repositories for data access

2. **Use TypeScript Strictly**:
   ```typescript
   // Define strict interfaces
   interface UserProfileEntity {
     readonly id: string;
     readonly username: string;
     readonly email: string;
     readonly bio?: string;
     readonly followersCount: number;
     readonly followingsCount: number;
     readonly postsCount: number;
     readonly isVerified: boolean;
     readonly isPrivate: boolean;
     readonly createdAt: string;
     readonly updatedAt: string;
   }
   ```

3. **Implement Proper Error Handling**:
   ```typescript
   const handleAsyncOperation = async (operation: () => Promise<any>) => {
     try {
       return await operation();
     } catch (error) {
       console.error('Operation failed:', error);
       throw error;
     }
   };
   ```

## Troubleshooting

### Common Issues

1. **Cache Not Updating**:
   - **Cause**: Cache invalidation not properly implemented
   - **Solution**: Ensure proper cache invalidation after updates
   ```typescript
   await updateProfile(userId, updates);
   invalidateCache.invalidateProfile(userId);
   ```

2. **Performance Issues**:
   - **Cause**: Too many API calls or inefficient caching
   - **Solution**: Optimize TTL values and implement proper caching strategies
   ```typescript
   // Use appropriate TTL
   const cacheConfig = {
     userProfile: 15 * 60 * 1000,  // 15 minutes
     searchResults: 2 * 60 * 1000,  // 2 minutes
   };
   ```

3. **Memory Leaks**:
   - **Cause**: Not properly cleaning up subscriptions or caches
   - **Solution**: Implement proper cleanup in useEffect
   ```typescript
   useEffect(() => {
     const subscription = subscribeToProfileUpdates();
     
     return () => {
       subscription.unsubscribe();
     };
   }, []);
   ```

### Debugging Tools

1. **Cache Inspector**:
   ```typescript
   const cacheStats = useCacheInvalidation().getCacheStats();
   console.log('Cache stats:', cacheStats);
   ```

2. **Performance Monitor**:
   ```typescript
   const { time } = await measureExecutionTime(async () => {
     await loadProfile(userId);
   });
   console.log('Profile load time:', time);
   ```

3. **Error Logger**:
   ```typescript
   const { error } = useProfile();
   
   if (error) {
     console.error('Profile error:', {
       message: error.message,
       stack: error.stack,
       timestamp: new Date().toISOString()
     });
   }
   ```

### Getting Help

1. **Check Documentation**: Review this documentation first
2. **Review Tests**: Look at existing test files for usage examples
3. **Check Console**: Look for error messages and warnings
4. **Use DevTools**: Use React DevTools and browser dev tools for debugging
5. **Contact Team**: Reach out to the development team for assistance

## Testing

### Test Infrastructure

The Profile feature includes comprehensive testing infrastructure:

#### Test Directory Structure
```
__tests__/
├── utils/                    # Test utilities and helper functions
├── fixtures/                 # Test data fixtures
├── helpers/                  # Test helpers and setup functions
├── mocks/                    # API and service mocks
├── integration/              # Integration tests
├── performance/             # Performance tests
├── di/                      # Dependency injection tests
└── Profile.test.tsx          # Main feature tests
```

#### Key Testing Components

**MockDataFactory**
- Creates mock entities for testing
- Supports user profiles, stats, and connections

**PerformanceUtils**
- Performance testing utilities
- Execution time measurement and benchmarks

**StateUtils**
- State testing utilities
- Mock store creation and state update testing

#### Running Tests
```bash
# Run all profile tests
npm test src/features/profile/__tests__

# Run with coverage
npm test -- --coverage src/features/profile
```

#### Coverage Requirements
Target coverage thresholds:
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

---

## Conclusion

The Profile Feature provides enterprise-grade user profile management with advanced caching, real-time updates, and comprehensive settings management. By following this documentation and best practices, you can build robust and performant profile-related features.

For additional support or questions, please refer to the team documentation or contact the development team.
