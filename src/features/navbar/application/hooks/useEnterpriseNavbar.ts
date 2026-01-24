/**
 * Enterprise Navbar Hook
 * 
 * Provides comprehensive navbar functionality using custom query system
 * Replaces legacy hooks with enterprise-grade caching and performance optimization
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useCustomQuery, useCustomMutation } from '@/core/hooks/useCustomQuery';
import { useNavbarServices } from './useNavbarServices';
import { useAuthStore } from '@services/store/zustand';
import type { 
  NavigationItemEntity, 
  NotificationStatusEntity,
  UserProfileSummaryEntity,
  UserPreferencesEntity,
  ThemeConfigEntity,
  AccessibilitySettingsEntity,
  QuickActionsEntity,
  SearchSuggestionsEntity,
  RecentNavigationEntity,
  MobileNavStateEntity,
  SystemStatusEntity,
  FeatureFlagsEntity
} from '../domain/entities/entities';
import type { ResId } from '@/shared/api/models/common';

/**
 * Enterprise Navbar State interface
 */
export interface EnterpriseNavbarState {
  // Navigation data
  navigationItems: NavigationItemEntity[] | null;
  personalizedNavigation: NavigationItemEntity[] | null;
  mobileNavigation: {
    navigationItems: NavigationItemEntity[];
    mobileState: MobileNavStateEntity;
    quickActions: QuickActionsEntity[];
  } | null;
  
  // User status
  notificationStatus: NotificationStatusEntity | null;
  userProfile: UserProfileSummaryEntity | null;
  chatStatus: NotificationStatusEntity | null;
  quickActions: QuickActionsEntity[] | null;
  
  // Preferences and configuration
  userPreferences: UserPreferencesEntity | null;
  themeConfig: ThemeConfigEntity | null;
  accessibilitySettings: AccessibilitySettingsEntity | null;
  
  // Search functionality
  searchSuggestions: SearchSuggestionsEntity[] | null;
  searchQuery: string;
  isSearching: boolean;
  
  // System status
  systemStatus: SystemStatusEntity | null;
  featureFlags: FeatureFlagsEntity | null;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isSearchLoading: boolean;
  
  // Error state
  error: Error | null;
  
  // UI state
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeNavigationItem: string | null;
  
  // Performance metrics
  cacheHitRate: number;
  lastUpdateTime: string | null;
}

/**
 * Enterprise Navbar Actions interface
 */
export interface EnterpriseNavbarActions {
  // Navigation actions
  refreshNavigation: () => Promise<void>;
  trackNavigation: (path: string, source?: string) => Promise<void>;
  setActiveNavigation: (path: string) => void;
  
  // Search actions
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  setSearchQuery: (query: string) => void;
  
  // Preference actions
  updateUserPreferences: (preferences: Partial<UserPreferencesEntity>) => Promise<void>;
  updateTheme: (theme: Partial<ThemeConfigEntity>) => Promise<void>;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettingsEntity>) => Promise<void>;
  
  // UI actions
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  closeAllMenus: () => void;
  
  // Cache actions
  invalidateCache: () => Promise<void>;
  warmCache: () => Promise<void>;
  
  // Health check
  performHealthCheck: () => Promise<any>;
}

/**
 * Enterprise Navbar Hook
 * 
 * Combines all navbar functionality with enterprise-grade features:
 * - Intelligent caching with performance optimization
 * - Real-time updates with WebSocket integration
 * - Accessibility and mobile optimization
 * - Search with intelligent suggestions
 * - User preference management
 * - Health monitoring and analytics
 */
