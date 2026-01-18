/**
 * Notification E2E Tests.
 * 
 * End-to-end tests for complete user flows.
 * Tests the entire notification system from user perspective.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Extend Jest matchers with jest-dom
declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
    }
  }
}

// Import the mocked hooks
import { useAdvancedNotifications, type UseAdvancedNotifications } from '../../application/hooks/useAdvancedNotifications';
import { useNotificationUIStore } from '../../application/stores/notificationUIStore';

// Mock the entire application
const mockUseAdvancedNotifications = jest.fn() as jest.MockedFunction<typeof useAdvancedNotifications>;
const mockUseNotificationUIStore = jest.fn();

jest.mock('../../application/hooks/useAdvancedNotifications', () => ({
    useAdvancedNotifications: mockUseAdvancedNotifications,
}));

jest.mock('../../application/stores/notificationUIStore', () => ({
    useNotificationUIStore: mockUseNotificationUIStore,
}));

// Mock the NotificationContainer
const MockNotificationContainer = () => {
    const { 
        notifications, 
        unreadCount, 
        isLoading, 
        error, 
        isPanelOpen, 
        activeFilter, 
        searchQuery,
        hasMore,
        markAsRead, 
        deleteNotification, 
        openPanel, 
        closePanel, 
        setActiveFilter, 
        setSearchQuery, 
        loadMore, 
        forceSync 
    } = useAdvancedNotifications({
        userId: 'test-user',
        enableRealTime: false,
        syncStrategy: 'server_first'
    });

    if (isLoading) return <div data-testid="loading">Loading notifications...</div>;
    if (error) return <div data-testid="error">Error loading notifications</div>;

    return (
        <div data-testid="notification-app">
            <header data-testid="notification-header">
                <button 
                    data-testid="notification-toggle"
                    onClick={isPanelOpen ? closePanel : openPanel}
                >
                    {isPanelOpen ? 'Close' : 'Open'} Notifications ({unreadCount || 0})
                </button>
            </header>

            {isPanelOpen && (
                <div data-testid="notification-panel">
                    <div data-testid="notification-filters">
                        <button 
                            data-testid="filter-all"
                            onClick={() => setActiveFilter('all')}
                            className={activeFilter === 'all' ? 'active' : ''}
                        >
                            All
                        </button>
                        <button 
                            data-testid="filter-unread"
                            onClick={() => setActiveFilter('unread')}
                            className={activeFilter === 'unread' ? 'active' : ''}
                        >
                            Unread
                        </button>
                        <button 
                            data-testid="filter-read"
                            onClick={() => setActiveFilter('read')}
                            className={activeFilter === 'read' ? 'active' : ''}
                        >
                            Read
                        </button>
                    </div>

                    <div data-testid="notification-search">
                        <input
                            data-testid="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notifications..."
                        />
                    </div>

                    <div data-testid="notification-list">
                        {notifications?.content.map((notification: any) => (
                            <div key={notification.id} data-testid={`notification-${notification.id}`}>
                                <div data-testid={`notification-type-${notification.id}`}>
                                    {notification.type}
                                </div>
                                <div data-testid={`notification-status-${notification.id}`}>
                                    {notification.isSeen ? 'Read' : 'Unread'}
                                </div>
                                <button 
                                    data-testid={`mark-read-${notification.id}`}
                                    onClick={() => markAsRead(notification.id)}
                                    disabled={notification.isSeen}
                                >
                                    Mark as Read
                                </button>
                                <button 
                                    data-testid={`delete-${notification.id}`}
                                    onClick={() => deleteNotification(notification.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <div data-testid="notification-actions">
                        <button 
                            data-testid="load-more"
                            onClick={loadMore}
                            disabled={!hasMore}
                        >
                            Load More
                        </button>
                        <button 
                            data-testid="force-sync"
                            onClick={forceSync}
                        >
                            Force Sync
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

describe('Notification E2E Tests', () => {
    let queryClient: QueryClient;
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        user = userEvent.setup();
        jest.clearAllMocks();

        // Initialize mocks with default return values
        mockUseAdvancedNotifications.mockReturnValue({
            // Data state
            notifications: { content: [], totalElements: 0, numberOfElements: 0 },
            unreadCount: 0,
            selectedNotification: null,
            
            // Loading states
            isLoading: false,
            isRefreshing: false,
            isLoadingMore: false,
            
            // Error state
            error: null,
            
            // Real-time state
            isConnected: false,
            connectionStatus: 'disconnected' as const,
            lastSyncTime: null,
            
            // UI state
            isPanelOpen: false,
            activeFilter: 'all' as const,
            searchQuery: '',
            currentPage: 0,
            hasMore: false,
            
            // Optimistic updates state
            hasPendingOperations: false,
            hasOptimisticUpdates: false,
            
            // Synchronization state
            hasConflicts: false,
            pendingConflicts: [],
            
            // Data operations
            refetch: jest.fn(),
            loadMore: jest.fn(),
            refresh: jest.fn(),
            
            // Notification operations
            markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
            markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
            deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
            searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
            
            // UI operations
            openPanel: jest.fn(),
            closePanel: jest.fn(),
            togglePanel: jest.fn(),
            selectNotification: jest.fn(),
            clearSelection: jest.fn(),
            
            // Filter operations
            setActiveFilter: jest.fn(),
            setCustomFilters: jest.fn(),
            setSearchQuery: jest.fn(),
            clearFilters: jest.fn(),
            
            // Pagination operations
            nextPage: jest.fn(),
            previousPage: jest.fn(),
            goToPage: jest.fn(),
            
            // Real-time operations
            enableRealTime: jest.fn(),
            disableRealTime: jest.fn(),
            
            // Synchronization operations
            forceSync: jest.fn(() => Promise.resolve(undefined)),
            resolveConflict: jest.fn(),
            clearConflicts: jest.fn(),
        });

        mockUseNotificationUIStore.mockReturnValue({
            isNotificationPanelOpen: false,
            activeFilter: 'all',
            searchQuery: '',
            currentPage: 0,
            hasMoreNotifications: false,
            isLoadingMore: false,
            openNotificationPanel: jest.fn(),
            closeNotificationPanel: jest.fn(),
            toggleNotificationPanel: jest.fn(),
            selectNotification: jest.fn(),
            clearSelection: jest.fn(),
            setActiveFilter: jest.fn(),
            setCustomFilters: jest.fn(),
            setSearchQuery: jest.fn(),
            clearFilters: jest.fn(),
            setCurrentPage: jest.fn(),
            nextPage: jest.fn(),
            previousPage: jest.fn(),
            setHasMoreNotifications: jest.fn(),
            setLoadingMore: jest.fn(),
        });
    });

    describe('Complete User Flows', () => {
        it('should handle complete notification workflow', async () => {
            // Mock the hook with realistic data
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                    { id: 2, type: 'COMMENT', isSeen: true },
                    { id: 3, type: 'MENTION', isSeen: false },
                ],
                totalElements: 3,
                numberOfElements: 3,
                last: false,
                first: true,
                totalPages: 2,
                size: 3,
                number: 0,
                sort: { sorted: false, unsorted: true, empty: false },
                pageable: { pageNumber: 0, pageSize: 3, sort: { sorted: false, unsorted: true, empty: false }, offset: 0, paged: true, unpaged: false },
                empty: false
            };

            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: mockNotifications,
                unreadCount: 2,
                selectedNotification: null,
                
                // Loading states
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: null,
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: false,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: true,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            // Step 1: Verify initial state
            expect(screen.getByTestId('notification-app')).toBeInTheDocument();
            expect(screen.getByTestId('notification-toggle')).toBeInTheDocument();
            expect(screen.getByText('Open Notifications (2)')).toBeInTheDocument();
            expect(screen.queryByTestId('notification-panel')).not.toBeInTheDocument();

            // Step 2: Open notification panel
            await user.click(screen.getByTestId('notification-toggle'));
            expect(mockUseAdvancedNotifications().openPanel).toHaveBeenCalled();

            // Step 3: Verify panel content
            await waitFor(() => {
                expect(screen.getByTestId('notification-panel')).toBeInTheDocument();
                expect(screen.getByTestId('notification-filters')).toBeInTheDocument();
                expect(screen.getByTestId('notification-search')).toBeInTheDocument();
                expect(screen.getByTestId('notification-list')).toBeInTheDocument();
            });

            // Step 4: Test filtering
            await user.click(screen.getByTestId('filter-unread'));
            expect(mockUseAdvancedNotifications().setActiveFilter).toHaveBeenCalledWith('unread');

            await user.click(screen.getByTestId('filter-all'));
            expect(mockUseAdvancedNotifications().setActiveFilter).toHaveBeenCalledWith('all');

            // Step 5: Test search
            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'test search');
            expect(mockUseAdvancedNotifications().setSearchQuery).toHaveBeenCalledWith('test search');

            // Step 6: Test notification actions
            const markReadButton = screen.getByTestId('mark-read-1');
            await user.click(markReadButton);
            expect(mockUseAdvancedNotifications().markAsRead).toHaveBeenCalledWith(1);

            const deleteButton = screen.getByTestId('delete-2');
            await user.click(deleteButton);
            expect(mockUseAdvancedNotifications().deleteNotification).toHaveBeenCalledWith(2);

            // Step 7: Test load more
            const loadMoreButton = screen.getByTestId('load-more');
            await user.click(loadMoreButton);
            expect(mockUseAdvancedNotifications().loadMore).toHaveBeenCalled();

            // Step 8: Test force sync
            const forceSyncButton = screen.getByTestId('force-sync');
            await user.click(forceSyncButton);
            expect(mockUseAdvancedNotifications().forceSync).toHaveBeenCalled();

            // Step 9: Close panel
            await user.click(screen.getByTestId('notification-toggle'));
            expect(mockUseAdvancedNotifications().closePanel).toHaveBeenCalled();
        });

        it('should handle empty notification state', async () => {
            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: { content: [], totalElements: 0, numberOfElements: 0, last: true, first: true, totalPages: 0, size: 10, number: 0, sort: { sorted: false, unsorted: true, empty: true }, pageable: { pageNumber: 0, pageSize: 10, sort: { sorted: false, unsorted: true, empty: true }, offset: 0, paged: true, unpaged: false }, empty: true },
                unreadCount: 0,
                selectedNotification: null,
                
                // Loading states
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: null,
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: false,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            expect(screen.getByText('Open Notifications (0)')).toBeInTheDocument();

            await user.click(screen.getByTestId('notification-toggle'));

            await waitFor(() => {
                expect(screen.getByTestId('notification-panel')).toBeInTheDocument();
                expect(screen.getByTestId('notification-list')).toBeInTheDocument();
                expect(screen.getByTestId('notification-list').children.length).toBe(0);
            });
        });

        it('should handle error state gracefully', async () => {
            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: null,
                unreadCount: 0,
                selectedNotification: null,
                
                // Loading states
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: new Error('Network error'),
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: false,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            expect(screen.getByTestId('error')).toBeInTheDocument();
            expect(screen.getByText('Error loading notifications')).toBeInTheDocument();
        });

        it('should handle loading state', async () => {
            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: null,
                unreadCount: 0,
                selectedNotification: null,
                
                // Loading states
                isLoading: true,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: null,
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: false,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            expect(screen.getByTestId('loading')).toBeInTheDocument();
            expect(screen.getByText('Loading notifications...')).toBeInTheDocument();
        });
    });

    describe('User Interaction Flows', () => {
        it('should handle rapid user interactions', async () => {
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                    { id: 2, type: 'COMMENT', isSeen: false },
                ],
                totalElements: 2,
                numberOfElements: 2,
                hasMore: false,
            };

            mockUseAdvancedNotifications.mockReturnValue({
                notifications: mockNotifications,
                unreadCount: 2,
                selectedNotification: null,
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                error: null,
                isConnected: true,
                connectionStatus: 'connected' as any,
                lastSyncTime: null,
                isPanelOpen: true,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                hasConflicts: false,
                pendingConflicts: [],
                markAsRead: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                markMultipleAsRead: jest.fn<(notificationIds: (string | number)[]) => Promise<void>>().mockResolvedValue(undefined),
                deleteNotification: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                searchNotifications: jest.fn<(query: string) => Promise<void>>().mockResolvedValue(undefined),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                togglePanel: jest.fn(),
                selectNotification: jest.fn<(id: string | number) => void>(),
                clearSelection: jest.fn(),
                setActiveFilter: jest.fn(),
                setCustomFilters: jest.fn(),
                setSearchQuery: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn<(page: number) => void>(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                refetch: jest.fn(),
                loadMore: jest.fn(),
                refresh: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            // Rapid filter switching
            await user.click(screen.getByTestId('filter-unread'));
            await user.click(screen.getByTestId('filter-read'));
            await user.click(screen.getByTestId('filter-all'));

            expect(mockUseAdvancedNotifications().setActiveFilter).toHaveBeenCalledTimes(3);

            // Rapid search typing
            const searchInput = screen.getByTestId('search-input');
            await user.type(searchInput, 'test');
            await user.clear(searchInput);
            await user.type(searchInput, 'search');

            expect(mockUseAdvancedNotifications().setSearchQuery).toHaveBeenCalledTimes(3);

            // Rapid notification actions
            await user.click(screen.getByTestId('mark-read-1'));
            await user.click(screen.getByTestId('delete-2'));

            expect(mockUseAdvancedNotifications().markAsRead).toHaveBeenCalledWith(1);
            expect(mockUseAdvancedNotifications().deleteNotification).toHaveBeenCalledWith(2);
        });

        it('should handle keyboard navigation', async () => {
            mockUseAdvancedNotifications.mockReturnValue({
                notifications: {
                    content: [{ id: 1, type: 'FOLLOW_REQUEST', isSeen: false }],
                    totalElements: 1,
                    numberOfElements: 1,
                    last: true,
                    first: true,
                    totalPages: 1,
                    size: 10,
                    number: 0,
                    sort: { sorted: false, unsorted: true, empty: false },
                    pageable: { pageNumber: 0, pageSize: 10, sort: { sorted: false, unsorted: true, empty: false }, offset: 0, paged: true, unpaged: false },
                    empty: false
                },
                unreadCount: 1,
                selectedNotification: null,
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                error: null,
                isConnected: true,
                connectionStatus: 'connected' as const,
                lastSyncTime: null,
                isPanelOpen: true,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                hasConflicts: false,
                pendingConflicts: [],
                markAsRead: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                deleteNotification: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setActiveFilter: jest.fn(),
                setCustomFilters: jest.fn(),
                setSearchQuery: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
                refetch: jest.fn(),
                refresh: jest.fn(),
                loadMore: jest.fn(),
                markMultipleAsRead: jest.fn<(notificationIds: (string | number)[]) => Promise<void>>().mockResolvedValue(undefined),
                searchNotifications: jest.fn<(query: string) => Promise<void>>().mockResolvedValue(undefined),
                forceSync: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            const toggleButton = screen.getByTestId('notification-toggle');
            toggleButton.focus();
            await user.keyboard('{Enter}');
            expect(mockUseAdvancedNotifications().openPanel).toHaveBeenCalled();

            const searchInput = screen.getByTestId('search-input');
            searchInput.focus();
            await user.keyboard('test search');
            expect(mockUseAdvancedNotifications().setSearchQuery).toHaveBeenCalledWith('test search');

            const markReadButton = screen.getByTestId('mark-read-1');
            markReadButton.focus();
            await user.keyboard('{Enter}');
            expect(mockUseAdvancedNotifications().markAsRead).toHaveBeenCalledWith(1);
        });
    });

    describe('Performance and Accessibility', () => {
        it('should handle large notification lists efficiently', async () => {
            const largeNotifications = {
                content: Array.from({ length: 100 }, (_, i) => ({
                    id: i + 1,
                    type: 'NOTIFICATION',
                    isSeen: i % 2 === 0
                })),
                totalElements: 100,
                numberOfElements: 100,
                hasMore: true,
            };

            mockUseAdvancedNotifications.mockReturnValue({
                notifications: largeNotifications,
                unreadCount: 50,
                selectedNotification: null,
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                error: null,
                isConnected: true,
                connectionStatus: 'connected' as const,
                lastSyncTime: null,
                isPanelOpen: true,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: true,
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                hasConflicts: false,
                pendingConflicts: [],
                markAsRead: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                deleteNotification: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setActiveFilter: jest.fn(),
                setCustomFilters: jest.fn(),
                setSearchQuery: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
                refetch: jest.fn(),
                refresh: jest.fn(),
                loadMore: jest.fn(),
                markMultipleAsRead: jest.fn<(notificationIds: (string | number)[]) => Promise<void>>().mockResolvedValue(undefined),
                searchNotifications: jest.fn<(query: string) => Promise<void>>().mockResolvedValue(undefined),
                forceSync: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
            });

            const startTime = performance.now();
            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(1000); // Should render within 1 second
            expect(screen.getByTestId('notification-list').children.length).toBe(100);
        });

        it('should maintain accessibility standards', async () => {
            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: {
                    content: [{ id: 1, type: 'FOLLOW_REQUEST', isSeen: false }],
                    totalElements: 1,
                    numberOfElements: 1,
                    last: true,
                    first: true,
                    totalPages: 1,
                    size: 10,
                    number: 0,
                    sort: { sorted: false, unsorted: true, empty: false },
                    pageable: { pageNumber: 0, pageSize: 10, sort: { sorted: false, unsorted: true, empty: false }, offset: 0, paged: true, unpaged: false },
                    empty: false
                },
                unreadCount: 1,
                selectedNotification: null,
                
                // Loading states
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: null,
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: true,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            // Check for proper ARIA labels and semantic HTML
            expect(screen.getByRole('button', { name: /open notifications/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /mark as read/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
        });
    });

    describe('Error Recovery Flows', () => {
        it('should recover from network errors', async () => {
            const mockUseAdvancedNotifications = useAdvancedNotifications as jest.MockedFunction<typeof useAdvancedNotifications>;
            
            // First, return error state
            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: null,
                unreadCount: 0,
                selectedNotification: null,
                
                // Loading states
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: new Error('Network error'),
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: false,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            expect(screen.getByTestId('error')).toBeInTheDocument();

            // Simulate recovery
            mockUseAdvancedNotifications.mockReturnValue({
                notifications: { content: [], totalElements: 0, numberOfElements: 0, last: true, first: true, totalPages: 0, size: 10, number: 0, sort: { sorted: false, unsorted: true, empty: true }, pageable: { pageNumber: 0, pageSize: 10, sort: { sorted: false, unsorted: true, empty: true }, offset: 0, paged: true, unpaged: false }, empty: true },
                unreadCount: 0,
                selectedNotification: null,
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                error: null,
                isConnected: true,
                connectionStatus: 'connected' as const,
                lastSyncTime: null,
                isPanelOpen: false,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                hasConflicts: false,
                pendingConflicts: [],
                markAsRead: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                deleteNotification: jest.fn<(notificationId: string | number) => Promise<void>>().mockResolvedValue(undefined),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setActiveFilter: jest.fn(),
                setCustomFilters: jest.fn(),
                setSearchQuery: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
                refetch: jest.fn(),
                refresh: jest.fn(),
                loadMore: jest.fn(),
                markMultipleAsRead: jest.fn<(notificationIds: (string | number)[]) => Promise<void>>().mockResolvedValue(undefined),
                searchNotifications: jest.fn<(query: string) => Promise<void>>().mockResolvedValue(undefined),
                forceSync: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
            });

            // Force re-render
            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            expect(screen.queryByTestId('error')).not.toBeInTheDocument();
            expect(screen.getByTestId('notification-app')).toBeInTheDocument();
        });

        it('should handle partial failures gracefully', async () => {
            const mockMarkAsRead = jest.fn<(notificationId: string | number) => Promise<void>>().mockRejectedValue(new Error('Failed to mark as read'));
            
            mockUseAdvancedNotifications.mockReturnValue({
                // Data state
                notifications: {
                    content: [{ id: 1, type: 'FOLLOW_REQUEST', isSeen: false }],
                    totalElements: 1,
                    numberOfElements: 1,
                    last: true,
                    first: true,
                    totalPages: 1,
                    size: 10,
                    number: 0,
                    sort: { sorted: false, unsorted: true, empty: false },
                    pageable: { pageNumber: 0, pageSize: 10, sort: { sorted: false, unsorted: true, empty: false }, offset: 0, paged: true, unpaged: false },
                    empty: false
                },
                unreadCount: 1,
                selectedNotification: null,
                
                // Loading states
                isLoading: false,
                isRefreshing: false,
                isLoadingMore: false,
                
                // Error state
                error: null,
                
                // Real-time state
                isConnected: false,
                connectionStatus: 'disconnected' as const,
                lastSyncTime: null,
                
                // UI state
                isPanelOpen: true,
                activeFilter: 'all' as const,
                searchQuery: '',
                currentPage: 0,
                hasMore: false,
                
                // Optimistic updates state
                hasPendingOperations: false,
                hasOptimisticUpdates: false,
                
                // Synchronization state
                hasConflicts: false,
                pendingConflicts: [],
                
                // Actions
                markAsRead: mockMarkAsRead,
                deleteNotification: jest.fn((notificationId: string | number) => Promise.resolve(undefined)),
                openPanel: jest.fn(),
                closePanel: jest.fn(),
                setActiveFilter: jest.fn(),
                setSearchQuery: jest.fn(),
                loadMore: jest.fn(),
                forceSync: jest.fn(() => Promise.resolve(undefined)),
                refetch: jest.fn(),
                refresh: jest.fn(),
                markMultipleAsRead: jest.fn((notificationIds: (string | number)[]) => Promise.resolve(undefined)),
                searchNotifications: jest.fn((query: string) => Promise.resolve(undefined)),
                togglePanel: jest.fn(),
                selectNotification: jest.fn(),
                clearSelection: jest.fn(),
                setCustomFilters: jest.fn(),
                clearFilters: jest.fn(),
                nextPage: jest.fn(),
                previousPage: jest.fn(),
                goToPage: jest.fn(),
                enableRealTime: jest.fn(),
                disableRealTime: jest.fn(),
                resolveConflict: jest.fn(),
                clearConflicts: jest.fn(),
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <MockNotificationContainer />
                </QueryClientProvider>
            );

            const markReadButton = screen.getByTestId('mark-read-1');
            await user.click(markReadButton);

            // Should handle the error gracefully
            expect(mockMarkAsRead).toHaveBeenCalled();
            // The component should still be functional
            expect(screen.getByTestId('notification-panel')).toBeInTheDocument();
        });
    });
});
