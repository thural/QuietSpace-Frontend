/**
 * Enterprise Navbar Example Component
 * 
 * Demonstrates the usage of enterprise navbar hooks
 * Shows best practices for navbar management with custom query system
 */

import React, { useState } from 'react';
import { useEnterpriseNavbar } from '../hooks/useEnterpriseNavbar';
import type { 
  NavigationItemEntity, 
  UserPreferencesEntity,
  ThemeConfigEntity 
} from '../domain/entities/entities';

/**
 * Enterprise Navbar Example Component
 */
export const EnterpriseNavbarExample: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const {
    // State
    navigationItems,
    personalizedNavigation,
    mobileNavigation,
    notificationStatus,
    userProfile,
    chatStatus,
    quickActions,
    userPreferences,
    themeConfig,
    searchSuggestions,
    searchQuery,
    isSearching,
    systemStatus,
    isLoading,
    error,
    isMobileMenuOpen,
    isSearchOpen,
    activeNavigationItem,
    cacheHitRate,
    lastUpdateTime,
    
    // Actions
    refreshNavigation,
    trackNavigation,
    setActiveNavigation,
    performSearch,
    clearSearch,
    setSearchQuery,
    updateUserPreferences,
    updateTheme,
    toggleMobileMenu,
    toggleSearch,
    closeAllMenus,
    invalidateCache,
    warmCache,
    performHealthCheck
  } = useEnterpriseNavbar({
    enableRealTime: true,
    enableAccessibility: true,
    enableMobileOptimization: true,
    enableSearchSuggestions: true,
    autoRefresh: true
  });

  // Handle navigation click
  const handleNavigationClick = async (path: string) => {
    await trackNavigation(path, 'click');
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      await performSearch(query);
    }
  };

  // Handle preference update
  const handlePreferenceUpdate = async (preferences: Partial<UserPreferencesEntity>) => {
    await updateUserPreferences(preferences);
  };

  // Handle theme update
  const handleThemeUpdate = async (theme: Partial<ThemeConfigEntity>) => {
    await updateTheme(theme);
  };

  // Handle health check
  const handleHealthCheck = async () => {
    const health = await performHealthCheck();
    console.log('Navbar Health Status:', health);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="navbar-loading">
        <div className="loading-spinner">Loading navbar...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="navbar-error">
        <div className="error-message">
          Error loading navbar: {error.message}
        </div>
        <button onClick={refreshNavigation}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="enterprise-navbar-example">
      <div className="navbar-header">
        <h1>Enterprise Navbar Management</h1>
        <div className="navbar-actions">
          <button onClick={refreshNavigation} className="refresh-btn">
            Refresh
          </button>
          <button onClick={invalidateCache} className="cache-btn">
            Clear Cache
          </button>
          <button onClick={warmCache} className="warm-btn">
            Warm Cache
          </button>
          <button onClick={handleHealthCheck} className="health-btn">
            Health Check
          </button>
        </div>
      </div>

      <div className="navbar-stats">
        <div className="stat-item">
          <h3>Cache Hit Rate</h3>
          <p>{(cacheHitRate * 100).toFixed(1)}%</p>
        </div>
        <div className="stat-item">
          <h3>Last Update</h3>
          <p>{lastUpdateTime ? new Date(lastUpdateTime).toLocaleTimeString() : 'Never'}</p>
        </div>
        <div className="stat-item">
          <h3>Navigation Items</h3>
          <p>{navigationItems?.length || 0}</p>
        </div>
        <div className="stat-item">
          <h3>Notifications</h3>
          <p>{notificationStatus?.unreadCount || 0}</p>
        </div>
      </div>

      <div className="navbar-sections">
        {/* Navigation Section */}
        <div className="navbar-section">
          <h2>Navigation Items</h2>
          <div className="navigation-items">
            {personalizedNavigation?.map((item, index) => (
              <div 
                key={index} 
                className={`navigation-item ${activeNavigationItem === item.pathName ? 'active' : ''}`}
                onClick={() => handleNavigationClick(item.pathName)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.pathName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Status Section */}
        <div className="navbar-section">
          <h2>User Status</h2>
          <div className="user-status">
            {userProfile && (
              <div className="user-profile">
                <div className="avatar">{userProfile.avatar}</div>
                <div className="info">
                  <p className="name">{userProfile.displayName}</p>
                  <p className="status">{userProfile.isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
            )}
            
            <div className="notification-status">
              <p>Unread Notifications: {notificationStatus?.unreadCount || 0}</p>
              <p>Unread Messages: {chatStatus?.unreadCount || 0}</p>
              <p>Has Pending: {notificationStatus?.hasPendingNotification ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="navbar-section">
          <h2>Search</h2>
          <div className="search-section">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              className="search-input"
            />
            <button onClick={clearSearch} className="clear-search-btn">
              Clear
            </button>
            
            {isSearching && (
              <div className="search-loading">Searching...</div>
            )}
            
            {searchSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                <h3>Suggestions:</h3>
                {searchSuggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    {suggestion.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="navbar-section">
          <h2>User Preferences</h2>
          <div className="preferences-section">
            {userPreferences && (
              <div className="preferences">
                <div className="preference-item">
                  <label>Theme:</label>
                  <select 
                    value={userPreferences.theme}
                    onChange={(e) => handlePreferenceUpdate({ theme: e.target.value as any })}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div className="preference-item">
                  <label>Language:</label>
                  <select 
                    value={userPreferences.language}
                    onChange={(e) => handlePreferenceUpdate({ language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div className="preference-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={userPreferences.notifications}
                      onChange={(e) => handlePreferenceUpdate({ notifications: e.target.checked })}
                    />
                    Enable Notifications
                  </label>
                </div>
                
                <div className="preference-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={userPreferences.compactMode}
                      onChange={(e) => handlePreferenceUpdate({ compactMode: e.target.checked })}
                    />
                    Compact Mode
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Section */}
        <div className="navbar-section">
          <h2>Mobile Navigation</h2>
          <div className="mobile-section">
            <button 
              onClick={toggleMobileMenu}
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            >
              {isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            </button>
            
            {mobileNavigation && (
              <div className="mobile-nav">
                <p>Max Items: {mobileNavigation.mobileState.maxItems}</p>
                <p>Max Quick Actions: {mobileNavigation.mobileState.maxQuickActions}</p>
                <p>Touch Optimized: {mobileNavigation.mobileState.touchOptimized ? 'Yes' : 'No'}</p>
                <div className="mobile-items">
                  {mobileNavigation.navigationItems.map((item, index) => (
                    <div key={index} className="mobile-nav-item">
                      {item.pathName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Status Section */}
        <div className="navbar-section">
          <h2>System Status</h2>
          <div className="system-status">
            {systemStatus && (
              <div className="status-info">
                <p>System Healthy: {systemStatus.isHealthy ? 'Yes' : 'No'}</p>
                <p>Version: {systemStatus.version}</p>
                <p>Uptime: {Math.floor(systemStatus.uptime / 60)} minutes</p>
                <p>Active Users: {systemStatus.activeUsers}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          {quickActions?.map((action, index) => (
            <button key={index} className="quick-action-btn">
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* UI State */}
      <div className="ui-state-section">
        <h2>UI State</h2>
        <div className="ui-state">
          <p>Mobile Menu Open: {isMobileMenuOpen ? 'Yes' : 'No'}</p>
          <p>Search Open: {isSearchOpen ? 'Yes' : 'No'}</p>
          <p>Active Navigation: {activeNavigationItem || 'None'}</p>
          <p>Is Searching: {isSearching ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseNavbarExample;
