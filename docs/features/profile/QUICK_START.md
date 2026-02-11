# Profile Feature - Quick Start Guide

## 🚀 Quick Start

Get up and running with the Profile Feature in minutes!

## Installation

### 1. Install Dependencies

```bash
npm install @tanstack/react-query zustand reflect-metadata
```

### 2. Setup DI Container

```typescript
// src/core/di/AppContainer.ts
import { createProfileContainer } from '@features/profile/di/container';

export function createAppContainer(): Container {
  const container = new Container();
  
  // ... other container setup
  
  // Register profile feature services
  console.log('👤 Registering profile feature container...');
  const profileContainer = createProfileContainer();
  
  return container;
}
```

### 3. Basic Usage

```typescript
// src/pages/ProfilePage.tsx
import { EnterpriseProfileContainer } from '@features/profile/components';

export default function ProfilePage() {
  return <EnterpriseProfileContainer />;
}
```

## 🎯 Common Use Cases

### 1. Display User Profile

```typescript
import { useProfile } from '@features/profile/application/hooks';

function UserProfile({ userId }: { userId: string }) {
  const { profile, isLoading, error } = useProfile({ userId });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{profile?.username}</h1>
      <p>{profile?.bio}</p>
      <p>Followers: {profile?.followersCount}</p>
    </div>
  );
}
```

### 2. Update User Profile

```typescript
function ProfileUpdate({ userId }: { userId: string }) {
  const { updateProfile } = useProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile(userId, {
        username: 'new-username',
        bio: 'Updated bio'
      });
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return <button onClick={handleUpdate}>Update Profile</button>;
}
```

### 3. Follow/Unfollow Users

