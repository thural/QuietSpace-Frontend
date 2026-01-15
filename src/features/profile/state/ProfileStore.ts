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
          retryCount: 0
        });
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
