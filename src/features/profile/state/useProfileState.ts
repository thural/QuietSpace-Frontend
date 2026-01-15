/**
 * Profile State Management Hooks.
 * 
 * Custom hooks that integrate Zustand store with the profile
 * application layer for advanced state management capabilities.
 */

import { useCallback, useMemo, useEffect } from "react";
import { useProfileStore } from "./ProfileStore";
import { useProfileEnhanced } from "../application/useProfile";
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from "../domain";
import {
  createProfileAccess,
  createCompleteProfile
} from "../domain";

/**
 * Hook that combines repository pattern with Zustand state management.
 * 
 * This hook provides the best of both worlds:
 * - Repository pattern for clean data access
 * - Zustand for advanced state management
 * - Real-time synchronization
 * - Performance optimization
 * - Persistence across sessions
 * 
 * @param {string | number} userId - The user ID to manage state for
 * @param {Object} config - Configuration for state management
 * @returns {{
 *   userProfile: UserProfileEntity | null,
 *   userStats: UserProfileStatsEntity | null,
 *   profileAccess: ProfileAccessEntity | null,
 *   followers: UserConnectionEntity[],
 *   followings: UserConnectionEntity[],
 *   isLoading: boolean,
 *   error: Error | null,
 *   viewFollowers: boolean,
 *   viewFollowings: boolean,
 *   activeTab: string,
 *   isOnline: boolean,
 *   needsSync: boolean,
 *   lastSyncTime: number | null,
 *   actions: Object,
 *   computed: Object
 * }} - Complete state management with actions and computed values
 */