```typescript
function FollowButton({ userId, targetUserId }: { userId: string; targetUserId: string }) {
  const { followUser, unfollowUser } = useProfile();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId, targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(userId, targetUserId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  return (
    <button onClick={handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

### 4. Search Users

```typescript
function UserSearch() {
  const { searchUsers, searchResults, isLoading } = useProfile();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (query.trim()) {
      await searchUsers(query, { limit: 20 });
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      
      {searchResults && (
        <div>
          {searchResults.map(user => (
            <div key={user.id}>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Manage Settings

```typescript
function ProfileSettings({ userId }: { userId: string }) {
  const { settings, updateSettings, hasUnsavedChanges } = useProfileSettings({ userId });

  const handleThemeChange = async (theme: string) => {
    try {
      await updateSettings(userId, { ...settings, theme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>Theme:</label>
        <select
          value={settings?.theme || 'light'}
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      {hasUnsavedChanges && (
        <p style={{ color: 'orange' }}>You have unsaved changes</p>
      )}
    </div>
  );
}
```

## 🏗️ Component Examples

### Complete Profile Page

```typescript
import { useState } from 'react';
import { useProfile, useProfileConnections } from '@features/profile/application/hooks';

function CompleteProfilePage({ userId }: { userId: string }) {
  const { profile, stats, isLoading: profileLoading } = useProfile({ userId });
  const { 
    followers, 
    followings, 
    isFollowing, 
    followUser, 
    unfollowUser,
    isLoading: connectionsLoading 
  } = useProfileConnections({ userId });

  const [activeTab, setActiveTab] = useState('about');

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId, profile?.id);
      } else {
        await followUser(userId, profile?.id);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  if (profileLoading || connectionsLoading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={profile?.avatar} alt={profile?.username} />
        <div className="profile-info">
          <h1>{profile?.username}</h1>
          <p>{profile?.bio}</p>
          <div className="profile-stats">
            <span>{stats?.followersCount} followers</span>
            <span>{stats?.followingsCount} following</span>
            <span>{stats?.postsCount} posts</span>
          </div>
          <button onClick={handleFollowToggle}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          onClick={() => setActiveTab('about')}
          className={activeTab === 'about' ? 'active' : ''}
        >
          About
        </button>
        <button 
          onClick={() => setActiveTab('followers')}
          className={activeTab === 'followers' ? 'active' : ''}
        >
          Followers
        </button>
        <button 
          onClick={() => setActiveTab('following')}
          className={activeTab === 'following' ? 'active' : ''}
        >
          Following
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'about' && (
          <div className="about-section">
            <h2>About</h2>
            <p>{profile?.bio || 'No bio available'}</p>
            <p>Joined: {new Date(profile?.createdAt).toLocaleDateString()}</p>
            {profile?.isVerified && <span>✓ Verified</span>}
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="followers-section">
            <h2>Followers</h2>
            {followers?.map(follower => (
              <div key={follower.id} className="user-card">
                <h3>{follower.username}</h3>
                <p>{follower.email}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="following-section">
            <h2>Following</h2>
            {followings?.map(following => (
              <div key={following.id} className="user-card">
                <h3>{following.username}</h3>
                <p>{following.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Settings Page with Form

```typescript
function SettingsPage({ userId }: { userId: string }) {
  const { settings, privacy, updateSettings, updatePrivacy, hasUnsavedChanges } = useProfileSettings({ userId });

  const [localSettings, setLocalSettings] = useState(settings || {});
  const [localPrivacy, setLocalPrivacy] = useState(privacy || {});

  const handleSettingsChange = (field: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setLocalPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all([
        updateSettings(userId, localSettings),
        updatePrivacy(userId, localPrivacy)
      ]);
      console.log('All settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>General Settings</h2>
        <div className="form-group">
          <label>Theme:</label>
          <select
            value={localSettings.theme || 'light'}
            onChange={(e) => handleSettingsChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Language:</label>
          <select
            value={localSettings.language || 'en'}
            onChange={(e) => handleSettingsChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>Privacy Settings</h2>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={localPrivacy.showEmail || false}
              onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
            />
            Show email address
          </label>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={localPrivacy.allowSearchIndexing !== false}
              onChange={(e) => handlePrivacyChange('allowSearchIndexing', e.target.checked)}
            />
            Allow search engines to index profile
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          onClick={handleSaveAll}
          disabled={!hasUnsavedChanges}
          className="save-button"
        >
          Save Changes
        </button>
        
        {hasUnsavedChanges && (
          <span className="unsaved-warning">You have unsaved changes</span>
        )}
      </div>
    </div>
  );
}
```

## 🔧 Advanced Usage

### Custom Cache Configuration

```typescript
import { PROFILE_CACHE_TTL } from '@features/profile/data/cache';

// Override default TTL values
const customCacheConfig = {
  ...PROFILE_CACHE_TTL,
  USER_PROFILE: 30 * 60 * 1000,  // 30 minutes instead of 15
  USER_SEARCH: 5 * 60 * 1000,    // 5 minutes instead of 2
};
```

### Error Handling with Retry

```typescript
function RobustProfile({ userId }: { userId: string }) {
  const { profile, error, getProfile, clearError } = useProfile({ userId });

  const handleRetry = () => {
    clearError();
    getProfile(userId);
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Failed to load profile: {error.message}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return <div>{profile?.username}</div>;
}
```

### Performance Monitoring

```typescript
import { measureExecutionTime } from '../utils/performance';

function MonitoredProfile({ userId }: { userId: string }) {
  const { getProfile } = useProfile();

  const loadProfileWithMetrics = async () => {
    const { time, result } = await measureExecutionTime(() => getProfile(userId));
    console.log(`Profile loaded in ${time}ms`);
    return result;
  };

  return <button onClick={loadProfileWithMetrics}>Load Profile</button>;
}
```

## 🎨 Styling Tips

### CSS Classes

```css
/* Profile page styles */
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.profile-header img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.profile-info h1 {
  margin: 0 0 10px 0;
}

.profile-stats {
  display: flex;
  gap: 20px;
  margin: 10px 0;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.profile-tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
}

.profile-tabs button.active {
  border-bottom: 2px solid #007bff;
}

.user-card {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
}

.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.settings-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.settings-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.save-button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.unsaved-warning {
  color: #ff9800;
  font-weight: bold;
}
```

## 🚀 Next Steps

1. **Explore Full Documentation**: Read the complete [Profile Feature Documentation](./README.md)
2. **Check Examples**: Look at the component examples in the `components/` directory
3. **Run Tests**: Execute the test suite to understand the API
4. **Customize**: Adapt the components to match your design system
5. **Monitor Performance**: Use the built-in performance monitoring tools

## 🆘 Need Help?

- **Documentation**: [Complete Profile Documentation](./README.md)
- **Examples**: Check the `examples/` directory
- **Tests**: Look at `__tests__/` for usage patterns
- **Issues**: Report bugs or request features on GitHub

---

Happy coding! 🎉
