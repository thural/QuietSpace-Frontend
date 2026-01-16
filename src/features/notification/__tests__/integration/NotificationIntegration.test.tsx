/**
 * Notification Integration Tests.
 * 
 * Integration tests for the complete notification system.
 * Tests the interaction between all layers of the 4-layer architecture.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationDIContainer } from '../../di/NotificationDIContainer';
import { useNotifications } from '../../application/hooks/useNotifications';
import { useAdvancedNotifications } from '../../application/hooks/useAdvancedNotifications';
import type { NotificationQuery } from '../../domain/entities/NotificationEntities';

// Test wrapper for React Query
const createTestWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Notification Integration Tests', () => {
    let diContainer: NotificationDIContainer;
    let queryClient: QueryClient;
    let wrapper: ReturnType<typeof createTestWrapper>;

    beforeEach(() => {
        // Set up DI container with mock repositories
        diContainer = new NotificationDIContainer({
            useMockRepositories: true,
            enableLogging: false,
            useReactQuery: false
        });

        // Set up React Query
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        wrapper = createTestWrapper();
    });

    describe('DI Container Integration', () => {
        it('should provide working dependencies', () => {
            const repository = diContainer.getNotificationRepository();
            expect(repository).toBeDefined();
            expect(typeof repository.getNotifications).toBe('function');
        });

        it('should handle configuration changes', () => {
            const initialConfig = diContainer.getConfig();
            expect(initialConfig.useMockRepositories).toBe(true);

            diContainer.updateConfig({ useMockRepositories: false });
            const updatedConfig = diContainer.getConfig();
            expect(updatedConfig.useMockRepositories).toBe(false);
        });

        it('should maintain singleton behavior', () => {
            const repo1 = diContainer.getNotificationRepository();
            const repo2 = diContainer.getNotificationRepository();
            expect(repo1).toBe(repo2);
        });
    });

    describe('Repository Integration', () => {
        it('should perform complete CRUD operations', async () => {
            const repository = diContainer.getNotificationRepository();

            // Create (simulate by getting notifications)
            const notifications = await repository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 10
            }, 'test-token');

            expect(notifications.content).toBeDefined();
            expect(notifications.content.length).toBeGreaterThan(0);

            // Read
            const notificationId = notifications.content[0].id;
            const singleNotification = await repository.getNotificationById(notificationId, 'test-token');
            expect(singleNotification).toBeDefined();
            expect(singleNotification.id).toBe(notificationId);

            // Update
            const updatedNotification = await repository.markNotificationAsSeen(notificationId, 'test-token');
            expect(updatedNotification.isSeen).toBe(true);

            // Delete
            await repository.deleteNotification(notificationId, 'test-token');
            // Note: In mock implementation, this just removes from memory
        });

        it('should handle pagination correctly', async () => {
            const repository = diContainer.getNotificationRepository();

            const page1 = await repository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 5
            }, 'test-token');

            const page2 = await repository.getNotifications({
                userId: 'test-user',
                page: 1,
                size: 5
            }, 'test-token');

            expect(page1.pageable.pageNumber).toBe(0);
            expect(page2.pageable.pageNumber).toBe(1);
            expect(page1.content.length).toBeLessThanOrEqual(5);
            expect(page2.content.length).toBeLessThanOrEqual(5);
        });

        it('should handle filtering and searching', async () => {
            const repository = diContainer.getNotificationRepository();

            // Filter by seen status
            const unreadNotifications = await repository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 10,
                isSeen: false
            }, 'test-token');

            expect(unreadNotifications.content.every(n => !n.isSeen)).toBe(true);

            // Search
            const searchResults = await repository.searchNotifications('test', {
                userId: 'test-user',
                page: 0,
                size: 10
            }, 'test-token');

            expect(searchResults.content).toBeDefined();
        });
    });

    describe('Hook Integration', () => {
        it('should initialize useNotifications hook successfully', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await waitFor(() => {
                expect(result.current).toBeDefined();
                expect(result.current.notifications).toBeDefined();
                expect(result.current.unreadCount).toBeDefined();
                expect(typeof result.current.fetchNotifications).toBe('function');
                expect(typeof result.current.markAsRead).toBe('function');
            });
        });

        it('should fetch notifications on mount', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications).toBeDefined();
                expect(result.current.notifications?.content).toBeDefined();
                expect(Array.isArray(result.current.notifications?.content)).toBe(true);
            });
        });

        it('should handle mark as read operation', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications?.content.length).toBeGreaterThan(0);
            });

            const notificationId = result.current.notifications?.content[0]?.id;
            if (notificationId) {
                await act(async () => {
                    await result.current.markAsRead(notificationId);
                });

                await waitFor(() => {
                    const updatedNotification = result.current.notifications?.content.find(n => n.id === notificationId);
                    expect(updatedNotification?.isSeen).toBe(true);
                });
            }
        });

        it('should handle search functionality', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await act(async () => {
                await result.current.searchNotifications('test', 'test-user');
            });

            await waitFor(() => {
                expect(result.current.notifications).toBeDefined();
                expect(result.current.searchQuery).toBe('test');
            });
        });

        it('should handle filter changes', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await act(() => {
                result.current.setActiveFilter('unread');
            });

            await waitFor(() => {
                expect(result.current.activeFilter).toBe('unread');
            });
        });
    });

    describe('Advanced Hook Integration', () => {
        it('should initialize useAdvancedNotifications hook successfully', async () => {
            const { result } = renderHook(() => useAdvancedNotifications({
                userId: 'test-user',
                enableRealTime: false,
                syncStrategy: 'server_first'
            }), { wrapper });

            await waitFor(() => {
                expect(result.current).toBeDefined();
                expect(result.current.notifications).toBeDefined();
                expect(result.current.unreadCount).toBeDefined();
                expect(typeof result.current.markAsRead).toBe('function');
                expect(typeof result.current.forceSync).toBe('function');
            });
        });

        it('should handle optimistic updates', async () => {
            const { result } = renderHook(() => useAdvancedNotifications({
                userId: 'test-user',
                enableRealTime: false
            }), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications?.content.length).toBeGreaterThan(0);
            });

            const notificationId = result.current.notifications?.content[0]?.id;
            if (notificationId) {
                await act(async () => {
                    await result.current.markAsRead(notificationId);
                });

                await waitFor(() => {
                    expect(result.current.hasPendingOperations).toBe(false);
                    expect(result.current.hasOptimisticUpdates).toBe(false);
                });
            }
        });

        it('should handle UI state management', async () => {
            const { result } = renderHook(() => useAdvancedNotifications({
                userId: 'test-user',
                enableRealTime: false
            }), { wrapper });

            // Test panel state
            await act(() => {
                result.current.openPanel();
            });
            expect(result.current.isPanelOpen).toBe(true);

            await act(() => {
                result.current.closePanel();
            });
            expect(result.current.isPanelOpen).toBe(false);

            // Test filter state
            await act(() => {
                result.current.setActiveFilter('unread');
            });
            expect(result.current.activeFilter).toBe('unread');

            // Test search state
            await act(() => {
                result.current.setSearchQuery('test');
            });
            expect(result.current.searchQuery).toBe('test');
        });

        it('should handle pagination', async () => {
            const { result } = renderHook(() => useAdvancedNotifications({
                userId: 'test-user',
                enableRealTime: false
            }), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications).toBeDefined();
            });

            // Test next page
            if (result.current.hasMore) {
                await act(async () => {
                    await result.current.nextPage();
                });

                await waitFor(() => {
                    expect(result.current.currentPage).toBeGreaterThan(0);
                });
            }
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle repository errors gracefully', async () => {
            const repository = diContainer.getNotificationRepository();

            // Test invalid notification ID
            await expect(repository.getNotificationById(999999, 'test-token')).rejects.toThrow();
        });

        it('should handle hook errors gracefully', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await waitFor(() => {
                expect(result.current.error).toBeNull();
            });

            // Simulate an error by trying to mark a non-existent notification as read
            await act(async () => {
                try {
                    await result.current.markAsRead(999999);
                } catch (error) {
                    // Expected to fail
                }
            });

            // The hook should still be functional
            expect(result.current).toBeDefined();
        });
    });

    describe('Performance Integration', () => {
        it('should handle concurrent operations efficiently', async () => {
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications?.content.length).toBeGreaterThan(0);
            });

            const notificationId = result.current.notifications?.content[0]?.id;
            if (notificationId) {
                // Perform multiple operations concurrently
                await act(async () => {
                    await Promise.all([
                        result.current.markAsRead(notificationId),
                        result.current.fetchNotifications('test-user'),
                        result.current.fetchUnreadCount('test-user')
                    ]);
                });

                await waitFor(() => {
                    expect(result.current.notifications).toBeDefined();
                    expect(result.current.unreadCount).toBeDefined();
                });
            }
        });

        it('should maintain performance with large datasets', async () => {
            const repository = diContainer.getNotificationRepository();

            const startTime = Date.now();
            
            // Fetch a large page
            await repository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 100
            }, 'test-token');

            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });
    });

    describe('Data Consistency Integration', () => {
        it('should maintain consistency between hooks and repositories', async () => {
            const repository = diContainer.getNotificationRepository();
            const { result } = renderHook(() => useNotifications(), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications).toBeDefined();
            });

            // Get data from repository
            const repositoryData = await repository.getNotifications({
                userId: 'test-user',
                page: 0,
                size: 10
            }, 'test-token');

            // Get data from hook
            const hookData = result.current.notifications;

            expect(repositoryData.content.length).toBe(hookData?.content.length);
            expect(repositoryData.totalElements).toBe(hookData?.totalElements);
        });

        it('should handle state synchronization correctly', async () => {
            const { result } = renderHook(() => useAdvancedNotifications({
                userId: 'test-user',
                enableRealTime: false
            }), { wrapper });

            await waitFor(() => {
                expect(result.current.notifications).toBeDefined();
            });

            const notificationId = result.current.notifications?.content[0]?.id;
            if (notificationId) {
                // Mark as read through hook
                await act(async () => {
                    await result.current.markAsRead(notificationId);
                });

                // Force sync to ensure consistency
                await act(async () => {
                    await result.current.forceSync();
                });

                await waitFor(() => {
                    const updatedNotification = result.current.notifications?.content.find(n => n.id === notificationId);
                    expect(updatedNotification?.isSeen).toBe(true);
                });
            }
        });
    });

    describe('Real-time Integration (Mock)', () => {
        it('should handle real-time configuration', async () => {
            const { result } = renderHook(() => useAdvancedNotifications({
                userId: 'test-user',
                enableRealTime: true
            }), { wrapper });

            await waitFor(() => {
                expect(result.current).toBeDefined();
                expect(result.current.isConnected).toBe(false); // Mock implementation
            });

            // Test enabling/disabling real-time
            await act(() => {
                result.current.disableRealTime();
            });
            expect(result.current.isConnected).toBe(false);

            await act(() => {
                result.current.enableRealTime();
            });
            expect(result.current.isConnected).toBe(false); // Still false in mock
        });
    });
});
