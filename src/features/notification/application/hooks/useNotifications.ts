/**
 * Notification Hook - Enterprise Edition
 * 
 * Hook for managing notification functionality with enterprise-grade architecture.
 * Uses custom query system, intelligent caching, and real-time push notifications.
 */

import { useState, useCallback, useEffect } from 'react';
import { useCustomQuery } from '@/core/modules/hooks/useCustomQuery';
import { useCustomMutation } from '@/core/modules/hooks/useCustomMutation';
import { useCacheInvalidation } from '@/core/modules/hooks/migrationUtils';
import { useNotificationServices } from './useNotificationServices';
import { useFeatureAuth } from '@/core/modules/authentication';
import type { NotificationPage, NotificationResponse, NotificationType } from '@/features/notification/data/models/notification';
import type { ResId } from '@/shared/api/models/common';
import type { NotificationQuery, NotificationFilters } from '../../domain/entities/INotificationRepository';
import { NOTIFICATION_CACHE_TTL } from '../../data/cache/NotificationCacheKeys';

/**
 * Notification State interface.
 */
export interface NotificationState {
    notifications: NotificationPage | null;
    unreadCount: number | null;
    selectedNotification: NotificationResponse | null;
    isLoading: boolean;
    error: Error | null;
    filters: NotificationFilters;
    searchQuery: string;
    activeFilter: string | null;
}

/**
 * Notification Actions interface.
 */
export interface NotificationActions {
    // Data fetching
    fetchNotifications: (userId: string, query?: Partial<NotificationQuery>) => Promise<void>;
    fetchNotificationsByType: (type: NotificationType, userId: string, query?: Partial<NotificationQuery>) => Promise<void>;
    fetchUnreadCount: (userId: string) => Promise<void>;

    // Notification operations
    markAsRead: (notificationId: ResId) => Promise<void>;
    markMultipleAsRead: (notificationIds: ResId[]) => Promise<void>;
    deleteNotification: (notificationId: ResId) => Promise<void>;
    getNotificationById: (notificationId: ResId) => Promise<void>;
    searchNotifications: (query: string, userId: string) => Promise<void>;

    // State management
    setSelectedNotification: (notification: NotificationResponse | null) => void;
    setFilters: (filters: NotificationFilters) => void;
    setActiveFilter: (filter: string | null) => void;
    setSearchQuery: (query: string) => void;
    clearError: () => void;
    refresh: () => void;
}

/**
 * Notification Hook - Enterprise Edition
 * 
 * Hook that provides notification functionality with enterprise-grade architecture.
 * Integrates with custom query system, intelligent caching, and push notifications.
 */
