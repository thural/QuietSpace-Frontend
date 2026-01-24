/**
 * Enterprise Profile Example Component
 * 
 * Demonstrates the usage of enterprise profile hooks with
 * advanced user management, social features, and profile optimization
 */

import React, { useState } from 'react';
import { useEnterpriseProfile } from '@features/profile/application/hooks/useEnterpriseProfile';
import { useProfileMigration } from '@features/profile/application/hooks/useProfileMigration';
import type { 
  UserProfileEntity, 
  UserProfileStatsEntity,
  UserConnectionEntity 
} from '@features/profile/domain/entities/IProfileRepository';

/**
 * Enterprise Profile Example Props
 */
interface EnterpriseProfileExampleProps {
  className?: string;
  enableMigrationMode?: boolean;
  userManagementLevel?: 'basic' | 'enhanced' | 'maximum';
  socialFeaturesLevel?: 'disabled' | 'basic' | 'enhanced';
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Error Message Component
 */
const ErrorMessage: React.FC<{ error: string; onRetry: () => void; onClear: () => void }> = ({ 
  error, 
  onRetry, 
  onClear 
}) => (
  <div className="error-message p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-red-700">{error}</div>
    <div className="mt-2 flex space-x-2">
      <button 
        onClick={onRetry}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Retry
      </button>
      <button 
        onClick={onClear}
        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
      >
        Clear
      </button>
    </div>
  </div>
);

/**
 * Profile Header Component
 */
const ProfileHeader: React.FC<{
  profile: UserProfileEntity | null;
  stats: UserProfileStatsEntity | null;
  onEditProfile: () => void;
  onUploadAvatar: (file: File) => Promise<void>;
  onUploadCover: (file: File) => Promise<void>;
}> = ({ profile, stats, onEditProfile, onUploadAvatar, onUploadCover }) => {
  if (!profile) return null;

  return (
    <div className="profile-header">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        {profile.coverPhoto && (
          <img 
            src={profile.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-4 right-4">
          <label className="px-3 py-2 bg-white bg-opacity-90 rounded text-sm cursor-pointer hover:bg-opacity-100">
            Change Cover
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUploadCover(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex items-end -mt-12 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onUploadAvatar(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="ml-6 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
            <p className="text-gray-600">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-gray-700">{profile.bio}</p>
            )}
          </div>

          {/* Actions */}
          <div className="ml-4 space-x-2">
            <button
              onClick={onEditProfile}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.postsCount}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.followersCount}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.followingCount}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.likesCount}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Profile Completeness Component
 */
const ProfileCompleteness: React.FC<{
  completeness: number;
  onCalculate: () => Promise<void>;
}> = ({ completeness, onCalculate }) => {
  return (
    <div className="profile-completeness p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Profile Completeness</h3>
        <button
          onClick={onCalculate}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Calculate
        </button>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Complete</span>
          <span>{completeness}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        {completeness < 50 && 'Complete your profile to get better visibility and connections'}
        {completeness >= 50 && completeness < 80 && 'Good progress! Add more details to complete your profile'}
        {completeness >= 80 && 'Excellent! Your profile is almost complete'}
        {completeness === 100 && 'Perfect! Your profile is 100% complete'}
      </div>
    </div>
  );
};

/**
 * Social Features Component
 */
const SocialFeatures: React.FC<{
  followers: UserConnectionEntity[] | null;
  followings: UserConnectionEntity[] | null;
  connectionStatus: string;
  onFollow: () => void;
  onUnfollow: () => void;
  onBlock: () => void;
  onGetFollowers: () => void;
  onGetFollowings: () => void;
}> = ({ 
  followers, 
  followings, 
  connectionStatus, 
  onFollow, 
  onUnfollow, 
  onBlock,
  onGetFollowers,
  onGetFollowings
}) => {
  return (
    <div className="social-features p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Social Features</h3>
      
      {/* Connection Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Connection Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            connectionStatus === 'mutual' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'following' ? 'bg-blue-100 text-blue-800' :
            connectionStatus === 'follower' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {connectionStatus}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {connectionStatus === 'none' && (
            <button
              onClick={onFollow}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Follow
            </button>
          )}
          {(connectionStatus === 'following' || connectionStatus === 'mutual') && (
            <button
              onClick={onUnfollow}
              className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Unfollow
            </button>
          )}
          <button
            onClick={onBlock}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Block
          </button>
        </div>
      </div>

      {/* Followers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Followers ({followers?.length || 0})</h4>
          <button
            onClick={onGetFollowers}
            className="text-blue-500 text-sm hover:text-blue-600"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {followers && followers.length > 0 ? (
            followers.slice(0, 5).map((follower, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span>{follower.username}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No followers yet</div>
          )}
        </div>
      </div>

      {/* Followings */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Following ({followings?.length || 0})</h4>
          <button
            onClick={onGetFollowings}
            className="text-blue-500 text-sm hover:text-blue-600"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {followings && followings.length > 0 ? (
            followings.slice(0, 5).map((following, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span>{following.username}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">Not following anyone yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Enterprise Profile Example Component
 */
export const EnterpriseProfileExample: React.FC<EnterpriseProfileExampleProps> = ({
  className = '',
  enableMigrationMode = false,
  userManagementLevel = 'enhanced',
  socialFeaturesLevel = 'enhanced'
}) => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Use either migration hook or direct enterprise hook
  const profile = enableMigrationMode 
    ? useProfileMigration({
        useEnterpriseHooks: true,
        enableFallback: true,
        logMigrationEvents: true,
        userManagementLevel,
        socialFeaturesLevel
      })
    : useEnterpriseProfile();

  // Handle profile actions
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      await profile.uploadAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleUploadCover = async (file: File) => {
    try {
      await profile.uploadCoverPhoto(file);
    } catch (error) {
      console.error('Error uploading cover photo:', error);
    }
  };

  const handleFollow = async () => {
    if (profile.selectedUserId) {
      await profile.followUser(profile.selectedUserId);
    }
  };

  const handleUnfollow = async () => {
    if (profile.selectedUserId) {
      await profile.unfollowUser(profile.selectedUserId);
    }
  };

  const handleBlock = async () => {
    if (profile.selectedUserId) {
      await profile.blockUser(profile.selectedUserId);
    }
  };

  return (
    <div className={`enterprise-profile-example max-w-4xl mx-auto ${className}`}>
      {/* Migration Info */}
      {enableMigrationMode && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Migration Mode</span>
            <div className="text-xs text-purple-600">
              Status: {profile.migration.isUsingEnterprise ? 'Enterprise' : 'Legacy'}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            <div>User Management: {profile.migration.config.userManagementLevel}</div>
            <div>Social Features: {profile.migration.config.socialFeaturesLevel}</div>
            <div>Performance: {profile.migration.performance.enterpriseHookTime.toFixed(2)}ms</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Profile</h1>
            <div className="flex space-x-2">
              <button
                onClick={profile.refreshProfile}
                disabled={profile.isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300"
              >
                {profile.isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={profile.getCurrentProfile}
                className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                My Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile.profile}
            stats={profile.stats}
            onEditProfile={handleEditProfile}
            onUploadAvatar={handleUploadAvatar}
            onUploadCover={handleUploadCover}
          />

          {/* Loading State */}
          {profile.isLoading && <LoadingSpinner />}

          {/* Error State */}
          {profile.error && (
            <ErrorMessage 
              error={profile.error} 
              onRetry={profile.retry}
              onClear={profile.clearError}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          <ProfileCompleteness
            completeness={profile.profileCompleteness}
            onCalculate={profile.calculateProfileCompleteness}
          />

          {/* Social Features */}
          {socialFeaturesLevel !== 'disabled' && (
            <SocialFeatures
              followers={profile.followers}
              followings={profile.followings}
              connectionStatus={profile.connectionStatus}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onBlock={handleBlock}
              onGetFollowers={profile.getFollowers}
              onGetFollowings={profile.getFollowings}
            />
          )}

          {/* Quick Actions */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => profile.updateActivityStatus('active')}
                className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Set Active Status
              </button>
              <button
                onClick={() => profile.setOnlineStatus(true)}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Set Online
              </button>
              <button
                onClick={profile.invalidateCache}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Clear Cache
              </button>
            </div>
          </div>

          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-6 bg-gray-100 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
              <div className="space-y-2 text-xs">
                <div>Selected User: {profile.selectedUserId || 'None'}</div>
                <div>Connection Status: {profile.connectionStatus}</div>
                <div>Profile Completeness: {profile.profileCompleteness}%</div>
                <div>Cache Hit Rate: {profile.cacheHitRate}%</div>
                <div>Activity Status: {profile.activityStatus}</div>
                <div>Is Online: {profile.isOnline.toString()}</div>
                <div>Loading: {profile.isLoading.toString()}</div>
                <div>Error: {profile.error || 'None'}</div>
                <div>Last Update: {profile.lastUpdateTime?.toLocaleString() || 'Never'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseProfileExample;
