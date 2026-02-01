/**
 * Enterprise Navbar Example Component
 * 
 * Demonstrates the usage of enterprise navbar hooks
 * Shows best practices for navbar management with custom query system
 */

import React from 'react';
import { useEnterpriseNavbar } from '../hooks/useEnterpriseNavbar';
import type {
  NavigationItemEntity,
  UserPreferencesEntity,
  ThemeConfigEntity
} from '../domain/entities/entities';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Navigation Item interface
 */
export interface INavigationItem {
  id: string;
  label: string;
  icon?: string;
  href: string;
  badge?: number;
  isActive?: boolean;
  children?: INavigationItem[];
}

/**
 * User Profile interface
 */
export interface IUserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  email?: string;
  role?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

/**
 * Chat Status interface
 */
export interface IChatStatus {
  unreadCount: number;
  isActive: boolean;
  lastMessage?: string;
  participants: number;
}

/**
 * Search Suggestion interface
 */
export interface ISearchSuggestion {
  id: string;
  text: string;
  type: 'page' | 'user' | 'content';
  url: string;
}

/**
 * System Status interface
 */
export interface ISystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  websocket: 'connected' | 'disconnected';
  cache: 'healthy' | 'degraded' | 'down';
}

/**
 * Enterprise Navbar Example Props
 */
export interface IEnterpriseNavbarExampleProps extends IBaseComponentProps {
  enableMobileMenu?: boolean;
  enableSearch?: boolean;
  enableNotifications?: boolean;
  enableThemeSwitcher?: boolean;
}

/**
 * Enterprise Navbar Example State
 */
export interface IEnterpriseNavbarExampleState extends IBaseComponentState {
  showSettings: boolean;
  showSearch: boolean;
  navigationItems: INavigationItem[];
  personalizedNavigation: INavigationItem[];
  mobileNavigation: INavigationItem[];
  notificationStatus: {
    unreadCount: number;
    isEnabled: boolean;
  };
  userProfile: IUserProfile | null;
  chatStatus: IChatStatus;
  quickActions: any[];
  userPreferences: UserPreferencesEntity;
  themeConfig: ThemeConfigEntity;
  searchSuggestions: ISearchSuggestion[];
  searchQuery: string;
  isSearching: boolean;
  systemStatus: ISystemStatus;
  isLoading: boolean;
  errorMessage: string | null;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeNavigationItem: string;
  cacheHitRate: number;
  lastUpdateTime: Date | null;
  isRealTimeEnabled: boolean;
}