export const useNotifications = (config?: { userId?: string }): NotificationState & NotificationActions => {
    const { notificationFeatureService, notificationDataService } = useNotificationServices();
    const invalidateCache = useCacheInvalidation();
    const { token, userId } = useFeatureAuth();

    // State
    const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState<NotificationFilters>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Get current user ID
    const currentUserId = config?.userId || userId || 'current-user';

    // Get authentication token
    const getAuthToken = useCallback((): string => {
        return token || '';
    }, [token]);

    // Custom query for notifications with enterprise caching
    const notificationsQuery = useCustomQuery(
        ['notifications', currentUserId, filters],
        () => notificationFeatureService.getUserNotifications(currentUserId, { ...filters }, getAuthToken()),
        {
            staleTime: NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS,
            cacheTime: NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS,
            refetchInterval: NOTIFICATION_CACHE_TTL.USER_NOTIFICATIONS / 2, // Refresh at half TTL
            onSuccess: (data) => {
                console.log('Notifications loaded:', { count: data?.content?.length, userId: currentUserId });
            },
            onError: (error) => {
                setError(error);
                console.error('Error fetching notifications:', error);
            },
            retry: (failureCount, error) => {
                // Don't retry on authentication errors
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    );

    // Custom query for unread count with real-time updates
    const unreadCountQuery = useCustomQuery(
        ['notifications', 'unread', currentUserId],
        () => notificationFeatureService.getUnreadCount(currentUserId, getAuthToken()),
        {
            staleTime: NOTIFICATION_CACHE_TTL.UNREAD_COUNT,
            cacheTime: NOTIFICATION_CACHE_TTL.UNREAD_COUNT,
            refetchInterval: NOTIFICATION_CACHE_TTL.UNREAD_COUNT / 3, // More frequent for count
            onSuccess: (count) => {
                console.log('Unread count updated:', { count, userId: currentUserId });
            },
            onError: (error) => {
                console.error('Error fetching unread count:', error);
            },
            retry: (failureCount, error) => {
                if (error.status === 401 || error.status === 403) {
                    return false;
                }
                return failureCount < 3; // More retries for count
            }
        }
    );

    // Custom mutation for marking as read with optimistic updates
    const markAsReadMutation = useCustomMutation(
        (notificationId: ResId) => notificationFeatureService.markAsRead(notificationId, currentUserId, getAuthToken()),
        {
            onSuccess: (result, notificationId) => {
                console.log('Notification marked as read:', { notificationId, userId: currentUserId });

                // Invalidate relevant caches
                invalidateCache.invalidateUserNotifications(currentUserId);

                // Update queries
                notificationsQuery.refetch();
                unreadCountQuery.refetch();

                // Update selected notification if it's the one being marked as read
                if (selectedNotification && selectedNotification.id === notificationId) {
                    setSelectedNotification({ ...selectedNotification, isSeen: true });
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error marking notification as read:', error);
            },
            optimisticUpdate: (cache, notificationId) => {
                // Optimistically update the notification in cache
                const cacheKey = `notification:item:${notificationId}`;
                const cached = cache.get(cacheKey);
                if (cached) {
                    cache.set(cacheKey, { ...cached, isSeen: true }, NOTIFICATION_CACHE_TTL.NOTIFICATION);
                }

                return () => {
                    // Rollback on error
                    const cached = cache.get(cacheKey);
                    if (cached) {
                        cache.set(cacheKey, { ...cached, isSeen: false }, NOTIFICATION_CACHE_TTL.NOTIFICATION);
                    }
                };
            }
        }
    );

    // Custom mutation for marking multiple as read
    const markMultipleAsReadMutation = useCustomMutation(
        (notificationIds: ResId[]) => notificationFeatureService.markMultipleAsRead(notificationIds, currentUserId, getAuthToken()),
        {
            onSuccess: (results, notificationIds) => {
                console.log('Multiple notifications marked as read:', { count: notificationIds.length, userId: currentUserId });

                // Invalidate relevant caches
                invalidateCache.invalidateUserNotifications(currentUserId);

                // Update queries
                notificationsQuery.refetch();
                unreadCountQuery.refetch();
            },
            onError: (error) => {
                setError(error);
                console.error('Error marking multiple notifications as read:', error);
            },
            optimisticUpdate: (cache, notificationIds) => {
                // Optimistically update all notifications in cache
                notificationIds.forEach(id => {
                    const cacheKey = `notification:item:${id}`;
                    const cached = cache.get(cacheKey);
                    if (cached) {
                        cache.set(cacheKey, { ...cached, isSeen: true }, NOTIFICATION_CACHE_TTL.NOTIFICATION);
                    }
                });

                return () => {
                    // Rollback on error
                    notificationIds.forEach(id => {
                        const cacheKey = `notification:item:${id}`;
                        const cached = cache.get(cacheKey);
                        if (cached) {
                            cache.set(cacheKey, { ...cached, isSeen: false }, NOTIFICATION_CACHE_TTL.NOTIFICATION);
                        }
                    });
                };
            }
        }
    );

    // Custom mutation for deleting notifications
    const deleteNotificationMutation = useCustomMutation(
        (notificationId: ResId) => notificationDataService.deleteNotification(notificationId, getAuthToken()),
        {
            onSuccess: (_, notificationId) => {
                console.log('Notification deleted:', { notificationId, userId: currentUserId });

                // Invalidate relevant caches
                invalidateCache.invalidateUserNotifications(currentUserId);

                // Update queries
                notificationsQuery.refetch();
                unreadCountQuery.refetch();

                // Clear selected notification if it was the one being deleted
                if (selectedNotification && selectedNotification.id === notificationId) {
                    setSelectedNotification(null);
                }
            },
            onError: (error) => {
                setError(error);
                console.error('Error deleting notification:', error);
            }
        }
    );

    // Custom query for searching notifications
    const searchNotificationsQuery = useCustomQuery(
        ['notifications', 'search', currentUserId, searchQuery],
        () => searchQuery ? notificationFeatureService.searchNotifications(currentUserId, searchQuery, filters, getAuthToken()) : null,
        {
            staleTime: NOTIFICATION_CACHE_TTL.SEARCH_RESULTS,
            cacheTime: NOTIFICATION_CACHE_TTL.SEARCH_RESULTS,
            enabled: !!searchQuery && searchQuery.length >= 2,
            onSuccess: (data) => {
                console.log('Search results loaded:', { count: data?.content?.length, query: searchQuery });
            },
            onError: (error) => {
                setError(error);
                console.error('Error searching notifications:', error);
            }
        }
    );

    // Custom query for notification by ID
    const notificationByIdQuery = useCustomQuery(
        ['notification', selectedNotification?.id],
        () => selectedNotification ? notificationDataService.getNotificationById(selectedNotification.id, getAuthToken()) : null,
        {
            staleTime: NOTIFICATION_CACHE_TTL.NOTIFICATION,
            cacheTime: NOTIFICATION_CACHE_TTL.NOTIFICATION,
            enabled: !!selectedNotification?.id,
            onSuccess: (data) => {
                if (data) {
                    setSelectedNotification(data);
                }
            },
            onError: (error) => {
                console.error('Error fetching notification by ID:', error);
            }
        }
    );

    // Action implementations
    const fetchNotifications = useCallback(async (userId: string, query: Partial<NotificationQuery> = {}) => {
        try {
            setError(null);
            await notificationFeatureService.getUserNotifications(userId, query, getAuthToken());
            notificationsQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching notifications:', err);
        }
    }, [notificationFeatureService, notificationsQuery, getAuthToken]);

    const fetchNotificationsByType = useCallback(async (type: NotificationType, userId: string, query: Partial<NotificationQuery> = {}) => {
        try {
            setError(null);
            const result = await notificationFeatureService.getNotificationsByType(userId, type, query, getAuthToken());
            // Update the notifications state with type-filtered results
            // This would typically be handled by a separate query
            console.log('Notifications by type loaded:', { type, count: result?.content?.length });
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching notifications by type:', err);
        }
    }, [notificationFeatureService, getAuthToken]);

    const fetchUnreadCount = useCallback(async (userId: string) => {
        try {
            setError(null);
            await notificationFeatureService.getUnreadCount(userId, getAuthToken());
            unreadCountQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching unread count:', err);
        }
    }, [notificationFeatureService, unreadCountQuery, getAuthToken]);

    const markAsRead = useCallback(async (notificationId: ResId) => {
        await markAsReadMutation.mutateAsync(notificationId);
    }, [markAsReadMutation]);

    const markMultipleAsRead = useCallback(async (notificationIds: ResId[]) => {
        await markMultipleAsReadMutation.mutateAsync(notificationIds);
    }, [markMultipleAsReadMutation]);

    const deleteNotification = useCallback(async (notificationId: ResId) => {
        await deleteNotificationMutation.mutateAsync(notificationId);
    }, [deleteNotificationMutation]);

    const getNotificationById = useCallback(async (notificationId: ResId) => {
        try {
            setError(null);
            const result = await notificationDataService.getNotificationById(notificationId, getAuthToken());
            setSelectedNotification(result);
        } catch (err) {
            setError(err as Error);
            console.error('Error getting notification by ID:', err);
        }
    }, [notificationDataService, getAuthToken]);

    const searchNotifications = useCallback(async (query: string, userId: string) => {
        try {
            setError(null);
            await notificationFeatureService.searchNotifications(userId, query, filters, getAuthToken());
            searchNotificationsQuery.refetch();
        } catch (err) {
            setError(err as Error);
            console.error('Error searching notifications:', err);
        }
    }, [notificationFeatureService, searchNotificationsQuery, filters, getAuthToken]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        notificationsQuery.refetch();
        unreadCountQuery.refetch();
    }, [notificationsQuery, unreadCountQuery]);

    // Auto-refresh on mount
    useEffect(() => {
        if (currentUserId) {
            notificationsQuery.refetch();
            unreadCountQuery.refetch();
        }
    }, [currentUserId, notificationsQuery, unreadCountQuery]);

    return {
        // State
        notifications: notificationsQuery.data || (searchQuery ? searchNotificationsQuery.data : null),
        unreadCount: unreadCountQuery.data,
        selectedNotification,
        isLoading: notificationsQuery.isLoading || unreadCountQuery.isLoading || searchNotificationsQuery.isLoading,
        error: error || notificationsQuery.error || unreadCountQuery.error || searchNotificationsQuery.error,
        filters,
        searchQuery,
        activeFilter,

        // Actions
        fetchNotifications,
        fetchNotificationsByType,
        fetchUnreadCount,
        markAsRead,
        markMultipleAsRead,
        deleteNotification,
        getNotificationById,
        searchNotifications,
        setSelectedNotification,
        setFilters,
        setActiveFilter,
        setSearchQuery,
        clearError,
        refresh,
    };
};
