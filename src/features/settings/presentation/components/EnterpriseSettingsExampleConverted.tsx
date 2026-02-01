/**
 * Enterprise Settings Example Component
 * 
 * Demonstrates the usage of enterprise settings hooks
 * Shows best practices for settings management with custom query system
 */

import React from 'react';
import { useEnterpriseSettings } from '../hooks/useEnterpriseSettings';
import type { ProfileSettingsRequest, PrivacySettings, NotificationSettings } from '@/features/profile/data/models/user';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner, ErrorMessage } from '@shared/ui/components';

/**
 * Settings Tab type
 */
export type SettingsTab = 'profile' | 'privacy' | 'notifications';

/**
 * Enterprise Settings Example Props
 */
export interface IEnterpriseSettingsExampleProps extends IBaseComponentProps {
  userId: string;
  initialTab?: SettingsTab;
  enableAutoSave?: boolean;
}

/**
 * Enterprise Settings Example State
 */
export interface IEnterpriseSettingsExampleState extends IBaseComponentState {
  activeTab: SettingsTab;
  profileForm: ProfileSettingsRequest;
  privacyForm: PrivacySettings;
  notificationForm: NotificationSettings;
  isLoading: boolean;
  errorMessage: string | null;
  hasUnsavedChanges: boolean;
  lastSaveTime: Date | null;
  autoSaveEnabled: boolean;
}

