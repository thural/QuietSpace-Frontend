/**
 * Advanced Profile State Management Hook.
 * 
 * This hook provides advanced state management capabilities including:
 * - Optimistic updates for follow/unfollow actions
 * - Background synchronization
 * - Real-time subscriptions
 * - Performance optimizations
 * - State persistence and recovery
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useProfileStore } from "./ProfileStore";
import { useProfile } from "../application/useProfile";
import type { ResId } from "@/api/schemas/inferred/common";
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from "../domain";

/**
 * Configuration for advanced profile state management.
 */
export interface AdvancedProfileConfig {
  /** Enable optimistic updates for follow/unfollow actions */
  enableOptimisticUpdates?: boolean;
  /** Enable background synchronization */
  enableBackgroundSync?: boolean;
  /** Background sync interval in milliseconds */
  syncInterval?: number;
  /** Enable real-time updates */
  enableRealTime?: boolean;
  /** Enable state persistence */
  enablePersistence?: boolean;
  /** Maximum retry attempts for failed operations */
  maxRetries?: number;
  /** Cache expiry time in milliseconds */
  cacheExpiry?: number;
}

/**
 * Hook that provides advanced profile state management.
 * 
 * @param {ResId} userId - The user ID to manage state for
 * @param {AdvancedProfileConfig} config - Configuration for advanced features
 * @returns {{
 *   // Basic profile data
 *   userProfile: UserProfileEntity | null,
 *   userStats: UserProfileStatsEntity | null,
 *   profileAccess: ProfileAccessEntity | null,
 *   completeProfile: CompleteProfileEntity | null,
 *   userConnections: { followers: UserConnectionEntity[], followings: UserConnectionEntity[] },
 *   
 *   // State management
 *   isLoading: boolean,
 *   error: Error | null,
 *   
 *   // UI state
 *   viewFollowers: boolean,
 *   viewFollowings: boolean,
 *   activeTab: string,
 *   
 *   // Advanced state
 *   isOnline: boolean,
 *   syncInProgress: boolean,
 *   realTimeEnabled: boolean,
 *   optimisticFollows: Map<string | number, 'follow' | 'unfollow'>,
 *   pendingUpdates: Set<string>,
 *   syncQueue: Array<{ type: string; data: any; timestamp: number }>,
 *   
 *   // Actions
 *   actions: {
 *     // Basic actions
 *     refreshProfile: () => Promise<void>,
 *     followUser: () => Promise<void>,
 *     unfollowUser: () => Promise<void>,
 *     toggleFollowers: () => void,
 *     toggleFollowings: () => void,
 *     setActiveTab: (tab: string) => void,
 *     
 *     // Advanced actions
 *     optimisticFollow: (userId: string | number) => void,
 *     optimisticUnfollow: (userId: string | number) => void,
 *     syncNow: () => Promise<void>,
 *     enableRealTime: () => void,
 *     disableRealTime: () => void,
 *     clearCache: () => void,
 *     resetState: () => void
 *   },
 *   
 *   // Computed values
 *   computed: {
 *     isFollowingOptimistically: boolean,
 *     hasPendingUpdates: boolean,
 *     needsSync: boolean,
 *     cacheAge: number,
 *     canRetry: boolean
 *   }
 * }} - Advanced profile state management
 */
