import chatQueries from "@features/chat/data/queries/chatQueries";
import useUserQueries from "@/core/network/api/queries/userQueries";
import { ChatResponse, MessageResponse } from "@/features/chat/data/models/chat";
import { UserResponse } from "@/features/profile/data/models/user";
import { useGetChats } from "@features/chat/data/useChatData";
import { useQueryUsers } from "@features/profile/data";
import React, { useRef, useState } from "react";
import useNavigation from "../shared/useNavigation";

/**
 * useChatQuery hook.
 * 
 * This hook manages chat-related functionalities, including creating new chats, 
 * querying users, and handling user input for chat search. It provides methods 
 * for sending messages and managing chat state.
 * 
 * @returns {Object} - An object containing the current state, functions for 
 *                     handling chat creation, user querying, and input events.
 */
const useChatQuery = () => {
    const { getSignedUserElseThrow } = useUserQueries();
    const user = getSignedUserElseThrow(); // Get the signed-in user
    const { navigatePath } = useNavigation(); // Navigation utility
    const { insertMessageCache, insertInitChatCache } = chatQueries(); // Cache management for chats
    const { data: chats, isLoading, isError } = useGetChats(); // Fetch chat data

    // Local state management
    const [focused, setFocused] = useState(false); // Input focus state
    const [queryResult, setQueryResult] = useState<UserResponse[]>([]); // Search results for user queries
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state for queries

    /**
     * Handles the creation of a new chat with a selected user.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by chat creation.
     * @param {UserResponse} clickedUser - The user with whom to initiate the chat.
     * @throws {Error} Throws an error if chats have not loaded.
     */
    const handleChatCreation = async (event: React.MouseEvent, clickedUser: UserResponse) => {
        event.preventDefault();

        // Ensure chats data is loaded
        if (isLoading || isError) {
            throw new Error("Chats have not loaded");
        }

        // Check if the chat already exists
        const isExistingChat = chats?.some(chat =>
            chat.members.some(member => member.id === clickedUser.id)
        );

        if (isExistingChat) return; // Exit if chat already exists

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
            createDate: String(new Date()),
            userIds: [user.id, clickedUser.id],
            recentMessage: newMessage,
            members: [user, clickedUser],
            updateDate: String(new Date()),
            version: 1
        };

        // Cache the new message and chat
        insertMessageCache(newMessage);
        insertInitChatCache(newChat);
        navigatePath("-1"); // Navigate to the new chat
    };

    const makeQueryMutation = useQueryUsers(setQueryResult); // Hook for querying users

    /**
     * Handles user query submissions.
     * 
     * @param {string} value - The search term for querying users.
     */
    const handleQuerySubmit = async (value: string) => {
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);
        makeQueryMutation.mutate(value); // Trigger user query
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
        makeQueryMutation,
    };
};

export default useChatQuery;