import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery, useCustomMutation } from '@/core/modules/hooks/useCustomQuery';
import { useCacheInvalidation } from '@/core/modules/hooks/migrationUtils';
import { useNotificationServices } from './useNotificationServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import { NotificationSettings, NotificationPreferences, QuietHours } from '@features/notification/domain/entities/INotificationRepository';
import { NotificationType } from '@/features/notification/data/models/notification';
import { NOTIFICATION_CACHE_TTL } from '../../data/cache/NotificationCacheKeys';

/**
 * Notification Settings Hook
 * 
 * Enterprise-grade notification settings and preferences management
 * with intelligent caching and real-time updates
 */
export const useNotificationSettings = () => {
    const { notificationFeatureService, notificationDataService } = useNotificationServices();
    const invalidateCache = useCacheInvalidation();
    const { token, userId } = useFeatureAuth();

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Get current user ID and token
    const currentUserId = userId || 'current-user';
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Custom query for notification settings
    const settingsQuery = useCustomQuery(
        ['notification-settings', currentUserId],
        () => notificationDataService.getNotificationSettings(currentUserId, getAuthToken()),
        {
            staleTime: NOTIFICATION_CACHE_TTL.SETTINGS,
            cacheTime: NOTIFICATION_CACHE_TTL.SETTINGS,
            onSuccess: (data) => {
                console.log('Notification settings loaded:', { userId: currentUserId, settings: data });
            },
            onError: (error) => {
                setError(error);
                console.error('Error fetching notification settings:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for notification preferences
    const preferencesQuery = useCustomQuery(
        ['notification-preferences', currentUserId],
        () => notificationDataService.getNotificationPreferences(currentUserId, getAuthToken()),
        {
            staleTime: NOTIFICATION_CACHE_TTL.SETTINGS,
            cacheTime: NOTIFICATION_CACHE_TTL.SETTINGS,
            onSuccess: (data) => {
                console.log('Notification preferences loaded:', { userId: currentUserId, preferences: data });
            },
            onError: (error) => {
                console.error('Error fetching notification preferences:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for quiet hours
    const quietHoursQuery = useCustomQuery(
        ['notification-quiet-hours', currentUserId],
        () => notificationDataService.getQuietHours(currentUserId, getAuthToken()),
        {
            staleTime: NOTIFICATION_CACHE_TTL.QUIET_HOURS,
            cacheTime: NOTIFICATION_CACHE_TTL.QUIET_HOURS,
            onSuccess: (data) => {
                console.log('Quiet hours loaded:', { userId: currentUserId, quietHours: data });
            },
            onError: (error) => {
                console.error('Error fetching quiet hours:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom mutation for updating settings
    const updateSettingsMutation = useCustomMutation(
        (settings: Partial<NotificationSettings>) =>
            notificationFeatureService.updateNotificationSettings(currentUserId, settings, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Notification settings updated:', { userId: currentUserId, settings: result });

                // Invalidate settings cache
                invalidateCache.invalidateUserSettings(currentUserId);

                // Update query
                settingsQuery.refetch();
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating notification settings:', error);
            }
        }
    );

    // Custom mutation for updating preferences
    const updatePreferencesMutation = useCustomMutation(
        (preferences: Partial<NotificationPreferences>) => {
            // This would need to be implemented in the feature service
            // For now, we'll use the data service directly
            return notificationDataService.updateNotificationPreferences(currentUserId, preferences, getAuthToken());
        },
        {
            onSuccess: (result) => {
                console.log('Notification preferences updated:', { userId: currentUserId, preferences: result });

                // Invalidate settings cache
                invalidateCache.invalidateUserSettings(currentUserId);

                // Update query
                preferencesQuery.refetch();
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating notification preferences:', error);
            }
        }
    );

    // Custom mutation for updating quiet hours
    const updateQuietHoursMutation = useCustomMutation(
        (quietHours: QuietHours) =>
            notificationFeatureService.updateQuietHours(currentUserId, quietHours, getAuthToken()),
        {
            onSuccess: (result) => {
                console.log('Quiet hours updated:', { userId: currentUserId, quietHours: result });

                // Invalidate settings cache
                invalidateCache.invalidateUserSettings(currentUserId);

                // Update query
                quietHoursQuery.refetch();
            },
            onError: (error) => {
                setError(error);
                console.error('Error updating quiet hours:', error);
            }
        }
    );

    // Action implementations
    const updateSettings = useCallback(async (settings: Partial<NotificationSettings>) => {
        await updateSettingsMutation.mutateAsync(settings);
    }, [updateSettingsMutation]);

    const updatePreferences = useCallback(async (preferences: Partial<NotificationPreferences>) => {
        await updatePreferencesMutation.mutateAsync(preferences);
    }, [updatePreferencesMutation]);

    const updateQuietHours = useCallback(async (quietHours: QuietHours) => {
        await updateQuietHoursMutation.mutateAsync(quietHours);
    }, [updateQuietHoursMutation]);

    // Toggle notification type in preferences
    const toggleNotificationType = useCallback(async (type: NotificationType, enabled: boolean) => {
        const currentPreferences = preferencesQuery.data;
        if (!currentPreferences) return;

        const updatedPreferences = {
            ...currentPreferences,
            [type]: {
                ...currentPreferences[type],
                enabled
            }
        };

        await updatePreferences(updatedPreferences);
    }, [preferencesQuery.data, updatePreferences]);

    // Toggle notification channel for a type
    const toggleNotificationChannel = useCallback(async (type: NotificationType, channel: 'push' | 'email' | 'sms' | 'inApp', enabled: boolean) => {
        const currentPreferences = preferencesQuery.data;
        if (!currentPreferences) return;

        const updatedPreferences = {
            ...currentPreferences,
            [type]: {
                ...currentPreferences[type],
                [channel]: enabled
            }
        };

        await updatePreferences(updatedPreferences);
    }, [preferencesQuery.data, updatePreferences]);

    // Set notification priority for a type
    const setNotificationPriority = useCallback(async (type: NotificationType, priority: 'low' | 'medium' | 'high' | 'urgent') => {
        const currentPreferences = preferencesQuery.data;
        if (!currentPreferences) return;

        const updatedPreferences = {
            ...currentPreferences,
            [type]: {
                ...currentPreferences[type],
                priority
            }
        };

        await updatePreferences(updatedPreferences);
    }, [preferencesQuery.data, updatePreferences]);

    // Enable/disable all notifications
    const enableAllNotifications = useCallback(async (enabled: boolean) => {
        const currentPreferences = preferencesQuery.data;
        if (!currentPreferences) return;

        const updatedPreferences: Partial<NotificationPreferences> = {};

        // Set all notification types to enabled/disabled
        Object.keys(currentPreferences).forEach((type) => {
            const notificationType = type as NotificationType;
            updatedPreferences[notificationType] = {
                ...currentPreferences[notificationType],
                enabled,
                push: enabled,
                email: enabled,
                sms: enabled,
                inApp: enabled
            };
        });

        await updatePreferences(updatedPreferences);
    }, [preferencesQuery.data, updatePreferences]);

    // Reset settings to defaults
    const resetToDefaults = useCallback(async () => {
        const defaultSettings: Partial<NotificationSettings> = {
            enableEmailNotifications: true,
            enablePushNotifications: true,
            enableInAppNotifications: true,
            enableSmsNotifications: false,
            frequency: 'immediate',
            maxDailyNotifications: 50
        };

        await updateSettings(defaultSettings);
    }, [updateSettings]);

    // Reset preferences to defaults
    const resetPreferencesToDefaults = useCallback(async () => {
        const defaultPreferences: Partial<NotificationPreferences> = {};

        // Set all notification types to default preferences
        const allTypes: NotificationType[] = [
            'mention', 'like', 'comment', 'follow', 'message', 'post', 'share', 'system'
        ];

        allTypes.forEach((type) => {
            defaultPreferences[type] = {
                enabled: true,
                push: true,
                email: false,
                sms: false,
                inApp: true,
                priority: 'medium'
            };
        });

        await updatePreferences(defaultPreferences);
    }, [updatePreferences]);

    // Enable/disable quiet hours
    const toggleQuietHours = useCallback(async (enabled: boolean) => {
        const currentQuietHours = quietHoursQuery.data;
        if (!currentQuietHours) return;

        const updatedQuietHours: QuietHours = {
            ...currentQuietHours,
            enabled
        };

        await updateQuietHours(updatedQuietHours);
    }, [quietHoursQuery.data, updateQuietHours]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Refresh all settings
    const refresh = useCallback(() => {
        settingsQuery.refetch();
        preferencesQuery.refetch();
        quietHoursQuery.refetch();
    }, [settingsQuery, preferencesQuery, quietHoursQuery]);

    return {
        // Data
        settings: settingsQuery.data,
        preferences: preferencesQuery.data,
        quietHours: quietHoursQuery.data,

        // Loading states
        isLoading: isLoading || settingsQuery.isLoading || preferencesQuery.isLoading || quietHoursQuery.isLoading,
        isUpdating: updateSettingsMutation.isLoading || updatePreferencesMutation.isLoading || updateQuietHoursMutation.isLoading,

        // Error state
        error: error || settingsQuery.error || preferencesQuery.error || quietHoursQuery.error,

        // Actions
        updateSettings,
        updatePreferences,
        updateQuietHours,
        toggleNotificationType,
        toggleNotificationChannel,
        setNotificationPriority,
        enableAllNotifications,
        resetToDefaults,
        resetPreferencesToDefaults,
        toggleQuietHours,

        // Utilities
        clearError,
        refresh
    };
};

export default useNotificationSettings;
