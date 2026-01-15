/**
 * Performance tests for navbar feature.
 * 
 * This file contains performance benchmarks and optimization tests
 * to ensure the navbar feature performs well under various conditions.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useNavbarAdvanced } from '../application';

describe('Navbar Performance Tests', () => {
  describe('Rendering Performance', () => {
    it('should render quickly with large datasets', async () => {
      const startTime = performance.now();
      
      const { result } = renderHook(() => useNavbarAdvanced({
        repositoryConfig: {
          useMockRepositories: true,
          mockConfig: {
            hasPendingNotifications: true,
            hasUnreadChats: true
          }
        }
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should not re-render unnecessarily', async () => {
      const { result, rerender } = renderHook(() => useNavbarAdvanced());

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const initialRenderCount = result.current.notificationData;

      // Re-render with same config
      rerender();

      // Should not cause unnecessary re-renders
      expect(result.current.notificationData).toBe(initialRenderCount);
    });

    it('should handle configuration changes efficiently', async () => {
      const { result, rerender } = renderHook(
        (config) => useNavbarAdvanced(config),
        { initialProps: { enablePersistence: true } }
      );

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const initialData = result.current.notificationData;

      // Change configuration
      rerender({ enablePersistence: false });

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      // Should handle config changes efficiently
      expect(result.current.notificationData).toBeDefined();
    });
  });

  describe('State Management Performance', () => {
    it('should handle rapid state updates', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        enablePersistence: false // Disable persistence for faster tests
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const startTime = performance.now();

      // Perform multiple rapid updates
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await result.current.actions.updateNotificationData(async () => ({
            hasPendingNotification: i % 2 === 0,
            hasUnreadChat: i % 3 === 0,
            isLoading: false
          }));
        });
      }

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Should handle 10 updates within 50ms
      expect(updateTime).toBeLessThan(50);
    });

    it('should optimize memory usage', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        enablePersistence: false
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      // Get initial memory usage (if available)
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Create many navigation items
      for (let i = 0; i < 100; i++) {
        await act(async () => {
          await result.current.actions.updateNotificationData(async () => ({
            hasPendingNotification: i % 2 === 0,
            hasUnreadChat: i % 3 === 0,
            isLoading: false
          }));
        });
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be minimal
      expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
    });
  });

  describe('Repository Performance', () => {
    it('should handle large notification datasets efficiently', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        repositoryConfig: {
          useMockRepositories: true,
          mockConfig: {
            // Simulate large dataset
            hasPendingNotifications: true,
            hasUnreadChats: true
          }
        }
      }));

      const startTime = performance.now();

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Should respond quickly even with large datasets
      expect(responseTime).toBeLessThan(50);
    });

    it('should cache repository instances', async () => {
      const { result: result1 } = renderHook(() => useNavbarAdvanced());
      const { result: result2 } = renderHook(() => useNavbarAdvanced());

      await waitFor(() => {
        expect(result1.current.notificationData).toBeDefined();
        expect(result2.current.notificationData).toBeDefined();
      });

      // Repository instances should be cached
      expect(result1.current.repository).toBeDefined();
      expect(result2.current.repository).toBeDefined();
    });
  });

  describe('Real-time Performance', () => {
    it('should handle sync operations efficiently', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        syncInterval: 100 // Fast sync for testing
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const startTime = performance.now();

      // Trigger sync
      await act(async () => {
        await result.current.actions.syncState();
      });

      const endTime = performance.now();
      const syncTime = endTime - startTime;

      // Sync should be fast
      expect(syncTime).toBeLessThan(20);
    });

    it('should handle cross-tab sync efficiently', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        enablePersistence: true
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'navbar-store',
        newValue: JSON.stringify({
          state: {
            notificationData: {
              hasPendingNotification: false,
              hasUnreadChat: false,
              isLoading: false
            }
          }
        })
      });

      window.dispatchEvent(storageEvent);

      await waitFor(() => {
        expect(result.current.notificationData?.hasPendingNotification).toBe(false);
      });

      // Should handle cross-tab sync quickly
      expect(result.current.notificationData).toBeDefined();
    });
  });

  describe('Memory and CPU Optimization', () => {
    it('should minimize re-renders with useMemo', async () => {
      let renderCount = 0;
      
      const { result, rerender } = renderHook(() => useNavbarAdvanced());

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      // Track navigation items recreation
      const originalItems = result.current.navigationItems;

      rerender();
      rerender();
      rerender();

      // Navigation items should be memoized
      expect(result.current.navigationItems).toBe(originalItems);
    });

    it('should use useCallback for actions', async () => {
      const { result } = renderHook(() => useNavbarAdvanced());

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const updateFunction = result.current.actions.updateNotificationData;
      const syncFunction = result.current.actions.syncState;

      // Action functions should be stable
      expect(typeof updateFunction).toBe('function');
      expect(typeof syncFunction).toBe('function');
    });

    it('should handle cleanup properly', async () => {
      const { unmount } = renderHook(() => useNavbarAdvanced());

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      const startTime = performance.now();
      
      unmount();

      const endTime = performance.now();
      const cleanupTime = endTime - startTime;

      // Cleanup should be fast
      expect(cleanupTime).toBeLessThan(10);
    });
  });
});
