/**
 * Enterprise Profile Example Component
 * 
 * Demonstrates the usage of enterprise profile hooks with
 * advanced user management, social features, and profile optimization
 */

import React from 'react';
import { useEnterpriseProfile } from '@features/profile/application/hooks/useEnterpriseProfile';
import { useProfileMigration } from '@features/profile/application/hooks/useProfileMigration';
import type { 
  UserProfileEntity, 
  UserProfileStatsEntity,
  UserConnectionEntity 
} from '@features/profile/domain/entities/IProfileRepository';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Enterprise Profile Example Props
 */
export interface IEnterpriseProfileExampleProps extends IBaseComponentProps {
  className?: string;
  enableMigrationMode?: boolean;
  userManagementLevel?: 'basic' | 'enhanced' | 'maximum';
  socialFeaturesLevel?: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Enterprise Profile Example State
 */
export interface IEnterpriseProfileExampleState extends IBaseComponentState {
  currentView: 'overview' | 'profile' | 'connections' | 'settings';
  selectedUserId: string;
  userManagementLevel: 'basic' | 'enhanced' | 'maximum';
  socialFeaturesLevel: 'disabled' | 'basic' | 'enhanced';
  lastUpdate: Date | null;
  isRealTimeEnabled: boolean;
}

/**
 * Enterprise Profile Example Component
 * 
 * Demonstrates enterprise profile management with:
 * - Advanced user management features
 * - Social features and connections
 * - Profile optimization and analytics
 * - Migration support for legacy systems
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseProfileExample extends BaseClassComponent<IEnterpriseProfileExampleProps, IEnterpriseProfileExampleState> {
  private updateTimer: number | null = null;

  protected override getInitialState(): Partial<IEnterpriseProfileExampleState> {
    const { 
      enableMigrationMode = false,
      userManagementLevel = 'enhanced',
      socialFeaturesLevel = 'enhanced'
    } = this.props;

    return {
      currentView: 'overview',
      selectedUserId: 'demo-user-123',
      userManagementLevel,
      socialFeaturesLevel,
      lastUpdate: null,
      isRealTimeEnabled: true
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeProfile();
    this.startRealTimeUpdates();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.stopRealTimeUpdates();
  }

  /**
   * Initialize profile system
   */
  private initializeProfile(): void {
    console.log('👤 Enterprise profile example initialized');
    this.safeSetState({ lastUpdate: new Date() });
  }

