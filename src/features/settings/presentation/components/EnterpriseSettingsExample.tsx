/**
 * Enterprise Settings Example Component
 * 
 * Demonstrates the usage of enterprise settings hooks
 * Shows best practices for settings management with custom query system
 */

import React, { useState } from 'react';
import { useEnterpriseSettings } from '../hooks/useEnterpriseSettings';
import type { ProfileSettingsRequest, PrivacySettings, NotificationSettings } from '@/features/profile/data/models/user';

/**
 * Enterprise Settings Example Component
 */
export const EnterpriseSettingsExample: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'notifications'>('profile');
  
  const {
    // State
    profile,
    privacy,
    notifications,
    isLoading,
    error,
    hasUnsavedChanges,
    
    // Actions
    updateProfileSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    uploadProfilePhoto,
    removeProfilePhoto,
    invalidateSettingsCache,
    prefetchSettings,
    resetChanges,
    markAsChanged
  } = useEnterpriseSettings(userId);

  // Local form state
  const [profileForm, setProfileForm] = useState<ProfileSettingsRequest>({
    username: '',
    email: '',
    bio: '',
    displayName: ''
  });

  const [privacyForm, setPrivacyForm] = useState<PrivacySettings>({
    isPrivateAccount: false,
    showEmail: false,
    showPhone: false,
    allowTagging: true,
    allowMentions: true,
    allowDirectMessages: true
  });

  const [notificationForm, setNotificationForm] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    mentionNotifications: true,
    followNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    messageNotifications: true
  });

  // Initialize forms when data loads
  React.useEffect(() => {
    if (profile.data) {
      setProfileForm({
        username: profile.data.username || '',
        email: profile.data.email || '',
        bio: profile.data.bio || '',
        displayName: profile.data.displayName || ''
      });
    }
  }, [profile.data]);

  React.useEffect(() => {
    if (privacy.data) {
      setPrivacyForm(privacy.data);
    }
  }, [privacy.data]);

  React.useEffect(() => {
    if (notifications.data) {
      setNotificationForm(notifications.data);
    }
  }, [notifications.data]);

  // Handle form changes
  const handleProfileChange = (field: keyof ProfileSettingsRequest, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    markAsChanged();
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: boolean) => {
    setPrivacyForm(prev => ({ ...prev, [field]: value }));
    markAsChanged();
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationForm(prev => ({ ...prev, [field]: value }));
    markAsChanged();
  };

  // Handle form submissions
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfileSettings(profileForm);
    
    if (result.success) {
      console.log('Profile settings updated successfully');
      // Show success message
    } else {
      console.error('Failed to update profile settings:', result.errors);
      // Show error message
    }
  };

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updatePrivacySettings(privacyForm);
    
    if (result.success) {
      console.log('Privacy settings updated successfully');
    } else {
      console.error('Failed to update privacy settings:', result.errors);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateNotificationSettings(notificationForm);
    
    if (result.success) {
      console.log('Notification settings updated successfully');
    } else {
      console.error('Failed to update notification settings:', result.errors);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadProfilePhoto(file);
      
      if (result.success) {
        console.log('Profile photo uploaded successfully');
      } else {
        console.error('Failed to upload profile photo:', result.errors);
      }
    }
  };

  const handlePhotoRemove = async () => {
    const result = await removeProfilePhoto();
    
    if (result.success) {
      console.log('Profile photo removed successfully');
    } else {
      console.error('Failed to remove profile photo:', result.errors);
    }
  };

  // Utility functions
  const handleCacheInvalidation = () => {
    invalidateSettingsCache();
    console.log('Settings cache invalidated');
  };

  const handlePrefetch = async () => {
    await prefetchSettings();
    console.log('Settings prefetched');
  };

  const handleReset = () => {
    resetChanges();
    console.log('Changes reset');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="settings-loading">
        <div className="loading-spinner">Loading settings...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="settings-error">
        <div className="error-message">
          Error loading settings: {error.message}
        </div>
        <button onClick={handleCacheInvalidation}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="enterprise-settings-example">
      <div className="settings-header">
        <h1>Enterprise Settings</h1>
        <div className="settings-actions">
          {hasUnsavedChanges && (
            <button onClick={handleReset} className="reset-btn">
              Reset Changes
            </button>
          )}
          <button onClick={handleCacheInvalidation} className="cache-btn">
            Clear Cache
          </button>
          <button onClick={handlePrefetch} className="prefetch-btn">
            Prefetch Settings
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h2>Profile Settings</h2>
            
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => handleProfileChange('username', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Display Name:</label>
              <input
                type="text"
                value={profileForm.displayName}
                onChange={(e) => handleProfileChange('displayName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Bio:</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Profile Photo:</label>
              {profile.data?.photo ? (
                <div className="current-photo">
                  <img src={profile.data.photo} alt="Profile" />
                  <button type="button" onClick={handlePhotoRemove}>
                    Remove Photo
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              )}
            </div>

            <button type="submit" className="save-btn">
              Save Profile Settings
            </button>
          </form>
        )}

        {activeTab === 'privacy' && (
          <form onSubmit={handlePrivacySubmit} className="privacy-form">
            <h2>Privacy Settings</h2>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={privacyForm.isPrivateAccount}
                  onChange={(e) => handlePrivacyChange('isPrivateAccount', e.target.checked)}
                />
                Private Account
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={privacyForm.showEmail}
                  onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                />
                Show Email
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={privacyForm.allowTagging}
                  onChange={(e) => handlePrivacyChange('allowTagging', e.target.checked)}
                />
                Allow Tagging
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={privacyForm.allowDirectMessages}
                  onChange={(e) => handlePrivacyChange('allowDirectMessages', e.target.checked)}
                />
                Allow Direct Messages
              </label>
            </div>

            <button type="submit" className="save-btn">
              Save Privacy Settings
            </button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <form onSubmit={handleNotificationSubmit} className="notifications-form">
            <h2>Notification Settings</h2>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={notificationForm.emailNotifications}
                  onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                />
                Email Notifications
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={notificationForm.pushNotifications}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                />
                Push Notifications
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={notificationForm.mentionNotifications}
                  onChange={(e) => handleNotificationChange('mentionNotifications', e.target.checked)}
                />
                Mention Notifications
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={notificationForm.followNotifications}
                  onChange={(e) => handleNotificationChange('followNotifications', e.target.checked)}
                />
                Follow Notifications
              </label>
            </div>

            <button type="submit" className="save-btn">
              Save Notification Settings
            </button>
          </form>
        )}
      </div>

      {hasUnsavedChanges && (
        <div className="unsaved-changes-warning">
          You have unsaved changes. Don't forget to save them!
        </div>
      )}
    </div>
  );
};

export default EnterpriseSettingsExample;
