/**
 * Profile State Management with Zustand.
 * 
 * Advanced state management for profile feature using Zustand
 * with persistence, real-time sync, and performance optimization.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfileEntity,
  UserProfileStatsEntity,
  UserConnectionEntity,
  ProfileAccessEntity,
  CompleteProfileEntity
} from "../domain";

/**
 * Profile state interface for Zustand store.
 * 
 * Defines the complete state structure for profile management
 * including user data, UI state, and operational state.
 */
export interface ProfileState {
  // User profile data
  userProfile: UserProfileEntity | null;
  
  // User statistics
  userStats: UserProfileStatsEntity | null;
  
  // Profile access information
  profileAccess: ProfileAccessEntity | null;
  
  // User connections
  followers: UserConnectionEntity[];
  followings: UserConnectionEntity[];
  
  // UI state
  viewFollowers: boolean;
  viewFollowings: boolean;
  activeTab: string;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Error handling
  error: Error | null;
  
  // Last update timestamps
  lastProfileUpdate: number | null;
  lastFollowersUpdate: number | null;
  lastFollowingsUpdate: number | null;
  
  // Real-time sync state
  isOnline: boolean;
  lastSyncTime: number | null;
  
  // Cache and performance
  cacheExpiry: number;
  retryCount: number;
  
  // Optimistic updates
  optimisticFollows: Map<string | number, 'follow' | 'unfollow'>;
  pendingUpdates: Set<string>;
  
  // Background sync
  syncInProgress: boolean;
  syncQueue: Array<{ type: string; data: any; timestamp: number }>;
  lastBackgroundSync: number | null;
  
  // Real-time subscriptions
  subscriptions: Map<string, () => void>;
  realTimeEnabled: boolean;
}

/**
 * Profile actions interface for Zustand store.
 * 
 * Defines all possible actions that can be performed
 * on the profile state.
 */
export interface ProfileActions {
  // Profile data actions
  setUserProfile: (profile: UserProfileEntity) => void;
  updateUserProfile: (updates: Partial<UserProfileEntity>) => void;
  clearUserProfile: () => void;
  
  // Statistics actions
  setUserStats: (stats: UserProfileStatsEntity) => void;
  updateUserStats: (updates: Partial<UserProfileStatsEntity>) => void;
  clearUserStats: () => void;
  
  // Connection actions
  setFollowers: (followers: UserConnectionEntity[]) => void;
  setFollowings: (followings: UserConnectionEntity[]) => void;
  addFollower: (follower: UserConnectionEntity) => void;
  removeFollower: (followerId: string | number) => void;
  addFollowing: (following: UserConnectionEntity) => void;
  removeFollowing: (followingId: string | number) => void;
  
  // Access control actions
  setProfileAccess: (access: ProfileAccessEntity) => void;
  clearProfileAccess: () => void;
  
  // UI state actions
  setViewFollowers: (view: boolean) => void;
  setViewFollowings: (view: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  // Loading state actions
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  
  // Error handling actions
  setError: (error: Error | null) => void;
  clearError: () => void;
  
  // Sync actions
  setOnlineStatus: (isOnline: boolean) => void;
  setLastSyncTime: (time: number) => void;
  
  // Cache actions
  setCacheExpiry: (expiry: number) => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
  
  // Reset actions
  resetProfileState: () => void;
  resetUIState: () => void;
  resetAllState: () => void;
  
  // Optimistic update actions
  setOptimisticFollow: (userId: string | number, action: 'follow' | 'unfollow') => void;
  clearOptimisticFollow: (userId: string | number) => void;
  addPendingUpdate: (updateId: string) => void;
  removePendingUpdate: (updateId: string) => void;
  
  // Background sync actions
  setSyncInProgress: (inProgress: boolean) => void;
  addToSyncQueue: (item: { type: string; data: any }) => void;
  removeFromSyncQueue: (index: number) => void;
  clearSyncQueue: () => void;
  setLastBackgroundSync: (time: number) => void;
  
  // Real-time actions
  addSubscription: (id: string, unsubscribe: () => void) => void;
  removeSubscription: (id: string) => void;
  setRealTimeEnabled: (enabled: boolean) => void;
  clearAllSubscriptions: () => void;
}

/**
 * Profile Zustand Store.
 * 
 * Advanced state management store for profile feature with:
 * - Persistence across sessions
 * - Real-time synchronization
 * - Performance optimization
 * - Type safety with TypeScript
 * - Computed values
 */
export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      // Initial state
      userProfile: null,
      userStats: null,
      profileAccess: null,
      followers: [],
      followings: [],
      viewFollowers: false,
      viewFollowings: false,
      activeTab: 'posts',
      isLoading: false,
      isRefreshing: false,
      error: null,
      lastProfileUpdate: null,
      lastFollowersUpdate: null,
      lastFollowingsUpdate: null,
      isOnline: navigator.onLine,
      lastSyncTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes
      retryCount: 0,
      