/**
 * Enterprise Settings Example Component
 * 
 * Demonstrates enterprise settings management with:
 * - Multi-tab settings interface
 * - Form state management and validation
 * - Auto-save functionality
 * - Profile photo upload/management
 * - Privacy and notification settings
 * - Cache management and prefetching
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class EnterpriseSettingsExample extends BaseClassComponent<IEnterpriseSettingsExampleProps, IEnterpriseSettingsExampleState> {
  private autoSaveTimer: number | null = null;

  protected override getInitialState(): Partial<IEnterpriseSettingsExampleState> {
    const { 
      initialTab = 'profile',
      enableAutoSave = true
    } = this.props;

    return {
      activeTab: initialTab,
      profileForm: {
        username: '',
        email: '',
        bio: '',
        displayName: ''
      },
      privacyForm: {
        isPrivateAccount: false,
        showEmail: false,
        showPhone: false,
        allowTagging: true,
        allowDirectMessages: true,
        showOnlineStatus: true,
        showActivityStatus: true
      },
      notificationForm: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        securityAlerts: true,
        mentionNotifications: true,
        commentNotifications: true,
        likeNotifications: true,
        followNotifications: true
      },
      isLoading: false,
      errorMessage: null,
      hasUnsavedChanges: false,
      lastSaveTime: null,
      autoSaveEnabled: enableAutoSave
    };
  }

  protected override onMount(): void {
    super.onMount();
    this.initializeSettings();
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.cleanupAutoSave();
  }

  /**
   * Initialize settings
   */
  private initializeSettings(): void {
    console.log('⚙️ Enterprise settings example initialized');
    this.loadSettings();
  }

  /**
   * Load settings from enterprise hook
   */
  private loadSettings = (): void => {
    const { userId } = this.props;
    const settingsData = this.getEnterpriseSettingsData(userId);

    this.safeSetState({
      profileForm: settingsData.profile || this.state.profileForm,
      privacyForm: settingsData.privacy || this.state.privacyForm,
      notificationForm: settingsData.notifications || this.state.notificationForm,
      isLoading: settingsData.isLoading,
      errorMessage: settingsData.error
    });
  };

  /**
   * Get enterprise settings data
   */
  private getEnterpriseSettingsData(userId: string) {
    // Mock implementation that matches the hook interface
    return {
      profile: {
        username: 'john_doe',
        email: 'john.doe@example.com',
        bio: 'Software developer passionate about React and TypeScript',
        displayName: 'John Doe'
      },
      privacy: {
        isPrivateAccount: false,
        showEmail: true,
        showPhone: false,
        allowTagging: true,
        allowDirectMessages: true,
        showOnlineStatus: true,
        showActivityStatus: true
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        securityAlerts: true,
        mentionNotifications: true,
        commentNotifications: true,
        likeNotifications: true,
        followNotifications: true
      },
      isLoading: false,
      error: null,
      hasUnsavedChanges: false,
      updateProfileSettings: this.updateProfileSettings,
      updatePrivacySettings: this.updatePrivacySettings,
      updateNotificationSettings: this.updateNotificationSettings,
      uploadProfilePhoto: this.uploadProfilePhoto,
      removeProfilePhoto: this.removeProfilePhoto,
      invalidateSettingsCache: this.invalidateSettingsCache,
      prefetchSettings: this.prefetchSettings,
      resetChanges: this.resetChanges,
      markAsChanged: this.markAsChanged
    };
  }

  /**
   * Cleanup auto-save timer
   */
  private cleanupAutoSave(): void => {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Handle tab change
   */
  private handleTabChange = (tab: SettingsTab): void => {
    this.safeSetState({ activeTab: tab });
  };

  /**
   * Handle profile form change
   */
  private handleProfileFormChange = (field: keyof ProfileSettingsRequest, value: string): void => {
    this.safeSetState(prev => ({
      profileForm: { ...prev.profileForm, [field]: value },
      hasUnsavedChanges: true
    }));

    // Trigger auto-save
    this.triggerAutoSave();
  };

  /**
   * Handle privacy form change
   */
  private handlePrivacyFormChange = (field: keyof PrivacySettings, value: boolean): void => {
    this.safeSetState(prev => ({
      privacyForm: { ...prev.privacyForm, [field]: value },
      hasUnsavedChanges: true
    }));

    // Trigger auto-save
    this.triggerAutoSave();
  };

  /**
   * Handle notification form change
   */
  private handleNotificationFormChange = (field: keyof NotificationSettings, value: boolean): void => {
    this.safeSetState(prev => ({
      notificationForm: { ...prev.notificationForm, [field]: value },
      hasUnsavedChanges: true
    }));

    // Trigger auto-save
    this.triggerAutoSave();
  };

  /**
   * Trigger auto-save
   */
  private triggerAutoSave = (): void => {
    if (!this.state.autoSaveEnabled) return;

    // Clear existing timer
    this.cleanupAutoSave();

    // Set new timer for auto-save
    this.autoSaveTimer = window.setTimeout(() => {
      this.saveAllSettings();
    }, 2000); // Auto-save after 2 seconds of inactivity
  };

  /**
   * Update profile settings
   */
  private updateProfileSettings = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState({ 
        isLoading: false,
        hasUnsavedChanges: false,
        lastSaveTime: new Date()
      });
      
      console.log('✅ Profile settings saved:', this.state.profileForm);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to save profile settings'
      });
    }
  };

  /**
   * Update privacy settings
   */
  private updatePrivacySettings = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState({ 
        isLoading: false,
        hasUnsavedChanges: false,
        lastSaveTime: new Date()
      });
      
      console.log('✅ Privacy settings saved:', this.state.privacyForm);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to save privacy settings'
      });
    }
  };

  /**
   * Update notification settings
   */
  private updateNotificationSettings = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState({ 
        isLoading: false,
        hasUnsavedChanges: false,
        lastSaveTime: new Date()
      });
      
      console.log('✅ Notification settings saved:', this.state.notificationForm);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to save notification settings'
      });
    }
  };

  /**
   * Save all settings
   */
  private saveAllSettings = async (): Promise<void> => {
    const { activeTab } = this.state;

    switch (activeTab) {
      case 'profile':
        await this.updateProfileSettings();
        break;
      case 'privacy':
        await this.updatePrivacySettings();
        break;
      case 'notifications':
        await this.updateNotificationSettings();
        break;
    }
  };

  /**
   * Upload profile photo
   */
  private uploadProfilePhoto = async (file: File): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.safeSetState({ isLoading: false });
      console.log('📸 Profile photo uploaded:', file.name);
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to upload profile photo'
      });
    }
  };

  /**
   * Remove profile photo
   */
  private removeProfilePhoto = async (): Promise<void> => {
    this.safeSetState({ isLoading: true, errorMessage: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.safeSetState({ isLoading: false });
      console.log('🗑️ Profile photo removed');
    } catch (error) {
      this.safeSetState({ 
        isLoading: false,
        errorMessage: 'Failed to remove profile photo'
      });
    }
  };

  /**
   * Invalidate settings cache
   */
  private invalidateSettingsCache = (): void => {
    console.log('🗑️ Settings cache invalidated');
    this.loadSettings();
  };

  /**
   * Prefetch settings
   */
  private prefetchSettings = (): void => {
    console.log('📦 Settings prefetched');
  };

  /**
   * Reset changes
   */
  private resetChanges = (): void => {
    this.loadSettings();
    this.cleanupAutoSave();
  };

  /**
   * Mark as changed
   */
  private markAsChanged = (): void => {
    this.safeSetState({ hasUnsavedChanges: true });
  };

  /**
   * Toggle auto-save
   */
  private toggleAutoSave = (): void => {
    const newEnabled = !this.state.autoSaveEnabled;
    this.safeSetState({ autoSaveEnabled: newEnabled });
    
    if (newEnabled) {
      this.triggerAutoSave();
    } else {
      this.cleanupAutoSave();
    }
  };

  /**
   * Render profile settings tab
   */
  private renderProfileTab(): React.ReactNode {
    const { profileForm } = this.state;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => this.handleProfileFormChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profileForm.displayName}
                onChange={(e) => this.handleProfileFormChange('displayName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => this.handleProfileFormChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => this.handleProfileFormChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render privacy settings tab
   */
  private renderPrivacyTab(): React.ReactNode {
    const { privacyForm } = this.state;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
          
          <div className="space-y-4">
            {Object.entries(privacyForm).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => this.handlePrivacyFormChange(key as keyof PrivacySettings, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render notification settings tab
   */
  private renderNotificationTab(): React.ReactNode {
    const { notificationForm } = this.state;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          
          <div className="space-y-4">
            {Object.entries(notificationForm).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => this.handleNotificationFormChange(key as keyof NotificationSettings, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render tab navigation
   */
  private renderTabNavigation(): React.ReactNode {
    const { activeTab } = this.state;

    return (
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(['profile', 'privacy', 'notifications'] as SettingsTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => this.handleTabChange(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Render status bar
   */
  private renderStatusBar(): React.ReactNode {
    const { hasUnsavedChanges, lastSaveTime, autoSaveEnabled } = this.state;

    return (
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className="text-sm text-gray-600">
            {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
          </span>
          {lastSaveTime && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaveTime.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={this.toggleAutoSave}
            className={`px-3 py-1 rounded text-xs font-medium ${
              autoSaveEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {autoSaveEnabled ? 'Auto-save ON' : 'Auto-save OFF'}
          </button>
        </div>
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { className = '', userId } = this.props;
    const { isLoading, errorMessage, activeTab } = this.state;

    return (
      <div className={`enterprise-settings-example p-6 bg-gray-50 min-h-screen ${className}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enterprise Settings
          </h1>
          <p className="text-gray-600">
            Advanced settings management with auto-save and real-time updates
          </p>
        </div>

        {/* Status Bar */}
        {this.renderStatusBar()}

        {/* Tab Navigation */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          {this.renderTabNavigation()}
        </div>

        {/* Settings Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" color="primary" />
            </div>
          )}

          {/* Error State */}
          {errorMessage && (
            <ErrorMessage
              error={errorMessage}
              onRetry={() => this.loadSettings()}
              onClear={() => this.safeSetState({ errorMessage: null })}
              variant="default"
            />
          )}

          {/* Content Based on Active Tab */}
          {!isLoading && !errorMessage && (
            <>
              {activeTab === 'profile' && this.renderProfileTab()}
              {activeTab === 'privacy' && this.renderPrivacyTab()}
              {activeTab === 'notifications' && this.renderNotificationTab()}
              
              {/* Save Button */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <button
                    onClick={this.resetChanges}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Reset Changes
                  </button>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={this.prefetchSettings}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                    >
                      Prefetch
                    </button>
                    
                    <button
                      onClick={this.invalidateSettingsCache}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                    >
                      Clear Cache
                    </button>
                    
                    <button
                      onClick={() => this.saveAllSettings()}
                      disabled={!this.state.hasUnsavedChanges}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default EnterpriseSettingsExample;