export const useProfileWithState = (
  userId: string | number,
  config: {
    enablePersistence?: boolean;
    syncInterval?: number;
    enableRealTime?: boolean;
  } = {}
) => {
  // Get Zustand store actions
  const {
    // State getters
    userProfile,
    userStats,
    profileAccess,
    followers,
    followings,
    viewFollowers,
    viewFollowings,
    activeTab,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    cacheExpiry,
    retryCount,

    // Actions
    setUserProfile,
    updateUserProfile,
    setUserStats,
    setProfileAccess,
    setFollowers,
    setFollowings,
    setViewFollowers,
    setViewFollowings,
    setActiveTab,
    setLoading,
    setError,
    setOnlineStatus,
    setLastSyncTime,
    clearError,
    incrementRetryCount,
    resetRetryCount,
    resetProfileState,
    resetUIState: resetUIStateStore
  } = useProfileStore();

  // Get repository data
  const repositoryData = useProfileEnhanced(userId);

  // Sync repository data with Zustand state
  useEffect(() => {
    if (repositoryData.userProfile && repositoryData.userProfile !== userProfile) {
      setUserProfile(repositoryData.userProfile);
    }
    if (repositoryData.userStats && repositoryData.userStats !== userStats) {
      setUserStats(repositoryData.userStats);
    }
    if (repositoryData.profileAccess && repositoryData.profileAccess !== profileAccess) {
      setProfileAccess(repositoryData.profileAccess);
    }
    if (repositoryData.userConnections) {
      if (repositoryData.userConnections.followers !== followers) {
        setFollowers(repositoryData.userConnections.followers);
      }
      if (repositoryData.userConnections.followings !== followings) {
        setFollowings(repositoryData.userConnections.followings);
      }
    }
  }, [repositoryData, userProfile, userStats, profileAccess, followers, followings, setUserProfile, setUserStats, setProfileAccess, setFollowers, setFollowings]);

  // Real-time sync functionality
  useEffect(() => {
    const handleOnlineStatus = () => {
      setOnlineStatus(navigator.onLine);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'profile-store' && event.newValue) {
        try {
          const parsedState = JSON.parse(event.newValue);
          // Update local state with storage changes
          if (parsedState.state?.userProfile) {
            setUserProfile(parsedState.state.userProfile);
          }
          if (parsedState.state?.userStats) {
            setUserStats(parsedState.state.userStats);
          }
        } catch (error) {
          console.warn('Failed to parse profile store from storage:', error);
        }
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setOnlineStatus, setUserProfile, setUserStats]);

  // Auto-sync functionality
  useEffect(() => {
    if (!config.enableRealTime || !config.syncInterval) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const needsSync = !lastSyncTime || (now - lastSyncTime) > config.syncInterval;

      if (needsSync && isOnline) {
        // Trigger sync logic here
        setLastSyncTime(now);
        clearError();
        resetRetryCount();
      }
    }, config.syncInterval);

    return () => clearInterval(interval);
  }, [config.enableRealTime, config.syncInterval, isOnline, lastSyncTime, setLastSyncTime, clearError, resetRetryCount]);

  // Computed values
  const computed = useMemo(() => ({
    // Profile completion
    profileCompletion: userProfile ? 
      Math.round((Object.values(userProfile).filter(Boolean).length / 7) * 100) : 0,
    
    // Profile strength (simplified calculation)
    profileStrength: userProfile && userStats ? 
      Math.min(
        (userProfile.isVerified ? 20 : 0) +
        Math.min((userStats.followersCount / 100) * 30, 30) +
        Math.min((userStats.postsCount / 50) * 20, 20) +
        Math.min((userStats.followingsCount / 50) * 10, 10),
        100
      ) : 0,
    
    // Engagement rate
    engagementRate: userStats ? 
      Math.round(((userStats.likesCount + userStats.commentsCount) / Math.max(userStats.followersCount, 1)) * 100) : 0,
    
    // Cache status
    isCacheExpired: lastSyncTime ? (Date.now() - lastSyncTime) > cacheExpiry : true,
    
    // Network status
    connectionStatus: isOnline ? 'online' : 'offline',
    
    // Error status
    hasError: !!error,
    needsRetry: !!error && retryCount < 3,
    
    // Sync status
    needsSync: !lastSyncTime || (Date.now() - lastSyncTime) > (config.syncInterval || 60000)
  }), [userProfile, userStats, lastSyncTime, cacheExpiry, retryCount, error, isOnline, config.syncInterval]);

  // Actions
  const actions = useMemo(() => ({
    // Profile actions
    updateProfile: (updates: Partial<UserProfileEntity>) => {
      updateUserProfile(updates);
      setError(null);
    },
    
    // Connection actions
    followUser: (targetUserId: string | number) => {
      setLoading(true);
      // Would implement follow logic here
      setTimeout(() => {
        const newFollowing: UserConnectionEntity = {
          id: targetUserId,
          username: `user${targetUserId}`,
          bio: '',
          photo: { type: 'avatar', id: 'default', name: 'User', url: '' },
          isFollowing: true,
          isMutual: false,
          connectedAt: new Date().toISOString()
        };
        setFollowings([...followings, newFollowing]);
        setLoading(false);
      }, 1000);
    },
    
    unfollowUser: (targetUserId: string | number) => {
      setLoading(true);
      setTimeout(() => {
        setFollowings(followings.filter(f => f.id !== targetUserId));
        setLoading(false);
      }, 1000);
    },
    
    // UI actions
    toggleFollowersView: () => {
      setViewFollowers(!viewFollowers);
    },
    
    toggleFollowingsView: () => {
      setViewFollowings(!viewFollowings);
    },
    
    switchTab: (tab: string) => {
      setActiveTab(tab);
    },
    
    // Sync actions
    syncNow: () => {
      setLastSyncTime(Date.now());
      clearError();
      resetRetryCount();
    },
    
    // Error actions
    retryAction: () => {
      if (error && retryCount < 3) {
        incrementRetryCount();
        // Would trigger retry logic here
      }
    },
    
    clearErrorAction: () => {
      clearError();
      resetRetryCount();
    },
    
    // Reset actions
    resetProfile: () => {
      resetProfileState();
      clearError();
      resetRetryCount();
    },
    
    resetUIState: () => {
      resetUIStateStore();
    }
  }), [
    updateUserProfile,
    followings,
    viewFollowers,
    viewFollowings,
    error,
    retryCount,
    setFollowings,
    setViewFollowers,
    setViewFollowings,
    setActiveTab,
    setLastSyncTime,
    setLoading,
    setError,
    clearError,
    incrementRetryCount,
    resetRetryCount,
    resetProfileState,
    resetUIStateStore
  ]);

  return {
    // State
    userProfile,
    userStats,
    profileAccess,
    followers,
    followings,
    isLoading,
    error,
    viewFollowers,
    viewFollowings,
    activeTab,
    isOnline,
    needsSync: computed.needsSync,
    lastSyncTime,
    
    // Actions
    actions,
    
    // Computed values
    computed
  };
};

/**
 * Hook for real-time profile updates.
 * 
 * This hook provides real-time synchronization capabilities
 * for profile data across multiple tabs and windows.
 * 
 * @returns {{
 *   isRealTimeEnabled: boolean,
 *   lastUpdate: number | null,
 *   forceUpdate: () => void,
 *   syncStatus: 'synced' | 'pending' | 'error'
 * }} - Real-time update capabilities
 */
export const useRealTimeProfile = () => {
  const {
    userProfile,
    lastSyncTime,
    isOnline,
    error,
    setLastSyncTime,
    clearError
  } = useProfileStore();

  // Real-time capabilities
  const isRealTimeEnabled = typeof Storage !== 'undefined';
  const lastUpdate = lastSyncTime;
  
  // Sync status
  const syncStatus = useMemo(() => {
    if (error) return 'error';
    if (!lastSyncTime) return 'pending';
    return 'synced';
  }, [error, lastSyncTime]);

  // Force update function
  const forceUpdate = useCallback(() => {
    setLastSyncTime(Date.now());
    clearError();
    
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'profile-store-force-update',
      newValue: JSON.stringify({ timestamp: Date.now() })
    }));
  }, [setLastSyncTime, clearError]);

  return {
    isRealTimeEnabled,
    lastUpdate,
    forceUpdate,
    syncStatus
  };
};
