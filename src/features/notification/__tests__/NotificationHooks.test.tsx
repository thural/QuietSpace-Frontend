/**
 * Notification Hooks Integration Test.
 * 
 * Test to verify the notification hooks work correctly.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications } from '../application/hooks/useNotifications';

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

describe('Notification Hooks Integration Test', () => {
    let wrapper: ReturnType<typeof createTestWrapper>;

    beforeEach(() => {
        wrapper = createTestWrapper();
    });

    it('should initialize useNotifications hook successfully', async () => {
        const { result } = renderHook(() => useNotifications(), { wrapper });

        await waitFor(() => {
            expect(result.current).toBeDefined();
            expect(result.current.notifications).toBeDefined();
            expect(result.current.unreadCount).toBeDefined();
            expect(result.current.isLoading).toBeDefined();
            expect(typeof result.current.fetchNotifications).toBe('function');
            expect(typeof result.current.markAsRead).toBe('function');
        });
    });

    it('should have initial state values', async () => {
        const { result } = renderHook(() => useNotifications(), { wrapper });

        await waitFor(() => {
            expect(result.current.notifications).toBeDefined();
            expect(result.current.unreadCount).toBeDefined();
            expect(result.current.error).toBeNull();
        });
    });

    it('should provide notification actions', async () => {
        const { result } = renderHook(() => useNotifications(), { wrapper });

        await waitFor(() => {
            expect(typeof result.current.fetchNotifications).toBe('function');
            expect(typeof result.current.fetchNotificationsByType).toBe('function');
            expect(typeof result.current.fetchUnreadCount).toBe('function');
            expect(typeof result.current.markAsRead).toBe('function');
            expect(typeof result.current.deleteNotification).toBe('function');
            expect(typeof result.current.searchNotifications).toBe('function');
        });
    });
});
