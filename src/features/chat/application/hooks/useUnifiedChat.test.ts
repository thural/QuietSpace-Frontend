/**
 * Test file to verify useUnifiedChat hook functionality
 * This can be used to ensure all functionality is preserved after merging
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useUnifiedChat } from './useUnifiedChat';

// Mock dependencies
jest.mock('@/core/store/zustand', () => ({
    useAuthStore: {
        getState: () => ({
            data: {
                accessToken: 'test-token',
                userId: 'test-user'
            }
        })
    }
}));

jest.mock('./useChatServices', () => ({
    useChatServices: () => ({
        chatDataService: {
            getChats: jest.fn().mockResolvedValue({ content: [] }),
            getMessages: jest.fn().mockResolvedValue({ content: [], last: true, first: true }),
            getChatParticipants: jest.fn().mockResolvedValue([]),
            updateChatSettings: jest.fn(),
            deleteChat: jest.fn(),
            searchChats: jest.fn(),
            markMessagesAsRead: jest.fn()
        },
        chatFeatureService: {
            createChatWithValidation: jest.fn(),
            sendMessageWithValidation: jest.fn()
        }
    })
}));

jest.mock('@/core/hooks/migrationUtils', () => ({
    useCacheInvalidation: () => ({
        invalidateUserChatData: jest.fn(),
        invalidateChatData: jest.fn()
    }),
    CACHE_TIME_MAPPINGS: {
        CHAT_STALE_TIME: 60000,
        CHAT_CACHE_TIME: 300000,
        REALTIME_STALE_TIME: 30000
    }
}));

describe('useUnifiedChat', () => {
    it('should initialize with default options', () => {
        const { result } = renderHook(() => useUnifiedChat('test-user'));
        
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(typeof result.current.createChat).toBe('object');
        expect(typeof result.current.deleteChat).toBe('object');
        expect(typeof result.current.sendMessage).toBe('object');
        expect(typeof result.current.prefetchChats).toBe('function');
        expect(typeof result.current.invalidateCache).toBe('function');
    });

    it('should accept custom options', () => {
        const { result } = renderHook(() => 
            useUnifiedChat('test-user', {
                enableRealTime: false,
                enableOptimisticUpdates: false,
                cacheStrategy: 'conservative'
            })
        );
        
        expect(result.current.isLoading).toBe(false);
        expect(typeof result.current.createChat).toBe('object');
    });

    it('should export backward compatibility aliases', () => {
        const { result: simpleResult } = renderHook(() => useUnifiedChat('test-user'));
        
        // Test that the hook returns all expected properties
        const expectedProperties = [
            'chats', 'messages', 'participants', 'unreadCount',
            'isLoading', 'error', 'prefetchChats', 'prefetchMessages',
            'invalidateCache', 'createChat', 'deleteChat', 'sendMessage',
            'updateChatSettings', 'searchChats', 'addParticipant',
            'removeParticipant', 'markMessagesAsRead'
        ];
        
        expectedProperties.forEach(prop => {
            expect(simpleResult.current).toHaveProperty(prop);
        });
    });
});

// Integration test to verify all functionality is preserved
describe('useUnifiedChat - Functionality Preservation', () => {
    it('should have all basic chat functionality', () => {
        const { result } = renderHook(() => useUnifiedChat('test-user'));
        
        // Basic functionality
        expect(result.current.chats).toBeDefined();
        expect(result.current.messages).toBeDefined();
        expect(result.current.participants).toBeDefined();
        expect(result.current.unreadCount).toBeDefined();
        expect(result.current.createChat).toBeDefined();
        expect(result.current.deleteChat).toBeDefined();
        expect(result.current.sendMessage).toBeDefined();
        expect(result.current.updateChatSettings).toBeDefined();
        expect(result.current.searchChats).toBeDefined();
        expect(result.current.addParticipant).toBeDefined();
        expect(result.current.removeParticipant).toBeDefined();
        expect(result.current.markMessagesAsRead).toBeDefined();
    });

    it('should have all advanced features', () => {
        const { result } = renderHook(() => 
            useUnifiedChat('test-user', {
                enableRealTime: true,
                enableOptimisticUpdates: true,
                cacheStrategy: 'aggressive'
            })
        );
        
        // Advanced functionality
        expect(result.current.chats).toBeDefined();
        expect(result.current.messages).toBeDefined();
        expect(result.current.participants).toBeDefined();
        expect(result.current.unreadCount).toBeDefined();
        
        // All mutations should be available
        expect(result.current.createChat).toBeDefined();
        expect(result.current.deleteChat).toBeDefined();
        expect(result.current.sendMessage).toBeDefined();
    });
});
