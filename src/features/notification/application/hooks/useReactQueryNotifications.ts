/**
 * React Query Notification Hook.
 * 
 * Hook that provides React Query-based notification functionality.
 * Can be toggled on/off based on configuration.
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import type { NotificationPage, NotificationResponse, NotificationType } from "@/api/schemas/inferred/notification";
import type { ResId, JwtToken } from "@/api/schemas/inferred/common";
import type { INotificationRepository } from "../../domain/entities/INotificationRepository";
import { useNotificationDI } from "../../di/useNotificationDI";

/**
 * React Query Notification State interface.
 */
export interface ReactQueryNotificationState {
    notifications: UseQueryResult<NotificationPage, Error>;
    unreadCount: UseQueryResult<number, Error>;
    isLoading: boolean;
    error: Error | null;
    
    // Additional React Query specific methods
    prefetchNotifications?: (userId: string) => Promise<void>;
    invalidateCache?: () => void;
}

/**
 * React Query Notification Actions interface.
 */
export interface ReactQueryNotificationActions {
    markAsRead: UseMutationResult<NotificationResponse, Error, ResId>;
    markMultipleAsRead: UseMutationResult<NotificationResponse[], Error, ResId[]>;
    deleteNotification: UseMutationResult<void, Error, ResId>;
    getNotificationById: UseMutationResult<NotificationResponse, Error, ResId>;
    searchNotifications: UseMutationResult<NotificationPage, Error, { query: string; userId: string }>;
}

/**
 * React Query Notification Hook.
 * 
 * Hook that provides React Query-based notification functionality.
 * Integrates with the repository pattern and dependency injection.
 */
export const useReactQueryNotifications = (config?: { useReactQuery?: boolean }): ReactQueryNotificationState & ReactQueryNotificationActions => {
    const queryClient = useQueryClient();
    const { notificationRepository } = useNotificationDI();
    const [error, setError] = useState<Error | null>(null);

    // Get notifications query
    const notifications = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            try {
                setError(null);
                // This would typically get the current user ID from auth store
                const userId = 'current-user'; // Placeholder
                return await notificationRepository.getNotifications({ userId });
            } catch (err) {
                setError(err as Error);
                throw err;
            }
        },
        staleTime: 1000 * 60 * 3, // 3 minutes
        gcTime: 1000 * 60 * 15, // 15 minutes
        refetchInterval: 1000 * 60 * 6, // 6 minutes
        enabled: !!notificationRepository,
    });

    // Get unread count query
    const unreadCount = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            try {
                setError(null);
                const userId = 'current-user'; // Placeholder
                return await notificationRepository.getPendingNotificationsCount(userId, 'test-token');
            } catch (err) {
                setError(err as Error);
                throw err;
            }
        },
        staleTime: 1000 * 60 * 1, // 1 minute
        refetchInterval: 1000 * 60 * 2, // 2 minutes
        enabled: !!notificationRepository,
    });

    // Mark as read mutation
    const markAsRead = useMutation({
        mutationFn: async (notificationId: ResId) => {
            return await notificationRepository.markNotificationAsSeen(notificationId, 'test-token');
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
        onError: (err) => {
            setError(err as Error);
        },
    });

    // Mark multiple as read mutation
    const markMultipleAsRead = useMutation({
        mutationFn: async (notificationIds: ResId[]) => {
            return await notificationRepository.markMultipleNotificationsAsSeen(notificationIds, 'test-token');
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
        onError: (err) => {
            setError(err as Error);
        },
    });

    // Delete notification mutation
    const deleteNotification = useMutation({
        mutationFn: async (notificationId: ResId) => {
            await notificationRepository.deleteNotification(notificationId, 'test-token');
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
        onError: (err) => {
            setError(err as Error);
        },
    });

    // Get notification by ID mutation
    const getNotificationById = useMutation({
        mutationFn: async (notificationId: ResId) => {
            return await notificationRepository.getNotificationById(notificationId, 'test-token');
        },
        onError: (err) => {
            setError(err as Error);
        },
    });

    // Search notifications mutation
    const searchNotifications = useMutation({
        mutationFn: async ({ query, userId }: { query: string; userId: string }) => {
            return await notificationRepository.searchNotifications(query, { userId }, 'test-token');
        },
        onError: (err) => {
            setError(err as Error);
        },
    });

    // Prefetch notifications
    const prefetchNotifications = useCallback(async (userId: string) => {
        await queryClient.prefetchQuery({
            queryKey: ['notifications'],
            queryFn: () => notificationRepository.getNotifications({ userId }),
            staleTime: 1000 * 60 * 3,
        });
    }, [notificationRepository, queryClient]);

    // Invalidate cache
    const invalidateCache = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    }, [queryClient]);

    // Calculate overall loading state
    const isLoading = notifications.isLoading || unreadCount.isLoading;

    return {
        // State
        notifications,
        unreadCount,
        isLoading,
        error,
        
        // Actions
        markAsRead,
        markMultipleAsRead,
        deleteNotification,
        getNotificationById,
        searchNotifications,
        
        // Additional methods
        prefetchNotifications,
        invalidateCache,
    };
};
