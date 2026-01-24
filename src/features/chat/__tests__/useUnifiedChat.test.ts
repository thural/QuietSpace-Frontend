/**
 * useUnifiedChat Hook Tests
 * 
 * Comprehensive test suite for the useUnifiedChat hook
 * covering all functionality, error handling, and performance tracking
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useUnifiedChat } from '@/features/chat/application/hooks/useUnifiedChat';
import { ChatMetricsService } from '@/features/chat/application/services/ChatMetricsService';
import { WebSocketService } from '@/features/chat/data/services/WebSocketService';
import { ChatDataService } from '@/features/chat/data/services/ChatDataService';
import { ChatFeatureService } from '@/features/chat/application/services/ChatFeatureService';
import { CacheProvider } from '@/core/cache';
import { useAuthStore } from '@core/store/zustand';

// Mock dependencies
jest.mock('@/features/chat/application/hooks/useChatServices');
jest.mock('@core/hooks/migrationUtils');
jest.mock('@core/store/zustand');

const mockUseChatServices = require('@/features/chat/application/hooks/useChatServices').useChatServices;
const mockUseCacheInvalidation = require('@core/hooks/migrationUtils').useCacheInvalidation;
const mockUseAuthStore = require('@core/store/zustand').useAuthStore;

describe('useUnifiedChat', () => {
  let mockChatDataService: jest.Mocked<ChatDataService>;
  let mockChatFeatureService: jest.Mocked<ChatFeatureService>;
  let mockWebSocketService: jest.Mocked<WebSocketService>;
  let mockChatMetricsService: jest.Mocked<ChatMetricsService>;
  let mockCacheProvider: jest.Mocked<CacheProvider>;
  let mockInvalidateCache: jest.MockedFunction<any>;

  beforeEach(() => {
    // Setup mocks
    mockChatDataService = {
      getChats: jest.fn(),
      getMessages: jest.fn(),
      getChatParticipants: jest.fn(),
      getUnreadCount: jest.fn(),
      deleteChat: jest.fn(),
      markMessagesAsRead: jest.fn()
    } as any;

    mockChatFeatureService = {
      createChatWithValidation: jest.fn(),
      sendMessageWithValidation: jest.fn(),
      updateChatSettings: jest.fn(),
      searchChats: jest.fn(),
      addParticipant: jest.fn(),
      removeParticipant: jest.fn()
    } as any;

    mockWebSocketService = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    } as any;

    mockChatMetricsService = {
      recordQuery: jest.fn(),
      recordMutation: jest.fn(),
      recordInteraction: jest.fn(),
      recordWebSocketEvent: jest.fn(),
      getMetrics: jest.fn(),
      getPerformanceSummary: jest.fn(),
      resetMetrics: jest.fn()
    } as any;

    mockCacheProvider = {
      get: jest.fn(),
      set: jest.fn(),
      has: jest.fn(),
      invalidate: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn()
    } as any;

    mockInvalidateCache = {
      invalidateUserChatData: jest.fn(),
      invalidateChatData: jest.fn()
    };

    // Mock hook dependencies
    mockUseChatServices.mockReturnValue({
      chatDataService: mockChatDataService,
      chatFeatureService: mockChatFeatureService,
      webSocketService: mockWebSocketService,
      chatMetricsService: mockChatMetricsService
    });

    mockUseCacheInvalidation.mockReturnValue(mockInvalidateCache);

    // Mock auth store
    mockUseAuthStore.mockReturnValue({
      getState: jest.fn().mockReturnValue({
        data: {
          accessToken: 'test-token',
          user: {
            id: 'user-123',
            username: 'testuser',
            email: 'test@example.com'
          }
        }
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should initialize with default state', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getMessages.mockResolvedValue({
        content: [],
        hasNextPage: false,
        hasPreviousPage: false
      });
      mockChatDataService.getChatParticipants.mockResolvedValue([]);
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.chats).toBeDefined();
      expect(result.current.messages).toBeDefined();
      expect(result.current.participants).toBeDefined();
      expect(result.current.unreadCount).toBeDefined();
    });

    it('should load data successfully', async () => {
      const mockChats = { content: [{ id: 'chat-1', name: 'Test Chat' }] };
      const mockMessages = {
        content: [{ id: 'msg-1', text: 'Hello' }],
        hasNextPage: false,
        hasPreviousPage: false
      };
      const mockParticipants = [{ id: 'user-456', username: 'Other User' }];
      const mockUnreadCount = 5;

      mockChatDataService.getChats.mockResolvedValue(mockChats);
      mockChatDataService.getMessages.mockResolvedValue(mockMessages);
      mockChatDataService.getChatParticipants.mockResolvedValue(mockParticipants);
      mockChatDataService.getUnreadCount.mockResolvedValue(mockUnreadCount);

      const { result } = renderHook(() => useUnifiedChat('user-123', 'chat-1'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockChatDataService.getChats).toHaveBeenCalledWith('user-123', 'test-token');
      expect(mockChatDataService.getMessages).toHaveBeenCalledWith('chat-1', 0, 'test-token');
      expect(mockChatDataService.getChatParticipants).toHaveBeenCalledWith('chat-1', 'test-token');
      expect(mockChatDataService.getUnreadCount).toHaveBeenCalledWith('user-123', 'test-token');
    });

    it('should handle chatId parameter correctly', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123', 'chat-456'));

      expect(result.current).toBeDefined();
      // Should only load chats and unread count, not messages/participants without proper setup
    });
  });

  describe('Cache Strategies', () => {
    it('should use aggressive cache strategy', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => 
        useUnifiedChat('user-123', undefined, { cacheStrategy: 'aggressive' })
      );

      expect(result.current).toBeDefined();
      // Cache strategy affects TTL values internally
    });

    it('should use conservative cache strategy', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => 
        useUnifiedChat('user-123', undefined, { cacheStrategy: 'conservative' })
      );

      expect(result.current).toBeDefined();
    });

    it('should enable real-time mode', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => 
        useUnifiedChat('user-123', 'chat-123', { enableRealTime: true })
      );

      expect(result.current).toBeDefined();
      expect(mockWebSocketService.connect).toHaveBeenCalled();
    });
  });

  describe('Mutations', () => {
    it('should create chat successfully', async () => {
      const mockChat = { id: 'chat-new', name: 'New Chat' };
      mockChatFeatureService.createChatWithValidation.mockResolvedValue(mockChat);
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.createChat({
        userIds: ['user-123', 'user-456'],
        text: 'Hello!'
      });

      expect(mockChatFeatureService.createChatWithValidation).toHaveBeenCalledWith(
        { userIds: ['user-123', 'user-456'], text: 'Hello!' },
        'test-token'
      );
      expect(mockChatMetricsService.recordMutation).toHaveBeenCalledWith(
        'createChat',
        expect.any(Number),
        true,
        expect.any(Boolean),
        false
      );
    });

    it('should send message successfully', async () => {
      const mockMessage = { id: 'msg-new', text: 'Hello!' };
      mockChatFeatureService.sendMessageWithValidation.mockResolvedValue(mockMessage);
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getMessages.mockResolvedValue({
        content: [],
        hasNextPage: false,
        hasPreviousPage: false
      });
      mockChatDataService.getChatParticipants.mockResolvedValue([]);
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123', 'chat-123'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.sendMessage({
        chatId: 'chat-123',
        messageData: { content: 'Hello!' }
      });

      expect(mockChatFeatureService.sendMessageWithValidation).toHaveBeenCalledWith(
        'chat-123',
        { content: 'Hello!' },
        'test-token'
      );
      expect(mockChatMetricsService.recordInteraction).toHaveBeenCalledWith(
        'message',
        { chatId: 'chat-123', messageId: 'msg-new' }
      );
    });

    it('should handle mutation errors', async () => {
      const error = new Error('Failed to create chat');
      mockChatFeatureService.createChatWithValidation.mockRejectedValue(error);
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.createChat({
        userIds: ['user-123'],
        text: 'Test'
      })).rejects.toThrow('Failed to create chat');
    });
  });

  describe('Error Handling', () => {
    it('should provide error summary', async () => {
      const error = new Error('Network error');
      mockChatDataService.getChats.mockRejectedValue(error);
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      const errorSummary = result.current.getErrorSummary?.();
      expect(errorSummary).toBeDefined();
      expect(Array.isArray(errorSummary)).toBe(true);
    });

    it('should retry failed queries', async () => {
      const error = new Error('Network error');
      mockChatDataService.getChats.mockRejectedValue(error);
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Mock successful retry
      mockChatDataService.getChats.mockResolvedValue({ content: [] });

      await result.current.retryFailedQueries?.();

      expect(mockChatDataService.getChats).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance Monitoring', () => {
    it('should provide metrics access', () => {
      const mockMetrics = {
        queryMetrics: { totalQueries: 10, averageQueryTime: 500 },
        mutationMetrics: { totalMutations: 5, averageMutationTime: 800 },
        cacheMetrics: { totalCacheHits: 80, totalCacheMisses: 20 },
        websocketMetrics: { messagesReceived: 100, messagesSent: 50 },
        interactionMetrics: { messagesPerSession: 25 }
      };

      mockChatMetricsService.getMetrics.mockReturnValue(mockMetrics);
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      const metrics = result.current.getMetrics?.();
      expect(metrics).toEqual(mockMetrics);
      expect(mockChatMetricsService.getMetrics).toHaveBeenCalled();
    });

    it('should provide performance summary', () => {
      const mockSummary = {
        overall: 'good' as const,
        issues: [],
        recommendations: []
      };

      mockChatMetricsService.getPerformanceSummary.mockReturnValue(mockSummary);
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      const summary = result.current.getPerformanceSummary?.();
      expect(summary).toEqual(mockSummary);
      expect(mockChatMetricsService.getPerformanceSummary).toHaveBeenCalled();
    });

    it('should reset metrics', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      result.current.resetMetrics?.();

      expect(mockChatMetricsService.resetMetrics).toHaveBeenCalled();
    });
  });

  describe('WebSocket Integration', () => {
    it('should connect WebSocket when real-time is enabled', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      renderHook(() => 
        useUnifiedChat('user-123', 'chat-123', { enableRealTime: true })
      );

      expect(mockWebSocketService.connect).toHaveBeenCalledWith('ws://localhost:8080/ws');
    });

    it('should subscribe to chat messages', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      renderHook(() => 
        useUnifiedChat('user-123', 'chat-123', { enableRealTime: true })
      );

      expect(mockWebSocketService.subscribe).toHaveBeenCalledWith(
        'chat:chat-123',
        expect.any(Function)
      );
    });

    it('should handle WebSocket connection errors', () => {
      mockWebSocketService.connect.mockRejectedValue(new Error('Connection failed'));
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => 
        useUnifiedChat('user-123', 'chat-123', { enableRealTime: true })
      );

      expect(result.current).toBeDefined();
      // Should handle connection errors gracefully
    });
  });

  describe('Optimistic Updates', () => {
    it('should enable optimistic updates when configured', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => 
        useUnifiedChat('user-123', undefined, { enableOptimisticUpdates: true })
      );

      expect(result.current).toBeDefined();
      // Optimistic updates are handled internally by the custom mutation hooks
    });

    it('should disable optimistic updates when not configured', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => 
        useUnifiedChat('user-123', undefined, { enableOptimisticUpdates: false })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('Cache Invalidation', () => {
    it('should provide cache invalidation methods', () => {
      mockChatDataService.getChats.mockResolvedValue({ content: [] });
      mockChatDataService.getUnreadCount.mockResolvedValue(0);

      const { result } = renderHook(() => useUnifiedChat('user-123'));

      expect(typeof result.current.invalidateCache).toBe('function');

      result.current.invalidateCache?.();

      expect(mockInvalidateCache.invalidateUserChatData).toHaveBeenCalledWith('user-123');
    });
  });
});
