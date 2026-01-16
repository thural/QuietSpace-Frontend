/**
 * Notification Hook.
 * 
 * Hook for managing notification functionality with repository pattern.
 * Provides traditional state management and operations.
 */

import { useState, useCallback, useEffect } from 'react';
import type { NotificationPage, NotificationResponse, NotificationType } from "@/api/schemas/inferred/notification";
import type { ResId, JwtToken } from "@/api/schemas/inferred/common";
import type { 
    NotificationQuery, 
    NotificationFilters, 
    NotificationResult,
    NotificationMessage,
    NotificationSettings,
    NotificationStatus,
    NotificationParticipant,
    NotificationTypingIndicator,
    NotificationEvent
} from "../../domain/entities/NotificationEntities";
import type { INotificationRepository } from "../../domain/entities/INotificationRepository";
import { useNotificationDI } from "../../di/useNotificationDI";

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
    setSearchQuery: (query: string) => void;
    clearError: () => void;
    refresh: () => void;
}

/**
 * Notification Hook.
 * 
 * Hook that provides notification functionality with traditional state management.
 * Integrates with the repository pattern and dependency injection.
 */
export const useNotifications = (config?: { useReactQuery?: boolean }): NotificationState & NotificationActions => {
    const { notificationRepository } = useNotificationDI();
    
    // State
    const [notifications, setNotifications] = useState<NotificationPage | null>(null);
    const [unreadCount, setUnreadCount] = useState<number | null>(null);
    const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState<NotificationFilters>({});
    const [searchQuery, setSearchQuery] = useState('');

    // Get authentication token
    const getAuthToken = useCallback((): string => {
        try {
            if (typeof require !== 'undefined') {
                const authStore = require('@services/store/zustand').useAuthStore.getState();
                return authStore.data.accessToken || '';
            } else {
                return 'test-token';
            }
        } catch (err) {
            console.error('useNotifications: Error getting auth token', err);
            return '';
        }
    }, []);

    // Fetch notifications
    const fetchNotifications = useCallback(async (userId: string, query: Partial<NotificationQuery> = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = getAuthToken();
            const fullQuery: NotificationQuery = {
                userId,
                page: 0,
                size: 9,
                ...query,
                filters
            };
            
            const result = await notificationRepository.getNotifications(fullQuery, token);
            setNotifications(result);
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error fetching notifications:', err);
        } finally {
            setIsLoading(false);
        }
    }, [notificationRepository, filters, getAuthToken]);

    // Fetch notifications by type
    const fetchNotificationsByType = useCallback(async (type: NotificationType, userId: string, query: Partial<NotificationQuery> = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = getAuthToken();
            const fullQuery: NotificationQuery = {
                userId,
                page: 0,
                size: 9,
                ...query,
                filters
            };
            
            const result = await notificationRepository.getNotificationsByType(type, fullQuery, token);
            setNotifications(result);
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error fetching notifications by type:', err);
        } finally {
            setIsLoading(false);
        }
    }, [notificationRepository, filters, getAuthToken]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async (userId: string) => {
        try {
            setError(null);
            
            const token = getAuthToken();
            const result = await notificationRepository.getPendingNotificationsCount(userId, token);
            setUnreadCount(result);
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error fetching unread count:', err);
        }
    }, [notificationRepository, getAuthToken]);

    // Mark as read
    const markAsRead = useCallback(async (notificationId: ResId) => {
        try {
            setError(null);
            
            const token = getAuthToken();
            const result = await notificationRepository.markNotificationAsSeen(notificationId, token);
            
            // Update local state
            if (notifications) {
                setNotifications({
                    ...notifications,
                    content: notifications.content.map(notification =>
                        notification.id === notificationId ? { ...notification, isSeen: true } : notification
                    )
                });
            }
            
            // Update selected notification if it's the one being marked as read
            if (selectedNotification && selectedNotification.id === notificationId) {
                setSelectedNotification({ ...selectedNotification, isSeen: true });
            }
            
            // Update unread count
            if (unreadCount !== null && unreadCount > 0) {
                setUnreadCount(unreadCount - 1);
            }
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error marking notification as read:', err);
        }
    }, [notificationRepository, notifications, selectedNotification, unreadCount, getAuthToken]);

    // Mark multiple as read
    const markMultipleAsRead = useCallback(async (notificationIds: ResId[]) => {
        try {
            setError(null);
            
            const token = getAuthToken();
            const results = await notificationRepository.markMultipleNotificationsAsSeen(notificationIds, token);
            
            // Update local state
            if (notifications) {
                setNotifications({
                    ...notifications,
                    content: notifications.content.map(notification =>
                        notificationIds.includes(notification.id) ? { ...notification, isSeen: true } : notification
                    )
                });
            }
            
            // Update unread count
            if (unreadCount !== null) {
                const markedCount = notificationIds.filter(id => 
                    notifications?.content.some(n => n.id === id && !n.isSeen)
                ).length;
                setUnreadCount(Math.max(0, unreadCount - markedCount));
            }
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error marking multiple notifications as read:', err);
        }
    }, [notificationRepository, notifications, unreadCount, getAuthToken]);

    // Delete notification
    const deleteNotification = useCallback(async (notificationId: ResId) => {
        try {
            setError(null);
            
            const token = getAuthToken();
            await notificationRepository.deleteNotification(notificationId, token);
            
            // Update local state
            if (notifications) {
                const wasUnread = notifications.content.find(n => n.id === notificationId)?.isSeen === false;
                setNotifications({
                    ...notifications,
                    content: notifications.content.filter(notification => notification.id !== notificationId),
                    totalElements: notifications.totalElements - 1,
                    numberOfElements: notifications.numberOfElements - 1
                });
                
                // Update unread count if the deleted notification was unread
                if (wasUnread && unreadCount !== null && unreadCount > 0) {
                    setUnreadCount(unreadCount - 1);
                }
            }
            
            // Clear selected notification if it was the one being deleted
            if (selectedNotification && selectedNotification.id === notificationId) {
                setSelectedNotification(null);
            }
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error deleting notification:', err);
        }
    }, [notificationRepository, notifications, selectedNotification, unreadCount, getAuthToken]);

    // Get notification by ID
    const getNotificationById = useCallback(async (notificationId: ResId) => {
        try {
            setError(null);
            
            const token = getAuthToken();
            const result = await notificationRepository.getNotificationById(notificationId, token);
            setSelectedNotification(result);
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error getting notification by ID:', err);
        }
    }, [notificationRepository, getAuthToken]);

    // Search notifications
    const searchNotifications = useCallback(async (query: string, userId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = getAuthToken();
            const fullQuery: NotificationQuery = {
                userId,
                page: 0,
                size: 9,
                filters
            };
            
            const result = await notificationRepository.searchNotifications(query, fullQuery, token);
            setNotifications(result);
        } catch (err) {
            setError(err as Error);
            console.error('useNotifications: Error searching notifications:', err);
        } finally {
            setIsLoading(false);
        }
    }, [notificationRepository, filters, getAuthToken]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Refresh data
    const refresh = useCallback(() => {
        const userId = 'current-user'; // Placeholder - should come from auth store
        fetchNotifications(userId);
        fetchUnreadCount(userId);
    }, [fetchNotifications, fetchUnreadCount]);

    // Auto-refresh on mount
    useEffect(() => {
        const userId = 'current-user'; // Placeholder
        fetchNotifications(userId);
        fetchUnreadCount(userId);
    }, [fetchNotifications, fetchUnreadCount]);

    return {
        // State
        notifications,
        unreadCount,
        selectedNotification,
        isLoading,
        error,
        filters,
        searchQuery,
        
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
        setSearchQuery,
        clearError,
        refresh,
    };
};
