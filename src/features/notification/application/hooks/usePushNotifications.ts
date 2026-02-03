import { useState, useCallback, useEffect } from 'react';
import { useCustomMutation } from '@/core/modules/hooks/useCustomMutation';
import { useNotificationServices } from './useNotificationServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import { PushSubscription, DeviceInfo, QuietHours } from '@features/notification/domain/entities/INotificationRepository';
import { JwtToken } from '@/shared/api/models/common';

/**
 * Push Notification Hook
 * 
 * Enterprise-grade push notification management with service worker integration,
 * subscription management, and real-time capabilities
 */
export const usePushNotifications = () => {
    const { pushNotificationService, notificationFeatureService } = useNotificationServices();
    const { token, userId } = useFeatureAuth();

    // State
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Get current user ID and token
    const currentUserId = userId || 'current-user';
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Initialize push notification support
    useEffect(() => {
        const initialize = async () => {
            try {
                const supported = pushNotificationService.isNotificationSupported();
                setIsSupported(supported);

                if (supported) {
                    const currentPermission = pushNotificationService.getNotificationPermission();
                    setPermission(currentPermission);

                    // Initialize service worker
                    const swInitialized = await pushNotificationService.initializeServiceWorker();
                    if (swInitialized) {
                        // Check existing subscription status
                        await checkSubscriptionStatus();
                    }
                }
            } catch (err) {
                console.error('Error initializing push notifications:', err);
                setError(err as Error);
            }
        };

        initialize();
    }, [pushNotificationService]);

    // Check subscription status
    const checkSubscriptionStatus = useCallback(async () => {
        try {
            const status = await pushNotificationService.getPushSubscriptionStatus(currentUserId, getAuthToken());
            setIsSubscribed(status.isSubscribed);
            setSubscription(status.subscription);
            setPermission(status.permission);
        } catch (err) {
            console.error('Error checking subscription status:', err);
        }
    }, [pushNotificationService, currentUserId, getAuthToken]);

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
        try {
            setIsLoading(true);
            setError(null);

            const newPermission = await pushNotificationService.requestNotificationPermission();
            setPermission(newPermission);

            if (newPermission === 'granted') {
                // Auto-subscribe after permission granted
                await subscribe();
            }

            return newPermission;
        } catch (err) {
            setError(err as Error);
            console.error('Error requesting notification permission:', err);
            return 'denied';
        } finally {
            setIsLoading(false);
        }
    }, [pushNotificationService]);

    // Subscribe to push notifications
    const subscribe = useCallback(async (deviceInfo?: DeviceInfo): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            // Request permission if not granted
            if (permission !== 'granted') {
                const newPermission = await requestPermission();
                if (newPermission !== 'granted') {
                    return false;
                }
            }

            // Use provided device info or generate default
            const deviceInfoToUse: DeviceInfo = deviceInfo || {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                version: navigator.userAgent.split(' ')[0],
                appVersion: '1.0.0'
            };

            const pushSubscription = await pushNotificationService.subscribeToPushNotifications(
                currentUserId,
                deviceInfoToUse,
                getAuthToken()
            );

            if (pushSubscription) {
                setIsSubscribed(true);
                setSubscription(pushSubscription);
                return true;
            }

            return false;
        } catch (err) {
            setError(err as Error);
            console.error('Error subscribing to push notifications:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [pushNotificationService, currentUserId, getAuthToken, permission, requestPermission]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async (): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            const success = await pushNotificationService.unsubscribeFromPushNotifications(currentUserId, getAuthToken());

            if (success) {
                setIsSubscribed(false);
                setSubscription(null);
            }

            return success;
        } catch (err) {
            setError(err as Error);
            console.error('Error unsubscribing from push notifications:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [pushNotificationService, currentUserId, getAuthToken]);

    // Register device
    const registerDevice = useCallback(async (deviceInfo: DeviceInfo): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            const deviceToken = await pushNotificationService.registerDevice(currentUserId, deviceInfo, getAuthToken());

            if (deviceToken) {
                console.log('Device registered successfully:', deviceToken.id);
                return true;
            }

            return false;
        } catch (err) {
            setError(err as Error);
            console.error('Error registering device:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [pushNotificationService, currentUserId, getAuthToken]);

    // Remove device
    const removeDevice = useCallback(async (deviceId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            const success = await pushNotificationService.removeDevice(currentUserId, deviceId, getAuthToken());

            if (success) {
                console.log('Device removed successfully:', deviceId);
                return true;
            }

            return false;
        } catch (err) {
            setError(err as Error);
            console.error('Error removing device:', err);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [pushNotificationService, currentUserId, getAuthToken]);

    // Check quiet hours
    const checkQuietHours = useCallback(async (): Promise<boolean> => {
        try {
            return await pushNotificationService.checkQuietHours(currentUserId, getAuthToken());
        } catch (err) {
            console.error('Error checking quiet hours:', err);
            return false;
        }
    }, [pushNotificationService, currentUserId, getAuthToken]);

    // Update quiet hours
    const updateQuietHours = useCallback(async (quietHours: QuietHours): Promise<QuietHours | null> => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await notificationFeatureService.updateQuietHours(currentUserId, quietHours, getAuthToken());

            return result;
        } catch (err) {
            setError(err as Error);
            console.error('Error updating quiet hours:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [notificationFeatureService, currentUserId, getAuthToken]);

    // Get notification analytics
    const getAnalytics = useCallback(async (notificationId: string) => {
        try {
            return await pushNotificationService.getNotificationAnalytics(notificationId);
        } catch (err) {
            console.error('Error getting notification analytics:', err);
            return {};
        }
    }, [pushNotificationService]);

    // Track notification delivery
    const trackDelivery = useCallback(async (notificationId: string, status: 'delivered' | 'failed' | 'clicked') => {
        try {
            await pushNotificationService.trackNotificationDelivery(notificationId, status);
        } catch (err) {
            console.error('Error tracking notification delivery:', err);
        }
    }, [pushNotificationService]);

    // Set VAPID public key
    const setVapidPublicKey = useCallback(async (publicKey: string) => {
        try {
            await pushNotificationService.setVapidPublicKey(publicKey);
        } catch (err) {
            console.error('Error setting VAPID public key:', err);
        }
    }, [pushNotificationService]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Listen for push events
    useEffect(() => {
        const handlePushMessage = (event: CustomEvent) => {
            console.log('Push message received:', event.detail);

            // Update unread count
            checkSubscriptionStatus();

            // You can also trigger other actions here
            // like showing a toast notification or updating UI
        };

        window.addEventListener('pushMessage', handlePushMessage);

        return () => {
            window.removeEventListener('pushMessage', handlePushMessage);
        };
    }, [checkSubscriptionStatus]);

    // Listen for mark notification as read events
    useEffect(() => {
        const handleMarkAsRead = (event: CustomEvent) => {
            console.log('Mark notification as read event:', event.detail);

            // Update unread count
            checkSubscriptionStatus();
        };

        window.addEventListener('markNotificationAsRead', handleMarkAsRead);

        return () => {
            window.removeEventListener('markNotificationAsRead', handleMarkAsRead);
        };
    }, [checkSubscriptionStatus]);

    return {
        // State
        isSubscribed,
        permission,
        isSupported,
        subscription,
        isLoading,
        error,

        // Actions
        requestPermission,
        subscribe,
        unsubscribe,
        registerDevice,
        removeDevice,
        checkQuietHours,
        updateQuietHours,
        getAnalytics,
        trackDelivery,
        setVapidPublicKey,
        clearError,

        // Utilities
        checkSubscriptionStatus,
        refreshStatus: checkSubscriptionStatus
    };
};

export default usePushNotifications;