      // Optimistic updates
      optimisticFollows: new Map(),
      pendingUpdates: new Set(),
      
      // Background sync
      syncInProgress: false,
      syncQueue: [],
      lastBackgroundSync: null,
      
      // Real-time subscriptions
      subscriptions: new Map(),
      realTimeEnabled: false,

      // Profile data actions
      setUserProfile: (profile) => {
        set({
          userProfile: profile,
          lastProfileUpdate: Date.now()
        });
      },

      updateUserProfile: (updates) => {
        const currentProfile = get().userProfile;
        if (currentProfile) {
          set({
            userProfile: { ...currentProfile, ...updates },
            lastProfileUpdate: Date.now()
          });
        }
      },

      clearUserProfile: () => {
        set({
          userProfile: null,
          lastProfileUpdate: Date.now()
        });
      },

      // Statistics actions
      setUserStats: (stats) => {
        set({ userStats: stats });
      },

      updateUserStats: (updates) => {
        const currentStats = get().userStats;
        if (currentStats) {
          set({ userStats: { ...currentStats, ...updates } });
        }
      },

      clearUserStats: () => {
        set({ userStats: null });
      },

      // Connection actions
      setFollowers: (followers) => {
        set({ 
          followers, 
          lastFollowersUpdate: Date.now() 
        });
      },

      setFollowings: (followings) => {
        set({ 
          followings, 
          lastFollowingsUpdate: Date.now() 
        });
      },

      addFollower: (follower) => {
        const currentFollowers = get().followers;
        set({ 
          followers: [...currentFollowers, follower],
          lastFollowersUpdate: Date.now() 
        });
      },

      removeFollower: (followerId) => {
        const currentFollowers = get().followers;
        set({ 
          followers: currentFollowers.filter(f => f.id !== followerId),
          lastFollowersUpdate: Date.now() 
        });
      },

      addFollowing: (following) => {
        const currentFollowings = get().followings;
        set({ 
          followings: [...currentFollowings, following],
          lastFollowingsUpdate: Date.now() 
        });
      },

      removeFollowing: (followingId) => {
        const currentFollowings = get().followings;
        set({ 
          followings: currentFollowings.filter(f => f.id !== followingId),
          lastFollowingsUpdate: Date.now() 
        });
      },

      // Access control actions
      setProfileAccess: (access) => {
        set({ profileAccess: access });
      },

      clearProfileAccess: () => {
        set({ profileAccess: null });
      },

      // UI state actions
      setViewFollowers: (view) => {
        set({ viewFollowers: view });
      },

      setViewFollowings: (view) => {
        set({ viewFollowings: view });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      // Loading state actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setRefreshing: (refreshing) => {
        set({ isRefreshing: refreshing });
      },

      // Error handling actions
      setError: (error) => {
        set({ error, retryCount: error ? get().retryCount + 1 : 0 });
      },

      clearError: () => {
        set({ error: null });
      },

      // Sync actions
      setOnlineStatus: (isOnline) => {
        set({ isOnline });
      },

      setLastSyncTime: (time) => {
        set({ lastSyncTime: time });
      },

      // Cache actions
      setCacheExpiry: (expiry) => {
        set({ cacheExpiry: expiry });
      },

      incrementRetryCount: () => {
        set({ retryCount: get().retryCount + 1 });
      },