export const useAdvancedProfileState = (
  userId: ResId,
  config: AdvancedProfileConfig = {}
) => {
  const {
    enableOptimisticUpdates = true,
    enableBackgroundSync = true,
    syncInterval = 30000, // 30 seconds
    enableRealTime = false,
    enablePersistence = true,
    maxRetries = 3,
    cacheExpiry = 5 * 60 * 1000 // 5 minutes
  } = config;

  // Get Zustand store state and actions
  const store = useProfileStore();
  
  // Get basic profile data from application hook
  const profileData = useProfile(userId, {
    useRepositoryPattern: true,
    enablePersistence,
    enableRealTime
  });

  // Refs for managing intervals and timeouts
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimistic follow action
  const optimisticFollow = useCallback((targetUserId: string | number) => {
    if (!enableOptimisticUpdates) return;
    
    store.setOptimisticFollow(targetUserId, 'follow');
    store.addPendingUpdate(`follow-${targetUserId}-${Date.now()}`);
    
    // Add to sync queue for background processing
    store.addToSyncQueue({
      type: 'follow',
      data: { userId: targetUserId }
    });
  }, [enableOptimisticUpdates, store]);

  // Optimistic unfollow action
  const optimisticUnfollow = useCallback((targetUserId: string | number) => {
    if (!enableOptimisticUpdates) return;
    
    store.setOptimisticFollow(targetUserId, 'unfollow');
    store.addPendingUpdate(`unfollow-${targetUserId}-${Date.now()}`);
    
    // Add to sync queue for background processing
    store.addToSyncQueue({
      type: 'unfollow',
      data: { userId: targetUserId }
    });
  }, [enableOptimisticUpdates, store]);

  // Background sync function
  const syncNow = useCallback(async () => {
    if (!enableBackgroundSync || store.syncInProgress) return;
    
    store.setSyncInProgress(true);
    
    try {
      const queue = store.syncQueue;
      
      // Process each item in the sync queue
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        
        try {
          // Process the sync item based on its type
          switch (item.type) {
            case 'follow':
              await profileData.followUser();
              break;
            case 'unfollow':
              await profileData.unfollowUser();
              break;
            default:
              console.warn(`Unknown sync item type: ${item.type}`);
          }
          
          // Remove processed item from queue
          store.removeFromSyncQueue(i);
          i--; // Adjust index since we removed an item
          
          // Clear optimistic state for this user
          if (item.data.userId) {
            store.clearOptimisticFollow(item.data.userId);
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.type}:`, error);
          
          // If max retries not reached, keep in queue
          if (store.retryCount < maxRetries) {
            store.incrementRetryCount();
          } else {
            // Remove item after max retries
            store.removeFromSyncQueue(i);
            i--;
            store.resetRetryCount();
          }
        }
      }
      
      store.setLastBackgroundSync(Date.now());
    } finally {
      store.setSyncInProgress(false);
    }
  }, [enableBackgroundSync, store, profileData, maxRetries]);

  // Real-time management
  const enableRealTimeUpdates = useCallback(() => {
    if (!enableRealTime) return;
    
    store.setRealTimeEnabled(true);
    
    // Add real-time subscription (placeholder for WebSocket/EventSource)
    const unsubscribe = () => {
      // Implementation would go here
      console.log('Real-time subscription ended');
    };
    
    store.addSubscription('profile-updates', unsubscribe);
  }, [enableRealTime, store]);

  const disableRealTimeUpdates = useCallback(() => {
    store.setRealTimeEnabled(false);
    store.removeSubscription('profile-updates');
  }, [store]);

  // Clear cache
  const clearCache = useCallback(() => {
    store.resetAllState();
    store.setCacheExpiry(cacheExpiry);
  }, [store, cacheExpiry]);

  // Reset state
  const resetState = useCallback(() => {
    store.resetAllState();
  }, [store]);

  // Setup background sync interval
  useEffect(() => {
    if (enableBackgroundSync && syncInterval > 0) {
      syncIntervalRef.current = setInterval(() => {
        if (store.isOnline && store.syncQueue.length > 0) {
          syncNow();
        }
      }, syncInterval);
      
      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
        }
      };
    }
  }, [enableBackgroundSync, syncInterval, store.isOnline, store.syncQueue.length, syncNow]);

  // Setup online/offline detection
  useEffect(() => {
    const handleOnline = () => store.setOnlineStatus(true);
    const handleOffline = () => store.setOnlineStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      store.clearAllSubscriptions();
    };
  }, [store]);

  // Computed values
  const computed = useMemo(() => ({
    isFollowingOptimistically: store.optimisticFollows.has(userId),
    hasPendingUpdates: store.pendingUpdates.size > 0,
    needsSync: store.syncQueue.length > 0,
    cacheAge: store.lastProfileUpdate ? Date.now() - store.lastProfileUpdate : 0,
    canRetry: store.retryCount < maxRetries
  }), [store, userId, maxRetries]);

  // Actions object
  const actions = useMemo(() => ({
    // Basic actions
    refreshProfile: profileData.refreshProfile,
    followUser: profileData.followUser,
    unfollowUser: profileData.unfollowUser,
    toggleFollowers: profileData.toggleFollowers,
    toggleFollowings: profileData.toggleFollowings,
    setActiveTab: store.setActiveTab,
    
    // Advanced actions
    optimisticFollow,
    optimisticUnfollow,
    syncNow,
    enableRealTime: enableRealTimeUpdates,
    disableRealTime: disableRealTimeUpdates,
    clearCache,
    resetState
  }), [profileData, store, optimisticFollow, optimisticUnfollow, syncNow, enableRealTimeUpdates, disableRealTimeUpdates, clearCache, resetState]);

  return {
    // Basic profile data
    userProfile: profileData.userProfile,
    userStats: profileData.userStats,
    profileAccess: profileData.profileAccess,
    completeProfile: profileData.completeProfile,
    userConnections: profileData.userConnections,
    
    // State management
    isLoading: profileData.isLoading,
    error: profileData.error,
    
    // UI state
    viewFollowers: profileData.viewFollowers,
    viewFollowings: profileData.viewFollowings,
    activeTab: store.activeTab,
    
    // Advanced state
    isOnline: store.isOnline,
    syncInProgress: store.syncInProgress,
    realTimeEnabled: store.realTimeEnabled,
    optimisticFollows: store.optimisticFollows,
    pendingUpdates: store.pendingUpdates,
    syncQueue: store.syncQueue,
    
    // Actions
    actions,
    
    // Computed values
    computed
  };
};
