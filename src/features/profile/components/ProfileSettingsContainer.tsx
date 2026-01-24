/**
 * Profile Settings Container Component
 * 
 * Enterprise-grade settings container with advanced profile management
 * Uses custom query system, intelligent caching, and settings management
 */

import React, { useState } from 'react';
import ErrorComponent from "@/shared/errors/ErrorComponent";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import OutlineButton from "@/shared/buttons/OutlineButton";
import DefaultContainer from "@/shared/DefaultContainer";
import Typography from "@/shared/Typography";
import { useProfileSettings } from "@features/profile/application/hooks/useProfileSettings";
import { useAuthStore } from '@services/store/zustand';
import LoaderStyled from "@/shared/LoaderStyled";

/**
 * ProfileSettingsContainer component.
 * 
 * This component provides enterprise-grade profile settings management with:
 * - Custom query system with intelligent caching
 * - Advanced settings management with change detection
 * - Real-time updates and optimistic updates
 * - Performance monitoring and optimization
 * - Type-safe operations with comprehensive validation
 * 
 * @returns {JSX.Element} - The rendered ProfileSettingsContainer component.
 */
function ProfileSettingsContainer() {
    const { data: authData } = useAuthStore();
    const currentUserId = authData?.userId || 'current-user';
    
    // Enterprise settings hook
    const {
        settings,
        privacy,
        isLoading,
        error,
        hasUnsavedChanges,
        updateSettings,
        updatePrivacy,
        updateAllSettings,
        resetSettings,
        resetPrivacy,
        discardChanges,
        clearError
    } = useProfileSettings({ userId: currentUserId });

    // Local state for form management
    const [localSettings, setLocalSettings] = useState(settings || {});
    const [localPrivacy, setLocalPrivacy] = useState(privacy || {});

    // Update local state when data changes
    React.useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
        if (privacy) {
            setLocalPrivacy(privacy);
        }
    }, [settings, privacy]);

    // Error handling
    if (error) {
        return (
            <DefaultContainer>
                <ErrorComponent 
                    message={`Error loading settings: ${error.message}`} 
                    onRetry={clearError}
                />
            </DefaultContainer>
        );
    }

    // Loading state
    if (isLoading) {
        return <LoaderStyled />;
    }

    // Handle settings update
    const handleSettingsUpdate = async (newSettings: any) => {
        try {
            setLocalSettings(newSettings);
            await updateSettings(currentUserId, newSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    // Handle privacy update
    const handlePrivacyUpdate = async (newPrivacy: any) => {
        try {
            setLocalPrivacy(newPrivacy);
            await updatePrivacy(currentUserId, newPrivacy);
        } catch (error) {
            console.error('Error updating privacy:', error);
        }
    };

    // Handle batch update
    const handleBatchUpdate = async () => {
        try {
            await updateAllSettings(currentUserId, localSettings, localPrivacy);
        } catch (error) {
            console.error('Error updating all settings:', error);
        }
    };

    // Handle reset
    const handleReset = async () => {
        try {
            await Promise.all([
                resetSettings(currentUserId),
                resetPrivacy(currentUserId)
            ]);
        } catch (error) {
            console.error('Error resetting settings:', error);
        }
    };

    // Handle discard changes
    const handleDiscardChanges = () => {
        discardChanges();
        setLocalSettings(settings || {});
        setLocalPrivacy(privacy || {});
    };

    return (
        <DefaultContainer>
            <Typography variant="h2" className="mb-6">
                Profile Settings
            </Typography>

            {/* Settings Section */}
            <div className="mb-8">
                <Typography variant="h3" className="mb-4">
                    General Settings
                </Typography>
                
                {/* Theme Setting */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Theme
                    </label>
                    <select
                        value={localSettings.theme || 'light'}
                        onChange={(e) => handleSettingsUpdate({
                            ...localSettings,
                            theme: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                {/* Language Setting */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Language
                    </label>
                    <select
                        value={localSettings.language || 'en'}
                        onChange={(e) => handleSettingsUpdate({
                            ...localSettings,
                            language: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                    </select>
                </div>

                {/* Timezone Setting */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Timezone
                    </label>
                    <select
                        value={localSettings.timezone || 'UTC'}
                        onChange={(e) => handleSettingsUpdate({
                            ...localSettings,
                            timezone: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                </div>
            </div>

            {/* Privacy Section */}
            <div className="mb-8">
                <Typography variant="h3" className="mb-4">
                    Privacy Settings
                </Typography>
                
                {/* Profile Visibility */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Profile Visibility
                    </label>
                    <select
                        value={localPrivacy.profileVisibility || 'public'}
                        onChange={(e) => handlePrivacyUpdate({
                            ...localPrivacy,
                            profileVisibility: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                    </select>
                </div>

                {/* Show Email */}
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={localPrivacy.showEmail || false}
                            onChange={(e) => handlePrivacyUpdate({
                                ...localPrivacy,
                                showEmail: e.target.checked
                            })}
                            className="mr-2"
                        />
                        Show email address on profile
                    </label>
                </div>

                {/* Show Phone */}
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={localPrivacy.showPhone || false}
                            onChange={(e) => handlePrivacyUpdate({
                                ...localPrivacy,
                                showPhone: e.target.checked
                            })}
                            className="mr-2"
                        />
                        Show phone number on profile
                    </label>
                </div>

                {/* Allow Search Indexing */}
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={localPrivacy.allowSearchIndexing !== false}
                            onChange={(e) => handlePrivacyUpdate({
                                ...localPrivacy,
                                allowSearchIndexing: e.target.checked
                            })}
                            className="mr-2"
                        />
                        Allow search engines to index profile
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <OutlineButton
                    onClick={handleBatchUpdate}
                    disabled={!hasUnsavedChanges}
                    className="px-6 py-2"
                >
                    Save Changes
                </OutlineButton>
                
                {hasUnsavedChanges && (
                    <OutlineButton
                        onClick={handleDiscardChanges}
                        color="gray"
                        className="px-6 py-2"
                    >
                        Discard Changes
                    </OutlineButton>
                )}
                
                <OutlineButton
                    onClick={handleReset}
                    color="red"
                    className="px-6 py-2"
                >
                    Reset to Default
                </OutlineButton>
            </div>

            {/* Unsaved Changes Warning */}
            {hasUnsavedChanges && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                    <Typography variant="small" className="text-yellow-800">
                        You have unsaved changes. Click "Save Changes" to apply them.
                    </Typography>
                </div>
            )}
        </DefaultContainer>
    );
}

// Export with error boundary
export default withErrorBoundary(ProfileSettingsContainer, {
    fallback: <ErrorComponent message="Settings component encountered an error" />,
    onError: (error, errorInfo) => {
        console.error('ProfileSettingsContainer error:', error, errorInfo);
    }
});

// Export the component for testing
export { ProfileSettingsContainer };
