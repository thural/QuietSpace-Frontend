/**
 * Custom Chat Query Hook
 * 
 * This hook manages chat-related functionalities using the custom query system.
 * It provides methods for creating new chats, querying users, and handling user input 
 * for chat search with enterprise-grade caching and optimistic updates.
 */

import { useCustomQuery } from '@/core/hooks';
import { useCustomMutation } from '@/core/hooks';
import { ChatResponse, MessageResponse } from "@/features/chat/data/models/chat";
import { UserResponse } from "@/features/profile/data/models/user";
import { useChatServices } from './useChatServices';
import { useCacheInvalidation } from '@/core/hooks/migrationUtils';
import { CHAT_CACHE_KEYS } from '@chat/data/cache/ChatCacheKeys';
import { CACHE_TIME_MAPPINGS } from '@/core/hooks/migrationUtils';
import { useAuthStore } from "@core/store/zustand";
import React, { useRef, useState } from "react";
import useNavigation from "@/shared/hooks/useNavigation";

/**
 * useCustomChatQuery hook.
 * 
 * This hook manages chat-related functionalities with enterprise features.
 * 
 * @returns {Object} - An object containing the current state, functions for 
 *                     handling chat creation, user querying, and input events.
 */
const useCustomChatQuery = () => {
    const { chatDataService, chatFeatureService } = useChatServices();
    const invalidateCache = useCacheInvalidation();
    const { navigatePath } = useNavigation(); // Navigation utility

    // Get signed user with custom query
    const { data: user, isLoading: userLoading, error: userError } = useCustomQuery(
        ['user', 'signed-in'],
        async () => {
            // Get user from auth store
            const authStore = useAuthStore.getState();
            const authData = authStore.data;
            
            if (!authData || !authData.user) {
                throw new Error('User not authenticated');
            }
            
            return authData.user;
        },
        {
            staleTime: CACHE_TIME_MAPPINGS.USER_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.USER_CACHE_TIME,
            enabled: true, // Always try to get user
            onSuccess: (data) => {
                console.log('CustomChatQuery: User loaded:', data.id);
            },
            onError: (error) => {
                console.error('CustomChatQuery: Error loading user:', error);
            }
        }
    );

    // Get chats with custom query
    const { data: chats, isLoading: chatsLoading, error: chatsError } = useCustomQuery(
        ['chats', user?.id],
        async () => {
            if (!user) return { content: [] };
            // Get token from auth store
            const authStore = useAuthStore.getState();
            const token = authStore.data.accessToken || '';
            return await chatDataService.getChats(user.id, token);
        },
        {
            enabled: !!user,
            staleTime: CACHE_TIME_MAPPINGS.CHAT_STALE_TIME,
            cacheTime: CACHE_TIME_MAPPINGS.CHAT_CACHE_TIME,
            onSuccess: (data) => {
                console.log('CustomChatQuery: Chats loaded:', { 
                    userId: user.id, 
                    count: data.content?.length || 0 
                });
            },
            onError: (error) => {
                console.error('CustomChatQuery: Error loading chats:', error);
            }
        }
    );

    // Local state management
    const [focused, setFocused] = useState(false); // Input focus state
    const [queryResult, setQueryResult] = useState<UserResponse[]>([]); // Search results for user queries
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state for queries

    // Combined loading and error states
    const isLoading = userLoading || chatsLoading;
    const error = userError || chatsError;

    /**
     * Handles the creation of a new chat with a selected user using custom query system.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by chat creation.
     * @param {UserResponse} clickedUser - The user with whom to initiate the chat.
     * @throws {Error} Throws an error if user or chats have not loaded.
     */
    const handleChatCreation = async (event: React.MouseEvent, clickedUser: UserResponse) => {
        event.preventDefault();

        // Ensure user and chats data are loaded
        if (!user || isLoading || error) {
            throw new Error("User or chats have not loaded");
        }

        // Check if the chat already exists
        const isExistingChat = chats?.content?.some(chat =>
            chat.members?.some(member => member.id === clickedUser.id)
        );

        if (isExistingChat) {
            // Navigate to existing chat
            const existingChat = chats.content.find(chat =>
                chat.members?.some(member => member.id === clickedUser.id)
            );
            if (existingChat) {
                navigatePath(String(existingChat.id));
            }
            return; // Exit if chat already exists
        }

        // Create a new message object
        const newMessage: MessageResponse = {
            id: crypto.randomUUID(),
            createDate: String(new Date()),
            updateDate: String(new Date()),
            chatId: "-1",
            senderId: user.id,
            version: 1,
            recipientId: clickedUser.id,
            text: "Opened new chat",
            isSeen: true,
            senderName: user.username
        };

        // Create a new chat object
        const newChat: ChatResponse = {
            id: "-1",
            userIds: [user.id, clickedUser.id],
            members: [
                { id: user.id, username: user.username, email: user.email },
                { id: clickedUser.id, username: clickedUser.username, email: clickedUser.email }
            ],
            recentMessage: newMessage,
            createDate: String(new Date()),
            updateDate: String(new Date()),
            version: 1
        };

        // Create chat with optimistic updates
        createChatMutation.mutate({
            isGroupChat: false,
            recipientId: clickedUser.id,
            text: newMessage.text,
            userIds: [user.id, clickedUser.id]
        });
    };

    // Create chat mutation with optimistic updates
    const createChatMutation = useCustomMutation(
        async (chatData: any) => {
            // Get token from auth store
            const authStore = useAuthStore.getState();
            const token = authStore.data.accessToken || '';
            return await chatFeatureService.createChatWithValidation(chatData, token);
        },
        {
            onSuccess: (data) => {
                console.log('CustomChatQuery: Chat created successfully:', data.id);
                navigatePath(String(data.id));
            },
            onError: (error) => {
                console.error('CustomChatQuery: Error creating chat:', error);
            },
            optimisticUpdate: (cache, variables) => {
                const optimisticChat: ChatResponse = {
                    id: `temp-${Date.now()}`,
                    userIds: [user?.id || '', variables.recipientId],
                    members: [
                        { id: user?.id || '', username: user?.username || 'You', email: user?.email || '' },
                        { id: variables.recipientId, username: 'User', email: '' }
                    ],
                    recentMessage: {
                        id: `temp-msg-${Date.now()}`,
                        chatId: '',
                        senderId: user?.id || '',
                        recipientId: variables.recipientId,
                        text: variables.text,
                        isSeen: true,
                        senderName: user?.username || 'You',
                        createDate: new Date().toISOString(),
                        updateDate: new Date().toISOString(),
                        version: 1
                    },
                    createDate: new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    version: 1
                };
                
                const cacheKey = CHAT_CACHE_KEYS.USER_CHATS(user?.id || '');
                const existingChats = cache.get<any>(cacheKey) || { content: [] };
                cache.set(cacheKey, {
                    ...existingChats,
                    content: [optimisticChat, ...existingChats.content]
                });
                
                return () => {
                    const updatedChats = cache.get<any>(cacheKey) || { content: [] };
                    const filtered = updatedChats.content.filter((chat: any) => chat.id !== optimisticChat.id);
                    cache.set(cacheKey, { ...updatedChats, content: filtered });
                };
            },
            retry: 2,
            retryDelay: 1000
        }
    );

    // User query mutation
    const userQueryMutation = useCustomMutation(
        async (query: string) => {
            // Use a proper user search service or API call
            // For now, we'll throw an error to indicate this needs implementation
            throw new Error('User search service not implemented. Please integrate with user service or API.');
            
            // Future implementation would look like:
            // return await userService.searchUsers(query);
        },
        {
            onSuccess: (data, variables) => {
                console.log('CustomChatQuery: User query completed:', { query: variables, results: data.length });
                setQueryResult(data);
            },
            onError: (error) => {
                console.error('CustomChatQuery: Error querying users:', error);
                setQueryResult([]); // Clear results on error
            },
            retry: 1, // Only retry once for user queries
            retryDelay: 1000
        }
    );

    /**
     * Handles user query submissions.
     * 
     * @param {string} value - The search term for querying users.
     */
    const handleQuerySubmit = async (value: string) => {
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);
        userQueryMutation.mutate(value);
        setTimeout(() => { setIsSubmitting(false); }, 1000); // Reset submission state
    };

    /**
     * Handles changes in the input field for user queries.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the input.
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value; // Get input value
        setFocused(true); // Set input focus state
        if (value.length) {
            handleQuerySubmit(value); // Submit query if input is not empty
        } else {
            setQueryResult([]); // Clear results if input is empty
        }
    };

    // Input event handlers
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') setFocused(false); // Close input on Escape
    };

    const handleInputFocus = () => setFocused(true); // Focus input

    // Refs for managing focus and input
    const resultListRef = useRef<HTMLDivElement>(null);
    const handleInputBlur = (event: React.FocusEvent) => {
        if (resultListRef.current && resultListRef.current.contains(event.relatedTarget as Node)) {
            return; // Prevent losing focus if clicking inside results
        }
        setFocused(false); // Otherwise, lose focus
    };

    const searchInputRef = useRef(null); // Ref for the search input
    const appliedStyle = focused ? { display: 'flex' } : { display: 'none' }; // Conditional styling for visibility
    const inputProps = { handleInputFocus, handleInputBlur, handleKeyDown, handleInputChange, searchInputRef, resultListRef };

    return {
        focused,
        queryResult,
        isSubmitting,
        handleChatCreation,
        handleQuerySubmit,
        appliedStyle,
        inputProps,
        makeQueryMutation: userQueryMutation,
        createChatLoading: createChatMutation.isLoading,
        user,
        chats: chats?.content || []
    };
};

export default useCustomChatQuery;