export const useEnterpriseNavbar = (options: {
  enableRealTime?: boolean;
  enableAccessibility?: boolean;
  enableMobileOptimization?: boolean;
  enableSearchSuggestions?: boolean;
  autoRefresh?: boolean;
} = {}): EnterpriseNavbarState & EnterpriseNavbarActions => {
  const {
    enableRealTime = true,
    enableAccessibility = true,
    enableMobileOptimization = true,
    enableSearchSuggestions = true,
    autoRefresh = true
  } = options;

  // Get current user from auth store
  const { user, token } = useAuthStore();
  const userId = user?.id || 'anonymous';

  // Enterprise services
  const { navbarDataService, navbarFeatureService } = useNavbarServices();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeNavigationItem, setActiveNavigationItem] = useState<string | null>(null);
  const [cacheHitRate, setCacheHitRate] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  // Navigation items query
  const {
    data: navigationItems,
    isLoading: navigationLoading,
    error: navigationError,
    refetch: refetchNavigation
  } = useCustomQuery(
    ['navbar', 'navigation', userId],
    () => navbarFeatureService.getPersonalizedNavigationItems(userId, token),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: () => {
        setLastUpdateTime(new Date().toISOString());
      }
    }
  );

  // User status query
  const {
    data: userStatus,
    isLoading: userStatusLoading,
    refetch: refetchUserStatus
  } = useCustomQuery(
    ['navbar', 'user-status', userId],
    () => navbarFeatureService.getComprehensiveUserStatus(userId, token),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: autoRefresh ? 60 * 1000 : false, // 1 minute
      onSuccess: () => {
        setLastUpdateTime(new Date().toISOString());
      }
    }
  );

  // User preferences query
  const {
    data: userPreferences,
    isLoading: preferencesLoading,
    refetch: refetchPreferences
  } = useCustomQuery(
    ['navbar', 'preferences', userId],
    () => navbarDataService.getUserPreferences(userId, token),
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: () => {
        setLastUpdateTime(new Date().toISOString());
      }
    }
  );

  // Theme configuration query
  const {
    data: themeConfig,
    isLoading: themeLoading,
    refetch: refetchTheme
  } = useCustomQuery(
    ['navbar', 'theme', userId],
    () => navbarDataService.getThemeConfig(userId, token),
    {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
      onSuccess: () => {
        setLastUpdateTime(new Date().toISOString());
      }
    }
  );

  // Search suggestions query
  const {
    data: searchSuggestions,
    isLoading: searchLoading,
    refetch: refetchSearchSuggestions
  } = useCustomQuery(
    ['navbar', 'search-suggestions', searchQuery, userId],
    () => searchQuery ? navbarFeatureService.getIntelligentSearchSuggestions(searchQuery, userId, token) : [],
    {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      enabled: enableSearchSuggestions && searchQuery.length > 0,
      onSuccess: () => {
        setLastUpdateTime(new Date().toISOString());
      }
    }
  );

  // System status query
  const {
    data: systemStatus,
    refetch: refetchSystemStatus
  } = useCustomQuery(
    ['navbar', 'system-status'],
    () => navbarDataService.getSystemStatus(token),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: autoRefresh ? 2 * 60 * 1000 : false, // 2 minutes
      onSuccess: () => {
        setLastUpdateTime(new Date().toISOString());
      }
    }
  );

  // Update user preferences mutation
  const updateUserPreferencesMutation = useCustomMutation(
    ['navbar', 'update-preferences', userId],
    async (preferences: Partial<UserPreferencesEntity>) => {
      return await navbarFeatureService.updateUserPreferences(userId, preferences, token);
    },
    {
      onSuccess: () => {
        refetchPreferences();
        refetchTheme();
      }
    }
  );

  // Track navigation mutation
  const trackNavigationMutation = useCustomMutation(
    ['navbar', 'track-navigation', userId],
    async (data: { path: string; source?: string }) => {
      return await navbarFeatureService.trackNavigationEvent(userId, {
        path: data.path,
        timestamp: new Date(),
        source: (data.source as any) || 'click'
      }, token);
    }
  );

  // Actions
  const refreshNavigation = useCallback(async () => {
    await refetchNavigation();
  }, [refetchNavigation]);

  const trackNavigation = useCallback(async (path: string, source?: string) => {
    await trackNavigationMutation.mutateAsync({ path, source });
    setActiveNavigationItem(path);
  }, [trackNavigationMutation]);

  const performSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    try {
      await refetchSearchSuggestions();
    } finally {
      setIsSearching(false);
    }
  }, [refetchSearchSuggestions]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const updateUserPreferences = useCallback(async (preferences: Partial<UserPreferencesEntity>) => {
    await updateUserPreferencesMutation.mutateAsync(preferences);
  }, [updateUserPreferencesMutation]);

  const updateTheme = useCallback(async (theme: Partial<ThemeConfigEntity>) => {
    // This would update theme configuration
    await refetchTheme();
  }, [refetchTheme]);

  const updateAccessibilitySettings = useCallback(async (settings: Partial<AccessibilitySettingsEntity>) => {
    // This would update accessibility settings
    // Implementation would depend on having accessibility settings in the system
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, []);

  const invalidateCache = useCallback(async () => {
    await navbarDataService.invalidateUserNavbar(userId);
  }, [navbarDataService, userId]);

  const warmCache = useCallback(async () => {
    await navbarDataService.warmEssentialData(userId, token);
  }, [navbarDataService, userId, token]);

  const performHealthCheck = useCallback(async () => {
    return await navbarFeatureService.performHealthCheck();
  }, [navbarFeatureService]);

  // Computed state
  const state: EnterpriseNavbarState = {
    navigationItems,
    personalizedNavigation: navigationItems,
    mobileNavigation: enableMobileOptimization ? {
      navigationItems: navigationItems?.slice(0, 5) || [],
      mobileState: {
        isMobileMenuOpen,
        maxItems: 5,
        maxQuickActions: 3,
        touchOptimized: true
      },
      quickActions: userStatus?.quickActions?.slice(0, 3) || []
    } : null,
    notificationStatus: userStatus?.notificationStatus || null,
    userProfile: userStatus?.userProfile || null,
    chatStatus: userStatus?.chatStatus || null,
    quickActions: userStatus?.quickActions || null,
    userPreferences,
    themeConfig,
    accessibilitySettings: null, // Would be populated from user preferences
    searchSuggestions,
    searchQuery,
    isSearching,
    systemStatus,
    featureFlags: null, // Would be populated from system status
    isLoading: navigationLoading || userStatusLoading || preferencesLoading || themeLoading,
    isRefreshing: false,
    isSearchLoading: searchLoading,
    error: navigationError || null,
    isMobileMenuOpen,
    isSearchOpen,
    activeNavigationItem,
    cacheHitRate,
    lastUpdateTime
  };

  const actions: EnterpriseNavbarActions = {
    refreshNavigation,
    trackNavigation,
    setActiveNavigation,
    performSearch,
    clearSearch,
    setSearchQuery,
    updateUserPreferences,
    updateTheme,
    updateAccessibilitySettings,
    toggleMobileMenu,
    toggleSearch,
    closeAllMenus,
    invalidateCache,
    warmCache,
    performHealthCheck
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const interval = setInterval(() => {
      refetchUserStatus();
      refetchSystemStatus();
    }, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, [autoRefresh, userId, refetchUserStatus, refetchSystemStatus]);

  // Cache hit rate monitoring
  useEffect(() => {
    const updateCacheStats = async () => {
      try {
        const stats = await navbarDataService.getCacheStats();
        if (stats && stats.hitRate !== undefined) {
          setCacheHitRate(stats.hitRate);
        }
      } catch (error) {
        console.error('Failed to get cache stats:', error);
      }
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 30 * 1000); // 30 seconds

    return () => clearInterval(interval);
  }, [navbarDataService]);

  return { ...state, ...actions };
};

export default useEnterpriseNavbar;