/**
 * Enterprise Navbar Example Component
 * 
 * Demonstrates enterprise navbar management with:
 * - Multi-level navigation with personalization
 * - Real-time search with suggestions
 * - User profile and status management
 * - Chat integration and notifications
 * - Theme switching and preferences
 * - System status monitoring
 * - Mobile responsive design
 * - Cache optimization and performance metrics
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseNavbarExample extends BaseClassComponent<IEnterpriseNavbarExampleProps, IEnterpriseNavbarExampleState> {
  private updateTimer: number | null = null;

  protected override getInitialState(): Partial<IEnterpriseNavbarExampleState> {
    const {
      enableMobileMenu = true,
      enableSearch = true,
      enableNotifications = true,
      enableThemeSwitcher = true
    } = this.props;

    return {
      showSettings: false,
      showSearch: false,
      navigationItems: [],
      personalizedNavigation: [],
      mobileNavigation: [],
      notificationStatus: {
        unreadCount: 0,
        isEnabled: true
      },
      userProfile: null,
      chatStatus: {
        unreadCount: 0,
        isActive: false,
        participants: 0
      },
      quickActions: [],
      userPreferences: {
        language: 'en',
        theme: 'light',
        notifications: true,
        autoSave: true,
        compactMode: false
      } as UserPreferencesEntity,
      themeConfig: {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '8px',
        fontSize: '14px'
      } as ThemeConfigEntity,
      searchSuggestions: [],
      searchQuery: '',
      isSearching: false,
      systemStatus: {
        api: 'healthy',
        database: 'healthy',
        websocket: 'connected',
        cache: 'healthy'
      },
      isLoading: false,
      errorMessage: null,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      activeNavigationItem: '',
      cacheHitRate: 0.85,
      lastUpdateTime: null,
      isRealTimeEnabled: true
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeNavbar();
    this.startRealTimeUpdates();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupNavbar();
  }

  /**
   * Initialize navbar
   */
  private initializeNavbar(): void {
    console.log('🧭 Enterprise navbar example initialized');
    this.loadNavbarData();
  }

  /**
   * Start real-time updates
   */
  private startRealTimeUpdates(): void {
    if (!this.state.isRealTimeEnabled) return;

    this.updateTimer = window.setInterval(() => {
      this.refreshNavbarData();
    }, 10000); // Update every 10 seconds
  }

  /**
   * Cleanup navbar
   */
  private cleanupNavbar(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  /**
   * Load navbar data
   */
  private loadNavbarData = (): void => {
    const navbarData = this.getEnterpriseNavbarData();

    this.safeSetState({
      navigationItems: navbarData.navigationItems,
      personalizedNavigation: navbarData.personalizedNavigation,
      mobileNavigation: navbarData.mobileNavigation,
      notificationStatus: navbarData.notificationStatus,
      userProfile: navbarData.userProfile,
      chatStatus: navbarData.chatStatus,
      quickActions: navbarData.quickActions,
      userPreferences: navbarData.userPreferences,
      themeConfig: navbarData.themeConfig,
      searchSuggestions: navbarData.searchSuggestions,
      systemStatus: navbarData.systemStatus,
      isLoading: navbarData.isLoading,
      errorMessage: navbarData.error
    });
  };

  /**
   * Get enterprise navbar data
   */
  private getEnterpriseNavbarData() {
    // Mock implementation that matches the hook interface
    return {
      navigationItems: this.generateMockNavigationItems(),
      personalizedNavigation: this.generatePersonalizedNavigation(),
      mobileNavigation: this.generateMobileNavigation(),
      notificationStatus: {
        unreadCount: 3,
        isEnabled: true
      },
      userProfile: this.generateMockUserProfile(),
      chatStatus: {
        unreadCount: 5,
        isActive: true,
        lastMessage: 'Hey, how are you?',
        participants: 3
      },
      quickActions: [
        { id: '1', label: 'New Post', icon: '📝', action: () => console.log('New Post') },
        { id: '2', label: 'Upload', icon: '📤', action: () => console.log('Upload') },
        { id: '3', label: 'Settings', icon: '⚙️', action: () => console.log('Settings') }
      ],
      userPreferences: this.state.userPreferences,
      themeConfig: this.state.themeConfig,
      searchSuggestions: this.generateSearchSuggestions(),
      searchQuery: this.state.searchQuery,
      isSearching: this.state.isSearching,
      systemStatus: this.state.systemStatus,
      isLoading: false,
      error: null,
      refreshNavigation: this.refreshNavigation,
      trackNavigation: this.trackNavigation,
      setActiveNavigation: this.setActiveNavigation,
      performSearch: this.performSearch,
      toggleMobileMenu: this.toggleMobileMenu,
      toggleSearch: this.toggleSearch,
      updateUserPreferences: this.updateUserPreferences,
      switchTheme: this.switchTheme,
      markNotificationAsRead: this.markNotificationAsRead,
      openChat: this.openChat,
      getSystemHealth: this.getSystemHealth,
      clearNavigationCache: this.clearNavigationCache
    };
  }

  /**
   * Generate mock navigation items
   */
  private generateMockNavigationItems(): INavigationItem[] {
    return [
      {
        id: 'home',
        label: 'Home',
        icon: '🏠',
        href: '/',
        badge: 0
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        href: '/dashboard',
        badge: 2
      },
      {
        id: 'content',
        label: 'Content',
        icon: '📝',
        href: '/content',
        children: [
          {
            id: 'articles',
            label: 'Articles',
            href: '/content/articles'
          },
          {
            id: 'media',
            label: 'Media',
            href: '/content/media'
          }
        ]
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        href: '/analytics'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        href: '/settings'
      }
    ];
  }

  /**
   * Generate personalized navigation
   */
  private generatePersonalizedNavigation(): INavigationItem[] {
    return [
      {
        id: 'my-profile',
        label: 'My Profile',
        icon: '👤',
        href: '/profile/me'
      },
      {
        id: 'my-content',
        label: 'My Content',
        icon: '📄',
        href: '/content/me'
      },
      {
        id: 'bookmarks',
        label: 'Bookmarks',
        icon: '🔖',
        href: '/bookmarks'
      }
    ];
  }

  /**
   * Generate mobile navigation
   */
  private generateMobileNavigation(): INavigationItem[] {
    return [
      {
        id: 'mobile-home',
        label: 'Home',
        icon: '🏠',
        href: '/'
      },
      {
        id: 'mobile-menu',
        label: 'Menu',
        icon: '☰',
        href: '#',
        children: this.generateMockNavigationItems()
      }
    ];
  }

  /**
   * Generate mock user profile
   */
  private generateMockUserProfile(): IUserProfile {
    return {
      id: 'user-123',
      username: 'john_doe',
      displayName: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      email: 'john.doe@example.com',
      role: 'Administrator',
      status: 'online'
    };
  }

  /**
   * Generate search suggestions
   */
  private generateSearchSuggestions(): ISearchSuggestion[] {
    return [
      {
        id: '1',
        text: 'Dashboard Overview',
        type: 'page',
        url: '/dashboard'
      },
      {
        id: '2',
        text: 'User Settings',
        type: 'page',
        url: '/settings'
      },
      {
        id: '3',
        text: 'Recent Articles',
        type: 'content',
        url: '/content/articles'
      }
    ];
  }

  /**
   * Refresh navbar data
   */
  private refreshNavigation = (): void => {
    this.loadNavbarData();
    this.safeSetState({ lastUpdateTime: new Date() });
  };

  /**
   * Track navigation
   */
  private trackNavigation = (itemId: string): void => {
    console.log('🧭 Navigation tracked:', itemId);
    this.safeSetState({ activeNavigationItem: itemId });
  };

  /**
   * Set active navigation
   */
  private setActiveNavigation = (itemId: string): void => {
    this.safeSetState({ activeNavigationItem: itemId });
  };

  /**
   * Perform search
   */
  private performSearch = async (query: string): Promise<void> => {
    this.safeSetState({ isSearching: true, searchQuery: query });

    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const suggestions = this.generateSearchSuggestions().filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );

      this.safeSetState({
        searchSuggestions: suggestions,
        isSearching: false
      });

      console.log('🔍 Search performed:', query);
    } catch (error) {
      this.safeSetState({
        isSearching: false,
        errorMessage: 'Search failed'
      });
    }
  };

  /**
   * Toggle mobile menu
   */
  private toggleMobileMenu = (): void => {
    this.safeSetState(prev => ({
      isMobileMenuOpen: !prev.isMobileMenuOpen,
      isSearchOpen: false
    }));
  };

  /**
   * Toggle search
   */
  private toggleSearch = (): void => {
    this.safeSetState(prev => ({
      isSearchOpen: !prev.isSearchOpen,
      isMobileMenuOpen: false
    }));
  };

  /**
   * Update user preferences
   */
  private updateUserPreferences = async (preferences: Partial<UserPreferencesEntity>): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      this.safeSetState({
        userPreferences: { ...this.state.userPreferences, ...preferences },
        isLoading: false
      });

      console.log('⚙️ User preferences updated:', preferences);
    } catch (error) {
      this.safeSetState({
        isLoading: false,
        errorMessage: 'Failed to update preferences'
      });
    }
  };

  /**
   * Switch theme
   */
  private switchTheme = async (theme: string): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate theme switch
      await new Promise(resolve => setTimeout(resolve, 300));

      const newThemeConfig: ThemeConfigEntity = {
        ...this.state.themeConfig,
        primaryColor: theme === 'dark' ? '#1f2937' : '#3b82f6',
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        textColor: theme === 'dark' ? '#f3f4f6' : '#1f2937'
      };

      this.safeSetState({
        themeConfig: newThemeConfig,
        userPreferences: { ...this.state.userPreferences, theme: theme as any },
        isLoading: false
      });

      console.log('🎨 Theme switched to:', theme);
    } catch (error) {
      this.safeSetState({
        isLoading: false,
        errorMessage: 'Failed to switch theme'
      });
    }
  };

  /**
   * Mark notification as read
   */
  private markNotificationAsRead = (): void => {
    this.safeSetState(prev => ({
      notificationStatus: {
        ...prev.notificationStatus,
        unreadCount: Math.max(0, prev.notificationStatus.unreadCount - 1)
      }
    }));
  };

  /**
   * Open chat
   */
  private openChat = (): void => {
    console.log('💬 Chat opened');
  };

  /**
   * Get system health
   */
  private getSystemHealth = (): ISystemStatus => {
    return this.state.systemStatus;
  };

  /**
   * Clear navigation cache
   */
  private clearNavigationCache = (): void => {
    this.safeSetState({ cacheHitRate: 0 });
    console.log('🗑️ Navigation cache cleared');
  };

  /**
   * Toggle settings
   */
  private toggleSettings = (): void => {
    this.safeSetState(prev => ({ showSettings: !prev.showSettings }));
  };

  /**
   * Toggle search visibility
   */
  private toggleSearchVisibility = (): void => {
    this.safeSetState(prev => ({ showSearch: !prev.showSearch }));
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
      this.cleanupNavbar();
    }
  };

  /**
   * Render navigation items
   */
  private renderNavigationItems = (items: INavigationItem[], isMobile: boolean = false): React.ReactNode => {
    return (
      <ul className={`flex ${isMobile ? 'flex-col' : 'space-x-1'}`}>
        {items.map((item) => (
          <li key={item.id} className="relative">
            <a
              href={item.href}
              onClick={() => this.trackNavigation(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${this.state.activeNavigationItem === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </a>

            {/* Sub-items */}
            {item.children && (
              <ul className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={child.href}
                      onClick={() => this.trackNavigation(child.id)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  /**
   * Render system status indicators
   */
  private renderSystemStatus(): React.ReactNode {
    const { systemStatus } = this.state;

    const statusColors = {
      healthy: 'bg-green-500',
      degraded: 'bg-yellow-500',
      down: 'bg-red-500'
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${statusColors[systemStatus.api]}`} />
          <span className="text-xs text-gray-600">API</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${statusColors[systemStatus.database]}`} />
          <span className="text-xs text-gray-600">DB</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${statusColors[systemStatus.websocket]}`} />
          <span className="text-xs text-gray-600">WS</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${statusColors[systemStatus.cache]}`} />
          <span className="text-xs text-gray-600">Cache</span>
        </div>
      </div>
    );
  }

  /**
   * Render user profile section
   */
  private renderUserProfile(): React.ReactNode {
    const { userProfile, chatStatus, notificationStatus } = this.state;

    if (!userProfile) {
      return (
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
            Login
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        {/* User Avatar */}
        <div className="relative">
          <img
            src={userProfile.avatar}
            alt={userProfile.displayName}
            className="w-8 h-8 rounded-full"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${userProfile.status === 'online' ? 'bg-green-500' :
              userProfile.status === 'away' ? 'bg-yellow-500' :
                userProfile.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
            }`} />
        </div>

        {/* User Info */}
        <div className="hidden md:block">
          <div className="text-sm font-medium text-gray-900">{userProfile.displayName}</div>
          <div className="text-xs text-gray-500">@{userProfile.username}</div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3">
          {/* Chat Status */}
          <div className="relative">
            <button
              onClick={this.openChat}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              💬
              {chatStatus.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {chatStatus.unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications */}
          {notificationStatus.isEnabled && (
            <button
              onClick={this.markNotificationAsRead}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              🔔
              {notificationStatus.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationStatus.unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Settings */}
          <button
            onClick={this.toggleSettings}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            ⚙️
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render search bar
   */
  private renderSearchBar(): React.ReactNode {
    const { showSearch, searchQuery, isSearching, searchSuggestions } = this.state;

    if (!showSearch) {
      return (
        <button
          onClick={this.toggleSearchVisibility}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          🔍
        </button>
      );
    }

    return (
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => this.safeSetState({ searchQuery: e.target.value })}
          placeholder="Search..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm" color="primary" />
          </div>
        )}

        {searchSuggestions.length > 0 && !isSearching && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
            {searchSuggestions.map((suggestion) => (
              <a
                key={suggestion.id}
                href={suggestion.url}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b last:border-b-0"
              >
                {suggestion.text}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render quick actions
   */
  private renderQuickActions(): React.ReactNode {
    const { quickActions } = this.state;

    return (
      <div className="flex space-x-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="p-2 text-gray-600 hover:text-gray-900"
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render settings panel
   */
  private renderSettingsPanel(): React.ReactNode {
    const { userPreferences, themeConfig } = this.state;

    return (
      <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
        <h3 className="font-medium text-gray-900 mb-4">Settings</h3>

        {/* Theme Switcher */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <div className="flex space-x-2">
            <button
              onClick={() => this.switchTheme('light')}
              className={`px-3 py-1 rounded text-sm ${userPreferences.theme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Light
            </button>
            <button
              onClick={() => this.switchTheme('dark')}
              className={`px-3 py-1 rounded text-sm ${userPreferences.theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* User Preferences */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={userPreferences.notifications}
              onChange={(e) => this.updateUserPreferences({ notifications: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Notifications</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={userPreferences.autoSave}
              onChange={(e) => this.updateUserPreferences({ autoSave: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Auto-save</span>
          </label>
        </div>
      </div>
    </div >
  );
  }

  protected override renderContent(): React.ReactNode {
    const {
      className = '',
      enableMobileMenu = true,
      enableSearch = true,
      enableNotifications = true,
      enableThemeSwitcher = true
    } = this.props;

    const {
      isMobileMenuOpen,
      showSettings,
      lastUpdate,
      isRealTimeEnabled,
      cacheHitRate
    } = this.state;

    return (
      <div className={`enterprise-navbar-example bg-white border-b ${className}`}>
        {/* Main Navbar */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-gray-900">EnterpriseApp</div>
              {this.renderSystemStatus()}
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex">
              {this.renderNavigationItems(this.state.navigationItems)}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {enableSearch && this.renderSearchBar()}

              {/* Quick Actions */}
              {this.renderQuickActions()}

              {/* User Profile */}
              {enableNotifications && this.renderUserProfile()}
            </div>

            {/* Mobile Menu Toggle */}
            {enableMobileMenu && (
              <button
                onClick={this.toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                ☰
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3">
              {this.renderNavigationItems(this.state.mobileNavigation, true)}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && enableThemeSwitcher && this.renderSettingsPanel()}

        {/* Status Bar */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Cache Hit Rate: {(cacheHitRate * 100).toFixed(1)}%</span>
              <span>Real-time: {isRealTimeEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            {lastUpdate && (
              <span>Last Update: {lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EnterpriseNavbarExample;
