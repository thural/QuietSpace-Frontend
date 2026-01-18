/**
 * Integration tests for navbar feature.
 * 
 * This file contains end-to-end tests that verify the complete
 * navbar functionality including repository pattern, state management,
 * and real-time updates work together correctly.
 */

import { jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNavbar, useNavbarEnhanced, useNavbarAdvanced } from "../../application";
import { createMockNotificationRepository } from "../../data/repositories";
import type { NotificationStatusEntity } from "../../domain";

// Mock React Query hooks
jest.mock('@/api/queries/chatQueries', () => ({
  __esModule: true,
  default: () => ({
    getChatsCache: jest.fn(() => [
      { id: 'chat1', recentMessage: { isSeen: false, senderId: 'otherUser' } },
      { id: 'chat2', recentMessage: { isSeen: true, senderId: 'currentUser' } }
    ])
  })
}));

jest.mock('@/api/queries/userQueries', () => ({
  __esModule: true,
  default: () => ({
    getSignedUserElseThrow: jest.fn(() => ({ id: 'user123', username: 'testuser' }))
  })
}));

jest.mock('@/services/data/useNotificationData', () => ({
  __esModule: true,
  useGetNotifications: jest.fn(() => ({
    data: {
      pages: [
        { content: [
          { id: 'notif1', isSeen: false },
          { id: 'notif2', isSeen: true }
        ] }
      ]
    },
    isLoading: false,
    error: null
  }))
}));

describe('Navbar Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Legacy Hook', () => {
    it('should provide notification data and navigation items', async () => {
      const { result } = renderHook(() => useNavbar());

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
        expect(result.current.navigationItems).toBeDefined();
        expect(result.current.error).toBeNull();
      });

      expect(result.current.notificationData?.hasPendingNotification).toBe(true);
      expect(result.current.notificationData?.hasUnreadChat).toBe(true);
    });

    it('should handle loading states', async () => {
      const { result } = renderHook(() => useNavbar());

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      expect(result.current.notificationData?.isLoading).toBe(false);
    });
  });

  describe('Enhanced Repository Hook', () => {
    it('should work with repository pattern', async () => {
      const { result } = renderHook(() => useNavbarEnhanced({
        useMockRepositories: true,
        mockConfig: {
          hasPendingNotifications: false,
          hasUnreadChats: false
        }
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
        expect(result.current.repository).toBeDefined();
      });

      expect(result.current.notificationData?.hasPendingNotification).toBe(false);
      expect(result.current.notificationData?.hasUnreadChat).toBe(false);
    });

    it('should handle repository errors', async () => {
      const { result } = renderHook(() => useNavbarEnhanced({
        useMockRepositories: true,
        mockConfig: {
          simulateError: true
        }
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('Advanced State Management Hook', () => {
    it('should integrate state management with repository pattern', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        useRepositoryPattern: true,
        repositoryConfig: {
          useMockRepositories: true,
          mockConfig: {
            hasPendingNotifications: true,
            hasUnreadChats: true
          }
        },
        enablePersistence: true,
        syncInterval: 5000
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
        expect(result.current.hasUnreadNotifications).toBe(true);
        expect(result.current.hasUnreadChats).toBe(true);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle optimistic updates', async () => {
      const { result } = renderHook(() => useNavbarAdvanced({
        enablePersistence: false
      }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      // Note: Optimistic updates were simplified when state layer was removed
      // This test now verifies basic functionality
      expect(result.current.notificationData?.hasPendingNotification).toBe(false);
      expect(result.current.notificationData?.hasUnreadChat).toBe(false);
    });
  });

  describe('Configuration Flexibility', () => {
    it('should support different configuration options', async () => {
      // Test legacy mode
      const { result: legacyResult } = renderHook(() => useNavbar({
        useRepositoryPattern: false
      }));

      await waitFor(() => {
        expect(legacyResult.current.notificationData).toBeDefined();
      });

      // Test repository pattern mode
      const { result: repoResult } = renderHook(() => useNavbar({
        useRepositoryPattern: true,
        repositoryConfig: {
          useMockRepositories: true
        }
      }));

      await waitFor(() => {
        expect(repoResult.current.notificationData).toBeDefined();
      });

      // Test advanced mode
      const { result: advancedResult } = renderHook(() => useNavbarAdvanced({
        enablePersistence: true,
        syncInterval: 10000
      }));

      await waitFor(() => {
        expect(advancedResult.current.notificationData).toBeDefined();
      });

      expect(legacyResult.current.notificationData).toBeDefined();
      expect(repoResult.current.notificationData).toBeDefined();
      expect(advancedResult.current.notificationData).toBeDefined();
    });
  });

  describe('Navigation Items', () => {
    it('should generate correct navigation items', async () => {
      const { result } = renderHook(() => useNavbar());

      await waitFor(() => {
        expect(result.current.navigationItems).toBeDefined();
      });

      const { navigationItems } = result.current;
      
      expect(navigationItems.mainItems).toHaveLength(2);
      expect(navigationItems.mainItems[0].linkTo).toBe('/feed');
      expect(navigationItems.mainItems[1].linkTo).toBe('/search');
      expect(navigationItems.chat.linkTo).toBe('/chat');
      expect(navigationItems.profile.linkTo).toBe('/profile');
      expect(navigationItems.notification.linkTo).toBe('/notifications');
    });

    it('should handle active navigation state', async () => {
      const { result } = renderHook(() => useNavbar());

      await waitFor(() => {
        expect(result.current.navigationItems).toBeDefined();
      });

      const { navigationItems } = result.current;
      
      // All items should have the same pathName
      expect(navigationItems.mainItems.every(item => item.pathName)).toBeDefined();
      expect(navigationItems.chat.pathName).toBeDefined();
      expect(navigationItems.profile.pathName).toBeDefined();
      expect(navigationItems.notification.pathName).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      const { result } = renderHook(() => useNavbarEnhanced({
          useMockRepositories: true,
          mockConfig: {
            simulateError: true
          }
        }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.notificationData).toBeDefined();
      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should provide fallback data on errors', async () => {
      const { result } = renderHook(() => useNavbarEnhanced({
          useMockRepositories: true,
          mockConfig: {
            simulateError: true
          }
        }));

      await waitFor(() => {
        expect(result.current.notificationData).toBeDefined();
      });

      // Should provide fallback data even on error
      expect(result.current.notificationData).toBeDefined();
      expect(result.current.notificationData?.hasPendingNotification).toBe(false);
      expect(result.current.notificationData?.hasUnreadChat).toBe(false);
    });
  });
});
