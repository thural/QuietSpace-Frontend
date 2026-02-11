# Profile Feature API Reference

## Table of Contents

1. [Hooks API](#hooks-api)
2. [Components API](#components-api)
3. [Services API](#services-api)
4. [Types and Interfaces](#types-and-interfaces)
5. [Cache API](#cache-api)
6. [Utilities](#utilities)

## Hooks API

### useProfile

Main profile management hook.

```typescript
const {
  // State
  profile: UserProfileEntity | null,
  stats: UserProfileStatsEntity | null,
  followers: UserConnectionEntity[] | null,
  followings: UserConnectionEntity[] | null,
  searchResults: UserProfileEntity[] | null,
  suggestions: UserProfileEntity[] | null,
  settings: any | null,
  privacy: any | null,
  isLoading: boolean,
  error: Error | null,
  selectedUserId: string | number | null,
  
  // Actions
  getProfile: (userId: string | number) => Promise<void>,
  getCurrentProfile: () => Promise<void>,
  updateProfile: (userId: string | number, updates: Partial<UserProfileEntity>) => Promise<UserProfileEntity>,
  deleteProfile: (userId: string | number) => Promise<void>,
  getStats: (userId: string | number) => Promise<void>,
  updateStats: (userId: string | number, stats: Partial<UserProfileStatsEntity>) => Promise<UserProfileStatsEntity>,
  getFollowers: (userId: string | number, options?: ConnectionOptions) => Promise<void>,
  getFollowings: (userId: string | number, options?: ConnectionOptions) => Promise<void>,
  followUser: (userId: string | number, targetUserId: string | number) => Promise<UserConnectionEntity>,
  unfollowUser: (userId: string | number, targetUserId: string | number) => Promise<void>,
  searchUsers: (query: string, options?: SearchOptions) => Promise<void>,
  getUserSuggestions: (userId: string | number, options?: SuggestionOptions) => Promise<void>,
  getSettings: (userId: string | number) => Promise<void>,
  updateSettings: (userId: string | number, settings: any) => Promise<any>,
  getPrivacy: (userId: string | number) => Promise<void>,
  updatePrivacy: (userId: string | number, privacy: any) => Promise<any>,
  setSelectedUserId: (userId: string | number | null) => void,
  clearError: () => void,
  refresh: () => void
} = useProfile(config?: { userId?: string | number });
```

#### Parameters

- `config` (optional): Configuration object
  - `userId` (optional): User ID to pre-select

#### Returns

Returns an object with profile state and actions.

#### Example

```typescript
const { profile, updateProfile, isLoading } = useProfile({ userId: '123' });

await updateProfile('123', { username: 'new-username' });
```

### useProfileConnections

Connection management hook.

```typescript
const {
  // State
  followers: UserConnectionEntity[] | null,
  followings: UserConnectionEntity[] | null,
  mutualConnections: UserConnectionEntity[] | null,
  blockedUsers: UserConnectionEntity[] | null,
  mutedUsers: UserConnectionEntity[] | null,
  isLoading: boolean,
  error: Error | null,
  selectedUserId: string | number | null,
  isFollowing: boolean,
  isBlocked: boolean,
  isMuted: boolean,
  
  // Actions
  getFollowers: (userId: string | number, options?: ConnectionOptions) => Promise<void>,
  getFollowings: (userId: string | number, options?: ConnectionOptions) => Promise<void>,
  getMutualConnections: (userId1: string | number, userId2: string | number) => Promise<void>,
  followUser: (userId: string | number, targetUserId: string | number) => Promise<UserConnectionEntity>,
  unfollowUser: (userId: string | number, targetUserId: string | number) => Promise<void>,
  blockUser: (userId: string | number, targetUserId: string | number) => Promise<void>,
  unblockUser: (userId: string | number, targetUserId: string | number) => Promise<void>,
  muteUser: (userId: string | number, targetUserId: string | number) => Promise<void>,
  unmuteUser: (userId: string | number, targetUserId: string | number) => Promise<void>,
  getBlockedUsers: (userId: string | number, options?: ConnectionOptions) => Promise<void>,
  getMutedUsers: (userId: string | number, options?: ConnectionOptions) => Promise<void>,
  setSelectedUserId: (userId: string | number | null) => void,
  checkConnectionStatus: (userId: string | number, targetUserId: string | number) => Promise<void>,
  clearError: () => void,
  refresh: () => void
} = useProfileConnections(config?: { userId?: string | number, targetUserId?: string | number });
```

#### Parameters

- `config` (optional): Configuration object
  - `userId` (optional): User ID to pre-select
  - `targetUserId` (optional): Target user ID for connection status

#### Returns

Returns an object with connection state and actions.

#### Example

```typescript
const { followUser, unfollowUser, isFollowing } = useProfileConnections({ userId: '123' });

if (isFollowing) {
  await unfollowUser('123', '456');
} else {
  await followUser('123', '456');
}
```

### useProfileSettings

Settings management hook.

```typescript
const {
  // State
  settings: any | null,
  privacy: any | null,
  isLoading: boolean,
  error: Error | null,
  selectedUserId: string | number | null,
  hasUnsavedChanges: boolean,
  
  // Actions
  getSettings: (userId: string | number) => Promise<void>,
  updateSettings: (userId: string | number, settings: any) => Promise<any>,
  resetSettings: (userId: string | number) => Promise<void>,
  getPrivacy: (userId: string | number) => Promise<void>,
  updatePrivacy: (userId: string | number, privacy: any) => Promise<any>,
  resetPrivacy: (userId: string | number) => Promise<void>,
  updateAllSettings: (userId: string | number, settings: any, privacy: any) => Promise<{ settings: any; privacy: any }>,
  setSelectedUserId: (userId: string | number | null) => void,
  clearError: () => void,
  refresh: () => void,
  checkUnsavedChanges: () => boolean,
  discardChanges: () => void
} = useProfileSettings(config?: { userId?: string | number });
```

#### Parameters

- `config` (optional): Configuration object
  - `userId` (optional): User ID to pre-select

#### Returns

Returns an object with settings state and actions.

#### Example

```typescript
const { settings, updateSettings, hasUnsavedChanges } = useProfileSettings({ userId: '123' });

await updateSettings('123', { theme: 'dark' });
```

### useProfileServices

Service access hook.

```typescript
const {
  profileDataService: ProfileDataService,
  profileFeatureService: ProfileFeatureService,
  data: ProfileDataService,      // alias
  feature: ProfileFeatureService  // alias
} = useProfileServices();
```

#### Returns

Returns an object with profile services.

#### Example

```typescript
const { profileDataService, profileFeatureService } = useProfileServices();

const profile = await profileDataService.getUserProfile('123', token);
```

## Components API

### EnterpriseProfileContainer

Main profile component with enterprise features.

```typescript
interface EnterpriseProfileContainerProps {
  // No props required - uses URL params for userId
}

const EnterpriseProfileContainer: React.FC<EnterpriseProfileContainerProps>;
```

#### Example

```typescript
import { EnterpriseProfileContainer } from '@features/profile/components';

function ProfilePage() {
  return <EnterpriseProfileContainer />;
}
```

### ProfileSettingsContainer

Settings management component.

```typescript
interface ProfileSettingsContainerProps {
  // No props required - uses current user from auth store
}

const ProfileSettingsContainer: React.FC<ProfileSettingsContainerProps>;
```

#### Example

```typescript
import { ProfileSettingsContainer } from '@features/profile/components';

function SettingsPage() {
  return <ProfileSettingsContainer />;
}
```

### ProfileSearchContainer

User search component.

```typescript
interface ProfileSearchContainerProps {
  // No props required
}

const ProfileSearchContainer: React.FC<ProfileSearchContainerProps>;
```

#### Example

```typescript
import { ProfileSearchContainer } from '@features/profile/components';

function SearchPage() {
  return <ProfileSearchContainer />;
}
```

## Services API

### ProfileDataService

Data service for caching and orchestration.

```typescript
class ProfileDataService {
  // Profile operations
  async getUserProfile(userId: string | number, token: JwtToken): Promise<UserProfileEntity>;
  async getCurrentUserProfile(token: JwtToken): Promise<UserProfileEntity>;
  async updateUserProfile(userId: string | number, updates: Partial<UserProfileEntity>, token: JwtToken): Promise<UserProfileEntity>;
  async deleteUserProfile(userId: string | number, token: JwtToken): Promise<void>;
  
  // Statistics operations
  async getUserStats(userId: string | number, token: JwtToken): Promise<UserProfileStatsEntity>;
  async updateUserStats(userId: string | number, stats: Partial<UserProfileStatsEntity>, token: JwtToken): Promise<UserProfileStatsEntity>;
  
  // Connection operations
  async getUserFollowers(userId: string | number, options: ConnectionOptions, token: JwtToken): Promise<UserConnectionEntity[]>;
  async getUserFollowings(userId: string | number, options: ConnectionOptions, token: JwtToken): Promise<UserConnectionEntity[]>;
  async followUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<UserConnectionEntity>;
  async unfollowUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void>;
  
  // Search operations
  async searchUsers(query: string, options: SearchOptions, token: JwtToken): Promise<UserProfileEntity[]>;
  async getUserSuggestions(userId: string | number, options: SuggestionOptions, token: JwtToken): Promise<UserProfileEntity[]>;
  
  // Settings operations
  async getUserSettings(userId: string | number, token: JwtToken): Promise<any>;
  async updateUserSettings(userId: string | number, settings: any, token: JwtToken): Promise<any>;
  async getUserPrivacy(userId: string | number, token: JwtToken): Promise<any>;
  async updateUserPrivacy(userId: string | number, privacy: any, token: JwtToken): Promise<any>;
  
  // Cache management
  getCacheStats(): any;
  clearCache(): void;
}
```

### ProfileFeatureService

Business logic and validation service.

```typescript
class ProfileFeatureService {
  // Profile operations
  async getUserProfile(userId: string | number, token: JwtToken): Promise<UserProfileEntity>;
  async getCurrentUserProfile(token: JwtToken): Promise<UserProfileEntity>;
  async updateUserProfile(userId: string | number, updates: Partial<UserProfileEntity>, token: JwtToken): Promise<UserProfileEntity>;
  async deleteUserProfile(userId: string | number, token: JwtToken): Promise<void>;
  
  // Statistics operations
  async getUserStats(userId: string | number, token: JwtToken): Promise<UserProfileStatsEntity>;
  async updateUserStats(userId: string | number, stats: Partial<UserProfileStatsEntity>, token: JwtToken): Promise<UserProfileStatsEntity>;
  
  // Connection operations
  async getUserFollowers(userId: string | number, options: ConnectionOptions, token: JwtToken): Promise<UserConnectionEntity[]>;
  async getUserFollowings(userId: string | number, options: ConnectionOptions, token: JwtToken): Promise<UserConnectionEntity[]>;
  async followUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<UserConnectionEntity>;
  async unfollowUser(userId: string | number, targetUserId: string | number, token: JwtToken): Promise<void>;
  
  // Search operations
  async searchUsers(query: string, options: SearchOptions, token: JwtToken): Promise<UserProfileEntity[]>;
  async getUserSuggestions(userId: string | number, options: SuggestionOptions, token: JwtToken): Promise<UserProfileEntity[]>;
  
  // Settings operations
  async getUserSettings(userId: string | number, token: JwtToken): Promise<any>;
  async updateUserSettings(userId: string | number, settings: any, token: JwtToken): Promise<any>;
  async getUserPrivacy(userId: string | number, token: JwtToken): Promise<any>;
  async updateUserPrivacy(userId: string | number, privacy: any, token: JwtToken): Promise<any>;
}
```

## Types and Interfaces

### UserProfileEntity

```typescript
interface UserProfileEntity {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  followersCount: number;
  followingsCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### UserProfileStatsEntity

```typescript
interface UserProfileStatsEntity {
  id: string;
  userId: string;
  followersCount: number;
  followingsCount: number;
  postsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  profileViews: number;
  lastActive: string;
}
```

### UserConnectionEntity

```typescript
interface UserConnectionEntity {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  followersCount: number;
  followingsCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
  connectedAt: string;
}
```

### ConnectionOptions

```typescript
interface ConnectionOptions {
  limit?: number;
  offset?: number;
  search?: string;
}
```

### SearchOptions

```typescript
interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
}
```

### SuggestionOptions

```typescript
interface SuggestionOptions {
  limit?: number;
  type?: 'mutual' | 'popular' | 'new';
}
```

### ProfileSettingsData

```typescript
interface ProfileSettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    security: boolean;
    mentions: boolean;
    follows: boolean;
    likes: boolean;
    comments: boolean;
  };
}
```

### ProfilePrivacyData

```typescript
interface ProfilePrivacyData {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showBirthdate: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  allowFollowRequests: boolean;
  allowTagging: boolean;
  allowSearchIndexing: boolean;
}
```

## Cache API

### Cache Keys

```typescript
export const PROFILE_CACHE_KEYS = {
  USER_PROFILE: (userId: string | number) => `profile:user:${userId}`,
  CURRENT_USER_PROFILE: () => `profile:current:user`,
  USER_STATS: (userId: string | number) => `profile:stats:${userId}`,
  USER_FOLLOWERS: (userId: string | number, page: number, size: number) => `profile:followers:${userId}:${page}:${size}`,
  USER_FOLLOWINGS: (userId: string | number, page: number, size: number) => `profile:followings:${userId}:${page}:${size}`,
  USER_SEARCH: (query: string, page: number, size: number) => `profile:search:${query}:${page}:${size}`,
  USER_SUGGESTIONS: (userId: string | number, limit: number) => `profile:suggestions:${userId}:${limit}`,
  USER_SETTINGS: (userId: string | number) => `profile:settings:${userId}`,
  USER_PRIVACY: (userId: string | number) => `profile:privacy:${userId}`,
  USER_ONLINE_STATUS: (userId: string | number) => `profile:online:${userId}`,
  USER_ACTIVITY: (userId: string | number, period: string, page: number, size: number) => `profile:activity:${userId}:${period}:${page}:${size}`,
  PROFILE_VIEWS: (userId: string | number, period: string) => `profile:views:${userId}:${period}`,
  USER_MUTUAL_CONNECTIONS: (userId1: string | number, userId2: string | number) => `profile:mutual:${userId1}:${userId2}`,
  USER_BLOCKED: (userId: string | number, page: number, size: number) => `profile:blocked:${userId}:${page}:${size}`,
  USER_MUTED: (userId: string | number, page: number, size: number) => `profile:muted:${userId}:${page}:${size}`,
  PROFILE_COMPLETION: (userId: string | number) => `profile:completion:${userId}`,
  USER_VERIFICATION: (userId: string | number) => `profile:verification:${userId}`,
  PROFILE_ANALYTICS: (userId: string | number, period: string) => `profile:analytics:${userId}:${period}`,
  USER_SOCIAL_LINKS: (userId: string | number) => `profile:social:${userId}`,
  USER_INTERESTS: (userId: string | number) => `profile:interests:${userId}`,
  USER_SKILLS: (userId: string | number) => `profile:skills:${userId}`,
  USER_EDUCATION: (userId: string | number) => `profile:education:${userId}`,
  USER_WORK_EXPERIENCE: (userId: string | number) => `profile:work:${userId}`,
  USER_PORTFOLIO: (userId: string | number, page: number, size: number) => `profile:portfolio:${userId}:${page}:${size}`,
  USER_TESTIMONIALS: (userId: string | number, page: number, size: number) => `profile:testimonials:${userId}:${page}:${size}`,
  USER_RECOMMENDATIONS: (userId: string | number, page: number, size: number) => `profile:recommendations:${userId}:${page}:${size}`
} as const;
```

### Cache TTL

```typescript
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

### Cache Invalidation

```typescript
export const PROFILE_CACHE_INVALIDATION = {
  invalidateUser: (userId: string | number) => [
    `profile:user:${userId}`,
    `profile:stats:${userId}`,
    `profile:followers:${userId}`,
    `profile:followings:${userId}`,
    `profile:settings:${userId}`,
    `profile:privacy:${userId}`,
    `profile:online:${userId}`,
    `profile:activity:${userId}`,
    `profile:views:${userId}`,
    `profile:completion:${userId}`,
    `profile:verification:${userId}`,
    `profile:analytics:${userId}`,
    `profile:social:${userId}`,
    `profile:interests:${userId}`,
    `profile:skills:${userId}`,
    `profile:education:${userId}`,
    `profile:work:${userId}`,
    `profile:portfolio:${userId}`,
    `profile:testimonials:${userId}`,
    `profile:recommendations:${userId}`
  ],
  
  invalidateConnections: (userId: string | number) => [
    `profile:followers:${userId}`,
    `profile:followings:${userId}`,
    `profile:blocked:${userId}`,
    `profile:muted:${userId}`
  ],
  
  invalidateSettings: (userId: string | number) => [
    `profile:settings:${userId}`,
    `profile:privacy:${userId}`
  ],
  
  invalidateAchievements: (userId: string | number) => [
    `profile:achievements:${userId}`,
    `profile:badges:${userId}`,
    `profile:reputation:${userId}`
  ],
  
  invalidateProfileData: (userId: string | number) => [
    `profile:user:${userId}`,
    `profile:stats:${userId}`,
    `profile:completion:${userId}`,
    `profile:verification:${userId}`,
    `profile:analytics:${userId}`
  ],
  
  invalidateAllUserData: (userId: string | number) => [
    `profile:*:${userId}`
  ],
  
  invalidateSearchData: () => [
    `profile:search:*`,
    `profile:suggestions:*`
  ]
} as const;
```

## Utilities

### Cache Utils

```typescript
export class ProfileCacheUtils {
  static generateProfileKey(userId: string | number): string;
  static generateFollowersKey(userId: string | number, page: number, size: number): string;
  static generateSearchKey(query: string, page: number, size: number): string;
  static parseCacheKey(key: string): { type: string; params: any };
  static isValidCacheKey(key: string): boolean;
}
```

### Validation Utils

```typescript
export class ProfileValidationUtils {
  static validateUsername(username: string): boolean;
  static validateEmail(email: string): boolean;
  static validateBio(bio: string): boolean;
  static validateSettings(settings: any): boolean;
  static validatePrivacy(privacy: any): boolean;
  static sanitizeProfileData(data: any): any;
}
```

### Performance Utils

```typescript
export class ProfilePerformanceUtils {
  static measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }>;
  static measureMemoryUsage(): number;
  static createDebouncedFunction<T extends (...args: any[]) => any>(fn: T, delay: number): T;
  static createThrottledFunction<T extends (...args: any[]) => any>(fn: T, limit: number): T;
}
```

---

## Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `PROFILE_NOT_FOUND` | Profile not found | Check user ID |
| `PROFILE_UPDATE_FAILED` | Profile update failed | Check permissions |
| `CONNECTION_FAILED` | Connection operation failed | Check user IDs |
| `SETTINGS_UPDATE_FAILED` | Settings update failed | Check settings format |
| `CACHE_ERROR` | Cache operation failed | Check cache configuration |
| `NETWORK_ERROR` | Network request failed | Check network connection |
| `VALIDATION_ERROR` | Data validation failed | Check input format |
| `PERMISSION_DENIED` | Permission denied | Check user permissions |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded | Wait and retry |
| `SERVER_ERROR` | Server error | Contact support |

---

This API reference provides comprehensive documentation for all Profile Feature APIs. For more detailed examples and usage patterns, see the [Quick Start Guide](./QUICK_START.md) and [Complete Documentation](./README.md).