  /**
   * Start real-time updates
   */
  private startRealTimeUpdates(): void {
    if (!this.state.isRealTimeEnabled) return;

    this.updateTimer = window.setInterval(() => {
      this.refreshProfileData();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Stop real-time updates
   */
  private stopRealTimeUpdates(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  /**
   * Refresh profile data
   */
  private refreshProfileData(): void {
    this.safeSetState({ lastUpdate: new Date() });
    console.log('🔄 Profile data refreshed');
  }

  /**
   * Handle view navigation
   */
  private navigateToView = (view: 'overview' | 'profile' | 'connections' | 'settings'): void => {
    this.safeSetState({ currentView: view });
  };

  /**
   * Handle user selection
   */
  private handleUserSelection = (userId: string): void => {
    this.safeSetState({ selectedUserId: userId });
    this.refreshProfileData();
  };

  /**
   * Handle user management level change
   */
  private handleUserManagementLevelChange = (level: 'basic' | 'enhanced' | 'maximum'): void => {
    this.safeSetState({ userManagementLevel: level });
  };

  /**
   * Handle social features level change
   */
  private handleSocialFeaturesLevelChange = (level: 'disabled' | 'basic' | 'enhanced'): void => {
    this.safeSetState({ socialFeaturesLevel: level });
  };

  /**
   * Toggle real-time updates
   */
  private toggleRealTimeUpdates = (): void => {
    const newEnabled = !this.state.isRealTimeEnabled;
    this.safeSetState({ isRealTimeEnabled: newEnabled });
    
    if (newEnabled) {
      this.startRealTimeUpdates();
    } else {
      this.stopRealTimeUpdates();
    }
  };

  /**
   * Get enterprise profile data
   */
  private getEnterpriseProfileData() {
    const { enableMigrationMode = false } = this.props;
    const { selectedUserId, userManagementLevel, socialFeaturesLevel } = this.state;

    // Use either migration hook or direct enterprise hook
    const profileData = enableMigrationMode 
      ? this.useProfileMigrationClass(selectedUserId, userManagementLevel, socialFeaturesLevel)
      : this.useEnterpriseProfileClass(selectedUserId, userManagementLevel, socialFeaturesLevel);

    return profileData;
  }

  /**
   * Class-based version of useEnterpriseProfile hook
   */
  private useEnterpriseProfileClass(userId: string, userManagementLevel: string, socialFeaturesLevel: string) {
    // Mock implementation that matches the hook interface
    return {
      profile: {
        id: userId,
        username: 'john_doe',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Enterprise user with advanced profile management',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        joinedAt: new Date('2023-01-15'),
        lastActive: new Date(),
        isVerified: true,
        isPremium: true,
        stats: {
          followers: 1250,
          following: 342,
          posts: 89,
          likes: 2341,
          shares: 156
        }
      } as UserProfileEntity,
      stats: {
        totalViews: 15420,
        profileViews: 8932,
        engagementRate: 0.087,
        growthRate: 0.023,
        activityScore: 0.945
      } as UserProfileStatsEntity,
      connections: [
        { id: '1', userId: 'user-456', username: 'jane_smith', connectionType: 'following', since: new Date('2023-02-01') },
        { id: '2', userId: 'user-789', username: 'bob_johnson', connectionType: 'follower', since: new Date('2023-03-15') }
      ] as UserConnectionEntity[],
      isLoading: false,
      error: null,
      refresh: () => this.refreshProfileData(),
      updateProfile: (data: any) => console.log('Updating profile:', data),
      followUser: (userId: string) => console.log('Following user:', userId),
      unfollowUser: (userId: string) => console.log('Unfollowing user:', userId),
      getConnections: () => [],
      getStats: () => ({} as UserProfileStatsEntity)
    };
  }

  /**
   * Class-based version of useProfileMigration hook
   */
  private useProfileMigrationClass(userId: string, userManagementLevel: string, socialFeaturesLevel: string) {
    // Mock implementation that matches the hook interface
    return {
      profile: this.useEnterpriseProfileClass(userId, userManagementLevel, socialFeaturesLevel).profile,
      migration: {
        isUsingEnterprise: true,
        config: { userManagementLevel, socialFeaturesLevel },
        errors: [],
        performance: {
          enterpriseHookTime: 8.2,
          legacyHookTime: 23.5,
          migrationTime: 1.8
        }
      },
      isLoading: false,
      error: null,
      refresh: () => this.refreshProfileData(),
      migrateToEnterprise: () => console.log('Migrating to enterprise profile'),
      validateMigration: () => true
    };
  }

  /**
   * Render navigation tabs
   */
  private renderNavigation(): React.ReactNode {
    const { currentView } = this.state;

    return (
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['overview', 'profile', 'connections', 'settings'] as const).map(view => (
          <button
            key={view}
            onClick={() => this.navigateToView(view)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === view
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render status bar
   */
  private renderStatusBar(): React.ReactNode {
    const { isRealTimeEnabled, lastUpdate } = this.state;

    return (
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </span>
          <button
            onClick={this.toggleRealTimeUpdates}
            className={`px-3 py-1 rounded text-xs font-medium ${
              isRealTimeEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isRealTimeEnabled ? '🟢 Real-time' : '⚪ Offline'}
          </button>
        </div>
        <button
          onClick={() => this.refreshProfileData()}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>
    );
  }

  /**
   * Render overview section
   */
  private renderOverview(): React.ReactNode {
    const { userManagementLevel, socialFeaturesLevel } = this.state;
    const profileData = this.getEnterpriseProfileData();
    const { profile, stats } = profileData;

    return (
      <div className="space-y-6">
        {/* User Management Level */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">User Management Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Management Level
              </label>
              <select
                value={userManagementLevel}
                onChange={(e) => this.handleUserManagementLevelChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="basic">Basic - Essential profile features</option>
                <option value="enhanced">Enhanced - Advanced analytics and insights</option>
                <option value="maximum">Maximum - Full enterprise capabilities</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Features
              </label>
              <select
                value={socialFeaturesLevel}
                onChange={(e) => this.handleSocialFeaturesLevelChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="disabled">Disabled - No social features</option>
                <option value="basic">Basic - Essential social interactions</option>
                <option value="enhanced">Enhanced - Full social platform</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Profile Overview</h3>
          
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h4 className="text-lg font-medium">{profile.displayName}</h4>
              <p className="text-gray-600">@{profile.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                {profile.isVerified && (
                  <span className="text-blue-500 text-sm">✓ Verified</span>
                )}
                {profile.isPremium && (
                  <span className="text-purple-500 text-sm">⭐ Premium</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.likes}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-medium text-blue-800">Total Views</h4>
              <div className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-medium text-green-800">Engagement Rate</h4>
              <div className="text-2xl font-bold text-green-600">{(stats.engagementRate * 100).toFixed(1)}%</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded">
              <h4 className="font-medium text-purple-800">Growth Rate</h4>
              <div className="text-2xl font-bold text-purple-600">{(stats.growthRate * 100).toFixed(1)}%</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded">
              <h4 className="font-medium text-yellow-800">Activity Score</h4>
              <div className="text-2xl font-bold text-yellow-600">{(stats.activityScore * 100).toFixed(0)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', enableMigrationMode = false } = this.props;
    const { currentView } = this.state;
    
    // Get profile data
    const profileData = this.getEnterpriseProfileData();

    return (
      <div className={`enterprise-profile-example ${className}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Profile Management</h1>
            <p className="text-gray-600 mt-1">Advanced user profiles with social features and analytics</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-white border-b">
          {this.renderNavigation()}
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2">
          {this.renderStatusBar()}
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          {/* Loading State */}
          {profileData.isLoading && (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" color="primary" />
            </div>
          )}

          {/* Error State */}
          {profileData.error && (
            <ErrorMessage
              error={profileData.error}
              onRetry={() => profileData.refresh()}
              onClear={() => {/* Clear error logic */}}
              variant="default"
            />
          )}

          {/* Content Based on Current View */}
          {!profileData.isLoading && !profileData.error && (
            <>
              {currentView === 'overview' && this.renderOverview()}
              
              {currentView === 'profile' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Profile Details</h2>
                  <div className="space-y-4">
                    <div>
                      <strong>Display Name:</strong> {profileData.profile.displayName}
                    </div>
                    <div>
                      <strong>Email:</strong> {profileData.profile.email}
                    </div>
                    <div>
                      <strong>Bio:</strong> {profileData.profile.bio}
                    </div>
                    <div>
                      <strong>Location:</strong> {profileData.profile.location}
                    </div>
                    <div>
                      <strong>Website:</strong> {profileData.profile.website}
                    </div>
                    <div>
                      <strong>Joined:</strong> {profileData.profile.joinedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
              
              {currentView === 'connections' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Connections</h2>
                  <div className="space-y-4">
                    {profileData.connections.map((connection, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <div className="font-medium">{connection.username}</div>
                          <div className="text-sm text-gray-600">{connection.connectionType}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Since {connection.since.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentView === 'settings' && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <h3 className="font-medium mb-2">Privacy Settings</h3>
                      <p className="text-gray-600">Configure profile visibility and data sharing preferences</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <h3 className="font-medium mb-2">Notification Preferences</h3>
                      <p className="text-gray-600">Manage email and push notification settings</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      <h3 className="font-medium mb-2">Account Security</h3>
                      <p className="text-gray-600">Two-factor authentication and password management</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default EnterpriseProfileExample;
