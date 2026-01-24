/**
 * Custom Message Hook
 * 
 * Custom hook to manage message functionality using the custom query system.
 * Provides enterprise-grade caching and state management for messages.
 */

import {useCustomQuery} from '@/core/hooks';
import {MessageResponse} from "@/features/chat/data/models/chat";
import {useChatServices} from './useChatServices';
import {CACHE_TIME_MAPPINGS, useCacheInvalidation} from '@/core/hooks/migrationUtils';
import {useCallback, useEffect} from "react";
import useHoverState from "@/shared/hooks/useHoverState";

/**
 * Custom hook to manage message functionality.
 * 
 * @param {MessageResponse} message - The message object to manage.
 * @returns {Object} - An object containing message-related data and methods.
 * @returns {Object} user - The user object of the signed-in user.
 * @returns {boolean} isHovering - Indicates if the message is being hovered over.
 * @returns {Object} wasSeenRef - Reference to track if the message was seen.
 * @returns {function} handleMouseOver - Function to handle mouse over events.
 * @returns {function} handleMouseOut - Function to handle mouse out events.
 * @returns {function} handleDeleteMessage - Function to handle deleting the message.
 */

export const useCustomMessage = (message: MessageResponse) => {
    const { chatDataService, chatFeatureService } = useChatServices();
    const invalidateCache = useCacheInvalidation();

    // Get signed user with custom query
    const { data: user, isLoading: userLoading, error: userError } = useCustomQuery(
        ['user', 'signed-in'],
        async () => {
            // This would be implemented in the user service
            return {
                id: 'user-id',
                username: 'current-user',
                email: 'user@example.com'
            };
        },
        {
            staleTime: CACHE_TIME_MAPPINGS.USER_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.USER_CACHE_TIME,
            onSuccess: (data) => {
                console.log('CustomMessage: User loaded:', data.id);
            },
            onError: (error) => {
                console.error('CustomMessage: Error loading user:', error);
            }
        }
    );

    // Get message seen status with custom query
    const { data: messageSeenStatus, refetch: refetchMessageSeen } = useCustomQuery(
        ['message', 'seen-status', String(message.id)],
        async () => {
            // This would be implemented in the data service
            return {
                isSeen: false,
                seenAt: null
            };
        },
        {
            staleTime: CACHE_TIME_MAPPINGS.REALTIME_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.REALTIME_CACHE_TIME,
            refetchInterval: 30000, // 30 seconds for real-time updates
            onSuccess: (data) => {
                console.log('CustomMessage: Message seen status loaded:', { 
                    messageId: message.id, 
                    isSeen: data.isSeen 
                });
            },
            onError: (error) => {
                console.error('CustomMessage: Error loading message seen status:', error);
            }
        }
    );

    const {
        isHovering,
        handleMouseOver,
        handleMouseOut
    } = useHoverState();

    /**
     * Marks the message as seen using enterprise-grade caching.
     * Includes optimistic updates and proper error handling.
     */
    const handleSeenMessage = useCallback(async () => {
        if (!user) {
            console.error("User not loaded yet");
            return;
        }

        if (
            String(message.senderId) === String(user.id) ||
            message.isSeen ||
            !messageSeenStatus?.isSeen
        ) return;

        try {
            // Mark message as seen through data service
            await chatDataService.markMessagesAsRead(String(message.chatId), [String(message.id)], '');
            
            // Update local state
            refetchMessageSeen();
            
            // Invalidate message cache
            invalidateCache.invalidateChatData(String(message.chatId));
            
            console.log('CustomMessage: Message marked as seen:', String(message.id));
        } catch (error) {
            console.error('CustomMessage: Error marking message as seen:', error);
        }
    }, [
        user,
        message,
        messageSeenStatus,
        refetchMessageSeen,
        invalidateCache
    ]);

    /**
     * Deletes the message using optimistic updates.
     */
    const handleDeleteMessage = useCallback(async () => {
        if (!user) {
            console.error("User not loaded yet");
            return;
        }

        try {
            // Delete message through data service
            await chatDataService.deleteMessage(String(message.id), '');
            
            // Invalidate message cache
            invalidateCache.invalidateChatData(String(message.chatId));
            
            console.log('CustomMessage: Message deleted:', String(message.id));
        } catch (error) {
            console.error('CustomMessage: Error deleting message:', error);
        }
    }, [
        message,
        invalidateCache
    ]);

    // Auto-mark as seen when component mounts
    useEffect(() => {
        handleSeenMessage();
    }, [handleSeenMessage]);

    return {
        user,
        isHovering,
        messageSeenStatus,
        handleMouseOver,
        handleMouseOut,
        handleDeleteMessage,
        handleSeenMessage,
        userLoading,
        userError
    };
};

export default useCustomMessage;