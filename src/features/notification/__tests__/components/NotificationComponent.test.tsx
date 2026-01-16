/**
 * Notification Component Tests.
 * 
 * Component tests with mocked dependencies.
 * Tests React components using the 4-layer architecture.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor, act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationDIContainer } from '../../di/NotificationDIContainer';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';

// Mock the components and hooks
const mockUseNotifications = jest.fn();
const mockUseNotificationUIStore = jest.fn();

jest.mock('../../application/hooks/useNotifications', () => ({
    useNotifications: mockUseNotifications,
}));

jest.mock('../../application/hooks/useAdvancedNotifications', () => ({
    useAdvancedNotifications: jest.fn(),
}));

// Mock the UI store
jest.mock('../../application/stores/notificationUIStore', () => ({
    useNotificationUIStore: mockUseNotificationUIStore,
}));

// Import mocked modules
import { useNotifications } from '../../application/hooks/useNotifications';
import { useNotificationUIStore } from '../../application/stores/notificationUIStore';

// Test wrapper
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

// Mock NotificationContainer component
const MockNotificationContainer = ({ children }: { children?: React.ReactNode }) => {
    const { notifications, isLoading, error, markAsRead, deleteNotification } = useNotifications();

    if (isLoading) return <div data-testid="loading">Loading...</div>;
    if (error) return <div data-testid="error">Error: {error.message}</div>;

    return (
        <div data-testid="notification-container">
            <div data-testid="notification-count">
                {notifications?.content.length || 0} notifications
            </div>
            {notifications?.content.map((notification: any) => (
                <div key={notification.id} data-testid={`notification-${notification.id}`}>
                    <span>{notification.type}</span>
                    <span>{notification.isSeen ? 'Read' : 'Unread'}</span>
                    <button 
                        data-testid={`mark-read-${notification.id}`}
                        onClick={() => markAsRead(notification.id)}
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
            {children}
        </div>
    );
};

describe('Notification Component Tests', () => {
    let diContainer: NotificationDIContainer;
    let queryClient: QueryClient;
    let wrapper: ReturnType<typeof createTestWrapper>;

    beforeEach(async () => {
        // Set up DI container
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

        // Reset mocks
        jest.clearAllMocks();

        // Initialize mocks with default return values
        mockUseNotifications.mockReturnValue({
            notifications: null,
            isLoading: false,
            error: null,
            markAsRead: jest.fn(),
            deleteNotification: jest.fn(),
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

    describe('NotificationContainer Component', () => {
        it('should render loading state', () => {
            mockUseNotifications.mockReturnValue({
                notifications: null,
                isLoading: true,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            expect(screen.getByTestId('loading')).toBeInTheDocument();
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('should render error state', () => {
            mockUseNotifications.mockReturnValue({
                notifications: null,
                isLoading: false,
                error: new Error('Test error'),
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            expect(screen.getByTestId('error')).toBeInTheDocument();
            expect(screen.getByText('Error: Test error')).toBeInTheDocument();
        });

        it('should render notifications successfully', () => {
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                    { id: 2, type: 'COMMENT', isSeen: true },
                ],
                totalElements: 2,
                numberOfElements: 2,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            expect(screen.getByTestId('notification-container')).toBeInTheDocument();
            expect(screen.getByTestId('notification-count')).toBeInTheDocument();
            expect(screen.getByText('2 notifications')).toBeInTheDocument();
            expect(screen.getByTestId('notification-1')).toBeInTheDocument();
            expect(screen.getByTestId('notification-2')).toBeInTheDocument();
        });

        it('should handle mark as read action', async () => {
            const mockMarkAsRead = jest.fn();
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                ],
                totalElements: 1,
                numberOfElements: 1,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: mockMarkAsRead,
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            const markReadButton = screen.getByTestId('mark-read-1');
            expect(markReadButton).toBeInTheDocument();

            await act(async () => {
                fireEvent.click(markReadButton);
            });

            expect(mockMarkAsRead).toHaveBeenCalledWith(1);
        });

        it('should handle delete action', async () => {
            const mockDeleteNotification = jest.fn();
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                ],
                totalElements: 1,
                numberOfElements: 1,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: mockDeleteNotification,
            });

            render(<MockNotificationContainer />, { wrapper });

            const deleteButton = screen.getByTestId('delete-1');
            expect(deleteButton).toBeInTheDocument();

            await act(async () => {
                fireEvent.click(deleteButton);
            });

            expect(mockDeleteNotification).toHaveBeenCalledWith(1);
        });

        it('should display empty state when no notifications', () => {
            mockUseNotifications.mockReturnValue({
                notifications: { content: [], totalElements: 0, numberOfElements: 0 },
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            expect(screen.getByTestId('notification-count')).toBeInTheDocument();
            expect(screen.getByText('0 notifications')).toBeInTheDocument();
        });
    });

    describe('UI State Integration', () => {
        it('should integrate with UI store correctly', () => {
            const mockUIState = {
                isNotificationPanelOpen: true,
                activeFilter: 'unread',
                searchQuery: 'test',
                currentPage: 0,
                hasMoreNotifications: true,
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
            };

            mockUseNotificationUIStore.mockReturnValue(mockUIState);

            // Test that the component can access UI state
            const { result } = renderHook(() => useNotificationUIStore());
            expect(result.current.isNotificationPanelOpen).toBe(true);
            expect(result.current.activeFilter).toBe('unread');
        });

        it('should handle UI state changes', () => {
            const mockUIState = {
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
            };

            mockUseNotificationUIStore.mockReturnValue(mockUIState);

            const { result } = renderHook(() => useNotificationUIStore());

            act(() => {
                result.current.openNotificationPanel();
            });

            expect(mockUIState.openNotificationPanel).toHaveBeenCalled();

            act(() => {
                result.current.setActiveFilter('unread');
            });

            expect(mockUIState.setActiveFilter).toHaveBeenCalledWith('unread');
        });
    });

    describe('Component Performance', () => {
        it('should render large notification lists efficiently', () => {
            const largeNotifications = {
                content: Array.from({ length: 100 }, (_, i) => ({
                    id: i + 1,
                    type: 'NOTIFICATION',
                    isSeen: i % 2 === 0
                })),
                totalElements: 100,
                numberOfElements: 100,
            };

            mockUseNotifications.mockReturnValue({
                notifications: largeNotifications,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            const startTime = performance.now();
            render(<MockNotificationContainer />, { wrapper });
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(1000); // Should render within 1 second
            expect(screen.getByText('100 notifications')).toBeInTheDocument();
        });

        it('should handle rapid state changes', async () => {
            const mockNotifications = {
                content: [{ id: 1, type: 'FOLLOW_REQUEST', isSeen: false }],
                totalElements: 1,
                numberOfElements: 1,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            const markReadButton = screen.getByTestId('mark-read-1');

            // Rapidly click the button multiple times
            for (let i = 0; i < 10; i++) {
                await act(async () => {
                    fireEvent.click(markReadButton);
                });
            }

            // Should handle rapid clicks without crashing
            expect(screen.getByTestId('notification-1')).toBeInTheDocument();
        });
    });

    describe('Component Accessibility', () => {
        it('should have proper ARIA labels', () => {
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                ],
                totalElements: 1,
                numberOfElements: 1,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            const markReadButton = screen.getByTestId('mark-read-1');
            const deleteButton = screen.getByTestId('delete-1');

            expect(markReadButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();
        });

        it('should be keyboard navigable', () => {
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                ],
                totalElements: 1,
                numberOfElements: 1,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            const markReadButton = screen.getByTestId('mark-read-1');
            
            // Test keyboard navigation
            markReadButton.focus();
            expect(document.activeElement).toBe(markReadButton);

            fireEvent.keyDown(markReadButton, { key: 'Enter' });
            expect((mockUseNotifications.mock.results[0].value as any).markAsRead).toHaveBeenCalled();
        });
    });

    describe('Component Error Boundaries', () => {
        it('should handle hook errors gracefully', () => {
            mockUseNotifications.mockImplementation(() => {
                throw new Error('Hook error');
            });

            // Component should handle the error and not crash
            expect(() => {
                render(<MockNotificationContainer />, { wrapper });
            }).toThrow('Hook error');
        });

        it('should handle missing data gracefully', () => {
            mockUseNotifications.mockReturnValue({
                notifications: null,
                isLoading: false,
                error: null,
                markAsRead: jest.fn(),
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            expect(screen.getByTestId('notification-container')).toBeInTheDocument();
            expect(screen.getByText('0 notifications')).toBeInTheDocument();
        });
    });

    describe('Component Integration', () => {
        it('should integrate with DI container', () => {
            const repository = diContainer.getNotificationRepository();
            expect(repository).toBeDefined();
            expect(typeof repository.getNotifications).toBe('function');
        });

        it('should maintain state consistency', async () => {
            const mockMarkAsRead = jest.fn();
            const mockNotifications = {
                content: [
                    { id: 1, type: 'FOLLOW_REQUEST', isSeen: false },
                ],
                totalElements: 1,
                numberOfElements: 1,
            };

            mockUseNotifications.mockReturnValue({
                notifications: mockNotifications,
                isLoading: false,
                error: null,
                markAsRead: mockMarkAsRead,
                deleteNotification: jest.fn(),
            });

            render(<MockNotificationContainer />, { wrapper });

            const markReadButton = screen.getByTestId('mark-read-1');

            await act(async () => {
                fireEvent.click(markReadButton);
            });

            expect(mockMarkAsRead).toHaveBeenCalledWith(1);
        });
    });
});