      resetRetryCount: () => {
        set({ retryCount: 0 });
      },

      // Reset actions
      resetProfileState: () => {
        set({
          userProfile: null,
          userStats: null,
          profileAccess: null,
          lastProfileUpdate: Date.now()
        });
      },

      resetUIState: () => {
        set({
          viewFollowers: false,
          viewFollowings: false,
          activeTab: 'posts'
        });
      },

      resetAllState: () => {
        set({
          userProfile: null,
          userStats: null,
          profileAccess: null,
          followers: [],
          followings: [],
          viewFollowers: false,
          viewFollowings: false,
          activeTab: 'posts',
          isLoading: false,
          isRefreshing: false,
          error: null,
          lastProfileUpdate: Date.now(),
          lastFollowersUpdate: Date.now(),
          lastFollowingsUpdate: Date.now(),
          isOnline: navigator.onLine,
          lastSyncTime: Date.now(),
          cacheExpiry: 5 * 60 * 1000,
          retryCount: 0,
          optimisticFollows: new Map(),
          pendingUpdates: new Set(),
          syncInProgress: false,
          syncQueue: [],
          lastBackgroundSync: null,
          subscriptions: new Map(),
          realTimeEnabled: false
        });
      },
      
      // Optimistic update actions
      setOptimisticFollow: (userId, action) => {
        const current = get().optimisticFollows;
        const updated = new Map(current);
        updated.set(userId, action);
        set({ optimisticFollows: updated });
      },
      
      clearOptimisticFollow: (userId) => {
        const current = get().optimisticFollows;
        const updated = new Map(current);
        updated.delete(userId);
        set({ optimisticFollows: updated });
      },
      
      addPendingUpdate: (updateId) => {
        const current = get().pendingUpdates;
        const updated = new Set(current);
        updated.add(updateId);
        set({ pendingUpdates: updated });
      },
      
      removePendingUpdate: (updateId) => {
        const current = get().pendingUpdates;
        const updated = new Set(current);
        updated.delete(updateId);
        set({ pendingUpdates: updated });
      },
      
      // Background sync actions
      setSyncInProgress: (inProgress) => {
        set({ syncInProgress: inProgress });
      },
      
      addToSyncQueue: (item) => {
        const current = get().syncQueue;
        set({ 
          syncQueue: [...current, { ...item, timestamp: Date.now() }] 
        });
      },
      
      removeFromSyncQueue: (index) => {
        const current = get().syncQueue;
        set({ 
          syncQueue: current.filter((_, i) => i !== index) 
        });
      },
      
      clearSyncQueue: () => {
        set({ syncQueue: [] });
      },
      
      setLastBackgroundSync: (time) => {
        set({ lastBackgroundSync: time });
      },
      
      // Real-time actions
      addSubscription: (id, unsubscribe) => {
        const current = get().subscriptions;
        const updated = new Map(current);
        updated.set(id, unsubscribe);
        set({ subscriptions: updated });
      },
      
      removeSubscription: (id) => {
        const current = get().subscriptions;
        const unsubscribe = current.get(id);
        if (unsubscribe) {
          unsubscribe();
        }
        const updated = new Map(current);
        updated.delete(id);
        set({ subscriptions: updated });
      },
      
      setRealTimeEnabled: (enabled) => {
        set({ realTimeEnabled: enabled });
      },
      
      clearAllSubscriptions: () => {
        const current = get().subscriptions;
        current.forEach(unsubscribe => unsubscribe());
        set({ subscriptions: new Map() });
      }
    }),
    {
      name: 'profile-store',
      version: 1,
      // Only persist essential state to reduce storage size
      partialize: (state) => ({
        userProfile: state.userProfile,
        userStats: state.userStats,
        profileAccess: state.profileAccess,
        followers: state.followers,
        followings: state.followings,
        viewFollowers: state.viewFollowers,
        viewFollowings: state.viewFollowings,
        activeTab: state.activeTab,
        lastProfileUpdate: state.lastProfileUpdate,
        lastFollowersUpdate: state.lastFollowersUpdate,
        lastFollowingsUpdate: state.lastFollowingsUpdate
      })
    }
  )
);
